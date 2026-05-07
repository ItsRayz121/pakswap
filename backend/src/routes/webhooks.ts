import { FastifyInstance } from 'fastify'
import { depositQueue } from '../lib/queues'
import { logger } from '../lib/logger'

export default async function webhookRoutes(app: FastifyInstance) {
  // BlockCypher webhook for Bitcoin deposits
  app.post('/blockcypher', async (req, reply) => {
    const body = req.body as any
    if (!body?.hash) return reply.status(400).send({ ok: false })

    await depositQueue?.add('btc-deposit', {
      txHash: body.hash,
      chain: 'BTC',
      confirmations: body.confirmations ?? 0,
      outputs: body.outputs ?? [],
    })

    logger.info({ txHash: body.hash }, 'BlockCypher webhook received')
    return { ok: true }
  })

  // Internal blockchain monitor callback
  app.post('/deposit', async (req, reply) => {
    const internalSecret = req.headers['x-internal-secret']
    if (internalSecret !== process.env.INTERNAL_API_SECRET) {
      return reply.status(401).send({ ok: false })
    }

    const { txHash, chain, network, amount, toAddress, confirmations } = req.body as any
    await depositQueue?.add('deposit', { txHash, chain, network, amount, toAddress, confirmations })
    return { ok: true }
  })
}
