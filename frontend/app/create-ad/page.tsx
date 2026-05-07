'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function CreateAdPage() {
  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [coin, setCoin] = useState('USDT')
  const [priceType, setPriceType] = useState<'fixed' | 'float'>('fixed')
  const [fixedRate, setFixedRate] = useState('280.50')
  const [margin, setMargin] = useState(1.5)
  const [pm, setPm] = useState<Record<string, boolean>>({ jazz: true, hbl: true, easy: false })
  const [terms, setTerms] = useState('')

  const market = 280.05
  const rate = parseFloat(fixedRate) || market
  const diff = ((rate - market) / market * 100).toFixed(2)
  const diffPositive = rate >= market

  const coins = [
    { id: 'USDT', sym: '₮', border: '#26a17b', bg: '#f0fdf4', color: '#065f46' },
    { id: 'BTC', sym: '₿', border: '#f7931a', bg: '#fff7ed', color: '#9a3412' },
    { id: 'ETH', sym: 'Ξ', border: '#627eea', bg: '#f0f4ff', color: '#3730a3' },
    { id: 'USDC', sym: '$', border: '#2775ca', bg: '#eff6ff', color: '#1e40af' },
  ]

  function publishAd() {
    alert('✅ Ad published successfully!\nYour SELL USDT offer is now live in the marketplace.\n\nRedirecting to marketplace...')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>+ Create Ad</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
          <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>👑 Merchant</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Create P2P Advertisement</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Set up your offer for the marketplace</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => alert('Draft saved')} style={{ padding: '9px 18px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Save Draft</button>
            <Link href="/marketplace" style={{ padding: '9px 18px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', textDecoration: 'none', color: '#374151' }}>View My Ads</Link>
          </div>
        </div>

        {/* Section 1: Trade Direction */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>1. Trade Direction</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Are you buying or selling crypto?</div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {([['sell', '💰', 'SELL Crypto', 'Receive PKR from buyers'], ['buy', '🛒', 'BUY Crypto', 'Send PKR to sellers']] as const).map(([s, icon, label, sub]) => (
              <button key={s} onClick={() => setSide(s)} style={{ flex: 1, padding: '16px', borderRadius: '10px', border: `2px solid ${side === s ? '#2563eb' : '#e2e8f0'}`, background: side === s ? '#eff6ff' : 'white', color: side === s ? '#1d4ed8' : '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                <div>{label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>{sub}</div>
              </button>
            ))}
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Cryptocurrency</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {coins.map(c => (
                <button key={c.id} onClick={() => setCoin(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: `2px solid ${coin === c.id ? c.border : '#e2e8f0'}`, background: coin === c.id ? c.bg : 'white', color: coin === c.id ? c.color : '#374151', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: c.border, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>{c.sym}</div>
                  {c.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Price Setting */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>2. Price Setting</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Set your exchange rate — fixed or floating with market</div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {([['fixed', 'Fixed Price', 'Set exact PKR/USDT rate manually'], ['float', 'Floating Price', 'Auto-adjust with market ± margin']] as const).map(([t, label, sub]) => (
              <button key={t} onClick={() => setPriceType(t)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: `2px solid ${priceType === t ? '#2563eb' : '#e2e8f0'}`, background: priceType === t ? '#eff6ff' : 'white', color: priceType === t ? '#1d4ed8' : '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                <strong>{label}</strong>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400, marginTop: '4px' }}>{sub}</div>
              </button>
            ))}
          </div>

          {priceType === 'fixed' ? (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Your Rate (PKR per USDT)</label>
              <div style={{ position: 'relative', marginTop: '6px' }}>
                <input type="number" value={fixedRate} onChange={e => setFixedRate(e.target.value)}
                  style={{ width: '100%', padding: '14px', paddingRight: '60px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '20px', fontWeight: 800, outline: 'none', boxSizing: 'border-box' }} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Market rate: <strong>280.05 PKR</strong></span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: diffPositive ? '#10b981' : '#f59e0b' }}>{diffPositive ? '▲ +' : '▼ '}{diff}% vs market</span>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Floating Margin (%)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <button onClick={() => setMargin(m => Math.max(0, +(m - 0.5).toFixed(1)))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontSize: '20px', cursor: 'pointer' }}>−</button>
                <input type="number" value={margin} onChange={e => setMargin(+e.target.value)} style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, width: '100px', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px', outline: 'none' }} />
                <button onClick={() => setMargin(m => +(m + 0.5).toFixed(1))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontSize: '20px', cursor: 'pointer' }}>+</button>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#64748b' }}>%</span>
              </div>
              <div style={{ fontSize: '13px', color: '#10b981', marginTop: '8px' }}>Your effective rate: ≈ {(market * (1 + margin / 100)).toFixed(2)} PKR/USDT (+{margin}%)</div>
            </div>
          )}
        </div>

        {/* Section 3: Trade Limits */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>3. Trade Limits</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>How much USDT do you want to trade?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Total USDT to Sell', unit: 'USDT', default: '500', hint: 'Wallet: 35.50 USDT' },
              { label: 'Min per Trade', unit: 'PKR', default: '1000', hint: '' },
              { label: 'Max per Trade', unit: 'PKR', default: '200000', hint: '' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input type="number" defaultValue={f.default} style={{ width: '100%', padding: '11px 48px 11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{f.unit}</span>
                </div>
                {f.hint && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{f.hint}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Payment Methods */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>4. Payment Methods</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Which payment methods will you accept?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { key: 'jazz', label: '⚡ JazzCash', detail: '0312-XXXXXXX (Verified ✓)', detailColor: '#065f46' },
              { key: 'hbl', label: '🏦 HBL Bank Transfer', detail: 'IBAN: PK36HABB... (Verified ✓)', detailColor: '#065f46' },
              { key: 'easy', label: '💚 Easypaisa', detail: 'Not added yet', detailColor: '#94a3b8', addLink: true },
            ].map(p => (
              <div key={p.key} onClick={() => !p.addLink && setPm(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: `1.5px solid ${pm[p.key] ? '#2563eb' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', background: pm[p.key] ? '#eff6ff' : 'white' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.label}</span>
                <span style={{ fontSize: '13px', color: p.detailColor, flex: 1 }}>{p.detail}</span>
                {p.addLink ? (
                  <Link href="/payment-methods" style={{ fontSize: '12px', color: '#2563eb' }}>+ Add</Link>
                ) : (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: pm[p.key] ? '#10b981' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>{pm[p.key] ? '✓' : ''}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Trade Settings */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>5. Trade Settings</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Configure trade window and counterparty requirements</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Trade Window</label>
              <select defaultValue="15" style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginTop: '6px' }}>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Time buyer has to complete payment</div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Counterparty Requirements</label>
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['KYC verified (min)', 'Full KYC only', 'Min. 1 completed trade'].map((r, i) => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: '#2563eb' }} /> {r}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Ad Terms <span style={{ color: '#94a3b8', fontWeight: 400 }}>(shown to buyers)</span></label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3}
              placeholder="e.g. Send from your own registered account only. No third-party payments. I release within 5 minutes of confirmation."
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'none', marginTop: '6px', boxSizing: 'border-box' }} />
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{terms.length}/500 characters</div>
          </div>
        </div>

        {/* Section 6: Preview */}
        <div style={{ background: '#f8faff', border: '1.5px solid #2563eb', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1d4ed8', marginBottom: '4px' }}>6. Preview Your Ad</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>This is how your ad will appear in the marketplace</div>
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 700 }}>U</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800 }}>Muhammad U.</span>
                    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>👑 Merchant</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span style={{ color: '#f59e0b' }}>★★★★★</span>
                    <span style={{ fontSize: '13px' }}>4.9</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>87 trades · 97.2%</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '26px', fontWeight: 900 }}>{priceType === 'fixed' ? rate.toFixed(2) : (market * (1 + margin / 100)).toFixed(2)} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                <div style={{ fontSize: '12px', color: '#10b981' }}>▲ +{priceType === 'fixed' ? diff : margin}% above market</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', fontSize: '13px', color: '#64748b' }}>
              <span>Limits: <strong style={{ color: '#1e293b' }}>1,000–200,000 PKR</strong></span>
              <span>Available: <strong style={{ color: '#1e293b' }}>500 USDT</strong></span>
              <span>⚡ ~4 min</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {pm.jazz && <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>⚡ JazzCash</span>}
                {pm.hbl && <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🏦 HBL Bank</span>}
              </div>
              <button disabled style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '13px', opacity: 0.5, cursor: 'default' }}>Buy USDT →</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingBottom: '32px' }}>
          <button onClick={() => alert('Saved as draft')} style={{ padding: '14px 24px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Save as Draft</button>
          <button onClick={publishAd} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>🚀 Publish Ad to Marketplace</button>
        </div>
      </div>
    </div>
  )
}
