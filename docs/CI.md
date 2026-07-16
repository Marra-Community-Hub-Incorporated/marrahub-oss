# CI / Security pipeline

`main` is auto-deployed by Cloudflare on every push. The CI in
`.github/workflows/ci.yml` runs on every PR and push to `main` to make sure
nothing broken or leaky gets there.

## What runs

| Check | Blocks merge? | What it protects against |
|---|---|---|
| **Secret scan** (gitleaks) | ✅ required | A real key/secret being committed (scans full history) |
| **Website build** (`typecheck` + `lint` + `npm run build`) | ✅ required | A type error, lint error, or broken production build reaching `main` |
| **API checks** (`npm ci` + `node --check`) | ✅ required | The Azure Function failing to parse / deps not installing |
| **1 approving review, from a CODEOWNER** | ✅ required | Unreviewed changes reaching production |
| Dependency audit (`npm audit`) | ℹ️ informational | Surfaces vulnerable deps without blocking unrelated PRs |

Public values (the Turnstile **site** key, the Azure Function URL, the site URL)
are not secrets — they ship in the browser bundle. The gitleaks allowlist in
`.gitleaks.toml` exempts the known public Turnstile site key so it isn't a false
positive; everything else stays scanned.

## Current branch protection on `main`

All of the above are enforced already — a PR can't merge (and therefore can't
deploy) unless the build passes, no secret is detected, and a code owner has
approved it. Confirm the live config anytime with:

```bash
gh api repos/Marra-Community-Hub-Incorporated/marrahub/branches/main/protection
```

To change it (needs admin):
```bash
gh api -X PUT repos/Marra-Community-Hub-Incorporated/marrahub/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[checks][][context]=Secret scan (gitleaks)' \
  -f 'required_status_checks[checks][][context]=Website build' \
  -f 'required_status_checks[checks][][context]=API checks' \
  -F 'enforce_admins=false' \
  -F 'required_pull_request_reviews[required_approving_review_count]=1' \
  -F 'required_pull_request_reviews[require_code_owner_reviews]=true' \
  -F 'required_pull_request_reviews[dismiss_stale_reviews]=true' \
  -F 'restrictions=null'
```
