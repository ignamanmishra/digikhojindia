/**
 * DIGIKHOJINDIA CUSTOMER MANAGEMENT ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { customerCreateSchema, customerUpdateSchema } from '@digikhojindia/validation';
import { generateCustomerId } from '@digikhojindia/shared';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { hashPassword } from '../crypto';
import type { Customer } from '@digikhojindia/types';

export const customerRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

customerRoutes.use('*', authMiddleware);

// List Customers (Admin/Staff)
customerRoutes.get('/', requirePermission('customers:read'), async (c) => {
  const user = c.get('user');
  const search = c.req.query('search')?.toLowerCase();
  const type = c.req.query('type');

  let list = Array.from(globalStore.customers.values());

  // If customer user, only return their own customer profile
  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    list = list.filter((cust) => cust.tenant_id === user.tenant_id || cust.email.toLowerCase() === user.email.toLowerCase());
  } else {
    if (search) {
      list = list.filter(
        (cust) =>
          cust.organization_name.toLowerCase().includes(search) ||
          cust.contact_person.toLowerCase().includes(search) ||
          cust.email.toLowerCase().includes(search) ||
          cust.id.toLowerCase().includes(search)
      );
    }
    if (type) {
      list = list.filter((cust) => cust.type === type);
    }
  }

  return c.json({ success: true, customers: list, total: list.length });
});

// Get Single Customer Details
customerRoutes.get('/:id', requirePermission('customers:read'), async (c) => {
  const id = c.req.param('id') || '';
  const user = c.get('user');
  const customer = globalStore.customers.get(id);

  if (!customer) {
    return c.json({ success: false, error: 'Customer not found' }, 404);
  }

  // Multi-tenant check
  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    if (customer.tenant_id !== user.tenant_id && customer.email.toLowerCase() !== user.email.toLowerCase()) {
      return c.json({ success: false, error: 'Forbidden: You can only view your own organization' }, 403);
    }
  }

  // Gather associated software, tickets, AMC, and invoices
  const deployedSoftware = Array.from(globalStore.customerSoftware.values()).filter(
    (cs) => cs.customer_id === id
  );
  const tickets = Array.from(globalStore.tickets.values()).filter((t) => t.customer_id === id);
  const amcContracts = Array.from(globalStore.amcContracts.values()).filter((a) => a.customer_id === id);
  const invoices = Array.from(globalStore.invoices.values()).filter((i) => i.customer_id === id);
  const projects = Array.from(globalStore.projects.values()).filter((p) => p.customer_id === id);

  return c.json({
    success: true,
    customer,
    software: deployedSoftware,
    tickets,
    amc_contracts: amcContracts,
    invoices,
    projects,
  });
});

// Create Customer (Admin only)
customerRoutes.post('/', requirePermission('customers:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = customerCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const count = globalStore.customers.size + 1;
    const customerId = generateCustomerId(count);
    const tenantId = `tenant-${data.organization_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const newCustomer: Customer = {
      id: customerId,
      tenant_id: tenantId,
      organization_name: data.organization_name,
      contact_person: data.contact_person,
      email: data.email,
      phone: data.phone,
      type: data.type,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      pincode: data.pincode || null,
      gstin: data.gstin || null,
      assigned_support_user_id: data.assigned_support_user_id || 'usr-support-tech',
      assigned_support_user_name: 'Aakash Verma (Support Lead)',
      is_active: true,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.customers.set(customerId, newCustomer);

    // Create a customer admin user account so they can log into the Customer Portal
    const initialPassword = data.initial_password || 'Password123!';
    const passwordHash = await hashPassword(initialPassword);

    const customerUser = {
      id: `usr-${Date.now()}`,
      tenant_id: tenantId,
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      full_name: `${data.contact_person} (${data.organization_name})`,
      phone: data.phone,
      role: 'customer_admin' as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.users.set(data.email.toLowerCase(), customerUser);

    return c.json({
      success: true,
      message: `Customer ${customerId} created successfully`,
      customer: newCustomer,
      portal_account: {
        email: customerUser.email,
        temporary_password: initialPassword,
      },
    }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Customer creation failed' }, 500);
  }
});

// Assign Software Product to Customer
customerRoutes.post('/:id/software', requirePermission('customers:write'), async (c) => {
  try {
    const id = c.req.param('id') || '';
    const customer = globalStore.customers.get(id);
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404);
    }

    const body = await c.req.json();
    const { product_id, product_name, version = '1.0.0', deployed_url } = body;

    if (!product_id || !product_name) {
      return c.json({ success: false, error: 'Product ID and Name are required' }, 400);
    }

    const deploymentId = `csoft-${Date.now()}`;
    const deployment = {
      id: deploymentId,
      customer_id: id,
      product_id,
      product_name,
      version,
      status: 'active' as const,
      deployed_url: deployed_url || null,
      installed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.customerSoftware.set(deploymentId, deployment);

    return c.json({
      success: true,
      message: `Software ${product_name} assigned to ${customer.organization_name}`,
      deployment,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
