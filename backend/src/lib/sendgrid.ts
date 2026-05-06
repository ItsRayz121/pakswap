import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  templateId: string
  dynamicTemplateData: Record<string, unknown>
}

export async function sendEmail(opts: EmailOptions): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL] To: ${opts.to} | Template: ${opts.templateId}`, opts.dynamicTemplateData)
    return
  }
  await sgMail.send({
    to: opts.to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@pakswap.com',
      name: process.env.SENDGRID_FROM_NAME ?? 'PakSwap',
    },
    templateId: opts.templateId,
    dynamicTemplateData: opts.dynamicTemplateData,
  })
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
