import { prisma } from '../lib/prisma'
import { logger } from '../lib/logger'

/**
 * Lock seller funds into escrow when a trade is accepted.
 * Uses a PostgreSQL transaction with SELECT FOR UPDATE to prevent double-spend.
 */
export async function lockEscrow(tradeId: string, sellerId: string, coin: string, network: string, amount: number) {
  await prisma.$transaction(async (tx) => {
    // Lock row to prevent concurrent modifications
    const wallet = await tx.wallet.findFirst({
      where: { userId: sellerId, coin, network },
    })

    if (!wallet) {
      throw Object.assign(new Error('Seller wallet not found'), { code: 'WALLET_NOT_FOUND', statusCode: 404 })
    }

    const available = parseFloat(wallet.balance.toString())
    if (available < amount) {
      throw Object.assign(
        new Error('Insufficient balance to lock in escrow'),
        { code: 'INSUFFICIENT_BALANCE', statusCode: 400 },
      )
    }

    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        lockedBalance: { increment: amount },
      },
    })

    await tx.escrowLock.create({
      data: {
        tradeId,
        sellerId,
        walletId: wallet.id,
        coin,
        amount,
        status: 'locked',
      },
    })

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId: sellerId,
        type: 'trade_lock',
        amount,
        coin,
        network,
        status: 'confirmed',
        relatedTradeId: tradeId,
      },
    })

    await tx.trade.update({
      where: { id: tradeId },
      data: { status: 'escrow_locked', escrowLockedAt: new Date() },
    })

    logger.info({ tradeId, sellerId, amount, coin }, 'Escrow locked')
  })
}

/**
 * Release escrow to buyer after admin Layer 2 approval.
 * This is the ONLY code path that credits the buyer — no automated trigger.
 */
export async function releaseEscrow(tradeId: string, adminId: string, notes?: string) {
  const trade = await prisma.trade.findUniqueOrThrow({
    where: { id: tradeId },
    include: { escrowLock: true },
  })

  if (trade.status !== 'payment_claimed' && trade.status !== 'under_review') {
    throw Object.assign(
      new Error(`Cannot release trade in status: ${trade.status}`),
      { code: 'INVALID_TRADE_STATUS', statusCode: 400 },
    )
  }

  const lock = trade.escrowLock
  if (!lock) throw Object.assign(new Error('Escrow lock not found'), { code: 'NO_ESCROW', statusCode: 500 })

  const coinAmount = parseFloat(lock.amount.toString())
  const platformFee = parseFloat((trade.platformFee ?? 0).toString())
  const buyerReceives = coinAmount - platformFee

  await prisma.$transaction(async (tx) => {
    // Debit seller locked balance
    await tx.wallet.update({
      where: { id: lock.walletId },
      data: { lockedBalance: { decrement: coinAmount } },
    })

    // Credit buyer
    const buyerWallet = await tx.wallet.findFirstOrThrow({
      where: { userId: trade.buyerId, coin: lock.coin },
    })
    await tx.wallet.update({
      where: { id: buyerWallet.id },
      data: { balance: { increment: buyerReceives } },
    })

    // Close escrow lock
    await tx.escrowLock.update({
      where: { tradeId },
      data: { status: 'released', releasedAt: new Date() },
    })

    // Update trade
    await tx.trade.update({
      where: { id: tradeId },
      data: { status: 'completed', completedAt: new Date() },
    })

    // Log wallet transactions
    await tx.walletTransaction.createMany({
      data: [
        {
          walletId: lock.walletId,
          userId: trade.sellerId,
          type: 'trade_release',
          amount: coinAmount,
          coin: lock.coin,
          status: 'confirmed',
          relatedTradeId: tradeId,
        },
        {
          walletId: buyerWallet.id,
          userId: trade.buyerId,
          type: 'trade_release',
          amount: buyerReceives,
          coin: lock.coin,
          status: 'confirmed',
          relatedTradeId: tradeId,
        },
      ],
    })

    // Audit log
    await tx.adminAuditLog.create({
      data: {
        adminId,
        actionType: 'trade_release',
        resourceId: tradeId,
        resourceType: 'trade',
        decision: 'release_to_buyer',
        notes,
      },
    })

    // Update ad completed count
    await tx.p2pAd.update({
      where: { id: trade.adId },
      data: { completedCount: { increment: 1 } },
    })

    // Update trade stats
    await tx.userTradeStats.upsert({
      where: { userId: trade.buyerId },
      update: { totalTrades: { increment: 1 }, completedTrades: { increment: 1 } },
      create: { userId: trade.buyerId, totalTrades: 1, completedTrades: 1 },
    })
    await tx.userTradeStats.upsert({
      where: { userId: trade.sellerId },
      update: { totalTrades: { increment: 1 }, completedTrades: { increment: 1 } },
      create: { userId: trade.sellerId, totalTrades: 1, completedTrades: 1 },
    })

    logger.info({ tradeId, adminId, buyerReceives }, 'Escrow released to buyer')
  })
}

/**
 * Refund escrow back to seller (cancel or dispute resolved in seller's favor).
 */
export async function refundEscrow(tradeId: string, adminId: string, reason: string) {
  const trade = await prisma.trade.findUniqueOrThrow({
    where: { id: tradeId },
    include: { escrowLock: true },
  })

  const lock = trade.escrowLock
  if (!lock) {
    // No escrow lock — trade may not have gotten that far
    await prisma.trade.update({ where: { id: tradeId }, data: { status: 'cancelled', cancelledAt: new Date(), cancelReason: reason } })
    return
  }

  const coinAmount = parseFloat(lock.amount.toString())

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: lock.walletId },
      data: {
        balance: { increment: coinAmount },
        lockedBalance: { decrement: coinAmount },
      },
    })

    await tx.escrowLock.update({
      where: { tradeId },
      data: { status: 'refunded', releasedAt: new Date() },
    })

    await tx.trade.update({
      where: { id: tradeId },
      data: { status: 'cancelled', cancelledAt: new Date(), cancelReason: reason },
    })

    await tx.walletTransaction.create({
      data: {
        walletId: lock.walletId,
        userId: trade.sellerId,
        type: 'trade_refund',
        amount: coinAmount,
        coin: lock.coin,
        status: 'confirmed',
        relatedTradeId: tradeId,
      },
    })

    await tx.adminAuditLog.create({
      data: {
        adminId,
        actionType: 'trade_refund',
        resourceId: tradeId,
        resourceType: 'trade',
        decision: 'return_to_seller',
        notes: reason,
      },
    })

    logger.info({ tradeId, adminId, coinAmount }, 'Escrow refunded to seller')
  })
}
