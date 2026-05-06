'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Zap, ChevronRight, Clock, CheckCircle, XCircle, Shield } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import axios from 'axios'
import { useAuthStore } from '@/lib/store'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending_payment: { label: 'Awaiting Payment', color: 'badge-yellow', icon: Clock },
  payment_submitted: { label: 'Payment Submitted', color: 'badge-yellow', icon: Shield },
  pending_layer1: { label: 'AI Verifying', color: 'badge-blue', icon: Shield },
  pending_layer2: { label: 'Admin Review', color: 'badge-yellow', icon: Shield },
  approved: { label: 'Completed', color: 'badge-green', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'badge-red', icon: XCircle },
  expired: { label: 'Expired', color: 'badge-gray', icon: XCircle },
}

export default function InstantBuyHistoryPage() {
  const { accessToken } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['ib-orders'],
    queryFn: () => axios.get('/api/instant-buy/orders', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  })

  const orders: any[] = data?.data?.data ?? []

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instant Buy History</h1>
            <p className="text-gray-500 text-sm mt-1">All your OTC purchase orders</p>
          </div>
          <Link href="/instant-buy" className="btn-md btn-primary"><Zap size={16} /> New Order</Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4 h-16 animate-pulse bg-gray-100" />)}</div>
        ) : orders.length === 0 ? (
          <div className="card p-12 text-center">
            <Zap size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-6">Place your first instant buy order.</p>
            <Link href="/instant-buy" className="btn-md btn-primary">Buy Now</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-gray-50">
              {orders.map((o: any) => {
                const conf = STATUS_MAP[o.verificationStatus] ?? { label: o.verificationStatus, color: 'badge-gray', icon: Clock }
                return (
                  <Link key={o.id} href={`/instant-buy/order/${o.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Zap size={18} className="text-brand" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{o.orderRef}</p>
                      <p className="text-xs text-gray-400">
                        {parseFloat(o.coinAmount).toFixed(6)} {o.coin} •
                        {o.paymentMode === 'pkr' ? ` ₨${parseFloat(o.fiatAmount).toLocaleString('en-PK')}` : ` ${o.fromCoin} swap`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${conf.color}`}>{conf.label}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
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
