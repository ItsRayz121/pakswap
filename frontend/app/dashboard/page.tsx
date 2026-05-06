'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowRight, Plus, ShoppingCart, Wallet, AlertCircle, TrendingUp, Clock } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { walletApi, tradesApi, notificationsApi, marketplaceApi } from '@/lib/api'

function KycBanner({ kycLevel, kycStatus }: { kycLevel: string; kycStatus: string }) {
  if (kycLevel !== 'none' && kycStatus === 'approved') return null

  return (
    <div className="card p-4 border-l-4 border-l-yellow-500 bg-yellow-50 flex items-start gap-3 mb-6">
      <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          {kycStatus === 'pending' || kycStatus === 'under_review'
            ? 'KYC Under Review — We\'ll notify you once approved.'
            : 'Complete KYC to Start Trading'}
        </p>
        <p className="text-xs text-yellow-700 mt-0.5">
          {kycStatus === 'approved' ? '' : 'Upload your CNIC to unlock trading up to ₨50,000/day.'}
        </p>
      </div>
      {kycStatus !== 'under_review' && kycStatus !== 'pending' && (
        <Link href="/kyc" className="btn-sm btn-primary flex-shrink-0 text-xs">Complete KYC</Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: walletsData } = useQuery({ queryKey: ['wallets'], queryFn: () => walletApi.getAll() })
  const { data: tradesData } = useQuery({ queryKey: ['trades', 'recent'], queryFn: () => tradesApi.getAll({ limit: 5 }) })
  const { data: notifData } = useQuery({ queryKey: ['notifications'], queryFn: () => notificationsApi.getAll({ limit: 5 }) })
  const { data: rateData } = useQuery({ queryKey: ['rate', 'USDT'], queryFn: () => marketplaceApi.getRate('USDT') })

  const wallets = walletsData?.data?.data ?? []
  const trades = tradesData?.data?.data ?? []
  const notifications = notifData?.data?.notifications ?? []
  const usdtRate = rateData?.data?.data?.rate ?? 0

  const totalUsdtBalance = wallets
    .filter((w: any) => w.coin === 'USDT')
    .reduce((acc: number, w: any) => acc + parseFloat(w.balance), 0)

  const tradeStatusColor: Record<string, string> = {
    completed: 'badge-green',
    cancelled: 'badge-gray',
    disputed: 'badge-red',
    escrow_locked: 'badge-blue',
    payment_claimed: 'badge-yellow',
    under_review: 'badge-yellow',
    created: 'badge-blue',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KYC Banner */}
        <KycBanner kycLevel={user?.kycLevel ?? 'none'} kycStatus={user?.kycStatus ?? 'not_started'} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.fullName?.split(' ')[0]}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/marketplace" className="btn-md btn-secondary">
              <ShoppingCart size={16} /> Browse Market
            </Link>
            <Link href="/my-ads" className="btn-md btn-primary">
              <Plus size={16} /> Create Ad
            </Link>
          </div>
        </div>

        {/* Balance + Rate Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card col-span-2">
            <p className="stat-label">Total USDT Balance</p>
            <p className="stat-value text-usdt">{totalUsdtBalance.toFixed(2)} USDT</p>
            <p className="text-xs text-gray-400">≈ ₨{(totalUsdtBalance * usdtRate).toLocaleString('en-PK')} PKR</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">USDT/PKR Rate</p>
            <p className="stat-value">₨{usdtRate.toLocaleString('en-PK', { maximumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={12} /> Live rate
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Completed Trades</p>
            <p className="stat-value">{user ? '—' : 0}</p>
            <Link href="/orders" className="text-xs text-brand hover:underline">View all</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/marketplace', icon: ShoppingCart, label: 'Buy Crypto', color: 'text-brand' },
            { href: '/my-ads', icon: Plus, label: 'Sell Crypto', color: 'text-green-600' },
            { href: '/wallet', icon: Wallet, label: 'Deposit', color: 'text-purple-600' },
            { href: '/instant-buy', icon: TrendingUp, label: 'Instant Buy', color: 'text-orange-600' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href} className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center group">
              <Icon size={24} className={`${color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Trades */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Trades</h2>
              <Link href="/orders" className="text-sm text-brand hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {trades.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No trades yet</p>
                <Link href="/marketplace" className="text-sm text-brand hover:underline mt-2 block">Browse market</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trades.map((trade: any) => (
                  <Link key={trade.id} href={`/trade/${trade.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{trade.orderRef}</p>
                      <p className="text-xs text-gray-500">{trade.coin} • ₨{parseFloat(trade.fiatAmount).toLocaleString('en-PK')}</p>
                    </div>
                    <span className={`badge ${tradeStatusColor[trade.status] ?? 'badge-gray'}`}>
                      {trade.status.replace(/_/g, ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n: any) => (
                  <div key={n.id} className={`p-3 rounded-lg ${n.readAt ? 'bg-white' : 'bg-blue-50'}`}>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
