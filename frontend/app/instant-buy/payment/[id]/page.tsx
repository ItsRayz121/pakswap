'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InstantBuyPaymentPage() {
  const [tab, setTab] = useState<'pkr' | 'usdt'>('pkr')
  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const [timer, setTimer] = useState(523)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy/order/demo" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Edit Order</Link>
        <div style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Order #IBO-2026-004521</div>
        <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>⏳ Awaiting Payment</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          {/* Order Summary Bar */}
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🟣</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>Buying 0.2348 SOL</div>
                <div style={{ fontSize: '13px', color: '#3b82f6' }}>Solana Network</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Total to pay</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>10,135 PKR</div>
            </div>
          </div>

          {/* Pay Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
            {[{ key: 'pkr', label: '💳 Pay with PKR' }, { key: 'usdt', label: '💵 Pay with USDT' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key as any)} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === t.key ? 'white' : 'transparent', color: tab === t.key ? '#1d4ed8' : '#64748b', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
            ))}
          </div>

          {tab === 'pkr' && (
            <div>
              {/* Important Note */}
              <div style={{ background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c', marginBottom: '8px' }}>⚠️ Important — Read before paying</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    '✅ Pay the exact amount shown — not more, not less',
                    '✅ Your payment account name must match your KYC name: Muhammad Usman',
                    '✅ Include the order reference in payment note if your app supports it',
                    '❌ Do NOT pay from a third-party account — your name must match',
                    '❌ Do NOT send via Raast — use JazzCash wallet-to-wallet or bank IBAN',
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#9a3412', display: 'flex', gap: '8px' }}>{item}</div>
                  ))}
                </div>
              </div>

              {/* Payment Details Box */}
              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '16px' }}>Payment Details</div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Pay exactly this amount</div>
                  <div style={{ fontSize: '40px', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>10,135 <span style={{ fontSize: '22px' }}>PKR</span></div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Do not round up or down</div>
                </div>
                {[
                  { label: '📱 Send to (JazzCash)', value: '0300-1234567', copyKey: 'phone' },
                  { label: '👤 Account Name', value: 'PakSwap (Pvt) Ltd', copyKey: null },
                  { label: '🔖 Reference / Note', value: 'IBO-004521', copyKey: 'ref' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{r.label}</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {r.value}
                      {r.copyKey && (
                        <button onClick={() => copyText(r.value, r.copyKey!)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: copied === r.copyKey ? '#059669' : '#2563eb', cursor: 'pointer' }}>
                          {copied === r.copyKey ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', paddingTop: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Also accepted:</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Easypaisa: 0300-1234567</span>
                    <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>IBAN: PK36ALFH0110012345678901</span>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Upload Payment Screenshot</h3>
              {!fileUploaded ? (
                <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginBottom: '16px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Click to upload or drag &amp; drop</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>JPG, PNG, PDF — max 10MB</p>
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>Your JazzCash / Easypaisa / Bank screenshot</p>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) { setFileName(e.target.files[0].name); setFileUploaded(true) } }} />
                </label>
              ) : (
                <div style={{ border: '1.5px solid #86efac', background: '#f0fdf4', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '24px' }}>📎</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{fileName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Ready for verification</div>
                  </div>
                  <span style={{ fontSize: '20px' }}>✅</span>
                </div>
              )}

              <Link href="/instant-buy/status/demo">
                <button onClick={e => { if (!fileUploaded) { e.preventDefault(); alert('Please upload your payment screenshot first.') } }}
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '12px' }}>
                  ✅ I Have Made the Payment
                </button>
              </Link>
              <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>
                Cancel Order
              </button>
            </div>
          )}

          {tab === 'usdt' && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#166534', marginBottom: '12px' }}>⚡ USDT Payment — Fully Automatic</h4>
                <p style={{ fontSize: '13px', color: '#15803d', lineHeight: 1.6 }}>Send USDT to the address below. We monitor the blockchain automatically — no screenshot needed. Token is released as soon as your transaction is confirmed.</p>
              </div>
              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Send exactly</div>
                  <div style={{ fontSize: '40px', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>36.12 <span style={{ fontSize: '22px' }}>USDT</span></div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>SELECT NETWORK</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>TRC-20 (TRON)</button>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>BEP-20 (BSC)</button>
                  </div>
                </div>
                <div style={{ background: '#1e293b', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>DEPOSIT ADDRESS (TRC-20)</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0', wordBreak: 'break-all', lineHeight: 1.6 }}>TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7</div>
                  <button onClick={() => copyText('TLyKfp6RJWJ7P2ynkxS4Kd9FP8eJQvMBm7', 'usdt')} style={{ marginTop: '10px', background: '#334155', border: '1px solid #475569', color: copied === 'usdt' ? '#10b981' : '#e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    {copied === 'usdt' ? '✅ Copied!' : '📋 Copy Address'}
                  </button>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#92400e' }}>
                  ⚠️ Send ONLY on the <strong>TRC-20 network</strong>. Sending on a different network will result in permanent loss of funds.
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
                ⏳ We will detect your transaction automatically. Usually 1–3 minutes after sending.
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Timer + Summary */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>Order Expires In</h3>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Quote locked — pay before time runs out</div>
            <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', margin: '8px 0', color: timer < 120 ? '#ef4444' : '#f59e0b' }}>{mm}:{ss}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Order will be cancelled if not paid</div>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Order Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {[
              ['Order ID', 'IBO-004521', true],
              ['Token', 'SOL (Solana)', false],
              ['You receive', '0.2348 SOL', false],
              ['Rate', 'PKR 43,150 / SOL', false],
              ['To wallet', '7EcDh...LtV', true],
            ].map(([label, value, mono]) => (
              <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                <span style={{ fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', color: label === 'You receive' ? '#059669' : '#1e293b' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total</span>
              <span style={{ color: '#1d4ed8' }}>10,135 PKR</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#64748b', lineHeight: 1.7 }}>
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
