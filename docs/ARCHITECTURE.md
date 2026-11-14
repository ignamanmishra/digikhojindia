# System Architecture & Technical Specifications

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. High-Level Architecture Overview

Digikhojindia is engineered as a modern, high-performance, Cloudflare-native multi-tenant platform. By decoupling public marketing content, administrative operations, customer workflows, and core API services into dedicated applications within a unified monorepo, the platform delivers zero-latency edge delivery, strict tenant security boundaries, and extreme scalability.

```text
                               +---------------------------------------------+
                               |              Cloudflare Edge                |
                               |    (Turnstile, DDoS, SSL/TLS, Caching)      |
                               +----------------------+----------------------+
                                                      |
                    +---------------------------------+-------------------------------+
                    |                                 |                               |
                    v                                 v                               v
         +---------------------+           +---------------------+         +---------------------+
         |     apps/website    |           |      apps/admin     |         |     apps/portal     |
         |    (Astro 5 SSG)    |           |   (React 18 + Vite) |         |  (React 18 + Vite)  |
         |  29 Marketing Pages |           |  Internal Staff Ops |         | Multi-Tenant Client |
         +----------+----------+           +----------+----------+         +----------+----------+
                    |                                 |                               |
                    +------------------------+        |        +----------------------+
                                             |        |        |
                                             v        v        v
                                   +------------------------------------+
                                   |              apps/api              |
                                   |      (Cloudflare Workers API)      |
                                   |           Hono Framework           |
                                   |  - Auth & Session Verification     |
                                   |  - Tenant Isolation Middleware     |
                                   |  - Granular RBAC Permission Engine |
                                   |  - Zod Request Body Validation     |
                                   +-----------------+------------------+
                                                     |
                    +--------------------------------+--------------------------------+
                    |                                                                 |
                    v                                                                 v
        +-----------------------+                                         +-----------------------+
        |     Cloudflare D1     |                                         |     Cloudflare R2     |
        |  (Distributed SQLite) |                                         |   (S3 Object Store)   |
        |  Multi-tenant Tables  |                                         |  Signed Documents &   |
        |  FKs, B-Tree Indexes  |                                         |  Support Attachments  |
        +-----------------------+                                         +-----------------------+
```

---

## 2. Monorepo Organization & Packages

The workspace is managed with **pnpm workspaces** to maximize code reuse while keeping dependencies clean:

| Directory | Purpose | Key Dependencies |
|---|---|---|
| `apps/website` | Public SEO website | Astro 5, React, Tailwind CSS |
| `apps/admin` | Staff cockpit & ERP | React 18, Vite, Lucide Icons, Tailwind CSS |
| `apps/portal` | Client portal | React 18, Vite, Lucide Icons, Tailwind CSS |
| `apps/api` | REST API service | Cloudflare Workers, Hono, Zod, WebCrypto |
| `packages/types` | TypeScript domain types | TypeScript |
| `packages/shared` | Constants, ID generators, RBAC matrix | TypeScript |
| `packages/validation` | Request validation schemas | Zod |
| `packages/database` | D1 SQL migrations & seeds | SQLite SQL |
| `packages/ui` | Shared component design system | React 18, Tailwind CSS |

---

## 3. Multi-Tenant Isolation Model

Tenant isolation is guaranteed at the architectural level rather than relying on frontend view filters.

### Tenant Identification
1. Every non-staff user account is tied to a specific `tenant_id` (e.g., `tenant-city-hospital`).
2. Staff members belong to `tenant-dki-main`.
3. When authenticating via `POST /api/auth/login`, the verified JWT token includes `{ id, email, role, tenant_id }`.

### Enforcement in API Middleware
The `tenantMiddleware` and `requirePermission` middlewares enforce access rules before route handlers execute:

- **Staff Users:** Role `super_admin` or `admin` possesses multi-tenant visibility for operational maintenance.
- **Client Users:** Role `customer_admin` or `customer_employee` is strictly restricted:
  - If a client requests `/api/tickets/DKI-2026-00002` where the ticket's `tenant_id` does not match the user's `tenant_id`, the API immediately terminates with `403 Forbidden`.
  - When querying ticket lists or invoice lists, queries are strictly constrained by `tenant_id = user.tenant_id`.
  - Internal support notes (`is_internal_note = 1`) are stripped from payloads returned to client accounts.

---

## 4. End-to-End Business Lifecycle Data Flow

The platform connects customer acquisition, project implementation, customer support, and billing:

```text
[Website Visitor]
      │
      ▼
Submits Enquiry (Type: 'contact', 'demo', or 'quote')
      │
      ▼ (POST /api/crm/enquiries)
[Automated CRM Hook] ──▶ Creates CRM Lead (Stage: 'New')
      │
      ▼ (Sales qualification by Staff)
Converted to Customer (Customer ID: DKI-100001, Tenant ID: tenant-xxx)
      │
      ├──▶ Deployed Software Assignment (e.g. HMIS Enterprise v3.2)
      │
      ├──▶ Implementation Project (Project ID, Milestones, Sprints)
      │
      ├──▶ AMC Registration (AMC-2026-00001, "Lifetime Free AMC - Subject to agreed terms")
      │
      ├──▶ Support Ticketing (DKI-2026-00001, SLA Tracking, Priority Escalation)
      │
      └──▶ GST Compliant Invoicing (INV-2026-00001, 18% GST Breakdown, Reconciliation)
```

---

## 5. Security & Cryptographic Architecture

1. **Password Hashing:**
   - WebCrypto PBKDF2 with SHA-256 (100,000 iterations and 16-byte cryptographic salt).
   - Compatible with Cloudflare Workers serverless V8 isolate constraints (no native Node.js binaries required).
2. **Session Tokens:**
   - Base64URL-encoded cryptographically signed session tokens.
   - 24-hour expiration lifetime.
3. **Bot & Abuse Prevention:**
   - Cloudflare Turnstile token validation on public enquiry forms and customer registration points.
4. **Audit Trail:**
   - Every state change (lead creation, ticket reassignment, payment recording, AMC status update) records an audit log entry with `user_id`, `action`, `entity_type`, `entity_id`, and `timestamp`.
