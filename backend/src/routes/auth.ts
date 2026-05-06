import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  registerUser,
  loginUser,
  verifyPhoneOtp,
  sendPhoneOtp,
  forgotPassword,
  resetPassword,
} from '../services/auth.service'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../lib/prisma'

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  fullName: z.string().min(2).max(100),
  password: z.string().min(8).max(128),
  referralCode: z.string().optional(),
})

const loginSchema = z.object({
  emailOrPhone: z.string().min(5),
  password: z.string().min(1),
})

export default async function authRoutes(app: FastifyInstance) {
  // POST /api/auth/register
  app.post('/register', async (req, reply) => {
    const body = registerSchema.parse(req.body) as {
      email: string; phone: string; fullName: string; password: string; referralCode?: string
    }
    const result = await registerUser(body)
    return reply.status(201).send({ success: true, data: result })
  })

  // POST /api/auth/verify-otp
  app.post('/verify-otp', async (req, reply) => {
    const { phone, code } = z.object({ phone: z.string(), code: z.string().length(6) }).parse(req.body)
    const ok = await verifyPhoneOtp(phone, code)
    if (!ok) return reply.status(400).send({ success: false, error: 'INVALID_OTP', message: 'Invalid or expired OTP' })
    return { success: true, message: 'Phone verified successfully' }
  })

  // POST /api/auth/resend-otp
  app.post('/resend-otp', async (req, reply) => {
    const { phone } = z.object({ phone: z.string() }).parse(req.body)
    await sendPhoneOtp(phone)
    return { success: true, message: 'OTP sent' }
  })

  // POST /api/auth/login
  app.post('/login', async (req, reply) => {
    const body = loginSchema.parse(req.body)
    const loginBody = body as { emailOrPhone: string; password: string }
    const result = await loginUser({
      ...loginBody,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    })

    if (result.twoFaEnabled) {
      // Issue a short-lived pre-auth token
      const preAuthToken = app.jwt.sign({ sub: result.userId, role: result.role, type: 'pre_auth' }, { expiresIn: 300 })
      return { success: true, data: { requiresTwoFa: true, preAuthToken } }
    }

    const accessToken = app.jwt.sign({ sub: result.userId, role: result.role })
    const refreshToken = app.jwt.sign({ sub: result.userId, role: result.role, type: 'refresh' }, { expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRY ?? '2592000') })

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        role: result.role,
        kycLevel: result.kycLevel,
      },
    }
  })

  // POST /api/auth/2fa/verify (complete login after 2FA)
  app.post('/2fa/verify', async (req, reply) => {
    const { preAuthToken, totpCode } = z.object({ preAuthToken: z.string(), totpCode: z.string().length(6) }).parse(req.body)
    const payload = app.jwt.verify<{ sub: string; role: string; type: string }>(preAuthToken)
    if (payload.type !== 'pre_auth') return reply.status(400).send({ success: false, error: 'INVALID_TOKEN' })

    const twoFa = await prisma.userTwoFa.findUnique({ where: { userId: payload.sub } })
    if (!twoFa?.secret) return reply.status(400).send({ success: false, error: 'TWO_FA_NOT_SETUP' })

    const { authenticator } = await import('otplib')
    const valid = authenticator.verify({ token: totpCode, secret: twoFa.secret })
    if (!valid) return reply.status(401).send({ success: false, error: 'INVALID_TOTP' })

    const accessToken = app.jwt.sign({ sub: payload.sub, role: payload.role })
    return { success: true, data: { accessToken } }
  })

  // POST /api/auth/refresh
  app.post('/refresh', async (req, reply) => {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body)
    const payload = app.jwt.verify<{ sub: string; role: string; type: string }>(refreshToken)
    if (payload.type !== 'refresh') return reply.status(400).send({ success: false, error: 'INVALID_TOKEN' })
    const accessToken = app.jwt.sign({ sub: payload.sub, role: payload.role })
    return { success: true, data: { accessToken } }
  })

  // POST /api/auth/forgot-password
  app.post('/forgot-password', async (req) => {
    const body = z.object({ email: z.string().optional(), emailOrPhone: z.string().optional() }).parse(req.body)
    const identifier = body.email ?? body.emailOrPhone ?? ''
    await forgotPassword(identifier)
    return { success: true, message: 'If an account exists, a reset code has been sent' }
  })

  // POST /api/auth/reset-password
  app.post('/reset-password', async (req, reply) => {
    const body = z.object({
      email: z.string().email().optional(),
      otp: z.string().length(6).optional(),
      code: z.string().length(6).optional(),
      newPassword: z.string().min(8),
    }).parse(req.body)

    const code = body.otp ?? body.code ?? ''
    if (!code) return reply.status(400).send({ success: false, error: 'OTP_REQUIRED' })

    // Look up user by email to get userId
    if (body.email) {
      const user = await prisma.user.findUnique({ where: { email: body.email }, select: { id: true } })
      if (!user) return reply.status(400).send({ success: false, error: 'INVALID_RESET' })
      await resetPassword(user.id, code, body.newPassword)
    }
    return { success: true, message: 'Password reset successfully' }
  })

  // POST /api/auth/logout
  app.post('/logout', { preHandler: [authenticate] }, async (req) => {
    await prisma.userSession.updateMany({
      where: { userId: req.user!.sub, isActive: true },
      data: { isActive: false },
    })
    return { success: true, message: 'Logged out' }
  })

  // GET /api/auth/me
  app.get('/me', { preHandler: [authenticate] }, async (req) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        username: true,
        role: true,
        status: true,
        kycLevel: true,
        kycStatus: true,
        twoFaEnabled: true,
        referralCode: true,
        createdAt: true,
      },
    })
    return { success: true, data: user }
  })

  // GET /api/auth/sessions
  app.get('/sessions', { preHandler: [authenticate] }, async (req) => {
    const sessions = await prisma.userSession.findMany({
      where: { userId: req.user!.sub, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: sessions }
  })

  // DELETE /api/auth/sessions/:id
  app.delete('/sessions/:id', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await prisma.userSession.updateMany({
      where: { id, userId: req.user!.sub },
      data: { isActive: false },
    })
    return { success: true }
  })

  // PATCH /api/auth/profile
  app.patch('/profile', { preHandler: [authenticate] }, async (req) => {
    const body = z.object({
      username: z.string().min(3).max(30).optional(),
      phone: z.string().min(10).max(20).optional(),
    }).parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: body,
      select: { id: true, email: true, phone: true, fullName: true, username: true, kycLevel: true, kycStatus: true, twoFaEnabled: true, referralCode: true },
    })
    return { success: true, data: user }
  })

  // POST /api/auth/change-password
  app.post('/change-password', { preHandler: [authenticate] }, async (req, reply) => {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(8),
      newPassword: z.string().min(8),
    }).parse(req.body)

    const bcrypt = await import('bcrypt')
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } })
    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return reply.status(400).send({ success: false, error: 'WRONG_PASSWORD', message: 'Current password is incorrect' })

    const hash = await (bcrypt as any).hash(newPassword, 12)
    await prisma.user.update({ where: { id: req.user!.sub }, data: { passwordHash: hash } })
    return { success: true, message: 'Password changed successfully' }
  })

  // POST /api/auth/2fa/setup — generate TOTP secret + QR code
  app.post('/2fa/setup', { preHandler: [authenticate] }, async (req) => {
    const { authenticator } = await import('otplib')
    const { toDataURL } = await import('qrcode')
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub }, select: { email: true } })
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(user.email, 'PakSwap', secret)
    const qrCodeUrl = await toDataURL(otpauth)

    // Store temp secret (not activated until verified)
    await prisma.userTwoFa.upsert({
      where: { userId: req.user!.sub },
      create: { userId: req.user!.sub, secret, enabled: false },
      update: { secret, enabled: false },
    })
    return { success: true, data: { secret, qrCodeUrl } }
  })

  // POST /api/auth/2fa/verify — activate 2FA after scanning QR
  app.post('/2fa/verify', { preHandler: [authenticate] }, async (req, reply) => {
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body)
    const twoFa = await prisma.userTwoFa.findUnique({ where: { userId: req.user!.sub } })
    if (!twoFa?.secret) return reply.status(400).send({ success: false, error: 'TWO_FA_NOT_SETUP' })

    const { authenticator } = await import('otplib')
    const valid = authenticator.verify({ token: code, secret: twoFa.secret })
    if (!valid) return reply.status(401).send({ success: false, error: 'INVALID_TOTP', message: 'Invalid code' })

    await prisma.$transaction([
      prisma.userTwoFa.update({ where: { userId: req.user!.sub }, data: { enabled: true } }),
      prisma.user.update({ where: { id: req.user!.sub }, data: { twoFaEnabled: true } }),
    ])
    return { success: true, message: '2FA enabled' }
  })

  // POST /api/auth/2fa/disable
  app.post('/2fa/disable', { preHandler: [authenticate] }, async (req, reply) => {
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body)
    const twoFa = await prisma.userTwoFa.findUnique({ where: { userId: req.user!.sub } })
    if (!twoFa?.secret || !twoFa.enabled) return reply.status(400).send({ success: false, error: 'TWO_FA_NOT_ENABLED' })

    const { authenticator } = await import('otplib')
    const valid = authenticator.verify({ token: code, secret: twoFa.secret })
    if (!valid) return reply.status(401).send({ success: false, error: 'INVALID_TOTP', message: 'Invalid code' })

    await prisma.$transaction([
      prisma.userTwoFa.update({ where: { userId: req.user!.sub }, data: { enabled: false } }),
      prisma.user.update({ where: { id: req.user!.sub }, data: { twoFaEnabled: false } }),
    ])
    return { success: true, message: '2FA disabled' }
  })
}
