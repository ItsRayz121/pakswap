'use client'
import { useState } from 'react'
import Link from 'next/link'

type Tab = 'verif' | 'tokens' | 'inventory' | 'deposits' | 'payouts' | 'orders' | 'applications'

const sidebarItems = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '👤', label: 'KYC Queue', href: '#' },
  { icon: '⚡', label: 'Trade Monitor', href: '#' },
  { icon: '⚖️', label: 'Disputes', href: '#' },
  { icon: '👥', label: 'Users', href: '#' },
  { icon: '🚀', label: 'Instant Buy', href: '/admin/instant-buy', active: true },
  { icon: '🚩', label: 'Fraud Monitor', href: '#' },
  { icon: '⚙️', label: 'Settings', href: '#' },
]

const tokens = [
  { icon: '🟡', name: 'BNB', network: 'BSC — BEP-20', spread: '3.0', min: '500', max: '500000', enabled: true },
  { icon: '🔷', name: 'ETH', network: 'Ethereum — ERC-20', spread: '2.5', min: '1000', max: '500000', enabled: true },
  { icon: '🟣', name: 'SOL', network: 'Solana Network', spread: '3.0', min: '500', max: '500000', enabled: true },
  { icon: '💎', name: 'TON', network: 'TON Network', spread: '3.5', min: '500', max: '200000', enabled: true },
  { icon: '🟠', name: 'BTC', network: 'Bitcoin Network', spread: '2.0', min: '2000', max: '500000', enabled: true },
]

export default function AdminInstantBuyPage() {
  const [tab, setTab] = useState<Tab>('verif')
  const [approvedOrder, setApprovedOrder] = useState<string | null>(null)
  const [rejectedOrder, setRejectedOrder] = useState<string | null>(null)
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [providerDetail, setProviderDetail] = useState<any>(null)
  const [providerApproved, setProviderApproved] = useState(false)
  const [payoutSent, setPayoutSent] = useState<Record<string, boolean>>({})
  const [payoutTx, setPayoutTx] = useState<Record<string, string>>({})
  const [tokenSpreads, setTokenSpreads] = useState<Record<string, string>>(
    Object.fromEntries(tokens.map(t => [t.name, t.spread]))
  )

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '9px 18px', borderRadius: '9px', fontSize: '14px', fontWeight: tab === t ? 700 : 500,
    cursor: 'pointer', color: tab === t ? '#1d4ed8' : '#64748b', border: 'none',
    background: tab === t ? 'white' : 'transparent',
    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#1e293b', color: 'white', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: '18px', fontWeight: 800 }}>
          Pak<em>Swap</em> Admin
        </div>
        {sidebarItems.map(item => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
            color: item.active ? 'white' : '#94a3b8', textDecoration: 'none', fontSize: '14px',
            background: item.active ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: item.active ? '3px solid #60a5fa' : '3px solid transparent',
          }}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Instant Buy — Admin Panel</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Manage tokens, inventory, verifications, and orders</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>📥 Export Report</button>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>+ Add Token</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { val: '47', label: 'Orders Today', color: '#1e293b' },
            { val: '41', label: 'Completed', color: '#059669' },
            { val: '3', label: 'Pending Verification', color: '#f59e0b' },
            { val: 'PKR 4.2M', label: 'Volume Today', color: '#1e293b' },
            { val: 'PKR 21,000', label: 'Fee Revenue Today', color: '#2563eb' },
            { val: '1', label: 'Low Inventory Alert', color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button style={tabStyle('verif')} onClick={() => setTab('verif')}>🔍 Verify Queue (3)</button>
          <button style={tabStyle('tokens')} onClick={() => setTab('tokens')}>🪙 Token Config</button>
          <button style={tabStyle('inventory')} onClick={() => setTab('inventory')}>🏦 Inventory</button>
          <button style={tabStyle('deposits')} onClick={() => setTab('deposits')}>
            🔗 Deposit Monitor <span style={{ background: '#3b82f6', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '11px', marginLeft: '4px' }}>4</span>
          </button>
          <button style={tabStyle('payouts')} onClick={() => setTab('payouts')}>
            📤 Manual Payouts <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '11px', marginLeft: '4px' }}>2</span>
          </button>
          <button style={tabStyle('orders')} onClick={() => setTab('orders')}>📋 All Orders</button>
          <button style={tabStyle('applications')} onClick={() => setTab('applications')}>💼 Provider Apps (12)</button>
        </div>

        {/* ===== VERIFY QUEUE ===== */}
        {tab === 'verif' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Manual Review Queue</h3>
              <span style={{ fontSize: '13px', color: '#64748b' }}>SLA: 30 minutes per item</span>
            </div>

            {/* Urgent card */}
            {approvedOrder === 'IBO-004521' ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#059669' }}>Order Approved — SOL Released</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Transaction hash will appear shortly</div>
              </div>
            ) : rejectedOrder === 'IBO-004521' ? (
              <div style={{ background: 'white', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>❌</div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#dc2626' }}>Order Rejected — User Notified</div>
              </div>
            ) : (
              <div style={{ background: '#fff8f8', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>Order #IBO-004521</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Muhammad Usman • 0.2348 SOL • 10,135 PKR</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>⏱️ 12 min remaining</span>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>JazzCash</span>
                  </div>
                </div>

                {/* Screenshot */}
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>Payment Screenshot</div>
                  <div style={{ background: '#e2e8f0', borderRadius: '8px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>
                    📷 Click to view full size
                  </div>
                </div>

                {/* Two-Layer */}
                <div style={{ background: '#f0f7ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', marginBottom: '14px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#dbeafe', borderBottom: '1px solid #bfdbfe' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>🔐 Mandatory Two-Layer Verification</span>
                    <span style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>BOTH REQUIRED BEFORE RELEASE</span>
                  </div>
                  {/* Layer 1 */}
                  <div style={{ borderBottom: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#eff6ff' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>1</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>Layer 1 — AI Scan</div>
                        <div style={{ fontSize: '11px', color: '#3b82f6' }}>Completed automatically</div>
                      </div>
                      <span style={{ marginLeft: 'auto', background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>✓ Done</span>
                    </div>
                    <div style={{ padding: '10px 18px' }}>
                      {[
                        { icon: '✓', cls: '#d1fae5', iconColor: '#059669', text: 'Amount: PKR 10,135 → exact match', badge: 'PASS', badgeColor: '#d1fae5', badgeText: '#065f46' },
                        { icon: '✓', cls: '#d1fae5', iconColor: '#059669', text: 'Recipient: PakSwap Pvt Ltd → verified', badge: 'PASS', badgeColor: '#d1fae5', badgeText: '#065f46' },
                        { icon: '✓', cls: '#d1fae5', iconColor: '#059669', text: 'Sender: Muhammad Usman → KYC match', badge: 'PASS', badgeColor: '#d1fae5', badgeText: '#065f46' },
                        { icon: '✓', cls: '#d1fae5', iconColor: '#059669', text: 'Timestamp 14:29 → within order window', badge: 'PASS', badgeColor: '#d1fae5', badgeText: '#065f46' },
                      ].map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: r.cls, color: r.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>{r.icon}</div>
                          <span>{r.text}</span>
                          <span style={{ marginLeft: 'auto', background: r.badgeColor, color: r.badgeText, padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>{r.badge}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '6px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>!</div>
                        <span style={{ color: '#92400e' }}>Image quality: low resolution (flagged)</span>
                        <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>WARN</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0 4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>Confidence</span>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: '87%', height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', whiteSpace: 'nowrap' }}>87%</span>
                      </div>
                    </div>
                  </div>
                  {/* Layer 2 */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#fffbeb' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>2</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>Layer 2 — Your Human Review</div>
                        <div style={{ fontSize: '11px', color: '#d97706' }}>Mandatory — SOL blocked until you decide</div>
                      </div>
                      <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>YOUR ACTION NEEDED</span>
                    </div>
                    <div style={{ padding: '12px 18px', fontSize: '13px', color: '#78350f', background: '#fffbeb' }}>
                      ⚠️ AI flagged low image quality. <strong>View screenshot above and verify the payment manually</strong> before approving or rejecting.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Admin Notes (required for rejection)</label>
                  <input type="text" placeholder="Note for audit log..." style={{ display: 'block', width: '100%', marginTop: '6px', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => setApprovedOrder('IBO-004521')} style={{ flex: 1, minWidth: '120px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>✅ Approve &amp; Release SOL</button>
                  <button onClick={() => setRejectedOrder('IBO-004521')} style={{ flex: 1, minWidth: '120px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>❌ Reject Order</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>💬 Message User</button>
                </div>
              </div>
            )}

            {/* Normal items */}
            {[
              { id: 'IBO-004518', user: 'Ali Hassan', amount: '0.0023 BTC', pkr: '63,280 PKR', time: '24 min remaining', timeBg: '#d1fae5', timeColor: '#065f46', method: 'Bank Transfer', methodColor: '#7c3aed', ai: 'AI: 78% confidence — 4/5 checks passed, template mismatch flagged' },
              { id: 'IBO-004515', user: 'Sara Malik', amount: '50.5 TON', pkr: '83,830 PKR', time: '28 min remaining', timeBg: '#d1fae5', timeColor: '#065f46', method: 'Easypaisa', methodColor: '#92400e', ai: 'AI: 82% confidence — amount confirmed, sender name partial match (Sara M.)' },
            ].map(item => (
              <div key={item.id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>Order #{item.id}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{item.user} • {item.amount} • {item.pkr}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: item.timeBg, color: item.timeColor }}>✓ {item.time}</span>
                    <span style={{ background: '#ede9fe', color: item.methodColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.method}</span>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '12px' }}>{item.ai}</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '13px' }}>✅ Approve</button>
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '13px' }}>❌ Reject</button>
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>🔍 View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== TOKEN CONFIG ===== */}
        {tab === 'tokens' && (
          <div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#92400e', marginBottom: '16px' }}>
              ⚠️ Changes to fees, spreads, and limits take effect immediately for new quotes. Active quotes are unaffected.
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', display: 'grid', gridTemplateColumns: '50px 1fr auto auto auto auto auto', gap: '16px', padding: '0 20px' }}>
              <span></span><span>Token</span><span>Active</span><span>Spread %</span><span>Min PKR</span><span>Max PKR</span><span>Actions</span>
            </div>
            {tokens.map(t => (
              <div key={t.name} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px 20px', marginBottom: '10px', display: 'grid', gridTemplateColumns: '50px 1fr auto auto auto auto auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ fontSize: '28px' }}>{t.icon}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{t.network}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input type="checkbox" defaultChecked={t.enabled} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: '#2563eb', borderRadius: '24px' }}></span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="number" defaultValue={t.spread} style={{ width: '80px', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>%</span>
                </div>
                <input type="number" defaultValue={t.min} style={{ width: '90px', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
                <input type="number" defaultValue={t.max} style={{ width: '100px', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Save</button>
                  <button style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>History</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== INVENTORY ===== */}
        {tab === 'inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
            {[
              { icon: '🟡', name: 'BNB (BSC)', available: '8.42 BNB', reserved: '0.35 BNB', reservedColor: '#f59e0b', threshold: '2.00 BNB', pct: 80, barColor: 'linear-gradient(90deg,#2563eb,#059669)', badge: 'Healthy', badgeBg: '#d1fae5', badgeColor: '#065f46', alert: null, cardBg: 'white', cardBorder: '#e2e8f0' },
              { icon: '🟠', name: 'BTC', available: '0.00048 BTC', availColor: '#dc2626', reserved: '0.0002 BTC', threshold: null, pct: 15, barColor: '#ef4444', badge: '⚠️ Low', badgeBg: '#fee2e2', badgeColor: '#991b1b', alert: '⚠️ Below alert threshold — replenish now', cardBg: '#fff8f8', cardBorder: '#fca5a5' },
              { icon: '🟣', name: 'SOL', available: '124.5 SOL', reserved: '2.3 SOL', reservedColor: '#f59e0b', threshold: null, pct: 65, barColor: 'linear-gradient(90deg,#2563eb,#059669)', badge: 'Healthy', badgeBg: '#d1fae5', badgeColor: '#065f46', alert: null, cardBg: 'white', cardBorder: '#e2e8f0' },
              { icon: '💎', name: 'TON', available: '1,850 TON', reserved: null, threshold: null, pct: 35, barColor: 'linear-gradient(90deg,#f59e0b,#059669)', badge: '⚠️ Medium', badgeBg: '#fef3c7', badgeColor: '#92400e', alert: null, cardBg: 'white', cardBorder: '#e2e8f0' },
            ].map(inv => (
              <div key={inv.name} style={{ background: inv.cardBg, borderRadius: '14px', border: `1px solid ${inv.cardBorder}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '28px' }}>{inv.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{inv.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>PakSwap Official</div>
                    </div>
                  </div>
                  <span style={{ background: inv.badgeBg, color: inv.badgeColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{inv.badge}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Available</span>
                  <strong style={{ color: inv.availColor }}>{inv.available}</strong>
                </div>
                {inv.reserved && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Reserved (pending)</span>
                    <strong style={{ color: inv.reservedColor }}>{inv.reserved}</strong>
                  </div>
                )}
                {inv.threshold && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b' }}>Alert threshold</span>
                    <span>{inv.threshold}</span>
                  </div>
                )}
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                  <div style={{ width: `${inv.pct}%`, height: '100%', background: inv.barColor, borderRadius: '4px' }}></div>
                </div>
                {inv.alert ? (
                  <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', marginBottom: '12px', fontWeight: 600 }}>{inv.alert}</div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginBottom: '12px' }}>{inv.pct}% capacity</div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {inv.badge.includes('Low') ? (
                    <>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>🚨 Top Up Now</button>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>Disable Token</button>
                    </>
                  ) : (
                    <>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>+ Top Up</button>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>History</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== DEPOSIT MONITOR ===== */}
        {tab === 'deposits' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Crypto Deposit Monitor</h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Live view of all blockchain deposits — auto-refreshes every 10 seconds</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}>
                  <option>All Networks</option><option>TRON / TRC-20</option><option>BSC / BEP-20</option><option>Solana</option><option>Ethereum</option>
                </select>
                <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}>
                  <option>All Status</option><option>Waiting</option><option>Detected</option><option>Confirming</option><option>Confirmed</option><option>Wrong Token</option>
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#166534' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></div>
                  Live
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { n: 7, label: 'Waiting', bg: 'white', border: '#e2e8f0', numColor: '#64748b', lblColor: '#94a3b8' },
                { n: 4, label: 'Confirming', bg: '#dbeafe', border: '#bfdbfe', numColor: '#2563eb', lblColor: '#3b82f6' },
                { n: 18, label: 'Confirmed Today', bg: '#d1fae5', border: '#86efac', numColor: '#059669', lblColor: '#059669' },
                { n: 1, label: 'Wrong Token', bg: '#fee2e2', border: '#fca5a5', numColor: '#dc2626', lblColor: '#dc2626' },
                { n: 2, label: 'Underpaid', bg: '#fef3c7', border: '#fde68a', numColor: '#d97706', lblColor: '#d97706' },
              ].map(p => (
                <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '10px', padding: '10px 16px', textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: p.numColor }}>{p.n}</div>
                  <div style={{ fontSize: '11px', color: p.lblColor, fontWeight: 600 }}>{p.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', gap: '10px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Order / Network</span><span>Token / Amount</span><span>Confirmations</span><span>TX Hash</span><span>Status</span><span>Action</span>
              </div>

              {/* Confirming */}
              {[
                { id: 'IBO-004531', network: '🔴 TRON / TRC-20', user: 'Ahmad Raza', token: '50 USDT', out: '→ 0.0841 BNB out', confs: 14, total: 20, pct: 70, remaining: '~18s remaining', tx: 'a1b2c3d4e5f6...', status: '⚙️ Confirming', statusBg: '#dbeafe', statusColor: '#1d4ed8', rowBg: '#eff6ff' },
                { id: 'IBO-004529', network: '🟡 BSC / BEP-20', user: 'Fatima K.', token: '0.5 BNB', out: '→ 140 USDT out', confs: 12, total: 15, pct: 80, remaining: '~9s remaining', tx: '0x9f8e7d6c5b4a...', status: '⚙️ Confirming', statusBg: '#dbeafe', statusColor: '#1d4ed8', rowBg: '#eff6ff' },
              ].map(row => (
                <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: '10px', fontSize: '13px', background: row.rowBg }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2563eb' }}>{row.id}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{row.network}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>User: {row.user}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{row.token}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{row.out}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2563eb' }}>{row.confs} / {row.total}</div>
                    <div style={{ background: '#e2e8f0', borderRadius: '3px', height: '5px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${row.pct}%`, height: '100%', background: '#2563eb', borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{row.remaining}</div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{row.tx}</div>
                  <span style={{ background: row.statusBg, color: row.statusColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{row.status}</span>
                  <button style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View</button>
                </div>
              ))}

              {/* Waiting */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: '10px', fontSize: '13px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>IBO-004528</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>🟣 Solana</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>User: Ali Hassan</div>
                </div>
                <div><div style={{ fontWeight: 700 }}>50 USDC</div><div style={{ fontSize: '11px', color: '#64748b' }}>→ 0.016 ETH out</div></div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>— / 32<br /><div style={{ fontSize: '11px' }}>No TX yet</div></div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>—</div>
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>⏳ Waiting</span>
                <button style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View</button>
              </div>

              {/* Wrong token */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: '10px', fontSize: '13px', background: '#fff8f8', borderLeft: '3px solid #ef4444' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#dc2626' }}>IBO-004525</div>
                  <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '2px' }}>🟡 BSC / BEP-20</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>User: Sara Malik</div>
                </div>
                <div><div style={{ fontWeight: 700, color: '#dc2626' }}>WRONG TOKEN</div><div style={{ fontSize: '11px', color: '#dc2626' }}>Sent BUSD, expected USDT</div></div>
                <div><div style={{ fontWeight: 700 }}>15 / 15 ✓</div><div style={{ fontSize: '11px', color: '#dc2626' }}>TX confirmed but wrong token</div></div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>0xabcdef1234...</div>
                <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>❌ Wrong Token</span>
                <button style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Resolve</button>
              </div>

              {/* Underpaid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', gap: '10px', fontSize: '13px', background: '#fffbeb', borderLeft: '3px solid #f59e0b' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#d97706' }}>IBO-004522</div>
                  <div style={{ fontSize: '11px', color: '#d97706', marginTop: '2px' }}>🔴 TRON / TRC-20</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>User: Bilal A.</div>
                </div>
                <div><div style={{ fontWeight: 700, color: '#d97706' }}>48.5 USDT</div><div style={{ fontSize: '11px', color: '#d97706' }}>Expected: 50 USDT (underpaid by 1.5)</div></div>
                <div><div style={{ fontWeight: 700, color: '#059669' }}>20/20 ✓</div><div style={{ fontSize: '11px', color: '#d97706' }}>Confirmed but underpaid</div></div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>b2c3d4e5f6a7...</div>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>⚠️ Underpaid</span>
                <button style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #fde68a', background: '#fef3c7', color: '#92400e', cursor: 'pointer', fontSize: '12px' }}>Handle</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MANUAL PAYOUTS ===== */}
        {tab === 'payouts' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Manual Payout Queue</h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Orders where auto-payout failed or was disabled — requires admin to send manually</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>
                ⚠️ SLA: 30 minutes per item
              </div>
            </div>

            {/* Payout 1 */}
            {payoutSent['IBO-004530'] ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center', fontSize: '14px', color: '#059669', fontWeight: 700 }}>
                ✅ Payout marked as sent · User notified · Order closed
              </div>
            ) : (
              <div style={{ background: 'white', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>Order #IBO-004530</div>
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>⚠️ Low Balance</span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>⏱️ 18 min in queue</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Sara Malik · 0.01840 ETH · received 51.5 USDT via BSC</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>ETH hot wallet</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>0.002 ETH (CRITICAL LOW)</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Deposit Confirmed ✓</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><span style={{ color: '#94a3b8' }}>TX:</span> 0x9f8e7d6c5b4a...3f2e</div>
                      <div><span style={{ color: '#94a3b8' }}>Network:</span> BSC BEP-20</div>
                      <div><span style={{ color: '#94a3b8' }}>Amount:</span> <strong style={{ color: '#059669' }}>51.5 USDT ✓</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Confs:</span> 15/15 ✓</div>
                    </div>
                  </div>
                  <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: '8px' }}>Payout Required</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><span style={{ color: '#94a3b8' }}>Send:</span> <strong>0.01840 ETH</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Network:</span> Ethereum ERC-20</div>
                      <div><span style={{ color: '#94a3b8' }}>To wallet:</span> <span style={{ fontFamily: 'monospace' }}>0x742d35...Cc4</span></div>
                      <div><span style={{ color: '#94a3b8' }}>Reason:</span> <strong style={{ color: '#dc2626' }}>Hot wallet low</strong></div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>
                  ⚠️ Auto-payout failed: ETH hot wallet balance (0.002 ETH) below required payout (0.01840 ETH). Please top up hot wallet and send manually, or transfer from warm wallet.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Payout TX Hash <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={payoutTx['IBO-004530'] || ''} onChange={e => setPayoutTx(p => ({ ...p, 'IBO-004530': e.target.value }))} placeholder="0x... paste your outbound transaction hash here" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    if (!payoutTx['IBO-004530']?.trim()) { alert('Please paste the payout TX hash before confirming.'); return; }
                    setPayoutSent(p => ({ ...p, 'IBO-004530': true }));
                  }} style={{ flex: 1, minWidth: '140px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>✅ Mark Payout Sent</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>🏦 Top Up Hot Wallet</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View Order</button>
                </div>
              </div>
            )}

            {/* Payout 2 */}
            {payoutSent['IBO-004518'] ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center', fontSize: '14px', color: '#059669', fontWeight: 700 }}>
                ✅ Payout marked as sent · User notified · Order closed
              </div>
            ) : (
              <div style={{ background: 'white', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>Order #IBO-004518</div>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Large Order Threshold</span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#d1fae5', color: '#065f46' }}>✓ 22 min in queue</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Bilal Ahmed · 0.0023 BTC · received 218 USDT via TRC-20</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Order value</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#d97706' }}>PKR 63,280 (above 50K threshold)</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Deposit Confirmed ✓</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><span style={{ color: '#94a3b8' }}>TX:</span> a1b2c3d4e5f6...7g8h</div>
                      <div><span style={{ color: '#94a3b8' }}>Network:</span> TRON TRC-20</div>
                      <div><span style={{ color: '#94a3b8' }}>Amount:</span> <strong style={{ color: '#059669' }}>218 USDT ✓</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Confs:</span> 20/20 ✓</div>
                    </div>
                  </div>
                  <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '8px' }}>Payout Required</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><span style={{ color: '#94a3b8' }}>Send:</span> <strong>0.0023 BTC</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Network:</span> Bitcoin</div>
                      <div><span style={{ color: '#94a3b8' }}>To wallet:</span> <span style={{ fontFamily: 'monospace' }}>bc1qxy2...k58</span></div>
                      <div><span style={{ color: '#94a3b8' }}>Reason:</span> <strong style={{ color: '#d97706' }}>Manual review threshold</strong></div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#166534', marginBottom: '12px' }}>
                  ✅ Payment verified. Auto-payout was disabled for orders above PKR 50,000. Manually verify user identity before sending BTC.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>BTC Payout TX Hash <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={payoutTx['IBO-004518'] || ''} onChange={e => setPayoutTx(p => ({ ...p, 'IBO-004518': e.target.value }))} placeholder="Paste Bitcoin outbound TXID..." style={{ display: 'block', width: '100%', marginTop: '6px', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    if (!payoutTx['IBO-004518']?.trim()) { alert('Please paste the payout TX hash before confirming.'); return; }
                    setPayoutSent(p => ({ ...p, 'IBO-004518': true }));
                  }} style={{ flex: 1, minWidth: '140px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>✅ Mark Payout Sent</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Verify User</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View Order</button>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px', background: 'white', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
              No more items in queue · 2 resolved today
            </div>
          </div>
        )}

        {/* ===== ALL ORDERS ===== */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
              <input type="text" placeholder="Order ID or user name..." style={{ flex: 1, minWidth: '160px', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
              {['All Status', 'All Tokens', 'All Payment', 'Today'].map((sel, i) => (
                <select key={i} style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}>
                  <option>{sel}</option>
                </select>
              ))}
              <button style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>📥 Export</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { val: '47', label: 'Total Today', bg: 'white', border: '#e2e8f0', vC: '#1e293b', lC: '#64748b' },
                { val: '41', label: 'Completed', bg: '#d1fae5', border: '#86efac', vC: '#065f46', lC: '#064e3b' },
                { val: '3', label: 'Pending Verify', bg: '#fef3c7', border: '#fde68a', vC: '#92400e', lC: '#78350f' },
                { val: '1', label: 'Releasing', bg: '#eff6ff', border: '#bfdbfe', vC: '#1d4ed8', lC: '#1e40af' },
                { val: '2', label: 'Cancelled / Failed', bg: '#fee2e2', border: '#fca5a5', vC: '#991b1b', lC: '#7f1d1d' },
              ].map(p => (
                <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '10px', padding: '9px 16px', fontSize: '13px' }}>
                  <strong style={{ color: p.vC }}>{p.val}</strong> <span style={{ color: p.lC }}>{p.label}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '9px 16px', fontSize: '13px' }}>
                <strong style={{ color: '#059669' }}>PKR 21,000</strong> <span style={{ color: '#064e3b' }}>Fee Revenue Today</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', minWidth: '900px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Order / Time', 'User', 'Token', 'Amount Out', 'PKR / Mode', 'Status', 'Fee', 'Action'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'IBO-004521', time: 'Today 2:29 PM', user: 'Muhammad U.', uid: '#2814', token: '🟣 SOL', net: 'Solana', out: '0.2348 SOL', outC: '#059669', pkr: '10,135 PKR', mode: '📸 JazzCash', statusLabel: '⏳ Verifying', statusBg: '#fef3c7', statusC: '#92400e', fee: '50.7 PKR', btn: 'Review →', btnBg: '#2563eb', rowBg: 'white' },
                    { id: 'IBO-004520', time: 'Today 2:11 PM', user: 'Sara M.', uid: '#2901', token: '🟡 BNB', net: 'BSC BEP-20', out: '0.118 BNB', outC: '#059669', pkr: '10,080 PKR', mode: '📸 Easypaisa', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusC: '#065f46', fee: '50.4 PKR', btn: 'View', btnBg: 'white', rowBg: 'white' },
                    { id: 'IBO-004519', time: 'Today 1:55 PM', user: 'Ali H.', uid: '#3102', token: '💎 TON', net: 'TON Network', out: '301 TON', outC: '#059669', pkr: '50,048 PKR', mode: '🏦 Bank Transfer', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusC: '#065f46', fee: '250.2 PKR', btn: 'View', btnBg: 'white', rowBg: 'white' },
                    { id: 'IBO-004518', time: 'Today 1:48 PM', user: 'Bilal A.', uid: '#3881', token: '🔷 ETH', net: 'ERC-20', out: '0.0023 ETH', outC: '#2563eb', pkr: '218 USDT', mode: '🔗 Crypto Deposit', statusLabel: '⚙️ Releasing', statusBg: '#dbeafe', statusC: '#1d4ed8', fee: '316.1 PKR', btn: 'View', btnBg: 'white', rowBg: '#eff6ff' },
                    { id: 'IBO-004515', time: 'Today 1:22 PM', user: 'Sara Ma.', uid: '#4012', token: '🟣 SOL', net: 'Solana', out: '50.5 SOL', outC: '#059669', pkr: '50 USDT', mode: '🔗 Crypto Deposit', statusLabel: '✓ Completed', statusBg: '#d1fae5', statusC: '#065f46', fee: '280 PKR', btn: 'View', btnBg: 'white', rowBg: 'white' },
                    { id: 'IBO-004508', time: 'Today 11:40 AM', user: 'User #5512', uid: '#5512', token: '🟠 BTC', net: 'Bitcoin', out: '0.00041 BTC', outC: '#94a3b8', pkr: '63,500 PKR', mode: '📸 JazzCash', statusLabel: '✗ Rejected', statusBg: '#fee2e2', statusC: '#991b1b', fee: '0 PKR', btn: 'View', btnBg: 'white', rowBg: '#fff8f8' },
                    { id: 'IBO-004501', time: 'Today 10:08 AM', user: 'Ahmad R.', uid: '#1901', token: '🔷 ETH', net: 'ERC-20', out: '0.0184 ETH', outC: '#ef4444', pkr: '51,500 PKR', mode: '🔗 Crypto Deposit', statusLabel: '⚠️ Payout Failed', statusBg: '#fee2e2', statusC: '#991b1b', fee: '257.5 PKR', btn: 'Resolve →', btnBg: '#dc2626', rowBg: '#fff8f8' },
                  ].map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', background: row.rowBg }}>
                      <td style={{ padding: '12px 14px' }}><div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>{row.id}</div><div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{row.time}</div></td>
                      <td style={{ padding: '12px 14px', fontSize: '13px' }}><div style={{ fontWeight: 600 }}>{row.user}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{row.uid}</div></td>
                      <td style={{ padding: '12px 14px' }}>{row.token}<div style={{ fontSize: '11px', color: '#64748b' }}>{row.net}</div></td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: row.outC }}>{row.out}</td>
                      <td style={{ padding: '12px 14px' }}><div style={{ fontWeight: 600 }}>{row.pkr}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{row.mode}</div></td>
                      <td style={{ padding: '12px 14px' }}><span style={{ background: row.statusBg, color: row.statusC, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{row.statusLabel}</span></td>
                      <td style={{ padding: '12px 14px', fontSize: '13px' }}>{row.fee}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => setOrderDetail(row)} style={{ padding: '6px 12px', borderRadius: '7px', border: row.btnBg === 'white' ? '1px solid #e2e8f0' : 'none', background: row.btnBg, color: row.btnBg === 'white' ? '#374151' : 'white', cursor: 'pointer', fontSize: '12px', fontWeight: row.btnBg !== 'white' ? 600 : 400 }}>{row.btn}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Showing 7 of 47 orders today</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['← Prev', '1', '2', '3', 'Next →'].map(p => (
                  <button key={p} style={{ padding: '6px 12px', borderRadius: '7px', border: p === '1' ? '1px solid #bfdbfe' : '1px solid #e2e8f0', background: p === '1' ? '#eff6ff' : 'white', color: p === '1' ? '#1d4ed8' : '#374151', cursor: 'pointer', fontSize: '13px' }}>{p}</button>
                ))}
              </div>
            </div>

            {/* Order Detail Panel */}
            {orderDetail && (
              <div style={{ marginTop: '20px', background: 'white', borderRadius: '14px', border: '1.5px solid #2563eb', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800 }}>Order {orderDetail.id}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{orderDetail.user} · {orderDetail.token} · {orderDetail.mode}</div>
                  </div>
                  <button onClick={() => setOrderDetail(null)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>← Close</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { val: orderDetail.out, label: 'Crypto Out' },
                    { val: orderDetail.pkr, label: 'PKR Paid', color: '#2563eb' },
                    { val: orderDetail.mode, label: 'Payment Method' },
                    { val: orderDetail.fee, label: 'Platform Fee' },
                    { val: orderDetail.statusLabel, label: 'Status', color: orderDetail.statusC },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Timeline</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      {['Order created — 2:26 PM', 'Payment uploaded — 2:28 PM', 'AI scan completed (87%) — 2:29 PM'].map((ev, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0 }}></div>
                          <span style={{ color: '#64748b' }}>{ev}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', flexShrink: 0 }}></div>
                        <span style={{ color: '#94a3b8' }}>Admin review pending...</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Payment Screenshot</div>
                    <div style={{ background: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '13px', color: '#64748b' }}>📷 Click to view full size</div>
                  </div>
                </div>
                {['completed', 'cancelled', 'rejected'].some(s => orderDetail.statusLabel.toLowerCase().includes(s)) ? (
                  <div style={{ fontSize: '13px', color: '#64748b' }}>This order is closed — no further action required.</div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600 }}>✅ Approve &amp; Release</button>
                    <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600 }}>❌ Reject Order</button>
                    <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>💬 Message User</button>
                    <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>↩ Refund</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== PROVIDER APPLICATIONS ===== */}
        {tab === 'applications' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Instant Buy Provider Applications</h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Review and approve merchants to supply crypto inventory for Instant Buy orders</div>
              </div>
              <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}>
                <option>All Status</option><option>Submitted</option><option>Under Review</option><option>Approved</option><option>Waitlisted</option><option>Rejected</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { n: 8, label: 'Submitted', bg: '#fef3c7', border: '#fde68a', vC: '#92400e', lC: '#78350f' },
                { n: 2, label: 'Under Review', bg: '#dbeafe', border: '#bfdbfe', vC: '#1d4ed8', lC: '#1e40af' },
                { n: 1, label: 'Approved', bg: '#d1fae5', border: '#86efac', vC: '#065f46', lC: '#064e3b' },
                { n: 1, label: 'Waitlisted', bg: '#f1f5f9', border: '#e2e8f0', vC: '#475569', lC: '#64748b' },
              ].map(p => (
                <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '10px', padding: '9px 16px', fontSize: '13px' }}>
                  <strong style={{ color: p.vC }}>{p.n}</strong> <span style={{ color: p.lC }}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* App 1 */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white' }}>B</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>Bilal Traders</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>Ahmed Bilal · Lahore · Applied: 3 days ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟡 BNB</span>
                  <span style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟣 SOL</span>
                  <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>💎 TON</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Est. daily volume</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>200K PKR</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Experience: 2–5 yrs</div>
              </div>
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>⏳ Submitted</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => { setProviderDetail({ name: 'Bilal Traders', person: 'Ahmed Bilal', city: 'Lahore', volume: '200K', tokens: 'BNB, SOL, TON', exp: '2–5 years', status: 'submitted' }); setProviderApproved(false); }} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View Full →</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Approve</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>Waitlist</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reject</button>
              </div>
            </div>

            {/* App 2 */}
            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white' }}>F</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>FastCrypto PK</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>Usman Khan · Karachi · Applied: 1 week ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟡 BNB</span>
                  <span style={{ background: '#ede9fe', border: '1px solid #c4b5fd', color: '#5b21b6', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🔷 ETH</span>
                  <span style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟠 BTC</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Est. daily volume</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>500K PKR</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Experience: 5+ yrs</div>
              </div>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>🔍 Under Review</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => { setProviderDetail({ name: 'FastCrypto PK', person: 'Usman Khan', city: 'Karachi', volume: '500K', tokens: 'BNB, ETH, BTC', exp: '5+ years', status: 'under_review' }); setProviderApproved(false); }} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View Full →</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Approve</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>Waitlist</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reject</button>
              </div>
            </div>

            {/* App 3 — Approved */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white' }}>A</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>Ali Exchange <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, marginLeft: '4px' }}>Active Provider</span></div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>Ali Raza · Islamabad · Approved 2 days ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟡 BNB</span>
                  <span style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166634', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟣 SOL</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Volume since approval</div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#059669' }}>820K PKR</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Commission: PKR 4,100</div>
              </div>
              <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>✓ Approved</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View Profile</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>Inventory</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Revoke</button>
              </div>
            </div>

            {/* App 4 — Waitlisted */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white' }}>P</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#64748b' }}>PK_Crypto</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>Khalid M. · Faisalabad · Applied: 2 weeks ago</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Tokens: USDT only · Est. 100K PKR/day · Experience: &lt;1 year</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Est. daily volume</div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#94a3b8' }}>100K PKR</div>
              </div>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>⏸ Waitlisted</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>View</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Approve Now</button>
                <button style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reject</button>
              </div>
            </div>

            {/* Provider Detail Panel */}
            {providerDetail && (
              <div style={{ marginTop: '20px', background: 'white', borderRadius: '14px', border: '1.5px solid #2563eb', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>{providerDetail.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{providerDetail.person} · {providerDetail.city}</div>
                  </div>
                  <button onClick={() => setProviderDetail(null)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>← Close</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { val: `${providerDetail.volume} PKR`, label: 'Est. Daily Volume', color: '#2563eb' },
                    { val: providerDetail.exp, label: 'Experience' },
                    { val: providerDetail.tokens, label: 'Tokens Offered' },
                    { val: { submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', waitlisted: 'Waitlisted' }[providerDetail.status] || providerDetail.status, label: 'Status', color: { submitted: '#f59e0b', under_review: '#2563eb', approved: '#059669', waitlisted: '#64748b' }[providerDetail.status] },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Business Information</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div><span style={{ color: '#94a3b8' }}>Business Name:</span> <strong>{providerDetail.name}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Owner:</span> <strong>{providerDetail.person}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>City:</span> <strong>{providerDetail.city}</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Phone:</span> <strong>+92 300 1234567</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>Business Type:</span> <strong>Individual Crypto Trader</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>CNIC Verified:</span> <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>✓ Verified</span></div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Inventory Commitment</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div><span style={{ color: '#94a3b8' }}>BNB committed:</span> <strong>10 BNB (~PKR 290,000)</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>SOL committed:</span> <strong>250 SOL (~PKR 240,000)</strong></div>
                      <div><span style={{ color: '#94a3b8' }}>TON committed:</span> <strong>5,000 TON (~PKR 300,000)</strong></div>
                      <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}><span style={{ color: '#94a3b8' }}>Total est. value:</span> <strong style={{ color: '#059669' }}>~PKR 830,000</strong></div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '6px', textTransform: 'uppercase' }}>Applicant Statement</div>
                  <div style={{ fontSize: '13px', color: '#78350f' }}>"I have been trading crypto since 2021. I hold substantial BNB, SOL and TON reserves and can reliably fill Instant Buy orders. I am KYC verified and agree to all platform terms including the two-layer payout verification policy."</div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Supporting Documents</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>🪪 CNIC Copy</button>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>💼 Wallet Balance Proof</button>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px' }}>📄 NTN / Business Registration</button>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Admin Review Notes (internal)</label>
                  <textarea rows={2} placeholder="Notes about this application..." style={{ display: 'block', width: '100%', marginTop: '6px', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => setProviderApproved(true)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600 }}>✅ Approve as Provider</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>⏸ Move to Waitlist</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600 }}>❌ Reject Application</button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>💬 Request More Info</button>
                </div>
                {providerApproved && (
                  <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: '8px', padding: '12px', marginTop: '12px', fontSize: '13px', color: '#065f46' }}>
                    ✅ <strong>Provider approved!</strong> Welcome email sent. Provider can now log in and deposit inventory to start filling orders.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
