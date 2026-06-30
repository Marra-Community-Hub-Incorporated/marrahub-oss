'use strict';

// Thin Microsoft Graph helpers using the OAuth2 client-credentials flow
// (app-only). No SDK dependency — Node 20's global fetch is enough, which keeps
// the function tiny and easy to lift into the Hub SaaS later.

async function getGraphToken() {
  const tenant = requireEnv('TENANT_ID');
  const body = new URLSearchParams();
  body.append('client_id', requireEnv('CLIENT_ID'));
  body.append('client_secret', requireEnv('CLIENT_SECRET'));
  body.append('scope', 'https://graph.microsoft.com/.default');
  body.append('grant_type', 'client_credentials');

  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    body,
  });
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

// Sends an email from `sender` (a mailbox in your tenant) with one PDF attachment.
async function sendMailWithAttachment(token, { sender, to, subject, html, attachmentName, attachmentBase64 }) {
  const message = {
    subject,
    body: { contentType: 'HTML', content: html },
    toRecipients: to.map((address) => ({ emailAddress: { address } })),
    attachments: [
      {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: attachmentName,
        contentType: 'application/pdf',
        contentBytes: attachmentBase64,
      },
    ],
  };

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );
  if (!res.ok) {
    throw new Error(`sendMail failed: ${res.status} ${await res.text()}`);
  }
}

// Uploads the PDF into a SharePoint document library (the site's default drive).
async function uploadToSharePoint(token, { siteId, folderPath, filename, base64 }) {
  const buffer = Buffer.from(base64, 'base64');
  const encodedPath = `${folderPath}/${filename}`
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');

  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:/${encodedPath}:/content`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/pdf' },
    body: buffer,
  });
  if (!res.ok) {
    throw new Error(`SharePoint upload failed: ${res.status} ${await res.text()}`);
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required setting: ${name}`);
  return value;
}

module.exports = { getGraphToken, sendMailWithAttachment, uploadToSharePoint };
