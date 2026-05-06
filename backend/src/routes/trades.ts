import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { initiateTrade, claimPayment, cancelTrade, getTradeRoom } from '../services/trade.service'
import { prisma } from '../lib/prisma'

export default async function tradesRoutes(app: FastifyInstance) {
  // POST /api/trades — initiate trade
  app.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const body = z.object({
      adId: z.string().uuid(),
      fiatAmount: z.number().positive(),
      paymentMethod: z.string(),
    }).parse(req.body)

    const trade = await initiateTrade(req.user!.sub, body.adId, body.fiatAmount, body.paymentMethod)
    return reply.status(201).send({ success: true, data: trade })
  })

  // GET /api/trades — trade history
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const query = z.object({
      status: z.string().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().max(50).default(20),
    }).parse(req.query)

    const userId = req.user!.sub
    const skip = (query.page - 1) * query.limit
    const where: any = {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    }
    if (query.status) where.status = query.status

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
        include: {
          buyer: { select: { id: true, username: true, fullName: true } },
          seller: { select: { id: true, username: true, fullName: true } },
        },
      }),
      prisma.trade.count({ where }),
    ])
    return { success: true, data: trades, meta: { total, page: query.page, limit: query.limit } }
  })

  // GET /api/trades/:id — trade room
  app.get('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const trade = await getTradeRoom(id, req.user!.sub)
    return { success: true, data: trade }
  })

  // POST /api/trades/:id/confirm-payment — buyer uploads payment proof
  app.post('/:id/confirm-payment', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const parts = req.parts()
    let proofBuffer: Buffer | undefined
    let mimeType = 'image/jpeg'

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'proof') {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) chunks.push(chunk)
        proofBuffer = Buffer.concat(chunks)
        mimeType = part.mimetype
      }
    }

    if (!proofBuffer) {
      return reply.status(400).send({ success: false, error: 'MISSING_PROOF', message: 'Payment proof image required' })
    }

    const result = await claimPayment(id, req.user!.sub, proofBuffer, mimeType)
    return { success: true, data: result }
  })

  // POST /api/trades/:id/cancel
  app.post('/:id/cancel', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    await cancelTrade(id, req.user!.sub, reason)
    return { success: true, message: 'Trade cancelled' }
  })

  // POST /api/trades/:id/message — send chat message
  app.post('/:id/message', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const { message } = z.object({ message: z.string().min(1).max(1000) }).parse(req.body)
    const userId = req.user!.sub

    const trade = await prisma.trade.findUniqueOrThrow({ where: { id } })
    if (trade.buyerId !== userId && trade.sellerId !== userId) {
      throw Object.assign(new Error('Not a participant'), { code: 'FORBIDDEN', statusCode: 403 })
    }

    const msg = await prisma.tradeMessage.create({
      data: { tradeId: id, senderId: userId, message },
    })
    return { success: true, data: msg }
  })

  // WebSocket /api/trades/:id/ws — real-time trade room
  app.get('/:id/ws', { websocket: true }, async (socket, req) => {
    const { id } = req.params as { id: string }

    socket.on('message', async (rawMsg) => {
      try {
        const { type, payload } = JSON.parse(rawMsg.toString())
        if (type === 'trade:send_message') {
          const msg = await prisma.tradeMessage.create({
            data: { tradeId: id, senderId: req.user!.sub ?? 'anonymous', message: payload.message },
          })
          socket.send(JSON.stringify({ type: 'trade:message', payload: msg }))
        }
      } catch {}
    })

    // Send current trade state on connect
    try {
      const trade = await prisma.trade.findUnique({ where: { id }, select: { status: true } })
      socket.send(JSON.stringify({ type: 'trade:status_update', payload: { status: trade?.status } }))
    } catch {}
  })

  // GET /api/trades/:id/rating — rate trade counterparty
  app.post('/:id/rate', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const { rateeId, rating, comment } = z.object({
      rateeId: z.string().uuid(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(500).optional(),
    }).parse(req.body)

    const trade = await prisma.trade.findUniqueOrThrow({ where: { id } })
    if (trade.status !== 'completed') {
      throw Object.assign(new Error('Trade must be completed to rate'), { statusCode: 400 })
    }

    const tradeRating = await prisma.tradeRating.create({
      data: { tradeId: id, raterId: req.user!.sub, rateeId, rating, comment },
    })
    return { success: true, data: tradeRating }
  })
}
