import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'NexBank <noreply@nexbank.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, firstName: string, token: string) => {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Verify your NexBank email address',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h1 style="color:#1d4ed8;margin-bottom:8px;">Welcome to NexBank, ${firstName}! 👋</h1>
          <p style="color:#374151;font-size:16px;">Please verify your email address to activate your account.</p>
          <a href="${link}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#1d4ed8;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email Address</a>
          <p style="color:#6b7280;font-size:14px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} NexBank. All rights reserved.</p>
        </div>
      `,
    });
    logger.info(`Verification email sent to ${email}`);
  } catch (err) {
    logger.error('Failed to send verification email:', err);
  }
};

export const sendPasswordResetEmail = async (email: string, firstName: string, token: string) => {
  const link = `${FRONTEND_URL}/reset-password?token=${token}`;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Reset your NexBank password',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h1 style="color:#1d4ed8;margin-bottom:8px;">Password Reset Request</h1>
          <p style="color:#374151;font-size:16px;">Hi ${firstName}, we received a request to reset your password.</p>
          <a href="${link}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#1d4ed8;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
          <p style="color:#6b7280;font-size:14px;">This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} NexBank. All rights reserved.</p>
        </div>
      `,
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (err) {
    logger.error('Failed to send password reset email:', err);
  }
};

export const sendTransactionNotificationEmail = async (
  email: string,
  firstName: string,
  opts: { type: 'credit' | 'debit'; amount: string; description: string; balance: string }
) => {
  const emoji = opts.type === 'credit' ? '💰' : '💸';
  const label = opts.type === 'credit' ? 'Credit' : 'Debit';
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `${emoji} Transaction Alert — ${label} of ${opts.amount}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h1 style="color:#1d4ed8;">Transaction Alert ${emoji}</h1>
          <p>Hi ${firstName},</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#6b7280;">Type</td><td style="padding:8px;font-weight:600;">${label}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">Amount</td><td style="padding:8px;font-weight:600;color:${opts.type === 'credit' ? '#16a34a' : '#dc2626'};">${opts.amount}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Description</td><td style="padding:8px;">${opts.description}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">New Balance</td><td style="padding:8px;font-weight:600;">${opts.balance}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:14px;">If you didn't authorize this, contact us immediately.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} NexBank. All rights reserved.</p>
        </div>
      `,
    });
  } catch (err) {
    logger.error('Failed to send transaction notification email:', err);
  }
};
