'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  readJsonWithLimit,
  validatePdfBase64,
  rateLimitKeys,
  consumeAgreementRateLimit,
} = require('../src/lib/agreementSecurity');

test('bounded reader rejects declared and streamed oversized bodies before JSON parsing', async () => {
  const declared = new Request('https://example.test', { method: 'POST', headers: { 'content-length': '100' }, body: '{}' });
  assert.equal((await readJsonWithLimit(declared, 10)).status, 413);
  const streamed = new Request('https://example.test', { method: 'POST', body: '01234567890' });
  assert.equal((await readJsonWithLimit(streamed, 10)).status, 413);
});

test('PDF validation rejects non-PDF, active content, and bytes after EOF', () => {
  const encode = (value) => Buffer.from(value, 'latin1').toString('base64');
  assert.equal(validatePdfBase64(encode('not pdf')).ok, false);
  assert.equal(validatePdfBase64(encode('%PDF-1.7\n/JavaScript\nstartxref\n1\n%%EOF')).ok, false);
  assert.equal(validatePdfBase64(encode('%PDF-1.7\nstartxref\n1\n%%EOF\nZIP')).ok, false);
  assert.equal(validatePdfBase64(encode('%PDF-1.7\n1 0 obj\nendobj\nstartxref\n1\n%%EOF')).ok, true);
});

// The site builds its agreements with jsPDF, which always writes a view destination
// ("/OpenAction [3 0 R /FitH null]") into the catalog. An earlier revision of the
// validator treated the bare /OpenAction keyword as active content and so rejected every
// real submission, which is what this case pins down.
test('PDF validation accepts a jsPDF-shaped view destination but not an action', () => {
  const encode = (value) => Buffer.from(value, 'latin1').toString('base64');
  const pdf = (catalog) => encode(`%PDF-1.3\n1 0 obj\n<<\n/Type /Catalog\n${catalog}\n>>\nendobj\nstartxref\n9\n%%EOF`);
  assert.equal(validatePdfBase64(pdf('/OpenAction [3 0 R /FitH null]')).ok, true);
  assert.equal(validatePdfBase64(pdf('/OpenAction 12 0 R')).ok, false);
  assert.equal(validatePdfBase64(pdf('/OpenAction << /S /GoTo /D [3 0 R /Fit] >>')).ok, false);
});

test('rate keys cap each source and the global workflow bucket', () => {
  assert.deepEqual(rateLimitKeys('192.0.2.1', new Date('2026-08-18T04:20:00Z')).map(({ key, limit, bucket }) => ({ key: key.startsWith('ip-') ? 'ip' : key, limit, bucket })), [
    { key: 'ip', limit: 5, bucket: '2026-08-18T04' },
    { key: 'global', limit: 100, bucket: '2026-08-18T04' },
  ]);
});

test('durable rate limiting fails closed after repeated optimistic concurrency conflicts', async () => {
  let updateAttempts = 0;
  const client = {
    createTable: async () => {},
    getEntity: async () => ({ partitionKey: 'bucket', rowKey: 'ip', count: 0, etag: 'stale' }),
    updateEntity: async () => {
      updateAttempts += 1;
      throw Object.assign(new Error('precondition failed'), { statusCode: 412 });
    },
  };

  await assert.rejects(
    consumeAgreementRateLimit(
      'UseDevelopmentStorage=true',
      '192.0.2.1',
      new Date('2026-08-18T04:20:00Z'),
      () => client,
    ),
    /retry budget/,
  );
  assert.equal(updateAttempts, 8);
});
