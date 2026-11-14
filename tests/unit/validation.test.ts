import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  customerCreateSchema,
  ticketCreateSchema,
  ticketReplySchema,
  amcCreateSchema,
  invoiceCreateSchema,
  enquiryCreateSchema,
  leadCreateSchema,
} from '@digikhojindia/validation';

describe('Validation Schemas (Zod)', () => {
  describe('Authentication Validation', () => {
    it('validates compliant credentials', () => {
      const valid = loginSchema.safeParse({
        email: 'admin@digikhojindia.com',
        password: 'Password123!',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects invalid emails and short passwords', () => {
      const invalid = loginSchema.safeParse({
        email: 'not-an-email',
        password: '',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('Customer Creation Validation', () => {
    it('validates full customer profile', () => {
      const res = customerCreateSchema.safeParse({
        organization_name: 'Metro Diagnostics Group',
        contact_person: 'Dr. Suresh Kumar',
        email: 'info@metrodiag.com',
        phone: '9988776655',
        type: 'enterprise',
        address: '5th Floor, Health Tower, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        gstin: '29ABCDE1234F1Z5',
      });
      expect(res.success).toBe(true);
    });

    it('fails when organization name is too short', () => {
      const res = customerCreateSchema.safeParse({
        organization_name: 'M',
        contact_person: '',
        email: 'invalid',
        phone: '123',
        type: 'hospital',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('Ticket & Replies Validation', () => {
    it('validates valid support ticket payload', () => {
      const res = ticketCreateSchema.safeParse({
        customer_id: 'DKI-100001',
        subject: 'Barcode scanner driver disconnects intermittently',
        description: 'During peak OPD hours, scanner loses USB handshake on terminal 3.',
        category: 'Software Issue',
        priority: 'High',
      });
      expect(res.success).toBe(true);
    });

    it('rejects invalid category or priority', () => {
      const res = ticketCreateSchema.safeParse({
        customer_id: 'DKI-100001',
        subject: 'Test issue',
        description: 'Details here',
        category: 'NotACategory',
        priority: 'UrgentNow',
      });
      expect(res.success).toBe(false);
    });

    it('validates ticket reply payload', () => {
      const res = ticketReplySchema.safeParse({
        message: 'Checked USB power-saving settings in Windows registry.',
      });
      expect(res.success).toBe(true);
    });
  });

  describe('Invoice & GST Calculations Validation', () => {
    it('validates compliant invoice with line items', () => {
      const res = invoiceCreateSchema.safeParse({
        customer_id: 'DKI-100001',
        issue_date: '2026-06-01',
        due_date: '2026-06-15',
        items: [
          {
            description: 'HMIS Cloud Subscription - Q2 2026',
            quantity: 1,
            unit_price: 150000,
            gst_rate: 18,
          },
        ],
        discount_amount: 0,
      });
      expect(res.success).toBe(true);
    });
  });

  describe('CRM Enquiries & Leads Validation', () => {
    it('validates website enquiry form submission', () => {
      const res = enquiryCreateSchema.safeParse({
        type: 'demo',
        name: 'Dr. Anita Roy',
        email: 'anita@citycare.org',
        phone: '9123456789',
        company: 'City Care Hospital',
        service_interest: 'Hospital Management Systems (HMIS)',
        message: 'We are expanding to a 200-bed campus and need full LIS/HMIS automation.',
      });
      expect(res.success).toBe(true);
    });

    it('validates lead lifecycle stage transition', () => {
      const res = leadCreateSchema.safeParse({
        name: 'Dr. Anita Roy',
        company_name: 'City Care Hospital',
        email: 'anita@citycare.org',
        phone: '9123456789',
        source: 'Website Enquiry',
        stage: 'Qualified',
        estimated_value: 850000,
      });
      expect(res.success).toBe(true);
    });
  });
});
