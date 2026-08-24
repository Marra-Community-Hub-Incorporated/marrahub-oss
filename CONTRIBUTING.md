# Contributing

Thanks for your interest in improving the MARRA Community Hub website. This is
the public contribution mirror; contributions of all sizes are welcome.

## Getting set up

Prerequisites: **Node.js 22+** and npm.

```bash
git clone https://github.com/Marra-Community-Hub-Incorporated/marrahub-oss.git
cd marrahub-oss
npm install
npm run dev
```

You can also reopen the folder in the included development container.

## Your first contribution

Start with an unassigned
[good first issue](https://github.com/Marra-Community-Hub-Incorporated/marrahub-oss/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+no%3Aassignee).
Comment before starting so two people do not build the same change. If setup
fails, open an issue and say where it broke.

## Making changes

1. Create a branch from `main`, such as `fix/contact-typo` or
   `feat/events-page`.
2. Make the change and validate it:
   - `npm test` — frontend contract tests
   - `npm run typecheck` — browser app and Worker TypeScript
   - `npm run lint` — ESLint
   - `npm run build` — client, Worker, SSR and SEO output
   - `npm run preview` — built output through Wrangler
3. Open a pull request against this repository's `main`. For visual changes,
   include screenshots or an optional preview described in
   [docs/PREVIEW_DEPLOYS.md](./docs/PREVIEW_DEPLOYS.md).

Merging here updates the public contribution mirror. It does not deploy the
live site; reviewed work is promoted separately according to
[docs/PROMOTING.md](./docs/PROMOTING.md).

## Project conventions

- Use TypeScript and React function components; match nearby style.
- Shared Tailwind theme tokens live under `src/styles/`.
- Pages are lazy-loaded in `src/app/routes.ts`.
- Add dependencies only when the change genuinely needs them.
- Add or update tests when behavior changes.

### Adding a page or changing SEO

Runtime SEO values live in `src/app/seo/site.ts`. The SSR build exports the same
configuration to `scripts/seo-build.mjs`, which prerenders routes, metadata and
the sitemap. Add routes to the app routing files and the SEO/prerender route
lists, then inspect `dist/client/` after `npm run build`.

### Editing the Content-Security-Policy

Security headers live in `public/_headers`.

- Add an external origin only to the CSP directive that needs it.
- This mirror does not include production analytics or API origins.
- The inline redirect script in `index.html` is allowed by an exact SHA-256
  hash. If you edit it, run a build and recompute the hash:

```bash
npm run build
node -e 'const fs=require("fs"),c=require("crypto");const m=fs.readFileSync("dist/client/index.html","utf8").match(/<script>([\s\S]*?)<\/script>/);console.log("sha256-"+c.createHash("sha256").update(m[1],"utf8").digest("base64"))'
```

## Security and secrets

- Never commit credentials, private tokens, storage keys or provider secrets.
- `VITE_*` values are browser-visible and cannot be secrets.
- Keep real environment-specific endpoints, public site keys and analytics
  identifiers in your own deployment settings.
- Use the placeholder example files for local setup.

Report sensitive issues privately to **hello@marrahub.com.au**; see
[public/.well-known/security.txt](./public/.well-known/security.txt).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
