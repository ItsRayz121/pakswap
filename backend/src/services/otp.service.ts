import { createHmac, randomInt } from 'crypto'
import { prisma } from '../lib/prisma'
import { sendEmail, otpEmail } from '../lib/email'
import { logger } from '../lib/logger'

const OTP_TTL_SECONDS = 10 * 60 // 10 minutes
const MAX_ATTEMPTS = 5
const RESEND_COOLDOWN_SECONDS = 60
const HOURLY_LIMIT = parseInt(process.env.RATE_LIMIT_OTP_PER_HOUR ?? '5')

export type OtpType = 'email_verify' | 'password_reset' | 'phone_verify'

function hashCode(code: string): string {
  const secret = process.env.OTP_HASH_SECRET ?? process.env.JWT_SECRET ?? 'dev-otp-secret-change-me'
  return createHmac('sha256', secret).update(code).digest('hex')
}

function generateCode(): string {
  // crypto.randomInt is uniformly distributed — Math.random is not
  return randomInt(100000, 1000000).toString()
}

/**
 * Issue a new OTP for `target` (email or phone).
 * - 60-sec cooldown since last unused issue
 * - Max 5 OTPs/hour per target
 * - Code hashed with HMAC-SHA256(secret) before storing
 * - For type='email_verify' or 'password_reset', also sends the email via Resend
 */
export async function issueOtp(target: string, type: OtpType): Promise<{ sent: boolean }> {
  // Cooldown: most recent unused OTP must be older than 60s
  const recent = await prisma.otpCode.findFirst({
    where: { target, type, usedAt: null },
    orderBy: { createdAt: 'desc' },
  })
  if (recent) {
    const ageSec = (Date.now() - recent.createdAt.getTime()) / 1000
    if (ageSec < RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - ageSec)
      throw Object.assign(new Error(`Please wait ${wait}s before requesting another code`), {
        code: 'OTP_COOLDOWN',
        statusCode: 429,
        retryAfter: wait,
      })
    }
  }

  // Hourly cap
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const lastHour = await prisma.otpCode.count({
    where: { target, type, createdAt: { gte: oneHourAgo } },
  })
  if (lastHour >= HOURLY_LIMIT) {
    throw Object.assign(new Error('Too many code requests. Try again in an hour.'), {
      code: 'OTP_RATE_LIMIT',
      statusCode: 429,
    })
  }

  const code = generateCode()
  const codeHash = hashCode(code)
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000)

  // Invalidate any prior unused OTPs for this target+type — only the latest is valid
  await prisma.otpCode.updateMany({
    where: { target, type, usedAt: null },
    data: { usedAt: new Date() },
  })

  await prisma.otpCode.create({ data: { target, codeHash, type, expiresAt } })

  if (type === 'email_verify' || type === 'password_reset') {
    const tpl = otpEmail(code, type === 'password_reset' ? 'reset' : 'verify')
    await sendEmail({ to: target, ...tpl })
  } else {
    // Phone OTP — for Phase 3 (KYC). Stub for now: log to console.
    logger.warn({ target, code }, '[OTP — phone channel not configured, code logged for dev]')
  }

  return { sent: true }
}

/**
 * Verify a submitted code against the latest unused OTP for `target` + `type`.
 * Returns true on success and marks the row used. Increments `attempts` on failure.
 * Locks the OTP after 5 failed attempts.
 */
export async function verifyOtp(target: string, type: OtpType, code: string): Promise<boolean> {
  const record = await prisma.otpCode.findFirst({
    where: { target, type, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })
  if (!record) return false

  if (record.attempts >= MAX_ATTEMPTS) {
    // Burn the record so a fresh one must be issued
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    })
    throw Object.assign(new Error('Too many incorrect attempts. Request a new code.'), {
      code: 'OTP_MAX_ATTEMPTS',
      statusCode: 429,
    })
  }

  const submitted = hashCode(code)
  if (submitted !== record.codeHash) {
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    })
    return false
  }

  await prisma.otpCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })
  return true
}
