'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Copy, Upload, Loader2, Clock } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../../components/ui/toaster'
import axios from 'axios'

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    const calc = () => setSecs(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [expiresAt])
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  const urgent = secs < 120
  const danger = secs < 60
  return (
    <span className={`font-mono text-5xl font-black tracking-tighter ${danger ? 'timer-danger' : urgent ? 'timer-warning' : 'timer-normal'}`}>
      {m}:{s}
    </span>
  )
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard?.writeText(text).catch(() => {})
  toast({ type: 'success', title: `${label} copied!` })
}

export default function InstantBuyPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [payTab, setPayTab] = useState<'pkr' | 'usdt'>('pkr')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data } = useQuery({
    queryKey: ['ib-order', id],
    queryFn: () => axios.get(`/api/instant-buy/orders/${id}`, { headers }),
    refetchInterval: 10000,
  })
  const order = data?.data?.data

  const submitMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('proof', file)
      return axios.post(`/api/instant-buy/orders/${id}/submit-payment`, fd, { headers })
    },
    onSuccess: () => {
      toast({ type: 'success', title: 'Payment Submitted', description: 'Moving to verification...' })
      router.push(`/instant-buy/status/${id}`)
    },
    onError: (err: any) => toast({ type: 'error', title: 'Upload Failed', description: err.response?.data?.message })
  })

  const handleFile = (file: File) => setSelectedFile(file)

  const handleMarkPaid = () => {
    if (!selectedFile) { toast({ type: 'error', title: 'Upload Required', description: 'Please upload your payment screenshot first.' }); return }
    submitMutation.mutate(selectedFile)
  }

  const coin = order?.coin ?? 'USDT'
  const fiatAmount = order?.fiatAmount ? parseFloat(order.fiatAmount).toLocaleString('en-PK') : '—'
  const coinAmount = order?.coinAmount ? parseFloat(order.coinAmount).toFixed(6) : '—'
  const orderRef = order?.orderRef ?? `#IBO-${id}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="navbar">
        <button onClick={() => router.back()} className="text-sm font-medium text-gray-500 hover:text-gray-800">← Edit Order</button>
        <span className="font-bold text-gray-900 mx-auto">{orderRef}</span>
        <span className="badge badge-yellow flex items-center gap-1"><Clock size={11} /> Awaiting Payment</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 max-w-5xl mx-auto px-6 py-8 items-start">

        {/* LEFT: Instructions */}
        <div>
          {/* Order summary */}
          <div className="escrow-banner mb-6">
            <div className="text-3xl">{coin === 'USDT' ? '💵' : coin === 'BTC' ? '₿' : coin === 'SOL' ? '🟣' : '🪙'}</div>
            <div className="flex-1">
              <p className="font-extrabold text-base">Buying {coinAmount} {coin}</p>
              <p className="text-sm text-blue-500">{order?.network ?? 'TRC-20'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total to pay</p>
              <p className="text-xl font-extrabold text-brand">₨{fiatAmount}</p>
            </div>
          </div>

          {/* Payment mode tabs */}
          <div className="tab-bar mb-5">
            <button className={`tab flex-1 ${payTab === 'pkr' ? 'active' : ''}`} onClick={() => setPayTab('pkr')}>💳 Pay with PKR</button>
            <button className={`tab flex-1 ${payTab === 'usdt' ? 'active' : ''}`} onClick={() => setPayTab('usdt')}>💵 Pay with USDT</button>
          </div>

          {payTab === 'pkr' && (
            <div>
              {/* Important notes */}
              <div className="important-note bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-5">
                <h4 className="text-sm font-bold text-orange-700 mb-2">⚠️ Important — Read before paying</h4>
                <ul className="space-y-1.5">
                  {[
                    `Pay the exact amount shown — not more, not less`,
                    `Your account name must match your KYC name`,
                    `Include the order reference in payment note if your app supports it`,
                    `Do NOT pay from a third-party account`,
                    `Do NOT send via Raast — use JazzCash wallet-to-wallet or bank IBAN`,
                  ].map((note, i) => (
                    <li key={i} className="text-sm text-orange-800 flex gap-2">
                      <span>{i < 3 ? '✅' : '❌'}</span> {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment details */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 mb-5 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Details</p>
                <div className="text-center mb-5">
                  <p className="text-sm text-gray-500 mb-1">Pay exactly this amount</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tight">₨{fiatAmount}</p>
                  <p className="text-xs text-gray-400 mt-1">Do not round up or down</p>
                </div>
                {[
                  { label: '📱 Send to (JazzCash)', value: order?.jazzcashNumber ?? '0300-1234567', copyable: true },
                  { label: '👤 Account Name', value: 'PakSwap (Pvt) Ltd', copyable: false },
                  { label: '🔖 Reference / Note', value: orderRef.replace('#', ''), copyable: true },
                ].map(({ label, value, copyable }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500">{label}</span>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {value}
                      {copyable && (
                        <button onClick={() => copyToClipboard(value, label.split(' ').pop()!)}
                          className="bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5 text-xs font-semibold text-brand hover:bg-blue-100">
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Also accepted:</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="pay-pill epay">Easypaisa: {order?.easypaisaNumber ?? '0300-1234567'}</span>
                    <span className="pay-pill bank">IBAN: {order?.iban ?? 'PK36ALFH0110012345678901'}</span>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <h3 className="font-bold mb-3">Upload Payment Screenshot</h3>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 ${dragging ? 'border-brand bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-brand hover:bg-blue-50'}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}>
                <div className="text-4xl mb-3">📷</div>
                <p className="font-bold mb-1">Click to upload or drag &amp; drop</p>
                <p className="text-sm text-gray-500">JPG, PNG, PDF — max 10MB</p>
                <p className="text-xs text-gray-400 mt-1">Your JazzCash / Easypaisa / Bank screenshot</p>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <span className="text-2xl">📎</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">Ready for verification</p>
                  </div>
                  <span className="text-green-500 text-xl">✅</span>
                </div>
              )}

              <button onClick={handleMarkPaid} disabled={submitMutation.isPending}
                className="btn btn-primary btn-full btn-lg rounded-xl mb-3">
                {submitMutation.isPending ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : '✅ I Have Made the Payment'}
              </button>
              <button onClick={() => { if (confirm('Cancel this order?')) router.push('/instant-buy') }}
                className="btn btn-ghost btn-full">Cancel Order</button>
            </div>
          )}

          {payTab === 'usdt' && (
            <div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-5">
                <h4 className="font-bold text-green-800 mb-2">⚡ USDT Payment — Blockchain Monitored</h4>
                <p className="text-sm text-green-700 leading-relaxed">Send USDT to the address below. We monitor the blockchain automatically — no screenshot needed. Token is released after blockchain confirmation + admin review.</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">
                <div className="text-center mb-5">
                  <p className="text-sm text-gray-500 mb-1">Send exactly</p>
                  <p className="text-4xl font-black text-gray-900">{coinAmount} <span className="text-xl font-bold text-gray-400">{coin}</span></p>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Select Network</p>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm">TRC-20 (TRON)</button>
                    <button className="btn btn-secondary btn-sm">BEP-20 (BSC)</button>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 mb-3">
                  <p className="text-xs text-gray-400 mb-2 font-bold">DEPOSIT ADDRESS (TRC-20)</p>
                  <p className="font-mono text-sm text-gray-100 break-all leading-relaxed">{order?.depositAddress ?? 'TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7'}</p>
                  <button onClick={() => copyToClipboard(order?.depositAddress ?? 'TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7', 'Address')}
                    className="mt-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-md px-3 py-1 text-xs font-semibold hover:bg-gray-600">
                    📋 Copy Address
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  ⚠️ Send ONLY on the <strong>TRC-20 network</strong>. Sending on a different network will result in permanent loss of funds.
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">⏳ We will detect your transaction automatically. Usually 1–3 minutes after sending.</p>
            </div>
          )}
        </div>

        {/* RIGHT: Timer + order info */}
        <div className="card p-6 sticky top-20">
          <h3 className="font-bold text-center mb-4">Order Expires In</h3>
          <div className="text-center bg-gray-50 rounded-xl p-6 mb-5">
            <p className="text-xs text-gray-500 mb-2">Quote locked — pay before time runs out</p>
            {order?.expiresAt ? <CountdownTimer expiresAt={order.expiresAt} /> : <span className="text-5xl font-black text-gray-900">15:00</span>}
            <p className="text-xs text-gray-400 mt-2">Order will be cancelled if not paid</p>
          </div>

          <p className="text-sm font-bold text-gray-700 mb-3">Order Summary</p>
          <div className="space-y-2 mb-5">
            {[
              { label: 'Order ID', value: orderRef, mono: true },
              { label: 'Token', value: coin },
              { label: 'You receive', value: `${coinAmount} ${coin}`, green: true },
              { label: 'Rate', value: order?.rate ? `PKR ${parseFloat(order.rate).toLocaleString('en-PK')} / ${coin}` : '—' },
            ].map(({ label, value, mono, green }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${green ? 'text-green-600' : ''} ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-base font-extrabold pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-brand">₨{fiatAmount}</span>
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
