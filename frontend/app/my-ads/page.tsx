'use client'
import { useState } from 'react'
import Link from 'next/link'

type AdStatus = 'active' | 'paused' | 'completed'
type Filter = 'all' | AdStatus

interface Ad {
  id: string; type: 'BUY' | 'SELL'; coin: string; status: AdStatus; meta: string
  stats: { label: string; value: string; color?: string }[]; tags: string[]; completed?: boolean
}

const ads: Ad[] = [
  { id: 'AD-1042', type: 'BUY', coin: 'USDT (TRC-20)', status: 'active', meta: 'Ad #AD-1042 · Created 28 Apr 2026 · 3 trades today',
    stats: [{ label: 'Price / USDT', value: '283 PKR' }, { label: 'Price Type', value: 'Fixed' }, { label: 'Limit (PKR)', value: '1K – 20K' }, { label: 'Trades (30d)', value: '18', color: '#059669' }, { label: 'Completion', value: '99.2%', color: '#2563eb' }],
    tags: ['📱 JazzCash', '📱 Easypaisa', '🏦 Bank Transfer'] },
  { id: 'AD-1038', type: 'SELL', coin: 'BTC', status: 'active', meta: 'Ad #AD-1038 · Created 22 Apr 2026 · 1 trade today',
    stats: [{ label: 'Premium over market', value: '+1.5%' }, { label: 'Price Type', value: 'Floating' }, { label: 'Limit (PKR)', value: '5K – 200K' }, { label: 'Trades (30d)', value: '8', color: '#059669' }, { label: 'Completion', value: '100%', color: '#2563eb' }],
    tags: ['🏦 Bank Transfer (HBL, UBL)'] },
  { id: 'AD-1029', type: 'SELL', coin: 'USDT (ERC-20)', status: 'paused', meta: 'Ad #AD-1029 · Created 10 Apr 2026 · Paused by you on 02 May',
    stats: [{ label: 'Price / USDT', value: '281 PKR', color: '#94a3b8' }, { label: 'Price Type', value: 'Fixed', color: '#94a3b8' }, { label: 'Limit (PKR)', value: '5K – 50K', color: '#94a3b8' }, { label: 'Trades (30d)', value: '12', color: '#94a3b8' }, { label: 'Completion', value: '98.4%', color: '#94a3b8' }],
    tags: [] },
  { id: 'AD-1015', type: 'BUY', coin: 'ETH', status: 'completed', meta: 'Ad #AD-1015 · Limit reached · 50 USDT limit fully traded', stats: [], tags: [], completed: true },
]

export default function MyAdsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [statuses, setStatuses] = useState<Record<string, AdStatus>>(() => Object.fromEntries(ads.map(a => [a.id, a.status])))
  const [deleted, setDeleted] = useState<Set<string>>(new Set())

  const filtered = ads.filter(a => !deleted.has(a.id) && (filter === 'all' || statuses[a.id] === filter))

  const toggle = (id: string) => setStatuses(p => ({ ...p, [id]: p[id] === 'active' ? 'paused' : 'active' }))
  const del = (id: string) => setDeleted(p => new Set([...p, id]))

  const tabs: { key: Filter; label: string }[] = [{ key: 'all', label: 'All (4)' }, { key: 'active', label: 'Active (2)' }, { key: 'paused', label: 'Paused (1)' }, { key: 'completed', label: 'Completed (1)' }]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['/', 'Home'], ['/marketplace', 'Marketplace'], ['/wallet', 'Wallet'], ['/orders', 'Orders'], ['/my-ads', 'My Ads']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 14, color: label === 'My Ads' ? '#2563eb' : '#64748b', fontWeight: label === 'My Ads' ? 600 : 400, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>M</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>My Advertisements</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0 }}>Manage your P2P buy and sell offers</p>
          </div>
          <Link href="/create-ad"><button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Create New Ad</button></Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[['4', 'Total Ads', ''], ['2', 'Active', '#10b981'], ['1', 'Paused', '#f59e0b'], ['18', 'Trades This Month', '#2563eb']].map(([v, l, c]) => (
            <div key={l} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: c || '#1e293b' }}>{v}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: filter === key ? 700 : 500, color: filter === key ? '#1d4ed8' : '#64748b', background: filter === key ? 'white' : 'transparent', border: 'none', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>

        {/* Ads */}
        {filtered.map(ad => {
          const st = statuses[ad.id]
          const isPaused = st === 'paused'
          return (
            <div key={ad.id} style={{ background: isPaused || ad.completed ? '#f8fafc' : 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 12, opacity: ad.completed ? 0.55 : isPaused ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: ad.stats.length ? 16 : 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: ad.type === 'BUY' ? '#d1fae5' : '#fee2e2', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 800, color: ad.type === 'BUY' ? '#065f46' : '#991b1b' }}>{ad.type}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 17, fontWeight: 800 }}>{ad.coin}</span>
                      {st === 'active' && <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🟢 Active</span>}
                      {st === 'paused' && <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>⏸ Paused</span>}
                      {ad.completed && <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Completed</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{ad.meta}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {!ad.completed ? (
                    <>
                      <Link href={`/edit-ad?id=${ad.id}`}><button style={{ padding: '6px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>✏️ Edit</button></Link>
                      <button onClick={() => toggle(ad.id)} style={{ padding: '6px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: isPaused ? '#dcfce7' : 'white', color: isPaused ? '#166534' : '#374151' }}>{isPaused ? '▶ Activate' : '⏸ Pause'}</button>
                      <button onClick={() => del(ad.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑 Delete</button>
                    </>
                  ) : (
                    <button style={{ padding: '6px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Copy & Repost</button>
                  )}
                </div>
              </div>

              {ad.stats.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: ad.tags.length ? 16 : 0 }}>
                  {ad.stats.map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center', padding: 10, background: '#f8fafc', borderRadius: 10 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: color || '#1e293b' }}>{value}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              {ad.completed && <div style={{ fontSize: 12, color: '#94a3b8' }}>This ad's trading limit was fully filled. Create a new ad to continue trading.</div>}

              {ad.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12 }}>
                  {ad.tags.map((t, i) => (
                    <span key={i} style={{ background: t.includes('Bank') ? '#eff6ff' : '#f0fdf4', border: `1px solid ${t.includes('Bank') ? '#bfdbfe' : '#86efac'}`, color: t.includes('Bank') ? '#1d4ed8' : '#065f46', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No ads found</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>You have no ads in this category.</div>
            <Link href="/create-ad"><button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Create Your First Ad</button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
