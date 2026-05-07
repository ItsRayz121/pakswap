'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { tradesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface TradeMessage {
  id: string
  senderId: string
  message: string
  createdAt: string
}

interface Trade {
  id: string
  orderRef: string
  status: string
  coin: string
  cryptoAmount: string
  fiatAmount: string
  fixedPrice: string
  paymentMethod: string
  paymentDeadline?: string
  buyerId: string
  sellerId: string
  buyer: { id: string; username?: string; fullName: string }
  seller: { id: string; username?: string; fullName: string }
  messages: TradeMessage[]
  proofUrl?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  created:         { label: 'Waiting for Escrow', color: '#92400e', bg: '#fef3c7' },
  escrow_locked:   { label: 'Escrow Locked — Awaiting Payment', color: '#1d4ed8', bg: '#dbeafe' },
  payment_pending: { label: 'Payment Sent — Awaiting Confirmation', color: '#6d28d9', bg: '#ede9fe' },
  payment_claimed: { label: 'Under Admin Review', color: '#92400e', bg: '#fef3c7' },
  under_review:    { label: 'Under Review', color: '#92400e', bg: '#fef3c7' },
  completed:       { label: 'Completed', color: '#065f46', bg: '#d1fae5' },
  cancelled:       { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
  disputed:        { label: 'Disputed', color: '#991b1b', bg: '#fee2e2' },
}

export default function TradePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()

  const [trade, setTrade] = useState<Trade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofLoading, setProofLoading] = useState(false)
  const [proofError, setProofError] = useState('')
  const [timer, setTimer] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const fetchTrade = useCallback(async () => {
    try {
      const res = await tradesApi.getById(id)
      setTrade(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load trade.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchTrade() }, [fetchTrade])

  // Countdown timer from payment deadline
  useEffect(() => {
    if (!trade?.paymentDeadline) return
    const end = new Date(trade.paymentDeadline).getTime()
    const update = () => setTimer(Math.max(0, Math.floor((end - Date.now()) / 1000)))
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [trade?.paymentDeadline])

  // WebSocket for real-time messages + status
  useEffect(() => {
    if (!id || !trade) return
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
    const wsUrl = apiBase.replace(/^http/, 'ws') + `/api/trades/${id}/ws`
    const token = localStorage.getItem('access_token')
    const ws = new WebSocket(`${wsUrl}?token=${token}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try {
        const { type, payload } = JSON.parse(e.data)
        if (type === 'trade:message') {
          setTrade(prev => prev ? { ...prev, messages: [...(prev.messages ?? []), payload] } : prev)
        }
        if (type === 'trade:status_update') {
          setTrade(prev => prev ? { ...prev, status: payload.status } : prev)
        }
      } catch {}
    }

    return () => ws.close()
  }, [id, trade?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [trade?.messages])

  async function sendMessage() {
    if (!chatInput.trim() || chatLoading) return
    setChatLoading(true)
    const text = chatInput
    setChatInput('')
    try {
      const res = await tradesApi.sendMessage(id, text)
      setTrade(prev => prev ? { ...prev, messages: [...(prev.messages ?? []), res.data.data] } : prev)
    } catch {
      setChatInput(text)
    } finally {
      setChatLoading(false)
    }
  }

  async function submitProof() {
    if (!proofFile) return
    setProofError('')
    setProofLoading(true)
    const formData = new FormData()
    formData.append('proof', proofFile)
    try {
      await tradesApi.confirmPayment(id, formData)
      setProofFile(null)
      fetchTrade()
    } catch (e: any) {
      setProofError(e?.response?.data?.message ?? 'Failed to upload proof.')
    } finally {
      setProofLoading(false)
    }
  }

  async function cancelTrade() {
    if (!confirm('Cancel this trade?')) return
    try {
      await tradesApi.cancel(id, 'Cancelled by user')
      fetchTrade()
    } catch {}
  }

  if (loading) return <div style={{ fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#64748b' }}>Loading trade...</div>
  if (error || !trade) return <div style={{ fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#dc2626' }}>{error || 'Trade not found.'}</div>

  const isBuyer = user?.id === trade.buyerId
  const counterparty = isBuyer ? trade.seller : trade.buyer
  const counterpartyName = counterparty.username ?? counterparty.fullName
  const statusMeta = STATUS_LABELS[trade.status] ?? { label: trade.status, color: '#374151', bg: '#f1f5f9' }
  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(timer % 60).padStart(2, '0')
  const timerColor = timer < 120 ? '#dc2626' : timer < 300 ? '#f59e0b' : '#1d4ed8'
  const isActive = !['completed', 'cancelled'].includes(trade.status)
  const canUploadProof = isBuyer && trade.status === 'escrow_locked'
  const isCompleted = trade.status === 'completed'

  const steps = [
    { label: 'Trade Created', done: true },
    { label: 'Escrow Locked', done: ['escrow_locked', 'payment_pending', 'payment_claimed', 'under_review', 'completed'].includes(trade.status) },
    { label: 'Payment Sent', done: ['payment_pending', 'payment_claimed', 'under_review', 'completed'].includes(trade.status), active: trade.status === 'escrow_locked' },
    { label: 'Admin Verifies Payment', done: ['completed'].includes(trade.status), active: ['payment_pending', 'payment_claimed', 'under_review'].includes(trade.status) },
    { label: 'Crypto Released', done: isCompleted, active: isCompleted },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '12px' }}>
        <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>← Marketplace</Link>
        <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b' }}>Trade Room</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>#{trade.orderRef}</span>
          <span style={{ background: statusMeta.bg, color: statusMeta.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{statusMeta.label}</span>
        </div>
      </nav>

      {/* Countdown */}
      {isActive && trade.paymentDeadline && trade.status === 'escrow_locked' && (
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderBottom: '2px solid #93c5fd', padding: '12px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>🔒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{trade.cryptoAmount} {trade.coin} locked in escrow</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Buyer must send payment before timer expires</div>
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 900, color: timerColor }}>{mins}:{secs}</div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Trade info + proof + steps */}
        <div>
          {/* Trade summary */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
            <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>Trade Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                ['Type', isBuyer ? '🟢 Buying' : '🔴 Selling'],
                ['Coin', trade.coin],
                ['Amount', `${trade.cryptoAmount} ${trade.coin}`],
                ['PKR Amount', `${parseFloat(trade.fiatAmount).toLocaleString()} PKR`],
                ['Rate', `${parseFloat(trade.fixedPrice).toLocaleString()} PKR`],
                ['Payment', trade.paymentMethod],
                ['Counterparty', counterpartyName],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress steps */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '20px' }}>Trade Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {steps.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: step.done ? '#10b981' : step.active ? '#2563eb' : '#e2e8f0', color: step.done || step.active ? 'white' : '#94a3b8', fontWeight: 700, flexShrink: 0 }}>
                      {step.done ? '✓' : i + 1}
                    </div>
                    {i < steps.length - 1 && <div style={{ width: '2px', height: '28px', background: step.done ? '#10b981' : '#e2e8f0' }} />}
                  </div>
                  <div style={{ paddingBottom: i < steps.length - 1 ? '16px' : 0, paddingTop: '4px' }}>
                    <div style={{ fontWeight: step.active ? 700 : 600, fontSize: '14px', color: step.done ? '#10b981' : step.active ? '#2563eb' : '#94a3b8' }}>{step.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment proof upload */}
          {canUploadProof && (
            <div style={{ background: 'white', borderRadius: '16px', border: '2px solid #2563eb', padding: '24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px', color: '#1d4ed8' }}>📸 Upload Payment Proof</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Send {parseFloat(trade.fiatAmount).toLocaleString()} PKR via {trade.paymentMethod}, then upload your payment screenshot.</div>
              {proofError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#dc2626' }}>{proofError}</div>}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setProofFile(e.target.files?.[0] ?? null)} />
              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: proofFile ? '#f0fdf4' : '#f8fafc', marginBottom: '12px' }}>
                {proofFile ? (
                  <div style={{ color: '#065f46', fontWeight: 600 }}>✅ {proofFile.name}</div>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Click to select payment screenshot</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>JPG, PNG or PDF · Max 10MB</div>
                  </>
                )}
              </div>
              {proofFile && (
                <button onClick={submitProof} disabled={proofLoading} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: proofLoading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {proofLoading ? 'Uploading...' : 'Submit Payment Proof →'}
                </button>
              )}
            </div>
          )}

          {/* Proof submitted status */}
          {['payment_claimed', 'payment_pending', 'under_review'].includes(trade.status) && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1d4ed8', marginBottom: '6px' }}>⏳ Payment Proof Submitted</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>An admin is reviewing your payment. The crypto will be released once approved. Usually within 30 minutes.</div>
            </div>
          )}

          {/* Completed */}
          {isCompleted && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginBottom: '4px' }}>Trade Completed!</div>
              <div style={{ fontSize: '14px', color: '#064e3b' }}>{trade.cryptoAmount} {trade.coin} delivered successfully.</div>
            </div>
          )}

          {/* Cancel */}
          {isActive && ['created', 'escrow_locked'].includes(trade.status) && (
            <button onClick={cancelTrade} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #fca5a5', background: 'white', color: '#dc2626', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              Cancel Trade
            </button>
          )}
        </div>

        {/* Right: Chat */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 800, fontSize: '15px' }}>
            💬 Trade Chat — {counterpartyName}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!trade.messages?.length && (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '32px 0' }}>No messages yet. Start the conversation.</div>
            )}
            {trade.messages?.map(msg => {
              const isMe = msg.senderId === user?.id
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', background: isMe ? '#2563eb' : '#f1f5f9', color: isMe ? 'white' : '#1e293b', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: '14px' }}>
                    <div>{msg.message}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              )
            })}
            <div ref={chatBottomRef} />
          </div>

          {isActive && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
              <button onClick={sendMessage} disabled={chatLoading || !chatInput.trim()} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
