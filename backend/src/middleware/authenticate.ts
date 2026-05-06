import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    reply.status(401).send({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required' })
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    return reply.status(401).send({ success: false, error: 'UNAUTHORIZED' })
  }
  if (!['admin', 'super_admin'].includes(request.user.role)) {
    return reply.status(403).send({ success: false, error: 'FORBIDDEN', message: 'Admin access required' })
  }
}

export async function requireKycReviewer(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    return reply.status(401).send({ success: false, error: 'UNAUTHORIZED' })
  }
  const allowed = ['admin', 'super_admin', 'kyc_reviewer']
  if (!allowed.includes(request.user.role)) {
    return reply.status(403).send({ success: false, error: 'FORBIDDEN' })
  }
}

export async function requireDisputeAgent(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    return reply.status(401).send({ success: false, error: 'UNAUTHORIZED' })
  }
  const allowed = ['admin', 'super_admin', 'dispute_agent']
  if (!allowed.includes(request.user.role)) {
    return reply.status(403).send({ success: false, error: 'FORBIDDEN' })
  }
}
