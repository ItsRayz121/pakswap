import { buildApp } from './app'
import { logger } from './lib/logger'

const PORT = parseInt(process.env.PORT ?? process.env.APP_PORT ?? '3000')
const HOST = '0.0.0.0'

async function main() {
  const app = await buildApp()
  try {
    await app.listen({ port: PORT, host: HOST })
    logger.info(`PakSwap API running on http://${HOST}:${PORT}`)
  } catch (err) {
    logger.error(err, 'Failed to start server')
    process.exit(1)
  }
}

main()
