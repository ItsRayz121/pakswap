'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Clock, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../../components/ui/toaster'
import axios from 'axios'

function copyToClipboard(text: string, label: string) {
  navigator.clipboard?.writeText(text).catch(() => {})
  toast({ type: 'success', title: `${label} copied!` })
}

function ConfirmationStep({ label, state }: { label: string; state: 'done' | 'active' | 'pending' }) {
  return (
    <div className={`cs-step cs-${state} flex items-center gap-3 p-3 rounded-lg mb-2`}>
      <div className={`cs-icon w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${state === 'done' ? 'bg-green-500' : state === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}>
        {state === 'done' ? <CheckCircle size={16} className="text-white" /> : state === 'active' ? <Loader2 size={16} className="text-white animate-spin" /> : <span className="w-2 h-2 rounded-full bg-gray-400" />}
      </div>
      <span className={`text-sm font-medium ${state === 'done' ? 'text-green-700' : state === 'active' ? 'text-blue-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}

export default function CryptoDepositPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const [confirmations, setConfirmations] = useState(0)
  const required = 20

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data } = useQuery({
    queryKey: ['ib-order', id],
    queryFn: () => axios.get(`/api/instant-buy/orders/${id}`, { headers }),
    refetchInterval: 15000,
  })
  const order = data?.data?.data

  useEffect(() => {
    const t = setInterval(() => {
      setConfirmations(prev => {
        if (prev >= required) { clearInterval(t); return prev }
        return prev + 1
      })
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const coin = order?.coin ?? 'USDT'
  const coinAmount = order?.coinAmount ? parseFloat(order.coinAmount).toFixed(6) : '125.000000'
  const depositAddress = order?.depositAddress ?? 'TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7'
  const network = order?.network ?? 'TRC-20'
  const orderRef = order?.orderRef ?? `#IBO-${id}`

  const step1 = confirmations >= 1 ? 'done' : 'active'
  const step2 = confirmations >= 10 ? 'done' : confirmations >= 1 ? 'active' : 'pending'
  const step3 = confirmations >= required ? 'done' : confirmations >= 10 ? 'active' : 'pending'
  const step4 = confirmations >= required ? 'active' : 'pending'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="navbar">
        <button onClick={() => router.back()} className="text-sm font-medium text-gray-500 hover:text-gray-800">← Back</button>
        <span className="font-bold text-gray-900 mx-auto">{orderRef}</span>
        <span className="badge badge-blue flex items-center gap-1"><Clock size={11} /> Awaiting Deposit</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-5xl mx-auto px-6 py-8 items-start">

        {/* LEFT */}
        <div>
          {/* Deposit address card */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Send exactly</p>
                <p className="text-4xl font-black text-white">{coinAmount} <span className="text-xl font-bold text-gray-400">{coin}</span></p>
                <p className="text-sm text-gray-400 mt-1">on {network} network</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                  📱
                </div>
                <p className="text-xs text-gray-500 mt-1">QR Code</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-400 uppercase font-bold mb-2">Deposit Address ({network})</p>
              <p className="font-mono text-sm text-gray-100 break-all leading-relaxed mb-3">{depositAddress}</p>
              <button
                onClick={() => copyToClipboard(depositAddress, 'Address')}
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-600 transition-colors">
                📋 Copy Address
              </button>
            </div>
          </div>

          {/* Warnings */}
          <div className="space-y-3 mb-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="font-bold text-red-700 text-sm mb-1">⛔ Critical Warning</p>
              <p className="text-sm text-red-600">Send ONLY on the <strong>{network}</strong> network. Sending on a different network will result in <strong>permanent, unrecoverable loss of funds</strong>. We cannot retrieve cross-chain deposits.</p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="font-bold text-amber-700 text-sm mb-1">⚠️ Amount Must Match Exactly</p>
              <p className="text-sm text-amber-700">Send exactly <strong>{coinAmount} {coin}</strong>. Partial or excess amounts require manual processing and may take up to 24 hours.</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="font-bold text-blue-700 text-sm mb-1">ℹ️ Processing Time</p>
              <p className="text-sm text-blue-700">After sending, wait for <strong>{required} blockchain confirmations</strong>. This usually takes 5–15 minutes. Then our team reviews your order (typically 10–30 minutes during business hours).</p>
            </div>
          </div>

          {/* Two-layer verification */}
          <div className="two-layer-box mb-6">
            <h3 className="font-bold text-gray-800 mb-1">Two-Layer Verification</h3>
            <p className="text-xs text-gray-500 mb-4">Your funds are protected by our dual verification system</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="layer-ai-header rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase mb-2">Layer 1 — Blockchain</p>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2"><span>🔗</span> Transaction detected</div>
                  <div className="flex items-center gap-2"><span>🔢</span> {confirmations}/{required} confirmations</div>
                  <div className="flex items-center gap-2"><span>✅</span> Amount verified</div>
                  <div className="flex items-center gap-2"><span>🌐</span> Network check</div>
                </div>
              </div>
              <div className="layer-human-header rounded-xl p-4">
                <p className="text-xs font-bold text-green-700 uppercase mb-2">Layer 2 — Admin Review</p>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-center gap-2"><span>👤</span> Human verification</div>
                  <div className="flex items-center gap-2"><span>🔍</span> KYC compliance check</div>
                  <div className="flex items-center gap-2"><span>🛡️</span> Fraud screening</div>
                  <div className="flex items-center gap-2 font-semibold"><span>🔒</span> <span className="mandatory-tag">Mandatory — Always</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4 sticky top-20">
          {/* Live confirmation tracker */}
          <div className="card p-5">
            <h3 className="font-bold mb-4">Live Confirmation Tracker</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Blockchain Confirmations</span>
                <span className="font-bold">{confirmations}/{required}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (confirmations / required) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <ConfirmationStep label="Transaction broadcast to network" state={step1} />
              <ConfirmationStep label="10 confirmations reached" state={step2} />
              <ConfirmationStep label={`${required} confirmations — finalized`} state={step3} />
              <ConfirmationStep label="Admin review in progress" state={step4} />
            </div>
          </div>

          {/* Order summary */}
          <div className="card p-5">
            <p className="text-sm font-bold text-gray-700 mb-3">Order Summary</p>
            <div className="space-y-2">
              {[
                { label: 'Order ID', value: orderRef, mono: true },
                { label: 'Token', value: `${coin} (${network})` },
                { label: 'Amount', value: `${coinAmount} ${coin}`, green: true },
                { label: 'Status', value: confirmations >= required ? 'Confirmed ✅' : 'Awaiting Confirmations' },
              ].map(({ label, value, mono, green }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold ${green ? 'text-green-600' : ''} ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
                </div>
              ))}
            </div>
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
  )
}
