'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function InstantBuyPaymentPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'pkr' | 'usdt'>('pkr')
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const [timer, setTimer] = useState(8 * 60 + 43)
  const [usdtNet, setUsdtNet] = useState('TRC-20')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mins = Math.floor(timer / 60).toString().padStart(2, '0')
  const secs = (timer % 60).toString().padStart(2, '0')

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/instant-buy/order/new" style={{ fontSize: 16, color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>← Edit Order</Link>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Order #IBO-2026-004521</div>
        <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>⏳ Awaiting Payment</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start', maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Left */}
        <div>
          {/* Order Summary Bar */}
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🟣</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>Buying 0.2348 SOL</div>
                <div style={{ fontSize: 13, color: '#3b82f6' }}>Solana Network</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#64748b' }}>Total to pay</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1d4ed8' }}>10,135 PKR</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {(['pkr', 'usdt'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === t ? 'white' : 'transparent', color: tab === t ? '#1d4ed8' : '#64748b', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
                {t === 'pkr' ? '💳 Pay with PKR' : '💵 Pay with USDT'}
              </button>
            ))}
          </div>

          {tab === 'pkr' && (
            <>
              <div style={{ background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c2410c', marginBottom: 8 }}>⚠️ Important — Read before paying</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Pay the exact amount shown — not more, not less', 'Your payment account name must match your KYC name: Muhammad Usman', 'Include the order reference in payment note if your app supports it', 'Do NOT pay from a third-party account — your name must match', 'Do NOT send via Raast — use JazzCash wallet-to-wallet or bank IBAN'].map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#9a3412', display: 'flex', gap: 8 }}><span>{i < 3 ? '✅' : '❌'}</span>{item}</div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 16 }}>Payment Details</div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Pay exactly this amount</div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#1e293b', letterSpacing: -1 }}>10,135 <span style={{ fontSize: 22 }}>PKR</span></div>
                </div>
                {[['📱 Send to (JazzCash)', '0300-1234567', 'num'], ['👤 Account Name', 'PakSwap (Pvt) Ltd', null], ['🔖 Reference / Note', 'IBO-004521', 'ref']].map(([label, val, key]) => (
                  <div key={label as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {val}
                      {key && <button onClick={() => copy(val as string, key as string)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>{copied === key ? 'Copied!' : 'Copy'}</button>}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 12, paddingTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Also accepted:</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>Easypaisa: 0300-1234567</span>
                    <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>IBAN: PK36ALFH0110012345678901</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Upload Payment Screenshot</div>
              {!uploaded ? (
                <div onClick={() => { setUploaded(true); setFileName('jazzcash_payment.jpg') }} style={{ border: '2px dashed #cbd5e1', borderRadius: 14, padding: 32, textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginBottom: 16, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLElement).style.background = '#eff6ff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1'; (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>JPG, PNG, PDF — max 10MB</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Your JazzCash / Easypaisa / Bank screenshot</div>
                </div>
              ) : (
                <div style={{ border: '1.5px solid #86efac', background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>📎</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{fileName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Ready for verification</div>
                  </div>
                  <span style={{ fontSize: 20 }}>✅</span>
                </div>
              )}

              <button onClick={() => router.push('/instant-buy/status/new')} style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>✅ I Have Made the Payment</button>
              <button style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white', color: '#374151' }}>Cancel Order</button>
            </>
          )}

          {tab === 'usdt' && (
            <>
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#166534', marginBottom: 12 }}>⚡ USDT Payment — Fully Automatic</div>
                <p style={{ fontSize: 13, color: '#15803d', lineHeight: 1.6, margin: 0 }}>Send USDT to the address below. We monitor the blockchain automatically — no screenshot needed. Token is released as soon as your transaction is confirmed.</p>
              </div>

              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 14, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Send exactly</div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#1e293b', letterSpacing: -1 }}>36.12 <span style={{ fontSize: 22 }}>USDT</span></div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>SELECT NETWORK</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['TRC-20', 'BEP-20'].map(n => (
                      <button key={n} onClick={() => setUsdtNet(n)} style={{ padding: '6px 14px', background: usdtNet === n ? '#2563eb' : 'white', color: usdtNet === n ? 'white' : '#374151', border: `1.5px solid ${usdtNet === n ? '#2563eb' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{n === 'TRC-20' ? 'TRC-20 (TRON)' : 'BEP-20 (BSC)'}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>DEPOSIT ADDRESS ({usdtNet})</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', wordBreak: 'break-all', lineHeight: 1.6 }}>TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7</div>
                  <button onClick={() => copy('TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7', 'usdt-addr')} style={{ marginTop: 10, background: '#334155', border: '1px solid #475569', color: '#e2e8f0', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{copied === 'usdt-addr' ? '✓ Copied' : '📋 Copy Address'}</button>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 10, fontSize: 12, color: '#92400e' }}>
                  ⚠️ Send ONLY on the <strong>{usdtNet} network</strong>. Sending on a different network will result in permanent loss of funds.
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 12 }}>⏳ We will detect your transaction automatically. Usually 1–3 minutes after sending.</div>
            </>
          )}
        </div>

        {/* Right */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 28, position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Order Expires In</div>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>Quote locked — pay before time runs out</div>
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: '8px 0', color: timer < 60 ? '#ef4444' : timer < 180 ? '#f59e0b' : '#1e293b' }}>{mins}:{secs}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Order will be cancelled if not paid</div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Order Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {[['Order ID', 'IBO-004521', true], ['Token', 'SOL (Solana)', false], ['You receive', '0.2348 SOL', false], ['Rate', 'PKR 43,150 / SOL', false], ['To wallet', '7EcDh...LtV', true]].map(([k, v, mono]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ fontWeight: k === 'You receive' ? 700 : 600, color: k === 'You receive' ? '#059669' : undefined, fontFamily: mono ? 'monospace' : undefined, fontSize: mono ? 12 : undefined }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800 }}>
              <span>Total</span><span style={{ color: '#1d4ed8' }}>10,135 PKR</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
            <strong style={{ color: '#374151' }}>Need help?</strong><br />
            WhatsApp: <a href="#" style={{ color: '#2563eb' }}>+92-300-PAKSWAP</a><br />
            Telegram: <a href="#" style={{ color: '#2563eb' }}>@PakSwapSupport</a><br />
            Available 9AM–11PM PKT
          </div>
        </div>
      </div>
    </div>
  )
}
