'use strict';

const { app } = require('@azure/functions');
const { verifyTurnstile } = require('../lib/turnstile');
const { getGraphToken, sendMailWithAttachment, uploadToSharePoint } = require('../lib/graph');
const { readJsonWithLimit, validatePdfBase64, consumeAgreementRateLimit } = require('../lib/agreementSecurity');

const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'phone',
  'area',
  'emergencyContact',
  'dietary',
  'signedName',
  'startDate',
  'signedDate',
  'agreementVersion',
  'signedAtIso',
  'signatureImage',
  'turnstileToken',
  'pdfBase64',
];

app.http('volunteerAgreement', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'volunteer-agreement',
  handler: async (request, context) => {
    const cors = corsHeaders(request.headers.get('origin') || '');
    if (!cors) {
      return json(403, { error: 'Cross-origin request is not allowed.' }, {});
    }

    if (request.method === 'OPTIONS') {
      return { status: 204, headers: cors };
    }

    const parsed = await readJsonWithLimit(request);
    if (parsed.error) return json(parsed.status, { error: parsed.error }, cors);
    const body = parsed.body;

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || typeof body[field] !== 'string') {
        return json(400, { error: `Missing or invalid field: ${field}` }, cors);
      }
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET;
    if (!turnstileSecret) {
      return json(500, { error: 'Security configuration missing: TURNSTILE_SECRET.' }, cors);
    }

    const ok = await verifyTurnstile(turnstileSecret, body.turnstileToken, clientIp(request));
    if (!ok) {
      return json(400, { error: 'Security verification failed. Please try again.' }, cors);
    }

    try {
      const allowed = await consumeAgreementRateLimit(process.env.AzureWebJobsStorage, clientIp(request));
      if (!allowed) return json(429, { error: 'Too many agreement submissions. Please try again later.' }, cors);
    } catch (err) {
      context.error('durable rate limit error:', err);
      return json(503, { error: 'Submission protection is temporarily unavailable.' }, cors);
    }

    const pdfValidation = validatePdfBase64(body.pdfBase64);
    if (!pdfValidation.ok) {
      return json(400, { error: pdfValidation.error }, cors);
    }

    let token;
    try {
      token = await getGraphToken();
    } catch (err) {
      context.error('Graph token error:', err);
      return json(500, { error: 'Server email configuration error.' }, cors);
    }

    const filename = `Marra-Volunteer-Agreement-${safe(body.fullName)}.pdf`;
    const sender = process.env.GRAPH_SENDER;
    const recipients = parseRecipientList(process.env.NOTIFY_RECIPIENT, sender);
    if (!recipients.length) {
      return json(500, { error: 'Server email configuration error.' }, cors);
    }

    // 1) Email the signed PDF to the organisation.
    try {
      await sendMailWithAttachment(token, {
        sender,
        to: recipients,
        subject: `Volunteer Agreement signed: ${body.fullName}`,
        html: buildEmailHtml(body),
        attachmentName: filename,
        attachmentBase64: body.pdfBase64,
      });
    } catch (err) {
      context.error('sendMail error:', err);
      return json(502, { error: 'Could not send the agreement email.' }, cors);
    }


    // 2) Optionally file it in SharePoint. Failure here does NOT fail the
    //    submission — the email already delivered the record.
    if (String(process.env.SHAREPOINT_ENABLED).toLowerCase() === 'true') {
      try {
        await uploadToSharePoint(token, {
          siteId: process.env.SHAREPOINT_SITE_ID,
          folderPath: process.env.SHAREPOINT_FOLDER || 'Volunteer Agreements',
          filename,
          base64: body.pdfBase64,
        });
      } catch (err) {
        context.error('SharePoint upload error (non-fatal):', err);
      }
    }

    return json(200, { ok: true }, cors);
  },
});

function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const isAllowed = allowed.length === 0 || allowed.includes(origin);
  if (!isAllowed) {
    return undefined;
  }
  const allowOrigin = allowed.length === 0 ? '*' : origin;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function parseRecipientList(rawRecipients, sender) {
  const fromEnv = (rawRecipients || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((candidate) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate));
  if (fromEnv.length) {
    return fromEnv;
  }
  if (sender && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
    return [sender];
  }
  return [];
}

function json(status, obj, headers) {
  return { status, headers: { 'Content-Type': 'application/json', ...headers }, jsonBody: obj };
}

function clientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    ''
  );
}

function safe(s) {
  return String(s).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Volunteer';
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEmailHtml(b) {
  const row = (k, v) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#5a5a5a">${k}</td>` +
    `<td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">
    <h2 style="color:#1e453a;margin:0 0 8px">Volunteer Agreement — Signed</h2>
    <p style="margin:0 0 16px">A new volunteer has signed the agreement. The signed PDF is attached.</p>
    <table style="border-collapse:collapse">
      ${row('Full name', b.fullName)}
      ${row('Email', b.email)}
      ${row('Phone', b.phone)}
      ${row('Start date', b.startDate || '—')}
      ${row('Preferred area', b.area)}
      ${row('Emergency contact', b.emergencyContact)}
      ${row('Dietary preference', b.dietary)}
      ${row('Allergies / needs', b.allergies || 'None provided')}
      ${row('Signed name', b.signedName)}
      ${row('Signed date', b.signedDate || '—')}
      ${row('Agreement version', b.agreementVersion || '—')}
    </table>
  </div>`;
}

// Friendly confirmation emailed to the volunteer (from GRAPH_SENDER) with a copy
// of their signed agreement attached. All interpolated values are escaped.
