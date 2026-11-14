/**
 * DIGIKHOJINDIA ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE
 * Enforces strict endpoint permission verification
 */

import { Context, Next } from 'hono';
import { hasPermission } from '@digikhojindia/shared';
import type { PermissionAction } from '@digikhojindia/types';
import type { Env, Variables } from './auth';

export function requirePermission(action: PermissionAction) {
  return async (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized: Authentication required' }, 401);
    }

    if (!hasPermission(user.role, action)) {
      return c.json(
        {
          success: false,
          error: `Forbidden: Role '${user.role}' lacks required permission '${action}'`,
        },
        403
      );
    }

    return await next();
  };
}
