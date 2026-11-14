/**
 * DIGIKHOJINDIA BILLING & INVOICE MANAGEMENT ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { invoiceCreateSchema, paymentRecordSchema } from '@digikhojindia/validation';
import { generateInvoiceId } from '@digikhojindia/shared';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { Invoice, InvoiceItem, PaymentRecord } from '@digikhojindia/types';

export const invoiceRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

invoiceRoutes.use('*', authMiddleware);

// List Invoices
invoiceRoutes.get('/', requirePermission('invoices:read'), async (c) => {
  const user = c.get('user');
  let list = Array.from(globalStore.invoices.values());

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    list = list.filter((i) => i.tenant_id === user.tenant_id);
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return c.json({ success: true, invoices: list, total: list.length });
});

// Get Single Invoice
invoiceRoutes.get('/:id', requirePermission('invoices:read'), async (c) => {
  const id = c.req.param('id') || '';
  const user = c.get('user');
  const invoice = globalStore.invoices.get(id);

  if (!invoice) {
    return c.json({ success: false, error: 'Invoice not found' }, 404);
  }

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    if (invoice.tenant_id !== user.tenant_id) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
  }

  return c.json({ success: true, invoice });
});

// Create Invoice (Accountant/Admin)
invoiceRoutes.post('/', requirePermission('invoices:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = invoiceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const customer = globalStore.customers.get(data.customer_id);
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404);
    }

    let subtotal = 0;
    let taxAmount = 0;

    const items: InvoiceItem[] = data.items.map((item, index) => {
      const lineSubtotal = item.quantity * item.unit_price;
      const gstAmount = (lineSubtotal * item.gst_rate) / 100;
      const total = lineSubtotal + gstAmount;

      subtotal += lineSubtotal;
      taxAmount += gstAmount;

      return {
        id: `item-${Date.now()}-${index}`,
        invoice_id: '',
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        gst_rate: item.gst_rate,
        gst_amount: gstAmount,
        total,
      };
    });

    const discountAmount = data.discount_amount || 0;
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);
    const balanceDue = totalAmount;

    const year = new Date().getFullYear();
    const sequence = globalStore.invoices.size + 1;
    const invoiceId = generateInvoiceId(year, sequence);

    // Update item foreign keys
    items.forEach((item) => (item.invoice_id = invoiceId));

    const newInvoice: Invoice = {
      id: invoiceId,
      tenant_id: customer.tenant_id,
      customer_id: customer.id,
      customer_name: customer.organization_name,
      customer_email: customer.email,
      customer_gstin: customer.gstin,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      paid_amount: 0,
      balance_due: balanceDue,
      status: 'Sent',
      issue_date: data.issue_date,
      due_date: data.due_date,
      items,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.invoices.set(invoiceId, newInvoice);

    return c.json({
      success: true,
      message: `Invoice ${invoiceId} generated successfully`,
      invoice: newInvoice,
    }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Record Payment Against Invoice
invoiceRoutes.post('/:id/payments', requirePermission('invoices:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const invoice = globalStore.invoices.get(id);
    if (!invoice) {
      return c.json({ success: false, error: 'Invoice not found' }, 404);
    }

    const body = await c.req.json();
    const parsed = paymentRecordSchema.safeParse({ ...body, invoice_id: id });
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoice_id: id,
      customer_id: invoice.customer_id,
      amount: data.amount,
      payment_method: data.payment_method,
      reference_number: data.reference_number || null,
      payment_date: data.payment_date,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
    };

    invoice.paid_amount += data.amount;
    invoice.balance_due = Math.max(0, invoice.total_amount - invoice.paid_amount);

    if (invoice.balance_due === 0) {
      invoice.status = 'Paid';
    } else if (invoice.paid_amount > 0) {
      invoice.status = 'Partially Paid';
    }

    invoice.updated_at = new Date().toISOString();

    return c.json({
      success: true,
      message: `Payment of ₹${data.amount} recorded for ${id}`,
      payment: paymentRecord,
      invoice,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
