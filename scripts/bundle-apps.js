/**
 * DIGIKHOJINDIA UNIFIED DEPLOYMENT BUNDLER
 * Merges Admin and Customer Portal builds into the Website static directory
 * for zero-friction single Cloudflare deployment.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const websiteDist = path.join(root, 'apps', 'website', 'dist');
const adminDist = path.join(root, 'apps', 'admin', 'dist');
const portalDist = path.join(root, 'apps', 'portal', 'dist');

if (fs.existsSync(websiteDist)) {
  if (fs.existsSync(adminDist)) {
    const targetAdmin = path.join(websiteDist, 'admin');
    fs.mkdirSync(targetAdmin, { recursive: true });
    fs.cpSync(adminDist, targetAdmin, { recursive: true });
    console.log('✓ Admin Panel bundle merged into website/dist/admin');
  }

  if (fs.existsSync(portalDist)) {
    const targetPortal = path.join(websiteDist, 'portal');
    fs.mkdirSync(targetPortal, { recursive: true });
    fs.cpSync(portalDist, targetPortal, { recursive: true });
    console.log('✓ Customer Portal bundle merged into website/dist/portal');
  }
}

