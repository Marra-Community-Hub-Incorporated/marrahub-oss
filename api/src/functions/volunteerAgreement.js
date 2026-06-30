'use strict';

const { app } = require('@azure/functions');
const { verifyTurnstile } = require('../lib/turnstile');
const { getGraphToken, sendMailWithAttachment, uploadToSharePoint } = require('../lib/graph');

const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'phone',
  'area',
  'emergencyContact',
  'dietary',
  'signedName',
  'pdfBase64',
];

// Max base64 length for the attached PDF (~8 MB encoded). Guards against abuse.
const MAX_PDF_BASE64 = 8 * 1024 * 1024;

app.http('volunteerAgreement', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'volunteer-agreement',
  handler: async (request, context) => {
    const cors = corsHeaders(request.headers.get('origin') || '');

    if (request.method === 'OPTIONS') {
      return { status: 204, headers: cors };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Invalid JSON body.' }, cors);
    }

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || typeof body[field] !== 'string') {
        return json(400, { error: `Missing or invalid field: ${field}` }, cors);
      }
    }

    if (body.pdfBase64.length > MAX_PDF_BASE64) {
      return json(413, { error: 'Attachment too large.' }, cors);
    }

    // Spam protection — only enforced when a Turnstile secret is configured.
    const turnstileSecret = process.env.TURNSTILE_SECRET;
    if (turnstileSecret) {
      const ok = await verifyTurnstile(turnstileSecret, body.turnstileToken, clientIp(request));
      if (!ok) {
        return json(400, { error: 'Security verification failed. Please try again.' }, cors);
      }
    }

    let token;
    try {
      token = await getGraphToken();
    } catch (err) {
      context.error('Graph token error:', err);
      return json(500, { error: 'Server email configuration error.' }, cors);
    }

    const filename = body.pdfFilename || `Marra-Volunteer-Agreement-${safe(body.fullName)}.pdf`;
    const sender = process.env.GRAPH_SENDER;
    const recipients = (process.env.NOTIFY_RECIPIENT || sender || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

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

    // 1b) Send the volunteer a thank-you confirmation with a copy of their
    //     signed agreement. Non-fatal: a bounce (e.g. a mistyped address) must
    //     not fail the submission — the org has already received the record.
    //     Skipped if CONFIRMATION_EMAIL_ENABLED is explicitly set to "false".
    if (String(process.env.CONFIRMATION_EMAIL_ENABLED || 'true').toLowerCase() !== 'false') {
      try {
        await sendMailWithAttachment(token, {
          sender,
          to: [body.email],
          subject: 'Thank you for volunteering with Marra Community Hub',
          html: buildConfirmationHtml(body),
          attachmentName: filename,
          attachmentBase64: body.pdfBase64,
        });
      } catch (err) {
        context.error('confirmation email error (non-fatal):', err);
      }
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
  const allowOrigin =
    allowed.length === 0 ? '*' : allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
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
function buildConfirmationHtml(b) {
  const firstName = esc((b.fullName || '').trim().split(/\s+/)[0] || 'there');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1c1c1c;line-height:1.6;max-width:560px;margin:0 auto">
    <div style="background:#1e453a;color:#ffffff;padding:20px 24px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:20px">Marra Community Hub</h1>
      <p style="margin:4px 0 0;opacity:0.85;font-size:13px">Volunteer Agreement</p>
    </div>
    <div style="border:1px solid #1e453a1f;border-top:none;padding:24px;border-radius:0 0 12px 12px">
      <p style="margin:0 0 14px">Hi ${firstName},</p>
      <p style="margin:0 0 14px">Thank you so much for signing up to volunteer with <strong>Marra Community Hub</strong>! We've received your signed Volunteer Agreement and we're thrilled to have you on board.</p>
      <p style="margin:0 0 14px">We'll be in touch soon with the next steps${b.area ? ` about <strong>${esc(b.area)}</strong>` : ''}. In the meantime, a copy of your signed agreement is attached for your records.</p>
      <p style="margin:0 0 14px">If you have any questions, just reply to this email &mdash; we're always happy to help.</p>
      <p style="margin:18px 0 0">With gratitude,<br/><strong>The Marra Community Hub Team</strong></p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:#666666;text-align:center">This is an automated confirmation from Marra Community Hub Incorporated &middot; marrahub.com.au</p>
  </div>`;
}
