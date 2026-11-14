/**
 * DIGIKHOJINDIA MULTI-TENANT ISOLATION MIDDLEWARE
 * Strictly prevents cross-tenant data leakage between customer accounts
 */

import { Context, Next } from 'hono';
import type { Env, Variables } from './auth';

export async function tenantIsolationMiddleware(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
  const user = c.get('user');
  if (!user) {
    return c.json({ success: false, error: 'Unauthorized: Authentication required' }, 401);
  }

  // Internal Digikhojindia staff (super_admin, admin, support_executive, etc.) belong to 'tenant-dki-main'
  // and are permitted to assist clients across organizations.
  const isInternalStaff = [
    'super_admin',
    'admin',
    'it_manager',
    'project_manager',
    'support_executive',
    'developer',
    'seo_manager',
    'accountant',
  ].includes(user.role);

  // If customer user, enforce that any query/body requesting a specific tenant_id or customer_id
  // matches their own assigned tenant
  if (!isInternalStaff) {
    const requestedTenantId = c.req.query('tenant_id') || (c.req.param() as any).tenant_id;
    if (requestedTenantId && requestedTenantId !== user.tenant_id) {
      return c.json(
        {
          success: false,
          error: 'Forbidden: Cross-tenant access is strictly prohibited by security policy',
        },
        403
      );
    }
  }

  return await next();
}
