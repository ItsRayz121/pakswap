'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DisputePage() {
  const [timer, setTimer] = useState(3 * 60 + 22)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  const mm = Math.floor(timer / 60)
  const ss = (timer % 60).toString().padStart(2, '0')

  function sendMsg() {
    if (!msg.trim()) return
    alert(`Message sent to support: "${msg}"`)
    setMsg('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/orders" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Orders</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>Disputes</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Dispute Center</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Track and manage your trade disputes</p>
          </div>
        </div>

        {/* Active Dispute Card */}
        <div style={{ background: 'white', border: '1.5px solid #ef4444', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>⚖️</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>Dispute #DIS-2026-00088</span>
                  <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>🔴 Under Review</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Trade #PKS-2026-00472 · Opened 05 May 2026 · Agent: Ali K.</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>SLA Response:</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b' }}>{mm}:{ss} remaining</div>
            </div>
          </div>

          {/* Escrow banner */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '14px' }}>17.82 USDT Safely Locked in Escrow</div>
              <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '2px' }}>Funds are protected and cannot be moved until dispute is resolved</div>
            </div>
          </div>

          {/* Trade & Dispute summaries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Trade Summary</div>
              <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { l: 'Type', v: 'BUY USDT', badge: true },
                  { l: 'Amount', v: '17.82 USDT', badge: false },
                  { l: 'Paid', v: '5,000 PKR', badge: false },
                  { l: 'Method', v: 'JazzCash', badge: false, pill: true },
                  { l: 'Seller', v: 'CryptoKing', badge: false },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{r.l}</span>
                    {r.badge ? <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{r.v}</span>
                      : r.pill ? <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{r.v}</span>
                      : <strong>{r.v}</strong>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Dispute Details</div>
              <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { l: 'Opened by', v: 'You (Buyer)', badge: false },
                  { l: 'Reason', v: 'Not released', badge: false },
                  { l: 'Agent', v: 'Ali K.', badge: false },
                  { l: 'Status', v: 'Reviewing', badge: true },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{r.l}</span>
                    {r.badge ? <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{r.v}</span>
                      : <strong>{r.v}</strong>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Your Evidence</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['📸 payment_proof.jpg', '💬 chat_screenshot.jpg'].map(f => (
                <div key={f} onClick={() => alert(`Viewing ${f}`)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>{f}</div>
              ))}
              <button onClick={() => alert('File picker would open')} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Add More</button>
            </div>
          </div>

          {/* Chat */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Communication with Support</div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '160px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Support Agent · 3:45 PM</div>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', display: 'inline-block', maxWidth: '80%' }}>Thank you for opening this dispute. We're reviewing your evidence. Could you please provide the JazzCash transaction ID?</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>You · 3:47 PM</div>
                <div style={{ background: '#2563eb', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', display: 'inline-block', maxWidth: '80%' }}>Transaction ID: JZ2026050500834</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Support Agent · 3:52 PM</div>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', display: 'inline-block', maxWidth: '80%' }}>Thank you! We've noted the transaction ID and are verifying with JazzCash records. Please allow up to 2 hours for verification.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Type a message to support..."
                style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              <button onClick={sendMsg} style={{ padding: '11px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>

        {/* Past disputes */}
        <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: '#64748b' }}>Past Disputes</div>
        <div style={{ background: 'white', border: '1.5px solid #10b981', borderRadius: '16px', padding: '20px', background: 'linear-gradient(135deg,#f0fdf4,#ffffff)' as any }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px' }}>✅</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800 }}>Dispute #DIS-2026-00044</span>
                  <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>✅ Resolved — In Your Favor</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Trade #PKS-2026-00310 · 10 Apr 2026 · Resolved in 2h 14min</div>
                <div style={{ fontSize: '13px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>Decision: 22.50 USDT released to your wallet</div>
              </div>
            </div>
            <button onClick={() => alert('Viewing archived dispute')} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>View Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}
