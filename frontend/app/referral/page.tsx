'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'

const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }

const referrals = [
  { initial: 'A', initBg: 'linear-gradient(135deg,#2563eb,#60a5fa)', name: 'Asim K***', joined: '01 May 2026', status: '✅ Traded', statusBg: '#d1fae5', statusColor: '#065f46', reward: '+500 PKR', rewardColor: '#10b981' },
  { initial: 'R', initBg: 'linear-gradient(135deg,#059669,#34d399)', name: 'Raza M***', joined: '03 May 2026', status: '⏳ Pending Trade', statusBg: '#fef3c7', statusColor: '#92400e', reward: 'Pending', rewardColor: '#94a3b8' },
  { initial: 'F', initBg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', name: 'Fatima K***', joined: '29 Apr 2026', status: '✅ Traded', statusBg: '#d1fae5', statusColor: '#065f46', reward: '+500 PKR', rewardColor: '#10b981' },
  { initial: 'H', initBg: 'linear-gradient(135deg,#dc2626,#f87171)', name: 'Hassan T***', joined: '25 Apr 2026', status: '✅ Traded', statusBg: '#d1fae5', statusColor: '#065f46', reward: '+500 PKR', rewardColor: '#10b981' },
  { initial: 'Z', initBg: 'linear-gradient(135deg,#0284c7,#38bdf8)', name: 'Zara N***', joined: '20 Apr 2026', status: '✅ Traded', statusBg: '#d1fae5', statusColor: '#065f46', reward: '+500 PKR', rewardColor: '#10b981' },
]

export default function ReferralPage() {
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const referralCode = user?.referralCode ?? '—'
  const referralLink = user?.referralCode ? `pakswap.pk/r/${user.referralCode}` : '—'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet' }, { label: 'Referral', href: '/referral', active: true }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>{user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{user?.fullName?.split(' ')[0] ?? 'Account'}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)', borderRadius: '20px', padding: '40px', color: 'white', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎁</div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 8px' }}>Refer Friends &amp; Earn PKR</h1>
          <p style={{ fontSize: '16px', color: '#93c5fd', marginBottom: '28px' }}>Share your link. Both you and your friend earn <strong style={{ color: 'white' }}>500 PKR bonus</strong> after their first trade!</p>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Your Referral Code</div>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '3px', marginBottom: '16px' }}>{referralCode}</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#bfdbfe', marginBottom: '14px', wordBreak: 'break-all', fontFamily: 'monospace' }}>{referralLink}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => { navigator.clipboard?.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: copied ? '#d1fae5' : 'white', color: copied ? '#065f46' : '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>{copied ? '✅ Copied!' : '📋 Copy Link'}</button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#25d366', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>💬 WhatsApp</button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0088cc', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✈️ Telegram</button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#1877f2', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>📘 Facebook</button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {[
              { icon: '🔗', step: '1. Share Your Link', desc: 'Share your unique referral link or code with friends, family, or social media.', highlight: false },
              { icon: '👤', step: '2. Friend Registers', desc: 'Your friend signs up using your code and completes KYC verification.', highlight: true },
              { icon: '💰', step: '3. Both Earn Bonus', desc: 'After their first completed trade, you both earn 500 PKR credited to your wallet!', highlight: false },
            ].map(s => (
              <div key={s.step} style={{ background: s.highlight ? '#f0f9ff' : 'white', border: `1.5px solid ${s.highlight ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>{s.step}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div>
            {/* Earnings Summary */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Your Earnings Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { val: '12', label: 'Total Referred', bg: '#f0f9ff', color: '#1d4ed8' },
                  { val: '8', label: 'Traded', bg: '#f0fdf4', color: '#10b981' },
                  { val: '4,000', label: 'PKR Earned', bg: '#fffbeb', color: '#d97706' },
                  { val: '2,000', label: 'PKR Pending', bg: '#fef2f2', color: '#ef4444' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>💰 Withdraw 4,000 PKR to Wallet</button>
                <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>📊 View History</button>
              </div>
            </div>

            {/* Referred Users */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Referred Users</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['User', 'Joined', 'Status', 'Reward'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: r.initBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '11px' }}>{r.initial}</div>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{r.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{r.joined}</td>
                        <td style={{ padding: '12px' }}><span style={{ background: r.statusBg, color: r.statusColor, padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{r.status}</span></td>
                        <td style={{ padding: '12px', fontWeight: 700, color: r.rewardColor, fontSize: '14px' }}>{r.reward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Showing 5 of 12 referrals</div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Reward Structure */}
            <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: 'white', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Reward Structure</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600, marginBottom: '4px' }}>YOU EARN</div>
                  <div style={{ fontSize: '22px', fontWeight: 900 }}>500 PKR</div>
                  <div style={{ fontSize: '12px', color: '#bfdbfe' }}>Per referral who completes first trade</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600, marginBottom: '4px' }}>FRIEND EARNS</div>
                  <div style={{ fontSize: '22px', fontWeight: 900 }}>500 PKR</div>
                  <div style={{ fontSize: '12px', color: '#bfdbfe' }}>Bonus on their first trade</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#93c5fd' }}>
                  💡 Paid as USDT to your wallet after 7-day holding period
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '4px' }}>Leaderboard 🏆</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Top referrers this month</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { medal: '🥇', name: 'CryptoGuru', refs: '34 referrals', earned: '17,000 PKR', earnColor: '#d97706', bg: '#fef3c7', border: 'none' },
                  { medal: '🥈', name: 'TradeMaster', refs: '28 referrals', earned: '14,000 PKR', earnColor: '#64748b', bg: '#f1f5f9', border: 'none' },
                  { medal: '🥉', name: 'PKR_King', refs: '19 referrals', earned: '9,500 PKR', earnColor: '#9a3412', bg: '#fef9f0', border: 'none' },
                  { medal: '4️⃣', name: 'Muhammad U. (You)', refs: '12 referrals', earned: '6,000 PKR', earnColor: '#2563eb', bg: '#eff6ff', border: '1.5px solid #2563eb' },
                ].map(l => (
                  <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: l.bg, borderRadius: '8px', border: l.border || 'none' }}>
                    <span style={{ fontSize: '18px' }}>{l.medal}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{l.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{l.refs}</div>
                    </div>
                    <strong style={{ color: l.earnColor }}>{l.earned}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#1d4ed8' }}>
              📅 Rewards paid 7 days after referral completes first trade. Minimum 1 completed trade required.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
