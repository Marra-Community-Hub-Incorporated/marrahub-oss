# Project Documentation

`marrahub-oss` is the public volunteer/contributor repository for the MARRA
Community Hub website.

## What Is In This Repo

- React 18 + Vite 6 + TypeScript website.
- Tailwind CSS 4 styling and local design tokens under `src/styles/`.
- Static pages for Home, About, Programs, Impact, Governance, Contact, and
  volunteer agreement flow.
- Build-time SEO metadata generation in `scripts/seo-build.mjs`.
- Optional backend under `api/`: a Node Azure Function that receives signed
  volunteer agreements and can send them through Microsoft Graph.
- CI under `.github/workflows/ci.yml`: gitleaks secret scan, website build, and
  API syntax checks.

## Public Repo Safety Model

This repository must be safe for public GitHub and new volunteers:

- No passwords, login credentials, private tokens, provider secrets, private
  storage keys, private tenant IDs, or production authorization values belong in
  git.
- Real production values must be set in Cloudflare Pages, Azure Function App
  settings, Microsoft Entra, Formspree, Cloudflare Turnstile, or other provider
  dashboards.
- `VITE_*` variables are browser-visible. They are not suitable for secrets.
- `.env`, `.env.local`, `.env.production`, `.dev.vars*`, and
  `api/local.settings.json` are ignored.
- `.env.example`, `.env.production.example`, and
  `api/local.settings.json.example` are templates only.

## Local Setup

```bash
npm install
npm run dev
```

For the optional volunteer agreement backend:

```bash
cd api
npm install
npm start
```

Copy example files only when you need local integration testing:

```bash
cp .env.example .env.local
cp .env.production.example .env.production
cp api/local.settings.json.example api/local.settings.json
```

Fill local files with your own development values. Do not commit those files.

## Configuration

Website environment variables:

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Reserved for environment-specific tooling. Note: the SEO metadata and sitemap use the `siteUrl` hardcoded in `src/app/seo/site.ts` **and** `scripts/seo-build.mjs` — edit both together |
| `VITE_FORMSPREE_ENDPOINT` | Optional contact form endpoint |
| `VITE_CONTACT_TURNSTILE_SITE_KEY` | Optional public Turnstile site key for contact form |
| `VITE_VOLUNTEER_API_URL` | Optional volunteer agreement backend endpoint |
| `VITE_TURNSTILE_SITE_KEY` | Optional public Turnstile site key for volunteer agreement |
| `VITE_VOLUNTEER_ENABLED` | Enables the public volunteer agreement route and links |

Backend settings:

| Setting | Purpose |
|---|---|
| `TENANT_ID` | Microsoft Entra directory tenant id |
| `CLIENT_ID` | Entra app registration client id |
| `CLIENT_SECRET` | Entra app registration secret; never commit |
| `GRAPH_SENDER` | Mailbox used to send signed agreements |
| `NOTIFY_RECIPIENT` | Organisation-controlled recipient mailbox or comma-separated list |
| `TURNSTILE_SECRET` | Required server-side Turnstile secret; missing configuration fails closed |
| `ALLOWED_ORIGINS` | Required CORS allowlist; missing configuration rejects requests |
| `SHAREPOINT_ENABLED` | Enables optional SharePoint upload |
| `SHAREPOINT_SITE_ID` | Optional SharePoint site id |
| `SHAREPOINT_FOLDER` | Optional destination folder |
| `AzureWebJobsStorage` | Required Azure Functions storage and durable rate-limit counters |

The volunteer endpoint accepts the source address only from Azure App Service's
`x-client-ip` header. It deliberately ignores caller-controlled forwarding
headers; requests without the trusted header share the conservative `unknown`
rate-limit bucket.

## Validation

Run these before submitting a PR:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm ci --prefix api
node --test api/test/*.test.js
node --check api/src/functions/volunteerAgreement.js
node --check api/src/lib/agreementSecurity.js
node --check api/src/lib/graph.js
node --check api/src/lib/turnstile.js
```

CI also runs a full-history gitleaks scan on GitHub. If it flags a real secret,
rotate the secret and remove it from history before merging.
