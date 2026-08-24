'use strict';

const MAX_PDF_BYTES = 6 * 1024 * 1024;
const ACTIVE_PDF_MARKERS = [
  '/JavaScript',
  '/JS',
  '/Launch',
  '/EmbeddedFile',
  '/Filespec',
  '/AA',
  '/RichMedia',
  '/XFA',
  '/AcroForm',
  '/URI',
  '/GoToR',
  '/SubmitForm',
  '/ImportData',
  '/Rendition',
  '/Movie',
  '/Sound',
  '/Collection',
  '/FDF',
  '/U3D',
  '/PRC',
  '/3D',
  '/Screen',
];
// The browser's jsPDF builder emits a deliberately narrow, uncompressed PDF
// profile. Refuse syntax that can hide names or objects from the raw-byte
// checks below. This is an allow-profile boundary, not a general PDF scanner.
const UNSUPPORTED_PDF_SYNTAX = ['/Filter', '/ObjStm', '/XRef', '/Encrypt'];
// /OpenAction is not on that list because jsPDF writes a benign view destination —
// "/OpenAction [3 0 R /FitH null]" — into the catalog of every agreement the site
// generates. Only that destination-array form is allowed.
const OPEN_ACTION = /\/OpenAction/g;
const OPEN_ACTION_DESTINATION = /\/OpenAction\s*\[/g;

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function hasEscapedPdfName(text) {
  const names = text.matchAll(/\/([^\s<>{}\[\]()%/]+)/g);
  return Array.from(names).some((match) => /#[0-9a-f]{2}/i.test(match[1]));
}

function validatePdfBase64(pdfBase64) {
  if (typeof pdfBase64 !== 'string' || !pdfBase64.trim()) {
    return { ok: false, error: 'Missing or invalid field: pdfBase64' };
  }
  const normalized = pdfBase64.replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    return { ok: false, error: 'Invalid PDF attachment encoding.' };
  }
  const buffer = Buffer.from(normalized, 'base64');
  if (buffer.length > MAX_PDF_BYTES) {
    return { ok: false, error: 'PDF attachment is too large.' };
  }
  const text = buffer.toString('latin1');
  if (!/^%PDF-1\.[0-7][\r\n]/.test(text) || !/startxref\s+\d+\s+%%EOF\s*$/.test(text)) {
    return { ok: false, error: 'Attachment is not a complete PDF.' };
  }
  if (
    text.indexOf('%PDF-', 1) !== -1 ||
    hasEscapedPdfName(text) ||
    UNSUPPORTED_PDF_SYNTAX.some((marker) => text.includes(marker)) ||
    ACTIVE_PDF_MARKERS.some((marker) => text.includes(marker))
  ) {
    return { ok: false, error: 'Active or polyglot PDF content is not accepted.' };
  }
  if (countMatches(text, OPEN_ACTION) !== countMatches(text, OPEN_ACTION_DESTINATION)) {
    return { ok: false, error: 'Active or polyglot PDF content is not accepted.' };
  }
  return { ok: true };
}

module.exports = { MAX_PDF_BYTES, validatePdfBase64 };
