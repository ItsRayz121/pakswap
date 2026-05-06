import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  templateId: string
  dynamicTemplateData: Record<string, unknown>
}

export async function sendEmail(opts: EmailOptions & { subject?: string; text?: string }): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !process.env.SENDGRID_API_KEY) {
    console.log(`[EMAIL] To: ${opts.to} | Template: ${opts.templateId || '(plain)'}`, opts.dynamicTemplateData)
    return
  }
  const from = {
    email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@pakswap.com',
    name: process.env.SENDGRID_FROM_NAME ?? 'PakSwap',
  }
  // If a templateId is configured, use the dynamic template; otherwise fall back to plain text
  if (opts.templateId) {
    await sgMail.send({
      to: opts.to,
      from,
      templateId: opts.templateId,
      dynamicTemplateData: opts.dynamicTemplateData,
    })
  } else {
    const subject = opts.subject ?? (opts.dynamicTemplateData?.subject as string) ?? 'PakSwap notification'
    const text = opts.text ?? JSON.stringify(opts.dynamicTemplateData)
    await sgMail.send({ to: opts.to, from, subject, text })
  }
}

export const TEMPLATES = {
  WELCOME: process.env.SENDGRID_TEMPLATE_WELCOME ?? '',
  KYC_SUBMITTED: process.env.SENDGRID_TEMPLATE_KYC_SUBMITTED ?? '',
  KYC_APPROVED: process.env.SENDGRID_TEMPLATE_KYC_APPROVED ?? '',
  KYC_REJECTED: process.env.SENDGRID_TEMPLATE_KYC_REJECTED ?? '',
  TRADE_COMPLETE_BUYER: process.env.SENDGRID_TEMPLATE_TRADE_COMPLETE_BUYER ?? '',
  TRADE_COMPLETE_SELLER: process.env.SENDGRID_TEMPLATE_TRADE_COMPLETE_SELLER ?? '',
  DISPUTE_OPENED: process.env.SENDGRID_TEMPLATE_DISPUTE_OPENED ?? '',
  DISPUTE_RESOLVED: process.env.SENDGRID_TEMPLATE_DISPUTE_RESOLVED ?? '',
  LOGIN_ALERT: process.env.SENDGRID_TEMPLATE_LOGIN_ALERT ?? '',
}
