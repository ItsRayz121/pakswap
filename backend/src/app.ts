import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { redis } from './lib/redis'
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

  // CORS
  await app.register(cors, {
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Rate limiting
  await app.register(rateLimit, {
    redis,
    max: parseInt(process.env.RATE_LIMIT_GLOBAL_RPM ?? '300'),
    timeWindow: '1 minute',
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
