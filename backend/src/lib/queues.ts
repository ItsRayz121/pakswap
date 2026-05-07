import { Queue } from 'bullmq'
import { redisForBullMQ } from './redis'

function createQueue(name: string): Queue | null {
  if (!redisForBullMQ) return null
  return new Queue(name, { connection: redisForBullMQ })
}

export const ocrQueue = createQueue('ocr-jobs')
export const notificationQueue = createQueue('notifications')
export const payoutQueue = createQueue('payout-queue')
export const depositQueue = createQueue('deposit-events')
export const kycReviewQueue = createQueue('kyc-review')
