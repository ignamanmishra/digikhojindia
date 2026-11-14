/**
 * DIGIKHOJINDIA SUPPORT TICKET SYSTEM ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import {
  ticketCreateSchema,
  ticketReplySchema,
  ticketInternalNoteSchema,
  ticketResolutionConfirmSchema,
} from '@digikhojindia/validation';
import { generateTicketId } from '@digikhojindia/shared';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { Ticket, TicketReply, TicketInternalNote } from '@digikhojindia/types';

export const ticketRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

ticketRoutes.use('*', authMiddleware);

// Calculate SLA hours
function calculateSlaDueTime(priority: string): string {
  const hours = {
    Critical: 4,
    High: 12,
    Medium: 24,
    Low: 48,
  }[priority] || 24;

  const due = new Date(Date.now() + hours * 60 * 60 * 1000);
  return due.toISOString();
}

// List Tickets (Filtered by customer for client users)
ticketRoutes.get('/', requirePermission('tickets:read'), async (c) => {
  const user = c.get('user');
  const status = c.req.query('status');
  const priority = c.req.query('priority');
  const category = c.req.query('category');
  const search = c.req.query('search')?.toLowerCase();

  let list = Array.from(globalStore.tickets.values());

  // Customer users can ONLY see tickets belonging to their organization
  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    list = list.filter((t) => t.tenant_id === user.tenant_id || t.customer_email === user.email);
  }

  if (status) {
    list = list.filter((t) => t.status === status);
  }
  if (priority) {
    list = list.filter((t) => t.priority === priority);
  }
  if (category) {
    list = list.filter((t) => t.category === category);
  }
  if (search) {
    list = list.filter(
      (t) =>
        t.id.toLowerCase().includes(search) ||
        t.subject.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return c.json({ success: true, tickets: list, total: list.length });
});

// Get Single Ticket Details with Reply Thread
ticketRoutes.get('/:id', requirePermission('tickets:read'), async (c) => {
  const id = c.req.param('id') || '';
  const user = c.get('user');
  const ticket = globalStore.tickets.get(id);

  if (!ticket) {
    return c.json({ success: false, error: 'Ticket not found' }, 404);
  }

  // Multi-tenant check
  const isCustomerUser = ['customer_admin', 'customer_employee'].includes(user.role);
  if (isCustomerUser) {
    if (ticket.tenant_id !== user.tenant_id && ticket.customer_email !== user.email) {
      return c.json({ success: false, error: 'Forbidden: You cannot view another customer ticket' }, 403);
    }
  }

  const replies = globalStore.ticketReplies.get(id) || [];
  
  // Internal notes: NEVER visible to customers
  let internalNotes: TicketInternalNote[] = [];
  if (!isCustomerUser) {
    internalNotes = globalStore.ticketInternalNotes.get(id) || [];
  }

  return c.json({
    success: true,
    ticket,
    replies,
    internal_notes: internalNotes,
  });
});

// Create Ticket (Both Admin and Customer Portal)
ticketRoutes.post('/', requirePermission('tickets:write'), async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const parsed = ticketCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const isCustomerUser = ['customer_admin', 'customer_employee'].includes(user.role);

    // If customer user, force customer_id to their own account
    let customer = null;
    if (isCustomerUser) {
      for (const cust of globalStore.customers.values()) {
        if (cust.tenant_id === user.tenant_id || cust.email.toLowerCase() === user.email.toLowerCase()) {
          customer = cust;
          break;
        }
      }
    } else {
      customer = globalStore.customers.get(data.customer_id);
    }

    if (!customer) {
      return c.json({ success: false, error: 'Valid customer organization required' }, 400);
    }

    const year = new Date().getFullYear();
    const sequence = globalStore.tickets.size + 1;
    const ticketId = generateTicketId(year, sequence);

    const newTicket: Ticket = {
      id: ticketId,
      tenant_id: customer.tenant_id,
      customer_id: customer.id,
      customer_organization: customer.organization_name,
      customer_name: customer.contact_person,
      customer_email: customer.email,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      assigned_employee_id: 'usr-support-tech',
      assigned_employee_name: 'Aakash Verma (Support Lead)',
      customer_software_id: data.customer_software_id || null,
      sla_breach: false,
      sla_due_at: calculateSlaDueTime(data.priority),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.tickets.set(ticketId, newTicket);
    globalStore.ticketReplies.set(ticketId, []);
    globalStore.ticketInternalNotes.set(ticketId, []);

    return c.json({
      success: true,
      message: `Ticket ${ticketId} created successfully`,
      ticket: newTicket,
    }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Ticket creation failed' }, 500);
  }
});

// Reply to Ticket (Customer-visible)
ticketRoutes.post('/:id/replies', requirePermission('tickets:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const user = c.get('user');
    const ticket = globalStore.tickets.get(id);

    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404);
    }

    const isCustomerUser = ['customer_admin', 'customer_employee'].includes(user.role);
    if (isCustomerUser && ticket.tenant_id !== user.tenant_id && ticket.customer_email !== user.email) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }

    const body = await c.req.json();
    const parsed = ticketReplySchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const reply: TicketReply = {
      id: `rep-${Date.now()}`,
      ticket_id: id,
      sender_user_id: user.id,
      sender_name: user.full_name,
      sender_role: user.role,
      is_customer: isCustomerUser,
      message: parsed.data.message,
      created_at: new Date().toISOString(),
    };

    const thread = globalStore.ticketReplies.get(id) || [];
    thread.push(reply);
    globalStore.ticketReplies.set(id, thread);

    // Update ticket status
    if (isCustomerUser) {
      if (ticket.status === 'Waiting for Customer' || ticket.status === 'Resolved') {
        ticket.status = 'In Progress'; // Reopen if customer replies
      }
    } else {
      ticket.status = 'Waiting for Customer';
    }
    ticket.updated_at = new Date().toISOString();

    return c.json({ success: true, message: 'Reply posted', reply });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Add Internal Note (Support/Admin only - Strictly 403 for Customers)
ticketRoutes.post('/:id/internal-notes', requirePermission('tickets:internal_notes'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const user = c.get('user');
    const ticket = globalStore.tickets.get(id);

    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404);
    }

    const isCustomerUser = ['customer_admin', 'customer_employee'].includes(user.role);
    if (isCustomerUser) {
      return c.json({ success: false, error: 'Forbidden: Customers cannot create internal notes' }, 403);
    }

    const body = await c.req.json();
    const parsed = ticketInternalNoteSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const note: TicketInternalNote = {
      id: `note-${Date.now()}`,
      ticket_id: id,
      author_id: user.id,
      author_name: user.full_name,
      note: parsed.data.note,
      created_at: new Date().toISOString(),
    };

    const notes = globalStore.ticketInternalNotes.get(id) || [];
    notes.push(note);
    globalStore.ticketInternalNotes.set(id, notes);

    return c.json({ success: true, message: 'Internal note saved', note });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Confirm Issue Resolution & Rate (Customer Portal)
ticketRoutes.post('/:id/confirm-resolution', requirePermission('tickets:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const user = c.get('user');
    const ticket = globalStore.tickets.get(id);

    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404);
    }

    const body = await c.req.json();
    const parsed = ticketResolutionConfirmSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    ticket.status = 'Closed';
    ticket.customer_feedback_rating = parsed.data.rating;
    ticket.customer_feedback_comment = parsed.data.feedback || null;
    ticket.closed_at = new Date().toISOString();
    ticket.updated_at = new Date().toISOString();

    return c.json({
      success: true,
      message: 'Resolution confirmed and ticket closed. Thank you for your feedback!',
      ticket,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Update Status / Assignment (Staff)
ticketRoutes.patch('/:id/status', requirePermission('tickets:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const ticket = globalStore.tickets.get(id);
    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404);
    }

    const body = await c.req.json();
    const { status, resolution_notes, assigned_employee_id } = body;

    if (status) {
      ticket.status = status;
      if (status === 'Resolved') {
        ticket.resolved_at = new Date().toISOString();
        if (resolution_notes) {
          ticket.resolution_notes = resolution_notes;
        }
      }
    }

    if (assigned_employee_id) {
      ticket.assigned_employee_id = assigned_employee_id;
      ticket.assigned_employee_name = 'Aakash Verma (Support Lead)';
    }

    ticket.updated_at = new Date().toISOString();

    return c.json({ success: true, message: 'Ticket updated', ticket });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
