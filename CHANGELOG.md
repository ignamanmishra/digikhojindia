# DIGIKHOJINDIA Platform Changelog

All notable changes to the Digikhojindia platform are documented in this file.

---

## [1.0.0] - 2026-11-14

### Initial Production Architecture Release

#### Architectural Foundation
- Configured pnpm workspaces monorepo: `apps/website`, `apps/admin`, `apps/portal`, `apps/api`, `packages/types`, `packages/shared`, `packages/validation`, `packages/database`, `packages/ui`.
- Enforced strict pnpm 12 build flags (`allowBuilds` for `esbuild`, `sharp`, `workerd`).
- Standardized Node.js WebCrypto PBKDF2 password hashing (100k iterations with 16-byte cryptographic salt).

#### Core Domain Packages
- `@digikhojindia/types`: Full domain models, API interfaces, 10 system roles, and 29 permission actions.
- `@digikhojindia/shared`: Brand constants (Owner: Naman Mishra, info@digikhojindia.com), ID generators (`DKI-100001`, `DKI-2026-00001`, `INV-2026-00001`, `AMC-2026-00001`), INR currency and date formatting, and RBAC matrix.
- `@digikhojindia/validation`: Zod schemas for auth, customers, tickets, AMC, invoices, leads, enquiries, blogs, and tasks.
- `@digikhojindia/database`: Cloudflare D1 SQLite migration `0001_initial_schema.sql` (40+ tables, foreign keys, B-tree indexes) and comprehensive seed script (`seed.sql`).
- `@digikhojindia/ui`: Reusable design system primitives (`Button`, `Badge`, `Card`, `StatCard`, `Input`, `Modal`).

#### Cloudflare Workers REST API (`apps/api`)
- Built on Hono v4 with centralized logging, error handling, CORS, and health checks (`GET /api/health`).
- Implemented `authMiddleware`, `tenantMiddleware` (cross-tenant leak prevention), and `requirePermission` RBAC enforcement.
- Created route modules: Auth, Customers, Tickets (with internal notes filtering), CRM, Projects, AMC, Invoices (18% GST calculation), CMS, Reports, Integrations, and Automation.

#### Public SEO Website (`apps/website`)
- Built with Astro 5, Tailwind CSS, and interactive React islands.
- Generated 29 static pages with rich metadata, structured JSON-LD schemas, and responsive navigation.
- Integrated interactive lead capture enquiry forms submitting directly to `/api/crm/enquiries`.

#### Enterprise Admin Cockpit (`apps/admin`)
- Built with React 18, Vite, and Tailwind CSS.
- Implemented 17 full cockpit views: Overview, Customers, Tickets, CRM Leads, Website Enquiries, AMC Contracts, Invoices & Billing, Projects, Software Catalog, CMS Blogs, Video Tutorials, Google Business Profile, Automation, Integrations, Employees, Audit Logs, and Settings.

#### Customer Support Portal (`apps/portal`)
- Built with React 18, Vite, and Tailwind CSS.
- Implemented tenant-isolated customer views: Overview Dashboard, Raise Technical Complaint, Support Tickets (threaded discussion, resolution confirmation, 1-5 star rating), Deployed Software, Projects & Milestones, AMC Details ("Lifetime Free AMC – Subject to agreed contract terms"), Invoices & Statements (printable GST invoice breakdown), Authorized Documents (SLA, HMIS Manual, Security SOPs), and Profile & Password management.

#### Quality Assurance & Automated Testing
- Executed 35 automated tests via Vitest across 3 suites (100% pass rate in 633ms).
- Verified multi-tenant security boundaries, internal note shielding, 18% GST calculation, ticket lifecycle, and enquiry-to-lead automation.

#### Documentation Suite (`docs/`)
- Authored 11 technical manuals: Installation, Architecture, Database Schema, REST API Reference, Security & RBAC, Cloudflare Deployment, Environment Variables, Admin User Guide, Customer User Guide, Testing Report, and Known Limitations.
