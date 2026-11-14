/**
 * DIGIKHOJINDIA BUSINESS AUTOMATION ENGINE ENDPOINTS
 * Event-based workflow definitions and execution records
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

export const automationRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

automationRoutes.use('*', authMiddleware);

const activeWorkflows = [
  {
    id: 'wf-001',
    name: 'Website Enquiry -> Instant CRM Lead Pipeline',
    trigger_event: 'enquiry.created',
    description: 'When a new demo or quote request arrives on the website, auto-create a qualified CRM lead and tag with source.',
    actions: ['create_crm_lead', 'log_audit_event'],
    is_active: true,
    total_runs: 142,
    last_triggered: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'wf-002',
    name: 'New Support Ticket -> SLA Timer & Assignment Alert',
    trigger_event: 'ticket.created',
    description: 'Calculates dynamic SLA deadline based on priority (4h to 48h) and notifies assigned technical support engineer.',
    actions: ['calculate_sla', 'assign_engineer', 'log_audit_event'],
    is_active: true,
    total_runs: 89,
    last_triggered: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'wf-003',
    name: 'Ticket Resolved -> Customer Satisfaction Rating Request',
    trigger_event: 'ticket.resolved',
    description: 'When support marks a ticket as resolved, requests feedback and 1-5 star rating from customer.',
    actions: ['notify_customer_feedback', 'track_csat'],
    is_active: true,
    total_runs: 76,
    last_triggered: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'wf-004',
    name: 'AMC Validity Expiry Alert (30 Days Prior)',
    trigger_event: 'amc.expiring',
    description: 'Scans for AMC contracts nearing expiration and prepares renewal review summary.',
    actions: ['generate_renewal_draft', 'notify_account_manager'],
    is_active: true,
    total_runs: 23,
    last_triggered: new Date(Date.now() - 172800000).toISOString(),
  },
];

// List Automation Workflows
automationRoutes.get('/workflows', requirePermission('automation:read'), async (c) => {
  return c.json({ success: true, workflows: activeWorkflows });
});

