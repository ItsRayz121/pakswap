import bcrypt from 'bcrypt'
import { randomBytes, createHash } from 'crypto'
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { issueOtp, verifyOtp } from './otp.service'
import { logger } from '../lib/logger'

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '12')

function generateReferralCode(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

/**
 * Single-step signup: email + name + password.
 * Phone & KYC are collected later from the dashboard.
 */
export async function registerUser(data: {
  email: string
  fullName: string
  password: string
  referralCode?: string
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { code: 'EMAIL_EXISTS', statusCode: 409 })
  }

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)
  const referralCode = generateReferralCode()

  let referredById: string | undefined
  if (data.referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: data.referralCode } })
    if (referrer) referredById = referrer.id
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      passwordHash,
      referralCode,
      referredById,
      tradingLimits: { create: {} },
      tradeStats: { create: {} },
    },
  })

  await issueOtp(data.email, 'email_verify')

  logger.info({ userId: user.id, email: data.email }, 'New user registered, verification email sent')
  return { userId: user.id, email: user.email, message: 'Verification code sent to your email' }
}

export async function sendEmailVerificationOtp(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerified: true } })
  if (!user) {
    // Silent — don't reveal account existence
    return
  }
  if (user.emailVerified) {
    throw Object.assign(new Error('Email already verified'), { code: 'ALREADY_VERIFIED', statusCode: 400 })
  }
  await issueOtp(email, 'email_verify')
}

export async function verifyEmail(email: string, code: string): Promise<{ userId: string }> {
  const ok = await verifyOtp(email, 'email_verify', code)
  if (!ok) {
    throw Object.assign(new Error('Invalid or expired verification code'), {
      code: 'INVALID_OTP',
      statusCode: 400,
    })
  }
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
    select: { id: true },
  })
  return { userId: user.id }
}

export async function loginUser(data: {
  emailOrPhone: string
  password: string
  ip?: string
  userAgent?: string
  deviceFp?: string
}) {
  const isPhone = /^\+/.test(data.emailOrPhone) || /^\d{10,}/.test(data.emailOrPhone)

  const user = await prisma.user.findFirst({
    where: isPhone ? { phone: data.emailOrPhone } : { email: data.emailOrPhone },
  })

  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', statusCode: 401 })
  }

  // Login attempt tracking — Redis when available, skip locking when not
  if (redis) {
    const loginAttemptKey = `login:attempts:${user.id}`
    const attempts = parseInt((await redis.get(loginAttemptKey)) ?? '0')
    const maxAttempts = parseInt(process.env.RATE_LIMIT_LOGIN_ATTEMPTS ?? '5')
    if (attempts >= maxAttempts) {
      throw Object.assign(
        new Error('Account temporarily locked due to too many failed login attempts'),
        { code: 'ACCOUNT_LOCKED', statusCode: 429 },
      )
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) {
      await redis.setex(loginAttemptKey, 900, (attempts + 1).toString())
      throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', statusCode: 401 })
    }
    await redis.del(loginAttemptKey)
  } else {
    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', statusCode: 401 })
    }
  }

  if (user.status === 'banned') {
    throw Object.assign(new Error('Account has been banned'), { code: 'ACCOUNT_BANNED', statusCode: 403 })
  }
  if (user.status === 'suspended') {
    throw Object.assign(new Error('Account is suspended'), { code: 'ACCOUNT_SUSPENDED', statusCode: 403 })
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  return {
    userId: user.id,
    role: user.role,
    twoFaEnabled: user.twoFaEnabled,
    kycLevel: user.kycLevel,
    emailVerified: user.emailVerified,
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // Silent — security
  await issueOtp(email, 'password_reset')
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  const ok = await verifyOtp(email, 'password_reset', code)
  if (!ok) {
    throw Object.assign(new Error('Invalid or expired reset code'), { code: 'INVALID_CODE', statusCode: 400 })
  }
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
  const user = await prisma.user.update({
    where: { email },
    data: { passwordHash },
    select: { id: true },
  })
  // Invalidate all sessions
  await prisma.userSession.updateMany({ where: { userId: user.id }, data: { isActive: false } })
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
