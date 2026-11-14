/**
 * DIGIKHOJINDIA SHARED UTILITIES & CONSTANTS
 * Owner: Naman Mishra
 * Platform: Digikhojindia
 */

import type { SystemRole, PermissionAction } from '@digikhojindia/types';

// ==========================================
// 1. Brand Identity & Global Constants
// ==========================================
export const BRAND_CONSTANTS = {
  COMPANY_NAME: 'Digikhojindia',
  OWNER_NAME: 'Naman Mishra',
  OWNER: 'Naman Mishra',
  OFFICIAL_EMAIL: 'info@digikhojindia.com',
  EMAIL: 'info@digikhojindia.com',
  OFFICIAL_EMAIL_ONLINE: 'info@digikhojindia.online',
  OWNER_EMAIL: 'namanmishraofficial@gmail.com',
  PRIMARY_NOTIFICATION_EMAIL: 'namanmishraofficial@gmail.com',
  SECONDARY_NOTIFICATION_EMAIL: 'info@digikhojindia.online',
  NOTIFICATION_EMAILS: ['namanmishraofficial@gmail.com', 'info@digikhojindia.online'] as readonly string[],
  OFFICIAL_PHONE: '+91 89898 28902',
  PHONE: '+91 89898 28902',
  PHONE_RAW: '+918989828902',
  PHONE_TEL: 'tel:+918989828902',
  WHATSAPP_LINK: 'https://wa.me/918989828902',
  TAGLINE: "We Don't Just Build Software. We Automate Your Entire Business.",
  TAGLINE_HINDI: "Technology की हर नई खोज, आपके लिए!",
  FOOTER_COPYRIGHT: '© Digikhojindia. All Rights Reserved.',
  FOOTER_OWNERSHIP: 'Owned by Naman Mishra.',
  FOOTER_ATTRIBUTION: '© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.',
  LIFETIME_AMC_NOTE: 'Lifetime Free AMC – Subject to agreed contract terms.',
  AMC_MARKETING_PROPOSITION: 'Lifetime Free AMC – Subject to agreed contract terms.',
} as const;

// ==========================================
// 2. ID Generators (Strict Pattern Enforcement)
// ==========================================
export function generateCustomerId(sequence: number): string {
  // Format: DKI-100001
  const base = 100000 + sequence;
  return `DKI-${base}`;
}

export function generateTicketId(arg1: number, arg2?: number): string {
  // Format: DKI-2026-00001
  const year = arg2 !== undefined ? arg1 : new Date().getFullYear();
  const sequence = arg2 !== undefined ? arg2 : arg1;
  const padded = String(sequence).padStart(5, '0');
  return `DKI-${year}-${padded}`;
}

export function generateInvoiceId(arg1: number, arg2?: number): string {
  // Format: INV-2026-00001
  const year = arg2 !== undefined ? arg1 : new Date().getFullYear();
  const sequence = arg2 !== undefined ? arg2 : arg1;
  const padded = String(sequence).padStart(5, '0');
  return `INV-${year}-${padded}`;
}

export function generateAmcId(arg1: number, arg2?: number): string {
  // Format: AMC-2026-00001
  const year = arg2 !== undefined ? arg1 : new Date().getFullYear();
  const sequence = arg2 !== undefined ? arg2 : arg1;
  const padded = String(sequence).padStart(5, '0');
  return `AMC-${year}-${padded}`;
}

// ==========================================
// 3. Granular RBAC Permissions Matrix
// ==========================================
export const ROLE_PERMISSIONS: Record<SystemRole, PermissionAction[]> = {
  super_admin: [
    'customers:read',
    'customers:write',
    'customers:delete',
    'tickets:read',
    'tickets:write',
    'tickets:assign',
    'tickets:internal_notes',
    'tickets:delete',
    'projects:read',
    'projects:write',
    'projects:delete',
    'crm:read',
    'crm:write',
    'crm:delete',
    'amc:read',
    'amc:write',
    'invoices:read',
    'invoices:write',
    'cms:read',
    'cms:write',
    'seo:read',
    'seo:write',
    'users:read',
    'users:write',
    'automation:read',
    'automation:write',
    'settings:read',
    'settings:write',
    'audit:read',
    'reports:read',
  ],
  admin: [
    'customers:read',
    'customers:write',
    'tickets:read',
    'tickets:write',
    'tickets:assign',
    'tickets:internal_notes',
    'projects:read',
    'projects:write',
    'crm:read',
    'crm:write',
    'amc:read',
    'amc:write',
    'invoices:read',
    'invoices:write',
    'cms:read',
    'cms:write',
    'seo:read',
    'seo:write',
    'users:read',
    'automation:read',
    'reports:read',
  ],
  it_manager: [
    'tickets:read',
    'tickets:write',
    'tickets:assign',
    'tickets:internal_notes',
    'projects:read',
    'projects:write',
    'amc:read',
    'amc:write',
    'reports:read',
  ],
  project_manager: [
    'projects:read',
    'projects:write',
    'tickets:read',
    'tickets:write',
    'customers:read',
    'reports:read',
  ],
  support_executive: [
    'tickets:read',
    'tickets:write',
    'tickets:internal_notes',
    'customers:read',
    'amc:read',
  ],
  developer: [
    'tickets:read',
    'tickets:write',
    'tickets:internal_notes',
    'projects:read',
  ],
  seo_manager: [
    'cms:read',
    'cms:write',
    'seo:read',
    'seo:write',
  ],
  accountant: [
    'invoices:read',
    'invoices:write',
    'customers:read',
    'amc:read',
    'reports:read',
  ],
  customer_admin: [
    'tickets:read',
    'tickets:write',
    'projects:read',
    'amc:read',
    'invoices:read',
  ],
  customer_employee: [
    'tickets:read',
    'tickets:write',
    'projects:read',
  ],
};

export function hasPermission(role: SystemRole, action: PermissionAction): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}

// ==========================================
// 4. Formatting Utilities
// ==========================================
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
