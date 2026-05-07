'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { adsApi } from '@/lib/api'

interface Ad {
  id: string
  side: string
  coin: string
  fixedPrice: number
  totalAmount: number
  availableAmount: number
  minOrderFiat: number
  maxOrderFiat: number
  paymentMethods: string[]
  status: string
  createdAt: string
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  active:  { label: 'Active',  bg: '#d1fae5', color: '#065f46' },
  paused:  { label: 'Paused',  bg: '#fef3c7', color: '#92400e' },
  deleted: { label: 'Deleted', bg: '#fee2e2', color: '#991b1b' },
}

export default function MyAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchAds = useCallback(async () => {
    try {
      const res = await adsApi.getMyAds()
      setAds(res.data.data ?? [])
    } catch {
      setAds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAds() }, [fetchAds])

  async function toggleStatus(ad: Ad) {
    setActionLoading(ad.id)
    try {
      if (ad.status === 'active') await adsApi.pause(ad.id)
      else await adsApi.activate(ad.id)
      fetchAds()
    } catch {} finally {
      setActionLoading(null)
    }
  }

  async function deleteAd(id: string) {
    if (!confirm('Delete this ad? This cannot be undone.')) return
    setActionLoading(id)
    try {
      await adsApi.delete(id)
      fetchAds()
    } catch {} finally {
      setActionLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>My Ads</span>
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/create-ad" style={{ padding: '9px 18px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>My Ads</h1>
          <div style={{ fontSize: '14px', color: '#64748b' }}>{ads.length} total</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8' }}>Loading ads...</div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No ads yet</div>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Create your first P2P ad to start trading</div>
            <Link href="/create-ad" style={{ display: 'inline-block', padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}>+ Create Ad</Link>
          </div>
        ) : ads.map(ad => {
          const st = STATUS_META[ad.status] ?? { label: ad.status, bg: '#f1f5f9', color: '#64748b' }
          const isLoading = actionLoading === ad.id
          return (
            <div key={ad.id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ background: ad.side === 'sell' ? '#fee2e2' : '#dcfce7', color: ad.side === 'sell' ? '#991b1b' : '#166534', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                      {ad.side.toUpperCase()} {ad.coin}
                    </span>
                    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{st.label}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>#{ad.id.slice(0, 8)}</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>{ad.fixedPrice?.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
                    <span>Limits: <strong style={{ color: '#1e293b' }}>{ad.minOrderFiat?.toLocaleString()} — {ad.maxOrderFiat?.toLocaleString()} PKR</strong></span>
                    <span>Available: <strong style={{ color: '#1e293b' }}>{ad.availableAmount} / {ad.totalAmount} {ad.coin}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {ad.paymentMethods?.map(pm => (
                      <span key={pm} style={{ background: '#f1f5f9', color: '#374151', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{pm}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <Link href={`/edit-ad/${ad.id}`} style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none', color: '#374151' }}>Edit</Link>
                  {ad.status !== 'deleted' && (
                    <button onClick={() => toggleStatus(ad)} disabled={isLoading}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: ad.status === 'active' ? '#92400e' : '#065f46' }}>
                      {isLoading ? '...' : ad.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  )}
                  {ad.status !== 'deleted' && (
                    <button onClick={() => deleteAd(ad.id)} disabled={isLoading}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #fca5a5', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                Created {new Date(ad.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
