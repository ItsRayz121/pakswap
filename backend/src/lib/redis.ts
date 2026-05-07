import Redis from 'ioredis'
import { logger } from './logger'

function createRedisClient() {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set — Redis/BullMQ features disabled')
    return null
  }
  const client = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })
  client.on('connect', () => logger.info('Redis connected'))
  client.on('error', (err) => logger.error({ err }, 'Redis error'))
  return client
}

export const redis = createRedisClient()
export const redisForBullMQ = createRedisClient()
