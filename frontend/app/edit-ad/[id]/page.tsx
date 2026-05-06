'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function EditAdPage() {
  const [priceType, setPriceType] = useState<'fixed' | 'float'>('fixed')
  const [price, setPrice] = useState('283')
  const [minLimit, setMinLimit] = useState('1000')
  const [maxLimit, setMaxLimit] = useState('20000')
  const [pmJazz, setPmJazz] = useState(true)
  const [pmEasy, setPmEasy] = useState(true)
  const [pmBank, setPmBank] = useState(true)
  const [pmSada, setPmSada] = useState(false)
  const [saved, setSaved] = useState(false)

  const marketRate = 280.5
  const priceDiff = price ? (((parseFloat(price) - marketRate) / marketRate) * 100).toFixed(2) : '0'
  const isAbove = parseFloat(priceDiff) >= 0

  if (saved) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ad Updated!</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Ad #AD-1042 has been updated. Changes are live on the marketplace.</div>
          <Link href="/my-ads"><button style={{ padding: '12px 28px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Back to My Ads</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/dashboard" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/my-ads" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>My Ads</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>M</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Link href="/my-ads" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>← My Ads</Link>
              <span style={{ color: '#94a3b8' }}>/</span>
              <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>Edit Ad #AD-1042</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Edit Advertisement</h1>
          </div>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#92400e' }}>
            ⚠️ Changes take effect immediately for new trade requests
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* Trade Type (read-only) */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🔄 Trade Type & Coin</div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ background: '#d1fae5', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 800, color: '#065f46' }}>BUY</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>USDT — Tether (TRC-20)</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Trade type and coin cannot be changed. Delete and create a new ad to change these.</div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>💰 Price Setting</div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Price Type</label>
                <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setPriceType('fixed')} style={{ flex: 1, padding: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: priceType === 'fixed' ? '#2563eb' : 'white', color: priceType === 'fixed' ? 'white' : '#64748b' }}>Fixed Price</button>
                  <button onClick={() => setPriceType('float')} style={{ flex: 1, padding: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: priceType === 'float' ? '#2563eb' : 'white', color: priceType === 'float' ? 'white' : '#64748b' }}>Floating (% above/below market)</button>
                </div>
              </div>
              {priceType === 'fixed' ? (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Your Price (PKR per USDT)</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%', padding: '10px 90px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b', fontWeight: 600 }}>PKR/USDT</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
                    Market rate today: <strong style={{ color: '#1e293b' }}>280.5 PKR</strong> · Your price is <strong style={{ color: isAbove ? '#059669' : '#ef4444' }}>{isAbove ? '+' : ''}{priceDiff}% {isAbove ? 'above' : 'below'} market</strong>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Margin (% above/below market rate)</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" step="0.1" defaultValue="1.5" style={{ width: '100%', padding: '10px 90px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b', fontWeight: 600 }}>% above</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>At 1.5% → current effective price: <strong style={{ color: '#1e293b' }}>284.7 PKR/USDT</strong></div>
                </div>
              )}
            </div>

            {/* Limits */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📊 Trading Limits</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Minimum Order (PKR)</label>
                  <input type="number" value={minLimit} onChange={e => setMinLimit(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Maximum Order (PKR)</label>
                  <input type="number" value={maxLimit} onChange={e => setMaxLimit(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#64748b' }}>
                Your KYC limit allows up to <strong style={{ color: '#1e293b' }}>500,000 PKR/day</strong> · Current daily usage: <strong style={{ color: '#059669' }}>10,000 PKR</strong>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>💳 Accepted Payment Methods</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {[
                  { label: '📱 JazzCash', val: pmJazz, set: setPmJazz },
                  { label: '📱 Easypaisa', val: pmEasy, set: setPmEasy },
                  { label: '🏦 Bank Transfer (HBL, UBL, MCB, Meezan)', val: pmBank, set: setPmBank },
                  { label: '🟣 Sadapay / Nayapay', val: pmSada, set: setPmSada },
                ].map(({ label, val, set }) => (
                  <div key={label} onClick={() => set(!val)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `1.5px solid ${val ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: val ? '#eff6ff' : 'white', color: val ? '#1d4ed8' : '#374151' }}>
                    <span style={{ flex: 1 }}>{label}</span>
                    <span style={{ fontSize: 18, color: val ? undefined : '#e2e8f0' }}>✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📋 Ad Terms & Instructions</div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Terms for Buyers (optional)</label>
                <textarea rows={3} defaultValue="Only verified KYC users. Payment must be from your registered JazzCash number matching your PakSwap name." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>0/500 characters</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Trade Window</label>
                <select defaultValue="30 minutes" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Time buyer has to complete payment after trade starts</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => setSaved(true)} style={{ flex: 1, padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>💾 Save Changes</button>
              <Link href="/my-ads"><button style={{ padding: '13px 20px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Cancel</button></Link>
              <button style={{ padding: '13px 20px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>🗑 Delete Ad</button>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Live Preview</div>
            <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>BUY USDT</span>
                <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>{price || '—'} PKR</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>per USDT · TRC-20</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: '#64748b' }}>Limit</span>
                <span style={{ fontWeight: 700 }}>{parseInt(minLimit || '0').toLocaleString()} – {parseInt(maxLimit || '0').toLocaleString()} PKR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>Payment</span>
                <span style={{ fontWeight: 700 }}>{[pmJazz && 'JazzCash', pmEasy && 'Easypaisa', pmBank && 'Bank'].filter(Boolean).join(' · ') || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>Seller</span>
                <span style={{ fontWeight: 700 }}>Muhammad U. ⭐4.9</span>
              </div>
              <button disabled style={{ width: '100%', padding: 8, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, opacity: 0.5 }}>Buy USDT (preview)</button>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 12, fontSize: 12, color: '#92400e', marginTop: 12 }}>
              ⚠️ This is how buyers will see your ad on the marketplace.
            </div>

            {/* Ad Performance */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Ad Performance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                {[['Views (7d)', '284'], ['Trade requests', '32'], ['Completed', '30 (93.8%)'], ['Avg. trade time', '8 min']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{l}</span>
                    <strong style={{ color: l === 'Completed' ? '#059669' : undefined }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
