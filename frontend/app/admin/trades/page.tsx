'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api'

interface Trade {
  id: string
  orderRef: string
  status: string
  coin: string
  cryptoAmount: string
  fiatAmount: string
  fixedPrice: string
  paymentMethod: string
  createdAt: string
  buyer?: { fullName: string }
  seller?: { fullName: string }
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  created:         { bg: '#f1f5f9', color: '#64748b' },
  escrow_locked:   { bg: '#dbeafe', color: '#1d4ed8' },
  payment_pending: { bg: '#fef3c7', color: '#92400e' },
  payment_claimed: { bg: '#fef3c7', color: '#92400e' },
  completed:       { bg: '#d1fae5', color: '#065f46' },
  cancelled:       { bg: '#fee2e2', color: '#991b1b' },
  disputed:        { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.trades({ page, limit: 30, status: status || undefined })
      setTrades(r.data.data ?? r.data ?? [])
      setTotal(r.data.meta?.total ?? 0)
    } catch { setTrades([]) }
    finally { setLoading(false) }
  }, [page, status])

  useEffect(() => { load() }, [load])

  const filters = ['', 'escrow_locked', 'payment_pending', 'disputed', 'completed', 'cancelled']
  const filterLabels: Record<string, string> = { '': 'All', escrow_locked: 'Active', payment_pending: 'Under Review', disputed: 'Disputed', completed: 'Completed', cancelled: 'Cancelled' }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>All Trades</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{total.toLocaleString()} total</div>
        </div>
        <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {filters.map(f => (
          <button key={f} onClick={() => { setStatus(f); setPage(1) }} style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${status === f ? '#2563eb' : '#e2e8f0'}`, background: status === f ? '#eff6ff' : 'white', color: status === f ? '#1d4ed8' : '#374151', fontWeight: status === f ? 700 : 500, fontSize: 12, cursor: 'pointer' }}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Ref</span><span>Coin</span><span>Amount</span><span>Buyer</span><span>Seller</span><span>Status</span><span>View</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
        ) : trades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No trades found.</div>
        ) : trades.map(t => {
          const st = STATUS_COLORS[t.status] ?? { bg: '#f1f5f9', color: '#64748b' }
          return (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13 }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{t.orderRef}</span>
              <span style={{ fontWeight: 700 }}>{t.coin}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{parseFloat(t.fiatAmount).toLocaleString()} PKR</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{parseFloat(t.cryptoAmount).toFixed(4)} {t.coin}</div>
              </div>
              <span>{t.buyer?.fullName ?? '—'}</span>
              <span>{t.seller?.fullName ?? '—'}</span>
              <span style={{ background: st.bg, color: st.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{t.status.replace('_', ' ')}</span>
              <Link href={`/trade/${t.id}`} target="_blank" style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white', textDecoration: 'none', color: '#374151' }}>View →</Link>
            </div>
          )
        })}
      </div>

      {total > 30 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', fontSize: 13, color: '#64748b' }}>Page {page} of {Math.ceil(total / 30)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 30)} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
