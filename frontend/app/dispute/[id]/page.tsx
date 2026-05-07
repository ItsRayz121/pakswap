'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { disputesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface DisputeMessage {
  id: string
  senderId: string
  message: string
  createdAt: string
}

interface DisputeEvidence {
  id: string
  fileUrl: string
  description?: string
  uploadedById: string
  createdAt: string
}

interface Dispute {
  id: string
  status: string
  reason: string
  description?: string
  openedById: string
  agentId?: string | null
  createdAt: string
  resolvedAt?: string | null
  resolution?: string | null
  trade: {
    id: string
    orderRef: string
    coin: string
    cryptoAmount: string
    fiatAmount: string
    paymentMethod: string
    buyerId: string
    sellerId: string
  }
  evidence: DisputeEvidence[]
  messages: DisputeMessage[]
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open:         { label: '🔴 Open', color: '#dc2626', bg: '#fee2e2' },
  under_review: { label: '🔴 Under Review', color: '#dc2626', bg: '#fee2e2' },
  resolved:     { label: '✅ Resolved', color: '#065f46', bg: '#d1fae5' },
  cancelled:    { label: 'Cancelled', color: '#374151', bg: '#f1f5f9' },
}

export default function DisputePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)

  const fetchDispute = useCallback(async () => {
    try {
      const res = await disputesApi.getById(id)
      setDispute(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load dispute.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchDispute() }, [fetchDispute])

  async function sendMsg() {
    if (!msg.trim() || sending) return
    setSending(true)
    const text = msg
    setMsg('')
    try {
      const res = await disputesApi.sendMessage(id, text)
      setDispute(prev => prev ? { ...prev, messages: [...prev.messages, res.data.data] } : prev)
    } catch {
      setMsg(text)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div style={{ fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#64748b' }}>Loading dispute…</div>
  if (error || !dispute) return <div style={{ fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#dc2626' }}>{error || 'Dispute not found.'}</div>

  const isBuyer = user?.id === dispute.trade.buyerId
  const openedByMe = dispute.openedById === user?.id
  const statusMeta = STATUS_LABELS[dispute.status] ?? { label: dispute.status, color: '#374151', bg: '#f1f5f9' }
  const isActive = ['open', 'under_review'].includes(dispute.status)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/orders" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Orders</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>Disputes</span>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Dispute Center</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Track and manage your trade dispute</p>
        </div>

        <div style={{ background: 'white', border: `1.5px solid ${isActive ? '#ef4444' : '#10b981'}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>⚖️</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>Dispute #{dispute.id.slice(0, 8).toUpperCase()}</span>
                  <span style={{ background: statusMeta.bg, color: statusMeta.color, fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{statusMeta.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Trade #{dispute.trade.orderRef} · Opened {new Date(dispute.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '14px' }}>{dispute.trade.cryptoAmount} {dispute.trade.coin} Safely Locked in Escrow</div>
              <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '2px' }}>Funds are protected and cannot be moved until dispute is resolved</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Trade Summary</div>
              <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Row l="Type" v={`${isBuyer ? 'BUY' : 'SELL'} ${dispute.trade.coin}`} badge />
                <Row l="Amount" v={`${dispute.trade.cryptoAmount} ${dispute.trade.coin}`} />
                <Row l={isBuyer ? 'Paid' : 'Received'} v={`${parseFloat(dispute.trade.fiatAmount).toLocaleString()} PKR`} />
                <Row l="Method" v={dispute.trade.paymentMethod} pill />
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Dispute Details</div>
              <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Row l="Opened by" v={openedByMe ? 'You' : 'Counterparty'} />
                <Row l="Reason" v={dispute.reason} />
                <Row l="Status" v={dispute.status.replace('_', ' ')} badge />
                {dispute.resolution && <Row l="Resolution" v={dispute.resolution} />}
              </div>
            </div>
          </div>

          {dispute.description && (
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: '4px', color: '#1e293b' }}>Description</div>
              {dispute.description}
            </div>
          )}

          {dispute.evidence.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Evidence ({dispute.evidence.length})</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {dispute.evidence.map(ev => (
                  <a key={ev.id} href={ev.fileUrl} target="_blank" rel="noreferrer" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none', color: '#1e293b' }}>
                    📎 {ev.description ?? 'Evidence'}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Communication with Support</div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
              {dispute.messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '24px 0' }}>No messages yet.</div>
              )}
              {dispute.messages.map(m => {
                const mine = m.senderId === user?.id
                return (
                  <div key={m.id} style={{ textAlign: mine ? 'right' : 'left' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      {mine ? 'You' : 'Support'} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ background: mine ? '#2563eb' : 'white', color: mine ? 'white' : '#1e293b', border: mine ? 'none' : '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', display: 'inline-block', maxWidth: '80%' }}>{m.message}</div>
                  </div>
                )
              })}
            </div>
            {isActive && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  placeholder="Type a message to support..."
                  style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <button onClick={sendMsg} disabled={sending || !msg.trim()} style={{ padding: '11px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Send</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ l, v, badge, pill }: { l: string; v: string; badge?: boolean; pill?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#64748b' }}>{l}</span>
      {badge ? <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{v}</span>
        : pill ? <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{v}</span>
        : <strong>{v}</strong>}
    </div>
  )
}
