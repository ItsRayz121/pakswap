'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Clock, Send, Upload, Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { tradesApi, disputesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      setRemaining(diff)
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const isUrgent = remaining < 300

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
      <Clock size={18} className={isUrgent ? 'text-red-500' : 'text-gray-500'} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  created: { label: 'Trade Created', color: 'badge-blue', icon: Clock },
  escrow_locked: { label: 'Waiting for Payment', color: 'badge-blue', icon: Clock },
  payment_pending: { label: 'Payment Pending', color: 'badge-yellow', icon: Clock },
  payment_claimed: { label: 'Payment Submitted — Under Review', color: 'badge-yellow', icon: Shield },
  under_review: { label: 'Admin Reviewing', color: 'badge-yellow', icon: Shield },
  releasing: { label: 'Releasing Crypto', color: 'badge-blue', icon: Loader2 },
  completed: { label: 'Trade Completed', color: 'badge-green', icon: CheckCircle },
  cancelled: { label: 'Trade Cancelled', color: 'badge-gray', icon: XCircle },
  expired: { label: 'Trade Expired', color: 'badge-gray', icon: XCircle },
  disputed: { label: 'Dispute Opened', color: 'badge-red', icon: AlertCircle },
  resolved: { label: 'Dispute Resolved', color: 'badge-green', icon: CheckCircle },
}

export default function TradePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('')
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeDesc, setDisputeDesc] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trade', id],
    queryFn: () => tradesApi.getById(id),
    refetchInterval: 5000,
  })

  const trade = data?.data?.data

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [trade?.messages])

  const sendMsgMutation = useMutation({
    mutationFn: () => tradesApi.sendMessage(id, message),
    onSuccess: () => { setMessage(''); refetch() },
  })

  const uploadProofMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('proof', file)
      return tradesApi.confirmPayment(id, fd)
    },
    onSuccess: () => {
      toast({ type: 'success', title: 'Payment Proof Submitted', description: 'Our team will verify your payment shortly.' })
      refetch()
    },
    onError: (err: any) => toast({ type: 'error', title: 'Upload Failed', description: err.response?.data?.message }),
  })

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => tradesApi.cancel(id, reason),
    onSuccess: () => {
      toast({ type: 'success', title: 'Trade Cancelled' })
      router.push('/orders')
    },
  })

  const disputeMutation = useMutation({
    mutationFn: () => disputesApi.open({ tradeId: id, reason: disputeReason, description: disputeDesc }),
    onSuccess: () => {
      toast({ type: 'info', title: 'Dispute Opened', description: 'Our team will respond within 4 hours.' })
      setDisputeOpen(false)
      refetch()
    },
  })

  if (isLoading) {
    return <DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /><div className="h-80 bg-gray-200 rounded-xl" /></div></DashboardLayout>
  }

  if (!trade) return <DashboardLayout><p className="text-gray-500">Trade not found.</p></DashboardLayout>

  const isBuyer = trade.buyerId === user?.id
  const statusConfig = STATUS_CONFIG[trade.status] ?? { label: trade.status, color: 'badge-gray', icon: Clock }
  const canUploadProof = isBuyer && (trade.status === 'escrow_locked' || trade.status === 'payment_pending')
  const canCancel = (trade.status === 'created' || trade.status === 'escrow_locked') && !trade.paymentProofs?.length
  const canDispute = ['escrow_locked', 'payment_claimed', 'under_review'].includes(trade.status)
  const isComplete = trade.status === 'completed'
  const isCancelled = ['cancelled', 'expired'].includes(trade.status)

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trade Header */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900">{trade.orderRef}</h1>
                <span className={`badge ${statusConfig.color}`}>{statusConfig.label}</span>
              </div>
              <p className="text-gray-600 text-sm">
                {isBuyer ? 'You are buying' : 'You are selling'} <strong>{parseFloat(trade.coinAmount).toFixed(6)} {trade.coin}</strong> for <strong>₨{parseFloat(trade.fiatAmount).toLocaleString('en-PK')}</strong>
              </p>
              <p className="text-xs text-gray-400 mt-1">Rate: ₨{parseFloat(trade.rate).toLocaleString('en-PK')} per {trade.coin}</p>
            </div>

            {/* Timer */}
            {!isComplete && !isCancelled && trade.expiresAt && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Payment Window</p>
                <CountdownTimer expiresAt={trade.expiresAt} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Payment Instructions + Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Two-Layer Status */}
            {trade.proofVerifications?.[0] && (
              <div className="two-layer-box">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Verification Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Layer 1 — AI Scan</span>
                    <span className={`badge ${
                      trade.proofVerifications[0].verificationStatus === 'pending_layer1' ? 'badge-yellow' :
                      trade.proofVerifications[0].aiVerdict === 'verified' ? 'badge-green' :
                      trade.proofVerifications[0].aiVerdict === 'suspicious' ? 'badge-red' : 'badge-blue'
                    }`}>
                      {trade.proofVerifications[0].verificationStatus === 'pending_layer1' ? 'Processing...' :
                       trade.proofVerifications[0].aiVerdict ?? 'Checked'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Layer 2 — Human Review</span>
                    <span className={`badge ${
                      trade.proofVerifications[0].verificationStatus === 'approved' ? 'badge-green' :
                      trade.proofVerifications[0].verificationStatus === 'rejected' ? 'badge-red' :
                      trade.proofVerifications[0].verificationStatus === 'pending_layer2' ? 'badge-yellow' : 'badge-gray'
                    }`}>
                      {trade.proofVerifications[0].verificationStatus === 'pending_layer2' ? 'Pending' :
                       trade.proofVerifications[0].verificationStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details (for buyer) */}
            {isBuyer && !isComplete && !isCancelled && (
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Instructions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium capitalize">{trade.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount to Send</span>
                    <span className="font-bold text-green-600">₨{parseFloat(trade.fiatAmount).toLocaleString('en-PK')}</span>
                  </div>
                  {trade.paymentDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Name</span>
                        <span className="font-medium">{trade.paymentDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number</span>
                        <span className="font-mono text-sm">{trade.paymentDetails.accountNumber}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                  <strong>Important:</strong> Send exact amount. Your payment account name MUST match your KYC name.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {canUploadProof && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadProofMutation.mutate(file)
                    }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadProofMutation.isPending}
                    className="btn-lg btn-primary w-full"
                  >
                    {uploadProofMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    Upload Payment Proof
                  </button>
                </>
              )}

              {canCancel && (
                <button
                  onClick={() => cancelMutation.mutate('Buyer cancelled before payment')}
                  disabled={cancelMutation.isPending}
                  className="btn-lg btn-secondary w-full"
                >
                  Cancel Trade
                </button>
              )}

              {canDispute && !disputeOpen && (
                <button onClick={() => setDisputeOpen(true)} className="btn-lg btn-danger w-full">
                  <AlertCircle size={18} /> Open Dispute
                </button>
              )}

              {disputeOpen && (
                <div className="card p-4 border border-red-200">
                  <h4 className="text-sm font-semibold text-red-900 mb-3">Open Dispute</h4>
                  <input
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="form-input mb-2"
                    placeholder="Reason (e.g. Payment sent but not released)"
                  />
                  <textarea
                    value={disputeDesc}
                    onChange={(e) => setDisputeDesc(e.target.value)}
                    className="form-input mb-3 h-24 resize-none"
                    placeholder="Describe the issue in detail..."
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setDisputeOpen(false)} className="btn-md btn-ghost flex-1">Cancel</button>
                    <button
                      onClick={() => disputeMutation.mutate()}
                      disabled={!disputeReason || !disputeDesc || disputeMutation.isPending}
                      className="btn-md btn-danger flex-1"
                    >
                      Submit Dispute
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Chat */}
          <div className="lg:col-span-2 card flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Trade Chat</h3>
              <p className="text-xs text-gray-400">Chat with {isBuyer ? trade.seller?.fullName : trade.buyer?.fullName}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(trade.messages ?? []).map((msg: any) => {
                const isMe = msg.senderId === user?.id
                const isSystem = msg.messageType === 'system'

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.message}</span>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-brand text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                      {msg.message}
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Message input */}
            {!isComplete && !isCancelled && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMsgMutation.mutate()}
                    className="form-input flex-1"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={() => sendMsgMutation.mutate()}
                    disabled={!message || sendMsgMutation.isPending}
                    className="btn-md btn-primary"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
