import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { notificationService } from '../services/notification.service'

export default async function notificationsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (req) => {
    const { page, limit } = z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }).parse(req.query)
    return notificationService.getAll(req.user!.sub, page, limit)
  })

  app.patch('/:id/read', { preHandler: [authenticate] }, async (req) => {
    const { id } = req.params as { id: string }
    await notificationService.markRead(req.user!.sub, id)
    return { success: true }
  })

  app.patch('/read-all', { preHandler: [authenticate] }, async (req) => {
    await notificationService.markAllRead(req.user!.sub)
    return { success: true }
  })
}
