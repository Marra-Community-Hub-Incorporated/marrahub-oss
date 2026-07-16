# MARRA Community Hub

Public website for MARRA Community Hub, a community centre growing in Caulfield South.

Live site: **[marrahub.com.au](https://marrahub.com.au)**

Open source — contributions welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).
Reviewed changes here get promoted to the production site separately — see
[docs/PROMOTING.md](./docs/PROMOTING.md).

## Overview

A React + Vite single-page website focused on:

- community programs and future initiatives
- impact and governance information
- contact and enquiry handling
- SEO-friendly public pages and metadata

## Stack

- React 18 + React Router 7 (routes are lazy-loaded / code-split)
- Vite 6 + TypeScript
- Tailwind CSS 4
- Motion (animations) · Lucide (icons)
- Contact form via Formspree, spam protection via Cloudflare Turnstile

## Development

Prerequisites: **Node.js 18+** and npm.

```bash
npm install
npm run dev        # dev server with hot reload
```

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                             |
| `npm run build`   | Production build to `dist/` + generate SEO metadata   |
| `npm run preview` | Serve the production build locally to sanity-check it |

## Deployment

Hosted on **Cloudflare Pages**, which **auto-deploys on every push to `main`**.

- Build command: `npm run build`
- Output directory: `dist`
- Production URL is set in [.env.production](./.env.production) (used for SEO
  metadata and sitemap generation)

Security and cache headers are defined in [`public/_headers`](./public/_headers)
(CSP, HSTS, clickjacking protection, plus long-lived caching for hashed assets).

## Project structure

```text
public/
  _headers           # Cloudflare Pages: security headers + caching
  media/             # images, favicons
  404.html           # SPA deep-link fallback
  robots.txt
src/
  main.tsx           # app entry
  app/
    App.tsx          # RouterProvider
    routes.ts        # routes (pages lazy-loaded)
    Layout.tsx       # shared header + footer
    pages/           # Home, About, Programs, Impact, Governance, Contact, NotFound
    components/      # Button, Header, Footer, cards, SEO helper…
    seo/             # SEO config
  styles/            # Tailwind entry + theme + fonts
scripts/
  seo-build.mjs      # post-build: injects JSON-LD / meta tags
```

## Security notes

- No private API secrets are stored in this repository.
- The Formspree endpoint and Cloudflare Turnstile **site key** are public
  frontend values by design. Secret keys live only in the provider dashboards
  and must never be committed.
- Anything prefixed `VITE_` is **baked into the public client bundle** — never
  put a secret in a `VITE_` variable.
- The Content-Security-Policy in `public/_headers` allows the inline
  SPA-redirect script by an exact `sha256` hash. If you edit that script in
  `index.html`, recompute the hash (see [CONTRIBUTING.md](./CONTRIBUTING.md)) or
  deep links will silently break under CSP.

## License

[MIT](./LICENSE) © Marra Community Hub Incorporated
