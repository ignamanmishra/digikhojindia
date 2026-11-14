# REST API Documentation & Integration Reference

> **Digikhojindia Platform**  
> Owned by Naman Mishra | Email: info@digikhojindia.com  
> Framework: Hono v4 on Cloudflare Workers

---

## 1. General API Conventions

- **Base URL:** `http://localhost:8787/api` (or `https://api.yourdomain.com/api` in production)
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <TOKEN>` header

### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": "Descriptive human-readable error message"
}
```

---

## 2. Health & Platform Status

### `GET /api/health`
Returns system status and brand attribution. No authentication required.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "platform": "Digikhojindia",
  "owner": "Naman Mishra",
  "email": "info@digikhojindia.com",
  "timestamp": "2026-11-14T15:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 3. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and returns a signed bearer token.

**Request Body:**
```json
{
  "email": "rajesh@cityhospital.com",
  "password": "Customer@12345"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-client-rajesh",
    "email": "rajesh@cityhospital.com",
    "name": "Dr. Rajesh Verma",
    "role": "customer_admin",
    "tenant_id": "tenant-city-hospital",
    "customer_id": "DKI-100001",
    "organization_name": "City Hospital & Research Centre"
  }
}
```

### `GET /api/auth/me`
Retrieves currently authenticated session identity. Requires Bearer Token.

---

## 4. Support Ticketing Endpoints

### `GET /api/tickets`
Lists tickets. Constrained by the authenticated user's `tenant_id` if the user is a customer.

**Query Parameters:**
- `status`: Filter by status (`Open`, `In Progress`, `Resolved`, `Closed`)
- `priority`: Filter by priority (`Low`, `Medium`, `High`, `Critical`)

### `POST /api/tickets`
Creates a new support ticket.

**Request Body:**
```json
{
  "customer_id": "DKI-100001",
  "subject": "Intermittent Barcode Disconnection",
  "description": "LIS barcode scanner drops connection during high volume OPD registrations.",
  "category": "Software Issue",
  "priority": "High"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "ticket": {
    "id": "DKI-2026-00004",
    "customer_id": "DKI-100001",
    "subject": "Intermittent Barcode Disconnection",
    "status": "Open",
    "priority": "High",
    "sla_deadline": "2026-11-15T00:00:00.000Z"
  }
}
```

### `GET /api/tickets/:id`
Retrieves ticket details and message thread.
- Automatically strips `is_internal_note = 1` replies when requested by client accounts.
- Enforces cross-tenant protection (returns `403 Forbidden` if tenant ID does not match).

### `POST /api/tickets/:id/replies`
Appends a reply message to the ticket thread. Visible to both customer and staff.

### `POST /api/tickets/:id/internal-notes`
Appends an internal staff note.
- **Permission Required:** `tickets:internal_notes`
- Customer accounts receive `403 Forbidden` if attempting to call this endpoint.

### `POST /api/tickets/:id/confirm-resolution`
Enables the client to confirm ticket resolution and submit satisfaction metrics.

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Promptly resolved by updating scanner drivers."
}
```

---

## 5. AMC Management Endpoints

### `GET /api/amc`
Lists active AMC agreements for the authenticated user's organization.

### `POST /api/amc`
Registers a new Annual Maintenance Contract.
- **Permission Required:** `amc:write`

**Request Body:**
```json
{
  "customer_id": "DKI-100001",
  "software_name": "Hospital Management Information System (HMIS)",
  "start_date": "2026-01-01",
  "end_date": "2027-01-01",
  "is_lifetime_free": true,
  "coverage_type": "Lifetime Free AMC (Subject to agreed contract terms)",
  "included_services": [
    "Security patches",
    "Database backup integrity verification",
    "Emergency bug resolution"
  ],
  "excluded_services": [
    "New feature development",
    "Third-party SMS/cloud infrastructure fees"
  ],
  "contract_terms": "Standard Lifetime AMC terms under Digikhojindia Service Agreement."
}
```

---

## 6. Billing & Invoicing Endpoints

### `GET /api/invoices`
Lists customer invoices with GST calculations and payment status.

### `POST /api/invoices`
Generates a new tax invoice. Automatically calculates 18% GST (CGST 9% + SGST 9%).

**Request Body:**
```json
{
  "customer_id": "DKI-100001",
  "issue_date": "2026-06-01",
  "due_date": "2026-06-15",
  "items": [
    {
      "description": "HMIS Cloud Enterprise Quarterly Subscription",
      "quantity": 1,
      "unit_price": 100000,
      "gst_rate": 18
    }
  ],
  "discount_amount": 0
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "invoice": {
    "id": "inv-xxx",
    "invoice_number": "INV-2026-00002",
    "subtotal": 100000,
    "tax_amount": 18000,
    "total_amount": 118000,
    "payment_status": "pending"
  }
}
```

### `POST /api/invoices/:id/payments`
Records a payment received against an invoice. Updates `paid_amount` and recalculates status (`partial` or `paid`).

---

## 7. CRM & Automation Endpoints

### `POST /api/crm/enquiries`
Public endpoint for website contact, quote, and demo requests. Automatically converts into CRM leads.

**Request Body:**
```json
{
  "type": "demo",
  "name": "Dr. Sunita Patel",
  "email": "sunita@careplusclinic.in",
  "phone": "+91 98765 00112",
  "company": "CarePlus Diagnostic Clinics",
  "service_interest": "Hospital Management Systems (HMIS)",
  "message": "Interested in HMIS and LIS integration for 3 clinic locations."
}
```

### `GET /api/crm/leads`
Lists sales leads with stage tracking (`New` -> `Contacted` -> `Qualified` -> `Proposal` -> `Negotiation` -> `Won`/`Lost`).

---

## 8. Reports & Analytics Endpoints

- `GET /api/reports/admin-overview`: Comprehensive executive dashboard metrics (customers, active projects, SLA adherence, monthly revenue).
- `GET /api/reports/portal-summary`: Client cockpit summary (active software, unresolved tickets, AMC validity, pending payments).

