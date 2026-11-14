/**
 * DIGIKHOJINDIA INTEGRATIONS & CONNECTIVITY ENDPOINTS
 * Manages Email, WhatsApp Cloud API, SMS, and Google services settings
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

export const integrationRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

integrationRoutes.use('*', authMiddleware);

// In-memory integration status tracking
const integrationsState = [
  {
    provider: 'resend',
    name: 'Transactional Email (Resend/SMTP)',
    description: 'Automated email alerts for tickets, quotes, and AMC reminders',
    is_connected: false,
    status_label: 'Awaiting API Key',
    required_keys: ['RESEND_API_KEY', 'EMAIL_FROM'],
    updated_at: new Date().toISOString(),
  },
  {
    provider: 'whatsapp',
    name: 'WhatsApp Business Cloud API (Meta)',
    description: 'Instant WhatsApp notifications, OTPs, and interactive support menus',
    is_connected: false,
    status_label: 'Awaiting Meta Credentials',
    required_keys: ['WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_ACCESS_TOKEN'],
    updated_at: new Date().toISOString(),
  },
  {
    provider: 'sms',
    name: 'DLT-Registered SMS Gateway',
    description: 'Critical hospital downtime alerts and OTP verification',
    is_connected: false,
    status_label: 'Awaiting Gateway Key',
    required_keys: ['SMS_API_KEY', 'SMS_SENDER_ID'],
    updated_at: new Date().toISOString(),
  },
  {
    provider: 'google',
    name: 'Google Business Profile & OAuth',
    description: 'Official GBP review tracking, location insights, and Google OAuth login',
    is_connected: false,
    status_label: 'Awaiting OAuth Client ID',
    required_keys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    updated_at: new Date().toISOString(),
  },
];

// List Integrations & Status
integrationRoutes.get('/', requirePermission('settings:read'), async (c) => {
  return c.json({ success: true, integrations: integrationsState });
});

// Test/Verify Integration Connection
integrationRoutes.post('/:provider/test', requirePermission('settings:write'), async (c) => {
  const provider = c.req.param('provider');
  const target = integrationsState.find((i) => i.provider === provider);

  if (!target) {
    return c.json({ success: false, error: 'Unknown integration provider' }, 404);
  }

  // Section 19 rule: "Never simulate successful external delivery when an integration is not connected."
  if (!target.is_connected) {
    return c.json({
      success: false,
      error: `Integration '${target.name}' is not connected. Please provide valid API credentials in .env or cloud environment secrets before testing.`,
      status: 'disconnected',
    }, 400);
  }

  return c.json({ success: true, message: `Connected and tested successfully with ${target.name}` });
});

