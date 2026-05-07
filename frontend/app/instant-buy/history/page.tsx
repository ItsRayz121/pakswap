'use client'
import { useState } from 'react'
import Link from 'next/link'

const orders = [
  { id: 'IBO-004521', emoji: '🟣', bg: '#f0fdf4', token: 'SOL', received: '0.2348 SOL', receivedColor: '#059669', paid: '10,135 PKR', rate: '43,150/SOL', payment: 'JazzCash', payBg: '#fef3c7', payColor: '#92400e', statusLabel: '⏳ Verifying', statusBg: '#fef3c7', statusColor: '#92400e', date: 'May 5, 14:23' },
  { id: 'IBO-004498', emoji: '🟡', bg: '#fef3c7', token: 'BNB', received: '0.1180 BNB', receivedColor: '#059669', paid: '10,080 PKR', rate: '85,420/BNB', payment: 'Easypaisa', payBg: '#d1fae5', payColor: '#065f46', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusColor: '#065f46', date: 'May 4, 11:05' },
  { id: 'IBO-004321', emoji: '💎', bg: '#eff6ff', token: 'TON', received: '301.2 TON', receivedColor: '#059669', paid: '50,048 PKR', rate: '1,662/TON', payment: 'Bank Transfer', payBg: '#eff6ff', payColor: '#1d4ed8', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusColor: '#065f46', date: 'May 3, 17:45' },
  { id: 'IBO-004280', emoji: '🔷', bg: '#ede9fe', token: 'ETH', received: '0.0203 ETH', receivedColor: '#059669', paid: '20,000 PKR', rate: '985,200/ETH', payment: 'JazzCash', payBg: '#fef3c7', payColor: '#92400e', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusColor: '#065f46', date: 'May 1, 09:12' },
  { id: 'IBO-004101', emoji: '🟠', bg: '#fff7ed', token: 'BTC', received: '0.000363 BTC', receivedColor: '#059669', paid: '10,000 PKR', rate: '27.5M/BTC', payment: 'Easypaisa', payBg: '#d1fae5', payColor: '#065f46', statusLabel: '✗ Cancelled', statusBg: '#fee2e2', statusColor: '#991b1b', date: 'Apr 28, 21:33' },
]

export default function InstantBuyHistoryPage() {
  const [modal, setModal] = useState<string | null>(null)
  const selectedOrder = orders.find(o => o.id === modal)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'P2P Market', href: '/marketplace' }, { label: 'Instant Buy', href: '/instant-buy' }, { label: 'Wallet', href: '/wallet' }, { label: 'P2P Orders', href: '/orders' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Purchase History</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>All your Instant Buy orders</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>📥 Export CSV</button>
            <Link href="/instant-buy" style={{ padding: '8px 16px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>+ Buy Crypto</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { val: '24', label: 'Total Orders', color: '#1e293b' },
            { val: '22', label: 'Completed', color: '#059669' },
            { val: 'PKR 284,500', label: 'Total Spent', color: '#1e293b' },
            { val: '0', label: 'Disputed', color: '#2563eb' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          <input type="text" placeholder="Search order ID..." style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', maxWidth: '200px', outline: 'none' }} />
          {['All Tokens', 'All Status', 'All Time'].map(lbl => (
            <select key={lbl} style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white', outline: 'none' }}>
              <option>{lbl}</option>
            </select>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr>
                {['Order ID', 'Token', 'Received', 'Paid', 'Rate', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} onClick={() => setModal(o.id)} style={{ borderBottom: i < orders.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{o.emoji}</div>
                      <strong>{o.token}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: o.receivedColor }}>{o.received}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.paid}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>{o.rate}</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ background: o.payBg, color: o.payColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{o.payment}</span></td>
                  <td style={{ padding: '14px 16px' }}><span style={{ background: o.statusBg, color: o.statusColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{o.statusLabel}</span></td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Showing 5 of 24 orders</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['← Prev', '1', '2', '3', 'Next →'].map((p, i) => (
              <button key={i} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: p === '1' ? '#2563eb' : 'white', color: p === '1' ? 'white' : '#374151', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && selectedOrder && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Order #{selectedOrder.id}</h3>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Token', value: `${selectedOrder.emoji} ${selectedOrder.token}`, color: '#1e293b' },
                { label: 'Amount', value: selectedOrder.received, color: '#059669' },
                { label: 'Paid', value: selectedOrder.paid, color: '#1e293b' },
                { label: 'Status', value: selectedOrder.statusLabel, color: selectedOrder.statusColor },
              ].map(d => (
                <div key={d.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{d.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: d.color }}>{d.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>DESTINATION</div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', color: '#1e293b' }}>7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/instant-buy/status/demo" style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>Track Order</Link>
              <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Download Receipt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
