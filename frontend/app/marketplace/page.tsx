'use client'
import { useState } from 'react'
import Link from 'next/link'

const listings = [
  { name: 'CryptoKing', initial: 'C', badge: '👑 Merchant', badgeStyle: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }, kyc: '✓ Full KYC', stars: '★★★★★', rating: 4.9, trades: 1240, completion: '99.2%', online: true, price: 280.50, vsMarket: '+0.16%', vsDir: 'up', limits: '1,000 — 200,000 PKR', avail: '5,000 USDT', release: '4 min', payments: [{ label: '⚡ JazzCash', style: { background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' } }, { label: '🏦 HBL Bank', style: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }], terms: 'Send from your own registered account only. No third-party payments.', gradient: 'linear-gradient(135deg,#1e3a5f,#2563eb)', opacity: 1 },
  { name: 'PKR_Pro', initial: 'P', badge: '✓ Verified', badgeStyle: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }, kyc: '✓ Full KYC', stars: '★★★★½', rating: 4.7, trades: 890, completion: '98.5%', online: true, price: 280.20, vsMarket: '+0.05%', vsDir: 'up', limits: '5,000 — 500,000 PKR', avail: '12,000 USDT', release: '7 min', payments: [{ label: '🏦 HBL Bank', style: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }, { label: '🏦 MCB Bank', style: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }, { label: '🏦 UBL Bank', style: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }], terms: 'Bank transfer only. Include your full name in remarks.', gradient: 'linear-gradient(135deg,#059669,#34d399)', opacity: 1 },
  { name: 'FastTrade', initial: 'F', badge: '👑 Merchant', badgeStyle: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }, kyc: '', stars: '★★★★★', rating: 4.8, trades: 654, completion: '99.0%', online: true, price: 279.90, vsMarket: '-0.05%', vsDir: 'down', limits: '2,000 — 100,000 PKR', avail: '2,200 USDT', release: '3 min', payments: [{ label: '💚 Easypaisa', style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' } }, { label: '⚡ JazzCash', style: { background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' } }], terms: 'Very fast — usually release within 3 minutes. 24/7 availability.', gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)', opacity: 1 },
  { name: 'KHI_Exchange', initial: 'K', badge: '✓ Verified', badgeStyle: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }, kyc: '', stars: '★★★★', rating: 4.4, trades: 312, completion: '96.8%', online: false, price: 279.50, vsMarket: '', vsDir: '', limits: '1,000 — 150,000 PKR', avail: '3,000 USDT', release: '10 min', payments: [{ label: '🏦 Bank Alfalah', style: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }, { label: '⚡ JazzCash', style: { background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' } }], terms: '', gradient: 'linear-gradient(135deg,#dc2626,#f87171)', opacity: 0.7 },
]

export default function MarketplacePage() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [coin, setCoin] = useState('USDT')
  const [sortActive, setSortActive] = useState('Best Rate')
  const [ratingActive, setRatingActive] = useState('Any')
  const [modal, setModal] = useState<{ name: string; rate: string } | null>(null)
  const [pkrAmount, setPkrAmount] = useState('5000')
  const [selectedPM, setSelectedPM] = useState(0)

  const coinColors: Record<string, string> = { USDT: '#26a17b', BTC: '#f7931a', ETH: '#627eea', USDC: '#2775ca' }
  const coins = [{ id: 'USDT', label: '₮ USDT' }, { id: 'BTC', label: '₿ BTC' }, { id: 'ETH', label: 'Ξ ETH' }, { id: 'USDC', label: '$ USDC' }]

  const usdtOut = modal ? (parseFloat(pkrAmount) / parseFloat(modal.rate)).toFixed(2) : '0'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/orders" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Orders</Link>
          <Link href="/create-ad" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
          <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>✓ KYC</span>
        </div>
      </nav>

      {/* Coin / Side Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setSide('buy')} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: side === 'buy' ? '#dcfce7' : '#f1f5f9', color: side === 'buy' ? '#166534' : '#64748b' }}>🟢 BUY</button>
            <button onClick={() => setSide('sell')} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: side === 'sell' ? '#fee2e2' : '#f1f5f9', color: side === 'sell' ? '#991b1b' : '#64748b' }}>🔴 SELL</button>
          </div>
          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {coins.map(c => (
              <button key={c.id} onClick={() => setCoin(c.id)} style={{ padding: '7px 14px', borderRadius: 20, border: coin === c.id ? 'none' : '1.5px solid #e2e8f0', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: coin === c.id ? coinColors[c.id] : 'white', color: coin === c.id ? 'white' : '#374151' }}>{c.label}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Market Rate:</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>280.05 PKR</span>
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>▲ +0.3%</span>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Filters</div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 10 }}>Payment Method</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ label: '⚡ JazzCash', s: { background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' } }, { label: '💚 Easypaisa', s: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' } }, { label: '🏦 Bank Transfer', s: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' } }, { label: 'Nayapay', s: { background: '#fce7f3', border: '1px solid #f9a8d4', color: '#9d174d' } }, { label: 'SadaPay', s: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' } }].map((pm, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#374151', padding: '4px 0' }}>
                  <input type="checkbox" defaultChecked={i < 3} style={{ accentColor: '#2563eb', width: 16, height: 16 }} />
                  <span style={{ ...pm.s, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 10 }}>Amount Range (PKR)</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input type="number" placeholder="Min" defaultValue="1000" style={{ flex: 1, padding: 8, fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none' }} />
              <input type="number" placeholder="Max" defaultValue="500000" style={{ flex: 1, padding: 8, fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 10 }}>Merchant Type</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#374151', padding: '4px 0', marginBottom: 6 }}><input type="checkbox" defaultChecked style={{ accentColor: '#2563eb', width: 16, height: 16 }} /> 👑 Verified Merchants Only</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#374151', padding: '4px 0' }}><input type="checkbox" style={{ accentColor: '#2563eb', width: 16, height: 16 }} /> 🟢 Online Now Only</label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: 10 }}>Minimum Rating</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Any', '★4.0+', '★4.5+', '★4.8+'].map(r => (
                <button key={r} onClick={() => setRatingActive(r)} style={{ padding: '7px 12px', border: `1.5px solid ${ratingActive === r ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: ratingActive === r ? '#eff6ff' : 'white', color: ratingActive === r ? '#1d4ed8' : '#374151' }}>{r}</button>
              ))}
            </div>
          </div>

          <button style={{ width: '100%', padding: '9px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white', color: '#374151' }}>Clear Filters</button>
        </div>

        {/* Listings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              {side === 'buy' ? 'Buy' : 'Sell'} {coin} <span style={{ color: '#64748b', fontWeight: 400, marginLeft: 8 }}>48 offers available</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Sort by:</span>
              {['Best Rate', 'Fastest Release', 'Highest Rating'].map(s => (
                <button key={s} onClick={() => setSortActive(s)} style={{ padding: '7px 12px', border: `1.5px solid ${sortActive === s ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: sortActive === s ? '#eff6ff' : 'white', color: sortActive === s ? '#1d4ed8' : '#374151' }}>{s}</button>
              ))}
            </div>
          </div>

          {listings.map((ad, i) => (
            <div key={i} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 12, opacity: ad.opacity, transition: 'all 0.2s' }}
              onMouseEnter={e => { if (ad.opacity === 1) { (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,99,235,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: ad.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{ad.initial}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{ad.name}</span>
                      <span style={{ ...ad.badgeStyle, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{ad.badge}</span>
                      {ad.kyc && <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{ad.kyc}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ color: '#f59e0b' }}>{ad.stars}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{ad.rating}</span>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{ad.trades.toLocaleString()} trades</span>
                      <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>{ad.completion} completion</span>
                      <span>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: ad.online ? '#10b981' : '#94a3b8', marginRight: 4 }} />
                        <span style={{ fontSize: 12, color: '#64748b' }}>{ad.online ? 'Online' : 'Away 2h ago'}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b' }}>{ad.price.toFixed(2)} <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                  {ad.vsMarket && <div style={{ fontSize: 12, color: ad.vsDir === 'up' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{ad.vsDir === 'up' ? '▲' : '▼'} {ad.vsMarket} vs market</div>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>Limits: <strong style={{ color: '#1e293b' }}>{ad.limits}</strong></div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Avail: <strong style={{ color: '#1e293b' }}>{ad.avail}</strong></div>
                <div style={{ fontSize: 13, color: '#64748b' }}>⚡ Avg release: <strong style={{ color: '#1e293b' }}>{ad.release}</strong></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ad.payments.map((p, j) => <span key={j} style={{ ...p.style, borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{p.label}</span>)}
                </div>
                <button onClick={() => setModal({ name: ad.name, rate: ad.price.toString() })} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  {side === 'buy' ? 'Buy' : 'Sell'} {coin} →
                </button>
              </div>

              {ad.terms && <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>📋 Terms: "{ad.terms}"</div>}
            </div>
          ))}

          <div style={{ textAlign: 'center', padding: 24, color: '#64748b', fontSize: 14 }}>
            Showing 4 of 48 offers · <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Load More</a>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {modal && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(null) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{side === 'buy' ? 'Buy' : 'Sell'} {coin} from {modal.name}</div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Rate: <strong>{modal.rate}</strong> PKR / {coin}</div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <div style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Protected by PakSwap Escrow</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{coin} will be locked until payment confirmed</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>I want to pay (PKR)</label>
              <div style={{ position: 'relative', marginTop: 6 }}>
                <input type="number" value={pkrAmount} onChange={e => setPkrAmount(e.target.value)} style={{ width: '100%', padding: '14px', paddingRight: 60, fontSize: 22, fontWeight: 800, border: '1.5px solid #e2e8f0', borderRadius: 10, outline: 'none', boxSizing: 'border-box' }} />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#94a3b8' }}>
                <span>Min: 1,000 PKR</span><span>Max: 200,000 PKR</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#64748b' }}>You will receive:</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#26a17b' }}>{usdtOut} {coin}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Platform fee (0%):</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>FREE 🎉</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {['⚡ JazzCash', '🏦 HBL Bank'].map((pm, i) => (
                  <div key={i} onClick={() => setSelectedPM(i)} style={{ flex: 1, minWidth: 120, border: `2px solid ${selectedPM === i ? '#2563eb' : '#e2e8f0'}`, background: selectedPM === i ? '#eff6ff' : 'white', borderRadius: 10, padding: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: selectedPM === i ? '#1d4ed8' : '#374151', cursor: 'pointer' }}>{pm}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white', color: '#374151' }}>Cancel</button>
              <Link href="/trade" style={{ flex: 2, textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Confirm & Start Trade →</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
