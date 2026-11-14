/**
 * DIGIKHOJINDIA AUTHENTICATION MIDDLEWARE
 * Enforces session verification, token extraction, and user hydration
 */

import { Context, Next } from 'hono';
import { globalStore } from '../db';
import { ROLE_PERMISSIONS } from '@digikhojindia/shared';
import type { User, Session, PermissionAction } from '@digikhojindia/types';

export interface Env {
  DB?: any;
  STORAGE?: any;
  PLATFORM_NAME?: string;
  ENVIRONMENT?: string;
}

export type Variables = {
  user: User;
  session: Session;
  permissions: PermissionAction[];
};

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
  // Extract token from Bearer header or Cookie
  const authHeader = c.req.header('Authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookieHeader = c.req.header('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/dki_session=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized: Missing authentication token' }, 401);
  }

  // Lookup session
  const session = globalStore.sessions.get(token);
  if (!session) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or expired session' }, 401);
  }

  // Check expiration
  if (new Date(session.expires_at) < new Date()) {
    globalStore.sessions.delete(token);
    return c.json({ success: false, error: 'Unauthorized: Session has expired. Please log in again.' }, 401);
  }

  // Lookup user
  let foundUser: User | null = null;
  for (const user of globalStore.users.values()) {
    if (user.id === session.user_id) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser || !foundUser.is_active) {
    return c.json({ success: false, error: 'Unauthorized: User account is inactive or disabled' }, 401);
  }

  const permissions = ROLE_PERMISSIONS[foundUser.role] || [];

  c.set('user', foundUser);
  c.set('session', session);
  c.set('permissions', permissions);

  return await next();
}
