'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readJsonWithLimit, validatePdfBase64, rateLimitKeys } = require('../src/lib/agreementSecurity');
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
test('rate keys cap each source and the global workflow bucket', () => {
  assert.deepEqual(rateLimitKeys('192.0.2.1', new Date('2026-08-18T04:20:00Z')).map(({ key, limit, bucket }) => ({ key: key.startsWith('ip-') ? 'ip' : key, limit, bucket })), [
    { key: 'ip', limit: 5, bucket: '2026-08-18T04' }, { key: 'global', limit: 100, bucket: '2026-08-18T04' },
  ]);
});
