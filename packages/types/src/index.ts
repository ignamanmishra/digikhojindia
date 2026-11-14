/**
 * DIGIKHOJINDIA DOMAIN TYPES AND INTERFACES
 * Owner: Naman Mishra
 * Platform: Digikhojindia
 */

// ==========================================
// 1. Roles and Permissions
// ==========================================
export type SystemRole =
  | 'super_admin'
  | 'admin'
  | 'it_manager'
  | 'project_manager'
  | 'support_executive'
  | 'developer'
  | 'seo_manager'
  | 'accountant'
  | 'customer_admin'
  | 'customer_employee';

export type PermissionAction =
  | 'customers:read'
  | 'customers:write'
  | 'customers:delete'
  | 'tickets:read'
  | 'tickets:write'
  | 'tickets:assign'
  | 'tickets:internal_notes'
  | 'tickets:delete'
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  | 'crm:read'
  | 'crm:write'
  | 'crm:delete'
  | 'amc:read'
  | 'amc:write'
  | 'invoices:read'
  | 'invoices:write'
  | 'cms:read'
  | 'cms:write'
  | 'seo:read'
  | 'seo:write'
  | 'users:read'
  | 'users:write'
  | 'automation:read'
  | 'automation:write'
  | 'settings:read'
  | 'settings:write'
  | 'audit:read'
  | 'reports:read';

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: SystemRole;
  is_active: boolean;
  avatar_url?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  tenant_id: string;
  token: string;
  expires_at: string;
  created_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface AuthContext {
  user: User;
  session: Session;
  permissions: PermissionAction[];
}

// ==========================================
// 2. Tenants & Customers
// ==========================================
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantBranch {
  id: string;
  tenant_id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  is_headquarters: boolean;
  created_at: string;
}

export type CustomerType = 'hospital' | 'clinic' | 'enterprise' | 'startup' | 'individual';

export interface Customer {
  id: string; // e.g. DKI-100001
  tenant_id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  type: CustomerType;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  gstin?: string | null;
  assigned_support_user_id?: string | null;
  assigned_support_user_name?: string | null;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerContact {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  designation?: string | null;
  is_primary: boolean;
  created_at: string;
}

// ==========================================
// 3. Software Products & Customer Deployments
// ==========================================
export type SoftwareCategoryType =
  | 'HMIS'
  | 'Executive'
  | 'Assets'
  | 'CRM'
  | 'LIS'
  | 'Radiology'
  | 'IVF'
  | 'OT'
  | 'Nursing'
  | 'Salon'
  | 'Coupons'
  | 'Automation'
  | 'Communication'
  | 'BI'
  | 'Custom';

export interface SoftwareProduct {
  id: string;
  name: string;
  slug: string;
  category: SoftwareCategoryType;
  short_description: string;
  full_description: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
  demo_video_url?: string | null;
  is_public: boolean;
  is_sample: boolean; // Must be marked as sample/demo until verified
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerSoftware {
  id: string;
  customer_id: string;
  product_id: string;
  product_name: string;
  license_key?: string | null;
  deployed_url?: string | null;
  version: string;
  status: 'active' | 'suspended' | 'expired';
  installed_at: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 4. Support Ticket System
// ==========================================
export type TicketCategory =
  | 'Software Issue'
  | 'Bug Report'
  | 'Feature Request'
  | 'Website Issue'
  | 'Server Issue'
  | 'Networking Issue'
  | 'CCTV Issue'
  | 'Automation Issue'
  | 'Billing Issue'
  | 'Other';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Customer'
  | 'Resolved'
  | 'Closed';

export interface Ticket {
  id: string; // e.g. DKI-2026-00001
  tenant_id: string;
  customer_id: string;
  customer_organization?: string;
  customer_name?: string;
  customer_email?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_employee_id?: string | null;
  assigned_employee_name?: string | null;
  customer_software_id?: string | null;
  sla_breach: boolean;
  sla_due_at: string;
  resolution_notes?: string | null;
  customer_feedback_rating?: number | null; // 1-5
  customer_feedback_comment?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  sender_user_id: string;
  sender_name: string;
  sender_role: SystemRole;
  is_customer: boolean;
  message: string;
  created_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  reply_id?: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface TicketInternalNote {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  note: string;
  created_at: string;
}

// ==========================================
// 5. AMC Management
// ==========================================
export type AmcStatus = 'active' | 'expiring_soon' | 'expired' | 'terminated';

export interface AmcContract {
  id: string; // Contract Number, e.g. AMC-2026-001
  tenant_id: string;
  customer_id: string;
  customer_name?: string;
  software_id?: string | null;
  software_name?: string | null;
  start_date: string;
  end_date: string;
  is_lifetime_free: boolean; // Subject to agreed terms
  contract_terms: string;
  coverage_details: string[];
  included_services: string[];
  excluded_services: string[];
  status: AmcStatus;
  document_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AmcServiceRecord {
  id: string;
  contract_id: string;
  service_date: string;
  engineer_id: string;
  engineer_name: string;
  service_summary: string;
  notes?: string | null;
  customer_signoff: boolean;
  created_at: string;
}

// ==========================================
// 6. CRM & Lead Management
// ==========================================
export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Website Enquiry'
  | 'Contact Form'
  | 'Demo Request'
  | 'Quote Request'
  | 'Google Business Profile'
  | 'Referral'
  | 'Direct';

export interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  company_name: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: LeadStage;
  estimated_value?: number | null;
  assigned_user_id?: string | null;
  assigned_user_name?: string | null;
  next_follow_up_date?: string | null;
  notes?: string | null;
  lost_reason?: string | null;
  converted_customer_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  user_name: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  summary: string;
  details?: string | null;
  created_at: string;
}

export interface WebsiteEnquiry {
  id: string;
  type: 'contact' | 'demo' | 'quote';
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service_interest: string;
  message: string;
  status: 'pending' | 'processed' | 'converted';
  ip_address?: string | null;
  created_at: string;
}

// ==========================================
// 7. Project Management
// ==========================================
export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'On Hold'
  | 'Testing'
  | 'Completed'
  | 'Cancelled';

export interface Project {
  id: string;
  tenant_id: string;
  customer_id: string;
  customer_name?: string;
  title: string;
  description: string;
  project_manager_id: string;
  project_manager_name?: string;
  start_date: string;
  target_end_date: string;
  status: ProjectStatus;
  progress_percent: number; // 0-100
  budget?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  assigned_user_id?: string | null;
  assigned_user_name?: string | null;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date?: string | null;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 8. Billing & Invoices
// ==========================================
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  gst_rate: number; // e.g. 18 for 18%
  gst_amount: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g. INV-2026-00001
  tenant_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_gstin?: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  items?: InvoiceItem[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  customer_id: string;
  amount: number;
  payment_method: 'Bank Transfer' | 'UPI' | 'Cheque' | 'Cash' | 'Credit Card';
  reference_number?: string | null;
  payment_date: string;
  notes?: string | null;
  created_at: string;
}

export interface ExpenseRecord {
  id: string;
  tenant_id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  receipt_url?: string | null;
  created_at: string;
}

// ==========================================
// 9. Website CMS & Publishing
// ==========================================
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  content: string; // HTML/Markdown
  featured_image?: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar?: string | null;
  is_published: boolean;
  published_at?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  youtube_video_id: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

// ==========================================
// 10. Automation & Integrations
// ==========================================
export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger_event:
    | 'enquiry.created'
    | 'ticket.created'
    | 'ticket.assigned'
    | 'ticket.resolved'
    | 'amc.expiring'
    | 'invoice.overdue'
    | 'customer.created';
  actions: {
    type: 'send_email' | 'send_whatsapp' | 'send_sms' | 'create_task' | 'webhook';
    config: Record<string, unknown>;
  }[];
  is_active: boolean;
  created_at: string;
}

export interface IntegrationSetting {
  provider: 'resend' | 'whatsapp' | 'sms' | 'google';
  name: string;
  is_connected: boolean;
  config_masked: Record<string, string>;
  updated_at: string;
}

// ==========================================
// 11. Audit Logs & System Settings
// ==========================================
export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id?: string | null;
  user_name?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  ip_address?: string | null;
  details?: Record<string, unknown> | null;
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}
