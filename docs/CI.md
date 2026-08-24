# CI and security pipeline

The workflow in `.github/workflows/ci.yml` runs on pull requests and pushes to
`main`. A merge here updates the OSS contribution mirror; it does not deploy the
production website.

## Checks

| Check | What it protects against |
|---|---|
| Secret scan (gitleaks) | Credentials or private keys committed anywhere in history |
| Frontend contract tests | Drift in security-sensitive volunteer-agreement behavior |
| Type-check and lint | Browser or Worker type errors and lint regressions |
| Production build | Broken client, Worker, SSR or prerender output |
| API syntax and tests | Invalid Azure Function code and agreement-security regressions |
| Dependency audits | Known high-severity dependency issues; currently informational |

Public browser values such as Turnstile site keys and provider endpoints are
not secrets, but this mirror still keeps production-specific values out of
source control. Configure them in your own hosting or provider dashboard.

## Recommended branch protection

Repository maintainers should require the three CI jobs and at least one review
before merge. Confirm the live GitHub configuration rather than relying on this
document:

```bash
gh api repos/Marra-Community-Hub-Incorporated/marrahub-oss/branches/main/protection
```

Do not weaken secret scanning or required reviews merely to make a pull request
pass; fix the underlying problem instead.
