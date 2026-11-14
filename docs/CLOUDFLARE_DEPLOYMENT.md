# Cloudflare Production Deployment Guide

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Cloudflare Native Architecture

The Digikhojindia platform is natively optimized for the Cloudflare global network edge:

1. **Cloudflare Workers:** Runs `apps/api` (Hono REST API).
2. **Cloudflare D1:** Serverless distributed SQLite database storing all platform entities.
3. **Cloudflare R2:** Zero-egress-fee S3-compatible storage for support attachments and authorized documents.
4. **Cloudflare Pages:** Globally distributed CDN hosting `apps/website`, `apps/admin`, and `apps/portal`.
5. **Cloudflare Turnstile:** Human verification without disruptive CAPTCHA puzzles.

---

## 2. Prerequisites & Setup

Ensure the Cloudflare Wrangler CLI is installed and authenticated:

```bash
# Login to your Cloudflare account
npx wrangler login

# Verify active account
npx wrangler whoami
```

---

## 3. Provisioning Cloudflare Storage & Database

### 3.1. Create Cloudflare D1 Database
```bash
# Create the production D1 database
npx wrangler d1 create digikhojindia-db

# Note the database ID returned in the terminal output, e.g.:
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Update `apps/api/wrangler.toml` with your `database_id`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "digikhojindia-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

Apply database migrations and seeds to remote D1:
```bash
# Apply schema migration
npx wrangler d1 migrations apply digikhojindia-db --remote

# Seed initial verified data
npx wrangler d1 execute digikhojindia-db --remote --file=./packages/database/seeds/seed.sql
```

### 3.2. Create Cloudflare R2 Storage Bucket
```bash
# Create R2 bucket for attachments and customer documents
npx wrangler r2 bucket create digikhojindia-storage
```

Update `apps/api/wrangler.toml` with the R2 binding:
```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "digikhojindia-storage"
```

---

## 4. Deploying the Backend API (`apps/api`)

From the repository root:

```bash
# Navigate to the API application
cd apps/api

# Set production secrets in Cloudflare Workers
npx wrangler secret put JWT_SECRET
# Enter a secure, randomly generated 32+ character key

# Deploy the Worker
npx wrangler deploy
```

The Worker will be published to `https://api.yourdomain.com` or your designated `*.workers.dev` subdomain.

---

## 5. Deploying Frontend Applications to Cloudflare Pages

### 5.1. Public Website (`apps/website`)
```bash
# Build the Astro 5 static site
pnpm --filter @digikhojindia/website build

# Deploy to Cloudflare Pages
npx wrangler pages deploy apps/website/dist --project-name=digikhojindia-website
```

### 5.2. Admin Cockpit (`apps/admin`)
```bash
# Build the React/Vite admin cockpit
pnpm --filter @digikhojindia/admin build

# Deploy to Cloudflare Pages
npx wrangler pages deploy apps/admin/dist --project-name=digikhojindia-admin
```

### 5.3. Customer Portal (`apps/portal`)
```bash
# Build the React/Vite customer portal
pnpm --filter @digikhojindia/portal build

# Deploy to Cloudflare Pages
npx wrangler pages deploy apps/portal/dist --project-name=digikhojindia-portal
```

---

## 6. Configuring Custom Domains & SSL

In the Cloudflare Dashboard:
1. Navigate to **Workers & Pages**.
2. For each project, navigate to **Custom Domains** and attach your domain:
   - Public Website: `www.digikhojindia.com` or `@`
   - Admin Cockpit: `admin.digikhojindia.com`
   - Customer Portal: `portal.digikhojindia.com`
   - Backend API: `api.digikhojindia.com`
3. Cloudflare automatically generates Universal SSL/TLS certificates (TLS 1.3).

