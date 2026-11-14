/**
 * DIGIKHOJINDIA CRM & LEAD MANAGEMENT ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { enquiryCreateSchema, leadCreateSchema, leadUpdateSchema } from '@digikhojindia/validation';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { Lead, WebsiteEnquiry } from '@digikhojindia/types';

export const crmRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// 1. PUBLIC WEBSITE ENQUIRY INGESTION (No auth required, Turnstile-ready)
crmRoutes.post('/enquiries', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = enquiryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const enquiryId = `enq-${Date.now()}`;
    const newEnquiry: WebsiteEnquiry = {
      id: enquiryId,
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      service_interest: data.service_interest,
      message: data.message,
      status: 'pending',
      ip_address: c.req.header('cf-connecting-ip') || '127.0.0.1',
      created_at: new Date().toISOString(),
    };

    globalStore.enquiries.set(enquiryId, newEnquiry);

    // Business Automation Trigger: New enquiry -> Auto-create CRM lead
    const leadId = `lead-${Date.now()}`;
    const autoLead: Lead = {
      id: leadId,
      tenant_id: 'tenant-dki-main',
      name: data.name,
      company_name: data.company || `${data.name}'s Organization`,
      email: data.email,
      phone: data.phone,
      source:
        data.type === 'demo'
          ? 'Demo Request'
          : data.type === 'quote'
          ? 'Quote Request'
          : 'Website Enquiry',
      stage: 'New',
      notes: `Automated lead created from website ${data.type} form. Service Interest: ${data.service_interest}. Message: ${data.message}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    globalStore.leads.set(leadId, autoLead);

    return c.json({
      success: true,
      message: 'Thank you for reaching out to Digikhojindia! Our technical team will contact you shortly.',
      enquiry_id: enquiryId,
    }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Submission failed' }, 500);
  }
});

// 2. PROTECTED CRM ROUTES (Internal Staff)
crmRoutes.use('*', authMiddleware);

// List Leads
crmRoutes.get('/leads', requirePermission('crm:read'), async (c) => {
  const stage = c.req.query('stage');
  let list = Array.from(globalStore.leads.values());

  if (stage) {
    list = list.filter((l) => l.stage === stage);
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return c.json({ success: true, leads: list, total: list.length });
});

// Create Lead
crmRoutes.post('/leads', requirePermission('crm:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = leadCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const leadId = `lead-${Date.now()}`;
    const newLead: Lead = {
      id: leadId,
      tenant_id: 'tenant-dki-main',
      name: data.name,
      company_name: data.company_name,
      email: data.email,
      phone: data.phone,
      source: data.source,
      stage: data.stage || 'New',
      estimated_value: data.estimated_value || 0,
      assigned_user_id: data.assigned_user_id || null,
      next_follow_up_date: data.next_follow_up_date || null,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.leads.set(leadId, newLead);

    return c.json({ success: true, message: 'Lead created successfully', lead: newLead }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Update Lead Stage / Details
crmRoutes.patch('/leads/:id/stage', requirePermission('crm:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const lead = globalStore.leads.get(id);
    if (!lead) {
      return c.json({ success: false, error: 'Lead not found' }, 404);
    }

    const body = await c.req.json();
    const { stage, notes, next_follow_up_date } = body;

    if (stage) lead.stage = stage;
    if (notes) lead.notes = notes;
    if (next_follow_up_date) lead.next_follow_up_date = next_follow_up_date;
    lead.updated_at = new Date().toISOString();

    return c.json({ success: true, message: `Lead updated to stage ${lead.stage}`, lead });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// List Enquiries
crmRoutes.get('/enquiries', requirePermission('crm:read'), async (c) => {
  const list = Array.from(globalStore.enquiries.values());
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return c.json({ success: true, enquiries: list, total: list.length });
});
