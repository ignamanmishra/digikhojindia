/**
 * DIGIKHOJINDIA AUTHENTICATION ENDPOINTS
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { hashPassword, verifyPassword, generateSessionToken } from '../crypto';
import { loginSchema, changePasswordSchema } from '@digikhojindia/validation';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { ROLE_PERMISSIONS } from '@digikhojindia/shared';

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Login
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const { email, password } = parsed.data;
    const user = globalStore.users.get(email.toLowerCase());

    if (!user) {
      return c.json({ success: false, error: 'Invalid email address or password' }, 401);
    }

    if (!user.is_active) {
      return c.json({ success: false, error: 'Account is deactivated. Contact Digikhojindia support.' }, 403);
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ success: false, error: 'Invalid email address or password' }, 401);
    }

    // Generate Session (valid for 7 days)
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const session = {
      id: `sess-${Date.now()}`,
      user_id: user.id,
      tenant_id: user.tenant_id,
      token,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    };

    globalStore.sessions.set(token, session);
    user.last_login_at = new Date().toISOString();

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    // Find linked customer profile if applicable
    let customerProfile = null;
    for (const cust of globalStore.customers.values()) {
      if (cust.tenant_id === user.tenant_id || cust.email.toLowerCase() === user.email.toLowerCase()) {
        customerProfile = cust;
        break;
      }
    }

    // Set secure HTTP-only cookie
    c.header(
      'Set-Cookie',
      `dki_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
    );

    return c.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        tenant_id: user.tenant_id,
        phone: user.phone,
      },
      customer: customerProfile,
      permissions,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Authentication error' }, 500);
  }
});

// Current User Profile & Permissions
authRoutes.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const session = c.get('session');
  const permissions = c.get('permissions');

  let customerProfile = null;
  for (const cust of globalStore.customers.values()) {
    if (cust.tenant_id === user.tenant_id || cust.email.toLowerCase() === user.email.toLowerCase()) {
      customerProfile = cust;
      break;
    }
  }

  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      tenant_id: user.tenant_id,
      phone: user.phone,
      last_login_at: user.last_login_at,
    },
    customer: customerProfile,
    permissions,
    session: {
      expires_at: session.expires_at,
    },
  });
});

// Logout
authRoutes.post('/logout', authMiddleware, async (c) => {
  const session = c.get('session');
  if (session) {
    globalStore.sessions.delete(session.token);
  }
  c.header('Set-Cookie', 'dki_session=; Path=/; HttpOnly; Max-Age=0');
  return c.json({ success: true, message: 'Logged out successfully' });
});

// Change Password
authRoutes.post('/change-password', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const user = c.get('user');
    const userInStore = globalStore.users.get(user.email.toLowerCase());
    if (!userInStore) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const isMatch = await verifyPassword(parsed.data.current_password, userInStore.password_hash);
    if (!isMatch) {
      return c.json({ success: false, error: 'Current password does not match' }, 400);
    }

    userInStore.password_hash = await hashPassword(parsed.data.new_password);
    userInStore.updated_at = new Date().toISOString();

    return c.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Password update failed' }, 500);
  }
});
