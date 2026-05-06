'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Clock, CheckCircle, XCircle, AlertCircle, Shield, ChevronRight, Filter } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { tradesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  created: { label: 'Created', color: 'badge-blue', icon: Clock },
  escrow_locked: { label: 'Awaiting Payment', color: 'badge-blue', icon: Clock },
  payment_pending: { label: 'Payment Pending', color: 'badge-yellow', icon: Clock },
  payment_claimed: { label: 'Under Review', color: 'badge-yellow', icon: Shield },
  under_review: { label: 'Admin Review', color: 'badge-yellow', icon: Shield },
  releasing: { label: 'Releasing', color: 'badge-blue', icon: Clock },
  completed: { label: 'Completed', color: 'badge-green', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'badge-gray', icon: XCircle },
  expired: { label: 'Expired', color: 'badge-gray', icon: XCircle },
  disputed: { label: 'Disputed', color: 'badge-red', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'badge-green', icon: CheckCircle },
}

const STATUS_FILTERS = [
  { value: '', label: 'All Orders' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'disputed', label: 'Disputed' },
]

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [statusFilter, setStatusFilter] = useState('')
  const [sideFilter, setSideFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['trades', statusFilter, sideFilter],
    queryFn: () => tradesApi.getAll({ status: statusFilter || undefined, side: sideFilter || undefined, limit: 50 }),
  })

  const trades: any[] = data?.data?.data ?? []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage all your trades</p>
          </div>
          <Link href="/marketplace" className="btn-md btn-primary w-fit">Browse Market</Link>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-gray-400" />
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  statusFilter === f.value ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[{ v: '', l: 'All' }, { v: 'buy', l: 'Buy' }, { v: 'sell', l: 'Sell' }].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setSideFilter(v)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  sideFilter === v ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse h-20 bg-gray-100" />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm mb-6">You haven't made any trades yet. Start by browsing the marketplace.</p>
            <Link href="/marketplace" className="btn-md btn-primary">Go to Marketplace</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span>Order</span><span>Amount</span><span>Counterparty</span><span>Status</span><span />
            </div>
            <div className="divide-y divide-gray-50">
              {trades.map((trade: any) => {
                const isBuyer = trade.buyerId === user?.id
                const statusConf = STATUS_LABELS[trade.status] ?? { label: trade.status, color: 'badge-gray', icon: Clock }
                const Icon = statusConf.icon
                return (
                  <Link
                    key={trade.id}
                    href={`/trade/${trade.id}`}
                    className="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-start md:items-center p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{trade.orderRef}</p>
                      <span className={`badge text-xs mt-0.5 ${isBuyer ? 'badge-blue' : 'badge-green'}`}>
                        {isBuyer ? 'Buy' : 'Sell'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{parseFloat(trade.coinAmount).toFixed(4)} {trade.coin}</p>
                      <p className="text-xs text-gray-400">₨{parseFloat(trade.fiatAmount).toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        {isBuyer ? (trade.seller?.username ?? trade.seller?.fullName) : (trade.buyer?.username ?? trade.buyer?.fullName)}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(trade.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                    </div>
                    <div>
                      <span className={`badge ${statusConf.color} flex items-center gap-1 w-fit`}>
                        <Icon size={10} />
                        {statusConf.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 hidden md:block" />
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
