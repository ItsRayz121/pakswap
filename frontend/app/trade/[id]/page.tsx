'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type View = 'buyer' | 'seller-confirm' | 'completed' | 'dispute'

export default function TradePage() {
  const [view, setView] = useState<View>('buyer')
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 32)
  const [proofUploaded, setProofUploaded] = useState(false)
  const [rating, setRating] = useState(0)
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'CryptoKing', text: 'Hi! Please send payment to my JazzCash. Amount must be exact — 5,000 PKR.', time: '3:02 PM', mine: false },
    { sender: 'You', text: 'Okay, sending now via JazzCash.', time: '3:05 PM', mine: true },
    { sender: 'CryptoKing', text: 'Great, I\'ll release as soon as I see the payment ✓', time: '3:06 PM', mine: false },
  ])
  const [copiedNum, setCopiedNum] = useState(false)
  const [copiedAmt, setCopiedAmt] = useState(false)

  useEffect(() => {
    if (view !== 'buyer' && view !== 'seller-confirm') return
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [view])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timerDisplay = `${mins}:${secs < 10 ? '0' : ''}${secs}`
  const timerColor = timeLeft <= 120 ? '#ef4444' : timeLeft <= 300 ? '#f59e0b' : '#1d4ed8'

  const steps = [
    { label: 'Trade Created', sub: 'USDT locked in escrow', done: true, active: false, time: '3:00 PM' },
    { label: 'Escrow Locked', sub: '17.82 USDT secured', done: true, active: false, time: '3:01 PM' },
    { label: 'Send Payment', sub: 'Send PKR via JazzCash now', done: view !== 'buyer', active: view === 'buyer', time: '' },
    { label: 'Payment Confirmed by Seller', sub: '', done: view === 'completed', active: view === 'seller-confirm', time: '' },
    { label: 'USDT Released to Your Wallet', sub: '', done: view === 'completed', active: false, time: '' },
  ]

  const copyText = (val: string, set: (v: boolean) => void) => {
    navigator.clipboard.writeText(val).catch(() => { })
    set(true)
    setTimeout(() => set(false), 2000)
  }

  const sendChat = () => {
    if (!chatMsg.trim()) return
    setMessages(m => [...m, { sender: 'You', text: chatMsg, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), mine: true }])
    setChatMsg('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← Back to Marketplace</Link>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#1e293b' }}>Trade Room</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>Trade:</span>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', background: '#f1f5f9', padding: '4px 10px', borderRadius: 6 }}>#PKS-2026-00472</span>
        </div>
      </nav>

      {/* Status Bar */}
      <div style={{ background: view === 'completed' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderBottom: `2px solid ${view === 'completed' ? '#6ee7b7' : '#93c5fd'}`, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>{view === 'completed' ? '✅' : '🔒'}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: view === 'completed' ? '#065f46' : '#1d4ed8' }}>{view === 'completed' ? 'TRADE COMPLETE — 17.82 USDT CREDITED' : '17.82 USDT LOCKED IN ESCROW'}</div>
              <div style={{ fontSize: 12, color: view === 'completed' ? '#34d399' : '#3b82f6' }}>{view === 'completed' ? 'USDT has been released to your wallet' : 'Your funds are protected — not accessible until trade completes'}</div>
            </div>
          </div>
          {view !== 'completed' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: timerColor, fontFamily: 'monospace' }}>{timerDisplay}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Time remaining</div>
              </div>
              <span style={{ background: view === 'seller-confirm' ? '#fef3c7' : '#dbeafe', color: view === 'seller-confirm' ? '#92400e' : '#1e40af', border: `1px solid ${view === 'seller-confirm' ? '#fde68a' : '#bfdbfe'}`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
                {view === 'dispute' ? '⚖️ Dispute Active' : view === 'seller-confirm' ? '⏳ Waiting for Seller' : '⏳ Waiting for Payment'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Main Panel */}
        <div>
          {/* Step Tracker */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Trade Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: s.done ? '#ecfdf5' : s.active ? '#eff6ff' : '#f8fafc', border: s.active ? '1.5px solid #93c5fd' : '1.5px solid transparent', opacity: !s.done && !s.active ? 0.5 : 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? '#10b981' : s.active ? '#2563eb' : '#e2e8f0', color: s.done || s.active ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.done ? '✓' : i + 1}</div>
                  <div style={{ flex: 1, fontSize: 14 }}><strong>{s.label}</strong>{s.sub && ` — ${s.sub}`}</div>
                  {s.time && <span style={{ fontSize: 12, color: '#64748b' }}>{s.time}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Buyer View */}
          {view === 'buyer' && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 28 }}>💳</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Send Payment Now</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Complete your JazzCash transfer to the details below</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg,#fef9c3,#fef3c7)', border: '1.5px solid #fde68a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚡ Send via JazzCash</div>
                {[['JazzCash Number', '0312-4567890', true], ['Account Name', 'Muhammad Ahmed', false], ['Amount to Send', '5,000 PKR', true]].map(([label, val, hasCopy], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 2 ? 10 : 0 }}>
                    <span style={{ fontSize: 14, color: '#78350f' }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: i === 2 ? 22 : 18, fontWeight: i === 2 ? 900 : 700, color: i === 2 ? '#dc2626' : '#1e293b', fontFamily: i === 0 ? 'monospace' : undefined }}>{val}</span>
                      {hasCopy && <button onClick={() => copyText(val as string, i === 0 ? setCopiedNum : setCopiedAmt)} style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#92400e' }}>{i === 0 ? (copiedNum ? 'Copied ✓' : 'Copy') : (copiedAmt ? 'Copied ✓' : 'Copy')}</button>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
                <strong>⚠️ Important Instructions:</strong>
                <ul style={{ margin: '8px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li>Send EXACTLY <strong>5,000 PKR</strong> — not more, not less</li>
                  <li>Send from your <strong>own registered JazzCash account</strong></li>
                  <li>Do <strong>NOT</strong> include any message or reference</li>
                  <li>Do <strong>NOT</strong> click "I've Paid" until payment is actually sent</li>
                </ul>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Upload Payment Proof <span style={{ color: '#94a3b8', fontWeight: 400 }}>(recommended)</span></div>
                <div onClick={() => setProofUploaded(true)} style={{ border: `2px ${proofUploaded ? 'solid' : 'dashed'} ${proofUploaded ? '#10b981' : '#cbd5e1'}`, borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', background: proofUploaded ? '#ecfdf5' : 'white', transition: 'all 0.2s' }}>
                  {proofUploaded ? <><div style={{ fontSize: 28, marginBottom: 8 }}>✅</div><div style={{ fontWeight: 700, color: '#065f46' }}>Screenshot Uploaded</div><div style={{ fontSize: 12, color: '#6ee7b7', marginTop: 4 }}>jazzcash_payment.jpg · 1.2MB</div></> : <><div style={{ fontSize: 32, marginBottom: 8 }}>📱</div><div style={{ fontWeight: 700, fontSize: 14 }}>Upload JazzCash Screenshot</div><div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Click to upload · PNG, JPG · Max 10MB</div></>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setView('dispute')} style={{ padding: '12px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>⚖️ Open Dispute</button>
                <button onClick={() => setView('seller-confirm')} style={{ flex: 1, padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>✅ I've Paid — Notify Seller</button>
              </div>
            </div>
          )}

          {/* Seller Confirm View */}
          {view === 'seller-confirm' && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 28 }}>🔔</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}>Payment Claimed by Buyer</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Both verification layers must pass before releasing USDT</div>
                </div>
              </div>

              {/* Two-Layer Box */}
              <div style={{ border: '2px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>🔐 Payment Verification — Both Layers Required</span>
                  <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>MANDATORY</span>
                </div>

                {/* Layer 1 AI */}
                <div style={{ background: '#f0f9ff', borderBottom: '1px solid #e2e8f0', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>1</div>
                    <div><div style={{ fontWeight: 800 }}>AI Payment Scan</div><div style={{ fontSize: 12, color: '#3b82f6' }}>Auto-scanned buyer's screenshot</div></div>
                    <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>✓ AI Passed</span>
                  </div>
                  {[['Amount', 'Detected: PKR 5,000 · Expected: PKR 5,000', 'MATCH'], ['Recipient', '"Muhammad Ahmed" matches your registered JazzCash name', 'MATCH'], ['Sender', "Buyer's registered account name detected", 'MATCH'], ['Timestamp', '3:12 PM · within active trade window', 'VALID'], ['Image manipulation', 'No editing artifacts or metadata anomalies', 'CLEAN']].map(([k, v, badge]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <div style={{ flex: 1 }}><strong>{k}</strong> — {v}</div>
                      <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{badge}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>AI Confidence</span>
                    <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 8 }}><div style={{ width: '96%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 4, height: 8 }} /></div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#059669' }}>96%</span>
                  </div>
                </div>

                {/* Layer 2 Human */}
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>2</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>Your Manual Confirmation <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>YOU MUST DO THIS</span></div>
                      <div style={{ fontSize: 12, color: '#92400e' }}>Open your JazzCash app and verify the payment yourself</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>⏳ Awaiting You</span>
                  </div>
                  <div style={{ background: '#fffbeb', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#92400e' }}>
                    ⚠️ <strong>AI has passed this payment — but YOU must still verify independently.</strong><br />Open your JazzCash app right now and confirm PKR 5,000 has arrived.
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>What to check in your JazzCash app:</div>
                    {['Amount received = exactly 5,000 PKR', 'Transaction time is after 3:00 PM today', "Sender name matches the buyer's KYC name", 'Payment is NOT pending — it must be completed'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ width: 22, height: 22, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>{i + 1}</span>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: 10, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13, cursor: 'pointer', border: '1.5px solid #cbd5e1' }}>
                    📸 payment_proof.jpg — Click to view full size
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setView('dispute')} style={{ padding: '12px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>⚖️ Not Received — Dispute</button>
                <button onClick={() => setView('completed')} style={{ flex: 1, padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>✅ Verified in App — Release USDT</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>By clicking Release, you confirm you have verified payment in your own JazzCash/bank app.</div>
            </div>
          )}

          {/* Completed View */}
          {view === 'completed' && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#10b981', marginBottom: 8 }}>Trade Complete!</div>
              <div style={{ fontSize: 16, color: '#374151', marginBottom: 4 }}>17.82 USDT credited to your wallet</div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Trade completed in 14 minutes</div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
                {[['Order ID', '#PKS-2026-00472'], ['Amount Received', '17.82 USDT'], ['Paid', '5,000 PKR'], ['Rate', '280.50 PKR/USDT'], ['Merchant', 'CryptoKing']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                    <span>{k}</span>
                    <strong style={{ color: k === 'Amount Received' ? '#26a17b' : undefined }}>{v}</strong>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Rate Your Experience</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontSize: 36 }}>
                  {[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => setRating(n)} style={{ cursor: 'pointer', color: n <= rating ? '#f59e0b' : '#94a3b8' }}>{n <= rating ? '★' : '☆'}</span>)}
                </div>
                <input type="text" placeholder="Leave a comment for CryptoKing (optional)" style={{ marginTop: 12, width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/wallet" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View Wallet</button></Link>
                <Link href="/marketplace" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>New Trade</button></Link>
              </div>

              <div style={{ marginTop: 16, background: '#ecfdf5', borderRadius: 10, padding: 14, fontSize: 14 }}>
                🎁 <strong>Refer a friend and earn 500 PKR!</strong>
                <Link href="/referral"><button style={{ marginLeft: 8, padding: '6px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Share Link</button></Link>
              </div>
            </div>
          )}

          {/* Dispute View */}
          {view === 'dispute' && (
            <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #ef4444', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 28 }}>⚖️</div>
                <div><div style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>Dispute Opened</div><div style={{ fontSize: 13, color: '#64748b' }}>Dispute ID: DIS-2026-00089 · Agent assigned</div></div>
              </div>
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#991b1b' }}>
                🔒 USDT remains safely locked in escrow while dispute is under review. SLA: 4 hours.
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                {[['Status', '🔴 Under Review'], ['Agent', 'Support Agent Ali K.'], ['Expected Resolution', 'Within 4 hours']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                    <span style={{ color: '#64748b' }}>{k}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Your dispute agent will review evidence and contact both parties. Keep checking this chat.</div>
              <button onClick={() => setView('buyer')} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back to Trade</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Trade Summary */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Trade Summary</div>
            {[['Type', <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>BUY USDT</span>], ['Amount', <strong style={{ color: '#26a17b' }}>17.82 USDT</strong>], ['You Pay', <strong>5,000 PKR</strong>], ['Rate', <strong>280.50 PKR/USDT</strong>], ['Fee', <strong style={{ color: '#10b981' }}>0% (Free)</strong>], ['Method', <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>⚡ JazzCash</span>]].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', fontSize: 14 }}>
                <span style={{ color: '#64748b' }}>{k}</span>{v}
              </div>
            ))}
          </div>

          {/* Merchant */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Trading With</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>C</div>
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>CryptoKing</div><div style={{ fontSize: 12, color: '#64748b' }}>👑 Verified Merchant</div></div>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /><span style={{ fontSize: 12, color: '#64748b' }}>Online</span></span>
            </div>
            {[['Rating', '★★★★★ 4.9'], ['Total Trades', '1,240'], ['Completion', '99.2%'], ['Avg Release', '⚡ 4 min']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>{k}</span><strong style={{ color: k === 'Completion' ? '#10b981' : undefined }}>{v}</strong>
              </div>
            ))}
            <Link href="/merchant"><button style={{ width: '100%', marginTop: 12, padding: '8px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white' }}>View Full Profile</button></Link>
          </div>

          {/* Chat */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontSize: 14, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              💬 Trade Chat<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>All messages are recorded</span>
            </div>
            <div style={{ height: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: '#f8fafc' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Trade started · 3:00 PM</div>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ background: m.mine ? '#2563eb' : 'white', color: m.mine ? 'white' : '#1e293b', border: m.mine ? 'none' : '1px solid #e2e8f0', borderRadius: m.mine ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '8px 12px', fontSize: 13, maxWidth: '80%' }}>{m.text}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{m.mine ? 'You' : m.sender} · {m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none' }} />
              <button onClick={sendChat} style={{ padding: '8px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send</button>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            🛡️ <strong>Security reminder:</strong> PakSwap will NEVER ask for your password, 2FA code, or to cancel a trade. If someone is pressuring you, open a dispute immediately.
          </div>
        </div>
      </div>
    </div>
  )
}
