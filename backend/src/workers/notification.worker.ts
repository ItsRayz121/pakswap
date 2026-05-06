import { Worker, Job } from 'bullmq'
import { redisForBullMQ } from '../lib/redis'
import { sendSms } from '../lib/twilio'
import { sendEmail, TEMPLATES } from '../lib/sendgrid'
import { prisma } from '../lib/prisma'
import { logger } from '../lib/logger'

const SMS_TRIGGERS = new Set([
  'trade_initiated', 'payment_claimed', 'trade_completed',
  'dispute_opened', 'kyc_approved', 'kyc_rejected',
])

const worker = new Worker(
  'notifications',
  async (job: Job) => {
    const { userId, type, title, body, data } = job.data

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, email: true, fullName: true },
    })
    if (!user) return

    // SMS
    if (SMS_TRIGGERS.has(type)) {
      await sendSms(user.phone, `PakSwap: ${body}`).catch((err) =>
        logger.warn({ err, type }, 'SMS send failed'),
      )
    }

    // Email for key events
    const templateMap: Record<string, string> = {
      kyc_approved: TEMPLATES.KYC_APPROVED,
      kyc_rejected: TEMPLATES.KYC_REJECTED,
      kyc_submitted: TEMPLATES.KYC_SUBMITTED,
      trade_completed_buyer: TEMPLATES.TRADE_COMPLETE_BUYER,
      trade_completed_seller: TEMPLATES.TRADE_COMPLETE_SELLER,
      dispute_opened: TEMPLATES.DISPUTE_OPENED,
      dispute_resolved: TEMPLATES.DISPUTE_RESOLVED,
    }

    const templateId = templateMap[type]
    if (templateId && user.email) {
      await sendEmail({
        to: user.email,
        templateId,
        dynamicTemplateData: { name: user.fullName, ...data },
      }).catch((err) => logger.warn({ err, type }, 'Email send failed'))
    }
  },
  { connection: redisForBullMQ, concurrency: 10 },
)

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Notification worker job failed')
})

export default worker
