import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { logger } from './lib/logger'

// Routes
import authRoutes from './routes/auth'
import kycRoutes from './routes/kyc'
import marketplaceRoutes from './routes/marketplace'
import adsRoutes from './routes/ads'
import tradesRoutes from './routes/trades'
import walletRoutes from './routes/wallet'
import disputesRoutes from './routes/disputes'
import notificationsRoutes from './routes/notifications'
import adminRoutes from './routes/admin'
import webhookRoutes from './routes/webhooks'
import instantBuyRoutes from './routes/instant-buy'
import referralRoutes from './routes/referral'
import merchantRoutes from './routes/merchants'

export async function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'production' ? logger : false,
    trustProxy: true,
  })

  // Helmet — security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })

  // ─── CORS ────────────────────────────────────────────────────────────────
  // Allow-list parsed from CORS_ORIGINS (comma-separated). Whitespace and
  // trailing slashes are tolerated. The Vercel production URL and localhost
  // are always allowed even if the env var is missing or wrong, so a typo in
  // Railway settings can't lock the frontend out.
  const ALWAYS_ALLOWED = ['https://pakswap.vercel.app', 'http://localhost:3000']
  const envOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean)
  const allowedOrigins = Array.from(new Set([...ALWAYS_ALLOWED, ...envOrigins]))
  // Vercel preview deployments (e.g. https://pakswap-git-feature-xyz.vercel.app)
  const vercelPreviewRe = /^https:\/\/pakswap[a-z0-9-]*\.vercel\.app$/

  logger.info({ allowedOrigins }, '[CORS] resolved allow-list')

  await app.register(cors, {
    origin: (origin, cb) => {
      // No origin header (curl, server-to-server, same-origin) — allow.
      if (!origin) return cb(null, true)
      const normalised = origin.replace(/\/+$/, '')
      if (allowedOrigins.includes(normalised)) return cb(null, true)
      if (vercelPreviewRe.test(normalised)) return cb(null, true)
      logger.warn({ origin }, '[CORS] blocked')
      cb(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // cache preflight for 24h
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  // Rate limiting — use Redis if REDIS_URL is set, otherwise in-memory
  const redisForRateLimit = process.env.REDIS_URL ? (await import('./lib/redis')).redis : undefined
  await app.register(rateLimit, {
    ...(redisForRateLimit ? { redis: redisForRateLimit } : {}),
    max: parseInt(process.env.RATE_LIMIT_GLOBAL_RPM ?? '300'),
    timeWindow: '1 minute',
    skipOnError: true,
    allowList: ['/health'],
    keyGenerator: (req) => {
      return (req.user as { sub?: string } | undefined)?.sub ?? req.ip
    },
    errorResponseBuilder: () => ({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please slow down.',
    }),
  })

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production-minimum-64-chars-long!!!!',
    sign: {
      expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRY ?? '900'),
    },
  })

  // File uploads
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
      files: 5,
    },
  })

  // WebSocket
  await app.register(websocket)

  // Auth hook — attach user to request if token present
  app.addHook('preHandler', async (request) => {
    const header = request.headers.authorization
    if (header?.startsWith('Bearer ')) {
      try {
        const payload = app.jwt.verify<{ sub: string; role: string }>(
          header.slice(7),
        )
        request.user = payload
      } catch {
        // Token invalid — leave request.user undefined
      }
    }
  })

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV,
  }))

  // Register all route modules
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(kycRoutes, { prefix: '/api/kyc' })
  await app.register(marketplaceRoutes, { prefix: '/api/marketplace' })
  await app.register(adsRoutes, { prefix: '/api/ads' })
  await app.register(tradesRoutes, { prefix: '/api/trades' })
  await app.register(walletRoutes, { prefix: '/api/wallet' })
  await app.register(disputesRoutes, { prefix: '/api/disputes' })
  await app.register(notificationsRoutes, { prefix: '/api/notifications' })
  await app.register(adminRoutes, { prefix: '/api/admin' })
  await app.register(webhookRoutes, { prefix: '/api/webhooks' })
  await app.register(instantBuyRoutes, { prefix: '/api/instant-buy' })
  await app.register(referralRoutes, { prefix: '/api/referral' })
  await app.register(merchantRoutes, { prefix: '/api/merchants' })

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url }, 'Request error')
    const statusCode = error.statusCode ?? 500
    reply.status(statusCode).send({
      success: false,
      error: error.code ?? 'INTERNAL_ERROR',
      message:
        statusCode === 500 ? 'An internal error occurred' : error.message,
    })
  })

  return app
}
