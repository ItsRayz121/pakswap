'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { tradesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

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
  buyerId: string
  buyer: { fullName: string; username?: string }
  seller: { fullName: string; username?: string }
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  created:         { label: 'Created',          bg: '#f1f5f9', color: '#64748b' },
  escrow_locked:   { label: 'Awaiting Payment', bg: '#dbeafe', color: '#1d4ed8' },
  payment_pending: { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  payment_claimed: { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  under_review:    { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  completed:       { label: 'Completed',        bg: '#d1fae5', color: '#065f46' },
  cancelled:       { label: 'Cancelled',        bg: '#fee2e2', color: '#991b1b' },
  disputed:        { label: 'Disputed',         bg: '#fee2e2', color: '#991b1b' },
}

const ALL_STATUSES = ['all', 'active', 'completed', 'cancelled']

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [trades, setTrades] = useState<Trade[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const fetchTrades = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (filter === 'active') params.status = 'escrow_locked'
      else if (filter === 'completed') params.status = 'completed'
      else if (filter === 'cancelled') params.status = 'cancelled'
      const res = await tradesApi.getAll(params)
      setTrades(res.data.data ?? [])
      setTotal(res.data.meta?.total ?? 0)
    } catch {
      setTrades([])
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => { fetchTrades() }, [fetchTrades])

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>Orders</span>
        {user && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initials(user.fullName)}</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.username ?? user.fullName.split(' ')[0]}</span>
          </div>
        )}
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>My Orders</h1>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{total} total trades</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {ALL_STATUSES.map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1) }}
                style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${filter === s ? '#2563eb' : '#e2e8f0'}`, background: filter === s ? '#eff6ff' : 'white', color: filter === s ? '#1d4ed8' : '#374151', fontWeight: filter === s ? 700 : 500, fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8' }}>Loading orders...</div>
        ) : trades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No trades found</div>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              {filter === 'all' ? 'You have no trades yet.' : `No ${filter} trades.`}
            </div>
            <Link href="/marketplace" style={{ display: 'inline-block', padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}>Browse Marketplace</Link>
          </div>
        ) : (
          <>
            {trades.map(t => {
              const st = STATUS_META[t.status] ?? { label: t.status, bg: '#f1f5f9', color: '#64748b' }
              const isBuyer = t.buyerId === user?.id
              const counterparty = isBuyer ? t.seller : t.buyer
              const isActive = !['completed', 'cancelled'].includes(t.status)
              return (
                <Link key={t.id} href={`/trade/${t.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', border: `1.5px solid ${isActive ? '#93c5fd' : '#e2e8f0'}`, borderRadius: '14px', padding: '20px', marginBottom: '12px', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isBuyer ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          {isBuyer ? '🟢' : '🔴'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '16px', fontWeight: 800 }}>{isBuyer ? 'Buy' : 'Sell'} {t.coin}</span>
                            <span style={{ background: st.bg, color: st.color, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{st.label}</span>
                            {isActive && <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>● Active</span>}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                            #{t.orderRef} · {counterparty ? (counterparty.username ?? counterparty.fullName) : '—'} · {new Date(t.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b' }}>{parseFloat(t.cryptoAmount).toFixed(4)} {t.coin}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{parseFloat(t.fiatAmount).toLocaleString()} PKR · {t.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* Pagination */}
            {total > 20 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
                <span style={{ padding: '8px 16px', fontSize: '14px', color: '#64748b' }}>Page {page} of {Math.ceil(total / 20)}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
