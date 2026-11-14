# Known Limitations & Architecture Roadmap

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Third-Party Messaging & Telecom Gateways

- **Current Implementation:** The WhatsApp Cloud API, SMS gateway, and IVR automation modules in `apps/api/src/routes/automation.ts` and `integrations.ts` provide clean REST interfaces and logging hooks. However, live external messaging delivery is intentionally held in simulated staging until production WhatsApp Business Account (WABA) tokens, Meta App review, and DLT (Distributed Ledger Technology) registration in India are completed by the company.
- **Production Integration Path:** To connect live delivery, populate `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and SMS provider API keys in Cloudflare Workers secrets.

---

## 2. Google Business Profile & Local SEO APIs

- **Current Implementation:** The Google Business Profile dashboard in the Admin Cockpit (`apps/admin`) models review tracking, location insights, and post scheduling. Data is currently backed by verified mock seeds pending Google Cloud Console OAuth consent screen approval.
- **Production Integration Path:** Enable the Google My Business API and Search Console API in Google Cloud Console and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## 3. Payment Gateway Webhook Reconciliation

- **Current Implementation:** The billing and invoice module natively supports standard Indian business financial flows (NEFT, RTGS, IMPS, UPI, Cheque) with manual reconciliation and payment recording.
- **Production Integration Path:** For real-time credit card and UPI auto-settlement, add webhook signature verification for Razorpay or Cashfree into `apps/api/src/routes/invoices.ts`.

---

## 4. Software Portfolio Verification Policy

- **Current Implementation:** In accordance with the project prompt guidelines, all initial 15 software portfolio items (HMIS, Asset Portal, CRM, LIS, Radiology, Salon, etc.) are explicitly categorized and marked as **Sample / Demo Deployments**.
- **Production Policy:** No unverified client deployments or invented case study metrics are published as live customer contracts until formally approved and signed off by owner **Naman Mishra**.

---

## 5. Local In-Memory Development Store vs. Remote Cloudflare D1

- **Current Implementation:** In local testing and Vite development, `apps/api` uses a thread-safe, in-memory SQLite state store pre-seeded with verified test data (`tenant-dki-main`, `tenant-city-hospital`, `tenant-apex-diagnostics`).
- **Production Path:** In Cloudflare production, standard D1 bindings (`c.env.DB.prepare(...)`) are executed using the exact schema defined in `packages/database/migrations/0001_initial_schema.sql`.

