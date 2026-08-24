# MARRA Community Hub

Public contribution mirror for the MARRA Community Hub website, a community
centre growing in Caulfield South.

Live site: **[marrahub.com.au](https://marrahub.com.au)**

Open source — contributions welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).
Reviewed changes here are promoted to the production repository separately; see
[docs/PROMOTING.md](./docs/PROMOTING.md).

## Overview

The site includes:

- community programs, volunteering, impact and governance pages
- a Discover directory backed by the public MARRA Hub API
- event detail pages and build-time prerendering for search engines
- optional contact and volunteer-agreement integrations
- a small Cloudflare Worker that serves static assets and proxies Discover data

## Stack

- React 18 + React Router 7 (lazy-loaded routes)
- Vite 6 + TypeScript
- Tailwind CSS 4
- Cloudflare Workers and Wrangler
- Motion (animations) and Lucide (icons)

## Development

Prerequisites: **Node.js 22+** and npm.

```bash
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm test` | Run the frontend contract tests |
| `npm run typecheck` | Type-check the browser app and Worker |
| `npm run lint` | Run ESLint |
| `npm run build` | Build the client and Worker, prerender routes and generate SEO files |
| `npm run preview` | Build and serve the result through Wrangler |
| `npm run verify -- <url>` | Run HTTP, SEO and asset checks against a deployed URL |

## Configuration and deployment

The build writes browser assets to `dist/client/`; Wrangler packages the Worker
from `worker/index.ts`. The Worker name in this mirror is `marrahub-oss` so a
volunteer deployment cannot accidentally target the production project by name.

Copy [.env.production.example](./.env.production.example) or
[.env.example](./.env.example) into an ignored local file and supply your own
provider values. This repository intentionally contains no production form
endpoint, analytics token, Turnstile site key or volunteer API URL.

See [docs/PREVIEW_DEPLOYS.md](./docs/PREVIEW_DEPLOYS.md) for an optional
Cloudflare preview and [docs/PROMOTING.md](./docs/PROMOTING.md) for the separate
production promotion process.

## Project structure

```text
api/                  # optional volunteer-agreement Azure Function
public/               # images, fonts, security headers and static files
scripts/              # SEO/prerender and deployment verification scripts
src/app/pages/        # public website pages
src/app/seo/          # shared SEO configuration
tests/                # frontend contract tests
worker/               # Cloudflare Worker and Discover proxy
```

## Security notes

- Never commit passwords, tokens, private tenant values or provider secrets.
- `VITE_*` variables are compiled into the public client bundle and cannot hold
  secrets.
- Public-but-environment-specific values are placeholders in this mirror and
  belong in the volunteer's hosting settings.
- If you change the inline redirect script in `index.html`, recompute its CSP
  hash as described in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © Marra Community Hub Incorporated
