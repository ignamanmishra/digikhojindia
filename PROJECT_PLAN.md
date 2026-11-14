# DIGIKHOJINDIA Platform - Master Project Plan

**Owner:** Naman Mishra  
**Company:** Digikhojindia  
**Official Email:** info@digikhojindia.com  
**Brand Statement:** *"We Don't Just Build Software. We Automate Your Entire Business."*  
**Date:** November 2026  
**Status:** In Active Execution  

---

## 1. Executive Summary & Architecture Overview

DIGIKHOJINDIA is an enterprise-grade, all-in-one business management, IT operations, and digital automation platform engineered with a Cloudflare-native, multi-tenant architecture. The platform serves hospitals, healthcare institutions, enterprise clients, IT infrastructure customers, and startups.

### Core Architectural Pillars
1. **Cloudflare-Native Runtime:**
   - **Backend API:** Cloudflare Workers running the lightweight, type-safe Hono framework.
   - **Relational Data:** Cloudflare D1 (SQLite-compatible) with strict foreign keys, multi-tenant row isolation, normalized tables, and indexes.
   - **Object Storage:** Cloudflare R2 for secure, tenant-scoped file storage (invoices, tickets, documents).
   - **Security Edge:** Cloudflare Turnstile bot verification, secure HTTP-only session cookies, RBAC, rate limiting, and audit logging.
2. **Frontend Architecture:**
   - **Public Website (`apps/website`):** Astro + Tailwind CSS for ultra-fast, SEO-optimized, schema-rich public web pages.
   - **Admin Application (`apps/admin`):** React + TypeScript + Tailwind CSS for a comprehensive enterprise operations cockpit.
   - **Customer Portal (`apps/portal`):** React + TypeScript + Tailwind CSS for a dedicated, tenant-isolated client portal.
3. **Monorepo Structure (pnpm workspaces):**
   - `apps/website`, `apps/admin`, `apps/portal`, `apps/api`
   - `packages/shared`, `packages/types`, `packages/validation`, `packages/database`, `packages/ui`
   - `tests/unit`, `tests/integration`, `tests/e2e`
   - `docs/`

---

## 2. Phase-by-Phase Execution Roadmap

### Phase 1: Architecture and Project Foundation
- Initialize pnpm monorepo structure with workspace configuration, shared tsconfig, linting, and build pipeline.
- Scaffold shared packages: `@digikhojindia/types`, `@digikhojindia/shared`, `@digikhojindia/validation`, `@digikhojindia/ui`, `@digikhojindia/database`.
- Create `.env.example`, `.gitignore`, root `package.json`, and initial project documentation.

### Phase 2: Public Website (`apps/website`)
- Build complete public website with Astro + Tailwind CSS.
- Pages: Home, About Us, Our Services (HMIS, Custom Software, Business Automation, CRM, Web Dev, GBP, SEO/GEO, IT Infrastructure), Portfolio, Industries Served, Case Studies, Tech News, Blog, Tutorials, Videos, Contact Us, Request a Demo, Request a Quote, Customer Login, Privacy Policy, Terms, AMC Policy, Refund Policy.
- Professional design with navy/blue palette, responsive mobile navigation, dynamic portfolio showcase, contact/enquiry forms, and footer: *"© Digikhojindia. All Rights Reserved. Owned by Naman Mishra."*

### Phase 3: Database and API Foundation (`packages/database` & `apps/api`)
- Complete D1 SQLite schema migrations covering all 40+ required tables: `tenants`, `tenant_branches`, `users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `sessions`, `customers`, `customer_contacts`, `software_products`, `customer_software`, `projects`, `tasks`, `tickets`, `ticket_replies`, `ticket_attachments`, `ticket_internal_notes`, `amc_contracts`, `amc_services`, `invoices`, `invoice_items`, `payments`, `expenses`, `leads`, `enquiries`, `blog_posts`, `media_files`, `automation_workflows`, `notifications`, `audit_logs`, `system_settings`, etc.
- D1 seed script with verified demo datasets (HMIS, CRM, IT support, AMC contracts, test accounts).
- Hono REST API scaffold with middleware for error handling, CORS, rate limiting, and request logging.

### Phase 4: Authentication, Authorization & Multi-Tenancy
- Cloudflare Workers-compatible cryptographic password hashing (PBKDF2-SHA256/SHA512 with 100,000 iterations & cryptographic salt).
- Secure session management with HTTP-only cookies and token verification.
- Multi-tenant isolation middleware validating organization ownership on every request.
- Role-Based Access Control (RBAC) with granular permissions across Super Admin, Admin, IT Manager, Project Manager, Support Executive, Developer, SEO Manager, Accountant, Customer Admin, and Customer Employee.
- Turnstile integration for public forms and login defense.

### Phase 5: Admin Panel Application (`apps/admin`)
- Enterprise cockpit with collapsible sidebar, top bar, profile menu, notifications, search, and responsive layout.
- Dashboard widgets: Total Customers, Active Projects, Open Tickets, Overdue Tasks, Active AMC Contracts, Enquiries, Monthly Revenue, Pending Payments, and Performance Metrics.
- Customer management, software assignments, employee management, and system settings.

### Phase 6: Customer Portal Application (`apps/portal`)
- Client-facing dashboard with tenant isolation.
- Modules: My Company, My Software, My Projects, Support Tickets, Raise Complaint, Ticket History, AMC Details, Invoices, Documents, Profile, Change Password.
- Strict isolation preventing access to internal notes or any other customer's records.

### Phase 7: Support Ticket System
- Complete ticketing lifecycle with standardized ticket IDs: `DKI-YYYY-XXXXX`.
- Categories (Software, Bug, Feature, Server, CCTV, Billing, etc.), Priority levels, and Status workflows.
- Internal notes (hidden from customers), customer-visible replies, SLA tracking, resolution confirmations, and attachment controls.

### Phase 8: CRM and Project Management
- Lead intake pipeline (New -> Contacted -> Qualified -> Proposal -> Negotiation -> Won/Lost).
- Website enquiries and demo/quote request ingestion.
- Project tracking: Milestones, Tasks, Subtasks, Team Assignment, Deadlines, Statuses, and Progress calculations.

### Phase 9: AMC and Invoicing
- AMC Contract lifecycle: Contract IDs, Software assignment, Coverage details, Included/Excluded services, Renewal alerts, Marketing clause adherence (*"Lifetime Free AMC - Subject to agreed contract terms"*).
- Billing module: Invoice numbering, GST fields, items, discounts, tax calculations, payment tracking, PDF export support, and outstanding aging reports.

### Phase 10: CMS and Publishing
- Dynamic Blog, Tech News, and Video Management system.
- Rich content management, categories, tags, author profiles, and YouTube video embeds.

### Phase 11: SEO and GEO Optimization
- Metadata engine: Titles, Descriptions, Canonical URLs, Open Graph, Twitter cards, XML sitemaps, robots.txt.
- JSON-LD Schemas: Organization, SoftwareApplication, Article, FAQ, BreadcrumbList.
- Generative Engine Optimization (GEO) structured content.

### Phase 12: Business Automation Engine
- Event-driven workflow engine:
  - New enquiry -> Lead creation.
  - New ticket -> Support notification.
  - Ticket assigned / resolved -> Customer alerts.
  - AMC expiring -> Automated reminder.
  - Invoice overdue -> Payment reminder.
- Modular integration interfaces for Email, WhatsApp Cloud API, SMS, IVR, and Webhooks.

### Phase 13: Analytics and Reporting
- Real-time reporting: Customer growth, revenue, SLA resolution times, lead conversions, AMC health.
- CSV and structured export capabilities.

### Phase 14: Security, QA, and Testing
- Unit tests, API integration tests, multi-tenant boundary tests, and end-to-end lifecycle verification.
- Linting, type-checking, and build validation across all workspaces.

### Phase 15: Cloudflare Deployment & Documentation
- Wrangler configuration files, D1 bindings, R2 buckets, environment variables.
- Comprehensive documentation suite in `docs/`.
