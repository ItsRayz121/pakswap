'use client'
import { useState } from 'react'
import Link from 'next/link'

type AdStatus = 'active' | 'paused' | 'completed'

interface Ad {
  id: string
  type: 'BUY' | 'SELL'
  token: string
  status: AdStatus
  adNum: string
  created: string
  today: string
  price: string
  priceType: string
  limit: string
  trades: string
  completion: string
  payments: { label: string; color: string; bg: string; border: string }[]
  completedNote?: string
}

const INIT_ADS: Ad[] = [
  {
    id: '1', type: 'BUY', token: 'USDT (TRC-20)', status: 'active',
    adNum: '#AD-1042', created: 'Created 28 Apr 2026', today: '3 trades today',
    price: '283 PKR', priceType: 'Fixed', limit: '1K – 20K', trades: '18', completion: '99.2%',
    payments: [
      { label: '📱 JazzCash', color: '#065f46', bg: '#f0fdf4', border: '#86efac' },
      { label: '📱 Easypaisa', color: '#065f46', bg: '#f0fdf4', border: '#86efac' },
      { label: '🏦 Bank Transfer', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    ],
  },
  {
    id: '2', type: 'SELL', token: 'BTC', status: 'active',
    adNum: '#AD-1038', created: 'Created 22 Apr 2026', today: '1 trade today',
    price: '+1.5%', priceType: 'Floating', limit: '5K – 200K', trades: '8', completion: '100%',
    payments: [
      { label: '🏦 Bank Transfer (HBL, UBL)', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    ],
  },
  {
    id: '3', type: 'SELL', token: 'USDT (ERC-20)', status: 'paused',
    adNum: '#AD-1029', created: 'Created 10 Apr 2026', today: 'Paused by you on 02 May',
    price: '281 PKR', priceType: 'Fixed', limit: '5K – 50K', trades: '12', completion: '98.4%',
    payments: [],
  },
  {
    id: '4', type: 'BUY', token: 'ETH', status: 'completed',
    adNum: '#AD-1015', created: 'Limit reached', today: '50 USDT limit fully traded',
    price: '', priceType: '', limit: '', trades: '', completion: '',
    payments: [],
    completedNote: "This ad's trading limit was fully filled. Create a new ad to continue trading.",
  },
]

export default function MyAdsPage() {
  const [tab, setTab] = useState<'all' | AdStatus>('all')
  const [ads, setAds] = useState<Ad[]>(INIT_ADS)

  const visible = ads.filter(a => tab === 'all' || a.status === tab)

  function toggleAd(id: string) {
    setAds(prev => prev.map(a => {
      if (a.id !== id) return a
      return { ...a, status: a.status === 'active' ? 'paused' : 'active' }
    }))
  }

  function deleteAd(id: string) {
    if (confirm('Delete this ad? This cannot be undone. Active trades will not be affected.')) {
      setAds(prev => prev.filter(a => a.id !== id))
    }
  }

  const tabs: { key: 'all' | AdStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: ads.length },
    { key: 'active', label: 'Active', count: ads.filter(a => a.status === 'active').length },
    { key: 'paused', label: 'Paused', count: ads.filter(a => a.status === 'paused').length },
    { key: 'completed', label: 'Completed', count: ads.filter(a => a.status === 'completed').length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        {['Home', 'Marketplace', 'Wallet', 'Orders', 'My Ads'].map(n => (
          <Link key={n} href={`/${n.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '14px', color: n === 'My Ads' ? '#2563eb' : '#64748b', fontWeight: n === 'My Ads' ? 700 : 500, textDecoration: 'none' }}>{n}</Link>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>M</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>My Advertisements</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Manage your P2P buy and sell offers</p>
          </div>
          <Link href="/create-ad" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>+ Create New Ad</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { v: '4', l: 'Total Ads', c: '#1e293b' },
            { v: '2', l: 'Active', c: '#10b981' },
            { v: '1', l: 'Paused', c: '#f59e0b' },
            { v: '18', l: 'Trades This Month', c: '#2563eb' },
          ].map(s => (
            <div key={s.l} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', gap: '4px', marginBottom: '20px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: tab === t.key ? 'white' : 'transparent', color: tab === t.key ? '#2563eb' : '#64748b', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {visible.map(ad => {
          const isPaused = ad.status === 'paused'
          const isCompleted = ad.status === 'completed'
          return (
            <div key={ad.id} style={{ background: isPaused || isCompleted ? '#f8fafc' : 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px', opacity: isCompleted ? 0.55 : isPaused ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: isCompleted ? '12px' : '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: ad.type === 'BUY' ? '#d1fae5' : '#fee2e2', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: 800, color: ad.type === 'BUY' ? '#065f46' : '#991b1b' }}>{ad.type}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800 }}>{ad.token}</span>
                      {ad.status === 'active' && <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>🟢 Active</span>}
                      {ad.status === 'paused' && <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>⏸ Paused</span>}
                      {ad.status === 'completed' && <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>✓ Completed</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{ad.adNum} · {ad.created} · {ad.today}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {isCompleted ? (
                    <button onClick={() => alert('Creating a copy of this ad...')} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Copy & Repost</button>
                  ) : (
                    <>
                      <Link href={`/edit-ad?id=${ad.adNum.replace('#AD-', '')}`} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151', textDecoration: 'none' }}>✏️ Edit</Link>
                      <button onClick={() => toggleAd(ad.id)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>
                        {isPaused ? '▶ Activate' : '⏸ Pause'}
                      </button>
                      <button onClick={() => deleteAd(ad.id)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #fca5a5', background: '#fef2f2', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>🗑 Delete</button>
                    </>
                  )}
                </div>
              </div>

              {isCompleted ? (
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{ad.completedNote}</div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { v: ad.price, l: ad.priceType === 'Floating' ? 'Premium over market' : 'Price / USDT', c: isPaused ? '#94a3b8' : '#1e293b' },
                      { v: ad.priceType, l: 'Price Type', c: isPaused ? '#94a3b8' : '#1e293b' },
                      { v: ad.limit, l: 'Limit (PKR)', c: isPaused ? '#94a3b8' : '#1e293b' },
                      { v: ad.trades, l: 'Trades (30d)', c: isPaused ? '#94a3b8' : '#059669' },
                      { v: ad.completion, l: 'Completion', c: isPaused ? '#94a3b8' : '#2563eb' },
                    ].map(s => (
                      <div key={s.l} style={{ textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: s.c }}>{s.v}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  {ad.payments.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                      {ad.payments.map(p => (
                        <span key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color, padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>{p.label}</span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>No ads found</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>You have no ads in this category.</div>
            <Link href="/create-ad" style={{ padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>+ Create Your First Ad</Link>
          </div>
        )}
      </div>
    </div>
  )
}
