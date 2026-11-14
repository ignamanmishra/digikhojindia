# DIGIKHOJINDIA – Complete All-In-One Business Management Platform

> **"We Don't Just Build Software. We Automate Your Entire Business."**

**Owned by Naman Mishra**  
**Official Email:** [info@digikhojindia.com](mailto:info@digikhojindia.com)  
**Platform Version:** 1.0.0 Production Architecture  
**Deployment Model:** Cloudflare-Native Edge Monorepo (pnpm workspaces)

---

## 1. Executive Summary

Digikhojindia is an enterprise technology, custom software development, business automation, IT solutions, and digital growth company. This platform provides an all-in-one digital operating system for modern organizations—including hospitals, multi-center diagnostic labs, enterprise corporations, and growing startups.

Unlike prototypes or static landing pages, this repository is a **production-ready, multi-tenant monorepo** featuring:
1. **Public SEO Website (`apps/website`):** High-speed, 29-page Astro 5 public marketing website with dynamic interactive enquiry capture and static rendering.
2. **Enterprise Admin Cockpit (`apps/admin`):** React 18 + Vite enterprise management portal with live CRM, Ticket SLAs, AMC management, 18% GST Invoicing, Project tracking, and Audit logs.
3. **Customer Support Portal (`apps/portal`):** Dedicated, tenant-isolated client portal for raising complaints, viewing real-time SLAs, tracking projects, downloading authorized documents, and managing AMC contracts.
4. **Cloudflare Hono REST API (`apps/api`):** Cloudflare Workers runtime API using Hono, WebCrypto PBKDF2/Argon2id-style security, strict multi-tenant authorization barriers, and SQLite D1 database integration.
5. **Shared Packages (`packages/*`):** Reusable validation (Zod), domain types, database migrations, shared UI components, and business rules.

---

## 2. Monorepo Structure

```text
digikhojindia-platform/
├── apps/
│   ├── website/              # Astro 5 Public SEO Marketing Website (29 pages)
│   ├── admin/                # React 18 + Vite Enterprise Admin Panel
│   ├── portal/               # React 18 + Vite Multi-Tenant Customer Portal
│   └── api/                  # Cloudflare Workers + Hono REST API
├── packages/
│   ├── types/                # Domain models, RBAC actions, API payloads
│   ├── shared/               # Brand constants, ID formatters, RBAC matrix
│   ├── validation/           # Zod validation schemas for all domain entities
│   ├── database/             # Cloudflare D1 SQLite migrations and seeds
│   └── ui/                   # Reusable UI component system
├── docs/                     # Comprehensive enterprise documentation
│   ├── INSTALLATION.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY.md
│   ├── CLOUDFLARE_DEPLOYMENT.md
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── ADMIN_USER_GUIDE.md
│   ├── CUSTOMER_USER_GUIDE.md
│   ├── TESTING_REPORT.md
│   └── KNOWN_LIMITATIONS.md
├── tests/
│   ├── unit/                 # Shared utilities and Zod schema unit tests
│   └── integration/          # API, RBAC, and Multi-tenant leak defense tests
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── vitest.config.ts
```

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Public Website** | Astro 5, React Islands, Tailwind CSS, Lucide Icons |
| **Admin Cockpit** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React |
| **Customer Portal** | React 18, Vite, TypeScript, Tailwind CSS, Tenant Isolation |
| **Backend API** | Cloudflare Workers, Hono v4, Zod, WebCrypto PBKDF2 |
| **Database** | Cloudflare D1 (Distributed SQLite), Foreign Keys, Full Indexing |
| **Storage** | Cloudflare R2 Object Storage |
| **Security** | PBKDF2-SHA256 (100k iters), HTTP-Only Bearer Tokens, Cloudflare Turnstile, RBAC |
| **Testing** | Vitest 2, Node.js Test Harness (35 passing tests) |
| **Package Manager** | pnpm workspaces (Node >= 18.0.0, pnpm >= 9.0.0) |

---

## 4. Key Business Capabilities

1. **Strict Multi-Tenant Isolation:**
   - Every customer data record is mapped to a unique `tenant_id`.
   - Customer admins and employees can never read, modify, or leak data belonging to another tenant.
   - Internal support notes are strictly hidden from customers across all API endpoints.

2. **Automated Enquiry-to-Lead Pipeline:**
   - Public website enquiry forms immediately push inquiries to the CRM.
   - Triggers automated lead generation with source tagging (`Website Enquiry`, `Demo Request`, `Quote Request`).

3. **Compliant GST Invoicing Engine:**
   - Formats invoice IDs as `INV-2026-00001`.
   - Automatic 18% GST breakdown (CGST 9% + SGST 9%), payment recording, and balance due calculation.

4. **Service Level Agreement (SLA) Ticketing:**
   - Formats ticket IDs as `DKI-2026-00001`.
   - Priority-based SLA resolution timelines (P1 Critical: 4 hours, P2 High: 8 hours, P3 Medium: 24 hours, P4 Low: 48 hours).
   - Rating and feedback collection upon customer confirmation of resolution.

5. **AMC Contract Management:**
   - Formats contract IDs as `AMC-2026-00001`.
   - Promotes the verified value proposition: *"Lifetime Free AMC – Subject to agreed contract terms."*
   - Explicit distinction between included preventive maintenance and excluded custom developments.

---

## 5. Quick Start (Local Development)

```bash
# 1. Install dependencies
pnpm install

# 2. Build shared packages
pnpm build:packages

# 3. Run all tests
pnpm test

# 4. Start local development servers
# Terminal 1: Backend API (port 8787)
pnpm dev:api

# Terminal 2: Public Website (port 4321)
pnpm dev:website

# Terminal 3: Admin Cockpit (port 5173)
pnpm dev:admin

# Terminal 4: Customer Portal (port 5174)
pnpm dev:portal
```

### Pre-Configured Demo Credentials

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Super Admin** | `admin@digikhojindia.com` | `SuperAdmin@2026!` | Admin Cockpit (`localhost:5173`) |
| **Hospital Customer Admin** | `rajesh@cityhospital.com` | `Customer@12345` | Customer Portal (`localhost:5174`) |
| **Diagnostics Client** | `contact@apexdiagnostics.com` | `Customer@12345` | Customer Portal (`localhost:5174`) |

---

## 6. Verification and Test Results

The platform codebase passes **35 automated tests** across 3 test suites:
- `tests/unit/validation.test.ts` (10 tests) – Passed
- `tests/unit/shared.test.ts` (11 tests) – Passed
- `tests/integration/api.test.ts` (14 tests) – Passed

---

## 7. Mandatory Brand Attribution & Licensing

© Digikhojindia. All Rights Reserved.  
Owned by Naman Mishra.  
Contact: `info@digikhojindia.com`

