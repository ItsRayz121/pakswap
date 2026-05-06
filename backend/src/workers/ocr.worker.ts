import { Worker, Job } from 'bullmq'
import { redisForBullMQ } from '../lib/redis'
import { prisma } from '../lib/prisma'
import { extractPaymentScreenshot, namesMatch, callDeepFace } from '../services/ocr.service'
import { notificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

const worker = new Worker(
  'ocr-jobs',
  async (job: Job) => {
    const { name, data } = job

    if (name === 'payment-proof-ocr') {
      await processPaymentProof(data)
    } else if (name === 'kyc-ocr') {
      await processKycOcr(data)
    }
  },
  { connection: redisForBullMQ, concurrency: 3 },
)

async function processPaymentProof(data: {
  verificationId: string
  tradeId: string
  fileUrl: string
  expectedAmount: number
  paymentMethod: string
}) {
  logger.info({ verificationId: data.verificationId }, 'OCR Layer 1: processing payment proof')

  const trade = await prisma.trade.findUniqueOrThrow({
    where: { id: data.tradeId },
    include: {
      buyer: { include: { kycSubmissions: { where: { status: 'approved' }, take: 1 } } },
    },
  })

  const ocrResult = await extractPaymentScreenshot(data.fileUrl, data.paymentMethod)

  const buyerKycName = trade.buyer.kycSubmissions[0]?.cnicName ?? trade.buyer.fullName
  const amountMatch = ocrResult.amount !== undefined
    ? Math.abs(ocrResult.amount - data.expectedAmount) <= 1
    : null
  const nameMatch = ocrResult.senderName ? namesMatch(ocrResult.senderName, buyerKycName) : null
  const timestampValid = !!ocrResult.timestamp

  let aiVerdict: string
  const confidence = ocrResult.confidence
  if (amountMatch === false || nameMatch === false) {
    aiVerdict = 'suspicious'
  } else if (confidence > 0.7 && amountMatch && nameMatch) {
    aiVerdict = 'verified'
  } else {
    aiVerdict = 'manual_needed'
  }

  await prisma.paymentProofVerification.update({
    where: { id: data.verificationId },
    data: {
      aiExtracted: ocrResult as any,
      extractedAmount: ocrResult.amount,
      amountMatch,
      nameMatch,
      timestampValid,
      confidenceScore: confidence,
      aiVerdict,
      verificationStatus: 'pending_layer2',
    },
  })

  // Notify admin queue item ready for Layer 2
  await notificationService.send({
    userId: 'admin',
    type: 'payment_proof_ready',
    title: 'Payment Proof Needs Review',
    body: `OCR complete for trade ${trade.orderRef}. AI verdict: ${aiVerdict}. Human review required.`,
  })

  logger.info({ verificationId: data.verificationId, aiVerdict }, 'OCR Layer 1 complete')
}

async function processKycOcr(data: {
  submissionId: string
  userId: string
  level: string
  cnicFrontUrl?: string
  cnicBackUrl?: string
  selfieUrl?: string
  addressProofUrl?: string
}) {
  logger.info({ submissionId: data.submissionId }, 'KYC Layer 1: processing documents')

  const results: any[] = []

  // CNIC OCR
  if (data.cnicFrontUrl) {
    const ocrResult = await extractPaymentScreenshot(data.cnicFrontUrl, 'cnic')
    const cnicResult = await prisma.kycAiResult.create({
      data: {
        kycId: data.submissionId,
        checkType: 'cnic_ocr',
        aiProvider: 'paddleocr',
        extractedData: ocrResult as any,
        confidenceScore: ocrResult.confidence,
        passed: ocrResult.confidence > 0.5,
      },
    })
    results.push(cnicResult)
  }

  // Face match (full KYC)
  if (data.level === 'full' && data.selfieUrl && data.cnicFrontUrl) {
    const faceResult = await callDeepFace(data.selfieUrl, data.cnicFrontUrl)
    const faceAiResult = await prisma.kycAiResult.create({
      data: {
        kycId: data.submissionId,
        checkType: 'face_match',
        aiProvider: 'deepface',
        extractedData: faceResult as any,
        confidenceScore: faceResult.score * 100,
        passed: faceResult.match,
        failureReason: !faceResult.match ? 'Face similarity below threshold' : undefined,
      },
    })
    results.push(faceAiResult)
  }

  // Update submission to Layer 2
  await prisma.kycSubmission.update({
    where: { id: data.submissionId },
    data: { status: 'under_review', verificationStatus: 'pending_layer2' },
  })

  await prisma.user.update({
    where: { id: data.userId },
    data: { kycStatus: 'under_review' },
  })

  logger.info({ submissionId: data.submissionId }, 'KYC Layer 1 complete — pending human review')
}

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'OCR worker job failed')
})

worker.on('completed', (job) => {
  logger.debug({ jobId: job.id }, 'OCR worker job completed')
})

export default worker
