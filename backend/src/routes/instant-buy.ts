import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../lib/prisma'
import { ocrQueue } from '../lib/queues'
import { notificationService } from '../services/notification.service'
import { uploadFile, SCREENSHOTS_BUCKET } from '../lib/s3'
import { nanoid } from 'nanoid'

const createOrderSchema = z.object({
  coin: z.enum(['USDT', 'BTC', 'ETH', 'USDC']),
  paymentMode: z.enum(['pkr', 'crypto']),
  fromCoin: z.string().optional(),
  amount: z.number().positive(),
})

export default async function instantBuyRoutes(app: FastifyInstance) {
  // POST /api/instant-buy/orders
  app.post('/orders', { preHandler: [authenticate] }, async (req, reply) => {
    const body = createOrderSchema.parse(req.body)

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { kycLevel: true, kycStatus: true },
    })

    if (user.kycStatus !== 'approved') {
      return reply.status(403).send({ success: false, error: 'KYC_REQUIRED', message: 'Complete KYC to use Instant Buy' })
    }

    // Get live rate for PKR mode
    let coinAmount = 0
    let fiatAmount = body.paymentMode === 'pkr' ? body.amount : 0

    if (body.paymentMode === 'pkr') {
      const config = await prisma.platformConfig.findUnique({ where: { key: `rate_${body.coin}_PKR` } })
      const rate = config ? parseFloat(config.value as string) : 0
      if (!rate) return reply.status(400).send({ success: false, error: 'RATE_UNAVAILABLE' })
      coinAmount = body.amount / rate
    } else {
      coinAmount = body.amount // crypto-to-crypto: amount is in fromCoin
      fiatAmount = 0
    }

    const fee = body.paymentMode === 'pkr' ? coinAmount * 0.01 : coinAmount * 0.005
    const netCoinAmount = coinAmount - fee

    const order = await prisma.instantBuyOrder.create({
      data: {
        userId: req.user!.sub,
        orderRef: `IB-${nanoid(8).toUpperCase()}`,
        coin: body.coin,
        paymentMode: body.paymentMode,
        fromCoin: body.fromCoin,
        fiatAmount,
        coinAmount: netCoinAmount,
        platformFee: fee,
        rate: body.paymentMode === 'pkr' ? fiatAmount / coinAmount : 0,
        verificationStatus: 'pending_payment',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    })

    return reply.status(201).send({ success: true, data: order })
  })

  // GET /api/instant-buy/orders
  app.get('/orders', { preHandler: [authenticate] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().max(50).default(20) }).parse(req.query)
    const [orders, total] = await Promise.all([
      prisma.instantBuyOrder.findMany({
        where: { userId: req.user!.sub },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.instantBuyOrder.count({ where: { userId: req.user!.sub } }),
    ])
    return { success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  })

  // GET /api/instant-buy/orders/:id
  app.get('/orders/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const order = await prisma.instantBuyOrder.findFirst({
      where: { id, userId: req.user!.sub },
    })
    if (!order) return reply.status(404).send({ success: false, error: 'ORDER_NOT_FOUND' })
    return { success: true, data: order }
  })

  // POST /api/instant-buy/orders/:id/submit-payment — upload PKR payment proof
  app.post('/orders/:id/submit-payment', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const order = await prisma.instantBuyOrder.findFirst({
      where: { id, userId: req.user!.sub },
    })
    if (!order) return reply.status(404).send({ success: false, error: 'ORDER_NOT_FOUND' })
    if (order.verificationStatus !== 'pending_payment') {
      return reply.status(400).send({ success: false, error: 'INVALID_STATE' })
    }

    const data = await req.file()
    if (!data) return reply.status(400).send({ success: false, error: 'NO_FILE' })

    const buffer = await data.toBuffer()
    const key = `instant-buy/${id}/proof_${Date.now()}.${data.mimetype.split('/')[1] ?? 'jpg'}`
    const proofUrl = await uploadFile(SCREENSHOTS_BUCKET, `instant-buy/${id}`, buffer, data.mimetype)

    await prisma.instantBuyOrder.update({
      where: { id },
      data: {
        paymentProofUrl: proofUrl,
        verificationStatus: 'pending_layer1',
        submittedAt: new Date(),
      },
    })

    // Queue OCR verification
    await ocrQueue.add('verify-ib-payment', {
      orderId: id,
      proofUrl,
      expectedAmount: order.fiatAmount,
      userId: order.userId,
    }, { priority: 2 })

    return { success: true, message: 'Payment proof submitted. Verification in progress.' }
  })

  // POST /api/instant-buy/orders/:id/confirm-deposit — for crypto-to-crypto, confirm blockchain tx
  app.post('/orders/:id/confirm-deposit', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { txHash } = z.object({ txHash: z.string().min(10) }).parse(req.body)

    const order = await prisma.instantBuyOrder.findFirst({
      where: { id, userId: req.user!.sub, paymentMode: 'crypto' },
    })
    if (!order) return reply.status(404).send({ success: false, error: 'ORDER_NOT_FOUND' })

    await prisma.instantBuyOrder.update({
      where: { id },
      data: {
        cryptoTxHash: txHash,
        verificationStatus: 'pending_layer1',
        submittedAt: new Date(),
      },
    })

    // Queue Layer 1 blockchain confirmation check
    await ocrQueue.add('verify-ib-crypto-deposit', {
      orderId: id,
      txHash,
      coin: order.fromCoin,
      expectedAmount: order.coinAmount,
      userId: order.userId,
    }, { priority: 2 })

    return { success: true, message: 'Transaction submitted for verification.' }
  })
}
