import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import axios from 'axios'

export default async function marketplaceRoutes(app: FastifyInstance) {
  // GET /api/marketplace/ads
  app.get('/ads', async (req) => {
    const query = z.object({
      coin: z.string().optional(),
      side: z.enum(['buy', 'sell']).optional(),
      paymentMethod: z.string().optional(),
      amount: z.coerce.number().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().max(50).default(20),
    }).parse(req.query)

    const where: any = { status: 'active' }
    if (query.coin) where.coin = query.coin.toUpperCase()
    if (query.side) where.side = query.side
    if (query.paymentMethod) where.paymentMethods = { has: query.paymentMethod }
    if (query.amount) {
      where.minOrderFiat = { lte: query.amount }
      where.maxOrderFiat = { gte: query.amount }
    }

    const skip = (query.page - 1) * query.limit
    const [ads, total] = await Promise.all([
      prisma.p2pAd.findMany({
        where,
        orderBy: [{ fixedPrice: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: query.limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              tradeStats: true,
            },
          },
        },
      }),
      prisma.p2pAd.count({ where }),
    ])

    return {
      success: true,
      data: ads,
      meta: { total, page: query.page, limit: query.limit, hasMore: skip + ads.length < total },
    }
  })

  // GET /api/marketplace/ads/:id
  app.get('/ads/:id', async (req) => {
    const { id } = req.params as { id: string }
    const ad = await prisma.p2pAd.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            kycLevel: true,
            tradeStats: true,
            createdAt: true,
          },
        },
      },
    })
    return { success: true, data: ad }
  })

  // GET /api/marketplace/rate/:coin — fetch live market rate
  app.get('/rate/:coin', async (req) => {
    const { coin } = req.params as { coin: string }
    try {
      const ids: Record<string, string> = {
        USDT: 'tether', BTC: 'bitcoin', ETH: 'ethereum', USDC: 'usd-coin',
      }
      const coinId = ids[coin.toUpperCase()] ?? 'tether'
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=pkr`,
        { timeout: 5000 },
      )
      const rate = data[coinId]?.pkr ?? 0
      return { success: true, data: { coin: coin.toUpperCase(), rate, currency: 'PKR' } }
    } catch {
      return { success: false, error: 'RATE_FETCH_FAILED', message: 'Could not fetch live rate' }
    }
  })
}
