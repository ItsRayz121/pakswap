'use client'
import Link from 'next/link'

export default function MerchantPage() {
  const ratings = [{ stars: '5★', pct: '88%', w: '88%', color: '#f59e0b' }, { stars: '4★', pct: '9%', w: '9%', color: '#fde68a' }, { stars: '3★', pct: '2%', w: '2%', color: '#fed7aa' }, { stars: '1★', pct: '1%', w: '1%', color: '#fca5a5' }]
  const reviews = [
    { init: 'A', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', name: 'Asim K***', date: '04 May 2026', stars: 5, text: '"Fast release, highly recommended! Sent USDT within 3 minutes. Very professional."' },
    { init: 'R', bg: 'linear-gradient(135deg,#059669,#34d399)', name: 'Raza M***', date: '02 May 2026', stars: 5, text: '"Smooth transaction from start to finish. Will trade again!"' },
    { init: 'K', bg: 'linear-gradient(135deg,#dc2626,#f87171)', name: 'Khalid T***', date: '28 Apr 2026', stars: 4, text: '"Good merchant, slight delay one time but resolved it quickly."' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/marketplace" style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>← Back to Marketplace</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header Card */}
        <div style={{ background: 'linear-gradient(135deg,#fffbeb,#ffffff)', border: '1.5px solid #d97706', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>C</div>
              <div style={{ position: 'absolute', bottom: -4, right: -4, background: '#d97706', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: '2px solid white' }}>👑</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 900 }}>CryptoKing</span>
                <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>👑 Verified Merchant</span>
                <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>✓ Full KYC</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /><span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Online Now</span></span>
              </div>
              <div style={{ color: '#64748b', fontSize: 14, marginBottom: 14 }}>Member since January 2025 · Karachi, Pakistan</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[['1,240', 'Total Trades', '#1e293b'], ['99.2%', 'Completion Rate', '#10b981'], ['4.9 ★', 'Avg Rating', '#f59e0b'], ['⚡ 4 min', 'Avg Release Time', '#2563eb']].map(([v, l, c]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: c }}>{v}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600 }}>Block Merchant</button>
              <button style={{ padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600 }}>Report</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div>
            {/* About */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>About</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>Fast and reliable P2P trader since 2023. I release USDT within 5 minutes of payment confirmation. I accept JazzCash and HBL bank transfers. Please send from your own registered account. Available 9AM–11PM PKT daily.</p>
            </div>

            {/* Active Offers */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Active Offers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ rate: '280.50 PKR/USDT', diff: '▲ +0.16%', limits: '1,000–200,000 PKR', avail: '5,000 USDT', pills: ['⚡ JazzCash', '🏦 HBL'] }, { rate: '280.20 PKR/USDT', diff: '', limits: '500–50,000 PKR', avail: '', pills: ['🏦 HBL'] }].map(({ rate, diff, limits, avail, pills }) => (
                  <div key={rate} style={{ background: '#f8fafc', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>SELL USDT</span>
                        <span style={{ fontSize: 18, fontWeight: 900 }}>{rate}</span>
                        {diff && <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>{diff}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Limits: {limits}{avail ? ` · Available: ${avail}` : ''}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        {pills.map(p => <span key={p} style={{ background: p.includes('Jazz') ? '#f0fdf4' : '#eff6ff', color: p.includes('Jazz') ? '#065f46' : '#1d4ed8', border: `1px solid ${p.includes('Jazz') ? '#86efac' : '#bfdbfe'}`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{p}</span>)}
                      </div>
                    </div>
                    <Link href="/trade/1"><button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Buy USDT →</button></Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Reviews (1,240)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>4.9</div>
                  <div>
                    <div style={{ color: '#f59e0b', fontSize: 18 }}>★★★★★</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>1,240 ratings</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                {ratings.map(({ stars, pct, w, color }) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#64748b', width: 20 }}>{stars}</span>
                    <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 8 }}><div style={{ width: w, background: color, height: '100%', borderRadius: 4 }} /></div>
                    <span style={{ fontSize: 12, color: '#64748b', width: 30 }}>{pct}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map(({ init, bg, name, date, stars, text }, i) => (
                  <div key={name} style={{ borderBottom: i < reviews.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i < reviews.length - 1 ? 14 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{init}</div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#f59e0b' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', padding: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14, marginTop: 16, fontWeight: 600 }}>View All 1,240 Reviews</button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Detailed Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                {[['Total Volume', '~18.5M PKR'], ['Buy Trades', '420'], ['Sell Trades', '820'], ['Disputes Won', '4/5 (80%)'], ['First Trade', 'Jan 2025'], ['Response Time', '⚡ Usually instant']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{l}</span>
                    <strong style={{ color: l === 'Disputes Won' ? '#10b981' : undefined }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Payment Methods</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['⚡ JazzCash', '🏦 HBL Bank Transfer'].map(p => (
                  <span key={p} style={{ background: p.includes('Jazz') ? '#f0fdf4' : '#eff6ff', color: p.includes('Jazz') ? '#065f46' : '#1d4ed8', border: `1px solid ${p.includes('Jazz') ? '#86efac' : '#bfdbfe'}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 700, display: 'block' }}>{p}</span>
                ))}
              </div>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#1e40af' }}>
              🛡️ <strong>Trading Safety:</strong> Always verify payment in your own account before releasing. Never trust screenshots alone.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
