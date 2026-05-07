'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Step = 'waiting' | 'detected' | 'confirming' | 'confirmed' | 'complete'

export default function InstantBuyCryptoDepositPage() {
  const [timer, setTimer] = useState(14 * 60 + 52)
  const [step, setStep] = useState<Step>('waiting')
  const [confs, setConfs] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep('detected')
      let c = 0
      const iv = setInterval(() => {
        c += 2
        if (c >= 20) { c = 20; clearInterval(iv); setStep('complete'); setTimeout(() => setShowOverlay(true), 2000) }
        setConfs(c)
        if (c > 0 && c < 20) setStep('confirming')
      }, 400)
    }, 5000)
    return () => clearTimeout(t1)
  }, [])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function copyAddr() {
    navigator.clipboard?.writeText('TEJmxFDfWCPnRbXZovbWzRLVCZTF5y6aLq')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stepsDone = (n: number) => {
    if (step === 'waiting') return false
    if (step === 'detected') return n <= 1
    if (step === 'confirming') return n <= 2
    return true
  }
  const stepActive = (n: number) => {
    if (step === 'waiting') return n === 1
    if (step === 'detected') return n === 2
    if (step === 'confirming') return n === 2
    if (step === 'complete') return n === 4
    return false
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Instant Buy</Link>
        <div style={{ margin: '0 auto', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Send USDT · #IBO-2026-004531</div>
        <Link href="/instant-buy/history" style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none' }}>My Orders</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: '20px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Order #IBO-2026-004531 · Crypto Payment</div>
          <div style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Send USDT to Receive BNB</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['💵 Pay: 50 USDT (TRC-20)', '🟡 Receive: 0.0841 BNB', '📊 Rate: 1 BNB = 595.0 USDT'].map(m => (
              <div key={m} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600 }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div style={{ background: 'white', borderRadius: '16px', border: '2px solid #fde68a', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#fef3c7,#fde68a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 900, color: timer < 180 ? '#dc2626' : '#92400e', lineHeight: 1 }}>{mm}:{ss}</div>
            <div style={{ fontSize: '9px', color: '#d97706', fontWeight: 600, textTransform: 'uppercase' }}>remaining</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#92400e' }}>Order expires in 15 minutes</div>
            <div style={{ fontSize: '13px', color: '#d97706', marginTop: '3px' }}>Send <strong>exactly</strong> the amount shown. Do NOT send more or less. Order is cancelled after expiry.</div>
          </div>
        </div>

        {/* Deposit Address Card */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1.5px solid #2563eb', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 700, color: '#1d4ed8', marginBottom: '12px' }}>
            🔴 TRON / TRC-20 Network · 20 confirmations required
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '8px' }}>Send your USDT to this deposit address</div>
          <div style={{ background: '#f8fafc', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#1e293b', wordBreak: 'break-all', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1, lineHeight: 1.6 }}>TEJmxFDfWCPnRbXZovbWzRLVCZTF5y6aLq</div>
            <button onClick={copyAddr} style={{ background: copied ? '#059669' : '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: copied ? 'white' : '#2563eb', cursor: 'pointer', flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>ℹ️ This address is unique to your order and expires when the order expires.</div>

          <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '2px solid #86efac', borderRadius: '14px', padding: '18px 20px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>EXACT Amount to Send</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#166534' }}>50.000000</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#15803d' }}>USDT</div>
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px', opacity: 0.8 }}>⚠️ Send EXACTLY this amount. Under/over payment may delay your order.</div>
              <button style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>📋 Copy Amount</button>
            </div>
            <div style={{ width: '130px', height: '130px', borderRadius: '12px', background: 'white', border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>📱</div>
              <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', lineHeight: 1.4 }}>Tap to<br />Scan QR</div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {[
          { style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }, icon: '🚫', text: <><strong>Wrong network = permanent loss of funds.</strong> Only send USDT on the <strong>TRON / TRC-20</strong> network. Do not send ERC-20, BEP-20, or any other network to this address. PakSwap cannot recover wrong-network deposits.</> },
          { style: { background: '#fffbeb', border: '1.5px solid #fde68a', color: '#92400e' }, icon: '⏳', text: <><strong>TRON requires 20 network confirmations</strong> (~1 minute after your tx is broadcast). Your BNB will be released automatically once confirmed. No action needed from you.</> },
          { style: { background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d4ed8' }, icon: '💡', text: <>Only send from a wallet you control. Exchanges may take longer to broadcast. Ensure your tx is broadcast before the timer expires.</> },
        ].map((w, i) => (
          <div key={i} style={{ ...w.style, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '13px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{w.icon}</span>
            <div>{w.text}</div>
          </div>
        ))}

        {/* Confirmation Tracker */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>🔗 Live Blockchain Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: step === 'waiting' ? '#e2e8f0' : step === 'complete' ? '#059669' : '#2563eb' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>
                {step === 'waiting' ? 'Waiting for your transaction...' : step === 'detected' ? 'Transaction detected on TRON network!' : step === 'complete' ? '20/20 Confirmations — Releasing BNB!' : `${confs}/20 Confirmations`}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {step === 'waiting' ? 'Monitoring TRON network for incoming USDT to your deposit address' : `TX: a1b2c3d4e5...123456 · ${confs}/20 confirmations`}
              </div>
            </div>
            <span style={{ background: step === 'complete' ? '#d1fae5' : step === 'waiting' ? '#f1f5f9' : '#dbeafe', color: step === 'complete' ? '#065f46' : step === 'waiting' ? '#64748b' : '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
              {step === 'complete' ? 'Confirmed' : step === 'waiting' ? 'Waiting' : 'Confirming'}
            </span>
          </div>

          {step !== 'waiting' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <span>Network Confirmations</span>
                <span>{confs} / 20</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', height: '10px', margin: '12px 0' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#059669)', borderRadius: '12px', width: `${(confs / 20) * 100}%`, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>TX: a1b2c3d4e5...123456</div>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            {[
              { n: 1, title: 'Waiting for Transaction', sub: 'Monitor scanning TRON blocks every 3 seconds' },
              { n: 2, title: 'Transaction Detected', sub: 'TX found on network — waiting for confirmations' },
              { n: 3, title: 'Confirmation Reached (20/20)', sub: 'Payment confirmed — ready for payout' },
              { n: 4, title: 'BNB Released to Your Wallet', sub: '0.0841 BNB sent to your wallet address on BSC' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none', fontSize: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, background: stepsDone(s.n) ? '#d1fae5' : stepActive(s.n) ? '#dbeafe' : '#f1f5f9', color: stepsDone(s.n) ? '#065f46' : stepActive(s.n) ? '#2563eb' : '#94a3b8' }}>
                  {stepsDone(s.n) ? '✓' : stepActive(s.n) ? '⏳' : s.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{s.sub}</div>
                </div>
                <span style={{ background: stepsDone(s.n) ? '#d1fae5' : stepActive(s.n) ? '#dbeafe' : '#f1f5f9', color: stepsDone(s.n) ? '#065f46' : stepActive(s.n) ? '#1d4ed8' : '#94a3b8', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                  {stepsDone(s.n) ? 'Done' : stepActive(s.n) ? 'Active' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Layer Verification */}
        <div style={{ border: '1.5px solid #bfdbfe', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', fontWeight: 700 }}>
            🔐 Mandatory Two-Layer Verification
            <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
          </div>
          {/* Layer 1 */}
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a5f' }}>Layer 1 — Blockchain Auto-Verification</div>
                <div style={{ fontSize: '12px', color: '#3b82f6' }}>Automatic — no screenshot, no manual scan needed</div>
              </div>
              <span style={{ marginLeft: 'auto', background: step === 'complete' ? '#d1fae5' : '#dbeafe', color: step === 'complete' ? '#065f46' : '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                {step === 'complete' ? '✓ Verified' : '⚙️ Monitoring'}
              </span>
            </div>
            <div style={{ padding: '12px 18px' }}>
              {[
                { label: 'Deposit address match', detail: 'Watching: TEJmx...6aLq' },
                { label: 'Token contract verification', detail: 'USDT TRC-20 contract' },
                { label: 'Amount verification (50.000 USDT)', detail: '±0.1% tolerance' },
                { label: 'Duplicate TX check', detail: 'Prevent replay attacks' },
                { label: `Confirmation count (${confs}/20)`, detail: step === 'waiting' ? 'Waiting for TX broadcast' : `${confs}/20 confirmations` },
              ].map((c, i) => {
                const done = step !== 'waiting' && (i < 4 || step === 'complete')
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: done ? '#d1fae5' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                      {done ? '✓' : '↻'}
                    </div>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '14px' }}>{c.label}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{c.detail}</span>
                    <span style={{ background: done ? '#d1fae5' : '#fef3c7', color: done ? '#065f46' : '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, marginLeft: '8px' }}>{done ? 'PASS' : 'Watching'}</span>
                  </div>
                )
              })}
              <div style={{ marginTop: '10px', padding: '10px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#1d4ed8' }}>
                🔗 Blockchain is the source of truth. No AI screenshot scan required for crypto payments.
              </div>
            </div>
          </div>
          {/* Layer 2 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#78350f' }}>Layer 2 — Admin Human Review</div>
                <div style={{ fontSize: '12px', color: '#d97706' }}>Mandatory — BNB is blocked until a PakSwap admin approves release</div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>⏳ Awaiting Layer 1</span>
            </div>
            <div style={{ padding: '14px 18px', background: '#fffbeb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fff3cd', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', color: '#92400e' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span><strong>Token release is blocked</strong> until an admin manually reviews and approves — even after blockchain confirmation. This applies to all orders.</span>
              </div>
              <div style={{ fontSize: '13px', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>👤</span> Admin will verify deposit TX on blockchain explorer</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔍</span> Admin confirms: correct token, correct amount, correct wallet</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>⏱️</span> SLA: 30 minutes from blockchain confirmation</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>📲</span> You will be notified by SMS + app once admin approves and BNB is sent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>✅ Your Checklist</div>
          {[
            { n: '1️⃣', text: 'Open your TRON wallet (TronLink, Trust Wallet, Binance app, or any TRC-20 wallet)' },
            { n: '2️⃣', text: <span>Select USDT and make sure network is set to <strong>TRON / TRC-20</strong></span> },
            { n: '3️⃣', text: <span>Paste the deposit address: <strong>TEJmxFDfWCPnRbXZovbWzRLVCZTF5y6aLq</strong></span> },
            { n: '4️⃣', text: <span>Send exactly <strong>50.000000 USDT</strong> — not more, not less</span> },
            { n: '5️⃣', text: 'Wait on this page — we will detect and confirm your payment automatically' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none', fontSize: '13px' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{c.n}</span>
              <div>{c.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/instant-buy/history" style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', color: '#374151', textDecoration: 'none' }}>View My Orders</Link>
          <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>💬 Need Help?</button>
        </div>
      </div>

      {/* Completed overlay */}
      {showOverlay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Payment Confirmed!</div>
            <div style={{ fontSize: '15px', color: '#64748b', marginBottom: '20px' }}>20/20 confirmations reached. Releasing 0.0841 BNB to your wallet...</div>
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#e2e8f0', wordBreak: 'break-all', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}>DEPOSIT TX HASH (TRON)</div>
              a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#166534', wordBreak: 'break-all', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ color: '#166534', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>PAYOUT TX HASH (BSC)</div>
              0x4a7b8c9d0e1f234567890abcdef1234567890abcde
            </div>
            <Link href="/instant-buy/status/demo" style={{ display: 'block', padding: '14px', borderRadius: '10px', background: '#16a34a', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>View Order Completion →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
