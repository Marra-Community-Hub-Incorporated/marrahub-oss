# Project Documentation

`marrahub-oss` is the public volunteer and contributor repository for the MARRA
Community Hub website. It mirrors publicly shareable production code while
keeping production-only configuration and deployment authority out of Git.

## What is in this repository

- React 18, Vite 6 and TypeScript website.
- Tailwind CSS 4 styling and local design tokens under `src/styles/`.
- Pages for Home, Launch, About, Programs, Discover, event details, Impact,
  Governance, Contact and the optional volunteer-agreement flow.
- A Cloudflare Worker under `worker/` that serves assets and proxies the public
  Hub Discover API.
- SSR-assisted route prerendering and SEO generation in
  `scripts/seo-build.mjs`.
- An optional Node Azure Function under `api/` that receives signed volunteer
  agreements and can send them through Microsoft Graph.
- CI for gitleaks, frontend contracts, type checking, linting, builds and API
  security tests.

## Public repository safety model

- No passwords, credentials, private tokens, provider secrets, storage keys,
  private tenant IDs or production authorization values belong in Git.
- Real deployment values stay in Cloudflare, Azure, Entra, Formspree,
  Turnstile or another provider dashboard.
- `VITE_*` variables are browser-visible and cannot hold secrets.
- `.env`, `.env.local`, `.env.production`, `.dev.vars*` and
  `api/local.settings.json` are ignored.
- `.env.example`, `.env.production.example` and
  `api/local.settings.json.example` contain placeholders only.
- The mirror's Wrangler project name is `marrahub-oss`, separate from the live
  project.

## Local setup

```bash
npm install
npm run dev
```

For the optional volunteer-agreement backend:

```bash
cd api
npm install
npm start
```

Copy examples only when local integration testing needs them:

```bash
cp .env.example .env.local
cp .env.production.example .env.production
cp api/local.settings.json.example api/local.settings.json
```

Fill ignored files with your own development values and never commit them.

## Configuration

Website variables:

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Reserved for environment-specific tooling; canonical public SEO values live in `src/app/seo/site.ts` |
| `VITE_FORMSPREE_ENDPOINT` | Optional contact form endpoint |
| `VITE_CONTACT_TURNSTILE_SITE_KEY` | Optional public Turnstile site key for the contact form |
| `VITE_VOLUNTEER_API_URL` | Optional volunteer-agreement backend endpoint |
| `VITE_TURNSTILE_SITE_KEY` | Optional public Turnstile site key for volunteer agreements |
| `VITE_VOLUNTEER_ENABLED` | Enables the public volunteer route and links |

Backend settings:

| Setting | Purpose |
|---|---|
| `TENANT_ID` | Microsoft Entra directory tenant ID |
| `CLIENT_ID` | Entra app registration client ID |
| `CLIENT_SECRET` | Entra app registration secret; never commit |
| `GRAPH_SENDER` | Mailbox used to send signed agreements |
| `NOTIFY_RECIPIENT` | Organisation-controlled recipient mailbox list |
| `TURNSTILE_SECRET` | Required server-side Turnstile secret; missing configuration fails closed |
| `ALLOWED_ORIGINS` | Required CORS allowlist; missing configuration rejects requests |
| `SHAREPOINT_ENABLED` | Enables optional SharePoint upload |
| `SHAREPOINT_SITE_ID` | Optional SharePoint site ID |
| `SHAREPOINT_FOLDER` | Optional destination folder |
| `AzureWebJobsStorage` | Azure Functions storage and durable rate-limit counters |

The volunteer endpoint trusts the source address only from Azure App Service's
`x-client-ip` header and ignores caller-controlled forwarding headers. Requests
without it share the conservative `unknown` rate-limit bucket.

## Validation

Run before submitting a pull request:

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm ci --prefix api
npm test --prefix api
```

CI also performs a full-history gitleaks scan. If it finds a real secret, rotate
the secret and remove it from history before merging.

## Promotion

The OSS and production repositories have different trust boundaries. Promote a
reviewed, validated commit or a narrow patch; do not copy environment files or
merge the whole OSS branch into production. See
[docs/PROMOTING.md](./docs/PROMOTING.md).
