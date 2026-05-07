import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../lib/prisma'
import { ocrQueue } from '../lib/queues'
import { notificationService } from '../services/notification.service'
import { uploadFile, SCREENSHOTS_BUCKET } from '../lib/s3'
import { randomBytes } from 'crypto'

function nanoid(size: number) {
  return randomBytes(size).toString('base64url').slice(0, size).toUpperCase()
}

const SUPPORTED_COINS = [
  'USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'SOL', 'TRX',
  'AVAX', 'APT', 'NEAR', 'OP', 'ARB', 'SUI', 'RON', 'TON',
] as const

const SUPPORTED_NETWORKS = [
  'TRC20', 'BEP20', 'ERC20', 'SOL', 'ARB', 'POLY', 'OP',
  'BASE', 'AVAX', 'BTC', 'APTOS', 'NEAR', 'SUI', 'TON', 'RONIN',
] as const

const createOrderSchema = z.object({
  coin: z.enum(SUPPORTED_COINS as unknown as [string, ...string[]]),
  network: z.enum(SUPPORTED_NETWORKS as unknown as [string, ...string[]]),
  paymentMode: z.enum(['pkr', 'crypto']),
  amount: z.number().positive(),
  toAddress: z.string().min(10).optional(),
})

export default async function instantBuyRoutes(app: FastifyInstance) {
  // GET /api/instant-buy/payment-config — public; returns platform payment details from DB
  app.get('/payment-config', async () => {
    const keys = ['ib_jazzcash_number', 'ib_easypaisa_number', 'ib_account_name', 'ib_bank_iban', 'ib_bank_name', 'support_whatsapp']
    const configs = await prisma.platformConfig.findMany({ where: { key: { in: keys } } })
    const map = Object.fromEntries(configs.map(c => [c.key, c.value]))
    return {
      success: true,
      data: {
        jazzcash:         map['ib_jazzcash_number']  ?? null,
        easypaisa:        map['ib_easypaisa_number'] ?? null,
        accountName:      map['ib_account_name']     ?? 'PakSwap (Pvt) Ltd',
        bankIban:         map['ib_bank_iban']        ?? null,
        bankName:         map['ib_bank_name']        ?? null,
        supportWhatsapp:  map['support_whatsapp']    ?? null,
      },
    }
  })


  // POST /api/instant-buy/orders
  app.post('/orders', { preHandler: [authenticate] }, async (req, reply) => {
    req.log.info({ rawBody: req.body }, '[InstantBuy] Incoming order request')
    const body = createOrderSchema.parse(req.body) as {
      coin: string; network: string; paymentMode: string; amount: number; toAddress?: string
    }
    req.log.info({ coin: body.coin, network: body.network, paymentMode: body.paymentMode, amount: body.amount }, '[InstantBuy] Parsed order payload')

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { kycLevel: true, kycStatus: true },
    })

    if (user.kycStatus !== 'approved') {
      return reply.status(403).send({ success: false, error: 'KYC_REQUIRED', message: 'Complete KYC to use Instant Buy' })
    }

    let coinAmount = 0
    let fiatAmount: number | null = body.paymentMode === 'pkr' ? body.amount : null

    if (body.paymentMode === 'pkr') {
      const config = await prisma.platformConfig.findUnique({ where: { key: `rate_${body.coin}_PKR` } })
      const rate = config ? parseFloat(config.value) : 0
      if (!rate) return reply.status(400).send({ success: false, error: 'RATE_UNAVAILABLE' })
      coinAmount = body.amount / rate
    } else {
      coinAmount = body.amount
    }

    const fee = body.paymentMode === 'pkr' ? coinAmount * 0.01 : coinAmount * 0.005
    const netCoinAmount = coinAmount - fee

    const order = await prisma.instantBuyOrder.create({
      data: {
        userId: req.user!.sub,
        orderRef: `IB-${nanoid(8).toUpperCase()}`,
        coin: body.coin,
        network: body.network,
        paymentMode: body.paymentMode as any,
        fiatAmount: fiatAmount ?? undefined,
        coinAmount: netCoinAmount,
        rate: body.paymentMode === 'pkr' && fiatAmount ? fiatAmount / coinAmount : undefined,
        verificationStatus: 'pending_layer1',
        status: 'payment_pending',
        quoteExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
        toAddress: body.toAddress,
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
    if (order.status !== 'payment_pending') {
      return reply.status(400).send({ success: false, error: 'INVALID_STATE' })
    }

    const data = await req.file()
    if (!data) return reply.status(400).send({ success: false, error: 'NO_FILE' })

    const buffer = await data.toBuffer()
    const proofUrl = await uploadFile(SCREENSHOTS_BUCKET, `instant-buy/${id}`, buffer, data.mimetype)

    await prisma.instantBuyOrder.update({
      where: { id },
      data: {
        paymentProofUrl: proofUrl,
        status: 'payment_uploaded',
        verificationStatus: 'pending_layer1',
      },
    })

    await ocrQueue?.add('verify-ib-payment', {
      orderId: id,
      proofUrl,
      expectedAmount: order.fiatAmount,
      userId: order.userId,
    }, { priority: 2 })

    return { success: true, message: 'Payment proof submitted. Verification in progress.' }
  })

  // POST /api/instant-buy/orders/:id/confirm-deposit — crypto-to-crypto: submit incoming tx hash
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
        incomingTxHash: txHash,
        status: 'payment_uploaded',
        verificationStatus: 'pending_layer1',
      },
    })

    await ocrQueue?.add('verify-ib-crypto-deposit', {
      orderId: id,
      txHash,
      coin: order.coin,
      network: order.network,
      expectedAmount: order.coinAmount,
      userId: order.userId,
    }, { priority: 2 })

    return { success: true, message: 'Transaction submitted for verification.' }
  })
}
