# Cloudflare D1 Database Schema & Data Dictionary

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Overview & Storage Engine

The Digikhojindia platform uses **Cloudflare D1**, a globally distributed, serverless SQLite-compatible database. The database enforces foreign key constraints, multi-column indexes for high-throughput queries, and strict multi-tenant isolation via mandatory `tenant_id` associations.

- **Migration File:** `packages/database/migrations/0001_initial_schema.sql`
- **Initial Seed File:** `packages/database/seeds/seed.sql`

---

## 2. Entity Relationship Diagram

```text
+---------------+       +------------------+       +-------------------+
|    tenants    |1     *|      users       |       |  software_products|
+-------+-------+-------+---------+--------+       +---------+---------+
        |                         |                          |
        | 1                       | 1                        | 1
        v *                       v *                        v *
+-------+-------+       +---------+--------+       +---------+---------+
|   customers   |1     *|     tickets      |       | customer_software |
+-------+-------+-------+---------+--------+       +---------+---------+
        |                         |
        | 1                       | 1
        |                         v *
        |               +---------+--------+
        |               |  ticket_replies  |
        |               +------------------+
        |
        +───────────────┬───────────────────┬───────────────────┐
        | 1             | 1                 | 1                 | 1
        v *             v *                 v *                 v *
+-------+-------+ +-----+------+    +-------+-------+   +-------+-------+
| amc_contracts | |  projects  |    |   invoices    |   |     leads     |
+---------------+ +-----+------+    +-------+-------+   +---------------+
                        |                   |
                        | 1                 | 1
                        v *                 v *
                  +-----+------+    +-------+-------+
                  |   tasks    |    | invoice_items |
                  +------------+    +---------------+
                                            |
                                            | 1
                                            v *
                                    +-------+-------+
                                    |   payments    |
                                    +---------------+
```

---

## 3. Core Tables Specification

### 3.1. `tenants`
Defines isolated customer organizations and the central Digikhojindia administration tenant.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique tenant ID (`tenant-xxx`) |
| `name` | TEXT | NOT NULL | Organization or company name |
| `type` | TEXT | NOT NULL | `system` or `customer` |
| `status` | TEXT | DEFAULT 'active' | `active`, `suspended`, `cancelled` |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | ISO 8601 creation timestamp |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | ISO 8601 modification timestamp |

---

### 3.2. `users`
System accounts for Digikhojindia staff and customer representatives.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | User identifier (`usr-xxx`) |
| `tenant_id` | TEXT | NOT NULL, REFERENCES tenants(id) | Tenant owner |
| `name` | TEXT | NOT NULL | Full name of the user |
| `email` | TEXT | UNIQUE, NOT NULL | Login email address |
| `password_hash` | TEXT | NOT NULL | WebCrypto PBKDF2 hashed password |
| `role` | TEXT | NOT NULL | One of 10 granular system roles |
| `status` | TEXT | DEFAULT 'active' | `active` or `inactive` |
| `last_login_at` | TEXT | NULLABLE | Timestamp of last authenticated session |

---

### 3.3. `customers`
Customer entity records registered with Digikhojindia.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Formatted Customer ID (`DKI-100001`) |
| `tenant_id` | TEXT | UNIQUE, REFERENCES tenants(id) | Linked tenant account |
| `organization_name`| TEXT | NOT NULL | Client business legal name |
| `contact_person`| TEXT | NOT NULL | Primary technical administrator |
| `email` | TEXT | NOT NULL | Notification email address |
| `phone` | TEXT | NOT NULL | Primary contact phone number |
| `address` | TEXT | NULLABLE | Physical facility street address |
| `city` | TEXT | NULLABLE | Operating city |
| `state` | TEXT | NULLABLE | Operating state/province |
| `pincode` | TEXT | NULLABLE | Postal PIN code |
| `gstin` | TEXT | NULLABLE | Indian GST Identification Number |
| `industry` | TEXT | NOT NULL | Industry category (e.g. Healthcare, Diagnostics) |
| `assigned_support_user_id` | TEXT | REFERENCES users(id) | Designated Digikhojindia manager |
| `status` | TEXT | DEFAULT 'active' | `active` or `inactive` |

---

### 3.4. `tickets`
Central ticketing engine tracking client issues and SLAs.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Formatted Ticket ID (`DKI-2026-00001`) |
| `customer_id` | TEXT | NOT NULL, REFERENCES customers(id)| Raising organization ID |
| `tenant_id` | TEXT | NOT NULL, REFERENCES tenants(id) | Tenant security boundary |
| `subject` | TEXT | NOT NULL | Problem headline summary |
| `description` | TEXT | NOT NULL | Comprehensive incident details |
| `category` | TEXT | NOT NULL | One of 10 issue categories |
| `priority` | TEXT | NOT NULL | `Low`, `Medium`, `High`, `Critical` |
| `status` | TEXT | NOT NULL | `Open`, `Assigned`, `In Progress`, `Waiting for Customer`, `Resolved`, `Closed` |
| `assigned_to` | TEXT | REFERENCES users(id) | Support engineer assigned |
| `sla_deadline` | TEXT | NOT NULL | Calculated SLA resolution deadline |
| `resolved_at` | TEXT | NULLABLE | Resolution completion timestamp |
| `customer_rating` | INTEGER | NULLABLE (1-5) | Star rating given by customer |
| `customer_feedback` | TEXT | NULLABLE | Feedback text upon resolution |

---

### 3.5. `ticket_replies`
Threaded discussion messages and internal notes on support tickets.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Reply identifier |
| `ticket_id` | TEXT | NOT NULL, REFERENCES tickets(id) | Parent ticket |
| `user_id` | TEXT | NOT NULL, REFERENCES users(id) | Author user |
| `message` | TEXT | NOT NULL | Message body text |
| `is_internal_note`| INTEGER| DEFAULT 0 | 1 if note is restricted to staff only |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Timestamp |

---

### 3.6. `amc_contracts`
Annual Maintenance Contracts and Lifetime Free AMC tracking.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Formatted AMC ID (`AMC-2026-00001`) |
| `customer_id` | TEXT | NOT NULL, REFERENCES customers(id)| Contract holder |
| `tenant_id` | TEXT | NOT NULL, REFERENCES tenants(id) | Tenant security boundary |
| `software_name`| TEXT | NOT NULL | Covered software deployment |
| `start_date` | TEXT | NOT NULL | Effective start date |
| `end_date` | TEXT | NOT NULL | Expiration date |
| `status` | TEXT | DEFAULT 'active' | `active`, `expiring`, `expired` |
| `coverage_type`| TEXT | NOT NULL | e.g., 'Lifetime Free AMC (Core Software)' |
| `included_services`| TEXT | JSON Array | List of covered maintenance tasks |
| `excluded_services`| TEXT | JSON Array | Excluded tasks requiring change orders |
| `notes` | TEXT | NULLABLE | Legal contract conditions |

---

### 3.7. `invoices` & `invoice_items`
GST-compliant billing records and line item breakdowns.

**`invoices`:**
- `id`: Unique record ID
- `invoice_number`: Formatted Invoice ID (`INV-2026-00001`)
- `customer_id`: References `customers(id)`
- `tenant_id`: References `tenants(id)`
- `issue_date` & `due_date`: Billing dates
- `subtotal`: Taxable amount
- `tax_rate`: 18% GST standard
- `tax_amount`: 18% calculated tax (CGST 9% + SGST 9%)
- `discount`: Discount applied
- `total_amount`: Net invoice payable
- `paid_amount`: Total payments recorded
- `payment_status`: `paid`, `partial`, `pending`, `overdue`

---

## 4. Database Indexing Strategy

To guarantee rapid queries across large multi-tenant datasets, the schema establishes the following composite B-tree indexes:

```sql
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_tickets_tenant_status ON tickets(tenant_id, status);
CREATE INDEX idx_tickets_customer ON tickets(customer_id);
CREATE INDEX idx_ticket_replies_ticket ON ticket_replies(ticket_id);
CREATE INDEX idx_amc_tenant ON amc_contracts(tenant_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```
