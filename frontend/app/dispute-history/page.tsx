'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { disputesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: 'Open', color: 'badge-red', icon: AlertCircle },
  under_review: { label: 'Under Review', color: 'badge-yellow', icon: Clock },
  resolved_buyer: { label: 'Resolved — Buyer Won', color: 'badge-green', icon: CheckCircle },
  resolved_seller: { label: 'Resolved — Seller Won', color: 'badge-green', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'badge-gray', icon: Clock },
}

export default function DisputeHistoryPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => disputesApi.getAll(),
  })

  const disputes: any[] = data?.data?.data ?? []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispute History</h1>
          <p className="text-gray-500 text-sm mt-1">View all disputes you've filed or been involved in</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4 h-16 animate-pulse bg-gray-100" />)}</div>
        ) : disputes.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No disputes</h3>
            <p className="text-gray-500 text-sm">You have no dispute history. That's a good thing!</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
              <span>Dispute</span><span>Trade</span><span>Reason</span><span>Status</span><span />
            </div>
            <div className="divide-y divide-gray-50">
              {disputes.map((d: any) => {
                const conf = STATUS_CONFIG[d.status] ?? { label: d.status, color: 'badge-gray', icon: Clock }
                const isInitiator = d.initiatorId === user?.id
                return (
                  <div key={d.id} className="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-start md:items-center p-4 hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{d.id.slice(0, 8).toUpperCase()}</p>
                      <span className={`badge text-xs mt-0.5 ${isInitiator ? 'badge-blue' : 'badge-gray'}`}>
                        {isInitiator ? 'Filed by you' : 'Filed against you'}
                      </span>
                    </div>
                    <div>
                      <Link href={`/trade/${d.tradeId}`} className="text-sm text-brand hover:underline">
                        {d.trade?.orderRef ?? d.tradeId.slice(0, 8)}
                      </Link>
                      <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{d.reason}</p>
                    <span className={`badge ${conf.color} flex items-center gap-1 w-fit`}>
                      <conf.icon size={10} />
                      {conf.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-400 hidden md:block" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
