# MARRA Volunteer Agreement — Backend (Azure Function)

This Azure Function receives a signed Volunteer Agreement from the website and,
using **Microsoft Graph** (your own M365 tenant):

1. **Emails** the signed PDF to your organisation mailbox (always), and
2. **Optionally files** it into a **SharePoint** document library (a switch you
   can turn on later).

No third-party form service is involved — the signed personal data stays inside
your Microsoft tenant.

```
Browser (website)  ──POST JSON (fields + signed PDF as base64)──►  Azure Function
                                                                      │
                                                   Microsoft Graph ◄──┤  email PDF to you
                                                                      └─ (optional) save PDF to SharePoint
```

---

## What you need (one-time)

- An **Azure subscription** (your Microsoft non-profit grant) — to host the Function.
- **Microsoft 365** with a mailbox to send from (e.g. `hello@marrahub.com.au`).
- **Global Administrator** access to your Microsoft Entra (Azure AD) tenant, to
  grant the email permission once.
- **Node.js 20+** and the **Azure Functions Core Tools** + **Azure CLI** if you
  want to run/deploy from your machine:
  ```bash
  npm i -g azure-functions-core-tools@4 --unsafe-perm true
  brew install azure-cli            # macOS
  ```

---

## Step 1 — Register an app in Microsoft Entra (gives the function permission to send mail)

1. Go to **portal.azure.com** → search **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Name: `MARRA Volunteer Agreement`. Leave the rest default → **Register**.
3. On the app's **Overview** page, copy these two values (you'll need them):
   - **Application (client) ID** → this is `CLIENT_ID`
   - **Directory (tenant) ID** → this is `TENANT_ID`
4. Left menu → **Certificates & secrets** → **New client secret** → description + expiry (e.g. 24 months) → **Add**.
   - Copy the secret's **Value** immediately (not the "Secret ID"). This is `CLIENT_SECRET`. You won't be able to see it again.
5. Left menu → **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions** →
   search **`Mail.Send`** → tick it → **Add permissions**.
   - (Only if you'll use SharePoint, also add **`Sites.ReadWrite.All`**.)
6. Click **Grant admin consent for <your org>** → **Yes**. The permissions should show a green ✔.

> Note: `Mail.Send` as an *application* permission lets the function send as **any**
> mailbox in your tenant. That's normal for this pattern. If your security team
> prefers, you can scope it to a single mailbox later using an *Application Access
> Policy* in Exchange Online (ask me and I'll give you the commands).

---

## Step 2 — Configure the settings

Copy the template and fill it in:

```bash
cd api
cp local.settings.json.example local.settings.json
```

Fill `local.settings.json`:

| Setting | What to put |
|---|---|
| `TENANT_ID` | Directory (tenant) ID from Step 1 |
| `CLIENT_ID` | Application (client) ID from Step 1 |
| `CLIENT_SECRET` | The secret **Value** from Step 1 |
| `GRAPH_SENDER` | Mailbox to send **from**, e.g. `hello@marrahub.com.au` |
| `NOTIFY_RECIPIENT` | Where agreements should arrive (comma-separate for several) |
| `TURNSTILE_SECRET` | Cloudflare Turnstile **secret** key (see Step 5). Required; use a Cloudflare test widget/secret for local work. |
| `ALLOWED_ORIGINS` | Required CORS allowlist, e.g. `https://marrahub.com.au,http://localhost:5173` |
| `AzureWebJobsStorage` | Required by Azure Functions and the durable upload limiter. Use `UseDevelopmentStorage=true` with Azurite locally. |
| `SHAREPOINT_ENABLED` | `false` for now |

`local.settings.json` is git-ignored — secrets never get committed.

---

## Step 3 — Run it locally

```bash
cd api
npm install
npm test
npm start          # starts http://localhost:7071/api/volunteer-agreement
```

In the **website** project, create `.env.local` (see `.env.example`) with:

```
VITE_VOLUNTEER_API_URL=http://localhost:7071/api/volunteer-agreement
```

Then run the site (`npm run dev`), open `/volunteer`, fill it in, and submit.
The signed PDF should arrive in your `NOTIFY_RECIPIENT` inbox.

> Sending email via Graph works even when running locally — it uses your real
> tenant. Turnstile and the durable rate limiter do not fail open: configure a
> Cloudflare test widget/secret and run Azurite (or use an isolated development
> storage account) before submitting locally.

---

## Step 4 — Deploy to Azure

1. Create the Function App (one time). Easiest via **Azure CLI**:
   ```bash
   az login
   az group create -n marra-rg -l australiasoutheast
   az storage account create -n marrafuncstore$RANDOM -g marra-rg -l australiasoutheast --sku Standard_LRS
   az functionapp create -n <your-function-app> -g marra-rg \
     --consumption-plan-location australiasoutheast \
     --runtime node --runtime-version 20 --functions-version 4 \
     --storage-account <the-storage-account-name-from-above>
   ```
   (Or create it in the Portal: **Create resource → Function App → Node 20**.)
2. Push the settings to Azure (so the cloud app has your secrets):
   ```bash
   az functionapp config appsettings set -n <your-function-app> -g marra-rg --settings \
     TENANT_ID=... CLIENT_ID=... CLIENT_SECRET=... \
     GRAPH_SENDER=volunteer@example.org NOTIFY_RECIPIENT=volunteer-coordinator@example.org \
     TURNSTILE_SECRET=... ALLOWED_ORIGINS=https://marrahub.com.au \
     SHAREPOINT_ENABLED=false
   ```
3. Deploy the code:
   ```bash
   cd api
   func azure functionapp publish <your-function-app>
   ```
   It prints your URL, e.g. `https://<your-function-app>.azurewebsites.net/api/volunteer-agreement`.

---

## Step 5 — Point the website at the deployed function (production)

1. Get/refresh your **Turnstile secret key**: Cloudflare dashboard → **Turnstile** →
   your widget → **Settings** → copy the **Secret key** into the function's
   `TURNSTILE_SECRET` (Step 4.2). The widget's *site* key already lives in the frontend.
2. In **Cloudflare Pages** (the website project) → **Settings → Environment variables**, add:
   ```
   VITE_VOLUNTEER_API_URL = https://<your-function-app>.azurewebsites.net/api/volunteer-agreement
   ```
   then redeploy.
3. **CSP** — the site's `public/_headers` Content-Security-Policy must allow the
   browser to POST to the function. Add your function host to `connect-src`:
   ```
   connect-src 'self' https://formspree.io https://challenges.cloudflare.com https://<your-function-app>.azurewebsites.net;
   ```

---

## Step 6 (optional, later) — Turn on SharePoint filing

1. Decide the SharePoint site + library where agreements should live (e.g. a
   "Volunteer Agreements" document library on your team site).
2. Find the **site ID** via Graph Explorer (developer.microsoft.com/graph/graph-explorer),
   signed in as an admin:
   ```
   GET https://graph.microsoft.com/v1.0/sites/marrahub.sharepoint.com:/sites/<your-site>
   ```
   Copy the `id` field.
3. Add to the function settings:
   ```
   SHAREPOINT_ENABLED=true
   SHAREPOINT_SITE_ID=<the id from above>
   SHAREPOINT_FOLDER=Volunteer Agreements
   ```
   (Make sure the app has the `Sites.ReadWrite.All` permission + admin consent from Step 1.)

Every signed PDF then lands in that library automatically, in addition to the email.

---

## Request/response contract

`POST /api/volunteer-agreement` — JSON body matches `VolunteerAgreementSubmission`
in `src/app/features/volunteer-agreement/types.ts` (the website's source of truth).
Returns `200 { ok: true }` on success, or `4xx/5xx { error: "..." }`.

This single endpoint + JSON contract is what the Hub SaaS will reuse — point the
website's `VITE_VOLUNTEER_API_URL` at the SaaS backend and nothing else changes.
