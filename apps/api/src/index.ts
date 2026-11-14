/**
 * DIGIKHOJINDIA API SERVER - CLOUDFLARE WORKERS / HONO
 * Company: Digikhojindia
 * Owner: Naman Mishra (info@digikhojindia.com)
 * Tagline: "We Don't Just Build Software. We Automate Your Entire Business."
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { BRAND_CONSTANTS } from '@digikhojindia/shared';

import { authRoutes } from './routes/auth';
import { customerRoutes } from './routes/customers';
import { ticketRoutes } from './routes/tickets';
import { crmRoutes } from './routes/crm';
import { projectRoutes } from './routes/projects';
import { amcRoutes } from './routes/amc';
import { invoiceRoutes } from './routes/invoices';
import { cmsRoutes } from './routes/cms';
import { reportRoutes } from './routes/reports';
import { integrationRoutes } from './routes/integrations';
import { automationRoutes } from './routes/automation';

export interface Env {
  DB?: any;
  STORAGE?: any;
  PLATFORM_NAME?: string;
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Request logging
app.use('*', logger());

// Cross-Origin Resource Sharing (CORS)
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow localhost dev servers and configured domains
      if (!origin || origin.includes('localhost') || origin.includes('digikhojindia')) {
        return origin;
      }
      return 'http://localhost:4321';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    credentials: true,
    maxAge: 86400,
  })
);

// Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    platform: BRAND_CONSTANTS.COMPANY_NAME,
    tagline: BRAND_CONSTANTS.TAGLINE,
    owner: BRAND_CONSTANTS.OWNER_NAME,
    email: BRAND_CONSTANTS.OFFICIAL_EMAIL,
    timestamp: new Date().toISOString(),
    environment: c.env?.ENVIRONMENT || 'development',
  });
});

// Mount Sub-routers
app.route('/api/auth', authRoutes);
app.route('/api/customers', customerRoutes);
app.route('/api/tickets', ticketRoutes);
app.route('/api/crm', crmRoutes);
app.route('/api/projects', projectRoutes);
app.route('/api/amc', amcRoutes);
app.route('/api/invoices', invoiceRoutes);
app.route('/api/cms', cmsRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/integrations', integrationRoutes);
app.route('/api/automation', automationRoutes);

// Root API Index
app.get('/', (c) => {
  return c.json({
    platform: BRAND_CONSTANTS.COMPANY_NAME,
    tagline: BRAND_CONSTANTS.TAGLINE,
    owner: BRAND_CONSTANTS.OWNER_NAME,
    version: '1.0.0',
    documentation: '/docs',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/me',
      '/api/customers',
      '/api/tickets',
      '/api/crm/leads',
      '/api/crm/enquiries',
      '/api/projects',
      '/api/amc/contracts',
      '/api/invoices',
      '/api/cms/posts',
      '/api/cms/software',
      '/api/cms/videos',
      '/api/reports/dashboard',
      '/api/reports/portal-summary',
      '/api/integrations',
      '/api/automation/workflows',
    ],
  });
});

// Centralized Error Handling
app.onError((err, c) => {
  console.error('[Digikhojindia API Error]:', err);
  return c.json(
    {
      success: false,
      error: err.message || 'Internal Server Error',
    },
    500
  );
});

export default app;

