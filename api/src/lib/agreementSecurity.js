'use strict';

const crypto = require('node:crypto');
const { TableClient } = require('@azure/data-tables');

const MAX_REQUEST_BYTES = 9 * 1024 * 1024;
const MAX_PDF_BYTES = 6 * 1024 * 1024;
const ACTIVE_PDF_MARKERS = ['/JavaScript', '/JS', '/Launch', '/EmbeddedFile', '/OpenAction', '/AA', '/RichMedia', '/XFA'];

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
  try { return { body: JSON.parse(Buffer.concat(chunks, total).toString('utf8')) }; }
  catch { return { error: 'Invalid JSON body.', status: 400 }; }
}

function validatePdfBase64(pdfBase64) {
  if (typeof pdfBase64 !== 'string' || !pdfBase64.trim()) return { ok: false, error: 'Missing or invalid field: pdfBase64' };
  const normalized = pdfBase64.replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return { ok: false, error: 'Invalid PDF attachment encoding.' };
  const buffer = Buffer.from(normalized, 'base64');
  if (buffer.length > MAX_PDF_BYTES) return { ok: false, error: 'PDF attachment is too large.' };
  const text = buffer.toString('latin1');
  if (!/^%PDF-1\.[0-7][\r\n]/.test(text) || !/startxref\s+\d+\s+%%EOF\s*$/.test(text)) return { ok: false, error: 'Attachment is not a complete PDF.' };
  if (text.indexOf('%PDF-', 1) !== -1 || ACTIVE_PDF_MARKERS.some((marker) => text.includes(marker))) return { ok: false, error: 'Active or polyglot PDF content is not accepted.' };
  return { ok: true };
}

function rateLimitKeys(ip, now = new Date()) {
  const bucket = now.toISOString().slice(0, 13);
  const ipHash = crypto.createHash('sha256').update(ip || 'unknown').digest('hex');
  return [{ key: `ip-${ipHash}`, limit: 5 }, { key: 'global', limit: 100 }].map((item) => ({ ...item, bucket }));
}

async function consumeAgreementRateLimit(connectionString, ip, now = new Date()) {
  if (!connectionString) throw new Error('AzureWebJobsStorage is required for durable rate limiting.');
  const client = TableClient.fromConnectionString(connectionString, 'VolunteerAgreementRateLimits');
  await client.createTable().catch((error) => { if (error.statusCode !== 409) throw error; });
  for (const item of rateLimitKeys(ip, now)) {
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const entity = await client.getEntity(item.bucket, item.key);
        if (Number(entity.count) >= item.limit) return false;
        await client.updateEntity({ ...entity, count: Number(entity.count) + 1 }, 'Replace', { etag: entity.etag });
        break;
      } catch (error) {
        if (error.statusCode === 404) {
          try { await client.createEntity({ partitionKey: item.bucket, rowKey: item.key, count: 1 }); break; }
          catch (createError) { if (createError.statusCode === 409) continue; throw createError; }
        }
        if (error.statusCode === 412) continue;
        throw error;
      }
    }
  }
  return true;
}

module.exports = { MAX_REQUEST_BYTES, readJsonWithLimit, validatePdfBase64, rateLimitKeys, consumeAgreementRateLimit };
