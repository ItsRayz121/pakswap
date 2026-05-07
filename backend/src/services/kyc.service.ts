import { prisma } from '../lib/prisma'
import { uploadFile, KYC_BUCKET } from '../lib/s3'
import { ocrQueue, kycReviewQueue } from '../lib/queues'
import { notificationService } from './notification.service'
import { logger } from '../lib/logger'

const MAX_KYC_ATTEMPTS = 5

export async function submitKyc(
  userId: string,
  level: 'basic' | 'full',
  files: {
    cnicFront?: Buffer
    cnicBack?: Buffer
    selfie?: Buffer
    addressProof?: Buffer
  },
  meta: { phone?: string; cnicNumber?: string } = {},
) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  if (user.kycAttempts >= MAX_KYC_ATTEMPTS) {
    throw Object.assign(
      new Error('Maximum KYC attempts reached. Contact support.'),
      { code: 'KYC_MAX_ATTEMPTS', statusCode: 403 },
    )
  }

  if (user.kycStatus === 'under_review' || user.kycStatus === 'pending') {
    throw Object.assign(
      new Error('KYC already under review'),
      { code: 'KYC_IN_PROGRESS', statusCode: 409 },
    )
  }

  // Persist phone on the user if newly provided. Phone uniqueness is enforced
  // at the schema level — a clearer error to the user if it clashes.
  if (meta.phone && meta.phone !== user.phone) {
    const clash = await prisma.user.findFirst({ where: { phone: meta.phone, NOT: { id: userId } } })
    if (clash) {
      throw Object.assign(
        new Error('This phone number is already linked to another account.'),
        { code: 'PHONE_EXISTS', statusCode: 409 },
      )
    }
    await prisma.user.update({ where: { id: userId }, data: { phone: meta.phone } })
  }

  // Upload files to S3
  const prefix = `kyc/${userId}`
  const [cnicFrontUrl, cnicBackUrl, selfieUrl, addressProofUrl] = await Promise.all([
    files.cnicFront ? uploadFile(KYC_BUCKET, `${prefix}/cnic-front`, files.cnicFront, 'image/jpeg') : Promise.resolve(undefined),
    files.cnicBack ? uploadFile(KYC_BUCKET, `${prefix}/cnic-back`, files.cnicBack, 'image/jpeg') : Promise.resolve(undefined),
    files.selfie ? uploadFile(KYC_BUCKET, `${prefix}/selfie`, files.selfie, 'image/jpeg') : Promise.resolve(undefined),
    files.addressProof ? uploadFile(KYC_BUCKET, `${prefix}/address-proof`, files.addressProof, 'image/jpeg') : Promise.resolve(undefined),
  ])

  const submission = await prisma.kycSubmission.create({
    data: {
      userId,
      level,
      status: 'pending',
      verificationStatus: 'pending_layer1',
      cnicNumber: meta.cnicNumber,
      cnicFrontUrl,
      cnicBackUrl,
      selfieUrl,
      addressProofUrl,
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: 'pending', kycAttempts: { increment: 1 } },
  })

  // Queue Layer 1 AI processing (skipped when Redis/BullMQ unavailable)
  await ocrQueue?.add('kyc-ocr', {
    submissionId: submission.id,
    userId,
    level,
    cnicFrontUrl,
    cnicBackUrl,
    selfieUrl,
    addressProofUrl,
  })

  logger.info({ submissionId: submission.id }, 'KYC submission queued for Layer 1')
  return submission
}

export async function getKycStatus(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { kycLevel: true, kycStatus: true, kycAttempts: true, kycLockedAt: true },
  })

  const latest = await prisma.kycSubmission.findFirst({
    where: { userId },
    orderBy: { submittedAt: 'desc' },
    include: { aiResults: true },
  })

  return { ...user, latestSubmission: latest }
}

export async function adminApproveKyc(
  submissionId: string,
  adminId: string,
  level: 'basic' | 'full',
  notes?: string,
) {
  const submission = await prisma.kycSubmission.findUniqueOrThrow({
    where: { id: submissionId },
    include: { user: true },
  })

  if (submission.verificationStatus !== 'pending_layer2') {
    throw Object.assign(
      new Error('Submission is not ready for Layer 2 approval'),
      { code: 'INVALID_STATE', statusCode: 400 },
    )
  }

  await prisma.$transaction([
    prisma.kycSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'approved',
        verificationStatus: 'approved',
        reviewerId: adminId,
        reviewerNotes: notes,
        reviewedAt: new Date(),
        approvedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: submission.userId },
      data: {
        kycLevel: level,
        kycStatus: 'approved',
        tradingLimits: {
          update: {
            dailyBuyLimit: level === 'full' ? 500000 : 50000,
            dailySellLimit: level === 'full' ? 500000 : 50000,
            monthlyLimit: level === 'full' ? 10000000 : 500000,
          },
        },
      },
    }),
    prisma.adminAuditLog.create({
      data: {
        adminId,
        actionType: 'kyc_approve',
        resourceId: submissionId,
        resourceType: 'kyc_submission',
        decision: 'approved',
        notes,
      },
    }),
  ])

  await notificationService.send({
    userId: submission.userId,
    type: 'kyc_approved',
    title: 'KYC Approved',
    body: `Your ${level === 'full' ? 'Full' : 'Basic'} KYC verification has been approved. You can now trade!`,
  })
}

export async function adminRejectKyc(
  submissionId: string,
  adminId: string,
  reason: string,
) {
  const submission = await prisma.kycSubmission.findUniqueOrThrow({
    where: { id: submissionId },
    include: { user: true },
  })

  await prisma.$transaction([
    prisma.kycSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'rejected',
        verificationStatus: 'rejected',
        reviewerId: adminId,
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: submission.userId },
      data: { kycStatus: 'rejected' },
    }),
    prisma.adminAuditLog.create({
      data: {
        adminId,
        actionType: 'kyc_reject',
        resourceId: submissionId,
        resourceType: 'kyc_submission',
        decision: 'rejected',
        notes: reason,
      },
    }),
  ])

  await notificationService.send({
    userId: submission.userId,
    type: 'kyc_rejected',
    title: 'KYC Rejected',
    body: `Your KYC submission was rejected. Reason: ${reason}. You may resubmit.`,
  })
}
