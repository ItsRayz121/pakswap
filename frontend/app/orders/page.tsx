'use client'
import { useState } from 'react'
import Link from 'next/link'

const orders = [
  { id: '#PKS-2026-00473', type: 'BUY USDT', typeStyle: { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }, icon: '⏳', iconBg: '#fef3c7', status: 'In Progress', statusStyle: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }, party: 'FastTrade', role: 'Merchant', payment: 'JazzCash', date: '05 May 2026', amount: '35.71 USDT', amountColor: '#1e293b', fiat: '10,000 PKR paid', extra: '', cardStyle: { borderColor: '#f59e0b', background: 'linear-gradient(135deg,#fffbeb,#ffffff)' }, showContinue: true, opacity: 1 },
  { id: '#PKS-2026-00472', type: 'BUY USDT', typeStyle: { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }, icon: '✅', iconBg: '#d1fae5', status: 'Completed', statusStyle: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }, party: 'CryptoKing', role: 'Merchant', payment: 'JazzCash', date: '05 May 2026 · 3:14 PM', amount: '+17.82 USDT', amountColor: '#10b981', fiat: '5,000 PKR paid', extra: '14 min duration', rating: '★★★★★', cardStyle: {}, showContinue: false, opacity: 1 },
  { id: '#PKS-2026-00441', type: 'SELL USDT', typeStyle: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }, icon: '✅', iconBg: '#d1fae5', status: 'Completed', statusStyle: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }, party: 'PKR_Pro', role: 'Buyer', payment: 'Bank HBL', date: '03 May 2026 · 1:45 PM', amount: '-20.00 USDT', amountColor: '#ef4444', fiat: '+5,584 PKR received', extra: 'Rate: 279.20 PKR/USDT', rating: '★★★★★', cardStyle: {}, showContinue: false, opacity: 1 },
  { id: '#PKS-2026-00402', type: 'BUY BTC', typeStyle: { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }, icon: '✅', iconBg: '#d1fae5', status: 'Completed', statusStyle: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }, party: 'BTC_Master', role: 'Merchant', payment: 'Easypaisa', date: '25 Apr 2026', amount: '+0.00142 BTC', amountColor: '#f7931a', fiat: '27,264 PKR paid', extra: '', cardStyle: {}, showContinue: false, opacity: 1 },
  { id: '#PKS-2026-00380', type: 'BUY USDT', typeStyle: { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }, icon: '✕', iconBg: '#fee2e2', status: 'Cancelled', statusStyle: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }, party: 'UKK_Exchange', role: 'Merchant', payment: 'JazzCash', date: '20 Apr 2026', amount: '10.00 USDT', amountColor: '#94a3b8', fiat: '2,805 PKR', extra: 'Reason: Timer expired', cardStyle: {}, showContinue: false, opacity: 0.7 },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [modal, setModal] = useState<string | null>(null)

  const tabs = ['all', 'active', 'completed', 'cancelled']
  const tabLabels: Record<string, string> = { all: 'All (12)', active: 'Active (1)', completed: 'Completed (10)', cancelled: 'Cancelled (1)' }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/orders" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Orders</Link>
          <Link href="/create-ad" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>My Orders</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="🔍 Search by order ID or merchant" style={{ padding: '8px 14px', width: 220, fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 10, outline: 'none' }} />
            <select style={{ padding: '8px 14px', fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 10, outline: 'none', background: 'white', width: 130 }}>
              <option>All Coins</option>
              <option>USDT</option>
              <option>BTC</option>
              <option>ETH</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[{ v: '12', label: 'Total Trades', color: '#1e293b' }, { v: '11', label: 'Completed', color: '#10b981' }, { v: '0', label: 'Disputed', color: '#ef4444' }, { v: '1', label: 'Cancelled', color: '#f59e0b' }].map(s => (
            <div key={s.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.v}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 12, padding: 4, gap: 4 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: activeTab === t ? 'white' : 'transparent', color: activeTab === t ? '#1e293b' : '#64748b', boxShadow: activeTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{tabLabels[t]}</button>
            ))}
          </div>
        </div>

        {/* Order Cards */}
        {orders.map((o, i) => (
          <div key={i} onClick={() => setModal(o.id)} style={{ background: (o.cardStyle as any).background || 'white', border: `1.5px solid ${(o.cardStyle as any).borderColor || '#e2e8f0'}`, borderRadius: 14, padding: '18px 20px', marginBottom: 10, opacity: o.opacity, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(37,99,235,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = (o.cardStyle as any).borderColor || '#e2e8f0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: o.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{o.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ ...o.typeStyle, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{o.type}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#374151' }}>{o.id}</span>
                    <span style={{ ...o.statusStyle, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{o.status === 'In Progress' ? '⏳' : o.status === 'Completed' ? '✅' : '✕'} {o.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{o.role}: <strong>{o.party}</strong> · {o.payment} · {o.date}</div>
                  {o.rating && <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>{o.rating} <span style={{ color: '#64748b' }}>You rated</span></div>}
                  {o.extra && !o.rating && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{o.extra}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: o.amountColor }}>{o.amount}</div>
                <div style={{ fontSize: 14, color: o.fiat.startsWith('+') ? '#10b981' : '#64748b', fontWeight: o.fiat.startsWith('+') ? 600 : 400 }}>{o.fiat}</div>
                {o.extra && o.rating && <div style={{ fontSize: 12, color: '#94a3b8' }}>{o.extra}</div>}
                {o.showContinue && (
                  <Link href="/trade" onClick={e => e.stopPropagation()}>
                    <button style={{ marginTop: 6, padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Continue Trade →</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: 20, color: '#64748b', fontSize: 14 }}>
          Showing 5 of 12 orders · <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Load More</a>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(null) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Order Details</div>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {modal === '#PKS-2026-00473' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}><span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600 }}>⏳ In Progress</span></div>
                <div style={{ background: '#fffbeb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#92400e' }}>This trade is still active!</div>
                  <div style={{ fontSize: 13, color: '#92400e', marginTop: 4 }}>Timer is running. Go to trade room to complete.</div>
                </div>
                <Link href="/trade"><button style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Go to Trade Room →</button></Link>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}><span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600 }}>✅ Completed</span></div>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                  {[['Order ID', modal], ['Amount', '17.82 USDT'], ['Paid', '5,000 PKR'], ['Rate', '280.50 PKR/USDT'], ['Payment', '⚡ JazzCash'], ['Merchant', 'CryptoKing 👑'], ['Completed', '05 May 2026, 3:14 PM']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <strong style={{ fontFamily: k === 'Order ID' ? 'monospace' : undefined }}>{v}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                  <button style={{ flex: 1, padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>📄 Download Receipt</button>
                  <button style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: '#f1f5f9', color: '#374151' }}>Report Issue</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
