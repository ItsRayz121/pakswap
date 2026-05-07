'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const RATE = 43150

export default function InstantBuyOrderPage() {
  const [pkr, setPkr] = useState('10000')
  const [sol, setSol] = useState('0.2348')
  const [payMethod, setPayMethod] = useState('JazzCash')
  const [addr, setAddr] = useState('')
  const [addrValid, setAddrValid] = useState<boolean | null>(null)
  const [checked, setChecked] = useState(false)
  const [timer, setTimer] = useState(598)

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function onPkrChange(v: string) {
    setPkr(v)
    setSol(v ? (parseFloat(v) / RATE).toFixed(4) : '')
  }
  function onSolChange(v: string) {
    setSol(v)
    setPkr(v ? String(Math.round(parseFloat(v) * RATE)) : '')
  }
  function validateAddr(v: string) {
    setAddr(v)
    if (!v) { setAddrValid(null); return }
    const valid = v.length >= 32 && v.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(v)
    setAddrValid(valid)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Back to Instant Buy</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🟣</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>Solana <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>SOL</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>PKR 41,850</span>
                <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>↓ 0.6% today</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Oracle price</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>$149.10 USDT</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Binance · CoinGecko · CMC</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>🌐 Network &amp; Wallet Info</h4>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: '#1d4ed8', marginBottom: '10px' }}>🔵 Solana Network (Mainnet)</div>
            <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', lineHeight: 1.6 }}>
              Your SOL will be sent to a <strong>Solana wallet address</strong>. Make sure you provide the correct address — transactions cannot be reversed.
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#92400e', marginBottom: '12px' }}>
              ⚠️ <strong>Do NOT enter a BNB (0x...) or TON (EQ...) address.</strong> Only Solana addresses are accepted here.
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Supported Wallets</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Phantom', 'Solflare', 'Backpack', 'Exodus', 'Any Solana Wallet'].map(w => (
                <span key={w} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{w}</span>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>📋 What Happens After You Order</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { n: 1, color: '#2563eb', bg: '#eff6ff', title: 'Send payment + upload proof', sub: 'Pay via JazzCash, Easypaisa, or bank. Screenshot required.' },
                { n: 2, color: '#2563eb', bg: '#eff6ff', title: 'AI verification (2–5 min)', sub: 'Our AI checks your screenshot instantly. High confidence = auto-approved.' },
                { n: 3, color: '#059669', bg: '#d1fae5', title: 'SOL arrives in your wallet', sub: "Automatically sent. You'll get SMS + notification with the transaction hash." },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', background: s.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: s.color, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Create Order</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: '#eff6ff', border: '2px solid #2563eb', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '8px' }}>You Pay</div>
              <input type="number" value={pkr} onChange={e => onPkrChange(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>PKR — Pakistani Rupee</div>
            </div>
            <div style={{ width: '36px', height: '36px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>⇄</div>
            <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '8px' }}>You Receive</div>
              <input type="number" value={sol} onChange={e => onSolChange(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>SOL — Solana</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            {[['Market rate', '1 SOL = PKR 41,850'], ['Platform spread (3%)', '+ PKR 1,255'], ['Network fee', '≈ PKR 45']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0' }}>
                <span style={{ color: '#64748b' }}>{l}</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, paddingTop: '8px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
              <span>Your rate</span>
              <span style={{ color: '#2563eb' }}>1 SOL = PKR 43,150</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef3c7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '16px' }}>
            ⏱️ Quote valid for: <span style={{ fontSize: '16px', color: timer < 60 ? '#ef4444' : '#92400e' }}>{mm}:{ss}</span>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Pay with</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[{ id: 'JazzCash', icon: '📱' }, { id: 'Easypaisa', icon: '💚' }, { id: 'Bank', icon: '🏦' }].map(p => (
              <div key={p.id} onClick={() => setPayMethod(p.id)} style={{ border: `2px solid ${payMethod === p.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: '10px', padding: '12px 8px', textAlign: 'center', cursor: 'pointer', background: payMethod === p.id ? '#eff6ff' : 'white' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{p.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{p.id}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Provider</div>
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>P</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>PakSwap Official</div>
                <div style={{ color: '#f59e0b', fontSize: '13px' }}>★★★★★ <span style={{ color: '#64748b', fontSize: '12px' }}>99.8% · 12,450 orders</span></div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>▼</div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Your SOL Wallet Address <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '8px 10px' }}>
              🟢 <strong>Solana format:</strong> Base58, 32–44 characters<br />
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#15803d' }}>Example: 7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input type="text" value={addr} onChange={e => validateAddr(e.target.value)} placeholder="Enter your Solana wallet address"
                style={{ width: '100%', padding: '10px 44px 10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>
                {addr.length === 0 ? '·' : addrValid ? '✅' : '❌'}
              </span>
            </div>
            {addr.length > 5 && addrValid === false && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#dc2626', marginTop: '10px' }}>
                ⚠️ This does not look like a valid Solana address. Solana addresses are 32–44 characters in Base58 format and do NOT start with "0x" or "EQ".
              </div>
            )}
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#dc2626', margin: '12px 0 16px' }}>
            ⚠️ <strong>Wrong address = permanent loss of funds.</strong> PakSwap cannot recover tokens sent to wrong addresses. Always verify your address before confirming.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <input type="checkbox" id="cc" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} />
            <label htmlFor="cc" style={{ fontSize: '13px', color: '#374151', cursor: 'pointer' }}>I have verified my wallet address and understand it cannot be changed after confirmation</label>
          </div>

          <Link href="/instant-buy/payment/demo">
            <button style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              Confirm &amp; Proceed to Payment →
            </button>
          </Link>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>By continuing you agree to our Terms of Service</div>
        </div>
      </div>
    </div>
  )
}
