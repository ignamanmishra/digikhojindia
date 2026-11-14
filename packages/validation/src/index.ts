/**
 * DIGIKHOJINDIA VALIDATION SCHEMAS (ZOD)
 * Owner: Naman Mishra
 * Platform: Digikhojindia
 */

import { z } from 'zod';

// ==========================================
// 1. Authentication
// ==========================================
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  turnstile_token: z.string().optional(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters long'),
  confirm_password: z.string().min(8, 'Confirm password must match'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

// ==========================================
// 2. Customer Management
// ==========================================
export const customerCreateSchema = z.object({
  organization_name: z.string().min(2, 'Organization name is required'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  type: z.enum(['hospital', 'clinic', 'enterprise', 'startup', 'individual']),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid Indian GSTIN format').optional().nullable(),
  assigned_support_user_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  initial_password: z.string().min(8, 'Initial password must be at least 8 characters').optional(),
});

export const customerUpdateSchema = customerCreateSchema.partial();

// ==========================================
// 3. Support Tickets
// ==========================================
export const ticketCategories = [
  'Software Issue',
  'Bug Report',
  'Feature Request',
  'Website Issue',
  'Server Issue',
  'Networking Issue',
  'CCTV Issue',
  'Automation Issue',
  'Billing Issue',
  'Other',
] as const;

export const ticketPriorities = ['Low', 'Medium', 'High', 'Critical'] as const;

export const ticketStatuses = [
  'Open',
  'Assigned',
  'In Progress',
  'Waiting for Customer',
  'Resolved',
  'Closed',
] as const;

export const ticketCreateSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(ticketCategories),
  priority: z.enum(ticketPriorities).default('Medium'),
  customer_software_id: z.string().optional().nullable(),
  attachments: z.array(z.string()).optional(),
});

export const ticketReplySchema = z.object({
  message: z.string().min(2, 'Reply message cannot be empty'),
  attachments: z.array(z.string()).optional(),
});

export const ticketInternalNoteSchema = z.object({
  note: z.string().min(2, 'Internal note cannot be empty'),
});

export const ticketResolutionConfirmSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

// ==========================================
// 4. AMC Management
// ==========================================
export const amcCreateSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  software_id: z.string().optional().nullable(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  is_lifetime_free: z.boolean().default(false),
  contract_terms: z.string().min(10, 'Contract terms are required'),
  coverage_details: z.array(z.string()).min(1, 'At least one coverage item required'),
  included_services: z.array(z.string()).min(1, 'Included services required'),
  excluded_services: z.array(z.string()).default([]),
});

// ==========================================
// 5. CRM & Enquiries
// ==========================================
export const enquiryCreateSchema = z.object({
  type: z.enum(['contact', 'demo', 'quote']),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  company: z.string().optional().nullable(),
  service_interest: z.string().min(2, 'Service of interest is required'),
  message: z.string().min(10, 'Please write at least 10 characters in your message'),
  turnstile_token: z.string().optional(),
});

export const leadCreateSchema = z.object({
  name: z.string().min(2, 'Contact name required'),
  company_name: z.string().min(2, 'Company name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  source: z.enum([
    'Website Enquiry',
    'Contact Form',
    'Demo Request',
    'Quote Request',
    'Google Business Profile',
    'Referral',
    'Direct',
  ]),
  stage: z.enum(['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']).default('New'),
  estimated_value: z.number().min(0).optional().nullable(),
  assigned_user_id: z.string().optional().nullable(),
  next_follow_up_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const leadUpdateSchema = leadCreateSchema.partial();

// ==========================================
// 6. Project & Task Management
// ==========================================
export const projectCreateSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  title: z.string().min(3, 'Project title is required'),
  description: z.string().min(10, 'Project description is required'),
  project_manager_id: z.string().min(1, 'Project manager is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  target_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['Planning', 'In Progress', 'On Hold', 'Testing', 'Completed', 'Cancelled']).default('Planning'),
  budget: z.number().min(0).optional().nullable(),
});

export const taskCreateSchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(3, 'Task title is required'),
  description: z.string().optional().nullable(),
  assigned_user_id: z.string().optional().nullable(),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']).default('Todo'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  due_date: z.string().optional().nullable(),
});

// ==========================================
// 7. Billing & Invoices
// ==========================================
export const invoiceItemSchema = z.object({
  description: z.string().min(2, 'Item description required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit_price: z.number().nonnegative('Unit price cannot be negative'),
  gst_rate: z.number().min(0).max(100).default(18),
});

export const invoiceCreateSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items: z.array(invoiceItemSchema).min(1, 'At least one invoice line item required'),
  discount_amount: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
});

export const paymentRecordSchema = z.object({
  invoice_id: z.string().min(1, 'Invoice is required'),
  amount: z.number().positive('Payment amount must be greater than zero'),
  payment_method: z.enum(['Bank Transfer', 'UPI', 'Cheque', 'Cash', 'Credit Card']),
  reference_number: z.string().optional().nullable(),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional().nullable(),
});

// ==========================================
// 8. CMS Publishing
// ==========================================
export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  short_description: z.string().min(10, 'Short description is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  featured_image: z.string().url().optional().nullable(),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).default([]),
  author_name: z.string().min(2, 'Author name is required'),
  is_published: z.boolean().default(false),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
});

export const videoSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  youtube_video_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, 'Invalid YouTube video ID'),
  category: z.string().min(2, 'Category is required'),
  is_published: z.boolean().default(true),
});

