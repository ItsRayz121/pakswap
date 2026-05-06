import { FastifyRequest } from 'fastify'

export interface JwtPayload {
  sub: string
  role: string
  type?: string
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

// Augment @fastify/jwt so request.user is typed correctly everywhere
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload
    user: JwtPayload
  }
}
