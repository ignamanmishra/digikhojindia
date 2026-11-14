import { describe, it, expect } from 'vitest';
import {
  generateCustomerId,
  generateTicketId,
  generateInvoiceId,
  generateAmcId,
  formatCurrencyINR,
  formatDate,
  formatDateTime,
  hasPermission,
  ROLE_PERMISSIONS,
  BRAND_CONSTANTS,
} from '@digikhojindia/shared';

describe('Shared Utilities & Business Rules', () => {
  describe('Brand Constants', () => {
    it('enforces exact owner, email, and brand tagline', () => {
      expect(BRAND_CONSTANTS.COMPANY_NAME).toBe('Digikhojindia');
      expect(BRAND_CONSTANTS.OWNER).toBe('Naman Mishra');
      expect(BRAND_CONSTANTS.EMAIL).toBe('info@digikhojindia.com');
      expect(BRAND_CONSTANTS.TAGLINE).toBe("We Don't Just Build Software. We Automate Your Entire Business.");
      expect(BRAND_CONSTANTS.FOOTER_ATTRIBUTION).toBe('© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.');
      expect(BRAND_CONSTANTS.AMC_MARKETING_PROPOSITION).toContain('Lifetime Free AMC');
      expect(BRAND_CONSTANTS.AMC_MARKETING_PROPOSITION).toContain('Subject to agreed contract terms');
    });
  });

  describe('ID Formats', () => {
    it('generates customer ID matching format DKI-100001', () => {
      const id = generateCustomerId(1);
      expect(id).toBe('DKI-100001');
      expect(generateCustomerId(42)).toBe('DKI-100042');
    });

    it('generates ticket ID matching format DKI-YYYY-00001', () => {
      const id = generateTicketId(1);
      const year = new Date().getFullYear();
      expect(id).toBe(`DKI-${year}-00001`);
    });

    it('generates invoice ID matching format INV-YYYY-00001', () => {
      const id = generateInvoiceId(1);
      const year = new Date().getFullYear();
      expect(id).toBe(`INV-${year}-00001`);
    });

    it('generates AMC ID matching format AMC-YYYY-00001', () => {
      const id = generateAmcId(1);
      const year = new Date().getFullYear();
      expect(id).toBe(`AMC-${year}-00001`);
    });
  });

  describe('Currency & Date Formatting', () => {
    it('formats Indian Rupees currency correctly', () => {
      const formatted = formatCurrencyINR(150000);
      expect(formatted).toContain('1,50,000');
    });

    it('formats dates consistently', () => {
      const formatted = formatDate('2026-05-15T10:00:00Z');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2026');
    });
  });

  describe('Granular RBAC Authorization Matrix', () => {
    it('allows super_admin full domain permissions', () => {
      expect(hasPermission('super_admin', 'tickets:delete')).toBe(true);
      expect(hasPermission('super_admin', 'crm:delete')).toBe(true);
      expect(hasPermission('super_admin', 'settings:write')).toBe(true);
    });

    it('allows admin all operational permissions without hard delete rights', () => {
      expect(hasPermission('admin', 'tickets:write')).toBe(true);
      expect(hasPermission('admin', 'invoices:write')).toBe(true);
      expect(hasPermission('admin', 'tickets:delete')).toBe(false);
    });

    it('isolates customer_admin from administrative modules', () => {
      expect(hasPermission('customer_admin', 'tickets:read')).toBe(true);
      expect(hasPermission('customer_admin', 'tickets:write')).toBe(true);
      expect(hasPermission('customer_admin', 'amc:read')).toBe(true);
      expect(hasPermission('customer_admin', 'invoices:read')).toBe(true);
      // Disallowed administrative areas
      expect(hasPermission('customer_admin', 'customers:read')).toBe(false);
      expect(hasPermission('customer_admin', 'crm:read')).toBe(false);
      expect(hasPermission('customer_admin', 'tickets:internal_notes')).toBe(false);
      expect(hasPermission('customer_admin', 'settings:write')).toBe(false);
    });

    it('isolates customer_employee to ticket interactions and project read only', () => {
      expect(hasPermission('customer_employee', 'tickets:read')).toBe(true);
      expect(hasPermission('customer_employee', 'tickets:write')).toBe(true);
      expect(hasPermission('customer_employee', 'tickets:internal_notes')).toBe(false);
      expect(hasPermission('customer_employee', 'crm:write')).toBe(false);
      expect(hasPermission('customer_employee', 'invoices:write')).toBe(false);
    });
  });
});
