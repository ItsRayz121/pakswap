'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const RATE = 43150

export default function InstantBuyOrderPage() {
  const router = useRouter()
  const [pkrAmount, setPkrAmount] = useState('10000')
  const [solAmount, setSolAmount] = useState('0.2348')
  const [payMethod, setPayMethod] = useState('JazzCash')
  const [walletAddr, setWalletAddr] = useState('')
  const [addrValid, setAddrValid] = useState<null | boolean>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [timer, setTimer] = useState(598)

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const timerDisplay = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`

  const handlePkr = (v: string) => {
    setPkrAmount(v)
    setSolAmount(((parseFloat(v) || 0) / RATE).toFixed(4))
  }
  const handleSol = (v: string) => {
    setSolAmount(v)
    setPkrAmount(String(Math.round((parseFloat(v) || 0) * RATE)))
  }
  const validateAddr = (v: string) => {
    setWalletAddr(v)
    if (v.length === 0) { setAddrValid(null); return }
    const valid = v.length >= 32 && v.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(v)
    setAddrValid(valid)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/instant-buy" style={{ fontSize: 16, color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>← Back to Instant Buy</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start', maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Left */}
        <div>
          {/* Token Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🟣</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Solana <span style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>SOL</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>PKR 41,850</span>
                <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>↓ 0.6% today</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>Oracle price</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>$149.10 USDT</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Binance · CoinGecko · CMC</div>
            </div>
          </div>

          {/* Network Info */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>🌐 Network & Wallet Info</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#1d4ed8', marginBottom: 10 }}>🔵 Solana Network (Mainnet)</span>
            <div style={{ fontSize: 14, color: '#374151', marginBottom: 12, lineHeight: 1.6 }}>
              Your SOL will be sent to a <strong>Solana wallet address</strong>. Make sure you provide the correct address — transactions cannot be reversed.
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 12, fontSize: 13, color: '#92400e', marginBottom: 12 }}>
              ⚠️ <strong>Do NOT enter a BNB (0x...) or TON (EQ...) address.</strong> Only Solana addresses are accepted here.
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Supported Wallets</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Phantom', 'Solflare', 'Backpack', 'Exodus', 'Any Solana Wallet'].map(w => (
                <span key={w} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{w}</span>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📋 What Happens After You Order</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['1', '#eff6ff', '#2563eb', 'Send payment + upload proof', 'Pay via JazzCash, Easypaisa, or bank. Screenshot required.'], ['2', '#eff6ff', '#2563eb', 'AI verification (2–5 min)', 'Our AI checks your screenshot instantly. High confidence = auto-approved.'], ['3', '#d1fae5', '#059669', 'SOL arrives in your wallet', "Automatically sent. You'll get SMS + notification with the transaction hash."]].map(([n, bg, color, title, sub]) => (
                <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, background: bg as string, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: color as string, flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Form */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 28, position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Create Order</div>

          {/* Amount Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ background: '#eff6ff', border: '2px solid #2563eb', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 8 }}>You Pay</div>
              <input type="number" value={pkrAmount} onChange={e => handlePkr(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 22, fontWeight: 800, color: '#1e293b', outline: 'none' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 4 }}>PKR — Pakistani Rupee</div>
            </div>
            <div style={{ width: 36, height: 36, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>⇄</div>
            <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 8 }}>You Receive</div>
              <input type="number" value={solAmount} onChange={e => handleSol(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 22, fontWeight: 800, color: '#1e293b', outline: 'none' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 4 }}>SOL — Solana</div>
            </div>
          </div>

          {/* Quote Box */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {[['Market rate', '1 SOL = PKR 41,850'], ['Platform spread (3%)', '+ PKR 1,255'], ['Network fee', '≈ PKR 45']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '5px 0' }}>
                <span style={{ color: '#64748b' }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, paddingTop: 8, borderTop: '1px solid #e2e8f0', marginTop: 8 }}>
              <span>Your rate</span><span style={{ color: '#2563eb' }}>1 SOL = PKR 43,150</span>
            </div>
          </div>

          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef3c7', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 16 }}>
            ⏱️ Quote valid for: <span style={{ fontSize: 16, color: timer < 60 ? '#ef4444' : '#92400e' }}>{timerDisplay}</span>
          </div>

          {/* Payment Method */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Pay with</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[['📱', 'JazzCash'], ['💚', 'Easypaisa'], ['🏦', 'Bank']].map(([icon, name]) => (
              <div key={name} onClick={() => setPayMethod(name as string)} style={{ border: `2px solid ${payMethod === name ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, padding: '12px 8px', textAlign: 'center', cursor: 'pointer', background: payMethod === name ? '#eff6ff' : 'white', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{name}</div>
              </div>
            ))}
          </div>

          {/* Provider */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Provider</div>
          <div style={{ border: '2px solid #e2e8f0', borderRadius: 12, padding: 14, marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>P</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>PakSwap Official</div>
                <div style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★ <span style={{ color: '#64748b', fontSize: 12 }}>99.8% • 12,450 orders</span></div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>▼</div>
          </div>

          {/* Wallet Address */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Your SOL Wallet Address <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '8px 10px' }}>
              🟢 <strong>Solana format:</strong> Base58, 32–44 characters<br />
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#15803d' }}>Example: 7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Enter your Solana wallet address" value={walletAddr} onChange={e => validateAddr(e.target.value)} style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>{addrValid === null ? '·' : addrValid ? '✅' : '❌'}</span>
            </div>
            {addrValid === false && walletAddr.length > 5 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 12, fontSize: 13, color: '#dc2626', marginTop: 10, display: 'flex', gap: 8 }}>
                ⚠️ This does not look like a valid Solana address. Solana addresses are 32–44 characters in Base58 format.
              </div>
            )}
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 12, fontSize: 12, color: '#dc2626', marginBottom: 16 }}>
            ⚠️ <strong>Wrong address = permanent loss of funds.</strong> PakSwap cannot recover tokens sent to wrong addresses.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#2563eb' }} />
            <label style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>I have verified my wallet address and understand it cannot be changed after confirmation</label>
          </div>

          <button onClick={() => router.push('/instant-buy/payment/new')} disabled={!confirmed || addrValid !== true} style={{ width: '100%', padding: '14px', background: confirmed && addrValid ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: confirmed && addrValid ? 'pointer' : 'not-allowed', opacity: confirmed && addrValid ? 1 : 0.7 }}>
            Confirm & Proceed to Payment →
          </button>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#94a3b8' }}>By continuing you agree to our Terms of Service</div>
        </div>
      </div>
    </div>
  )
}
