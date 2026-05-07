'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InstantBuyStatusPage() {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCompleted(true), 4000)
    return () => clearTimeout(t)
  }, [])

  const timelineItems = [
    { label: 'Order Created', sub: 'Quote locked • 0.2348 SOL for 10,135 PKR', time: 'Today, 14:23:08', state: 'done' },
    { label: 'Payment Uploaded', sub: 'JazzCash screenshot submitted', time: 'Today, 14:31:45', state: 'done' },
    { label: 'AI Verifying Payment', sub: 'Checking amount, sender name, timestamp...', time: completed ? 'Today, 14:33:12' : 'In progress...', state: completed ? 'done' : 'active' },
    { label: 'Admin Human Review', sub: 'Mandatory admin verification before release', time: completed ? 'Today, 14:38:05' : 'Pending (SLA: 30 min)', state: completed ? 'done' : 'pending', layer2: true },
    { label: 'Token Release', sub: 'SOL will be sent to your wallet', time: completed ? 'Today, 14:38:12' : 'Pending', state: completed ? 'done' : 'pending' },
    { label: 'Completed', sub: 'SOL confirmed in your wallet', time: completed ? 'Today, 14:38:30' : 'Pending', state: completed ? 'done' : 'pending', last: true },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Instant Buy</Link>
        <div style={{ margin: '0 auto', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Order #IBO-2026-004521</div>
        <Link href="/instant-buy/history" style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none' }}>View History</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Status Hero */}
        {!completed ? (
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Verifying Your Payment</h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '400px', margin: '0 auto 20px' }}>Our AI is checking your payment screenshot. This usually takes 2–5 minutes.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#eff6ff', borderRadius: '10px', padding: '12px 20px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d4ed8' }}>AI Verification in Progress...</span>
            </div>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>0.2348 SOL Sent!</h2>
            <p style={{ opacity: 0.9, fontSize: '15px' }}>Your Solana has been sent to your wallet successfully</p>
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0', wordBreak: 'break-all', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap' }}>TX HASH</span>
              <span style={{ flex: 1 }}>4xKpZHjR2mN8vQwL9sT3uF5bYcDeXaGkPo7WiEs83Hs</span>
              <button style={{ background: '#334155', border: '1px solid #475569', color: '#e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Copy</button>
              <a href="#" style={{ color: '#60a5fa', fontSize: '12px', flexShrink: 0 }}>Explorer →</a>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Order Timeline</h3>
          <div>
            {timelineItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, border: '2px solid',
                    background: item.state === 'done' ? '#059669' : item.state === 'active' ? '#2563eb' : '#f1f5f9',
                    borderColor: item.state === 'done' ? '#059669' : item.state === 'active' ? '#2563eb' : '#e2e8f0',
                    color: item.state === 'pending' ? '#94a3b8' : 'white'
                  }}>
                    {item.state === 'done' ? '✓' : item.state === 'active' ? '🤖' : i + 1}
                  </div>
                  {!item.last && <div style={{ width: '2px', flex: 1, minHeight: '32px', margin: '4px 0', background: item.state === 'done' ? '#059669' : '#e2e8f0' }} />}
                </div>
                <div style={{ paddingBottom: item.last ? 0 : '28px', flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    {item.label}
                    {item.layer2 && <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', padding: '1px 6px', marginLeft: '6px', fontWeight: 700 }}>Layer 2</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{item.sub}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Layer Verification Panel */}
        <div style={{ border: '1.5px solid #bfdbfe', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', fontWeight: 700 }}>
            🔐 Mandatory Two-Layer Payment Verification
            <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
          </div>
          {/* Layer 1 */}
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a5f' }}>Layer 1 — AI Payment Scan</div>
                <div style={{ fontSize: '12px', color: '#3b82f6' }}>Automated OCR + manipulation analysis</div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>⚙️ Running</span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              {[
                { label: 'Amount Match', detail: 'PKR 10,135 detected → matches order', status: 'PASS', done: true },
                { label: 'Recipient Name', detail: '"PakSwap Pvt Ltd" → verified', status: 'PASS', done: true },
                { label: 'Sender Name', detail: '"Muhammad Usman" → matches KYC', status: 'PASS', done: true },
                { label: 'Timestamp Valid', detail: '14:29 within 10-min order window', status: 'PASS', done: true },
                { label: 'Manipulation Detection', detail: 'Analyzing pixel metadata...', status: 'CHECKING', done: false },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.done ? '#d1fae5' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                    {c.done ? '✓' : '↻'}
                  </div>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '14px' }}>{c.label}</span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>{c.detail}</span>
                  <span style={{ background: c.status === 'PASS' ? '#d1fae5' : '#fef3c7', color: c.status === 'PASS' ? '#065f46' : '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, marginLeft: '8px' }}>{c.status}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0 4px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>AI Confidence</span>
                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg,#2563eb,#059669)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap' }}>87%</span>
              </div>
            </div>
          </div>
          {/* Layer 2 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#78350f' }}>Layer 2 — Admin Human Review</div>
                <div style={{ fontSize: '12px', color: '#d97706' }}>Mandatory final check before SOL release</div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>⏳ Awaiting Layer 1</span>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#fffbeb', borderRadius: '10px', marginBottom: '12px', fontSize: '13px', color: '#92400e' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>Token release is <strong>blocked</strong> until a PakSwap admin completes Layer 2 review — regardless of AI confidence score.</span>
              </div>
              <div style={{ fontSize: '13px', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>👤</span> Assigned to next available admin (SLA: 30 min)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔍</span> Admin manually verifies payment before releasing token — applies to all orders, all payment methods</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>📲</span> You will be notified via SMS + app when admin approves</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Order Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Order ID', value: 'IBO-2026-004521', mono: true },
              { label: 'Token', value: '🟣 SOL (Solana)', mono: false },
              { label: 'You Receive', value: '0.2348 SOL', color: '#059669' },
              { label: 'You Paid', value: '10,135 PKR', mono: false },
              { label: 'Rate', value: 'PKR 43,150 / SOL', mono: false },
              { label: 'Provider', value: 'PakSwap Official', mono: false },
            ].map(d => (
              <div key={d.label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{d.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: d.color || '#1e293b', fontFamily: d.mono ? 'monospace' : 'inherit' }}>{d.value}</div>
              </div>
            ))}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Destination Wallet</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', wordBreak: 'break-all' }}>7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/instant-buy/history" style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', color: '#374151', textDecoration: 'none' }}>View Order History</Link>
          <Link href="/instant-buy" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Buy More Crypto</Link>
        </div>
      </div>
    </div>
  )
}
