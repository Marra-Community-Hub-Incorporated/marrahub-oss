# CI / Security pipeline

`main` is auto-deployed by Cloudflare on every push. The CI in
`.github/workflows/ci.yml` runs on every PR and push to `main` to make sure
nothing broken or leaky gets there.

## What runs

| Check | Blocks merge? | What it protects against |
|---|---|---|
| **Secret scan** (gitleaks) | ✅ should be required | A real key/secret being committed (scans full history) |
| **Website build** (`typecheck` + `lint` + `npm run build`) | ✅ should be required | A type error, lint error, or broken production build reaching `main` |
| **API checks** (`npm ci` + `node --check`) | ✅ should be required | The Azure Function failing to parse / deps not installing |
| Dependency audit (`npm audit`) | ℹ️ informational | Surfaces vulnerable deps without blocking unrelated PRs |

Public values (the Turnstile **site** key, the Azure Function URL, the site URL)
are not secrets — they ship in the browser bundle. The gitleaks allowlist in
`.gitleaks.toml` exempts the known public Turnstile site key so it isn't a false
positive; everything else stays scanned.

## Make the checks actually block `main` (one-time)

CI only *reports* until you mark the checks **required**:

GitHub → repo **Settings → Branches → Add branch ruleset** (or "Branch protection rule")
for `main`:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass → select **Secret scan**, **Website build**, **API checks**
- ✅ (recommended) Require branches to be up to date before merging

Or via CLI (needs admin):
```bash
gh api -X PUT repos/Marra-Community-Hub-Incorporated/marrahub/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[checks][][context]=Secret scan (gitleaks)' \
  -f 'required_status_checks[checks][][context]=Website build' \
  -f 'required_status_checks[checks][][context]=API checks' \
  -F 'enforce_admins=false' \
  -F 'required_pull_request_reviews=null' \
  -F 'restrictions=null'
```

After that, a PR can't merge into `main` (and therefore can't deploy) unless the
build passes and no secret is detected.
