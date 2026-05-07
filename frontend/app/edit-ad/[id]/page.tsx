'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adsApi, marketplaceApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface Ad {
  id: string
  side: string
  coin: string
  network: string
  priceType?: string
  price: number
  minOrder: number
  maxOrder: number
  paymentMethods?: string[]
  terms?: string
  tradeWindow?: number
  status: string
}

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()

  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [priceType, setPriceType] = useState<'fixed' | 'float'>('fixed')
  const [price, setPrice] = useState('')
  const [minLimit, setMinLimit] = useState('')
  const [maxLimit, setMaxLimit] = useState('')
  const [terms, setTerms] = useState('')
  const [tradeWindow, setTradeWindow] = useState('30 minutes')
  const [pmJazz, setPmJazz] = useState(false)
  const [pmEasy, setPmEasy] = useState(false)
  const [pmBank, setPmBank] = useState(false)
  const [pmSada, setPmSada] = useState(false)

  const [marketRate, setMarketRate] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?'
  const displayName = user?.fullName?.split(' ')[0] ?? 'Account'

  useEffect(() => {
    if (!id) return
    adsApi.getMyAds().then(res => {
      const ads: Ad[] = res.data.data ?? res.data
      const found = ads.find(a => a.id === id)
      if (!found) { setLoadError('Ad not found'); return }
      setAd(found)
      setPrice(String(found.price ?? ''))
      setMinLimit(String(found.minOrder ?? ''))
      setMaxLimit(String(found.maxOrder ?? ''))
      setTerms(found.terms ?? '')
      setPriceType((found.priceType as any) ?? 'fixed')
      const window = found.tradeWindow ? `${found.tradeWindow} minutes` : '30 minutes'
      setTradeWindow(window)
      const pms = found.paymentMethods ?? []
      setPmJazz(pms.some(p => p.toLowerCase().includes('jazzcash')))
      setPmEasy(pms.some(p => p.toLowerCase().includes('easypaisa')))
      setPmBank(pms.some(p => p.toLowerCase().includes('bank')))
      setPmSada(pms.some(p => p.toLowerCase().includes('sada') || p.toLowerCase().includes('naya')))
      // Fetch live market rate for this coin
      return marketplaceApi.getRate(found.coin)
    }).then(rateRes => {
      if (rateRes) {
        const r = rateRes.data.data?.rate ?? rateRes.data.rate ?? rateRes.data.data
        if (typeof r === 'number') setMarketRate(r)
      }
    }).catch(e => {
      setLoadError(e?.response?.data?.error ?? 'Failed to load ad')
    }).finally(() => setLoading(false))
  }, [id])

  const priceDiff = price && marketRate ? (((parseFloat(price) - marketRate) / marketRate) * 100).toFixed(2) : null
  const isAbove = priceDiff ? parseFloat(priceDiff) >= 0 : true

  async function handleSave() {
    if (!ad) return
    setSaving(true)
    setSaveError(null)
    try {
      const pms = [pmJazz && 'JazzCash', pmEasy && 'Easypaisa', pmBank && 'Bank', pmSada && 'SadaPay/NayaPay'].filter(Boolean)
      await adsApi.update(ad.id, {
        price: parseFloat(price),
        minOrder: parseInt(minLimit),
        maxOrder: parseInt(maxLimit),
        paymentMethods: pms,
        terms,
        tradeWindow: parseInt(tradeWindow),
      })
      setSaved(true)
    } catch (e: any) {
      setSaveError(e?.response?.data?.message ?? 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!ad || !confirm('Delete this ad? This cannot be undone.')) return
    setDeleting(true)
    try {
      await adsApi.delete(ad.id)
      router.push('/my-ads')
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to delete ad.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Loading ad...</div>
      </div>
    )
  }

  if (loadError || !ad) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{loadError ?? 'Ad not found'}</div>
          <Link href="/my-ads" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to My Ads</Link>
        </div>
      </div>
    )
  }

  if (saved) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ad Updated!</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Changes are live on the marketplace.</div>
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
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{initial}</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{displayName}</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Link href="/my-ads" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>← My Ads</Link>
              <span style={{ color: '#94a3b8' }}>/</span>
              <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>Edit Ad</span>
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
                <div style={{ background: ad.side === 'buy' ? '#d1fae5' : '#eff6ff', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 800, color: ad.side === 'buy' ? '#065f46' : '#1d4ed8' }}>
                  {ad.side.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ad.coin} — {ad.network}</div>
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
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Your Price (PKR per {ad.coin})</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                      style={{ width: '100%', padding: '10px 90px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b', fontWeight: 600 }}>PKR/{ad.coin}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
                    Market rate: <strong style={{ color: '#1e293b' }}>{marketRate ? `${marketRate.toLocaleString()} PKR` : 'Loading...'}</strong>
                    {priceDiff && <> · Your price is <strong style={{ color: isAbove ? '#059669' : '#ef4444' }}>{isAbove ? '+' : ''}{priceDiff}% {isAbove ? 'above' : 'below'} market</strong></>}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Margin (% above/below market rate)</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" step="0.1" defaultValue="1.5" style={{ width: '100%', padding: '10px 90px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b', fontWeight: 600 }}>% above</span>
                  </div>
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
            </div>

            {/* Payment Methods */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>💳 Accepted Payment Methods</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {[
                  { label: '📱 JazzCash', val: pmJazz, set: setPmJazz },
                  { label: '📱 Easypaisa', val: pmEasy, set: setPmEasy },
                  { label: '🏦 Bank Transfer (HBL, UBL, MCB, Meezan)', val: pmBank, set: setPmBank },
                  { label: '🟣 SadaPay / NayaPay', val: pmSada, set: setPmSada },
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
                <textarea rows={3} value={terms} onChange={e => setTerms(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{terms.length}/500 characters</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Trade Window</label>
                <select value={tradeWindow} onChange={e => setTradeWindow(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {saveError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, padding: 13, background: saving ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <Link href="/my-ads"><button style={{ padding: '13px 20px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Cancel</button></Link>
              <button onClick={handleDelete} disabled={deleting}
                style={{ padding: '13px 20px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer' }}>
                {deleting ? 'Deleting...' : '🗑 Delete Ad'}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Live Preview</div>
            <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ background: ad.side === 'buy' ? '#d1fae5' : '#eff6ff', color: ad.side === 'buy' ? '#065f46' : '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                  {ad.side.toUpperCase()} {ad.coin}
                </span>
                <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>{price || '—'} PKR</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>per {ad.coin} · {ad.network}</div>
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
                <span style={{ fontWeight: 700 }}>{user?.fullName?.split(' ')[0] ?? 'You'}</span>
              </div>
              <button disabled style={{ width: '100%', padding: 8, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, opacity: 0.5 }}>Preview Only</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
