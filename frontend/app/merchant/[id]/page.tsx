'use client'
import Link from 'next/link'

export default function MerchantPage() {
  const reviews = [
    { init: 'A', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', name: 'Asim K***', stars: 5, date: '04 May 2026', text: '"Fast release, highly recommended! Sent USDT within 3 minutes. Very professional."' },
    { init: 'R', bg: 'linear-gradient(135deg,#059669,#34d399)', name: 'Raza M***', stars: 5, date: '02 May 2026', text: '"Smooth transaction from start to finish. Will trade again!"' },
    { init: 'K', bg: 'linear-gradient(135deg,#dc2626,#f87171)', name: 'Khalid T***', stars: 4, date: '28 Apr 2026', text: '"Good merchant, slight delay one time but resolved it quickly."' },
  ]

  const ratings = [
    { star: '5★', pct: 88, color: '#f59e0b' },
    { star: '4★', pct: 9, color: '#fde68a' },
    { star: '3★', pct: 2, color: '#fed7aa' },
    { star: '1★', pct: 1, color: '#fca5a5' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', height: '60px' }}>
        <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>← Back to Marketplace</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Merchant header */}
        <div style={{ background: 'linear-gradient(135deg,#fffbeb,#ffffff)', border: '1.5px solid #d97706', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800 }}>C</div>
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#d97706', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '2px solid white' }}>👑</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 900 }}>CryptoKing</span>
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '13px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px' }}>👑 Verified Merchant</span>
                <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>✓ Full KYC</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Online Now
                </span>
              </div>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '14px' }}>Member since January 2025 · Karachi, Pakistan</div>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[
                  { v: '1,240', l: 'Total Trades', c: '#1e293b' },
                  { v: '99.2%', l: 'Completion Rate', c: '#10b981' },
                  { v: '4.9 ★', l: 'Avg Rating', c: '#f59e0b' },
                  { v: '⚡ 4 min', l: 'Avg Release Time', c: '#2563eb' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => alert('Blocked!')} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Block Merchant</button>
              <button onClick={() => alert('Reported!')} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Report</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div>
            {/* About */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>About</div>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0 }}>Fast and reliable P2P trader since 2023. I release USDT within 5 minutes of payment confirmation. I accept JazzCash and HBL bank transfers. Please send from your own registered account. Available 9AM–11PM PKT daily.</p>
            </div>

            {/* Active Offers */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Active Offers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { badge: 'SELL USDT', price: '280.50 PKR/USDT', premium: '▲ +0.16%', limits: '1,000–200,000 PKR · Available: 5,000 USDT', pills: ['⚡ JazzCash', '🏦 HBL'] },
                  { badge: 'SELL USDT', price: '280.20 PKR/USDT', premium: '', limits: '500–50,000 PKR', pills: ['🏦 HBL'] },
                ].map((o, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{o.badge}</span>
                        <span style={{ fontSize: '18px', fontWeight: 900 }}>{o.price}</span>
                        {o.premium && <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{o.premium}</span>}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Limits: {o.limits}</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        {o.pills.map(p => <span key={p} style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p}</span>)}
                      </div>
                    </div>
                    <Link href="/trade/new" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Buy USDT →</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>Reviews (1,240)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#f59e0b' }}>4.9</div>
                  <div>
                    <div style={{ color: '#f59e0b', fontSize: '18px' }}>★★★★★</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>1,240 ratings</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                {ratings.map(r => (
                  <div key={r.star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', width: '20px' }}>{r.star}</span>
                    <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
                      <div style={{ width: `${r.pct}%`, background: r.color, height: '100%', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', width: '30px' }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map((r, i) => (
                  <div key={r.name} style={{ borderBottom: i < reviews.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i < reviews.length - 1 ? '14px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{r.init}</div>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{r.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.stars)}{'★'.repeat(5 - r.stars).split('').map(() => '☆').join('')}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{r.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', marginTop: '16px', padding: '10px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>View All 1,240 Reviews</button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Detailed Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                {[
                  ['Total Volume', '~18.5M PKR'],
                  ['Buy Trades', '420'],
                  ['Sell Trades', '820'],
                  ['Disputes Won', '4/5 (80%)'],
                  ['First Trade', 'Jan 2025'],
                  ['Response Time', '⚡ Usually instant'],
                ].map(([l, v], i) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{l}</span>
                    <strong style={{ color: i === 3 ? '#10b981' : '#1e293b' }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Payment Methods</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>⚡ JazzCash</span>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>🏦 HBL Bank Transfer</span>
              </div>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#1d4ed8' }}>
              🛡️ <strong>Trading Safety:</strong> Always verify payment in your own account before releasing. Never trust screenshots alone.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
