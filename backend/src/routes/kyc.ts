import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { submitKyc, getKycStatus } from '../services/kyc.service'

export default async function kycRoutes(app: FastifyInstance) {
  // POST /api/kyc/submit
  app.post('/submit', { preHandler: [authenticate] }, async (req, reply) => {
    const userId = req.user!.sub
    const parts = req.parts()
    const files: Record<string, Buffer> = {}
    let level: 'basic' | 'full' = 'basic'

    for await (const part of parts) {
      if (part.type === 'file') {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) chunks.push(chunk)
        files[part.fieldname] = Buffer.concat(chunks)
      } else if (part.fieldname === 'level') {
        level = (part.value as string) === 'full' ? 'full' : 'basic'
      }
    }

    const submission = await submitKyc(userId, level, {
      cnicFront: files['cnicFront'],
      cnicBack: files['cnicBack'],
      selfie: files['selfie'],
      addressProof: files['addressProof'],
    })

    return reply.status(201).send({ success: true, data: { submissionId: submission.id } })
  })

  // GET /api/kyc/status
  app.get('/status', { preHandler: [authenticate] }, async (req) => {
    const status = await getKycStatus(req.user!.sub)
    return { success: true, data: status }
  })
}
