import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/authenticate'

const adSchema = z.object({
  side: z.enum(['buy', 'sell']),
  coin: z.string().min(2).max(10),
  priceType: z.enum(['fixed', 'floating']).default('fixed'),
  fixedPrice: z.number().positive().optional(),
  floatingMargin: z.number().optional(),
  totalAmount: z.number().positive(),
  minOrderFiat: z.number().positive(),
  maxOrderFiat: z.number().positive(),
  paymentMethods: z.array(z.string()).min(1),
  tradeWindow: z.number().int().min(15).max(60).default(30),
  terms: z.string().max(2000).optional(),
  requireKycLevel: z.enum(['none', 'basic', 'full']).default('basic'),
  requireMinTrades: z.number().int().min(0).default(0),
})

export default async function adsRoutes(app: FastifyInstance) {
  // GET /api/ads — my ads
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const query = z.object({ status: z.string().optional(), page: z.coerce.number().default(1), limit: z.coerce.number().max(50).default(20) }).parse(req.query)
    const skip = (query.page - 1) * query.limit
    const where: any = { userId: req.user!.sub }
    if (query.status) where.status = query.status

    const [ads, total] = await Promise.all([
      prisma.p2pAd.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: query.limit }),
      prisma.p2pAd.count({ where }),
    ])
    return { success: true, data: ads, meta: { total, page: query.page, limit: query.limit } }
  })

  // POST /api/ads — create ad
  app.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const body = adSchema.parse(req.body)
    const userId = req.user!.sub

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
    if (user.kycLevel === 'none') {
      return reply.status(403).send({ success: false, error: 'KYC_REQUIRED', message: 'Complete KYC to create ads' })
    }

    if (body.side === 'sell') {
      const wallet = await prisma.wallet.findFirst({ where: { userId, coin: body.coin } })
      const balance = parseFloat(wallet?.balance.toString() ?? '0')
      if (balance < body.totalAmount) {
        return reply.status(400).send({ success: false, error: 'INSUFFICIENT_BALANCE' })
      }
    }

    const ad = await prisma.p2pAd.create({
      data: {
        userId,
        ...body,
        availableAmount: body.totalAmount,
      } as any,
    })
    return reply.status(201).send({ success: true, data: ad })
  })

  // GET /api/ads/:id
  app.get('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const ad = await prisma.p2pAd.findFirstOrThrow({ where: { id, userId: req.user!.sub } })
    return { success: true, data: ad }
  })

  // PATCH /api/ads/:id
  app.patch('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const body = adSchema.partial().parse(req.body)
    const ad = await prisma.p2pAd.findFirstOrThrow({ where: { id, userId: req.user!.sub } })

    if (ad.status === 'deleted') {
      throw Object.assign(new Error('Ad has been deleted'), { statusCode: 400 })
    }

    const updated = await prisma.p2pAd.update({ where: { id }, data: body })
    return { success: true, data: updated }
  })

  // PATCH /api/ads/:id/pause
  app.patch('/:id/pause', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.p2pAd.findFirstOrThrow({ where: { id, userId: req.user!.sub } })
    const ad = await prisma.p2pAd.update({ where: { id }, data: { status: 'paused' } })
    return { success: true, data: ad }
  })

  // PATCH /api/ads/:id/activate
  app.patch('/:id/activate', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.p2pAd.findFirstOrThrow({ where: { id, userId: req.user!.sub } })
    const ad = await prisma.p2pAd.update({ where: { id }, data: { status: 'active' } })
    return { success: true, data: ad }
  })

  // DELETE /api/ads/:id
  app.delete('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.p2pAd.findFirstOrThrow({ where: { id, userId: req.user!.sub } })
    await prisma.p2pAd.update({ where: { id }, data: { status: 'deleted' } })
    return { success: true }
  })
}
