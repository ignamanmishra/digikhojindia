/**
 * DIGIKHOJINDIA API INTEGRATION & MULTI-TENANT ISOLATION TESTS
 * Vitest Test Suite covering Auth, RBAC, Multi-tenancy, Ticketing & Invoicing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../apps/api/src/index';

describe('Digikhojindia Platform API Suite', () => {
  // 1. Health Endpoint
  describe('GET /api/health', () => {
    it('returns healthy status with brand attribution', async () => {
      const res = await app.request('/api/health');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe('healthy');
      expect(json.platform).toBe('Digikhojindia');
      expect(json.owner).toBe('Naman Mishra');
      expect(json.email).toBe('info@digikhojindia.com');
    });
  });

  // 2. Authentication & Session Security
  describe('Authentication (/api/auth)', () => {
    it('successfully logs in super admin with valid credentials', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'info@digikhojindia.com',
          password: 'Password123!',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.token).toBeDefined();
      expect(json.user.role).toBe('super_admin');
      expect(json.user.email).toBe('info@digikhojindia.com');
      expect(json.permissions).toContain('customers:write');
      expect(json.permissions).toContain('tickets:internal_notes');
    });

    it('successfully logs in hospital customer admin', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@cityhospital.com',
          password: 'Password123!',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.role).toBe('customer_admin');
      expect(json.customer).toBeDefined();
      expect(json.customer.organization_name).toBe('City Care Multi-Speciality Hospital');
    });

    it('rejects invalid password with 401', async () => {
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'info@digikhojindia.com',
          password: 'WrongPassword!',
        }),
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('rejects unauthenticated requests to protected endpoints with 401', async () => {
      const res = await app.request('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  // 3. Multi-Tenant Isolation & Security
  describe('Multi-Tenant Isolation & Role Boundaries', () => {
    let adminToken: string;
    let cityCareToken: string;
    let apexToken: string;

    beforeEach(async () => {
      // Login Admin
      const rAdmin = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@digikhojindia.com', password: 'Password123!' }),
      });
      const jAdmin = await rAdmin.json();
      adminToken = jAdmin.token;

      // Login City Care (Customer A)
      const rCity = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@cityhospital.com', password: 'Password123!' }),
      });
      const jCity = await rCity.json();
      cityCareToken = jCity.token;

      // Login Apex (Customer B)
      const rApex = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'manager@apexdiagnostics.com', password: 'Password123!' }),
      });
      const jApex = await rApex.json();
      apexToken = jApex.token;
    });

    it('Customer A (City Care) CANNOT view Customer B (Apex) ticket', async () => {
      // DKI-2026-00002 belongs to Apex
      const res = await app.request('/api/tickets/DKI-2026-00002', {
        headers: { Authorization: `Bearer ${cityCareToken}` },
      });

      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Forbidden');
    });

    it('Customer CANNOT view internal support notes on their ticket', async () => {
      // DKI-2026-00001 belongs to City Care
      const res = await app.request('/api/tickets/DKI-2026-00001', {
        headers: { Authorization: `Bearer ${cityCareToken}` },
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ticket.id).toBe('DKI-2026-00001');
      // internal_notes should be strictly empty array for customer
      expect(json.internal_notes).toEqual([]);
    });

    it('Staff CAN view internal support notes', async () => {
      const res = await app.request('/api/tickets/DKI-2026-00001', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.internal_notes.length).toBeGreaterThan(0);
      expect(json.internal_notes[0].note).toContain('print spooler');
    });

    it('Customer CANNOT post internal notes (403 Forbidden)', async () => {
      const res = await app.request('/api/tickets/DKI-2026-00001/internal-notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cityCareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: 'Attempting unauthorized internal note' }),
      });

      expect(res.status).toBe(403);
    });
  });

  // 4. Ticket Lifecycle Workflow
  describe('End-to-End Support Ticket Lifecycle', () => {
    let customerToken: string;
    let staffToken: string;
    let createdTicketId: string;

    beforeEach(async () => {
      const rCust = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@cityhospital.com', password: 'Password123!' }),
      });
      customerToken = (await rCust.json()).token;

      const rStaff = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'support@digikhojindia.com', password: 'Password123!' }),
      });
      staffToken = (await rStaff.json()).token;
    });

    it('Step 1: Customer creates a new ticket', async () => {
      const res = await app.request('/api/tickets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: 'DKI-100001',
          subject: 'ICU Monitor Integration Sync Glitch',
          description: 'ICU Bed 4 cardiac monitor telemetry data is not reflecting in HMIS.',
          category: 'Software Issue',
          priority: 'High',
        }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.ticket.id).toMatch(/^DKI-2026-\d{5}$/);
      expect(json.ticket.status).toBe('Open');
      createdTicketId = json.ticket.id;
    });

    it('Step 2: Support employee replies to ticket', async () => {
      const res = await app.request(`/api/tickets/${createdTicketId}/replies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${staffToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, our telemetry bridge driver has been restarted. Please verify sync now.',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.reply.is_customer).toBe(false);
    });

    it('Step 3: Customer confirms resolution and rates 5 stars', async () => {
      const res = await app.request(`/api/tickets/${createdTicketId}/confirm-resolution`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: 5,
          feedback: 'Resolved very quickly! Bed 4 telemetry is streaming perfectly.',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ticket.status).toBe('Closed');
      expect(json.ticket.customer_feedback_rating).toBe(5);
    });
  });

  // 5. CRM & Enquiries -> Automation
  describe('Website Enquiry & Automation Engine', () => {
    it('public enquiry automatically creates CRM lead with source tracking', async () => {
      const res = await app.request('/api/crm/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          name: 'Alok Gupta',
          email: 'alok@guptasurgicals.com',
          phone: '+91 9988776655',
          company: 'Gupta Surgicals',
          service_interest: 'Custom Software Development',
          message: 'We need a bespoke inventory & ERP software for our surgical distribution network.',
        }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.notification).toBeDefined();
      expect(json.notification.sent).toBe(true);
      expect(json.notification.recipients).toContain('namanmishraofficial@gmail.com');
      expect(json.notification.recipients).toContain('info@digikhojindia.online');

      // Verify that CRM lead was created
      const rAdmin = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@digikhojindia.com', password: 'Password123!' }),
      });
      const token = (await rAdmin.json()).token;

      const leadsRes = await app.request('/api/crm/leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const leadsJson = await leadsRes.json();
      const createdLead = leadsJson.leads.find((l: any) => l.email === 'alok@guptasurgicals.com');
      expect(createdLead).toBeDefined();
      expect(createdLead.source).toBe('Quote Request');
      expect(createdLead.stage).toBe('New');
    });
  });

  // 6. Billing & Invoicing Engine
  describe('Billing & Invoice Calculations', () => {
    it('creates invoice with 18% GST and calculates line totals accurately', async () => {
      const rAdmin = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@digikhojindia.com', password: 'Password123!' }),
      });
      const token = (await rAdmin.json()).token;

      const res = await app.request('/api/invoices', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: 'DKI-100001',
          issue_date: '2026-11-14',
          due_date: '2026-11-30',
          discount_amount: 10000,
          items: [
            {
              description: 'Hospital Cloudflare Edge Security Setup',
              quantity: 2,
              unit_price: 25000,
              gst_rate: 18,
            },
          ],
        }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      const inv = json.invoice;
      expect(inv.id).toMatch(/^INV-2026-\d{5}$/);
      expect(inv.subtotal).toBe(50000); // 2 * 25,000
      expect(inv.tax_amount).toBe(9000); // 18% of 50,000
      expect(inv.discount_amount).toBe(10000);
      expect(inv.total_amount).toBe(49000); // 50000 + 9000 - 10000
      expect(inv.balance_due).toBe(49000);
      expect(inv.status).toBe('Sent');
    });
  });
});

