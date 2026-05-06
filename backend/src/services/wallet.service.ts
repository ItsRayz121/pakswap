import { prisma } from '../lib/prisma'
import { depositQueue } from '../lib/queues'
import { logger } from '../lib/logger'

const CONFIRMATION_THRESHOLDS: Record<string, Record<string, number>> = {
  USDT: { TRC20: 20, ERC20: 12, BEP20: 15 },
  ETH: { ERC20: 12 },
  BTC: { BTC: 3 },
  BNB: { BEP20: 15 },
  USDC: { ERC20: 12 },
}

export async function getOrCreateWallet(userId: string, coin: string, network: string) {
  let wallet = await prisma.wallet.findFirst({ where: { userId, coin, network } })
  if (!wallet) {
    // Assign deposit address via HD derivation (simplified — real impl uses KMS HD wallet)
    const index = await prisma.wallet.count({ where: { coin, network } })
    wallet = await prisma.wallet.create({
      data: {
        userId,
        coin,
        network,
        addressIndex: index,
        depositAddress: await generateDepositAddress(coin, network, index),
      },
    })
  }
  return wallet
}

async function generateDepositAddress(coin: string, network: string, index: number): Promise<string> {
  // In production: call signing service to derive HD address at m/44'/{coin}'/{account}'/0/{index}
  // For now return a placeholder that won't be used in dev
  return `dev_${coin}_${network}_${index}_placeholder`
}

export async function getUserWallets(userId: string) {
  return prisma.wallet.findMany({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })
}

export async function getTransactionHistory(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit
  const [transactions, total] = await Promise.all([
    prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.walletTransaction.count({ where: { userId } }),
  ])
  return { transactions, total, page, limit }
}

export async function requestWithdrawal(
  userId: string,
  coin: string,
  network: string,
  amount: number,
  toAddress: string,
) {
  const networkFee = 0 // TODO: fetch from blockchain fee oracle
  const total = amount + networkFee

  const wallet = await prisma.wallet.findFirst({ where: { userId, coin, network } })
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { code: 'WALLET_NOT_FOUND', statusCode: 404 })

  const available = parseFloat(wallet.balance.toString())
  if (available < total) {
    throw Object.assign(new Error('Insufficient balance'), { code: 'INSUFFICIENT_BALANCE', statusCode: 400 })
  }

  // Debit balance immediately
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: total } },
    }),
    prisma.withdrawal.create({
      data: {
        userId,
        coin,
        network,
        amount,
        networkFee,
        toAddress,
        status: 'pending',
      },
    }),
  ])

  logger.info({ userId, coin, amount, toAddress }, 'Withdrawal requested')
}

export async function creditDeposit(
  txHash: string,
  userId: string,
  coin: string,
  network: string,
  amount: number,
) {
  const existing = await prisma.walletTransaction.findFirst({ where: { txHash } })
  if (existing) return // Idempotency — already processed

  const wallet = await getOrCreateWallet(userId, coin, network)
  const confsRequired = CONFIRMATION_THRESHOLDS[coin]?.[network] ?? 12

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      userId,
      type: 'deposit',
      amount,
      coin,
      network,
      txHash,
      status: 'pending_confirmations',
      confsRequired,
    },
  })

  logger.info({ txHash, userId, coin, amount }, 'Deposit detected')
}

export async function confirmDeposit(txHash: string, confirmations: number) {
  const tx = await prisma.walletTransaction.findFirst({ where: { txHash, type: 'deposit' } })
  if (!tx || tx.status === 'confirmed') return

  if (confirmations >= (tx.confsRequired ?? 12)) {
    await prisma.$transaction([
      prisma.walletTransaction.update({
        where: { id: tx.id },
        data: { status: 'confirmed', confsSeen: confirmations, confirmedAt: new Date() },
      }),
      prisma.wallet.update({
        where: { id: tx.walletId },
        data: { balance: { increment: parseFloat(tx.amount.toString()) } },
      }),
    ])
    logger.info({ txHash, userId: tx.userId }, 'Deposit confirmed and credited')
  } else {
    await prisma.walletTransaction.update({
      where: { id: tx.id },
      data: { confsSeen: confirmations },
    })
  }
}
