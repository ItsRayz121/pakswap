import { prisma } from '../lib/prisma'
import { uploadFile, SCREENSHOTS_BUCKET } from '../lib/s3'
import { releaseEscrow, refundEscrow } from './escrow.service'
import { notificationService } from './notification.service'
import { logger } from '../lib/logger'

function generateDisputeRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `DIS-${year}-${rand}`
}

const DISPUTE_SLA_HOURS = 4

export async function openDispute(
  tradeId: string,
  userId: string,
  reason: string,
  description: string,
) {
  const trade = await prisma.trade.findUniqueOrThrow({ where: { id: tradeId } })

  if (trade.buyerId !== userId && trade.sellerId !== userId) {
    throw Object.assign(new Error('Not a participant'), { code: 'FORBIDDEN', statusCode: 403 })
  }

  const disputeableStatuses = ['escrow_locked', 'payment_pending', 'payment_claimed', 'under_review']
  if (!disputeableStatuses.includes(trade.status)) {
    throw Object.assign(
      new Error('Trade cannot be disputed in its current state'),
      { code: 'CANNOT_DISPUTE', statusCode: 400 },
    )
  }

  const existing = await prisma.dispute.findFirst({ where: { tradeId, status: { in: ['open', 'under_review'] } } })
  if (existing) {
    throw Object.assign(new Error('Dispute already open for this trade'), { code: 'DISPUTE_EXISTS', statusCode: 409 })
  }

  const slaDeadline = new Date(Date.now() + DISPUTE_SLA_HOURS * 3600 * 1000)

  const [dispute] = await prisma.$transaction([
    prisma.dispute.create({
      data: {
        disputeRef: generateDisputeRef(),
        tradeId,
        openedBy: userId,
        reason,
        description,
        slaDeadline,
      },
    }),
    prisma.trade.update({ where: { id: tradeId }, data: { status: 'disputed' } }),
  ])

  const otherId = trade.buyerId === userId ? trade.sellerId : trade.buyerId
  await notificationService.send({
    userId: otherId,
    type: 'dispute_opened',
    title: 'Dispute Opened',
    body: `A dispute has been opened for trade ${trade.orderRef}. Our team will resolve it within 4 hours.`,
  })

  logger.info({ disputeId: dispute.id, tradeId, userId }, 'Dispute opened')
  return dispute
}

export async function uploadDisputeEvidence(
  disputeId: string,
  userId: string,
  fileBuffer: Buffer,
  mimeType: string,
  description?: string,
) {
  const dispute = await prisma.dispute.findUniqueOrThrow({
    where: { id: disputeId },
    include: { trade: true },
  })
  const { trade } = dispute
  if (trade.buyerId !== userId && trade.sellerId !== userId) {
    throw Object.assign(new Error('Not a participant'), { code: 'FORBIDDEN', statusCode: 403 })
  }

  const fileUrl = await uploadFile(
    SCREENSHOTS_BUCKET,
    `dispute-evidence/${disputeId}`,
    fileBuffer,
    mimeType,
  )

  return prisma.disputeEvidence.create({
    data: { disputeId, uploadedBy: userId, fileUrl, description },
  })
}

export async function resolveDispute(
  disputeId: string,
  adminId: string,
  resolution: 'release_to_buyer' | 'return_to_seller',
  notes: string,
) {
  const dispute = await prisma.dispute.findUniqueOrThrow({
    where: { id: disputeId },
    include: { trade: true },
  })

  if (dispute.status === 'resolved') {
    throw Object.assign(new Error('Dispute already resolved'), { code: 'ALREADY_RESOLVED', statusCode: 400 })
  }

  await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'resolved',
      resolution,
      resolutionNotes: notes,
      resolvedAt: new Date(),
      assignedAgent: adminId,
    },
  })

  if (resolution === 'release_to_buyer') {
    await releaseEscrow(dispute.tradeId, adminId, `Dispute resolved: ${notes}`)
  } else {
    await refundEscrow(dispute.tradeId, adminId, `Dispute resolved: ${notes}`)
  }

  const winnerId = resolution === 'release_to_buyer' ? dispute.trade.buyerId : dispute.trade.sellerId
  const loserId = resolution === 'release_to_buyer' ? dispute.trade.sellerId : dispute.trade.buyerId

  await Promise.all([
    notificationService.send({
      userId: winnerId,
      type: 'dispute_resolved',
      title: 'Dispute Resolved in Your Favor',
      body: `The dispute for order ${dispute.trade.orderRef} has been resolved in your favor.`,
    }),
    notificationService.send({
      userId: loserId,
      type: 'dispute_resolved',
      title: 'Dispute Resolved',
      body: `The dispute for order ${dispute.trade.orderRef} has been resolved. Decision: ${resolution}.`,
    }),
  ])

  logger.info({ disputeId, adminId, resolution }, 'Dispute resolved')
}
