// Deployment-specific configuration for the volunteer-agreement feature.
//
// Everything here is driven by Vite env vars (VITE_*) with sensible local
// defaults, so the whole feature folder can be lifted into the Hub SaaS and
// pointed at a different backend / Turnstile key WITHOUT touching code —
// just set the env vars in the new project.
//
//   VITE_VOLUNTEER_API_URL   the backend endpoint that receives signed agreements
//   VITE_TURNSTILE_SITE_KEY  Cloudflare Turnstile site key (public)
//
// See .env.example at the repo root.

export const volunteerAgreementConfig = {
  // Azure Function (or any HTTP endpoint) that accepts the signed submission.
  // Defaults to a locally-running Azure Functions host for development.
  submitEndpoint:
    (import.meta.env.VITE_VOLUNTEER_API_URL as string | undefined) ??
    'http://localhost:7071/api/volunteer-agreement',

  // Public Turnstile site key. Defaults to the existing MARRA key.
  turnstileSiteKey:
    (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ??
    '0x4AAAAAACksijQmW93tasP6',

  // Bump this whenever the agreement text changes, so each signed record
  // captures exactly which version the volunteer agreed to.
  agreementVersion: '2026-06',
};
