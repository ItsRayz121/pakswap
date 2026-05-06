'use client'
import { useState } from 'react'
import Link from 'next/link'

const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }

export default function OrdersPage() {
  const [tab, setTab] = useState('all')
  const [modal, setModal] = useState<string | null>(null)

  const orders = [
    {
      id: 'active', orderId: '#PKS-2026-00473', type: 'BUY USDT', typeColor: '#1d4ed8', typeBg: '#dbeafe',
      status: '⏳ In Progress', statusBg: '#fef3c7', statusColor: '#92400e',
      icon: '⏳', iconBg: '#fef3c7',
      counterparty: 'FastTrade', payment: 'JazzCash', date: '05 May 2026',
      amount: '35.71 USDT', amountColor: '#1e293b',
      pkr: '10,000 PKR paid', extra: null,
      cardBg: 'linear-gradient(135deg,#fffbeb,#ffffff)', cardBorder: '#f59e0b',
      showContinue: true, tab: 'active',
    },
    {
      id: 'complete1', orderId: '#PKS-2026-00472', type: 'BUY USDT', typeColor: '#1d4ed8', typeBg: '#dbeafe',
      status: '✅ Completed', statusBg: '#d1fae5', statusColor: '#065f46',
      icon: '✅', iconBg: '#d1fae5',
      counterparty: 'CryptoKing', payment: 'JazzCash', date: '05 May 2026 · 3:14 PM',
      amount: '+17.82 USDT', amountColor: '#10b981',
      pkr: '5,000 PKR paid', extra: '14 min duration',
      cardBg: 'white', cardBorder: '#e2e8f0',
      showContinue: false, tab: 'completed',
    },
    {
      id: 'sell1', orderId: '#PKS-2026-00441', type: 'SELL USDT', typeColor: '#991b1b', typeBg: '#fee2e2',
      status: '✅ Completed', statusBg: '#d1fae5', statusColor: '#065f46',
      icon: '✅', iconBg: '#d1fae5',
      counterparty: 'PKR_Pro', payment: 'Bank HBL', date: '03 May 2026 · 1:45 PM',
      amount: '-20.00 USDT', amountColor: '#ef4444',
      pkr: '+5,584 PKR received', extra: 'Rate: 279.20 PKR/USDT',
      cardBg: 'white', cardBorder: '#e2e8f0',
      showContinue: false, tab: 'completed',
    },
    {
      id: 'btc1', orderId: '#PKS-2026-00402', type: 'BUY BTC', typeColor: '#1d4ed8', typeBg: '#dbeafe',
      status: '✅ Completed', statusBg: '#d1fae5', statusColor: '#065f46',
      icon: '✅', iconBg: '#d1fae5',
      counterparty: 'BTC_Master', payment: 'Easypaisa', date: '25 Apr 2026',
      amount: '+0.00142 BTC', amountColor: '#f7931a',
      pkr: '27,264 PKR paid', extra: null,
      cardBg: 'white', cardBorder: '#e2e8f0',
      showContinue: false, tab: 'completed',
    },
    {
      id: 'cancel1', orderId: '#PKS-2026-00380', type: 'BUY USDT', typeColor: '#1d4ed8', typeBg: '#dbeafe',
      status: '✕ Cancelled', statusBg: '#fee2e2', statusColor: '#991b1b',
      icon: '✕', iconBg: '#fee2e2',
      counterparty: 'UKK_Exchange', payment: 'JazzCash', date: '20 Apr 2026',
      amount: '10.00 USDT', amountColor: '#94a3b8',
      pkr: '2,805 PKR', extra: 'Reason: Timer expired',
      cardBg: 'white', cardBorder: '#e2e8f0',
      showContinue: false, tab: 'cancelled', opacity: 0.7,
    },
  ]

  const filtered = tab === 'all' ? orders : orders.filter(o => o.tab === tab)

  const modalContent: Record<string, React.ReactNode> = {
    complete1: (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ background: '#d1fae5', color: '#065f46', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>✅ Completed</span>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
          {[
            ['Order ID', '#PKS-2026-00472', 'mono'],
            ['Type', 'BUY USDT'],
            ['Amount', '17.82 USDT', 'green'],
            ['Paid', '5,000 PKR'],
            ['Rate', '280.50 PKR/USDT'],
            ['Payment', '⚡ JazzCash'],
            ['Merchant', 'CryptoKing 👑'],
            ['Started', '05 May 2026, 3:00 PM'],
            ['Completed', '05 May 2026, 3:14 PM'],
          ].map(([label, val, style], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 8 ? '1px solid #f1f5f9' : 'none', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <strong style={{ fontFamily: style === 'mono' ? 'monospace' : 'inherit', color: style === 'green' ? '#26a17b' : '#1e293b' }}>{val}</strong>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>📄 Download Receipt</button>
          <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Report Issue</button>
        </div>
      </div>
    ),
    active: (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>⏳ In Progress</span>
        </div>
        <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, color: '#92400e' }}>This trade is still active!</div>
          <div style={{ fontSize: '13px', color: '#92400e', marginTop: '4px' }}>Timer is running. Go to trade room to complete.</div>
        </div>
        <Link href="/trade/demo"><button style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Go to Trade Room →</button></Link>
      </div>
    ),
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet' }, { label: 'Orders', href: '/orders', active: true }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>My Orders</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="🔍 Search by order ID or merchant" style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', fontSize: '13px' }} />
            <select style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
              <option>All Coins</option><option>USDT</option><option>BTC</option><option>ETH</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { val: '12', label: 'Total Trades', color: '#1e293b' },
            { val: '11', label: 'Completed', color: '#10b981' },
            { val: '0', label: 'Disputed', color: '#ef4444' },
            { val: '1', label: 'Cancelled', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {[{ key: 'all', label: 'All (12)' }, { key: 'active', label: 'Active (1)' }, { key: 'completed', label: 'Completed (10)' }, { key: 'cancelled', label: 'Cancelled (1)' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', fontSize: '14px', fontWeight: tab === t.key ? 700 : 500, cursor: 'pointer', background: tab === t.key ? 'white' : 'transparent', color: tab === t.key ? '#1d4ed8' : '#64748b', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {/* Order Cards */}
        {filtered.map(o => (
          <div key={o.id} onClick={() => setModal(o.id)} style={{ background: o.cardBg, border: `1.5px solid ${o.cardBorder}`, borderRadius: '14px', padding: '18px 20px', marginBottom: '10px', cursor: 'pointer', opacity: (o as any).opacity || 1, transition: 'all 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: o.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{o.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: o.typeBg, color: o.typeColor, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{o.type}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#374151' }}>{o.orderId}</span>
                    <span style={{ background: o.statusBg, color: o.statusColor, padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{o.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    {o.tab === 'active' ? 'Merchant: ' : o.type.includes('SELL') ? 'Buyer: ' : 'Merchant: '}
                    <strong>{o.counterparty}</strong> · {o.payment} · {o.date}
                  </div>
                  {o.extra && <div style={{ fontSize: '12px', color: o.id === 'cancel1' ? '#ef4444' : '#94a3b8', marginTop: '2px' }}>{o.extra}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: o.amountColor }}>{o.amount}</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{o.pkr}</div>
                {o.showContinue && (
                  <Link href="/trade/demo" onClick={e => e.stopPropagation()}>
                    <button style={{ marginTop: '6px', padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Continue Trade →</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>
          Showing {filtered.length} of 12 orders · <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Load More</a>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>Order Details</div>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            {modalContent[modal] || <p style={{ color: '#64748b', textAlign: 'center' }}>Order details</p>}
          </div>
        </div>
      )}
    </div>
  )
}
