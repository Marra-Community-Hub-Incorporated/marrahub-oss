# Previewing changes on Cloudflare

Preview locally first:

```bash
npm run dev
npm run preview
```

`npm run preview` builds the client, Worker, SSR bundle and SEO output, then
serves them through Wrangler. It is the closest local check to a deployment.

## Optional personal Cloudflare preview

You can deploy the mirror to your own Cloudflare account without access to the
MARRA production project:

1. Create a Cloudflare account.
2. Copy `.env.production.example` to an ignored `.env.production` only if you
   need non-default values, then use your own provider configuration.
3. Authenticate and deploy:

   ```bash
   npx wrangler login
   npm run deploy
   ```

The mirror uses the Worker name `marrahub-oss`; Wrangler prints the generated
`workers.dev` URL. Add that URL to your pull request for reviewers.

The checked-in configuration contains placeholders, so contact and volunteer
agreement submissions remain disabled until you deliberately configure your own
endpoints and site keys. Never copy production secrets into a fork, local env
file that could be committed, or a pull request.

If you connect a fork to Cloudflare's Git integration, use `npm run build` and
keep its project, domains and environment values separate from MARRA production.
