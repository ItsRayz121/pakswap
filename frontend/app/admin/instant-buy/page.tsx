'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Eye, Loader2, RefreshCw, DollarSign, Package, Activity, Users } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'
import axios from 'axios'
import Link from 'next/link'

type Tab = 'queue' | 'tokens' | 'inventory' | 'deposits' | 'payouts' | 'orders' | 'providers'

const TABS: { key: Tab; label: string }[] = [
  { key: 'queue', label: '🔍 Verify Queue' },
  { key: 'tokens', label: '🪙 Token Config' },
  { key: 'inventory', label: '📦 Inventory' },
  { key: 'deposits', label: '🔗 Deposit Monitor' },
  { key: 'payouts', label: '💸 Manual Payouts' },
  { key: 'orders', label: '📋 All Orders' },
  { key: 'providers', label: '👥 Provider Apps' },
]

const mockQueue = [
  { id: 'IBO-001', ref: '#IBO-001', customer: 'Ali Hassan', coin: 'USDT', amount: '125.00', fiat: '35,000', method: 'JazzCash', aiScore: 96, submittedAt: '10:08 AM', status: 'pending_review' },
  { id: 'IBO-002', ref: '#IBO-002', customer: 'Sara Khan', coin: 'USDT', amount: '250.00', fiat: '70,000', method: 'Easypaisa', aiScore: 88, submittedAt: '10:22 AM', status: 'pending_review' },
  { id: 'IBO-003', ref: '#IBO-003', customer: 'Umar Farooq', coin: 'BTC', amount: '0.001200', fiat: '102,000', method: 'Bank IBAN', aiScore: 72, submittedAt: '10:45 AM', status: 'pending_review' },
]

const mockTokens = [
  { coin: 'USDT', network: 'TRC-20', rate: 280.00, spread: 1.5, minOrder: 1000, maxOrder: 500000, active: true },
  { coin: 'USDT', network: 'BEP-20', rate: 280.00, spread: 2.0, minOrder: 1000, maxOrder: 200000, active: true },
  { coin: 'BTC', network: 'Bitcoin', rate: 8500000, spread: 1.0, minOrder: 5000, maxOrder: 2000000, active: true },
  { coin: 'ETH', network: 'ERC-20', rate: 450000, spread: 1.5, minOrder: 2000, maxOrder: 1000000, active: false },
]

const mockInventory = [
  { coin: 'USDT', network: 'TRC-20', balance: 12500, reserved: 3200, available: 9300, threshold: 5000 },
  { coin: 'USDT', network: 'BEP-20', balance: 5000, reserved: 800, available: 4200, threshold: 2000 },
  { coin: 'BTC', network: 'Bitcoin', balance: 0.5, reserved: 0.05, available: 0.45, threshold: 0.1 },
]

const mockDeposits = [
  { txHash: '0xabc...def', customer: 'Ali Hassan', coin: 'USDT', amount: '125.00', network: 'TRC-20', confirmations: 18, required: 20, status: 'confirming' },
  { txHash: '0x123...456', customer: 'Sara Khan', coin: 'USDT', amount: '250.00', network: 'TRC-20', confirmations: 20, required: 20, status: 'confirmed' },
]

const mockPayouts = [
  { id: 'IBO-004', customer: 'Zara Malik', wallet: 'TLyKfp6R...MBm7', coin: 'USDT', amount: '500.00', network: 'TRC-20', status: 'pending' },
  { id: 'IBO-005', customer: 'Ahmed Raza', wallet: '0x1a2b...ef', coin: 'ETH', amount: '0.1', network: 'ERC-20', status: 'pending' },
]

const mockAllOrders = [
  { ref: '#IBO-001', customer: 'Ali Hassan', coin: 'USDT', amount: '125.00', fiat: '35,000', status: 'pending_review', createdAt: '2026-05-06 10:05' },
  { ref: '#IBO-002', customer: 'Sara Khan', coin: 'USDT', amount: '250.00', fiat: '70,000', status: 'completed', createdAt: '2026-05-06 10:22' },
  { ref: '#IBO-006', customer: 'Hamza Ali', coin: 'BTC', amount: '0.0024', fiat: '204,000', status: 'cancelled', createdAt: '2026-05-06 09:15' },
]

const mockProviders = [
  { id: 'P001', name: 'Kamran Traders', city: 'Karachi', coins: ['USDT', 'BTC'], capacity: '5M PKR/day', status: 'pending', appliedAt: '2026-05-05' },
  { id: 'P002', name: 'Lahore Exchange', city: 'Lahore', coins: ['USDT'], capacity: '2M PKR/day', status: 'approved', appliedAt: '2026-05-04' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_review: 'badge badge-yellow',
    completed: 'badge badge-green',
    cancelled: 'badge badge-red',
    approved: 'badge badge-green',
    pending: 'badge badge-yellow',
    confirming: 'badge badge-blue',
    confirmed: 'badge badge-green',
  }
  return <span className={map[status] ?? 'badge badge-gray'}>{status.replace('_', ' ')}</span>
}

export default function AdminInstantBuyPage() {
  const [tab, setTab] = useState<Tab>('queue')
  const { accessToken } = useAuthStore()
  const qc = useQueryClient()

  const headers = { Authorization: `Bearer ${accessToken}` }

  const approveMutation = useMutation({
    mutationFn: (id: string) => axios.post(`/api/instant-buy/orders/${id}/approve`, {}, { headers }),
    onSuccess: () => { toast({ type: 'success', title: 'Order Approved' }); qc.invalidateQueries({ queryKey: ['ib-queue'] }) },
    onError: () => toast({ type: 'error', title: 'Approval failed — using mock' }),
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => axios.post(`/api/instant-buy/orders/${id}/reject`, {}, { headers }),
    onSuccess: () => { toast({ type: 'success', title: 'Order Rejected' }); qc.invalidateQueries({ queryKey: ['ib-queue'] }) },
    onError: () => toast({ type: 'error', title: 'Rejection failed — using mock' }),
  })

  const stats = [
    { label: 'Pending Review', value: '3', icon: <Eye size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: "Today's Volume", value: '₨2.1M', icon: <DollarSign size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Inventory', value: '21,500 USDT', icon: <Package size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Provider Apps', value: '2', icon: <Users size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin navbar */}
      <nav className="navbar border-b">
        <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-800">← Admin</Link>
        <span className="font-bold text-gray-900 mx-auto">Instant Buy Management</span>
        <span className="badge badge-blue">OTC Panel</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>{icon}</div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar mb-6 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button key={key} className={`tab whitespace-nowrap ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Verify Queue */}
        {tab === 'queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-gray-800">Payment Verification Queue</h2>
              <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                ⚠️ Layer 2 review is <strong>mandatory</strong> — no auto-release
              </div>
            </div>
            {mockQueue.map(order => (
              <div key={order.id} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold">{order.ref}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-500">{order.customer} · {order.method} · {order.submittedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.amount} {order.coin}</p>
                    <p className="text-sm text-gray-500">₨{order.fiat}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-blue-700 font-semibold">AI Score: {order.aiScore}%</p>
                      <div className="w-24 bg-blue-100 rounded-full h-1.5 mt-1">
                        <div className={`h-1.5 rounded-full ${order.aiScore >= 80 ? 'bg-green-500' : order.aiScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${order.aiScore}%` }} />
                      </div>
                    </div>
                    <button className="text-sm text-brand hover:underline flex items-center gap-1">
                      <Eye size={14} /> View Proof
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => rejectMutation.mutate(order.id)}
                      disabled={rejectMutation.isPending}
                      className="btn btn-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg px-4 flex items-center gap-1">
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => approveMutation.mutate(order.id)}
                      disabled={approveMutation.isPending}
                      className="btn btn-sm bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg px-4 flex items-center gap-1">
                      {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve & Release
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Token Config */}
        {tab === 'tokens' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Token Configuration</h2>
            <div className="card overflow-hidden">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Token</th><th>Network</th><th>Rate (PKR)</th><th>Spread %</th><th>Min Order</th><th>Max Order</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTokens.map((t, i) => (
                    <tr key={i}>
                      <td><span className={`coin-${t.coin.toLowerCase()} text-sm font-bold`}>{t.coin}</span></td>
                      <td className="text-sm">{t.network}</td>
                      <td className="text-sm font-mono">₨{t.rate.toLocaleString()}</td>
                      <td className="text-sm">{t.spread}%</td>
                      <td className="text-sm">₨{t.minOrder.toLocaleString()}</td>
                      <td className="text-sm">₨{t.maxOrder.toLocaleString()}</td>
                      <td><span className={t.active ? 'badge badge-green' : 'badge badge-gray'}>{t.active ? 'Active' : 'Disabled'}</span></td>
                      <td>
                        <button className="text-xs text-brand hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory */}
        {tab === 'inventory' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Crypto Inventory</h2>
            <div className="grid gap-4">
              {mockInventory.map((inv, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`coin-${inv.coin.toLowerCase()} font-bold`}>{inv.coin}</span>
                      <span className="text-sm text-gray-500">{inv.network}</span>
                    </div>
                    {inv.available < inv.threshold && (
                      <span className="badge badge-yellow">⚠️ Low Balance</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Balance</p>
                      <p className="font-bold">{inv.balance.toLocaleString()} {inv.coin}</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-600 mb-1">Reserved</p>
                      <p className="font-bold text-amber-700">{inv.reserved.toLocaleString()} {inv.coin}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Available</p>
                      <p className="font-bold text-green-700">{inv.available.toLocaleString()} {inv.coin}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Utilization</span>
                      <span>{Math.round((inv.reserved / inv.balance) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(inv.reserved / inv.balance) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deposit Monitor */}
        {tab === 'deposits' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Blockchain Deposit Monitor</h2>
            <div className="card overflow-hidden">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Tx Hash</th><th>Customer</th><th>Amount</th><th>Network</th><th>Confirmations</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDeposits.map((d, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs">{d.txHash}</td>
                      <td className="text-sm">{d.customer}</td>
                      <td className="text-sm font-semibold">{d.amount} {d.coin}</td>
                      <td className="text-sm">{d.network}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{d.confirmations}/{d.required}</span>
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${d.confirmations >= d.required ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (d.confirmations / d.required) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manual Payouts */}
        {tab === 'payouts' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Manual Payout Queue</h2>
            <div className="space-y-4">
              {mockPayouts.map((p, i) => (
                <div key={i} className="card p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold">#{p.id}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-gray-500">{p.customer}</p>
                    <p className="font-mono text-xs text-gray-400 mt-1">{p.wallet}</p>
                  </div>
                  <div className="text-right mr-6">
                    <p className="font-bold">{p.amount} {p.coin}</p>
                    <p className="text-sm text-gray-500">{p.network}</p>
                  </div>
                  <button className="btn btn-primary btn-sm rounded-lg px-4">
                    Send Payout
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Orders */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">All Instant Buy Orders</h2>
            <div className="card overflow-hidden">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Order Ref</th><th>Customer</th><th>Token</th><th>Amount</th><th>PKR</th><th>Status</th><th>Created</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAllOrders.map((o, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs">{o.ref}</td>
                      <td className="text-sm">{o.customer}</td>
                      <td><span className={`coin-${o.coin.toLowerCase()} text-sm font-bold`}>{o.coin}</span></td>
                      <td className="text-sm font-semibold">{o.amount}</td>
                      <td className="text-sm">₨{o.fiat}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="text-sm text-gray-500">{o.createdAt}</td>
                      <td>
                        <button className="text-xs text-brand hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Provider Apps */}
        {tab === 'providers' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Liquidity Provider Applications</h2>
            <div className="space-y-4">
              {mockProviders.map((p, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{p.name}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm text-gray-500">{p.city} · Applied {p.appliedAt}</p>
                      <div className="flex gap-2 mt-2">
                        {p.coins.map(c => <span key={c} className={`coin-${c.toLowerCase()} text-xs px-2 py-0.5 rounded-full`}>{c}</span>)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Capacity: <strong>{p.capacity}</strong></p>
                    </div>
                    {p.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="btn btn-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3">Reject</button>
                        <button className="btn btn-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-3">Approve</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
