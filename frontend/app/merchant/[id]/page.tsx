'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { merchantsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface MerchantProfile {
  id: string
  businessName: string
  status: string
  spreadBps?: number
  user?: {
    fullName?: string
    completedTrades?: number
    totalTrades?: number
    completionRate?: number
    avgRating?: number
    avgReleaseMinutes?: number
    createdAt?: string
    city?: string
  }
  paymentMethods?: string[]
  ads?: Array<{
    id: string
    side: string
    coin: string
    network: string
    price: number
    minOrder: number
    maxOrder: number
    paymentMethods?: string[]
  }>
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    reviewer?: { fullName?: string }
  }>
}

function starBar(pct: number, color: string) {
  return (
    <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '4px' }} />
    </div>
  )
}

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })
}

export default function MerchantPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?'
  const displayName = user?.fullName?.split(' ')[0] ?? 'Account'

  useEffect(() => {
    if (!id) return
    merchantsApi.get(id).then(res => {
      setMerchant(res.data.data ?? res.data)
    }).catch(e => {
      setError(e?.response?.data?.error ?? 'Merchant not found')
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
          <div>Loading merchant profile...</div>
        </div>
      </div>
    )
  }

  if (error || !merchant) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{error ?? 'Merchant not found'}</div>
          <Link href="/marketplace" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Marketplace</Link>
        </div>
      </div>
    )
  }

  const u = merchant.user ?? {}
  const merchantInitial = (merchant.businessName ?? u.fullName ?? '?').charAt(0).toUpperCase()
  const completionRate = u.completionRate ?? 0
  const avgRating = u.avgRating ?? 0
  const totalTrades = u.totalTrades ?? u.completedTrades ?? 0
  const avgRelease = u.avgReleaseMinutes ? `⚡ ${u.avgReleaseMinutes} min` : '—'

  // Build rating distribution from reviews
  const reviews = merchant.reviews ?? []
  const ratingCounts = [5, 4, 3, 2, 1].map(s => reviews.filter(r => Math.round(r.rating) === s).length)
  const totalReviews = reviews.length
  const ratingPcts = ratingCounts.map(c => totalReviews > 0 ? Math.round(c / totalReviews * 100) : 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', height: '60px' }}>
        <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>← Back to Marketplace</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initial}</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{displayName}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Merchant header */}
        <div style={{ background: 'linear-gradient(135deg,#fffbeb,#ffffff)', border: '1.5px solid #d97706', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800 }}>{merchantInitial}</div>
              {merchant.status === 'approved' && (
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#d97706', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '2px solid white' }}>👑</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 900 }}>{merchant.businessName ?? u.fullName ?? 'Merchant'}</span>
                {merchant.status === 'approved' && (
                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '13px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px' }}>👑 Verified Merchant</span>
                )}
                <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>✓ Full KYC</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '14px' }}>
                Member since {fmtDate(u.createdAt)}{u.city ? ` · ${u.city}` : ''}
              </div>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[
                  { v: totalTrades.toLocaleString(), l: 'Total Trades', c: '#1e293b' },
                  { v: `${completionRate.toFixed(1)}%`, l: 'Completion Rate', c: '#10b981' },
                  { v: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—', l: 'Avg Rating', c: '#f59e0b' },
                  { v: avgRelease, l: 'Avg Release Time', c: '#2563eb' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div>
            {/* Active Offers */}
            {merchant.ads && merchant.ads.length > 0 && (
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Active Offers</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {merchant.ads.map(ad => (
                    <div key={ad.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ background: ad.side === 'sell' ? '#eff6ff' : '#f0fdf4', color: ad.side === 'sell' ? '#1d4ed8' : '#15803d', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                            {ad.side.toUpperCase()} {ad.coin}
                          </span>
                          <span style={{ fontSize: '18px', fontWeight: 900 }}>{ad.price?.toLocaleString()} PKR/{ad.coin}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                          Limits: {ad.minOrder?.toLocaleString()} – {ad.maxOrder?.toLocaleString()} PKR
                        </div>
                      </div>
                      <Link href={`/marketplace?ad=${ad.id}`} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                        {ad.side === 'sell' ? 'Buy' : 'Sell'} {ad.coin} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>Reviews ({totalReviews})</div>
                {avgRating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 900, color: '#f59e0b' }}>{avgRating.toFixed(1)}</div>
                    <div>
                      <div style={{ color: '#f59e0b', fontSize: '18px' }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{totalReviews} ratings</div>
                    </div>
                  </div>
                )}
              </div>
              {totalReviews > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', width: '20px' }}>{star}★</span>
                      {starBar(ratingPcts[i], star >= 4 ? '#f59e0b' : star === 3 ? '#fed7aa' : '#fca5a5')}
                      <span style={{ fontSize: '12px', color: '#64748b', width: '30px' }}>{ratingPcts[i]}%</span>
                    </div>
                  ))}
                </div>
              )}
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '14px' }}>No reviews yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {reviews.slice(0, 5).map((r, i) => {
                    const rName = r.reviewer?.fullName ?? 'Anonymous'
                    const rInit = rName.charAt(0).toUpperCase()
                    return (
                      <div key={r.id} style={{ borderBottom: i < reviews.slice(0, 5).length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i < reviews.slice(0, 5).length - 1 ? '14px' : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{rInit}</div>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{rName.slice(0, 1) + '***'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        {r.comment && <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>"{r.comment}"</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Detailed Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                {[
                  ['Total Trades', totalTrades.toLocaleString()],
                  ['Completion Rate', completionRate > 0 ? `${completionRate.toFixed(1)}%` : '—'],
                  ['Avg Rating', avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—'],
                  ['Member Since', fmtDate(u.createdAt)],
                  ['City', u.city ?? '—'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{l}</span>
                    <strong style={{ color: '#1e293b' }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
            {merchant.paymentMethods && merchant.paymentMethods.length > 0 && (
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Payment Methods</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {merchant.paymentMethods.map(pm => (
                    <span key={pm} style={{ background: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{pm}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#1d4ed8' }}>
              🛡️ <strong>Trading Safety:</strong> Always verify payment in your own account before releasing. Never trust screenshots alone.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
