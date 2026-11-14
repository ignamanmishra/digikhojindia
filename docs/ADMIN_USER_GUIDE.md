# Enterprise Admin Cockpit User Guide

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Accessing the Admin Cockpit

- **Local Address:** `http://localhost:5173`
- **Default Super Admin Credentials:**
  - **Email:** `admin@digikhojindia.com`
  - **Password:** `SuperAdmin@2026!`

The Admin Cockpit features a responsive collapsible sidebar, header with active user profile, and high-contrast dark theme optimized for technical operations.

---

## 2. Navigating Admin Modules

### 2.1. Executive Overview
- Displays live statistics directly calculated from database records: Total Customers, Active Software Deployments, Open Tickets, Overdue Tasks, Active AMC Contracts, and Lifetime Invoiced Amount.
- Shows urgent SLA action cards and recent activity events.

### 2.2. CRM & Sales Pipeline
- **Enquiries:** Review incoming submissions from public website contact, demo, and quote forms. Each enquiry highlights contact person, organization, phone number, and service interest.
- **Leads:** Manage deals across the visual lifecycle stages:
  `New` ➔ `Contacted` ➔ `Qualified` ➔ `Proposal` ➔ `Negotiation` ➔ `Won` / `Lost`
- Move leads through stages, record estimated contract value, and convert qualified leads into full enterprise customers with one click.

### 2.3. Customer Management
- Register new enterprise customers (hospitals, diagnostic chains, companies).
- Automatically formats unique customer IDs (`DKI-100001`, `DKI-100002`).
- Assign deployed software modules (e.g. HMIS Enterprise, Asset Portal, LIS).
- Designate primary technical managers and support executives.

### 2.4. Support Tickets & SLA Management
- Centralized queue of tickets across all customer organizations.
- **SLA Countdown:** Highlights P1 Critical (4-hour SLA), P2 High (8-hour SLA), P3 Medium (24-hour SLA), and P4 Low (48-hour SLA) deadlines.
- **Threaded Conversation:** Reply directly to customer inquiries.
- **Internal Staff Notes:** Toggle the yellow "Internal Note" mode to collaborate privately with developers and DevOps engineers. Internal notes are strictly inaccessible to customer accounts.

### 2.5. Annual Maintenance Contracts (AMC)
- Register and monitor AMC agreements with contract numbers (`AMC-2026-00001`).
- Enforces the core Digikhojindia marketing proposition:
  > **"Lifetime Free AMC – Subject to agreed contract terms."**
- Clearly documents included maintenance tasks (security patches, weekly backup audits, bug resolution) versus excluded work (new feature engineering, third-party SMS/cloud costs).

### 2.6. Billing & Invoices
- Generate GST-compliant invoices (`INV-2026-00001`).
- Input line items with automatic subtotaling.
- Applies standard Indian 18% GST (CGST 9% + SGST 9%) calculation.
- Record incoming NEFT/RTGS/UPI payments, update status (`paid`, `partial`, `pending`, `overdue`), and calculate remaining balance.

### 2.7. Project & Task Management
- Create client implementation projects with status (`Planning`, `In Progress`, `Testing`, `Completed`).
- Assign milestone tasks, track percentage completion, and set target go-live dates.

### 2.8. Website CMS, Blogs & SEO
- Publish technical articles, case studies, and video tutorials.
- Manage SEO metadata, meta tags, and OpenGraph configurations without touching code.

### 2.9. Audit Logs & System Settings
- Immutable activity log capturing user, timestamp, entity type, and operation.
- Inspect system permissions and role assignments across the organization.

