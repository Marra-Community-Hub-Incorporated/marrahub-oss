# Marra Volunteer Portal — Spec & Design (v0.1)

> Status: **DRAFT for review**. This is the source of truth for what we're building.
> Change it by PR, not by surprise. Owner: dev (Volodymyr).

## 1. Purpose

Let community members **register as volunteers** and **sign up for Marra events/programs**,
and let an admin **manage events and see who's coming**. Built lean, but to a
production standard (separate environments, secured, privacy-aware).

## 2. Scope

**In scope (MVP):**
- Volunteer account: sign up, log in, log out, password reset
- Volunteer profile: name, contact, interests, availability, emergency contact
- Events: admin creates/edits; volunteers browse upcoming events
- Registration: volunteer RSVPs to an event; can cancel; capacity + waitlist
- "My registrations" view for the volunteer
- Admin: event management, volunteer list, registration list, CSV export
- Confirmation email on signup and on RSVP

**Out of scope (later, as deliberate learning exercises — NOT in MVP):**
- Redis caching, Kubernetes, shift scheduling, hours tracking, in-app messaging,
  payments/donations, mobile app, SMS.

## 3. Users & roles

| Role | Can do |
|------|--------|
| **Visitor** | View public pages and the events list |
| **Volunteer** | Everything a visitor can + manage own profile + RSVP to events |
| **Admin** | Everything + create/edit events + view all volunteers & registrations + export |

Role is enforced **server-side** (a trusted `admin` claim), never by hiding a button.

## 4. Core flows

1. **Sign up** → verify email → complete profile → land on dashboard.
2. **Browse events** → open an event → **RSVP** → get confirmation email → see it in "My registrations".
3. **Admin** → create event (title, date, location, capacity) → later view who registered → export CSV.

## 5. Architecture (recommended — open to veto)

Microsoft stack, because the org already has M365/Outlook + Entra ID (nonprofit) and Azure credits.

```
Browser ── React site (Cloudflare Pages, existing)
              │  login + API calls (with ID token)
        ┌─────┴──────┐
        ▼            ▼
  Entra External ID  Azure Container Apps API (Node, in Docker, scales to zero)
   (volunteer login)      │  verifies token, enforces roles
                          ▼
                   Azure SQL Database (serverless)
                          │
                   Microsoft Graph API (email via M365)
```

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Frontend | Keep React on Cloudflare Pages | Already built and deployed |
| Auth | **Entra External ID** (email + social) | Enterprise identity standard, configured for external users; never roll your own auth |
| API | **Azure Container Apps** (Docker) | Serverless containers → learn Docker/cloud; scales to zero (~$0 idle) |
| Database | **Azure SQL Database** (serverless tier) | Real SQL Server; auto-pauses when idle; great for learning injection defense |
| Email | **Microsoft Graph API** via M365 | Already owned; send confirmations from own domain |
| Secrets | **Azure Key Vault** | Enterprise secret management; never in the public repo |

> Cloud choice: **Azure** (uses existing M365/Entra, most "corporate" stack, strongest
> cybersec career value). Smaller credit pool ($2k) than Google but ample at this scale.

## 6. Data model (Azure SQL — relational)

```
volunteers
  id (PK), entra_user_id (unique), name, email, phone, interests, availability,
  skills, emergency_contact_name, emergency_contact_phone, wwcc_status,
  wwcc_expiry, consent_at, created_at

events
  id (PK), title, description, starts_at, location, capacity,
  status (draft|published|closed), created_by, created_at

registrations
  id (PK), event_id (FK), volunteer_id (FK),
  status (registered|waitlist|cancelled|attended), created_at
  UNIQUE(event_id, volunteer_id)
```

All DB access via **parameterized queries** only (no string concatenation) — this is
the core SQL-injection defense and a key learning goal of choosing SQL.

## 7. Environments (the corp discipline)

| Env | Purpose | Data |
|-----|---------|------|
| **dev** (local) | Day-to-day building | Fake/seed data only |
| **staging** | Test + attack/pentest freely | Fake/seed data only |
| **prod** | Real volunteers | Real PII — locked down |

**Hard rule:** real volunteer data only ever enters **prod**, and only after a feature
has passed its security checklist. Experiment freely in dev/staging.

## 8. Security baseline (non-negotiable, since real PII is involved)

- HTTPS everywhere + security headers (already in `public/_headers`).
- All secrets in Azure Key Vault; **nothing sensitive in the public GitHub repo**.
- Server-side authZ on every endpoint (assume the client is hostile).
- Input validation + parameterized SQL queries + rate limiting on the API.
- Least-privilege managed identity for the Container Apps service.
- Audit logging; ability to delete a volunteer's data on request.
- Each milestone ships with a short "attack your own feature" pass.

## 9. Privacy / compliance (Australia)

- Australian Privacy Principles: explicit consent checkbox, data minimization,
  a privacy policy, and a data-deletion path.
- WWCC (Working With Children Check): tracked as **status + expiry only** if Marra
  programs involve children/vulnerable people. (Decision pending — see §11.)

## 10. Roadmap (build order)

1. Spec & design (this doc)
2. Cloud project + staging/prod environments
3. Auth (signup/login)
4. Volunteer profile (first containerized API + DB write)
5. Events (admin create + public list)
6. Registration / RSVP (capacity + waitlist)
7. Confirmation emails
8. Admin dashboard + CSV export
9. Security hardening + launch

## 11. Open decisions

- [x] Cloud: **Azure** (uses existing M365/Entra; most corporate; best cybersec skills)
- [x] Database: **Azure SQL Database** (relational; learn injection defense)
- [x] Email: **Microsoft Graph via M365** (already owned)
- [ ] Login methods: email + social, or email-only? (recommend email + social)
- [ ] WWCC tracking: add field now as optional? (recommend yes)
