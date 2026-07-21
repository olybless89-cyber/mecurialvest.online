import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — emails will be skipped");
    return null;
  }
  return new Resend(key);
}

const FROM_EMAIL = process.env["FROM_EMAIL"] || "OrcaBank <noreply@orcabank.online>";
const APP_URL = process.env["FRONTEND_URL"] || "http://localhost:3000";

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const resend = getResend();
  if (!resend) return;
  const url = `${APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your NexBank email address",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a56db;">Welcome to OrcaBank, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${url}" style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#6b7280;font-size:14px;">This link expires in 24 hours. If you did not create an account, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">OrcaBank &mdash; Secure Digital Banking</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resend = getResend();
  if (!resend) return;
  const url = `${APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your NexBank password",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a56db;">Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${url}" style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:14px;">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">OrcaBank &mdash; Secure Digital Banking</p>
      </div>
    `,
  });
}

export async function sendTransactionNotificationEmail(
  to: string,
  name: string,
  type: string,
  amount: string,
  balance: string,
  description: string,
) {
  const resend = getResend();
  if (!resend) return;
  const isDebit = type.includes("OUT") || type === "WITHDRAWAL" || type === "FEE";
  const sign = isDebit ? "-" : "+";
  const color = isDebit ? "#ef4444" : "#22c55e";
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `NexBank: ${isDebit ? "Debit" : "Credit"} of $${amount}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a56db;">Transaction Alert</h2>
        <p>Hi ${name}, a transaction was made on your account.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:24px;margin:16px 0;">
          <p style="margin:0 0 8px;color:#374151;"><strong>Type:</strong> ${type.replace(/_/g, " ")}</p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Amount:</strong> <span style="color:${color};font-size:18px;font-weight:700;">${sign}$${amount}</span></p>
          <p style="margin:0 0 8px;color:#374151;"><strong>Description:</strong> ${description}</p>
          <p style="margin:0;color:#374151;"><strong>New Balance:</strong> $${balance}</p>
        </div>
        <p style="color:#6b7280;font-size:14px;">If you did not make this transaction, please contact support immediately.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">OrcaBank &mdash; Secure Digital Banking</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string, accountNumber: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your NexBank account is ready!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a56db;">Your account is ready, ${name}!</h2>
        <p>Welcome to OrcaBank. Your account has been created successfully.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:24px;margin:16px 0;">
          <p style="margin:0;color:#374151;"><strong>Account Number:</strong> ${accountNumber}</p>
        </div>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
          Go to Dashboard
        </a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">OrcaBank &mdash; Secure Digital Banking</p>
      </div>
    `,
  });
}
