import Redis from 'ioredis'
import { logger } from './logger'

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

redis.on('connect', () => logger.info('Redis connected'))
redis.on('error', (err) => logger.error({ err }, 'Redis error'))

export const redisForBullMQ = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})
