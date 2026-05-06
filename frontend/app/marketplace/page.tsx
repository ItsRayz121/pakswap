'use client'
import { useState } from 'react'
import Link from 'next/link'

const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }

const listings = [
  { name: 'CryptoKing', initial: 'C', avatarBg: 'linear-gradient(135deg,#2563eb,#60a5fa)', badge: '👑 Merchant', badgeBg: '#fef3c7', badgeColor: '#92400e', kyc: '✓ Full KYC', rating: '★★★★★', stars: '4.9', trades: '1,240', completion: '99.2%', online: true, price: '280.50', priceVs: '▲ +0.16% vs market', priceVsColor: '#10b981', limits: '1,000 — 200,000', avail: '5,000 USDT', release: '4 min', payments: ['⚡ JazzCash', '🏦 HBL Bank'], terms: 'Send from your own registered account only. No third-party payments.', opacity: 1 },
  { name: 'PKR_Pro', initial: 'P', avatarBg: 'linear-gradient(135deg,#059669,#34d399)', badge: '✓ Verified', badgeBg: '#dbeafe', badgeColor: '#1d4ed8', kyc: '✓ Full KYC', rating: '★★★★½', stars: '4.7', trades: '890', completion: '98.5%', online: true, price: '280.20', priceVs: '▲ +0.05% vs market', priceVsColor: '#10b981', limits: '5,000 — 500,000', avail: '12,000 USDT', release: '7 min', payments: ['🏦 HBL Bank', '🏦 MCB Bank', '🏦 UBL Bank'], terms: 'Bank transfer only. Include your full name in remarks.', opacity: 1 },
  { name: 'FastTrade', initial: 'F', avatarBg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '👑 Merchant', badgeBg: '#fef3c7', badgeColor: '#92400e', kyc: '', rating: '★★★★★', stars: '4.8', trades: '654', completion: '99.0%', online: true, price: '279.90', priceVs: '▼ -0.05% vs market', priceVsColor: '#f59e0b', limits: '2,000 — 100,000', avail: '2,200 USDT', release: '3 min', payments: ['💚 Easypaisa', '⚡ JazzCash'], terms: 'Very fast — usually release within 3 minutes. 24/7 availability.', opacity: 1 },
  { name: 'KHI_Exchange', initial: 'K', avatarBg: 'linear-gradient(135deg,#dc2626,#f87171)', badge: '✓ Verified', badgeBg: '#dbeafe', badgeColor: '#1d4ed8', kyc: '', rating: '★★★★', stars: '4.4', trades: '312', completion: '96.8%', online: false, price: '279.50', priceVs: '', priceVsColor: '', limits: '1,000 — 100,000', avail: '1,800 USDT', release: '10 min', payments: ['🏦 Bank Alfalah', '⚡ JazzCash'], terms: '', opacity: 0.7 },
]

export default function MarketplacePage() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [coin, setCoin] = useState('USDT')
  const [sort, setSort] = useState('Best Rate')
  const [modal, setModal] = useState<typeof listings[0] | null>(null)
  const [pkrAmount, setPkrAmount] = useState('5000')
  const [pm, setPm] = useState(0)

  const rate = modal ? parseFloat(modal.price) : 280.50
  const usdtOut = (parseFloat(pkrAmount) / rate || 0).toFixed(2)

  const coins = [
    { sym: 'USDT', label: '₮ USDT', bg: '#26a17b' },
    { sym: 'BTC', label: '₿ BTC', bg: '#f7931a' },
    { sym: 'ETH', label: 'Ξ ETH', bg: '#627eea' },
    { sym: 'USDC', label: '$ USDC', bg: '#2775ca' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace', active: true }, { label: 'Wallet', href: '/wallet' }, { label: 'Orders', href: '/orders' }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>✓ KYC</span>
        </div>
      </nav>

      {/* Coin/Side bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setSide('buy')} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: side === 'buy' ? '#dcfce7' : '#f1f5f9', color: side === 'buy' ? '#166534' : '#64748b' }}>🟢 BUY</button>
            <button onClick={() => setSide('sell')} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: side === 'sell' ? '#fee2e2' : '#f1f5f9', color: side === 'sell' ? '#991b1b' : '#64748b' }}>🔴 SELL</button>
          </div>
          <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {coins.map(c => (
              <button key={c.sym} onClick={() => setCoin(c.sym)} style={{ padding: '7px 14px', borderRadius: '20px', border: coin === c.sym ? 'none' : '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: 700, background: coin === c.sym ? c.bg : 'white', color: coin === c.sym ? 'white' : '#374151', cursor: 'pointer' }}>{c.label}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Market Rate:</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>280.05 PKR</span>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>▲ +0.3%</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Filters</div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '10px' }}>Payment Method</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: '⚡ JazzCash', bg: '#fffbeb', border: '#fde68a', color: '#92400e', checked: true },
                { label: '💚 Easypaisa', bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', checked: true },
                { label: '🏦 Bank Transfer', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', checked: true },
                { label: 'Nayapay', bg: '#fce7f3', border: '#f9a8d4', color: '#9d174d', checked: false },
                { label: 'SadaPay', bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', checked: false },
              ].map(p => (
                <label key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', padding: '4px 0' }}>
                  <input type="checkbox" defaultChecked={p.checked} style={{ accentColor: '#2563eb', width: '16px', height: '16px' }} />
                  <span style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 20px' }} />

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '10px' }}>Amount Range (PKR)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" defaultValue="1000" placeholder="Min" style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
              <input type="number" defaultValue="500000" placeholder="Max" style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 20px' }} />

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '10px' }}>Merchant Type</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '6px' }}><input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} /> 👑 Verified Merchants Only</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}><input type="checkbox" style={{ accentColor: '#2563eb' }} /> 🟢 Online Now Only</label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 20px' }} />

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '10px' }}>Minimum Rating</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Any', '★4.0+', '★4.5+', '★4.8+'].map(r => (
                <button key={r} style={{ padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: 'white', color: '#374151' }}>{r}</button>
              ))}
            </div>
          </div>

          <button style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>Clear Filters</button>
        </div>

        {/* Listings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              {side === 'buy' ? 'Buy' : 'Sell'} {coin} <span style={{ color: '#64748b', fontWeight: 400, marginLeft: '8px' }}>48 offers available</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Sort by:</span>
              {['Best Rate', 'Fastest Release', 'Highest Rating'].map(s => (
                <button key={s} onClick={() => setSort(s)} style={{ padding: '7px 12px', border: `1.5px solid ${sort === s ? '#93c5fd' : '#e2e8f0'}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: sort === s ? '#eff6ff' : 'white', color: sort === s ? '#1d4ed8' : '#374151', fontWeight: sort === s ? 700 : 400 }}>{s}</button>
              ))}
            </div>
          </div>

          {listings.map(l => (
            <div key={l.name} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px', opacity: l.opacity, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: l.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>{l.initial}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800 }}>{l.name}</span>
                      <span style={{ background: l.badgeBg, color: l.badgeColor, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{l.badge}</span>
                      {l.kyc && <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{l.kyc}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#f59e0b' }}>{l.rating}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{l.stars}</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{l.trades} trades</span>
                      <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>{l.completion} completion</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: l.online ? '#10b981' : '#94a3b8', marginRight: '4px' }}></span>
                        {l.online ? 'Online' : 'Away 2h ago'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e293b' }}>{l.price} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                  {l.priceVs && <div style={{ fontSize: '12px', color: l.priceVsColor, fontWeight: 600 }}>{l.priceVs}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Limits: <strong style={{ color: '#1e293b' }}>{l.limits} PKR</strong></div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Avail: <strong style={{ color: '#1e293b' }}>{l.avail}</strong></div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>⚡ Avg release: <strong style={{ color: '#1e293b' }}>{l.release}</strong></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {l.payments.map(p => (
                    <span key={p} style={{ background: p.includes('Jazz') ? '#fffbeb' : p.includes('Easy') ? '#f0fdf4' : '#eff6ff', border: `1px solid ${p.includes('Jazz') ? '#fde68a' : p.includes('Easy') ? '#bbf7d0' : '#bfdbfe'}`, color: p.includes('Jazz') ? '#92400e' : p.includes('Easy') ? '#166534' : '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
                <button onClick={() => { setModal(l); setPkrAmount('5000'); setPm(0); }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {side === 'buy' ? 'Buy' : 'Sell'} {coin} →
                </button>
              </div>
              {l.terms && <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>📋 Terms: "{l.terms}"</div>}
            </div>
          ))}

          <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>
            Showing 4 of 48 offers · <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Load More</a>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{side === 'buy' ? 'Buy' : 'Sell'} {coin} from {modal.name}</div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Rate: <strong>{modal.price}</strong> PKR / {coin}</div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Protected by PakSwap Escrow</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>{coin} will be locked until payment confirmed</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>I want to pay (PKR)</label>
              <div style={{ position: 'relative', marginTop: '6px' }}>
                <input type="number" value={pkrAmount} onChange={e => setPkrAmount(e.target.value)} style={{ width: '100%', padding: '14px', paddingRight: '60px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '22px', fontWeight: 800, boxSizing: 'border-box' }} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#94a3b8' }}>
                <span>Min: 1,000 PKR</span><span>Max: 200,000 PKR</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>You will receive:</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#26a17b' }}>{usdtOut} {coin}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Platform fee (0%):</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>FREE 🎉</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {modal.payments.map((p, i) => (
                  <div key={p} onClick={() => setPm(i)} style={{ flex: 1, minWidth: '120px', border: `2px solid ${pm === i ? '#2563eb' : '#e2e8f0'}`, background: pm === i ? '#eff6ff' : 'white', borderRadius: '10px', padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: pm === i ? '#1d4ed8' : '#374151', cursor: 'pointer' }}>{p}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <Link href="/trade/demo" style={{ flex: 2 }}>
                <button style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Confirm &amp; Start Trade →</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
