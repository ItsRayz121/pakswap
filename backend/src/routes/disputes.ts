import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { openDispute, uploadDisputeEvidence } from '../services/dispute.service'
import { prisma } from '../lib/prisma'

export default async function disputesRoutes(app: FastifyInstance) {
  // POST /api/disputes — open dispute
  app.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    const body = z.object({
      tradeId: z.string().uuid(),
      reason: z.string().min(5).max(100),
      description: z.string().min(20).max(2000),
    }).parse(req.body)

    const dispute = await openDispute(body.tradeId, req.user!.sub, body.reason, body.description)
    return reply.status(201).send({ success: true, data: dispute })
  })

  // GET /api/disputes
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    const userId = req.user!.sub
    const skip = (page - 1) * limit

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where: { trade: { OR: [{ buyerId: userId }, { sellerId: userId }] } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { trade: { select: { orderRef: true, coin: true, fiatAmount: true } } },
      }),
      prisma.dispute.count({
        where: { trade: { OR: [{ buyerId: userId }, { sellerId: userId }] } },
      }),
    ])
    return { success: true, data: disputes, meta: { total, page, limit } }
  })

  // GET /api/disputes/:id
  app.get('/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const userId = req.user!.sub
    const dispute = await prisma.dispute.findUniqueOrThrow({
      where: { id },
      include: {
        trade: true,
        evidence: true,
        messages: { orderBy: { createdAt: 'asc' }, where: { isInternal: false } },
      },
    })
    if (dispute.trade.buyerId !== userId && dispute.trade.sellerId !== userId) {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 })
    }
    return { success: true, data: dispute }
  })

  // POST /api/disputes/:id/message
  app.post('/:id/message', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    const { message } = z.object({ message: z.string().min(1).max(2000) }).parse(req.body)
    const msg = await prisma.disputeMessage.create({
      data: { disputeId: id, senderId: req.user!.sub, message },
    })
    return { success: true, data: msg }
  })

  // POST /api/disputes/:id/evidence
  app.post('/:id/evidence', { preHandler: [authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const parts = req.parts()
    let fileBuffer: Buffer | undefined
    let mimeType = 'image/jpeg'
    let description: string | undefined

    for await (const part of parts) {
      if (part.type === 'file') {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) chunks.push(chunk)
        fileBuffer = Buffer.concat(chunks)
        mimeType = part.mimetype
      } else if (part.fieldname === 'description') {
        description = part.value as string
      }
    }

    if (!fileBuffer) return reply.status(400).send({ success: false, error: 'FILE_REQUIRED' })

    const evidence = await uploadDisputeEvidence(id, req.user!.sub, fileBuffer, mimeType, description)
    return reply.status(201).send({ success: true, data: evidence })
  })
}
