import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { requireAdmin, requireKycReviewer, requireDisputeAgent } from '../middleware/authenticate'
import { prisma } from '../lib/prisma'
import { adminApproveKyc, adminRejectKyc } from '../services/kyc.service'
import { resolveDispute } from '../services/dispute.service'
import { releaseEscrow, refundEscrow } from '../services/escrow.service'
import { notificationService } from '../services/notification.service'
import { getPresignedUrl, KYC_BUCKET, SCREENSHOTS_BUCKET } from '../lib/s3'

export default async function adminRoutes(app: FastifyInstance) {
  // ─── Dashboard Stats ──────────────────────────────────────────────────────

  app.get('/dashboard/stats', { preHandler: [requireAdmin] }, async () => {
    const [
      totalUsers,
      kycPending,
      activeTrades,
      openDisputes,
      completedTrades24h,
      pendingWithdrawals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.kycSubmission.count({ where: { verificationStatus: 'pending_layer2' } }),
      prisma.trade.count({ where: { status: { in: ['escrow_locked', 'payment_pending', 'payment_claimed', 'under_review'] } } }),
      prisma.dispute.count({ where: { status: { in: ['open', 'under_review'] } } }),
      prisma.trade.count({ where: { status: 'completed', completedAt: { gte: new Date(Date.now() - 86400000) } } }),
      prisma.withdrawal.count({ where: { status: 'pending' } }),
    ])

    return {
      success: true,
      data: {
        totalUsers,
        kycPending,
        activeTrades,
        openDisputes,
        completedTrades24h,
        pendingWithdrawals,
      },
    }
  })

  // ─── KYC Queue ────────────────────────────────────────────────────────────

  app.get('/kyc/queue', { preHandler: [requireKycReviewer] }, async (req) => {
    const { page, limit, status } = z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().max(50).default(20),
      status: z.string().optional(),
    }).parse(req.query)

    const skip = (page - 1) * limit
    const where: any = { verificationStatus: status ?? 'pending_layer2' }
    const [submissions, total] = await Promise.all([
      prisma.kycSubmission.findMany({
        where,
        orderBy: { submittedAt: 'asc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, fullName: true, email: true, phone: true, kycAttempts: true } },
          aiResults: true,
        },
      }),
      prisma.kycSubmission.count({ where }),
    ])

    return { success: true, data: submissions, meta: { total, page, limit } }
  })

  app.get('/kyc/:submissionId', { preHandler: [requireKycReviewer] }, async (req) => {
    const { submissionId } = req.params as { submissionId: string }
    const submission = await prisma.kycSubmission.findUniqueOrThrow({
      where: { id: submissionId },
      include: { user: true, aiResults: true },
    })

    // Generate presigned URLs for documents
    const urls: Record<string, string | null> = {
      cnicFront: null, cnicBack: null, selfie: null, addressProof: null,
    }
    if (submission.cnicFrontUrl) urls.cnicFront = await getPresignedUrl(KYC_BUCKET, submission.cnicFrontUrl)
    if (submission.cnicBackUrl) urls.cnicBack = await getPresignedUrl(KYC_BUCKET, submission.cnicBackUrl)
    if (submission.selfieUrl) urls.selfie = await getPresignedUrl(KYC_BUCKET, submission.selfieUrl)
    if (submission.addressProofUrl) urls.addressProof = await getPresignedUrl(KYC_BUCKET, submission.addressProofUrl)

    return { success: true, data: { ...submission, documentUrls: urls } }
  })

  app.post('/kyc/:submissionId/approve', { preHandler: [requireKycReviewer] }, async (req) => {
    const { submissionId } = req.params as { submissionId: string }
    const { level, notes } = z.object({
      level: z.enum(['basic', 'full']),
      notes: z.string().optional(),
    }).parse(req.body)
    await adminApproveKyc(submissionId, req.user!.sub, level, notes)
    return { success: true, message: 'KYC approved' }
  })

  app.post('/kyc/:submissionId/reject', { preHandler: [requireKycReviewer] }, async (req) => {
    const { submissionId } = req.params as { submissionId: string }
    const { reason } = z.object({ reason: z.string().min(10) }).parse(req.body)
    await adminRejectKyc(submissionId, req.user!.sub, reason)
    return { success: true, message: 'KYC rejected' }
  })

  // ─── Payment Verification Queue ───────────────────────────────────────────

  app.get('/payments/queue', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    const skip = (page - 1) * limit
    const [verifications, total] = await Promise.all([
      prisma.paymentProofVerification.findMany({
        where: { verificationStatus: 'pending_layer2' },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          trade: {
            include: {
              buyer: { select: { id: true, fullName: true } },
              seller: { select: { id: true, fullName: true } },
            },
          },
        },
      }),
      prisma.paymentProofVerification.count({ where: { verificationStatus: 'pending_layer2' } }),
    ])
    return { success: true, data: verifications, meta: { total, page, limit } }
  })

  app.post('/payments/:verificationId/approve', { preHandler: [requireAdmin] }, async (req) => {
    const { verificationId } = req.params as { verificationId: string }
    const { notes } = z.object({ notes: z.string().optional() }).parse(req.body)
    const adminId = req.user!.sub

    const verification = await prisma.paymentProofVerification.findUniqueOrThrow({
      where: { id: verificationId },
    })

    await prisma.paymentProofVerification.update({
      where: { id: verificationId },
      data: { verificationStatus: 'approved', humanVerdict: 'approved', reviewedBy: adminId, reviewedAt: new Date(), humanReviewed: true },
    })

    await prisma.trade.update({
      where: { id: verification.tradeId },
      data: { status: 'under_review' },
    })

    // Release escrow — Layer 2 complete
    await releaseEscrow(verification.tradeId, adminId, notes)

    await prisma.adminAuditLog.create({
      data: {
        adminId,
        actionType: 'payment_approve',
        resourceId: verificationId,
        resourceType: 'payment_proof_verification',
        decision: 'approved',
        notes,
      },
    })

    return { success: true, message: 'Payment approved, escrow released' }
  })

  app.post('/payments/:verificationId/reject', { preHandler: [requireAdmin] }, async (req) => {
    const { verificationId } = req.params as { verificationId: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    const adminId = req.user!.sub

    const verification = await prisma.paymentProofVerification.findUniqueOrThrow({
      where: { id: verificationId },
    })

    await prisma.paymentProofVerification.update({
      where: { id: verificationId },
      data: { verificationStatus: 'rejected', humanVerdict: 'rejected', reviewedBy: adminId, reviewedAt: new Date(), humanReviewed: true },
    })

    await refundEscrow(verification.tradeId, adminId, `Payment rejected: ${reason}`)

    const trade = await prisma.trade.findUniqueOrThrow({ where: { id: verification.tradeId } })
    await notificationService.send({
      userId: trade.buyerId,
      type: 'payment_rejected',
      title: 'Payment Rejected',
      body: `Your payment for order ${trade.orderRef} was rejected. Reason: ${reason}`,
    })

    return { success: true, message: 'Payment rejected, escrow refunded to seller' }
  })

  // ─── Disputes ─────────────────────────────────────────────────────────────

  app.get('/disputes/queue', { preHandler: [requireDisputeAgent] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    const skip = (page - 1) * limit
    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where: { status: { in: ['open', 'under_review'] } },
        orderBy: [{ slaDeadline: 'asc' }, { createdAt: 'asc' }],
        skip,
        take: limit,
        include: {
          trade: { include: { buyer: { select: { fullName: true } }, seller: { select: { fullName: true } } } },
          opener: { select: { fullName: true } },
          evidence: true,
        },
      }),
      prisma.dispute.count({ where: { status: { in: ['open', 'under_review'] } } }),
    ])
    return { success: true, data: disputes, meta: { total, page, limit } }
  })

  app.post('/disputes/:id/resolve', { preHandler: [requireDisputeAgent] }, async (req) => {
    const { id } = req.params as { id: string }
    const { resolution, notes } = z.object({
      resolution: z.enum(['release_to_buyer', 'return_to_seller']),
      notes: z.string().min(10),
    }).parse(req.body)
    await resolveDispute(id, req.user!.sub, resolution, notes)
    return { success: true, message: 'Dispute resolved' }
  })

  // ─── Live Trades ──────────────────────────────────────────────────────────

  app.get('/trades', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit, status } = z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
      status: z.string().optional(),
    }).parse(req.query)

    const skip = (page - 1) * limit
    const where: any = {}
    if (status) where.status = status

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          buyer: { select: { id: true, fullName: true, email: true } },
          seller: { select: { id: true, fullName: true, email: true } },
          proofVerifications: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      prisma.trade.count({ where }),
    ])
    return { success: true, data: trades, meta: { total, page, limit } }
  })

  // ─── User Management ──────────────────────────────────────────────────────

  app.get('/users', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit, search, status } = z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
      search: z.string().optional(),
      status: z.string().optional(),
    }).parse(req.query)

    const skip = (page - 1) * limit
    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, email: true, phone: true, fullName: true, role: true,
          status: true, kycLevel: true, kycStatus: true, createdAt: true, lastLoginAt: true,
          tradeStats: true, riskScore: true,
        },
      }),
      prisma.user.count({ where }),
    ])
    return { success: true, data: users, meta: { total, page, limit } }
  })

  app.get('/users/:id', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        tradingLimits: true,
        tradeStats: true,
        riskScore: true,
        riskFlags: { orderBy: { createdAt: 'desc' }, take: 10 },
        wallets: true,
      },
    })
    return { success: true, data: user }
  })

  app.post('/users/:id/suspend', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    await prisma.user.update({ where: { id }, data: { status: 'suspended' } })
    await prisma.adminAuditLog.create({
      data: { adminId: req.user!.sub, actionType: 'user_suspend', resourceId: id, resourceType: 'user', notes: reason },
    })
    return { success: true }
  })

  app.post('/users/:id/ban', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    await prisma.user.update({ where: { id }, data: { status: 'banned' } })
    await prisma.adminAuditLog.create({
      data: { adminId: req.user!.sub, actionType: 'user_ban', resourceId: id, resourceType: 'user', notes: reason },
    })
    return { success: true }
  })

  app.post('/users/:id/unsuspend', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.user.update({ where: { id }, data: { status: 'active' } })
    await prisma.adminAuditLog.create({
      data: { adminId: req.user!.sub, actionType: 'user_unsuspend', resourceId: id, resourceType: 'user' },
    })
    return { success: true }
  })

  // ─── Fraud Monitor ────────────────────────────────────────────────────────

  app.get('/fraud/flags', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    const skip = (page - 1) * limit
    const [flags, total] = await Promise.all([
      prisma.riskFlag.findMany({
        where: { reviewed: false },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: { user: { select: { fullName: true, email: true } } },
      }),
      prisma.riskFlag.count({ where: { reviewed: false } }),
    ])
    return { success: true, data: flags, meta: { total, page, limit } }
  })

  app.post('/fraud/flags/:id/review', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { actionTaken } = z.object({ actionTaken: z.string() }).parse(req.body)
    await prisma.riskFlag.update({
      where: { id },
      data: { reviewed: true, reviewedBy: req.user!.sub, actionTaken },
    })
    return { success: true }
  })

  // ─── Withdrawals ──────────────────────────────────────────────────────────

  app.get('/withdrawals', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    const skip = (page - 1) * limit
    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({ where: { status: 'pending' }, orderBy: { createdAt: 'asc' }, skip, take: limit }),
      prisma.withdrawal.count({ where: { status: 'pending' } }),
    ])
    return { success: true, data: withdrawals, meta: { total, page, limit } }
  })

  app.post('/withdrawals/:id/approve', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { notes } = z.object({ notes: z.string().optional() }).parse(req.body)
    const adminId = req.user!.sub

    await prisma.withdrawal.update({
      where: { id },
      data: { status: 'processing', adminId, adminNotes: notes, approvedAt: new Date() },
    })

    // Signing service call would go here in production
    // await signingService.broadcastWithdrawal(withdrawal)

    await prisma.adminAuditLog.create({
      data: { adminId, actionType: 'withdrawal_approve', resourceId: id, resourceType: 'withdrawal', notes },
    })

    return { success: true, message: 'Withdrawal approved. Signing service will broadcast.' }
  })

  app.post('/withdrawals/:id/reject', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    const adminId = req.user!.sub

    const withdrawal = await prisma.withdrawal.findUniqueOrThrow({ where: { id } })
    await prisma.$transaction([
      prisma.withdrawal.update({ where: { id }, data: { status: 'cancelled', adminId, adminNotes: reason } }),
      prisma.wallet.updateMany({
        where: { userId: withdrawal.userId, coin: withdrawal.coin, network: withdrawal.network },
        data: { balance: { increment: parseFloat(withdrawal.amount.toString()) } },
      }),
    ])

    return { success: true, message: 'Withdrawal rejected, funds returned to user' }
  })

  // ─── Audit Log ────────────────────────────────────────────────────────────

  app.get('/audit-log', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(50) }).parse(req.query)
    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { admin: { select: { fullName: true, email: true } } },
      }),
      prisma.adminAuditLog.count(),
    ])
    return { success: true, data: logs, meta: { total, page, limit } }
  })

  // ─── Platform Config ──────────────────────────────────────────────────────

  app.get('/config', { preHandler: [requireAdmin] }, async () => {
    const configs = await prisma.platformConfig.findMany()
    return { success: true, data: Object.fromEntries(configs.map((c) => [c.key, c.value])) }
  })

  app.patch('/config', { preHandler: [requireAdmin] }, async (req) => {
    const body = req.body as Record<string, string>
    for (const [key, value] of Object.entries(body)) {
      await prisma.platformConfig.upsert({
        where: { key },
        update: { value, updatedBy: req.user!.sub },
        create: { key, value, updatedBy: req.user!.sub },
      })
    }
    return { success: true }
  })

  // ─── Instant Buy Admin Queue ──────────────────────────────────────────────

  app.get('/instant-buy/queue', { preHandler: [requireAdmin] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().max(50).default(20) }).parse(req.query)
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      prisma.instantBuyOrder.findMany({
        where: { verificationStatus: 'pending_layer2' },
        include: { user: { select: { fullName: true, email: true, kycLevel: true } } },
        orderBy: { submittedAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.instantBuyOrder.count({ where: { verificationStatus: 'pending_layer2' } }),
    ])
    return { success: true, data: orders, meta: { total, page, limit } }
  })

  app.post('/instant-buy/:id/approve', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const order = await prisma.instantBuyOrder.findUniqueOrThrow({ where: { id } })
    if (order.verificationStatus !== 'pending_layer2') {
      throw Object.assign(new Error('Order not in pending_layer2 state'), { statusCode: 400 })
    }

    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findFirst({ where: { userId: order.userId, coin: order.coin } })
      if (!wallet) throw new Error('Buyer wallet not found')
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: order.coinAmount } } })
      await tx.walletTransaction.create({
        data: { walletId: wallet.id, txType: 'deposit', amount: order.coinAmount, coin: order.coin, status: 'completed', reference: `IB-${id}`, metadata: { orderId: id } },
      })
      await tx.instantBuyOrder.update({ where: { id }, data: { verificationStatus: 'approved', completedAt: new Date() } })
      await tx.adminAuditLog.create({
        data: { adminId: req.user!.sub, action: 'approve_instant_buy', targetId: id, targetType: 'instant_buy_order', metadata: { coinAmount: order.coinAmount.toString(), coin: order.coin } },
      })
    })

    const { notifyUser } = await import('../services/notification.service')
    await notifyUser(order.userId, { title: 'Instant Buy Complete!', body: `${order.coinAmount} ${order.coin} credited to your wallet.`, type: 'ib_approved', data: { orderId: id } })
    return { success: true }
  })

  app.post('/instant-buy/:id/reject', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    const order = await prisma.instantBuyOrder.update({ where: { id }, data: { verificationStatus: 'rejected' } })
    await prisma.adminAuditLog.create({
      data: { adminId: req.user!.sub, action: 'reject_instant_buy', targetId: id, targetType: 'instant_buy_order', metadata: { reason } },
    })
    const { notifyUser } = await import('../services/notification.service')
    await notifyUser(order.userId, { title: 'Instant Buy Rejected', body: `Your order was rejected: ${reason}`, type: 'ib_rejected', data: { orderId: id } })
    return { success: true }
  })
}
