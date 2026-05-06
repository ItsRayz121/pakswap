import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../lib/prisma'

export default async function referralRoutes(app: FastifyInstance) {
  // GET /api/referral
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const userId = req.user!.sub

    const [rewards, totalEarned, totalReferrals] = await Promise.all([
      prisma.referralReward.findMany({
        where: { referrerId: userId },
        include: { referee: { select: { username: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.referralReward.aggregate({
        where: { referrerId: userId, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.referralReward.count({ where: { referrerId: userId } }),
    ])

    const activeReferrals = await prisma.user.count({
      where: {
        referredById: userId,
        tradeStats: { totalTrades: { gt: 0 } },
      },
    })

    return {
      success: true,
      data: {
        rewards,
        totalEarned: totalEarned._sum.amount ?? 0,
        totalReferrals,
        activeReferrals,
      },
    }
  })
}
