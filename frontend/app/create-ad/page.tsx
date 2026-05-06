'use client'
import { useState } from 'react'
import Link from 'next/link'

const coins = [
  { id: 'USDT', symbol: '₮', border: '#26a17b', bg: '#f0fdf4', color: '#065f46' },
  { id: 'BTC', symbol: '₿', border: '#f7931a', bg: '#fff7ed', color: '#9a3412' },
  { id: 'ETH', symbol: 'Ξ', border: '#627eea', bg: '#f0f4ff', color: '#3730a3' },
  { id: 'USDC', symbol: '$', border: '#2775ca', bg: '#eff6ff', color: '#1e40af' },
]

export default function CreateAdPage() {
  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [coin, setCoin] = useState('USDT')
  const [priceType, setPriceType] = useState<'fixed' | 'float'>('fixed')
  const [rate, setRate] = useState('280.50')
  const [margin, setMargin] = useState(1.5)
  const [pmJazz, setPmJazz] = useState(true)
  const [pmBank, setPmBank] = useState(true)
  const [terms, setTerms] = useState('')

  const market = 280.05
  const rateDiff = rate ? ((parseFloat(rate) - market) / market * 100).toFixed(2) : '0.00'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/create-ad" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
          <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>👑 Merchant</span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Create P2P Advertisement</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0 }}>Set up your offer for the marketplace</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9' }}>Save Draft</button>
            <Link href="/marketplace"><button style={{ padding: '8px 16px', border: 'none', background: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>View My Ads</button></Link>
          </div>
        </div>

        {/* Section helper */}
        {(() => {
          const Section = ({ n, title, sub, children }: any) => (
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{n}. {title}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{sub}</div>
              {children}
            </div>
          )

          return (
            <>
              {/* 1. Trade Direction */}
              <Section n="1" title="Trade Direction" sub="Are you buying or selling crypto?">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {[{ key: 'sell', icon: '💰', label: 'SELL Crypto', sub: 'Receive PKR from buyers' }, { key: 'buy', icon: '🛒', label: 'BUY Crypto', sub: 'Send PKR to sellers' }].map(({ key, icon, label, sub }) => (
                    <button key={key} onClick={() => setSide(key as any)} style={{ flex: 1, padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: `2px solid ${side === key ? '#2563eb' : '#e2e8f0'}`, background: side === key ? '#eff6ff' : 'white', color: side === key ? '#1d4ed8' : '#374151', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                      <div>{label}</div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginTop: 2 }}>{sub}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Cryptocurrency</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {coins.map(c => (
                      <button key={c.id} onClick={() => setCoin(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: `2px solid ${coin === c.id ? c.border : '#e2e8f0'}`, background: coin === c.id ? c.bg : 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, color: coin === c.id ? c.color : '#374151' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.border, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{c.symbol}</div>
                        {c.id}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              {/* 2. Pricing */}
              <Section n="2" title="Price Setting" sub="Set your exchange rate — fixed or floating with market">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {[{ key: 'fixed', label: 'Fixed Price', sub: 'Set exact PKR/USDT rate manually' }, { key: 'float', label: 'Floating Price', sub: 'Auto-adjust with market ± margin' }].map(({ key, label, sub }) => (
                    <button key={key} onClick={() => setPriceType(key as any)} style={{ flex: 1, padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: `2px solid ${priceType === key ? '#2563eb' : '#e2e8f0'}`, background: priceType === key ? '#eff6ff' : 'white', color: priceType === key ? '#1d4ed8' : '#374151', textAlign: 'center' }}>
                      <strong>{label}</strong>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginTop: 4 }}>{sub}</div>
                    </button>
                  ))}
                </div>

                {priceType === 'fixed' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your Rate (PKR per USDT)</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" value={rate} onChange={e => setRate(e.target.value)} style={{ width: '100%', padding: '14px', paddingRight: 60, border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 20, fontWeight: 800, outline: 'none', boxSizing: 'border-box' }} />
                      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>Market rate: <strong>280.05 PKR</strong></span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: parseFloat(rateDiff) >= 0 ? '#10b981' : '#f59e0b' }}>{parseFloat(rateDiff) >= 0 ? '▲ +' : '▼ '}{rateDiff}% {parseFloat(rateDiff) >= 0 ? 'above' : 'below'} market</span>
                    </div>
                  </div>
                )}

                {priceType === 'float' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Floating Margin (%)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => setMargin(m => Math.max(0, parseFloat((m - 0.5).toFixed(1))))} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: 20, cursor: 'pointer' }}>−</button>
                      <input type="number" value={margin} onChange={e => setMargin(parseFloat(e.target.value) || 0)} style={{ width: 100, padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 20, fontWeight: 800, textAlign: 'center', outline: 'none' }} />
                      <button onClick={() => setMargin(m => parseFloat((m + 0.5).toFixed(1)))} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: 20, cursor: 'pointer' }}>+</button>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}>%</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#10b981', marginTop: 8 }}>Your effective rate: ≈ {(market * (1 + margin / 100)).toFixed(2)} PKR/USDT (+{margin}%)</div>
                  </div>
                )}
              </Section>

              {/* 3. Limits */}
              <Section n="3" title="Trade Limits" sub="How much USDT do you want to trade?">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[{ label: 'Total USDT to Sell', val: '500', unit: 'USDT', hint: 'Wallet: 35.50 USDT' }, { label: 'Min per Trade', val: '1000', unit: 'PKR', hint: '' }, { label: 'Max per Trade', val: '200000', unit: 'PKR', hint: '' }].map(({ label, val, unit, hint }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
                      <div style={{ position: 'relative' }}>
                        <input type="number" defaultValue={val} style={{ width: '100%', padding: '10px 56px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: '#64748b' }}>{unit}</span>
                      </div>
                      {hint && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{hint}</div>}
                    </div>
                  ))}
                </div>
              </Section>

              {/* 4. Payment Methods */}
              <Section n="4" title="Payment Methods" sub="Which payment methods will you accept?">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: '⚡ JazzCash', pill: '#065f46', pillBg: '#f0fdf4', detail: '0312-XXXXXXX (Verified ✓)', on: pmJazz, toggle: () => setPmJazz(!pmJazz) },
                    { label: '🏦 HBL Bank Transfer', pill: '#1d4ed8', pillBg: '#eff6ff', detail: 'IBAN: PK36HABB... (Verified ✓)', on: pmBank, toggle: () => setPmBank(!pmBank) },
                  ].map(({ label, pill, pillBg, detail, on, toggle }) => (
                    <div key={label} onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1.5px solid ${on ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, cursor: 'pointer', background: on ? '#eff6ff' : 'white' }}>
                      <span style={{ background: pillBg, color: pill, border: `1px solid ${on ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{label}</span>
                      <span style={{ fontSize: 13, color: '#065f46', flex: 1 }}>{detail}</span>
                      {on && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>}
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10 }}>
                    <span style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>💚 Easypaisa</span>
                    <span style={{ fontSize: 13, color: '#94a3b8', flex: 1 }}>Not added yet</span>
                    <Link href="/payment-methods" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>+ Add</Link>
                  </div>
                </div>
              </Section>

              {/* 5. Trade Settings */}
              <Section n="5" title="Trade Settings" sub="Configure trade window and counterparty requirements">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Trade Window</label>
                    <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                      <option>10 minutes</option>
                      <option selected>15 minutes</option>
                      <option>20 minutes</option>
                      <option>30 minutes</option>
                    </select>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Time buyer has to complete payment</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Counterparty Requirements</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                      {['KYC verified (min)', 'Full KYC only', 'Min. 1 completed trade'].map((l, i) => (
                        <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: '#2563eb' }} /> {l}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ad Terms <span style={{ color: '#94a3b8', fontWeight: 400 }}>(shown to buyers)</span></label>
                  <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} placeholder="e.g. Send from your own registered account only. No third-party payments. I release within 5 minutes of confirmation." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{terms.length}/500 characters</div>
                </div>
              </Section>

              {/* 6. Preview */}
              <div style={{ background: '#f8faff', border: '1.5px solid #2563eb', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1d4ed8', marginBottom: 4 }}>6. Preview Your Ad</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>This is how your ad will appear in the marketplace</div>
                <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>U</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 16, fontWeight: 800 }}>Muhammad U.</span>
                          <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>👑 Merchant</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                          <span style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★</span><span style={{ fontSize: 13 }}>4.9</span>
                          <span style={{ fontSize: 13, color: '#64748b' }}>87 trades · 97.2%</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /><span style={{ fontSize: 12, color: '#64748b' }}>Online</span></span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 26, fontWeight: 900 }}>{priceType === 'fixed' ? (parseFloat(rate) || 280.5).toFixed(2) : (market * (1 + margin / 100)).toFixed(2)} <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                      <div style={{ fontSize: 12, color: '#10b981' }}>▲ +{priceType === 'fixed' ? rateDiff : margin.toFixed(1)}% above market</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, fontSize: 13, color: '#64748b' }}>
                    <span>Limits: <strong style={{ color: '#1e293b' }}>1,000–200,000 PKR</strong></span>
                    <span>Available: <strong style={{ color: '#1e293b' }}>500 USDT</strong></span>
                    <span>⚡ ~4 min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {pmJazz && <span style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #86efac', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>⚡ JazzCash</span>}
                      {pmBank && <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>🏦 HBL Bank</span>}
                    </div>
                    <button style={{ padding: '7px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'default', opacity: 0.5 }}>{side === 'sell' ? 'Buy' : 'Sell'} USDT →</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingBottom: 32 }}>
                <button style={{ padding: '13px 24px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9' }}>Save as Draft</button>
                <Link href="/marketplace" style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: 13, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>🚀 Publish Ad to Marketplace</button>
                </Link>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
