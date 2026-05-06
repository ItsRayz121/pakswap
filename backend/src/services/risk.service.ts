import { prisma } from '../lib/prisma'
import { RiskLevel } from '@prisma/client'

interface RiskFactors {
  kycAttempts?: number
  failedTrades?: number
  disputeRate?: number
  largeVolumeSpike?: boolean
  newAccount?: boolean
  ipMismatch?: boolean
  multipleDevices?: boolean
}

function calculateScore(factors: RiskFactors): number {
  let score = 0
  if (factors.kycAttempts && factors.kycAttempts > 2) score += 20
  if (factors.failedTrades && factors.failedTrades > 3) score += 25
  if (factors.disputeRate && factors.disputeRate > 0.2) score += 30
  if (factors.largeVolumeSpike) score += 20
  if (factors.newAccount) score += 10
  if (factors.ipMismatch) score += 15
  if (factors.multipleDevices && factors.multipleDevices) score += 10
  return Math.min(score, 100)
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 70) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}

export async function recalculateUserRisk(userId: string): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      kyc: { orderBy: { createdAt: 'desc' } },
      tradeStats: true,
      sessions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  const stats = user.tradeStats
  const kycAttempts = user.kyc.length
  const failedTrades = stats ? Number(stats.cancelledTrades) + Number(stats.disputedTrades) : 0
  const totalTrades = stats ? Number(stats.totalTrades) : 0
  const disputeRate = totalTrades > 0 ? Number(stats?.disputedTrades ?? 0) / totalTrades : 0

  const accountAgeMs = Date.now() - user.createdAt.getTime()
  const newAccount = accountAgeMs < 7 * 24 * 60 * 60 * 1000 // less than 7 days

  const uniqueIps = new Set(user.sessions.map((s: any) => s.ipAddress)).size
  const multipleDevices = uniqueIps > 5

  const factors: RiskFactors = {
    kycAttempts,
    failedTrades,
    disputeRate,
    newAccount,
    multipleDevices,
  }

  const score = calculateScore(factors)
  const level = scoreToLevel(score)

  await prisma.userRiskScore.upsert({
    where: { userId },
    create: {
      userId,
      score,
      riskLevel: level,
      factors: factors as any,
    },
    update: {
      score,
      riskLevel: level,
      factors: factors as any,
      calculatedAt: new Date(),
    },
  })

  // Auto-flag critical risk users
  if (level === 'critical') {
    await prisma.riskFlag.create({
      data: {
        userId,
        flagType: 'auto_risk_score',
        severity: 'critical',
        reason: `Automated risk score reached ${score}/100`,
        metadata: factors as any,
      },
    }).catch(() => {}) // ignore duplicate
  }
}

export async function flagUserForReview(
  userId: string,
  flagType: string,
  reason: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.riskFlag.create({
    data: { userId, flagType, reason, severity, metadata: metadata ?? {} },
  })
  await recalculateUserRisk(userId)
}
