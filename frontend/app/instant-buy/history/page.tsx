'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { instantBuyApi } from '@/lib/api'

interface Order {
  id: string
  orderRef: string
  coin: string
  network: string
  coinAmount: number
  fiatAmount: number | null
  rate: number | null
  paymentMode: string
  status: string
  verificationStatus: string
  toAddress?: string
  createdAt: string
}

const COIN_EMOJI: Record<string, string> = {
  USDT: '💵', USDC: '🔵', BNB: '🟡', ETH: '🔷', SOL: '🟣',
  BTC: '🟠', TRX: '🔴', AVAX: '🔺', APT: '⚡', NEAR: '🌐',
  OP: '🔴', ARB: '💙', SUI: '💧', RON: '⚔️', TON: '💎',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  created:          { bg: '#eff6ff', color: '#1d4ed8', label: 'Created' },
  payment_pending:  { bg: '#fef3c7', color: '#92400e', label: '⏳ Awaiting Payment' },
  payment_uploaded: { bg: '#dbeafe', color: '#1d4ed8', label: '🔍 Uploaded' },
  under_review:     { bg: '#dbeafe', color: '#1d4ed8', label: '🤖 Verifying' },
  releasing:        { bg: '#d1fae5', color: '#065f46', label: '🚀 Releasing' },
  completed:        { bg: '#d1fae5', color: '#065f46', label: '✓ Completed' },
  cancelled:        { bg: '#fee2e2', color: '#991b1b', label: '✗ Cancelled' },
  rejected:         { bg: '#fee2e2', color: '#991b1b', label: '✗ Rejected' },
  payout_failed:    { bg: '#fee2e2', color: '#991b1b', label: '⚠ Payout Failed' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })
}

export default function InstantBuyHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  useEffect(() => {
    setLoading(true)
    instantBuyApi.getOrders({ page, limit: LIMIT }).then(res => {
      const { data, pagination } = res.data
      console.log('[InstantBuy History] Loaded', data.length, 'orders, total:', pagination.total)
      setOrders(data)
      setTotal(pagination.total)
    }).catch(e => {
      const msg = e?.response?.data?.error ?? 'Failed to load orders'
      console.error('[InstantBuy History] Load error:', msg)
      setError(msg)
    }).finally(() => setLoading(false))
  }, [page])

  const completedCount = orders.filter(o => o.status === 'completed').length
  const totalSpent = orders.filter(o => o.fiatAmount).reduce((sum, o) => sum + (o.fiatAmount ?? 0), 0)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'P2P Market', href: '/marketplace' }, { label: 'Instant Buy', href: '/instant-buy' }, { label: 'Wallet', href: '/wallet' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Purchase History</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>All your Instant Buy orders</p>
          </div>
          <Link href="/instant-buy" style={{ padding: '8px 16px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>+ Buy Crypto</Link>
        </div>

        {/* Stats — derived from current page data */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { val: String(total), label: 'Total Orders', color: '#1e293b' },
            { val: String(completedCount), label: 'Completed (this page)', color: '#059669' },
            { val: totalSpent > 0 ? `PKR ${totalSpent.toLocaleString()}` : '—', label: 'Spent (this page)', color: '#1e293b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading orders...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#dc2626' }}>⚠️ {error}</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>No orders yet</div>
            <Link href="/instant-buy" style={{ color: '#2563eb', fontWeight: 600 }}>Make your first purchase →</Link>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                  <tr>
                    {['Order ID', 'Token', 'Received', 'Paid', 'Payment', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const st = STATUS_STYLE[o.status] ?? { bg: '#f1f5f9', color: '#64748b', label: o.status }
                    return (
                      <tr key={o.id} onClick={() => setModal(o)} style={{ borderBottom: i < orders.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{o.orderRef}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{COIN_EMOJI[o.coin] ?? '🪙'}</span>
                            <strong>{o.coin}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#059669' }}>{o.coinAmount.toFixed(6)} {o.coin}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.fiatAmount ? `${o.fiatAmount.toLocaleString()} PKR` : `${o.paymentMode} crypto`}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: o.paymentMode === 'pkr' ? '#fef3c7' : '#eff6ff', color: o.paymentMode === 'pkr' ? '#92400e' : '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                            {o.paymentMode === 'pkr' ? 'PKR' : 'Crypto'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{st.label}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{fmtDate(o.createdAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {orders.length} of {total} orders</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', color: '#374151', fontWeight: 600, fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '13px' }}>{page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={orders.length < LIMIT}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', color: '#374151', fontWeight: 600, fontSize: '13px', cursor: orders.length < LIMIT ? 'not-allowed' : 'pointer', opacity: orders.length < LIMIT ? 0.5 : 1 }}>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Order #{modal.orderRef}</h3>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Token', value: `${COIN_EMOJI[modal.coin] ?? '🪙'} ${modal.coin}`, color: '#1e293b' },
                { label: 'Amount', value: `${modal.coinAmount.toFixed(6)} ${modal.coin}`, color: '#059669' },
                { label: 'Paid', value: modal.fiatAmount ? `${modal.fiatAmount.toLocaleString()} PKR` : `${modal.paymentMode} crypto`, color: '#1e293b' },
                { label: 'Status', value: STATUS_STYLE[modal.status]?.label ?? modal.status, color: STATUS_STYLE[modal.status]?.color ?? '#64748b' },
              ].map(d => (
                <div key={d.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{d.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: d.color }}>{d.value}</div>
                </div>
              ))}
            </div>
            {modal.toAddress && (
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>DESTINATION</div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', color: '#1e293b' }}>{modal.toAddress}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href={`/instant-buy/status/${modal.id}`} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>Track Order</Link>
              <button onClick={() => setModal(null)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
