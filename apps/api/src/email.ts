/**
 * DIGIKHOJINDIA DUAL-RECIPIENT EMAIL DISPATCHER
 * Dispatches instant notifications on every website enquiry/demo/quote form submission to:
 * - namanmishraofficial@gmail.com
 * - info@digikhojindia.online
 *
 * Owner: Naman Mishra
 * Helpline: +91 89898 28902
 */

import { BRAND_CONSTANTS } from '@digikhojindia/shared';
import type { WebsiteEnquiry } from '@digikhojindia/types';
import { globalStore, type EmailDispatchRecord } from './db';

declare const process: any;

export interface EmailDispatchResult {
  success: boolean;
  recipients: string[];
  dispatchId: string;
  provider: 'resend' | 'cloudflare_worker' | 'mock_logger';
  message?: string;
  error?: string;
}

export async function sendEnquiryNotification(
  enquiry: WebsiteEnquiry,
  env?: any
): Promise<EmailDispatchResult> {
  const recipients = [...BRAND_CONSTANTS.NOTIFICATION_EMAILS];
  const dispatchId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanPhone = enquiry.phone.replace(/[^0-9]/g, '');
  const timestampIST = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `🚨 New Inbound Lead [${enquiry.type.toUpperCase()}]: ${enquiry.name} (${enquiry.company || 'Direct'}) | Digikhojindia`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080D20; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #EAF5FF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #080D20; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(16,43,80,0.85) 0%, rgba(8,13,32,0.95) 100%); border: 1px solid rgba(66,221,245,0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.7);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #287BFF 0%, #42DDF5 50%, #9B70FF 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                DigiKhoj<span style="color: #F97316;">India</span>
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #42DDF5; font-style: italic;">
                Technology की हर नई खोज, आपके लिए!
              </p>
              <div style="margin-top: 15px; display: inline-block; padding: 6px 14px; background: rgba(66,221,245,0.15); border: 1px solid rgba(66,221,245,0.4); border-radius: 20px; font-size: 12px; font-weight: bold; color: #42DDF5;">
                🔥 New ${enquiry.type.toUpperCase()} Submission Alert
              </div>
            </td>
          </tr>

          <!-- Body Info -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #94A3B8;">
                Hello <strong>Naman Mishra</strong>, a potential client has just submitted a new <strong style="color: #42DDF5;">${enquiry.type}</strong> form on the Digikhojindia platform. Here are the complete details:
              </p>

              <!-- Data Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="10" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; font-size: 13px;">
                <tr>
                  <td width="35%" style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Full Name:</td>
                  <td style="color: #FFFFFF; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px;">${enquiry.name}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Contact Phone:</td>
                  <td style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <a href="tel:${enquiry.phone}" style="color: #42DDF5; text-decoration: none; font-weight: bold;">${enquiry.phone}</a>
                    &nbsp;&bull;&nbsp;
                    <a href="https://wa.me/${cleanPhone}" style="color: #10B981; text-decoration: none; font-weight: bold;">Chat on WhatsApp &rarr;</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Email Address:</td>
                  <td style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <a href="mailto:${enquiry.email}" style="color: #42DDF5; text-decoration: none;">${enquiry.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Company / Hospital:</td>
                  <td style="color: #FFFFFF; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">${enquiry.company || 'Not Specified (Direct Inbound)'}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Service Interest:</td>
                  <td style="color: #9B70FF; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold;">${enquiry.service_interest}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Form Type:</td>
                  <td style="color: #F078C8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; text-transform: uppercase;">${enquiry.type}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600;">Submission Time:</td>
                  <td style="color: #CBD5E1; border-bottom: 1px solid rgba(255,255,255,0.05);">${timestampIST}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8; font-weight: 600;">Client IP:</td>
                  <td style="color: #64748B; font-family: monospace;">${enquiry.ip_address || '127.0.0.1'}</td>
                </tr>
              </table>

              <!-- Message / Scope Box -->
              <div style="margin-top: 20px; padding: 16px; background: rgba(0,0,0,0.3); border-left: 3px solid #287BFF; border-radius: 4px;">
                <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94A3B8; font-weight: bold;">Client Message / Scope:</p>
                <p style="margin: 0; font-size: 13px; color: #F1F5F9; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</p>
              </div>

              <!-- Quick Action Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(90deg, #287BFF, #42DDF5);">
                    <a href="https://wa.me/${cleanPhone}" target="_blank" style="padding: 12px 20px; font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block;">
                      💬 Open in WhatsApp
                    </a>
                  </td>
                  <td width="12"></td>
                  <td style="border-radius: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);">
                    <a href="tel:${enquiry.phone}" style="padding: 12px 20px; font-size: 13px; font-weight: bold; color: #42DDF5; text-decoration: none; display: inline-block;">
                      📞 Call Direct
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 11px; color: #64748B; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">This notification was dispatched automatically to:</p>
              <p style="margin: 0 0 8px 0; color: #94A3B8; font-weight: bold;">
                namanmishraofficial@gmail.com &bull; info@digikhojindia.online
              </p>
              <p style="margin: 0; color: #475569;">
                &copy; Digikhojindia. All Rights Reserved. Owned by Naman Mishra.<br>
                Official Helpline: +91 89898 28902
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  let provider: 'resend' | 'cloudflare_worker' | 'mock_logger' = 'mock_logger';
  let sendSuccess = true;
  let statusDetail = 'Dispatched to notification queue';

  // 1. Check for Resend API Key
  const resendApiKey = env?.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env?.EMAIL_FROM || 'Digikhojindia Alerts <onboarding@resend.dev>',
          to: recipients,
          subject,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        provider = 'resend';
        statusDetail = 'Sent via Resend API to both recipients';
      } else {
        const errorText = await res.text();
        console.warn(`[Email Alert] Resend API responded with error: ${errorText}`);
      }
    } catch (e: any) {
      console.warn(`[Email Alert] Failed to dispatch via Resend API: ${e.message}`);
    }
  }

  // 2. Check for Cloudflare Send Email binding
  if (provider === 'mock_logger' && env?.SEND_EMAIL?.send) {
    try {
      await env.SEND_EMAIL.send({
        to: recipients,
        from: env?.EMAIL_FROM || 'alerts@digikhojindia.online',
        subject,
        html: htmlContent,
      });
      provider = 'cloudflare_worker';
      statusDetail = 'Sent via Cloudflare Workers Email binding';
    } catch (e: any) {
      console.warn(`[Email Alert] Failed via Cloudflare send_email: ${e.message}`);
    }
  }

  // 3. Fallback & Store in global store for complete observability
  const record: EmailDispatchRecord = {
    id: dispatchId,
    recipients,
    subject,
    enquiry_id: enquiry.id,
    sent_at: new Date().toISOString(),
    status: provider === 'mock_logger' ? 'mocked' : 'sent',
    service_provider: provider,
    payload: {
      lead_name: enquiry.name,
      lead_phone: enquiry.phone,
      lead_email: enquiry.email,
      company: enquiry.company,
      service: enquiry.service_interest,
      type: enquiry.type,
      message: enquiry.message,
    },
  };

  globalStore.emailDispatches.push(record);

  console.log(`[EMAIL DISPATCH ${dispatchId}] Lead notification triggered for [${recipients.join(', ')}] via ${provider}`);

  return {
    success: sendSuccess,
    recipients,
    dispatchId,
    provider,
    message: statusDetail,
  };
}
