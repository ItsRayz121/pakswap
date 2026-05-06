'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [timer, setTimer] = useState(764)

  useEffect(() => {
    const id = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(id)
  }, [])

  const m = Math.floor(timer / 60), s = timer % 60
  const timerStr = timer > 0 ? `${m}:${s < 10 ? '0' : ''}${s} left` : 'Expired'

  const coins = [
    { sym: '₮', bg: '#26a17b', name: 'USDT', sub: 'Tether', price: '280.5 PKR', change: '+0.18%', up: true },
    { sym: '₿', bg: '#f7931a', name: 'BTC', sub: 'Bitcoin', price: '19.2M PKR', change: '+1.42%', up: true },
    { sym: 'Ξ', bg: '#627eea', name: 'ETH', sub: 'Ethereum', price: '1,044K PKR', change: '-0.32%', up: false },
    { sym: '$', bg: '#2775ca', name: 'USDC', sub: 'USD Coin', price: '280.1 PKR', change: '+0.11%', up: true },
  ]

  const quickActions = [
    { href: '/marketplace', icon: '🛒', label: 'Buy Crypto', sub: 'Browse P2P offers' },
    { href: '/marketplace', icon: '💰', label: 'Sell Crypto', sub: 'Post or find buyers' },
    { href: '/instant-buy', icon: '⚡', label: 'Instant Buy', sub: 'JazzCash / Easypaisa' },
    { href: '/wallet', icon: '📥', label: 'Deposit', sub: 'Add crypto to wallet' },
    { href: '/wallet', icon: '📤', label: 'Withdraw', sub: 'Send crypto out' },
    { href: '/create-ad', icon: '📢', label: 'Create Ad', sub: 'Post a P2P offer' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Home</Link>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/instant-buy" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Instant Buy</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/orders" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Orders</Link>
          <Link href="/create-ad" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/referral" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>🎁 Referral</Link>
          <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>M</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Muhammad U.</span>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b' }}>Good afternoon, Muhammad! 👋</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>05 May 2026 · 3:15 PM PKT · All systems operational 🟢</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/instant-buy"><button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>⚡ Instant Buy</button></Link>
            <Link href="/marketplace"><button style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Browse P2P Offers</button></Link>
          </div>
        </div>

        {/* Balance + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Balance Card */}
          <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', borderRadius: 16, padding: 24, color: 'white' }}>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginBottom: 8 }}>Total Portfolio Value</div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>PKR 45,793</div>
            <div style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>≈ $162.40 USD</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              {[['USDT', '35.50', '≈ 9,952 PKR'], ['BTC', '0.00142', '≈ 27,264 PKR'], ['ETH', '0.0821', '≈ 8,577 PKR']].map(([coin, amt, pkr]) => (
                <div key={coin} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{coin}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{amt}</div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>{pkr}</div>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Link href="/wallet" style={{ color: 'white', fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>View Full Wallet →</Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickActions.map(({ href, icon, label, sub }) => (
                <Link key={label} href={href} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 18, textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Active Trade + Notifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }}>
          {/* Active Trade */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Active Trade</div>
              <Link href="/orders" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View All Orders →</Link>
            </div>
            <Link href="/trade/1" style={{ display: 'block', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>BUY USDT</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#2563eb' }}>#PKS-2026-00473</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Active</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12, fontSize: 13 }}>
                {[['Amount', '35.71 USDT'], ['You Pay', '10,000 PKR'], ['Seller', 'FastTrade ⭐4.9']].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                {[true, true, false, false].map((done, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: done ? '#2563eb' : '#e2e8f0' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Waiting for your payment proof</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>{timerStr}</span>
              </div>
              <div style={{ marginTop: 12, padding: '10px', background: '#2563eb', color: 'white', borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>Continue Trade →</div>
            </Link>
          </div>

          {/* Notifications */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Notifications</div>
            {[
              { bg: '#fffbeb', border: '#fde68a', icon: '⏰', title: 'Trade Timer Running', titleColor: '#92400e', body: 'Trade #PKS-473 expires in 12 min — upload payment proof now', bodyColor: '#78350f', link: '/trade/1', linkColor: '#d97706', linkText: 'Go to trade →' },
              { bg: '#eff6ff', border: '#bfdbfe', icon: '🎁', title: 'Referral Reward Available', titleColor: '#1d4ed8', body: 'Your friend Ali Hassan completed his first trade — claim your PKR 500 reward', bodyColor: '#1e40af', link: '/referral', linkColor: '#2563eb', linkText: 'Claim reward →' },
              { bg: '#f0fdf4', border: '#86efac', icon: '✅', title: 'Trade Completed', titleColor: '#065f46', body: 'Trade #PKS-471 completed — 17.82 USDT received in your wallet', bodyColor: '#064e3b', link: '/orders', linkColor: '#059669', linkText: 'View order →' },
            ].map(({ bg, border, icon, title, titleColor, body, bodyColor, link, linkColor, linkText }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderRadius: 10, marginBottom: 8, background: bg, border: `1px solid ${border}` }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div style={{ flex: 1, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: titleColor }}>{title}</div>
                  <div style={{ color: bodyColor, marginTop: 2 }}>{body}</div>
                  <Link href={link} style={{ color: linkColor, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>{linkText}</Link>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Link href="/orders" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>View all notifications</Link>
            </div>
          </div>
        </div>

        {/* Stats + My Ads + Market */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Stats */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>My Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Total Trades', '142', '#2563eb'], ['Completion Rate', '99.3%', '#059669'], ['Volume (30d)', '320K PKR', undefined], ['Trust Score', '⭐ 4.92', '#f59e0b']].map(([l, v, c]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{l}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: c || '#1e293b' }}>{v}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>KYC Level</div>
                <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Full KYC</span>
              </div>
            </div>
          </div>

          {/* My Ads */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>My Active Ads</div>
              <Link href="/my-ads" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/my-ads" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>BUY USDT</span>
                  <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>Active</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>283 PKR/USDT</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Limit: 1,000 – 20,000 PKR · 3 trades today</div>
              </Link>
              <Link href="/my-ads" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>SELL USDT</span>
                  <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>⏸ Paused</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>281 PKR/USDT</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Limit: 5,000 – 50,000 PKR · Paused</div>
              </Link>
              <Link href="/create-ad" style={{ display: 'block', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748b', textDecoration: 'none', marginTop: 4 }}>+ Create New Ad</Link>
            </div>
          </div>

          {/* Market Rates */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Live Market Rates</div>
            <div>
              {coins.map(({ sym, bg, name, sub, price, change, up }, i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < coins.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{sym}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{price}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: up ? '#10b981' : '#ef4444' }}>{change}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 10 }}>Rates updated 1 min ago</div>
          </div>
        </div>
      </div>
    </div>
  )
}
