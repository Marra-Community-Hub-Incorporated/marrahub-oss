# Task Log

## Public volunteer repository cleanup

Проблема — public `marrahub-oss` contained production-specific browser endpoints/site keys, personal notification addresses, stale private-repo references, and tracked `.env.production` data unsuitable for a clean OSS onboarding repo.

Причина — deployment/runtime values and internal documentation had been copied into source-controlled examples and docs while the OSS mirror was prepared.

Решение — moved production-specific browser values to placeholders, removed tracked production env data, made Turnstile/contact integrations optional until configured, sanitized backend examples/docs, and updated ignore/secret-scan allowlists.

Что сделано — updated `.env.example`, added `.env.production.example`, ignored `.env.production`, sanitized `api/local.settings.json.example`, `README.md`, `CONTRIBUTING.md`, `api/README.md`, `docs/CI.md`, `docs/PROMOTING.md`, `PROJECT_DOCUMENTATION.md`, `public/_headers`, `package.json`, `.gitleaks.toml`, `src/app/pages/Contact.tsx`, and volunteer agreement Turnstile config/components.

Дата и время — 2026-08-05 18:51:43 +10:00
