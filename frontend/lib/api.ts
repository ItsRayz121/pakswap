import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
})

// Attach access token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verifyOtp: (phone: string, code: string) => api.post('/auth/verify-otp', { phone, code }),
  resendOtp: (phone: string) => api.post('/auth/resend-otp', { phone }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: any) => api.patch('/auth/profile', data),
  changePassword: (data: any) => api.post('/auth/change-password', data),
  setup2fa: () => api.post('/auth/2fa/setup'),
  verify2fa: (preAuthToken: string, totpCode: string) => api.post('/auth/2fa/verify', { preAuthToken, totpCode }),
  disable2fa: (code: string) => api.post('/auth/2fa/disable', { code }),
  getSessions: () => api.get('/auth/sessions'),
  revokeSession: (id: string) => api.delete(`/auth/sessions/${id}`),
}

export const marketplaceApi = {
  getAds: (params?: any) => api.get('/marketplace/ads', { params }),
  getAd: (id: string) => api.get(`/marketplace/ads/${id}`),
  getRate: (coin: string) => api.get(`/marketplace/rate/${coin}`),
}

export const tradesApi = {
  initiate: (data: any) => api.post('/trades', data),
  getAll: (params?: any) => api.get('/trades', { params }),
  getById: (id: string) => api.get(`/trades/${id}`),
  confirmPayment: (id: string, formData: FormData) => api.post(`/trades/${id}/confirm-payment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  cancel: (id: string, reason: string) => api.post(`/trades/${id}/cancel`, { reason }),
  sendMessage: (id: string, message: string) => api.post(`/trades/${id}/message`, { message }),
  rate: (id: string, data: any) => api.post(`/trades/${id}/rate`, data),
}

export const adsApi = {
  getMyAds: (params?: any) => api.get('/ads', { params }),
  create: (data: any) => api.post('/ads', data),
  update: (id: string, data: any) => api.patch(`/ads/${id}`, data),
  pause: (id: string) => api.patch(`/ads/${id}/pause`),
  activate: (id: string) => api.patch(`/ads/${id}/activate`),
  delete: (id: string) => api.delete(`/ads/${id}`),
}

export const walletApi = {
  getAll: () => api.get('/wallet'),
  getDepositAddress: (coin: string) => api.get(`/wallet/deposit-address/${coin}`),
  getAddress: (coin: string, network: string) => api.get(`/wallet/address/${coin}/${network}`),
  getTransactions: (params?: any) => api.get('/wallet/transactions', { params }),
  withdraw: (data: any) => api.post('/wallet/withdraw', data),
  getPaymentMethods: () => api.get('/wallet/payment-methods'),
  addPaymentMethod: (data: any) => api.post('/wallet/payment-methods', data),
  deletePaymentMethod: (id: string) => api.delete(`/wallet/payment-methods/${id}`),
}

export const kycApi = {
  submit: (formData: FormData) => api.post('/kyc/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  status: () => api.get('/kyc/status'),
}

export const disputesApi = {
  open: (data: any) => api.post('/disputes', data),
  getAll: () => api.get('/disputes'),
  getById: (id: string) => api.get(`/disputes/${id}`),
  sendMessage: (id: string, message: string) => api.post(`/disputes/${id}/message`, { message }),
  uploadEvidence: (id: string, formData: FormData) => api.post(`/disputes/${id}/evidence`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const notificationsApi = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
}

export const merchantsApi = {
  apply: (data: { businessName: string; spreadBps?: number }) => api.post('/merchants/apply', data),
  me: () => api.get('/merchants/me'),
  list: (params?: { coin?: string; network?: string }) => api.get('/merchants', { params }),
  get: (id: string) => api.get(`/merchants/${id}`),
  getInventory: () => api.get('/merchants/me/inventory'),
  upsertInventory: (data: any) => api.post('/merchants/me/inventory', data),
  removeInventory: (id: string) => api.delete(`/merchants/me/inventory/${id}`),
  adminQueue: (params?: any) => api.get('/merchants/admin/queue', { params }),
  adminApprove: (id: string) => api.post(`/merchants/admin/${id}/approve`),
  adminReject: (id: string, reason: string) => api.post(`/merchants/admin/${id}/reject`, { reason }),
}

export const adminApi = {
  stats: () => api.get('/admin/dashboard/stats'),
  kycQueue: (params?: any) => api.get('/admin/kyc/queue', { params }),
  getKycSubmission: (id: string) => api.get(`/admin/kyc/${id}`),
  approveKyc: (id: string, data: any) => api.post(`/admin/kyc/${id}/approve`, data),
  rejectKyc: (id: string, data: any) => api.post(`/admin/kyc/${id}/reject`, data),
  paymentsQueue: (params?: any) => api.get('/admin/payments/queue', { params }),
  approvePayment: (id: string, data?: any) => api.post(`/admin/payments/${id}/approve`, data),
  rejectPayment: (id: string, data: any) => api.post(`/admin/payments/${id}/reject`, data),
  disputesQueue: (params?: any) => api.get('/admin/disputes/queue', { params }),
  resolveDispute: (id: string, data: any) => api.post(`/admin/disputes/${id}/resolve`, data),
  trades: (params?: any) => api.get('/admin/trades', { params }),
  users: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  suspendUser: (id: string, reason: string) => api.post(`/admin/users/${id}/suspend`, { reason }),
  banUser: (id: string, reason: string) => api.post(`/admin/users/${id}/ban`, { reason }),
  unsuspendUser: (id: string) => api.post(`/admin/users/${id}/unsuspend`),
  fraudFlags: (params?: any) => api.get('/admin/fraud/flags', { params }),
  reviewFlag: (id: string, actionTaken: string) => api.post(`/admin/fraud/flags/${id}/review`, { actionTaken }),
  auditLog: (params?: any) => api.get('/admin/audit-log', { params }),
  withdrawals: (params?: any) => api.get('/admin/withdrawals', { params }),
  approveWithdrawal: (id: string) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id: string, reason: string) => api.post(`/admin/withdrawals/${id}/reject`, { reason }),
  instantBuyQueue: (params?: any) => api.get('/admin/instant-buy/queue', { params }),
  approveInstantBuy: (id: string) => api.post(`/admin/instant-buy/${id}/approve`),
  rejectInstantBuy: (id: string, reason: string) => api.post(`/admin/instant-buy/${id}/reject`, { reason }),
  getTeam: () => api.get('/admin/team'),
  inviteTeam: (email: string, role: string) => api.post('/admin/team/invite', { email, role }),
  changeTeamRole: (userId: string, role: string) => api.patch(`/admin/team/${userId}/role`, { role }),
  revokeTeam: (userId: string) => api.delete(`/admin/team/${userId}`),
}
