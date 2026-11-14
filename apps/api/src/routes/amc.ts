/**
 * DIGIKHOJINDIA AMC MANAGEMENT ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { amcCreateSchema } from '@digikhojindia/validation';
import { generateAmcId, BRAND_CONSTANTS } from '@digikhojindia/shared';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { AmcContract } from '@digikhojindia/types';

export const amcRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

amcRoutes.use('*', authMiddleware);

// List AMC Contracts
amcRoutes.get('/', requirePermission('amc:read'), async (c) => {
  const user = c.get('user');
  let list = Array.from(globalStore.amcContracts.values());

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    list = list.filter((a) => a.tenant_id === user.tenant_id);
  }

  return c.json({ success: true, contracts: list, total: list.length });
});

// Get AMC Contract Details
amcRoutes.get('/:id', requirePermission('amc:read'), async (c) => {
  const id = c.req.param('id') || '';
  const user = c.get('user');
  const contract = globalStore.amcContracts.get(id);

  if (!contract) {
    return c.json({ success: false, error: 'AMC Contract not found' }, 404);
  }

  if (['customer_admin', 'customer_employee'].includes(user.role)) {
    if (contract.tenant_id !== user.tenant_id) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
  }

  return c.json({ success: true, contract });
});

// Register AMC Contract (Admin)
amcRoutes.post('/', requirePermission('amc:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = amcCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const customer = globalStore.customers.get(data.customer_id);
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404);
    }

    const year = new Date().getFullYear();
    const sequence = globalStore.amcContracts.size + 1;
    const contractId = generateAmcId(year, sequence);

    const newContract: AmcContract = {
      id: contractId,
      tenant_id: customer.tenant_id,
      customer_id: customer.id,
      customer_name: customer.organization_name,
      software_id: data.software_id || null,
      software_name: data.software_id ? 'Assigned Software Module' : 'Hospital IT Infrastructure',
      start_date: data.start_date,
      end_date: data.end_date,
      is_lifetime_free: data.is_lifetime_free,
      contract_terms: data.is_lifetime_free
        ? `${BRAND_CONSTANTS.LIFETIME_AMC_NOTE} ${data.contract_terms}`
        : data.contract_terms,
      coverage_details: data.coverage_details,
      included_services: data.included_services,
      excluded_services: data.excluded_services,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.amcContracts.set(contractId, newContract);

    return c.json({
      success: true,
      message: `AMC Contract ${contractId} registered successfully`,
      contract: newContract,
    }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
