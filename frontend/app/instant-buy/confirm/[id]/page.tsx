'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Clock, Shield, Wallet, BarChart2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import axios from 'axios'

export default function InstantBuyConfirmPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data } = useQuery({
    queryKey: ['ib-order', id],
    queryFn: () => axios.get(`/api/instant-buy/orders/${id}`, { headers }),
  })
  const order = data?.data?.data

  const coin = order?.coin ?? 'USDT'
  const coinAmount = order?.coinAmount ? parseFloat(order.coinAmount).toFixed(6) : '125.000000'
  const fiatAmount = order?.fiatAmount ? parseFloat(order.fiatAmount).toLocaleString('en-PK') : '35,000'
  const orderRef = order?.orderRef ?? `#IBO-${id}`
  const network = order?.network ?? 'TRC-20'
  const rate = order?.rate ? `PKR ${parseFloat(order.rate).toLocaleString('en-PK')}` : 'PKR 280.00'

  const steps = [
    { icon: '📸', title: 'Payment Received', desc: 'Your payment screenshot has been uploaded successfully.', done: true },
    { icon: '🤖', title: 'AI Verification (Layer 1)', desc: 'Our system scans and validates your payment proof automatically.', done: false, active: true },
    { icon: '👤', title: 'Admin Review (Layer 2)', desc: 'A human admin verifies and approves the transaction.', done: false },
    { icon: '🚀', title: 'Crypto Released', desc: `${coinAmount} ${coin} sent to your wallet address.`, done: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Green hero */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-14 px-6 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Order Submitted!</h1>
        <p className="text-green-100 text-base mb-3">Your payment has been received and is under review</p>
        <span className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-mono font-bold">{orderRef}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Order summary */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Token Purchasing', value: `${coinAmount} ${coin}` },
              { label: 'Network', value: network },
              { label: 'Amount Paid', value: `₨${fiatAmount}` },
              { label: 'Rate', value: `${rate} / ${coin}` },
              { label: 'Order Reference', value: orderRef, mono: true },
              { label: 'Submitted At', value: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }) },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className={`font-semibold text-sm ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-5">What Happens Next</h2>
          <div className="relative">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${step.done ? 'bg-green-100' : step.active ? 'bg-blue-100 ring-2 ring-blue-300' : 'bg-gray-100'}`}>
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold text-sm ${step.done ? 'text-green-700' : step.active ? 'text-blue-700' : 'text-gray-400'}`}>{step.title}</p>
                    {step.done && <span className="badge badge-green text-xs">Done</span>}
                    {step.active && <span className="badge badge-blue text-xs">In Progress</span>}
                  </div>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important notes */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-amber-800 mb-3">⚠️ Important Notes</h3>
          <ul className="space-y-2">
            {[
              'Review typically completes within 10–30 minutes during business hours (9AM–11PM PKT)',
              'You will receive an SMS and email notification once your crypto is released',
              'Do NOT submit duplicate payments — contact support if you face any issues',
              'Keep your order reference number safe for any support queries',
            ].map((note, i) => (
              <li key={i} className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 mt-0.5">•</span> {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/instant-buy/status/${id}`)}
            className="btn btn-primary btn-full btn-lg rounded-xl">
            📊 Track Order Status
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/wallet')}
              className="btn btn-secondary rounded-xl py-3 flex items-center justify-center gap-2">
              <Wallet size={16} /> View Wallet
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-ghost rounded-xl py-3 flex items-center justify-center gap-2">
              <BarChart2 size={16} /> Dashboard
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Need help? <a href="#" className="text-brand font-medium hover:underline">Chat with Support</a></p>
        </div>
      </div>
    </div>
  )
}
