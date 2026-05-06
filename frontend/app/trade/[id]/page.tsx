'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type View = 'buyer' | 'seller' | 'completed' | 'dispute'

export default function TradePage() {
  const [view, setView] = useState<View>('buyer')
  const [timer, setTimer] = useState(872) // 14:32
  const [proofUploaded, setProofUploaded] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { from: 'seller', name: 'CryptoKing', text: 'Hi! Please send payment to my JazzCash. Amount must be exact — 5,000 PKR.', time: '3:02 PM' },
    { from: 'buyer', text: 'Okay, sending now via JazzCash.', time: '3:05 PM' },
    { from: 'seller', name: 'CryptoKing', text: 'Great, I\'ll release as soon as I see the payment ✓', time: '3:06 PM' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (view === 'completed' || view === 'dispute') return
    const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [view])

  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(timer % 60).padStart(2, '0')
  const timerColor = timer < 120 ? '#dc2626' : timer < 300 ? '#f59e0b' : '#1d4ed8'

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages(m => [...m, { from: 'buyer', text: chatInput, time: 'Now' }])
    setChatInput('')
  }

  const steps = [
    { label: 'Trade Created', sub: 'USDT locked in escrow', done: true, time: '3:00 PM' },
    { label: 'Escrow Locked', sub: '17.82 USDT secured', done: true, time: '3:01 PM' },
    { label: 'Send Payment', sub: 'Send PKR via JazzCash now', active: view === 'buyer' },
    { label: 'Payment Confirmed by Seller', sub: '', inactive: view === 'buyer' },
    { label: 'USDT Released to Your Wallet', sub: '', inactive: view !== 'completed' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '12px' }}>
        <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>← Back to Marketplace</Link>
        <div style={{ marginLeft: '4px', fontWeight: 800, fontSize: '16px', color: '#1e293b' }}>Trade Room</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Trade:</span>
          <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>#PKS-2026-00472</span>
        </div>
      </nav>

      {/* Status Bar */}
      {view !== 'completed' && (
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderBottom: '2px solid #93c5fd', padding: '14px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>🔒</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#1d4ed8' }}>17.82 USDT LOCKED IN ESCROW</div>
                <div style={{ fontSize: '12px', color: '#3b82f6' }}>Your funds are protected — not accessible until trade completes</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: timerColor }}>{mins}:{secs}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Time remaining</div>
              </div>
              <span style={{ background: view === 'dispute' ? '#fee2e2' : '#fef3c7', color: view === 'dispute' ? '#991b1b' : '#92400e', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                {view === 'dispute' ? '⚖️ Dispute Open' : view === 'seller' ? '🔔 Payment Claimed' : '⏳ Waiting for Payment'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Main Panel */}
        <div>
          {/* Progress Steps */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Trade Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: s.done ? '#ecfdf5' : s.active ? '#eff6ff' : '#f8fafc', border: s.active ? '1.5px solid #93c5fd' : '1.5px solid transparent', opacity: s.inactive ? 0.5 : 1, fontSize: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 700, background: s.done ? '#10b981' : s.active ? '#2563eb' : '#e2e8f0', color: s.done || s.active ? 'white' : '#94a3b8' }}>
                    {s.done ? '✓' : i + 1}
                  </div>
                  <div><strong>{s.label}</strong>{s.sub ? ` — ${s.sub}` : ''}</div>
                  {s.time && <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>{s.time}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Buyer View */}
          {view === 'buyer' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px' }}>💳</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>Send Payment Now</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Complete your JazzCash transfer to the details below</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg,#fef9c3,#fef3c7)', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚡ Send via JazzCash</div>
                {[
                  { label: 'JazzCash Number', val: '0312-4567890', mono: true, copyable: true },
                  { label: 'Account Name', val: 'Muhammad Ahmed', mono: false },
                  { label: 'Amount to Send', val: '5,000 PKR', bold: true, red: true, copyable: true, copyVal: '5000' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#78350f' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: item.red ? '22px' : '18px', fontWeight: item.red ? 900 : 700, color: item.red ? '#dc2626' : '#1e293b', fontFamily: item.mono ? 'monospace' : 'inherit' }}>{item.val}</span>
                      {item.copyable && <button style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#92400e' }}>Copy</button>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
                <strong>⚠️ Important Instructions:</strong>
                <ul style={{ margin: '8px 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Send EXACTLY <strong>5,000 PKR</strong> — not more, not less</li>
                  <li>Send from your <strong>own registered JazzCash account</strong> (name must match KYC)</li>
                  <li>Do <strong>NOT</strong> include any message or reference</li>
                  <li>Do <strong>NOT</strong> click "I've Paid" until payment is actually sent</li>
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Upload Payment Proof <span style={{ color: '#94a3b8', fontWeight: 400 }}>(recommended)</span></div>
                <div onClick={() => setProofUploaded(true)} style={{ border: `2px ${proofUploaded ? 'solid #10b981' : 'dashed #cbd5e1'}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: proofUploaded ? '#ecfdf5' : 'white', transition: 'all 0.2s' }}>
                  {proofUploaded ? (
                    <><div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div><div style={{ fontWeight: 700, fontSize: '14px', color: '#065f46' }}>Screenshot Uploaded</div></>
                  ) : (
                    <><div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div><div style={{ fontWeight: 700, fontSize: '14px' }}>Upload JazzCash Screenshot</div><div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Click to upload · PNG, JPG · Max 10MB</div></>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setView('dispute')} style={{ padding: '12px 20px', borderRadius: '10px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600 }}>⚖️ Open Dispute</button>
                <button onClick={() => setView('seller')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>✅ I've Paid — Notify Seller</button>
              </div>
            </div>
          )}

          {/* Seller Confirm View */}
          {view === 'seller' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px' }}>🔔</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>Payment Claimed by Buyer</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Both verification layers must pass before releasing USDT</div>
                </div>
              </div>

              {/* Two-Layer Box */}
              <div style={{ background: '#f0f7ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#dbeafe', borderBottom: '1px solid #bfdbfe' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>🔐 Payment Verification — Both Layers Required</span>
                  <span style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>MANDATORY</span>
                </div>

                {/* Layer 1 */}
                <div style={{ borderBottom: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#eff6ff' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>1</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>AI Payment Scan</div>
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>Auto-scanned buyer's screenshot</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>✓ AI Passed</span>
                  </div>
                  <div style={{ padding: '10px 18px' }}>
                    {[
                      ['Amount', 'Detected: PKR 5,000 · Expected: PKR 5,000', 'MATCH'],
                      ['Recipient', '"Muhammad Ahmed" matches your registered JazzCash name', 'MATCH'],
                      ['Sender', "Buyer's registered account name detected", 'MATCH'],
                      ['Timestamp', '3:12 PM · within active trade window', 'VALID'],
                      ['Image manipulation', 'No editing artifacts or metadata anomalies', 'CLEAN'],
                    ].map(([label, detail, badge]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</div>
                        <div style={{ flex: 1 }}><strong>{label}</strong> — {detail}</div>
                        <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>{badge}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0 4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>AI Confidence</span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '96%', height: '100%', background: '#059669', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669', whiteSpace: 'nowrap' }}>96%</span>
                    </div>
                  </div>
                </div>

                {/* Layer 2 */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#fffbeb' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>2</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>Your Manual Confirmation <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, marginLeft: '6px' }}>YOU MUST DO THIS</span></div>
                      <div style={{ fontSize: '12px', color: '#92400e' }}>Open your JazzCash app and verify the payment yourself</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>⏳ Awaiting You</span>
                  </div>
                  <div style={{ padding: '14px 18px', background: '#fffbeb' }}>
                    <div style={{ background: '#fff3cd', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', fontSize: '13px', color: '#92400e' }}>
                      ⚠️ <strong>AI has passed this payment — but YOU must still verify independently.</strong><br />
                      Open your JazzCash app right now and confirm PKR 5,000 has arrived. Do NOT release based on the screenshot alone.
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>What to check in your JazzCash app:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['Amount received = exactly 5,000 PKR', 'Transaction time is after 3:00 PM today', "Sender name matches the buyer's KYC name", 'Payment is NOT pending — it must be completed'].map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                            <span style={{ width: '22px', height: '22px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>{i + 1}</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Buyer's screenshot (for reference only — verify in your app):</div>
                      <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', cursor: 'pointer', border: '1.5px solid #cbd5e1' }}>📸 payment_proof.jpg — Click to view full size</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setView('dispute')} style={{ padding: '12px 20px', borderRadius: '10px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600 }}>⚖️ Not Received — Dispute</button>
                <button onClick={() => setView('completed')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>✅ Verified in App — Release USDT</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>By clicking Release, you confirm you have verified payment in your own JazzCash/bank app.</div>
            </div>
          )}

          {/* Completed View */}
          {view === 'completed' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#10b981', marginBottom: '8px' }}>Trade Complete!</div>
              <div style={{ fontSize: '16px', color: '#374151', marginBottom: '4px' }}>17.82 USDT credited to your wallet</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Trade completed in 14 minutes</div>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
                {[
                  ['Order ID', '#PKS-2026-00472'],
                  ['Amount Received', '17.82 USDT', '#26a17b'],
                  ['Paid', '5,000 PKR'],
                  ['Rate', '280.50 PKR/USDT'],
                  ['Merchant', 'CryptoKing'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                    <span>{label}</span><strong style={{ color: color as string }}>{val}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Rate Your Experience</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '36px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} onClick={() => setRating(i)} style={{ cursor: 'pointer' }}>{i <= rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <input type="text" placeholder="Leave a comment for CryptoKing (optional)" style={{ marginTop: '12px', width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <Link href="/wallet" style={{ flex: 1 }}><button style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>View Wallet</button></Link>
                <Link href="/marketplace" style={{ flex: 1 }}><button style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>New Trade</button></Link>
              </div>
              <div style={{ background: '#ecfdf5', borderRadius: '10px', padding: '14px', fontSize: '13px' }}>
                🎁 <strong>Refer a friend and earn 500 PKR!</strong>
                <Link href="/referral"><button style={{ marginLeft: '8px', padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Share Link</button></Link>
              </div>
            </div>
          )}

          {/* Dispute Panel */}
          {view === 'dispute' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #ef4444', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px' }}>⚖️</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>Dispute Opened</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Dispute ID: DIS-2026-00089 · Agent assigned</div>
                </div>
              </div>
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#991b1b' }}>
                🔒 USDT remains safely locked in escrow while dispute is under review. SLA: 4 hours.
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                {[['Status', '🔴 Under Review', true], ['Agent', 'Support Agent Ali K.'], ['Expected Resolution', 'Within 4 hours']].map(([label, val, badge]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>{label}</span>
                    {badge ? <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{val}</span> : <strong>{val}</strong>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Your dispute agent will review evidence and contact both parties. Keep checking this chat.</div>
              <button onClick={() => setView('buyer')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>← Back to Trade</button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Trade Summary */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Trade Summary</div>
            {[
              ['Type', 'BUY USDT', 'badge'],
              ['Amount', '17.82 USDT', 'green'],
              ['You Pay', '5,000 PKR'],
              ['Rate', '280.50 PKR/USDT'],
              ['Fee', '0% (Free)', 'green2'],
              ['Method', '⚡ JazzCash', 'pill'],
            ].map(([label, val, style]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                {style === 'badge' ? <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{val}</span> :
                 style === 'green' ? <strong style={{ color: '#26a17b' }}>{val}</strong> :
                 style === 'green2' ? <strong style={{ color: '#10b981' }}>{val}</strong> :
                 style === 'pill' ? <span style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{val}</span> :
                 <strong>{val}</strong>}
              </div>
            ))}
          </div>

          {/* Merchant Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Trading With</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px' }}>C</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px' }}>CryptoKing</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>👑 Verified Merchant</div>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '4px' }}></span>Online</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Rating</span><strong>★★★★★ 4.9</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Trades</span><strong>1,240</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Completion</span><strong style={{ color: '#10b981' }}>99.2%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Avg Release</span><strong>⚡ 4 min</strong></div>
            </div>
            <Link href="/merchant/cryptoking"><button style={{ width: '100%', marginTop: '12px', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View Full Profile</button></Link>
          </div>

          {/* Chat */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              💬 Trade Chat
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>All messages are recorded</span>
            </div>
            <div style={{ height: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Trade started · 3:00 PM</div>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'buyer' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: msg.from === 'buyer' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.from === 'buyer' ? '#2563eb' : 'white', color: msg.from === 'buyer' ? 'white' : '#1e293b', fontSize: '13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>{msg.text}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{msg.from === 'buyer' ? `You · ${msg.time}` : `${msg.name} · ${msg.time}`}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type a message..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
              <button onClick={sendChat} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Send</button>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
            🛡️ <strong>Security reminder:</strong> PakSwap will NEVER ask for your password, 2FA code, or to cancel a trade. If someone is pressuring you, open a dispute immediately.
          </div>
        </div>
      </div>
    </div>
  )
}
