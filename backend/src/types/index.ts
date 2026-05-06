import { FastifyRequest } from 'fastify'

export interface JwtPayload {
  sub: string
  role: string
  iat?: number
  exp?: number
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: JwtPayload
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface TradeRoom {
  id: string
  participants: Set<string>
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}
