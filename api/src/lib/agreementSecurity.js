'use strict';

const crypto = require('node:crypto');
const { TableClient } = require('@azure/data-tables');
const { MAX_PDF_BYTES, validatePdfBase64 } = require('./pdfValidation');

const MAX_REQUEST_BYTES = 9 * 1024 * 1024;

async function readJsonWithLimit(request, maxBytes = MAX_REQUEST_BYTES) {
  const encoding = (request.headers.get('content-encoding') || 'identity').toLowerCase();
  if (encoding !== 'identity') return { error: 'Compressed request bodies are not accepted.', status: 415 };
  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > maxBytes) return { error: 'Request body is too large.', status: 413 };
  if (!request.body?.getReader) return { error: 'A streaming request body is required.', status: 400 };

  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return { error: 'Request body is too large.', status: 413 };
    }
    chunks.push(Buffer.from(value));
  }
  try {
    return { body: JSON.parse(Buffer.concat(chunks, total).toString('utf8')) };
  } catch {
    return { error: 'Invalid JSON body.', status: 400 };
  }
}

function rateLimitKeys(ip, now = new Date()) {
  const bucket = now.toISOString().slice(0, 13);
  const ipHash = crypto.createHash('sha256').update(ip || 'unknown').digest('hex');
  return [{ key: `ip-${ipHash}`, limit: 5 }, { key: 'global', limit: 100 }].map((item) => ({ ...item, bucket }));
}

async function consumeAgreementRateLimit(
  connectionString,
  ip,
  now = new Date(),
  createClient = (value) => TableClient.fromConnectionString(value, 'VolunteerAgreementRateLimits'),
) {
  if (!connectionString) throw new Error('AzureWebJobsStorage is required for durable rate limiting.');
  const client = createClient(connectionString);
  await client.createTable().catch((error) => { if (error.statusCode !== 409) throw error; });
  for (const item of rateLimitKeys(ip, now)) {
    let updated = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const entity = await client.getEntity(item.bucket, item.key);
        if (Number(entity.count) >= item.limit) return false;
        await client.updateEntity({ ...entity, count: Number(entity.count) + 1 }, 'Replace', { etag: entity.etag });
        updated = true;
        break;
      } catch (error) {
        if (error.statusCode === 404) {
          try {
            await client.createEntity({ partitionKey: item.bucket, rowKey: item.key, count: 1 });
            updated = true;
            break;
          }
          catch (createError) { if (createError.statusCode === 409) continue; throw createError; }
        }
        if (error.statusCode === 412) continue;
        throw error;
      }
    }
    if (!updated) {
      throw new Error(`Rate-limit update contention exceeded the retry budget for ${item.key}.`);
    }
  }
  return true;
}

function clientIpFromHeaders(headers) {
  // Production posts directly to Azure Functions, so Cloudflare's
  // cf-connecting-ip header is attacker-controlled here. App Service's front
  // end supplies x-client-ip; if it is unavailable, deliberately collapse to
  // the shared "unknown" bucket instead of trusting arbitrary proxy metadata.
  return (headers.get('x-client-ip') || '').trim();
}

module.exports = {
  MAX_REQUEST_BYTES,
  MAX_PDF_BYTES,
  readJsonWithLimit,
  validatePdfBase64,
  rateLimitKeys,
  clientIpFromHeaders,
  consumeAgreementRateLimit,
};
