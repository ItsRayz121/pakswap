'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface PaymentItem {
  id: string
  tradeId: string
  trade?: { orderRef: string; coin: string; cryptoAmount: string; fiatAmount: string; paymentMethod: string }
  buyer?: { fullName: string; email: string }
  seller?: { fullName: string; email: string }
  proofUrl?: string
  submittedAt: string
  status: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function AdminPaymentsPage() {
  const [queue, setQueue] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PaymentItem | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.paymentsQueue()
      setQueue(r.data.data ?? r.data ?? [])
    } catch { setQueue([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function approve() {
    if (!selected) return
    setActing(true)
    try {
      await adminApi.approvePayment(selected.id)
      setMsg('Payment approved. Crypto released to buyer.')
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  async function reject() {
    if (!selected || rejectReason.length < 5) { setMsg('Enter a rejection reason.'); return }
    setActing(true)
    try {
      await adminApi.rejectPayment(selected.id, { reason: rejectReason })
      setMsg('Payment rejected.')
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Payment Verification Queue</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Layer 2 review — approve or reject buyer payment proofs</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {queue.length > 0 && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{queue.length} Pending</span>}
          <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}</div>}

      {selected ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Payment Review: {selected.trade?.orderRef ?? selected.tradeId.slice(0, 8)}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Submitted {new Date(selected.submittedAt).toLocaleString()}</div>
            </div>
            <button onClick={() => { setSelected(null); setMsg('') }} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Trade Details</div>
              {selected.trade && (
                <>
                  <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Ref:</span> <strong>#{selected.trade.orderRef}</strong></div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Amount:</span> <strong>{parseFloat(selected.trade.fiatAmount).toLocaleString()} PKR</strong></div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Crypto:</span> <strong>{parseFloat(selected.trade.cryptoAmount).toFixed(6)} {selected.trade.coin}</strong></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Method:</span> <strong>{selected.trade.paymentMethod}</strong></div>
                </>
              )}
              {selected.buyer && <div style={{ fontSize: 13, marginTop: 8 }}><span style={{ color: '#94a3b8' }}>Buyer:</span> <strong>{selected.buyer.fullName}</strong> <span style={{ color: '#64748b' }}>({selected.buyer.email})</span></div>}
              {selected.seller && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Seller:</span> <strong>{selected.seller.fullName}</strong></div>}
            </div>

            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', textTransform: 'uppercase' }}>Payment Proof</div>
              {selected.proofUrl ? (
                <a href={`${API_BASE}${selected.proofUrl}`} target="_blank" rel="noreferrer">
                  <img src={`${API_BASE}${selected.proofUrl}`} alt="Payment proof" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block' }} />
                </a>
              ) : (
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>No proof uploaded</div>
              )}
            </div>
          </div>

          <div style={{ background: '#fff7ed', border: '1.5px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
            <strong>Layer 2 — Human Review Required.</strong> Verify the payment proof before releasing crypto to buyer.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <button onClick={approve} disabled={acting} style={{ padding: '14px', background: acting ? '#86efac' : '#10b981', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              {acting ? 'Processing...' : '✅ Approve — Release Crypto'}
            </button>
            <div>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2} placeholder="Rejection reason (required)..." style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #fca5a5', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
              <button onClick={reject} disabled={acting} style={{ width: '100%', padding: '11px', background: acting ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                ✗ Reject Payment
              </button>
            </div>
          </div>
          {msg && <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{msg}</div>}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Trade</span><span>Amount</span><span>Method</span><span>Submitted</span><span>Action</span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
          ) : queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              No pending payment verifications.
            </div>
          ) : queue.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13, cursor: 'pointer' }} onClick={() => { setSelected(item); setMsg('') }}>
              <div>
                <div style={{ fontWeight: 700 }}>#{item.trade?.orderRef ?? item.tradeId.slice(0, 8)}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{item.buyer?.fullName ?? '—'}</div>
              </div>
              <strong>{item.trade ? parseFloat(item.trade.fiatAmount).toLocaleString() + ' PKR' : '—'}</strong>
              <span>{item.trade?.paymentMethod ?? '—'}</span>
              <span style={{ color: '#64748b' }}>{new Date(item.submittedAt).toLocaleString()}</span>
              <button onClick={e => { e.stopPropagation(); setSelected(item); setMsg('') }} style={{ padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Review →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
