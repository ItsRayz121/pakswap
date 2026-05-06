import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { lockEscrow } from './escrow.service'
import { ocrQueue } from '../lib/queues'
import { uploadFile, SCREENSHOTS_BUCKET } from '../lib/s3'
import { notificationService } from './notification.service'
import { logger } from '../lib/logger'

const PLATFORM_FEE_RATE = parseFloat(process.env.P2P_TAKER_FEE_RATE ?? '0.005')
const MERCHANT_FEE_RATE = parseFloat(process.env.P2P_MERCHANT_FEE_RATE ?? '0.003')
const PAYMENT_WINDOW = parseInt(process.env.TRADE_PAYMENT_WINDOW_SECONDS ?? '900')

function generateOrderRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `PKS-${year}-${rand}`
}

export async function initiateTrade(buyerId: string, adId: string, fiatAmount: number, paymentMethod: string) {
  const ad = await prisma.p2pAd.findUniqueOrThrow({
    where: { id: adId },
    include: { user: { include: { tradingLimits: true, tradeStats: true } } },
  })

  if (ad.status !== 'active') {
    throw Object.assign(new Error('Ad is not active'), { code: 'AD_NOT_ACTIVE', statusCode: 400 })
  }
  if (ad.userId === buyerId) {
    throw Object.assign(new Error('Cannot trade with your own ad'), { code: 'SELF_TRADE', statusCode: 400 })
  }
  if (fiatAmount < parseFloat(ad.minOrderFiat.toString()) || fiatAmount > parseFloat(ad.maxOrderFiat.toString())) {
    throw Object.assign(
      new Error(`Amount must be between ${ad.minOrderFiat} and ${ad.maxOrderFiat} PKR`),
      { code: 'AMOUNT_OUT_OF_RANGE', statusCode: 400 },
    )
  }

  const buyer = await prisma.user.findUniqueOrThrow({
    where: { id: buyerId },
    include: { tradingLimits: true, tradeStats: true },
  })

  if (buyer.kycLevel === 'none') {
    throw Object.assign(new Error('KYC required to trade'), { code: 'KYC_REQUIRED', statusCode: 403 })
  }

  // Check active trade limit
  const activeTrades = await prisma.trade.count({
    where: { buyerId, status: { in: ['created', 'escrow_locked', 'payment_pending', 'payment_claimed', 'under_review'] } },
  })
  if (activeTrades >= parseInt(process.env.MAX_SIMULTANEOUS_TRADES ?? '3')) {
    throw Object.assign(new Error('Maximum simultaneous trades reached'), { code: 'MAX_TRADES', statusCode: 400 })
  }

  const rate = parseFloat(ad.fixedPrice?.toString() ?? '0')
  const coinAmount = fiatAmount / rate
  const platformFee = coinAmount * PLATFORM_FEE_RATE

  const sellerId = ad.userId
  const expiresAt = new Date(Date.now() + PAYMENT_WINDOW * 1000)

  const trade = await prisma.trade.create({
    data: {
      orderRef: generateOrderRef(),
      adId,
      buyerId,
      sellerId,
      coin: ad.coin,
      coinAmount,
      fiatAmount,
      rate,
      paymentMethod,
      platformFee,
      status: 'created',
      expiresAt,
    },
  })

  // Lock escrow
  await lockEscrow(trade.id, sellerId, ad.coin, ad.fiat, coinAmount)

  // Set Redis timer for auto-expiry
  await redis.setex(`trade:timer:${trade.id}`, PAYMENT_WINDOW, '1')

  // System message in chat
  await prisma.tradeMessage.create({
    data: {
      tradeId: trade.id,
      senderId: buyerId,
      message: `Trade initiated. You have ${PAYMENT_WINDOW / 60} minutes to complete payment.`,
      messageType: 'system',
    },
  })

  await notificationService.send({
    userId: sellerId,
    type: 'trade_initiated',
    title: 'New Trade',
    body: `A buyer has initiated a trade for ${coinAmount.toFixed(6)} ${ad.coin}. Order: ${trade.orderRef}`,
  })

  logger.info({ tradeId: trade.id, buyerId, sellerId, coinAmount }, 'Trade initiated')
  return trade
}

export async function claimPayment(tradeId: string, buyerId: string, proofBuffer: Buffer, mimeType: string) {
  const trade = await prisma.trade.findUniqueOrThrow({ where: { id: tradeId } })

  if (trade.buyerId !== buyerId) {
    throw Object.assign(new Error('Unauthorized'), { code: 'FORBIDDEN', statusCode: 403 })
  }
  if (trade.status !== 'escrow_locked' && trade.status !== 'payment_pending') {
    throw Object.assign(new Error('Trade is not awaiting payment'), { code: 'INVALID_STATE', statusCode: 400 })
  }

  // Check timer not expired
  const timerExists = await redis.exists(`trade:timer:${tradeId}`)
  if (!timerExists) {
    await prisma.trade.update({ where: { id: tradeId }, data: { status: 'expired' } })
    throw Object.assign(new Error('Trade payment window has expired'), { code: 'TRADE_EXPIRED', statusCode: 400 })
  }

  const fileUrl = await uploadFile(SCREENSHOTS_BUCKET, `payment-proofs/${tradeId}`, proofBuffer, mimeType)

  await prisma.tradePaymentProof.create({ data: { tradeId, uploadedBy: buyerId, fileUrl } })

  const verification = await prisma.paymentProofVerification.create({
    data: {
      tradeId,
      proofImageUrl: fileUrl,
      expectedAmount: trade.fiatAmount,
      verificationStatus: 'pending_layer1',
    },
  })

  await prisma.trade.update({
    where: { id: tradeId },
    data: { status: 'payment_claimed', paymentClaimedAt: new Date() },
  })

  // Queue Layer 1 OCR verification
  await ocrQueue.add('payment-proof-ocr', {
    verificationId: verification.id,
    tradeId,
    fileUrl,
    expectedAmount: parseFloat(trade.fiatAmount.toString()),
    paymentMethod: trade.paymentMethod,
  })

  await notificationService.send({
    userId: trade.sellerId,
    type: 'payment_claimed',
    title: 'Payment Marked as Sent',
    body: `Buyer has marked payment as sent for order ${trade.orderRef}. Awaiting verification.`,
  })

  return { verificationId: verification.id }
}

export async function cancelTrade(tradeId: string, userId: string, reason: string) {
  const trade = await prisma.trade.findUniqueOrThrow({
    where: { id: tradeId },
    include: { escrowLock: true },
  })

  const isBuyer = trade.buyerId === userId
  const isSeller = trade.sellerId === userId
  if (!isBuyer && !isSeller) {
    throw Object.assign(new Error('Unauthorized'), { code: 'FORBIDDEN', statusCode: 403 })
  }

  const cancellableStatuses = ['created', 'escrow_locked', 'payment_pending']
  if (!cancellableStatuses.includes(trade.status)) {
    throw Object.assign(
      new Error('Trade cannot be cancelled at this stage'),
      { code: 'CANNOT_CANCEL', statusCode: 400 },
    )
  }

  const { refundEscrow } = await import('./escrow.service')
  await refundEscrow(tradeId, userId, reason)

  await redis.del(`trade:timer:${tradeId}`)

  // Track cancellation for risk scoring
  await prisma.userTradeStats.upsert({
    where: { userId },
    update: { cancelledTrades: { increment: 1 } },
    create: { userId, cancelledTrades: 1 },
  })
}

export async function getTradeRoom(tradeId: string, userId: string) {
  const trade = await prisma.trade.findUniqueOrThrow({
    where: { id: tradeId },
    include: {
      buyer: { select: { id: true, fullName: true, username: true, tradeStats: true } },
      seller: { select: { id: true, fullName: true, username: true, tradeStats: true } },
      paymentProofs: true,
      messages: { orderBy: { createdAt: 'asc' }, take: 100 },
      ad: { select: { paymentMethods: true, tradeWindow: true } },
      proofVerifications: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  if (trade.buyerId !== userId && trade.sellerId !== userId) {
    throw Object.assign(new Error('Not a participant in this trade'), { code: 'FORBIDDEN', statusCode: 403 })
  }

  const ttl = await redis.ttl(`trade:timer:${tradeId}`)

  return { ...trade, remainingSeconds: ttl > 0 ? ttl : 0 }
}
