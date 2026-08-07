# Previewing your changes on Cloudflare

`main` deploys straight to production (marrahub.com.au), so reviewers want to
see a change running somewhere *before* it merges. You have three options,
from lightest to most set-up.

## 0. Local preview (always do this first)

```bash
npm run dev       # hot-reload dev server
npm run preview   # production build served via `wrangler dev` — closest to prod
```

`npm run preview` runs the real build (including the SEO post-build step) and
serves it through the same Worker used in production, so it catches problems
`npm run dev` hides.

## 1. Deploy your own Cloudflare clone (recommended for volunteers)

You can run a full copy of the site on your **own free Cloudflare account**.
It is completely separate from production — nothing you do there can touch
marrahub.com.au — and it gives reviewers a real URL to click.

One-time setup:

1. Sign up for a free account at [dash.cloudflare.com](https://dash.cloudflare.com)
   (the free plan is enough).
2. In this repo, authenticate wrangler with that account:

   ```bash
   npx wrangler login
   ```

Then, on your branch:

```bash
npm run deploy
```

That builds the site and deploys it to your account. Wrangler prints the URL,
which looks like:

```text
https://marrahub.<your-subdomain>.workers.dev
```

Paste that URL into your pull request description so reviewers can see the
change live.

Notes:

- No secrets are needed — the repo contains only public frontend values.
- **Don't submit the contact form on your clone.** It posts to the real
  Formspree endpoint, i.e. the real MARRA inbox.
- Re-run `npm run deploy` after new commits to update your clone.

### Optional: auto-deploy your clone on every push

Instead of running `npm run deploy` by hand, you can connect your fork to
Cloudflare's git integration: in the Cloudflare dashboard go to
**Workers & Pages → Create → Import a repository**, pick your fork, and use
`npm run build` as the build command (wrangler config is picked up from
`wrangler.jsonc`). After that, every push to your fork rebuilds your clone
automatically.

## 2. The official preview deployments

Cloudflare also builds previews of branches on the official MARRA project, but
those preview URLs sit behind **Cloudflare Access** — they're not publicly
viewable. If you need access to them, ask Volodymyr and he can add you to the
Access policy. For most changes, option 1 is faster and just as good.
