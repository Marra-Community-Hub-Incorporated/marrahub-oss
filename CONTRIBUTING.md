# Contributing

Thanks for your interest in improving the MARRA Community Hub website! This is a
community project and contributions of all sizes are welcome.

## Getting set up

Prerequisites: **Node.js 18+** and npm.

```bash
git clone https://github.com/Marra-Community-Hub-Incorporated/marrahub.git
cd marrahub
npm install
npm run dev
```

Or open the folder in VS Code / a GitHub Codespace and "Reopen in Container" —
there's a `.devcontainer/` config with Node + npm preinstalled, no local setup
needed.

## Making changes

1. Create a branch off `main` (e.g. `fix/contact-typo` or `feat/events-page`).
2. Make your change and check it locally:
   - `npm run dev` — verify it works and looks right in the browser
   - `npm run build` — make sure the production build passes
   - `npm run preview` — sanity-check the built output
3. Open a pull request against `main` with a short description of what and why.
   For visual changes, consider deploying a free Cloudflare clone of the site so
   reviewers can see it live — see [`docs/PREVIEW_DEPLOYS.md`](./docs/PREVIEW_DEPLOYS.md).

Pushing to `main` triggers an automatic production deploy via Cloudflare Pages,
so please work on a branch and use pull requests.

## Merge requirements

Branch protection on `main` enforces all of this — there's no way around it,
including for admins:

- The three CI checks (secret scan, website build, API checks) must pass —
  see [`docs/CI.md`](./docs/CI.md).
- At least **1 approving review from a CODEOWNER** (see
  [`.github/CODEOWNERS`](./.github/CODEOWNERS)).
- Force-pushes and branch deletion on `main` are blocked.

## Access levels

- **Write** collaborators can push branches and open PRs, but can't merge
  without review and can't change repo/CI settings.
- **Admin** is reserved for maintainers who manage settings, secrets, and
  branch protection itself.
- Deploy secrets (Cloudflare, Azure) live only in those platforms' dashboards —
  Write access to this repo never grants access to them.

## Project conventions

- **TypeScript + React function components.** Match the style of the file you're
  editing.
- **Styling is Tailwind CSS** utility classes; shared theme tokens live in
  `src/styles/`.
- **Pages are lazy-loaded** in `src/app/routes.ts` — keep new pages code-split
  the same way.
- Keep the component layer lean; we removed the unused scaffolding component
  library, so only add dependencies you actually use.

## Security & secrets

- **Never commit secrets.** The Formspree endpoint and Turnstile site key are
  public frontend values by design; their secret counterparts stay in the
  provider dashboards only.
- Anything prefixed `VITE_` is compiled into the public client bundle — don't
  put secrets there.

### Editing the Content-Security-Policy

Security headers live in [`public/_headers`](./public/_headers). Two things to
watch:

- **Adding a new external origin** (a script, image host, font, or API the site
  calls) means updating the matching CSP directive, or the browser will block it.
- **The inline SPA-redirect script** in `index.html` is allowed by an exact
  `sha256` hash in the CSP. If you change that script, recompute the hash and
  update `public/_headers`, otherwise deep links break silently:

  ```bash
  npm run build
  node -e 'const fs=require("fs"),c=require("crypto");const m=fs.readFileSync("dist/client/index.html","utf8").match(/<script>([\s\S]*?)<\/script>/);console.log("sha256-"+c.createHash("sha256").update(m[1],"utf8").digest("base64"))'
  ```

## Reporting issues

Found a bug or have an idea? Open an issue on GitHub. For anything sensitive
(e.g. a security concern), email **hello@marrahub.com.au** instead — see
[`public/.well-known/security.txt`](./public/.well-known/security.txt).

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](./LICENSE).
