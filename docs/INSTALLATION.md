# Installation & Local Setup Guide

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. System Requirements

Before running the Digikhojindia platform, verify that your environment satisfies the following prerequisites:

- **Node.js:** `>= 18.0.0` (Node 20 LTS or Node 22 recommended)
- **pnpm:** `>= 9.0.0` (`npm install -g pnpm`)
- **Cloudflare Wrangler CLI:** `>= 3.0.0` (`npm install -g wrangler` or via devDependencies)
- **Git:** `>= 2.30.0`
- **Supported OS:** Windows 10/11, macOS, Linux (Ubuntu 22.04+)

---

## 2. Clone and Setup Dependencies

```bash
# Clone the repository
git clone https://github.com/digikhojindia/platform.git
cd platform

# Install dependencies using pnpm
pnpm install
```

> [!NOTE]
> If you are on pnpm 12, the repository includes `allowBuilds` in `pnpm-workspace.yaml` and `strict-dep-builds=false` in `.npmrc` to ensure binary native modules (such as esbuild and sharp) compile properly.

---

## 3. Environment Configuration

Copy the example environment configuration into your environment files:

```bash
cp .env.example .env
```

Review and adjust variables according to your local setup:

| Variable | Default Value | Description |
|---|---|---|
| `NODE_ENV` | `development` | Runtime environment mode |
| `API_PORT` | `8787` | Local port for Cloudflare Workers API |
| `PUBLIC_API_URL` | `http://localhost:8787/api` | API base address for frontend apps |
| `JWT_SECRET` | `dki_dev_jwt_secret_min_32_chars_long!` | Secret used for session token signing |
| `CLOUDFLARE_D1_DATABASE_ID` | `digikhojindia-db` | Cloudflare D1 local database binding |

---

## 4. Building Workspace Packages

The monorepo uses TypeScript project references. Packages must be compiled before launching frontend apps:

```bash
# Build all reusable packages (types, shared, validation, database, ui)
pnpm build:packages
```

---

## 5. Database Initialization (Local Cloudflare D1)

Execute the schema migration and demo dataset seed:

```bash
# Apply schema migration to local SQLite D1
pnpm db:migrate:local

# Seed sample data (staff, customers, sample software, tickets, invoices)
pnpm db:seed:local
```

---

## 6. Running Development Servers

Start each application independently in separate terminal windows, or run them in parallel:

```bash
# Parallel startup of all apps
pnpm dev

# Or start specific applications individually:
pnpm dev:api       # http://localhost:8787 (Cloudflare Workers API)
pnpm dev:website   # http://localhost:4321 (Public Marketing Website)
pnpm dev:admin     # http://localhost:5173 (Enterprise Admin Cockpit)
pnpm dev:portal    # http://localhost:5174 (Customer Support Portal)
```

---

## 7. Running Test Suites

Run the full automated test suite using Vitest:

```bash
# Execute unit and integration tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate code coverage report
pnpm test:coverage
```

---

## 8. Verifying the Setup

1. **API Health Check:** Open [http://localhost:8787/api/health](http://localhost:8787/api/health) in your browser. You should receive:
   ```json
   {
     "status": "healthy",
     "platform": "Digikhojindia",
     "owner": "Naman Mishra",
     "email": "info@digikhojindia.com",
     "version": "1.0.0"
   }
   ```
2. **Public Website:** Navigate to [http://localhost:4321](http://localhost:4321) to confirm the 29-page Astro website loads with interactive lead forms.
3. **Admin Cockpit:** Open [http://localhost:5173](http://localhost:5173) and sign in using `admin@digikhojindia.com` / `SuperAdmin@2026!`.
4. **Customer Portal:** Open [http://localhost:5174](http://localhost:5174) and sign in using `rajesh@cityhospital.com` / `Customer@12345`.
