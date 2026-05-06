'use client'
import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Upload, Loader2, CheckCircle, Clock, Shield, XCircle, AlertCircle, Copy, QrCode } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../../components/ui/toaster'
import axios from 'axios'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; desc: string }> = {
  pending_payment: { label: 'Awaiting Payment', color: 'badge-yellow', icon: Clock, desc: 'Send your payment and upload the proof below.' },
  pending_layer1: { label: 'AI Verifying', color: 'badge-blue', icon: Shield, desc: 'Our AI is scanning your payment proof. This takes 1–3 minutes.' },
  pending_layer2: { label: 'Admin Review', color: 'badge-yellow', icon: Shield, desc: 'A compliance officer is reviewing your payment. Usually within 4 hours.' },
  approved: { label: 'Completed', color: 'badge-green', icon: CheckCircle, desc: 'Your crypto has been credited to your wallet.' },
  rejected: { label: 'Rejected', color: 'badge-red', icon: XCircle, desc: 'Your payment proof was rejected. Contact support if you believe this is an error.' },
  expired: { label: 'Expired', color: 'badge-gray', icon: XCircle, desc: 'This order has expired. Please create a new order.' },
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(0)
  const ref = useRef<NodeJS.Timeout>()

  useState(() => {
    const calc = () => setRemaining(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    calc()
    ref.current = setInterval(calc, 1000)
    return () => clearInterval(ref.current)
  })

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const urgent = remaining < 300

  return (
    <div className={`font-mono text-2xl font-bold ${urgent ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}

export default function InstantBuyOrderPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [txHash, setTxHash] = useState('')
  const [uploading, setUploading] = useState(false)

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data, refetch } = useQuery({
    queryKey: ['ib-order', id],
    queryFn: () => axios.get(`/api/instant-buy/orders/${id}`, { headers }),
    refetchInterval: 8000,
  })

  const order = data?.data?.data
  const conf = order ? (STATUS_CONFIG[order.verificationStatus] ?? STATUS_CONFIG.pending_payment) : null

  const uploadProof = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('proof', file)
      await axios.post(`/api/instant-buy/orders/${id}/submit-payment`, fd, { headers })
      toast({ type: 'success', title: 'Proof Submitted', description: 'Verification starting now.' })
      refetch()
    } catch (err: any) {
      toast({ type: 'error', title: 'Upload Failed', description: err.response?.data?.message })
    } finally {
      setUploading(false)
    }
  }

  const submitCryptoDeposit = async () => {
    if (!txHash) return
    try {
      await axios.post(`/api/instant-buy/orders/${id}/confirm-deposit`, { txHash }, { headers })
      toast({ type: 'success', title: 'TX Submitted', description: 'Blockchain confirmation in progress.' })
      refetch()
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    }
  }

  if (!order) {
    return <DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /><div className="h-60 bg-gray-200 rounded-xl" /></div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{order.orderRef}</h1>
              <p className="text-sm text-gray-500 mt-1">Instant Buy — {order.coin}</p>
            </div>
            {conf && (
              <span className={`badge ${conf.color} flex items-center gap-1`}>
                <conf.icon size={12} />
                {conf.label}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">You Receive</p>
              <p className="font-bold text-gray-900 text-lg">{parseFloat(order.coinAmount).toFixed(6)} {order.coin}</p>
            </div>
            {order.paymentMode === 'pkr' && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">You Pay</p>
                <p className="font-bold text-gray-900 text-lg">₨{parseFloat(order.fiatAmount).toLocaleString('en-PK')}</p>
              </div>
            )}
            {order.paymentMode === 'crypto' && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">You Send</p>
                <p className="font-bold text-gray-900 text-lg">{parseFloat(order.coinAmount).toFixed(6)} {order.fromCoin}</p>
              </div>
            )}
          </div>

          {conf && <p className="text-sm text-gray-500 mt-4">{conf.desc}</p>}
        </div>

        {/* Timer */}
        {order.verificationStatus === 'pending_payment' && order.expiresAt && (
          <div className="card p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Time remaining to pay</p>
            <CountdownTimer expiresAt={order.expiresAt} />
          </div>
        )}

        {/* Two-Layer Status */}
        {['pending_layer1', 'pending_layer2', 'approved', 'rejected'].includes(order.verificationStatus) && (
          <div className="two-layer-box">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Verification Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Layer 1 — AI Scan</span>
                <span className={`badge ${
                  order.verificationStatus === 'pending_layer1' ? 'badge-yellow' :
                  ['pending_layer2', 'approved', 'rejected'].includes(order.verificationStatus) ? 'badge-green' : 'badge-gray'
                }`}>
                  {order.verificationStatus === 'pending_layer1' ? 'Processing...' : 'Done'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Layer 2 — Human Review</span>
                <span className={`badge ${
                  order.verificationStatus === 'approved' ? 'badge-green' :
                  order.verificationStatus === 'rejected' ? 'badge-red' :
                  order.verificationStatus === 'pending_layer2' ? 'badge-yellow' : 'badge-gray'
                }`}>
                  {order.verificationStatus === 'pending_layer2' ? 'Pending' :
                   order.verificationStatus === 'approved' ? 'Approved' :
                   order.verificationStatus === 'rejected' ? 'Rejected' : 'Waiting'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PKR Payment — upload proof */}
        {order.paymentMode === 'pkr' && order.verificationStatus === 'pending_payment' && (
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Payment Instructions</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount to send</span>
                <span className="font-bold text-green-600">₨{parseFloat(order.fiatAmount).toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment method</span>
                <span className="font-medium capitalize">JazzCash / Easypaisa / Bank</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
              Send exactly ₨{parseFloat(order.fiatAmount).toLocaleString('en-PK')} to your designated PakSwap account. Contact support for payment details.
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadProof(f) }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-lg btn-primary w-full">
              {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : <><Upload size={18} /> Upload Payment Proof</>}
            </button>
          </div>
        )}

        {/* Crypto Payment — tx hash */}
        {order.paymentMode === 'crypto' && order.verificationStatus === 'pending_payment' && (
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Send {order.fromCoin}</h2>
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
              <QrCode size={80} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 text-center">Send exactly {parseFloat(order.coinAmount).toFixed(6)} {order.fromCoin} to your PakSwap deposit address, then enter the transaction hash below.</p>
            <input
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="form-input font-mono text-sm"
              placeholder="Transaction hash / TX ID"
            />
            <button onClick={submitCryptoDeposit} disabled={!txHash} className="btn-lg btn-primary w-full">
              Confirm Deposit
            </button>
          </div>
        )}

        {/* Completed */}
        {order.verificationStatus === 'approved' && (
          <div className="card p-6 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Complete!</h2>
            <p className="text-gray-500 mb-4">{parseFloat(order.coinAmount).toFixed(6)} {order.coin} has been added to your wallet.</p>
            <a href="/wallet" className="btn-md btn-primary">View Wallet</a>
          </div>
        )}

        {/* History link */}
        <div className="text-center">
          <a href="/instant-buy/history" className="text-sm text-brand hover:underline">← All Instant Buy Orders</a>
        </div>
      </div>
    </DashboardLayout>
  )
}
