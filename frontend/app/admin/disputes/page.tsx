'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface DisputeItem {
  id: string
  tradeId: string
  trade?: { orderRef: string; coin: string; cryptoAmount: string; fiatAmount: string; paymentMethod: string }
  openedBy?: { fullName: string; email: string }
  buyer?: { fullName: string; email: string }
  seller?: { fullName: string; email: string }
  reason?: string
  status: string
  createdAt: string
  buyerEvidence?: string
  sellerEvidence?: string
  aiAnalysis?: any
}

export default function AdminDisputesPage() {
  const [queue, setQueue] = useState<DisputeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DisputeItem | null>(null)
  const [resolution, setResolution] = useState<'release_to_buyer' | 'return_to_seller' | ''>('')
  const [resolveNotes, setResolveNotes] = useState('')
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.disputesQueue()
      setQueue(r.data.data ?? r.data ?? [])
    } catch { setQueue([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function resolve() {
    if (!selected || !resolution) { setMsg('Select a resolution.'); return }
    if (resolveNotes.length < 10) { setMsg('Notes must be at least 10 characters.'); return }
    setActing(true)
    try {
      await adminApi.resolveDispute(selected.id, { resolution, notes: resolveNotes })
      setMsg(`Dispute resolved: ${resolution === 'release_to_buyer' ? 'Crypto released to buyer.' : 'Crypto returned to seller.'}`)
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  const waitTime = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Dispute Resolution</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Layer 2 admin decision required — crypto held in escrow</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {queue.length > 0 && <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{queue.length} Open</span>}
          <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}</div>}

      {selected ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Dispute: #{selected.trade?.orderRef ?? selected.tradeId.slice(0, 8)}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Opened {new Date(selected.createdAt).toLocaleString()} · {waitTime(selected.createdAt)} ago</div>
            </div>
            <button onClick={() => { setSelected(null); setMsg('') }} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Trade Details</div>
              {selected.trade && <>
                <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Amount:</span> <strong>{parseFloat(selected.trade.fiatAmount).toLocaleString()} PKR</strong></div>
                <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Crypto:</span> <strong>{parseFloat(selected.trade.cryptoAmount).toFixed(6)} {selected.trade.coin}</strong></div>
                <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Method:</span> <strong>{selected.trade.paymentMethod}</strong></div>
              </>}
              {selected.buyer && <div style={{ fontSize: 13, marginTop: 8 }}><span style={{ color: '#94a3b8' }}>Buyer:</span> <strong>{selected.buyer.fullName}</strong></div>}
              {selected.seller && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Seller:</span> <strong>{selected.seller.fullName}</strong></div>}
              {selected.reason && <div style={{ fontSize: 13, marginTop: 8 }}><span style={{ color: '#94a3b8' }}>Reason:</span> {selected.reason}</div>}
            </div>
            <div style={{ background: '#fef2f2', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase' }}>At Stake</div>
              {selected.trade && (
                <div style={{ fontSize: 24, fontWeight: 900, color: '#dc2626' }}>
                  {parseFloat(selected.trade.cryptoAmount).toFixed(6)} {selected.trade.coin}
                </div>
              )}
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Held in escrow — awaiting your decision</div>
            </div>
          </div>

          {/* Two-layer */}
          <div style={{ border: '1.5px solid #fde68a', borderRadius: 10, background: '#fffbeb', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
            <strong>Layer 2 — Admin Human Decision MANDATORY.</strong> Review all evidence above and select a resolution. Crypto will not move without your explicit decision.
          </div>

          {/* Resolution */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 10 }}>Resolution Decision</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div onClick={() => setResolution('release_to_buyer')} style={{ flex: 1, border: `2px solid ${resolution === 'release_to_buyer' ? '#10b981' : '#e2e8f0'}`, background: resolution === 'release_to_buyer' ? '#ecfdf5' : 'white', borderRadius: 10, padding: 14, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontWeight: 700, color: '#065f46', fontSize: 14 }}>✅ Release to Buyer</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Payment confirmed — send crypto to buyer</div>
              </div>
              <div onClick={() => setResolution('return_to_seller')} style={{ flex: 1, border: `2px solid ${resolution === 'return_to_seller' ? '#ef4444' : '#e2e8f0'}`, background: resolution === 'return_to_seller' ? '#fef2f2' : 'white', borderRadius: 10, padding: 14, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontWeight: 700, color: '#dc2626', fontSize: 14 }}>↩ Return to Seller</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Payment not confirmed — return crypto</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 6 }}>Decision Notes (required, min 10 chars)</label>
            <textarea value={resolveNotes} onChange={e => setResolveNotes(e.target.value)} rows={3} placeholder="Explain your decision based on the evidence..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#94a3b8' }}>{resolveNotes.length} chars</div>
          </div>

          <button onClick={resolve} disabled={acting || !resolution} style={{ width: '100%', padding: '14px', background: acting || !resolution ? '#94a3b8' : resolution === 'release_to_buyer' ? '#10b981' : '#ef4444', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: acting || !resolution ? 'not-allowed' : 'pointer' }}>
            {acting ? 'Processing...' : resolution === 'release_to_buyer' ? '✅ Execute: Release Crypto to Buyer' : resolution === 'return_to_seller' ? '↩ Execute: Return Crypto to Seller' : 'Select a resolution above'}
          </button>
          {msg && <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{msg}</div>}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Trade</span><span>Amount</span><span>Opened By</span><span>Age</span><span>Action</span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
          ) : queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              No open disputes.
            </div>
          ) : queue.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13, cursor: 'pointer' }} onClick={() => { setSelected(item); setResolution(''); setResolveNotes(''); setMsg('') }}>
              <div>
                <div style={{ fontWeight: 700 }}>#{item.trade?.orderRef ?? item.tradeId.slice(0, 8)}</div>
                {item.reason && <div style={{ fontSize: 11, color: '#64748b' }}>{item.reason.slice(0, 60)}</div>}
              </div>
              <strong>{item.trade ? parseFloat(item.trade.fiatAmount).toLocaleString() + ' PKR' : '—'}</strong>
              <span>{item.openedBy?.fullName ?? '—'}</span>
              <span style={{ color: parseInt(waitTime(item.createdAt)) > 120 ? '#ef4444' : '#64748b', fontWeight: 600 }}>{waitTime(item.createdAt)}</span>
              <button onClick={e => { e.stopPropagation(); setSelected(item); setResolution(''); setResolveNotes(''); setMsg('') }} style={{ padding: '6px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Resolve →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
