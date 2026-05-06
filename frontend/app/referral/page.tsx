'use client'
import { useState } from 'react'
import Link from 'next/link'

const referredUsers = [
  { initial: 'A', color: 'linear-gradient(135deg,#1e3a5f,#2563eb)', name: 'Asim K***', joined: '01 May 2026', status: 'Traded', reward: '+500 PKR' },
  { initial: 'R', color: 'linear-gradient(135deg,#059669,#34d399)', name: 'Raza M***', joined: '03 May 2026', status: 'Pending', reward: 'Pending' },
  { initial: 'F', color: 'linear-gradient(135deg,#7c3aed,#a78bfa)', name: 'Fatima K***', joined: '29 Apr 2026', status: 'Traded', reward: '+500 PKR' },
  { initial: 'H', color: 'linear-gradient(135deg,#dc2626,#f87171)', name: 'Hassan T***', joined: '25 Apr 2026', status: 'Traded', reward: '+500 PKR' },
  { initial: 'Z', color: 'linear-gradient(135deg,#0284c7,#38bdf8)', name: 'Zara N***', joined: '20 Apr 2026', status: 'Traded', reward: '+500 PKR' },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText('https://pakswap.pk/r/USM42').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/referral" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Referral</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)', borderRadius: 20, padding: 40, color: 'white', textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎁</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, margin: '0 0 8px' }}>Refer Friends & Earn PKR</h1>
          <p style={{ fontSize: 16, color: '#93c5fd', marginBottom: 28 }}>Share your link. Both you and your friend earn <strong style={{ color: 'white' }}>500 PKR bonus</strong> after their first trade!</p>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: 20, maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Your Referral Code</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 3, marginBottom: 16 }}>PAKSWAP-USM42</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#bfdbfe', marginBottom: 14, wordBreak: 'break-all', fontFamily: 'monospace' }}>pakswap.pk/r/USM42</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={copy} style={{ padding: '7px 14px', background: 'white', color: '#1d4ed8', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{copied ? '✓ Copied!' : '📋 Copy Link'}</button>
              <button style={{ padding: '7px 14px', background: '#25d366', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>💬 WhatsApp</button>
              <button style={{ padding: '7px 14px', background: '#0088cc', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✈️ Telegram</button>
              <button style={{ padding: '7px 14px', background: '#1877f2', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📘 Facebook</button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[['🔗', '1. Share Your Link', 'Share your unique referral link or code with friends, family, or social media.', '#e2e8f0', '#1e293b'], ['👤', '2. Friend Registers', 'Your friend signs up using your code and completes KYC verification.', '#bfdbfe', '#1e40af'], ['💰', '3. Both Earn Bonus', 'After their first completed trade, you both earn 500 PKR credited to your wallet!', '#e2e8f0', '#1e293b']].map(([icon, title, sub, borderColor, titleColor]) => (
              <div key={title as string} style={{ background: 'white', border: `1.5px solid ${borderColor}`, borderRadius: 14, padding: 20, textAlign: 'center', background: borderColor === '#bfdbfe' ? '#f0f9ff' : 'white' } as any}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: titleColor as string }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div>
            {/* Earnings Summary */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Your Earnings Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[['12', 'Total Referred', '#f0f9ff', '#1d4ed8'], ['8', 'Traded', '#f0fdf4', '#10b981'], ['4,000', 'PKR Earned', '#fffbeb', '#d97706'], ['2,000', 'PKR Pending', '#fef2f2', '#ef4444']].map(([v, label, bg, color]) => (
                  <div key={label as string} style={{ background: bg as string, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: color as string }}>{v}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>💰 Withdraw 4,000 PKR to Wallet</button>
                <button style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>📊 View History</button>
              </div>
            </div>

            {/* Referred Users */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Referred Users</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['User', 'Joined', 'Status', 'Reward'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referredUsers.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: u.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{u.initial}</div>
                        {u.name}
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#64748b' }}>{u.joined}</td>
                      <td style={{ padding: '12px' }}>
                        {u.status === 'Traded' ? <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✅ Traded</span> : <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>⏳ Pending</span>}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: u.reward.startsWith('+') ? '#10b981' : '#94a3b8', fontSize: 14 }}>{u.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#64748b' }}>Showing 5 of 12 referrals</div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: 'white', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Reward Structure</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['YOU EARN', '500 PKR', 'Per referral who completes first trade'], ['FRIEND EARNS', '500 PKR', 'Bonus on their first trade']].map(([label, amt, sub]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{amt}</div>
                    <div style={{ fontSize: 12, color: '#bfdbfe' }}>{sub}</div>
                  </div>
                ))}
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 12, fontSize: 13, color: '#93c5fd' }}>💡 Paid as USDT to your wallet after 7-day holding period</div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Leaderboard 🏆</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Top referrers this month</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['🥇', 'CryptoGuru', '34 referrals', '17,000 PKR', '#fef3c7', '#d97706'], ['🥈', 'TradeMaster', '28 referrals', '14,000 PKR', '#f1f5f9', '#64748b'], ['🥉', 'PKR_King', '19 referrals', '9,500 PKR', '#fef9f0', '#9a3412'], ['4️⃣', 'Muhammad U. (You)', '12 referrals', '6,000 PKR', '#eff6ff', '#2563eb']].map(([medal, name, refs, earned, bg, color]) => (
                  <div key={name as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: bg as string, borderRadius: 8, border: name === 'Muhammad U. (You)' ? '1.5px solid #2563eb' : 'none' }}>
                    <span style={{ fontSize: 18 }}>{medal}</span>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{refs}</div></div>
                    <strong style={{ color: color as string }}>{earned}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#1e40af' }}>
              📅 Rewards paid 7 days after referral completes first trade. Minimum 1 completed trade required.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
