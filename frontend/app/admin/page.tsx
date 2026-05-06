'use client'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Users, FileCheck, AlertTriangle, Activity, Clock, CheckCircle, XCircle, ChevronRight, Search, Shield } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { adminApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'

type Section = 'dashboard' | 'kyc' | 'payments' | 'disputes' | 'trades' | 'users' | 'fraud' | 'withdrawals' | 'audit'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return }
    if (!['admin', 'super_admin', 'kyc_reviewer', 'dispute_agent'].includes(user?.role ?? '')) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  const { data: statsData } = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminApi.stats, enabled: section === 'dashboard' })
  const { data: kycData, refetch: refetchKyc } = useQuery({ queryKey: ['admin', 'kyc'], queryFn: () => adminApi.kycQueue(), enabled: section === 'kyc' })
  const { data: paymentsData, refetch: refetchPayments } = useQuery({ queryKey: ['admin', 'payments'], queryFn: () => adminApi.paymentsQueue(), enabled: section === 'payments' })
  const { data: disputesData, refetch: refetchDisputes } = useQuery({ queryKey: ['admin', 'disputes'], queryFn: () => adminApi.disputesQueue(), enabled: section === 'disputes' })
  const { data: tradesData } = useQuery({ queryKey: ['admin', 'trades'], queryFn: () => adminApi.trades(), enabled: section === 'trades' })
  const { data: usersData, refetch: refetchUsers } = useQuery({ queryKey: ['admin', 'users', search], queryFn: () => adminApi.users({ search }), enabled: section === 'users' })
  const { data: fraudData } = useQuery({ queryKey: ['admin', 'fraud'], queryFn: () => adminApi.fraudFlags(), enabled: section === 'fraud' })
  const { data: withdrawalsData, refetch: refetchWithdrawals } = useQuery({ queryKey: ['admin', 'withdrawals'], queryFn: () => adminApi.withdrawals(), enabled: section === 'withdrawals' })

  const stats = statsData?.data?.data
  const kycQueue = kycData?.data?.data ?? []
  const paymentsQueue = paymentsData?.data?.data ?? []
  const disputesQueue = disputesData?.data?.data ?? []
  const trades = tradesData?.data?.data ?? []
  const users = usersData?.data?.data ?? []
  const fraudFlags = fraudData?.data?.data ?? []
  const withdrawals = withdrawalsData?.data?.data ?? []

  const approveKycMutation = useMutation({
    mutationFn: ({ id, level }: { id: string; level: 'basic' | 'full' }) => adminApi.approveKyc(id, { level, notes: 'Approved' }),
    onSuccess: () => { toast({ type: 'success', title: 'KYC Approved' }); refetchKyc() },
    onError: () => toast({ type: 'error', title: 'Failed to approve KYC' }),
  })

  const rejectKycMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectKyc(id, { reason }),
    onSuccess: () => { toast({ type: 'success', title: 'KYC Rejected' }); refetchKyc() },
  })

  const approvePaymentMutation = useMutation({
    mutationFn: (id: string) => adminApi.approvePayment(id, { notes: 'Payment verified' }),
    onSuccess: () => { toast({ type: 'success', title: 'Payment Approved — Escrow Released' }); refetchPayments() },
    onError: (e: any) => toast({ type: 'error', title: 'Failed', description: e.response?.data?.message }),
  })

  const rejectPaymentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectPayment(id, { reason }),
    onSuccess: () => { toast({ type: 'success', title: 'Payment Rejected' }); refetchPayments() },
  })

  const resolveDisputeMutation = useMutation({
    mutationFn: ({ id, resolution, notes }: { id: string; resolution: string; notes: string }) =>
      adminApi.resolveDispute(id, { resolution, notes }),
    onSuccess: () => { toast({ type: 'success', title: 'Dispute Resolved' }); refetchDisputes() },
  })

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.suspendUser(id, reason),
    onSuccess: () => { toast({ type: 'success', title: 'User Suspended' }); refetchUsers() },
  })

  const approveWithdrawalMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveWithdrawal(id),
    onSuccess: () => { toast({ type: 'success', title: 'Withdrawal Approved' }); refetchWithdrawals() },
  })

  const navItems: { key: Section; icon: any; label: string; badge?: number }[] = [
    { key: 'dashboard', icon: Activity, label: 'Dashboard' },
    { key: 'kyc', icon: FileCheck, label: 'KYC Queue', badge: stats?.kycPending },
    { key: 'payments', icon: CheckCircle, label: 'Payment Queue' },
    { key: 'disputes', icon: AlertTriangle, label: 'Disputes', badge: stats?.openDisputes },
    { key: 'trades', icon: Activity, label: 'Live Trades', badge: stats?.activeTrades },
    { key: 'users', icon: Users, label: 'Users' },
    { key: 'fraud', icon: Shield, label: 'Fraud Monitor' },
    { key: 'withdrawals', icon: Clock, label: 'Withdrawals', badge: stats?.pendingWithdrawals },
    { key: 'audit', icon: FileCheck, label: 'Audit Log' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Bar */}
      <div className="bg-gray-900 text-white h-14 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-brand rounded flex items-center justify-center font-bold text-sm">P</div>
          <span className="font-semibold">PakSwap Admin</span>
          <span className="badge bg-red-600 text-white text-xs">Staff Only</span>
        </div>
        <span className="text-sm text-gray-400">{user?.fullName} ({user?.role})</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 fixed pt-4">
          <nav className="flex flex-col gap-0.5 px-2">
            {navItems.map(({ key, icon: Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left w-full transition-colors ${
                  section === key ? 'bg-brand-50 text-brand' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="badge bg-red-100 text-red-700 text-xs">{badge}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 ml-56 p-6">
          {/* Dashboard */}
          {section === 'dashboard' && stats && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, color: 'text-brand' },
                  { label: 'KYC Pending', value: stats.kycPending, color: 'text-yellow-600' },
                  { label: 'Active Trades', value: stats.activeTrades, color: 'text-blue-600' },
                  { label: 'Open Disputes', value: stats.openDisputes, color: 'text-red-600' },
                  { label: 'Trades (24h)', value: stats.completedTrades24h, color: 'text-green-600' },
                  { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, color: 'text-orange-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="stat-card">
                    <p className="stat-label">{label}</p>
                    <p className={`stat-value ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KYC Queue */}
          {section === 'kyc' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">KYC Review Queue</h1>
              {kycQueue.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">
                  <FileCheck size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No KYC submissions pending review</p>
                </div>
              ) : (
                kycQueue.map((sub: any) => (
                  <div key={sub.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{sub.user.fullName}</h3>
                          <span className={`badge ${sub.level === 'full' ? 'badge-blue' : 'badge-gray'}`}>{sub.level} KYC</span>
                          <span className="text-xs text-gray-400">Attempt {sub.user.kycAttempts}/5</span>
                        </div>
                        <p className="text-sm text-gray-500">{sub.user.email} · {sub.user.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(sub.submittedAt).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>

                        {/* AI Results */}
                        {sub.aiResults?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {sub.aiResults.map((r: any) => (
                              <span key={r.id} className={`badge ${r.passed ? 'badge-green' : 'badge-red'}`}>
                                {r.checkType}: {r.passed ? 'Pass' : 'Fail'} ({Math.round(r.confidenceScore ?? 0)}%)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => approveKycMutation.mutate({ id: sub.id, level: sub.level })}
                          disabled={approveKycMutation.isPending}
                          className="btn-md btn-success"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Rejection reason:')
                            if (reason) rejectKycMutation.mutate({ id: sub.id, reason })
                          }}
                          className="btn-md btn-danger"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Payment Queue */}
          {section === 'payments' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Payment Verification Queue</h1>
              <div className="two-layer-box mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Layer 2 Human Review Required.</strong> AI (Layer 1) has already scanned these payment proofs. You must make a final decision. This action directly releases or refunds escrowed funds.
                </p>
              </div>
              {paymentsQueue.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">
                  <CheckCircle size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No payments pending review</p>
                </div>
              ) : (
                paymentsQueue.map((v: any) => (
                  <div key={v.id} className="card p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{v.trade?.orderRef}</h3>
                          <span className="badge badge-yellow">Pending Review</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Buyer: {v.trade?.buyer?.fullName} → Seller: {v.trade?.seller?.fullName}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">Expected: ₨{parseFloat(v.expectedAmount ?? 0).toLocaleString('en-PK')}</p>

                        {/* AI Verdict */}
                        {v.aiVerdict && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className={`badge ${v.aiVerdict === 'verified' ? 'badge-green' : v.aiVerdict === 'suspicious' ? 'badge-red' : 'badge-yellow'}`}>
                              AI: {v.aiVerdict}
                            </span>
                            {v.amountMatch !== null && <span className={`badge ${v.amountMatch ? 'badge-green' : 'badge-red'}`}>Amount: {v.amountMatch ? '✓ Match' : '✗ Mismatch'}</span>}
                            {v.nameMatch !== null && <span className={`badge ${v.nameMatch ? 'badge-green' : 'badge-red'}`}>Name: {v.nameMatch ? '✓ Match' : '✗ Mismatch'}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => approvePaymentMutation.mutate(v.id)}
                          disabled={approvePaymentMutation.isPending}
                          className="btn-md btn-success whitespace-nowrap"
                        >
                          <CheckCircle size={14} /> Approve & Release
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Rejection reason:')
                            if (reason) rejectPaymentMutation.mutate({ id: v.id, reason })
                          }}
                          className="btn-md btn-danger whitespace-nowrap"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Disputes */}
          {section === 'disputes' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Dispute Queue</h1>
              {disputesQueue.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">
                  <AlertTriangle size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No open disputes</p>
                </div>
              ) : (
                disputesQueue.map((d: any) => (
                  <div key={d.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{d.disputeRef}</h3>
                          <span className="badge badge-red">Open</span>
                          {d.slaDeadline && (
                            <span className="text-xs text-orange-600">
                              SLA: {new Date(d.slaDeadline).toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Trade: {d.trade?.orderRef} · Opened by: {d.opener?.fullName}</p>
                        <p className="text-sm text-gray-700 mt-1">Reason: {d.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">Evidence files: {d.evidence?.length ?? 0}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const notes = prompt('Resolution notes (required):')
                            if (notes) resolveDisputeMutation.mutate({ id: d.id, resolution: 'release_to_buyer', notes })
                          }}
                          className="btn-md btn-success whitespace-nowrap"
                        >
                          Release to Buyer
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Resolution notes (required):')
                            if (notes) resolveDisputeMutation.mutate({ id: d.id, resolution: 'return_to_seller', notes })
                          }}
                          className="btn-md btn-danger whitespace-nowrap"
                        >
                          Return to Seller
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users */}
          {section === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input pl-9 w-64"
                    placeholder="Search email, phone, name..."
                  />
                </div>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Name', 'Email', 'KYC', 'Status', 'Trades', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.kycLevel === 'full' ? 'badge-green' : u.kycLevel === 'basic' ? 'badge-blue' : 'badge-gray'}`}>
                            {u.kycLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.status === 'active' ? 'badge-green' : u.status === 'suspended' ? 'badge-yellow' : 'badge-red'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.tradeStats?.completedTrades ?? 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {u.status === 'active' && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Suspension reason:')
                                  if (reason) suspendMutation.mutate({ id: u.id, reason })
                                }}
                                className="btn-sm btn-danger"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Withdrawals */}
          {section === 'withdrawals' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Pending Withdrawals</h1>
              {withdrawals.map((w: any) => (
                <div key={w.id} className="card p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{parseFloat(w.amount).toFixed(6)} {w.coin} ({w.network})</p>
                    <p className="text-sm text-gray-500 font-mono">{w.toAddress}</p>
                    <p className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveWithdrawalMutation.mutate(w.id)} className="btn-md btn-success">Approve</button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason:')
                        if (reason) adminApi.rejectWithdrawal(w.id, reason).then(() => { toast({ type: 'success', title: 'Rejected' }); refetchWithdrawals() })
                      }}
                      className="btn-md btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fraud Monitor */}
          {section === 'fraud' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Fraud Monitor</h1>
              {fraudFlags.map((f: any) => (
                <div key={f.id} className="card p-5 border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 mb-1">
                        <h3 className="font-semibold">{f.flagType.replace(/_/g, ' ')}</h3>
                        <span className={`badge ${f.severity === 'high' ? 'badge-red' : f.severity === 'medium' ? 'badge-yellow' : 'badge-gray'}`}>{f.severity}</span>
                      </div>
                      <p className="text-sm text-gray-500">User: {f.user?.fullName} ({f.user?.email})</p>
                    </div>
                    <button
                      onClick={() => {
                        const action = prompt('Action taken:')
                        if (action) adminApi.reviewFlag(f.id, action).then(() => toast({ type: 'success', title: 'Flag reviewed' }))
                      }}
                      className="btn-md btn-secondary"
                    >
                      Mark Reviewed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
