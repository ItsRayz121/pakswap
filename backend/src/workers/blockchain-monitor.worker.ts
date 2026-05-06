import { Worker, Job } from 'bullmq'
import { redisForBullMQ, redis } from '../lib/redis'
import { creditDeposit, confirmDeposit, getOrCreateWallet } from '../services/wallet.service'
import { notificationService } from '../services/notification.service'
import { logger } from '../lib/logger'
import { prisma } from '../lib/prisma'

// TRON polling interval (3 seconds per spec)
const TRON_POLL_INTERVAL = 3000

async function pollTron() {
  const apiUrl = process.env.TRON_API_URL ?? 'https://api.trongrid.io'
  const apiKey = process.env.TRON_API_KEY ?? ''

  try {
    const { default: axios } = await import('axios')

    // Get all watched TRON addresses from Redis
    const addresses = await redis.smembers('watch:TRON:TRC20')
    if (!addresses.length) return

    for (const address of addresses) {
      const { data } = await axios.get(
        `${apiUrl}/v1/accounts/${address}/transactions/trc20?limit=20&only_to=true`,
        { headers: apiKey ? { 'TRON-PRO-API-KEY': apiKey } : {}, timeout: 10000 },
      )

      for (const tx of data.data ?? []) {
        const txHash: string = tx.transaction_id
        const amount = parseInt(tx.value) / 1e6 // USDT has 6 decimals on TRON

        if (amount <= 0) continue

        // Find which user owns this address
        const wallet = await prisma.wallet.findFirst({ where: { depositAddress: address, coin: 'USDT', network: 'TRC20' } })
        if (!wallet) continue

        await creditDeposit(txHash, wallet.userId, 'USDT', 'TRC20', amount)
      }
    }
  } catch (err) {
    logger.warn({ err }, 'TRON poll error')
  }
}

// Deposit confirmation worker
const depositWorker = new Worker(
  'deposit-events',
  async (job: Job) => {
    const { txHash, chain, network, amount, toAddress, confirmations } = job.data

    if (confirmations > 0) {
      await confirmDeposit(txHash, confirmations)

      // Check if fully confirmed and notify user
      const tx = await prisma.walletTransaction.findFirst({ where: { txHash, status: 'confirmed' } })
      if (tx) {
        await notificationService.send({
          userId: tx.userId,
          type: 'deposit_confirmed',
          title: 'Deposit Confirmed',
          body: `${tx.amount} ${tx.coin} has been credited to your wallet.`,
        })
      }
    }
  },
  { connection: redisForBullMQ, concurrency: 5 },
)

depositWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Deposit worker failed')
})

// Initialize TRON poller
if (process.env.NODE_ENV !== 'test') {
  logger.info('Starting TRON blockchain monitor')
  setInterval(pollTron, TRON_POLL_INTERVAL)
}

export default depositWorker
