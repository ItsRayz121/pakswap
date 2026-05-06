'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const msgs = [
  { from: 'agent', time: '3:45 PM', text: "Thank you for opening this dispute. We're reviewing your evidence. Could you please provide the JazzCash transaction ID?" },
  { from: 'you', time: '3:47 PM', text: 'Transaction ID: JZ2026050500834' },
  { from: 'agent', time: '3:52 PM', text: "Thank you! We've noted the transaction ID and are verifying with JazzCash records. Please allow up to 2 hours for verification." },
]

export default function DisputePage() {
  const [timer, setTimer] = useState(3 * 60 + 22)
  const [input, setInput] = useState('')
  const [chat, setChat] = useState(msgs)

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const timerStr = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')} remaining`

  const send = () => {
    if (!input.trim()) return
    setChat([...chat, { from: 'you', time: 'Now', text: input }])
    setInput('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/orders" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Orders</Link>
          <Link href="/dispute-history" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Disputes</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Dispute Center</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0 }}>Track and manage your trade disputes</p>
          </div>
        </div>

        {/* Active Dispute Card */}
        <div style={{ background: 'white', border: '1.5px solid #ef4444', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>⚖️</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>Dispute #DIS-2026-00088</span>
                  <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🔴 Under Review</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Trade #PKS-2026-00472 · Opened 05 May 2026 · Agent: Ali K.</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#64748b' }}>SLA Response:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>{timerStr}</div>
            </div>
          </div>

          {/* Escrow Banner */}
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>🔒</span>
            <div>
              <div style={{ color: 'white', fontWeight: 700 }}>17.82 USDT Safely Locked in Escrow</div>
              <div style={{ color: '#93c5fd', fontSize: 13 }}>Funds are protected and cannot be moved until dispute is resolved</div>
            </div>
          </div>

          {/* Two-column info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              { title: 'Trade Summary', rows: [['Type', <span key="t" style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>BUY USDT</span>], ['Amount', '17.82 USDT'], ['Paid', '5,000 PKR'], ['Method', <span key="m" style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #86efac', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>JazzCash</span>], ['Seller', 'CryptoKing']] },
              { title: 'Dispute Details', rows: [['Opened by', 'You (Buyer)'], ['Reason', 'Not released'], ['Agent', 'Ali K.'], ['Status', <span key="s" style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Reviewing</span>]] },
            ].map(({ title, rows }) => (
              <div key={title} style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map(([l, v]) => (
                    <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>{l}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Your Evidence</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['📸 payment_proof.jpg', '💬 chat_screenshot.jpg'].map(f => (
                <div key={f} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>{f}</div>
              ))}
              <button style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>+ Add More</button>
            </div>
          </div>

          {/* Chat */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Communication with Support</div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160 }}>
              {chat.map((m, i) => (
                <div key={i} style={{ textAlign: m.from === 'you' ? 'right' : 'left' }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{m.from === 'agent' ? 'Support Agent' : 'You'} · {m.time}</div>
                  <div style={{ background: m.from === 'you' ? '#2563eb' : 'white', color: m.from === 'you' ? 'white' : '#1e293b', border: m.from === 'you' ? 'none' : '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, display: 'inline-block', maxWidth: '80%', textAlign: 'left' }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message to support..." style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              <button onClick={send} style={{ padding: '10px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: '#64748b' }}>Past Disputes</div>
        <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ffffff)', border: '1.5px solid #10b981', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 28 }}>✅</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>Dispute #DIS-2026-00044</span>
                  <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✅ Resolved — In Your Favor</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Trade #PKS-2026-00310 · 10 Apr 2026 · Resolved in 2h 14min</div>
                <div style={{ fontSize: 13, color: '#10b981', marginTop: 4, fontWeight: 600 }}>Decision: 22.50 USDT released to your wallet</div>
              </div>
            </div>
            <button style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600 }}>View Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}
