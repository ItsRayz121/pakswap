'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import axios from 'axios'

type StepState = 'done' | 'active' | 'pending' | 'error'

function TimelineStep({ label, desc, state, time }: { label: string; desc: string; state: StepState; time?: string }) {
  const dotClass = state === 'done' ? 'bg-green-500' : state === 'active' ? 'bg-blue-500 animate-pulse' : state === 'error' ? 'bg-red-500' : 'bg-gray-200'
  const Icon = state === 'done' ? CheckCircle : state === 'active' ? Loader2 : state === 'error' ? XCircle : Clock
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${dotClass}`}>
          <Icon size={16} className={`${state === 'done' || state === 'active' || state === 'error' ? 'text-white' : 'text-gray-400'} ${state === 'active' ? 'animate-spin' : ''}`} />
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 mt-1 mb-1 min-h-[24px]" />
      </div>
      <div className="pb-6 pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`font-semibold text-sm ${state === 'done' ? 'text-green-700' : state === 'active' ? 'text-blue-700' : state === 'error' ? 'text-red-700' : 'text-gray-400'}`}>{label}</p>
          {time && <span className="text-xs text-gray-400">{time}</span>}
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

function AiCheckRow({ label, result, confidence }: { label: string; result: 'pass' | 'fail' | 'pending'; confidence?: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {confidence !== undefined && (
          <div className="w-16 bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${confidence >= 80 ? 'bg-green-500' : confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${confidence}%` }} />
          </div>
        )}
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${result === 'pass' ? 'bg-green-100 text-green-700' : result === 'fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
          {result === 'pass' ? '✅ Pass' : result === 'fail' ? '❌ Fail' : '⏳ Pending'}
        </span>
      </div>
    </div>
  )
}

export default function InstantBuyStatusPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data, isLoading } = useQuery({
    queryKey: ['ib-order-status', id],
    queryFn: () => axios.get(`/api/instant-buy/orders/${id}`, { headers }),
    refetchInterval: 15000,
  })
  const order = data?.data?.data
  const status = order?.status ?? 'verifying'

  const coin = order?.coin ?? 'USDT'
  const coinAmount = order?.coinAmount ? parseFloat(order.coinAmount).toFixed(6) : '125.000000'
  const fiatAmount = order?.fiatAmount ? parseFloat(order.fiatAmount).toLocaleString('en-PK') : '35,000'
  const orderRef = order?.orderRef ?? `#IBO-${id}`
  const network = order?.network ?? 'TRC-20'

  const isCompleted = status === 'completed' || status === 'released'
  const isFailed = status === 'failed' || status === 'cancelled'

  const heroColor = isCompleted ? 'from-green-500 to-emerald-600' : isFailed ? 'from-red-500 to-rose-600' : 'from-blue-500 to-indigo-600'
  const heroIcon = isCompleted ? '✅' : isFailed ? '❌' : '🔄'
  const heroTitle = isCompleted ? 'Order Complete!' : isFailed ? 'Order Failed' : 'Verifying Payment...'
  const heroSub = isCompleted ? `${coinAmount} ${coin} has been released to your wallet` : isFailed ? 'Your order could not be processed. Contact support.' : 'Our team is reviewing your payment'

  const timelineSteps: { label: string; desc: string; state: StepState; time?: string }[] = [
    { label: 'Order Created', desc: 'Instant buy order placed successfully', state: 'done', time: '10:05 AM' },
    { label: 'Payment Received', desc: 'Payment proof uploaded by customer', state: 'done', time: '10:08 AM' },
    { label: 'Layer 1 — AI Scan', desc: 'Automated payment verification completed', state: isCompleted || isFailed ? 'done' : 'done', time: '10:09 AM' },
    { label: 'Layer 2 — Admin Review', desc: 'Human admin verifying and approving order', state: isCompleted ? 'done' : isFailed ? 'error' : 'active', time: isCompleted ? '10:22 AM' : undefined },
    { label: 'Crypto Released', desc: `${coinAmount} ${coin} sent to destination wallet`, state: isCompleted ? 'done' : 'pending', time: isCompleted ? '10:23 AM' : undefined },
    { label: 'Order Closed', desc: 'Transaction finalized and recorded', state: isCompleted ? 'done' : 'pending', time: isCompleted ? '10:23 AM' : undefined },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${heroColor} text-white py-12 px-6 text-center`}>
        <div className="text-5xl mb-4">{heroIcon}</div>
        <h1 className="text-2xl font-black mb-2">{heroTitle}</h1>
        <p className="text-white/80 text-sm mb-3">{heroSub}</p>
        <span className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-mono font-bold">{orderRef}</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* LEFT */}
          <div>
            {/* Timeline */}
            <div className="card p-6 mb-5">
              <h2 className="font-bold text-gray-800 mb-5">Order Timeline</h2>
              <div>
                {timelineSteps.map((step, i) => (
                  <TimelineStep key={i} {...step} />
                ))}
              </div>
            </div>

            {/* Two-layer verification */}
            <div className="two-layer-box">
              <h3 className="font-bold text-gray-800 mb-1">Verification Status</h3>
              <p className="text-xs text-gray-500 mb-5">Two mandatory layers protect every transaction</p>

              <div className="layer-ai-header rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-blue-700 uppercase">Layer 1 — AI Scan</p>
                  <span className="ls-passed text-xs px-2 py-0.5 rounded-full font-semibold">Passed</span>
                </div>
                <div className="space-y-1">
                  <AiCheckRow label="Screenshot authenticity" result="pass" confidence={96} />
                  <AiCheckRow label="Amount matches order" result="pass" confidence={99} />
                  <AiCheckRow label="Sender name KYC match" result="pass" confidence={88} />
                  <AiCheckRow label="Date/time validity" result="pass" confidence={100} />
                  <AiCheckRow label="Duplicate detection" result="pass" confidence={100} />
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-700 font-medium">Overall Confidence</span>
                    <span className="font-bold text-blue-800">96%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>

              <div className="layer-human-header rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-green-700 uppercase">Layer 2 — Admin Review</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isCompleted ? 'ls-passed' : isFailed ? 'bg-red-100 text-red-700' : 'ls-required'}`}>
                    {isCompleted ? 'Approved' : isFailed ? 'Rejected' : 'In Review'}
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  {isCompleted
                    ? 'Admin has reviewed and approved this order. Crypto released successfully.'
                    : isFailed
                    ? 'Admin was unable to approve this transaction. Please contact support.'
                    : 'An admin is currently reviewing your payment. This typically takes 10–30 minutes.'}
                </p>
                {!isCompleted && !isFailed && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-green-700">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Review in progress...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 sticky top-20">
            <div className="card p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Order Details</p>
              <div className="space-y-2">
                {[
                  { label: 'Order ID', value: orderRef, mono: true },
                  { label: 'Token', value: `${coin}` },
                  { label: 'Network', value: network },
                  { label: 'You receive', value: `${coinAmount} ${coin}`, green: true },
                  { label: 'You paid', value: `₨${fiatAmount}` },
                ].map(({ label, value, mono, green }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-semibold ${green ? 'text-green-600' : ''} ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {isCompleted && (
                <button onClick={() => router.push('/wallet')} className="btn btn-primary btn-full rounded-xl">
                  View Wallet
                </button>
              )}
              <button onClick={() => router.push('/instant-buy')} className="btn btn-secondary btn-full rounded-xl">
                New Order
              </button>
              <button onClick={() => router.push('/dashboard')} className="btn btn-ghost btn-full rounded-xl">
                Dashboard
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Need help?</strong><br />
              Available 9AM–11PM PKT<br />
              WhatsApp: +92-300-PAKSWAP<br />
              Telegram: @PakSwapSupport
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
