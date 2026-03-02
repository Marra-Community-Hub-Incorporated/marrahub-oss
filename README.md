# MARRA Community Hub

Public website for MARRA Community Centre.

Live site:
- `https://marrahub.com.au`

## Overview

MARRA Community Hub is a React and Vite website for a family-founded community centre growing in Caulfield South. The site focuses on:

- community programs and future initiatives
- impact and governance information
- contact and enquiry handling
- SEO-friendly public pages and metadata

## Stack

- React 18
- Vite
- TypeScript
- React Router
- Tailwind CSS
- Lucide icons
- Motion

## Features

- SEO-focused page metadata, canonicals, JSON-LD, `robots.txt`, and `sitemap.xml`
- GitHub Pages-friendly deep route fallbacks for public pages
- Contact form integrated with Formspree
- Cloudflare Turnstile on the enquiry form
- Custom favicon and organization branding

## Development

Prerequisites:
- Node.js 18+
- npm

Run locally:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Deployment

This repository is deployed with GitHub Pages through the workflow in [deploy.yml](./.github/workflows/deploy.yml).

The production site URL is configured in:
- [.env.production](./.env.production)

That value is used for SEO metadata and sitemap generation.

## Project Structure

```text
src/
  app/
    components/
    pages/
    seo/
    routes.ts
    Layout.tsx
    App.tsx
  styles/
  main.tsx
public/
  media/
  404.html
  robots.txt
scripts/
  seo-build.mjs
```

## Security Notes

- The repository does not store private API secrets for the contact form.
- Formspree uses a public form endpoint on the frontend.
- Cloudflare Turnstile uses a public site key on the frontend.
- Secret keys must stay only in the provider dashboards and must never be committed.

## License

See [LICENSE](./LICENSE).
