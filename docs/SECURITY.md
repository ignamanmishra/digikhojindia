# Security Architecture & Compliance Specifications

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com

---

## 1. Security Philosophy & Principles

The Digikhojindia platform is engineered around **Defense in Depth** and **Least Privilege Access**. Because the platform manages sensitive hospital healthcare data, corporate asset registries, proprietary software licensing, and financial records, security is enforced across all architectural layers.

1. **Never Trust the Client:** Authorization is validated independently on every API endpoint. Frontend navigation hiding is purely for user ergonomics and is never relied upon for security.
2. **Zero-Leakage Multi-Tenancy:** Strict tenant isolation middleware guarantees that no customer account can query, alter, or view records belonging to another organization.
3. **Data Segregation for Internal Notes:** Sensitive internal discussions between developers and IT managers regarding architecture, server infrastructure, or bug reproduction are strictly filtered from customer view.

---

## 2. Password Cryptography & Session Management

### PBKDF2 WebCrypto Implementation
To ensure native compatibility with Cloudflare Workers' serverless V8 isolate execution environment without relying on external native C++ Node.js binaries, Digikhojindia employs standard WebCrypto `crypto.subtle`:

- **Algorithm:** PBKDF2 (Password-Based Key Derivation Function 2)
- **Hash Primitive:** HMAC-SHA-256
- **Iteration Count:** 100,000 rounds
- **Salt:** 16-byte cryptographically secure random bytes generated via `crypto.getRandomValues()`
- **Stored Format:** `pbkdf2:sha256:100000:<salt_hex>:<hash_hex>`

### Session Tokens
- **Format:** Cryptographically signed Bearer tokens containing user ID, tenant ID, and system role.
- **Lifetime:** 24 hours.
- **Revocation:** Tokens can be invalidated immediately upon user status deactivation.

---

## 3. Role-Based Access Control (RBAC) Matrix

The system enforces 10 discrete roles with strictly defined capability sets:

| Role | Domain Scope | Permissions |
|---|---|---|
| `super_admin` | Full Global Access | All permissions including `tickets:delete`, `crm:delete`, `settings:write` |
| `admin` | Internal Operations | All operational permissions without destructive deletion rights |
| `it_manager` | IT & Infrastructure | Tickets management, project supervision, AMC review, technical reports |
| `project_manager`| Projects & Sprints | Project creation/updates, task assignments, ticket review |
| `support_executive`| Customer Helpdesk | Ticket replies, SLA management, internal notes, customer lookup |
| `developer` | Engineering | Ticket inspection, technical updates, internal notes, sprint tasks |
| `seo_manager` | Website CMS | Blog management, video tutorials, meta tag configuration |
| `accountant` | Financial Operations | Invoicing, payment reconciliation, AMC financial records |
| `customer_admin` | Client Executive | Tenant tickets, software licenses, project viewing, AMC validity, invoices |
| `customer_employee`| Client Staff | Ticket creation/replies, project progress viewing |

---

## 4. Multi-Tenant Defense in Depth

```text
Incoming API Request
       │
       ▼
[1. authMiddleware] ──▶ Verifies token signature & active account status
       │
       ▼
[2. tenantMiddleware] ─▶ Checks if user is client:
       │                 - Enforces (record.tenant_id === user.tenant_id)
       │                 - Strips internal notes from payload
       │                 - Returns 403 Forbidden on boundary violation
       ▼
[3. requirePermission] ─▶ Checks action in ROLE_PERMISSIONS[user.role]
       │
       ▼
[4. Zod Validation] ───▶ Validates input fields, types, and constraints
       │
       ▼
Database Query Execution (D1 SQLite)
```

---

## 5. Cloudflare Turnstile & Bot Mitigation

Public forms (`/contact`, `/request-demo`, `/request-quote`) integrate **Cloudflare Turnstile** to block automated spam, credential stuffing, and DDoS attacks without requiring friction-heavy CAPTCHA puzzles.

---

## 6. Audit Logging & Compliance

All state modifications generate immutable audit logs stored in the `audit_logs` table:
- User Identifier & System Role
- Originating IP Address & User Agent
- Action Type (`CREATE`, `UPDATE`, `DELETE`, `REASSIGN`, `STATUS_CHANGE`)
- Target Entity Type (`customer`, `ticket`, `invoice`, `lead`, `amc`)
- Timestamp with millisecond precision

