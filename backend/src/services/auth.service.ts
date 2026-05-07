import bcrypt from 'bcrypt'
import { randomBytes, createHash } from 'crypto'
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { sendSms } from '../lib/twilio'
import { sendEmail, TEMPLATES } from '../lib/sendgrid'
import { logger } from '../lib/logger'

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '12')
const OTP_TTL = 600 // 10 minutes

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generateReferralCode(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

export async function registerUser(data: {
  email: string
  phone: string
  fullName: string
  password: string
  referralCode?: string
}) {
  const [existingEmail, existingPhone] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.user.findUnique({ where: { phone: data.phone } }),
  ])
  if (existingEmail) throw Object.assign(new Error('Email already registered'), { code: 'EMAIL_EXISTS', statusCode: 409 })
  if (existingPhone) throw Object.assign(new Error('Phone already registered'), { code: 'PHONE_EXISTS', statusCode: 409 })

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
      phone: data.phone,
      fullName: data.fullName,
      passwordHash,
      referralCode,
      referredById,
      tradingLimits: { create: {} },
      tradeStats: { create: {} },
    },
  })

  await sendPhoneOtp(data.phone)

  sendEmail({
    to: data.email,
    templateId: TEMPLATES.WELCOME,
    dynamicTemplateData: { name: data.fullName, referralCode },
  }).catch((err) => logger.warn({ err }, 'Welcome email failed'))

  return { userId: user.id, message: 'OTP sent to your phone number' }
}

export async function sendPhoneOtp(phone: string): Promise<void> {
  // OTP rate limit — Redis when available, otherwise skip rate limiting
  if (redis) {
    const rateLimitKey = `otp:rate:${phone}`
    const count = await redis.incr(rateLimitKey)
    if (count === 1) await redis.expire(rateLimitKey, 3600)
    if (count > parseInt(process.env.RATE_LIMIT_OTP_PER_HOUR ?? '5')) {
      throw Object.assign(new Error('Too many OTP requests'), { code: 'OTP_RATE_LIMIT', statusCode: 429 })
    }
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + OTP_TTL * 1000)

  // Always persist OTP in DB (source of truth)
  await prisma.otpCode.create({ data: { target: phone, code, type: 'phone_verify', expiresAt } })

  // Also cache in Redis for fast lookup when available
  if (redis) await redis.setex(`otp:phone:${phone}`, OTP_TTL, code)

  await sendSms(phone, `Your PakSwap verification code is: ${code}. Valid for 10 minutes.`)
}

export async function verifyPhoneOtp(phone: string, code: string): Promise<boolean> {
  // Check Redis first (fast path), fall back to DB
  if (redis) {
    const stored = await redis.get(`otp:phone:${phone}`)
    if (!stored || stored !== code) return false
    await redis.del(`otp:phone:${phone}`)
  } else {
    const record = await prisma.otpCode.findFirst({
      where: { target: phone, code, type: 'phone_verify', usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    })
    if (!record) return false
    await prisma.otpCode.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  }

  await prisma.user.update({ where: { phone }, data: { phoneVerified: true } })
  return true
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

  sendEmail({
    to: user.email,
    templateId: TEMPLATES.LOGIN_ALERT,
    dynamicTemplateData: {
      name: user.fullName,
      ip: data.ip ?? 'Unknown',
      userAgent: data.userAgent ?? 'Unknown',
      time: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    },
  }).catch(() => {})

  return { userId: user.id, role: user.role, twoFaEnabled: user.twoFaEnabled, kycLevel: user.kycLevel }
}

export async function forgotPassword(emailOrPhone: string): Promise<void> {
  const isPhone = /^\+|\d{10,}/.test(emailOrPhone)
  const user = await prisma.user.findFirst({
    where: isPhone ? { phone: emailOrPhone } : { email: emailOrPhone },
  })
  if (!user) return // Silently succeed (security)

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + OTP_TTL * 1000)

  await prisma.otpCode.create({ data: { target: user.id, code, type: 'password_reset', expiresAt } })
  if (redis) await redis.setex(`otp:reset:${user.id}`, OTP_TTL, code)

  if (isPhone) {
    await sendSms(user.phone, `Your PakSwap password reset code is: ${code}. Valid for 10 minutes.`)
  } else {
    await sendEmail({
      to: user.email,
      templateId: TEMPLATES.LOGIN_ALERT,
      dynamicTemplateData: { name: user.fullName, resetCode: code },
    })
  }
}

export async function resetPassword(userId: string, code: string, newPassword: string): Promise<void> {
  let valid = false

  if (redis) {
    const stored = await redis.get(`otp:reset:${userId}`)
    valid = stored === code
    if (valid) await redis.del(`otp:reset:${userId}`)
  } else {
    const record = await prisma.otpCode.findFirst({
      where: { target: userId, code, type: 'password_reset', usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    })
    valid = !!record
    if (record) await prisma.otpCode.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  }

  if (!valid) {
    throw Object.assign(new Error('Invalid or expired reset code'), { code: 'INVALID_CODE', statusCode: 400 })
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  await prisma.userSession.updateMany({ where: { userId }, data: { isActive: false } })
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
