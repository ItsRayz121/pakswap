import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { getOrCreateWallet, getUserWallets, getTransactionHistory, requestWithdrawal } from '../services/wallet.service'
import { getPresignedUrl } from '../lib/s3'
import { prisma } from '../lib/prisma'

export default async function walletRoutes(app: FastifyInstance) {
  // GET /api/wallet
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const wallets = await getUserWallets(req.user!.sub)
    return { success: true, data: wallets }
  })

  // GET /api/wallet/address/:coin/:network — get deposit address
  app.get('/address/:coin/:network', { preHandler: [authenticate] }, async (req) => {
    const { coin, network } = req.params as { coin: string; network: string }
    const wallet = await getOrCreateWallet(req.user!.sub, coin.toUpperCase(), network.toUpperCase())
    return { success: true, data: { address: wallet.depositAddress, coin, network } }
  })

  // GET /api/wallet/transactions
  app.get('/transactions', { preHandler: [authenticate] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().max(50).default(20) }).parse(req.query)
    const result = await getTransactionHistory(req.user!.sub, page, limit)
    return { success: true, ...result }
  })

  // GET /api/wallet/deposit-address/:coin
  app.get('/deposit-address/:coin', { preHandler: [authenticate] }, async (req) => {
    const { coin } = req.params as { coin: string }
    const wallet = await getOrCreateWallet(req.user!.sub, coin.toUpperCase(), 'TRC20')
    return { success: true, data: { address: wallet.depositAddress, coin: coin.toUpperCase() } }
  })

  // GET /api/wallet/payment-methods
  app.get('/payment-methods', { preHandler: [authenticate] }, async (req) => {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: req.user!.sub, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: methods }
  })

  // POST /api/wallet/payment-methods
  app.post('/payment-methods', { preHandler: [authenticate] }, async (req, reply) => {
    const body = z.object({
      type: z.enum(['jazzcash', 'easypaisa', 'bank_transfer']),
      accountName: z.string().min(2).max(100),
      mobileNumber: z.string().optional(),
      accountNumber: z.string().optional(),
      bankName: z.string().optional(),
      ibanNumber: z.string().optional(),
    }).parse(req.body)

    const method = await prisma.paymentMethod.create({
      data: { userId: req.user!.sub, displayName: body.accountName, ...body } as any,
    })
    return reply.status(201).send({ success: true, data: method })
  })

  // DELETE /api/wallet/payment-methods/:id
  app.delete('/payment-methods/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.paymentMethod.updateMany({
      where: { id, userId: req.user!.sub },
      data: { isActive: false },
    })
    return { success: true }
  })

  // POST /api/wallet/withdraw
  app.post('/withdraw', { preHandler: [authenticate] }, async (req, reply) => {
    const body = z.object({
      coin: z.string(),
      network: z.string(),
      amount: z.number().positive(),
      toAddress: z.string().min(20),
    }).parse(req.body)

    const user = await (await import('../lib/prisma')).prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { kycLevel: true },
    })

    if (user.kycLevel === 'none') {
      return reply.status(403).send({ success: false, error: 'KYC_REQUIRED' })
    }

    await requestWithdrawal(req.user!.sub, body.coin, body.network, body.amount, body.toAddress)
    return { success: true, message: 'Withdrawal request submitted. Pending admin review.' }
  })
}
