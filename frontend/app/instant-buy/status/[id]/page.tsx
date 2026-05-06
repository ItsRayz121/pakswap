'use client'
import { useState } from 'react'
import Link from 'next/link'

type State = 'verifying' | 'completed'

const timelineSteps = [
  { title: 'Order Created', sub: 'Quote locked • 0.2348 SOL for 10,135 PKR', time: 'Today, 14:23:08', done: true, active: false },
  { title: 'Payment Uploaded', sub: 'JazzCash screenshot submitted', time: 'Today, 14:31:45', done: true, active: false },
  { title: 'AI Verifying Payment', sub: 'Checking amount, sender name, timestamp...', time: 'In progress...', done: false, active: true },
  { title: 'Admin Human Review', sub: 'Mandatory admin verification before release', time: 'Pending (SLA: 30 min)', done: false, active: false, layer2: true },
  { title: 'Token Release', sub: 'SOL will be sent to your wallet', time: 'Pending', done: false, active: false },
  { title: 'Completed', sub: 'SOL confirmed in your wallet', time: 'Pending', done: false, active: false },
]

const aiChecks = [
  { label: 'Amount Match', detail: 'PKR 10,135 detected → matches order' },
  { label: 'Recipient Name', detail: '"PakSwap Pvt Ltd" → verified' },
  { label: 'Sender Name', detail: '"Muhammad Usman" → matches KYC' },
  { label: 'Timestamp Valid', detail: 'Payment time within order window' },
  { label: 'Image Integrity', detail: 'No editing artifacts detected' },
]

export default function InstantBuyStatusPage() {
  const [state, setState] = useState<State>('verifying')
  const [copied, setCopied] = useState(false)

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/instant-buy" style={{ fontSize: 16, color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>← Instant Buy</Link>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Order #IBO-2026-004521</div>
        <Link href="/instant-buy/history"><button style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View History</button></Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        {/* Demo Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['verifying', 'completed'] as State[]).map(s => (
            <button key={s} onClick={() => setState(s)} style={{ padding: '6px 14px', border: `1.5px solid ${state === s ? '#2563eb' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: state === s ? '#eff6ff' : 'white', color: state === s ? '#1d4ed8' : '#374151' }}>View: {s}</button>
          ))}
        </div>

        {/* Status Hero */}
        {state === 'verifying' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32, marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, margin: '0 0 8px' }}>Verifying Your Payment</h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400, margin: '0 auto 20px' }}>Our AI is checking your payment screenshot. This usually takes 2–5 minutes.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#eff6ff', borderRadius: 10, padding: '12px 20px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563eb', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>AI Verification in Progress...</span>
            </div>
          </div>
        )}

        {state === 'completed' && (
          <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, margin: '0 0 8px' }}>0.2348 SOL Sent!</h2>
            <p style={{ opacity: 0.9, fontSize: 15 }}>Your Solana has been sent to your wallet successfully</p>
            <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', wordBreak: 'break-all', marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' }}>TX HASH</span>
              <span style={{ flex: 1 }}>4xKpZHjR2mN8vQwL9sT3uF5bYcDeXaGkPo7WiEs83Hs</span>
              <button onClick={() => copy('4xKpZHjR2mN8vQwL9sT3uF5bYcDeXaGkPo7WiEs83Hs')} style={{ background: '#334155', border: '1px solid #475569', color: '#e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>{copied ? '✓' : 'Copy'}</button>
              <a href="#" style={{ color: '#60a5fa', fontSize: 12, flexShrink: 0 }}>Explorer →</a>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timelineSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s.active ? 16 : 14, flexShrink: 0, background: s.done ? '#059669' : s.active ? '#2563eb' : '#f1f5f9', color: s.done || s.active ? 'white' : '#94a3b8', border: `2px solid ${s.done ? '#059669' : s.active ? '#2563eb' : '#e2e8f0'}` }}>
                    {s.done ? '✓' : s.active ? '🤖' : i + 1}
                  </div>
                  {i < timelineSteps.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 32, margin: '4px 0', background: s.done ? '#059669' : '#e2e8f0' }} />}
                </div>
                <div style={{ paddingBottom: 28, flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    {s.title}
                    {s.layer2 && <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', borderRadius: 4, padding: '1px 6px', marginLeft: 4, fontWeight: 700 }}>Layer 2</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{s.sub}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace' }}>{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Layer Panel */}
        <div style={{ border: '2px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>🔐 Mandatory Two-Layer Payment Verification</span>
            <span style={{ background: '#ef4444', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
          </div>

          {/* Layer 1 */}
          <div style={{ background: '#f0f9ff', borderBottom: '1px solid #e2e8f0', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>1</div>
              <div><div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>Layer 1 — AI Payment Scan</div><div style={{ fontSize: 12, color: '#3b82f6' }}>Automated OCR + manipulation analysis</div></div>
              <span style={{ marginLeft: 'auto', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>⚙️ Running</span>
            </div>
            {aiChecks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < aiChecks.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{c.detail}</div>
                </div>
                <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>PASS</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>AI Confidence</span>
              <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 8 }}><div style={{ width: '94%', background: 'linear-gradient(90deg,#2563eb,#059669)', borderRadius: 4, height: 8 }} /></div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#059669' }}>94%</span>
            </div>
          </div>

          {/* Layer 2 */}
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>2</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Layer 2 — Admin Human Review</div>
                <div style={{ fontSize: 12, color: '#92400e' }}>Manual verification by PakSwap compliance team</div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>⏳ Queued</span>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#92400e' }}>
              ⏱️ <strong>SLA: 30 minutes.</strong> An admin will manually verify your payment evidence. You'll be notified when approved. USDT will NOT be released without this step.
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Order Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Order ID', 'IBO-2026-004521'], ['Token', 'SOL — Solana'], ['Amount', '0.2348 SOL'], ['Paid', '10,135 PKR'], ['Rate', 'PKR 43,150 / SOL'], ['Method', 'JazzCash'], ['Wallet', '7EcDh...LtV'], ['Created', 'Today, 14:23']].map(([l, v]) => (
              <div key={l} style={{ background: '#f8fafc', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {state === 'completed' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/wallet" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View Wallet</button></Link>
            <Link href="/instant-buy" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>New Order</button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
