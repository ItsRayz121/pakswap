import { Queue } from 'bullmq'
import { redisForBullMQ } from './redis'

const connection = redisForBullMQ

export const ocrQueue = new Queue('ocr-jobs', { connection })
export const notificationQueue = new Queue('notifications', { connection })
export const payoutQueue = new Queue('payout-queue', { connection })
export const depositQueue = new Queue('deposit-events', { connection })
export const kycReviewQueue = new Queue('kyc-review', { connection })
