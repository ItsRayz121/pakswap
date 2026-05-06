import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/authenticate'

const applySchema = z.object({
  businessName: z.string().min(2).max(100),
  spreadBps: z.number().int().min(0).max(2000).optional(),
})

const inventorySchema = z.object({
  coin: z.string().min(2).max(10),
  network: z.string().min(2).max(20),
  availableAmount: z.coerce.number().nonnegative(),
  priceMarkupBps: z.number().int().min(0).max(2000).optional(),
  isActive: z.boolean().optional(),
})

export default async function merchantRoutes(app: FastifyInstance) {
  // POST /api/merchants/apply — user applies to become a merchant/provider
  app.post('/apply', { preHandler: [authenticate] }, async (req, reply) => {
    const body = applySchema.parse(req.body)
    const userId = req.user!.sub

    const existing = await prisma.instantBuyProvider.findUnique({ where: { userId } })
    if (existing) {
      return reply.status(409).send({ success: false, error: 'ALREADY_APPLIED', message: 'You already have a provider profile' })
    }

    const provider = await prisma.instantBuyProvider.create({
      data: {
        userId,
        businessName: body.businessName,
        spreadBps: body.spreadBps ?? 200,
        status: 'pending',
      },
    })
    return reply.status(201).send({ success: true, data: provider })
  })

  // GET /api/merchants/me — current user's provider profile
  app.get('/me', { preHandler: [authenticate] }, async (req, reply) => {
    const provider = await prisma.instantBuyProvider.findUnique({
      where: { userId: req.user!.sub },
      include: { inventory: true },
    })
    if (!provider) return reply.status(404).send({ success: false, error: 'NOT_FOUND' })
    return { success: true, data: provider }
  })

  // GET /api/merchants/:id — public profile lookup
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const provider = await prisma.instantBuyProvider.findUnique({
      where: { id },
      select: { id: true, businessName: true, status: true, spreadBps: true, approvedAt: true },
    })
    if (!provider || provider.status !== 'approved') {
      return reply.status(404).send({ success: false, error: 'NOT_FOUND' })
    }
    return { success: true, data: provider }
  })

  // GET /api/merchants — list approved providers (public)
  app.get('/', async (req) => {
    const { coin, network } = req.query as { coin?: string; network?: string }
    const where: any = { status: 'approved' }
    if (coin || network) {
      where.inventory = { some: { isActive: true, ...(coin && { coin }), ...(network && { network }) } }
    }
    const providers = await prisma.instantBuyProvider.findMany({
      where,
      select: {
        id: true,
        businessName: true,
        spreadBps: true,
        inventory: {
          where: { isActive: true },
          select: { coin: true, network: true, availableAmount: true, priceMarkupBps: true },
        },
      },
    })
    return { success: true, data: providers }
  })

  // ── Inventory management (provider's own) ─────────────────────────────────
  app.get('/me/inventory', { preHandler: [authenticate] }, async (req, reply) => {
    const provider = await prisma.instantBuyProvider.findUnique({ where: { userId: req.user!.sub } })
    if (!provider) return reply.status(404).send({ success: false, error: 'NO_PROFILE' })
    const items = await prisma.instantBuyInventory.findMany({ where: { providerId: provider.id } })
    return { success: true, data: items }
  })

  app.post('/me/inventory', { preHandler: [authenticate] }, async (req, reply) => {
    const body = inventorySchema.parse(req.body)
    const provider = await prisma.instantBuyProvider.findUnique({ where: { userId: req.user!.sub } })
    if (!provider) return reply.status(404).send({ success: false, error: 'NO_PROFILE' })
    if (provider.status !== 'approved') {
      return reply.status(403).send({ success: false, error: 'NOT_APPROVED', message: 'Provider must be approved first' })
    }

    const item = await prisma.instantBuyInventory.upsert({
      where: { providerId_coin_network: { providerId: provider.id, coin: body.coin, network: body.network } },
      create: {
        providerId: provider.id,
        coin: body.coin,
        network: body.network,
        availableAmount: body.availableAmount,
        priceMarkupBps: body.priceMarkupBps ?? 200,
        isActive: body.isActive ?? true,
      },
      update: {
        availableAmount: body.availableAmount,
        priceMarkupBps: body.priceMarkupBps ?? 200,
        isActive: body.isActive ?? true,
      },
    })
    return reply.status(201).send({ success: true, data: item })
  })

  app.delete('/me/inventory/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const provider = await prisma.instantBuyProvider.findUnique({ where: { userId: req.user!.sub } })
    if (!provider) return reply.status(404).send({ success: false, error: 'NO_PROFILE' })
    await prisma.instantBuyInventory.deleteMany({ where: { id, providerId: provider.id } })
    return { success: true }
  })

  // ── Admin: approve / reject providers ─────────────────────────────────────
  app.get('/admin/queue', { preHandler: [requireAdmin] }, async (req) => {
    const { status = 'pending' } = req.query as { status?: string }
    const providers = await prisma.instantBuyProvider.findMany({
      where: { status },
      include: { inventory: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: providers }
  })

  app.post('/admin/:id/approve', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const provider = await prisma.instantBuyProvider.update({
      where: { id },
      data: { status: 'approved', approvedAt: new Date(), approvedBy: req.user!.sub },
    })
    return { success: true, data: provider }
  })

  app.post('/admin/:id/reject', { preHandler: [requireAdmin] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(2) }).parse(req.body)
    const provider = await prisma.instantBuyProvider.update({
      where: { id },
      data: { status: 'rejected', approvedBy: req.user!.sub },
    })
    // best-effort: notify user
    await prisma.notification.create({
      data: {
        userId: provider.userId,
        type: 'merchant_rejected',
        title: 'Merchant application rejected',
        body: reason,
      },
    }).catch(() => {})
    return { success: true, data: provider }
  })
}
