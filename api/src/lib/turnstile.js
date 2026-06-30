'use strict';

// Server-side verification of a Cloudflare Turnstile token. The browser only
// proves it solved the challenge; this confirms it with Cloudflare using the
// secret key, which must never be exposed to the client.
async function verifyTurnstile(secret, token, remoteIp) {
  if (!token) return false;

  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (remoteIp) form.append('remoteip', remoteIp);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    return Boolean(data && data.success);
  } catch {
    return false;
  }
}

module.exports = { verifyTurnstile };
