import { Worker, Job } from 'bullmq'
import { redis } from '../lib/redis'
import { prisma } from '../lib/prisma'
import { notificationService } from '../services/notification.service'
import axios from 'axios'

interface PayoutJob {
  withdrawalId: string
}

const SIGNING_SERVICE_URL = process.env.SIGNING_SERVICE_URL ?? 'http://localhost:3001'

async function processPayout(job: Job<PayoutJob>) {
  const { withdrawalId } = job.data

  // Withdrawal has no wallet relation — load separately
  const withdrawal = await prisma.withdrawal.findUniqueOrThrow({ where: { id: withdrawalId } })

  if (withdrawal.status !== 'approved') {
    throw new Error(`Withdrawal ${withdrawalId} is not in approved state`)
  }

  await prisma.withdrawal.update({ where: { id: withdrawalId }, data: { status: 'processing' } })

  try {
    const sigRes = await axios.post(`${SIGNING_SERVICE_URL}/sign-and-broadcast`, {
      coin: withdrawal.coin,
      network: withdrawal.network,
      toAddress: withdrawal.toAddress,
      amount: withdrawal.amount.toString(),
      fee: withdrawal.networkFee?.toString() ?? '0',
    }, {
      timeout: 30_000,
      headers: { 'X-Internal-Secret': process.env.SIGNING_SERVICE_SECRET },
    })

    const { txHash } = sigRes.data

    // Find the user's wallet for this coin/network to record the tx
    const wallet = await prisma.wallet.findFirst({
      where: { userId: withdrawal.userId, coin: withdrawal.coin, network: withdrawal.network },
    })

    await prisma.$transaction([
      prisma.withdrawal.update({
        where: { id: withdrawalId },
        // confirmedAt is the completion timestamp; use adminNotes for any notes
        data: { status: 'completed', txHash, confirmedAt: new Date() },
      }),
      ...(wallet ? [prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          userId: withdrawal.userId,
          type: 'withdrawal',
          amount: withdrawal.amount,
          coin: withdrawal.coin,
          network: withdrawal.network,
          txHash,
          status: 'confirmed',
          metadata: { withdrawalId } as any,
        },
      })] : []),
    ])

    await notificationService.send({
      userId: withdrawal.userId,
      title: 'Withdrawal Sent',
      body: `${withdrawal.amount} ${withdrawal.coin} sent. TX: ${txHash.slice(0, 16)}...`,
      type: 'withdrawal_completed',
      data: { withdrawalId, txHash },
    })
  } catch (err: any) {
    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'failed', adminNotes: err.message },
    })

    await notificationService.send({
      userId: withdrawal.userId,
      title: 'Withdrawal Failed',
      body: `Your withdrawal of ${withdrawal.amount} ${withdrawal.coin} could not be processed. Please contact support.`,
      type: 'withdrawal_failed',
      data: { withdrawalId },
    })

    throw err
  }
}

export const payoutWorker = new Worker<PayoutJob>(
  'payout-jobs',
  processPayout,
  {
    connection: redis,
    concurrency: 2,
    limiter: { max: 10, duration: 60_000 },
  }
)

payoutWorker.on('failed', (job, err) => {
  console.error(`[payout] Job ${job?.id} failed:`, err.message)
})

payoutWorker.on('completed', (job) => {
  console.log(`[payout] Job ${job.id} completed`)
})
