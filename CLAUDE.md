# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`marrahub-oss` is the public volunteer/contributor repository for the MARRA
Community Hub marketing website (React + Vite SPA). It is the OSS side of a
two-repo split: reviewed changes here get cherry-picked into a private
production repository separately (see [docs/PROMOTING.md](docs/PROMOTING.md)).
Because it's open to public contributors, it intentionally contains no
production secrets or credentials — see "Public repo safety model" below.

## Commands

```bash
npm install
npm run dev          # Vite dev server with hot reload
npm run build         # production build to dist/ + scripts/seo-build.mjs post-processing
npm run preview       # build, then serve it via `wrangler dev` locally
npm test              # node --test tests/*.test.mjs
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run deploy        # build, then `wrangler deploy` (Cloudflare)
```

Tests run with `npm test` (`node --test tests/*.test.mjs`); CI runs them as the
"Contract tests" step. Coverage is deliberately thin — the volunteer-agreement
contract test, plus `api/test/agreementSecurity.test.js` on the API side — so
validation is typecheck + lint + tests + a successful build.

The optional backend in `api/` (an Azure Function) is a separate Node project
with its own `package.json`, excluded from the website's `lint`/`typecheck`.
Validate it with:

```bash
cd api
npm install
npm start                                        # runs locally on :7071
node --check src/functions/volunteerAgreement.js
node --check src/lib/graph.js
node --check src/lib/turnstile.js
```

CI (`.github/workflows/ci.yml`) runs three required checks on every PR/push to
`main`: a full-history gitleaks secret scan, the website checks above
(typecheck + lint + build), and the API syntax checks. `main` auto-deploys to
Cloudflare Pages on every push, so all real work happens on branches + PRs.

## Architecture

**Routing & pages** — `src/main.tsx` renders `App.tsx`, which provides the
`react-router` data router built in `src/app/routes.ts`. `Layout.tsx` (header
+ footer) is the one eager route shell; every page under `src/app/pages/` is
lazy-loaded via dynamic `import()` so visitors only download the page they
navigate to. Keep new pages code-split the same way.

**Feature flags** — `src/app/featureFlags.ts` currently gates the
`/volunteer` route. It reads `VITE_VOLUNTEER_ENABLED` at build time and
defaults to on in dev / off in prod when unset. When the flag is off,
`routes.ts` still registers `/volunteer` but redirects it to `/contact` so old
links don't 404.

**SEO — two systems sharing one source of truth.** `src/app/seo/site.ts`
defines `siteConfig` and `pageSeoMap` (per-route title/description/keywords/
schema.org type). This feeds:
1. `src/app/components/Seo.tsx` — a runtime component that imperatively
   upserts `<meta>`/`<link>`/JSON-LD tags into `document.head` on every route
   change (for the client-rendered SPA).
2. `scripts/seo-build.mjs` — a build-time script (run after `vite build`) that
   injects static per-route meta tags/JSON-LD into the built HTML so crawlers
   that don't execute JS still see correct metadata.

The site URL is hardcoded independently in both `src/app/seo/site.ts` and
`scripts/seo-build.mjs` — if it ever changes, update both.

**Volunteer agreement feature** (`src/app/features/volunteer-agreement/`) is a
self-contained module: `SignaturePad.tsx` (capture), `agreementContent.ts`
(legal text), `buildAgreementPdf.ts` (renders a signed PDF via `jspdf`),
`useTurnstile.ts` (Cloudflare Turnstile captcha), and `submitAgreement.ts`
(POSTs to the optional Azure Function backend). `types.ts` defines
`VolunteerAgreementSubmission`, the JSON contract shared with `api/` — treat
it as the source of truth if the request/response shape needs to change on
either side.

**`api/`** is an independent Azure Function (Node) that receives a signed
volunteer agreement, emails it via Microsoft Graph, and can optionally file it
into SharePoint. It is not wired into the website's build/lint/typecheck. See
[api/README.md](api/README.md) for the Entra app registration / deployment
walkthrough — this endpoint's contract is meant to be reused as-is by a future
SaaS backend, so avoid changing it casually.

**Content-Security-Policy coupling** — `public/_headers` allow-lists the
inline SPA-redirect `<script>` in `index.html` by exact `sha256` hash. If that
inline script is edited, the hash must be recomputed (command in
[CONTRIBUTING.md](CONTRIBUTING.md)) or deep-link redirects silently break
under CSP. Any new external origin the site talks to (script/image/font/API)
must also be added to the matching CSP directive in `public/_headers`.

**`.design-sync/`** holds design-tool sync scaffolding (component previews,
conventions) and is excluded from the website's ESLint scope — it's not part
of the app's runtime code path.

## Public repo safety model

This is a public OSS repo, so:
- No passwords, tokens, provider secrets, tenant IDs, or production
  authorization values ever belong in git. Real values live in Cloudflare
  Pages / Azure Function App settings / Entra / Formspree / Turnstile
  dashboards.
- Anything prefixed `VITE_` is baked into the public client bundle at build
  time — never put a secret in a `VITE_` variable.
- `.env*`, `.dev.vars*`, and `api/local.settings.json` are git-ignored;
  `.env.example`, `.env.production.example`, and
  `api/local.settings.json.example` are templates only.
- CI's gitleaks job scans full git history on every push — a real secret
  merged into history must be rotated, not just deleted in a later commit.
