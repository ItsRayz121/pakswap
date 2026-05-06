import { prisma } from '../lib/prisma'
import { notificationQueue } from '../lib/queues'

interface NotificationInput {
  userId: string
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
}

export const notificationService = {
  async send(input: NotificationInput): Promise<void> {
    // Save to DB (in-app notification)
    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: (input.data ?? null) as any,
      },
    })

    // Queue for SMS/email/push delivery
    await notificationQueue.add('send', input, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } })
  },

  async markRead(userId: string, notificationId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    })
  },

  async markAllRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    })
  },

  async getAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ])
    const unreadCount = await prisma.notification.count({ where: { userId, readAt: null } })
    return { notifications, total, unreadCount, page, limit }
  },
}
