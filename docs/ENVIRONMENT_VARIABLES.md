# Environment Variables & Configuration Reference

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Global & Local Workspace (`.env`)

These variables govern local monorepo orchestration and tooling.

| Variable Name | Required | Default Value | Sensitivity | Description |
|---|---|---|---|---|
| `NODE_ENV` | Yes | `development` | Public | Environment runtime mode (`development` or `production`) |
| `API_PORT` | No | `8787` | Public | Port on which the local Cloudflare Workers API listens |
| `PUBLIC_API_URL` | Yes | `http://localhost:8787/api` | Public | Base API endpoint consumed by frontend apps |
| `APP_DOMAIN` | No | `digikhojindia.local` | Public | Root domain for cookie scoping and CORS |

---

## 2. Backend API (`apps/api`)

These variables are defined in `apps/api/wrangler.toml` or set via `npx wrangler secret put <NAME>`.

| Variable Name | Required | Example Value | Sensitivity | Description |
|---|---|---|---|---|
| `JWT_SECRET` | Yes | `crypto-secure-random-32-chars-long` | **Secret** | Cryptographic secret for signing session tokens |
| `DB` | Yes | Binding to `digikhojindia-db` | System | Cloudflare D1 database binding |
| `STORAGE` | Yes | Binding to `digikhojindia-storage`| System | Cloudflare R2 bucket binding |
| `TURNSTILE_SECRET_KEY` | Optional | `0x4AAAAAA...` | **Secret** | Cloudflare Turnstile server-side validation key |
| `CORS_ORIGIN` | Yes | `*` or `https://digikhojindia.com` | Public | Permitted CORS origin for browser requests |

---

## 3. Public Website (`apps/website`)

Configured in `apps/website/.env` or Astro build environment.

| Variable Name | Required | Default Value | Sensitivity | Description |
|---|---|---|---|---|
| `PUBLIC_API_URL` | Yes | `http://localhost:8787/api` | Public | Backend endpoint for interactive enquiry forms |
| `PUBLIC_TURNSTILE_SITE_KEY` | Optional | `1x00000000000000000000AA` | Public | Turnstile client key for spam prevention |
| `PUBLIC_COMPANY_NAME` | No | `Digikhojindia` | Public | Company name brand string |
| `PUBLIC_OWNER_NAME` | No | `Naman Mishra` | Public | Owner attribution string |
| `PUBLIC_OFFICIAL_EMAIL` | No | `info@digikhojindia.com` | Public | Official support and inquiry email address |

---

## 4. Admin Cockpit (`apps/admin`)

Configured in `apps/admin/.env` during Vite build.

| Variable Name | Required | Default Value | Sensitivity | Description |
|---|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:8787/api` | Public | REST API base URL for admin operations |
| `VITE_APP_TITLE` | No | `Digikhojindia Admin` | Public | Application page title prefix |

---

## 5. Customer Support Portal (`apps/portal`)

Configured in `apps/portal/.env` during Vite build.

| Variable Name | Required | Default Value | Sensitivity | Description |
|---|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:8787/api` | Public | REST API base URL for customer requests |
| `VITE_APP_TITLE` | No | `Digikhojindia Client Portal`| Public | Customer portal page title prefix |

---

## 6. Security Guidelines

1. **Never Commit Secrets:** The `.env` file is excluded from Git tracking via `.gitignore`.
2. **Production Secrets:** In Cloudflare production, never hardcode `JWT_SECRET` in `wrangler.toml`. Use `wrangler secret put JWT_SECRET` so that values are encrypted at rest in the Cloudflare KMS.
