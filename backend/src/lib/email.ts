import { Resend } from 'resend'
import { logger } from './logger'

const apiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.RESEND_FROM ?? 'PakSwap <onboarding@resend.dev>'
const resend = apiKey ? new Resend(apiKey) : null

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  if (!resend) {
    // Dev / unconfigured: log so you can grab OTPs from the console
    logger.warn(
      { to: input.to, subject: input.subject, preview: input.text ?? input.html.slice(0, 200) },
      '[EMAIL — not sent, RESEND_API_KEY missing]',
    )
    return
  }
  try {
    await resend.emails.send({
      from: fromAddress,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    })
  } catch (err) {
    logger.error({ err, to: input.to }, 'Resend send failed')
    throw err
  }
}

export function otpEmail(code: string, purpose: 'verify' | 'reset' = 'verify') {
  const title = purpose === 'verify' ? 'Verify your email' : 'Reset your password'
  const action = purpose === 'verify' ? 'verify your email and activate your account' : 'reset your password'
  return {
    subject: `${title} — your PakSwap code is ${code}`,
    text: `Your PakSwap verification code is: ${code}\n\nThis code expires in 10 minutes. If you didn't request this, ignore this email.`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <tr><td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;color:white;">
          <div style="font-size:22px;font-weight:800;">Pak<span style="color:#bfdbfe;">Swap</span></div>
          <div style="font-size:14px;opacity:0.85;margin-top:4px;">Pakistan ka apna P2P crypto exchange</div>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a;">${title}</h1>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">Use the code below to ${action}. It expires in 10 minutes.</p>
          <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
            <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#1d4ed8;font-family:'SF Mono',Monaco,Consolas,monospace;">${code}</div>
          </div>
          <p style="margin:0 0 8px;color:#64748b;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="margin:0;color:#94a3b8;font-size:12px;">Never share this code with anyone. PakSwap staff will never ask for it.</p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 32px;color:#94a3b8;font-size:12px;text-align:center;border-top:1px solid #e2e8f0;">
          © ${new Date().getFullYear()} PakSwap. Karachi, Pakistan.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  }
}
