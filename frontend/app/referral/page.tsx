'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'

const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }

interface ReferralReward {
  id: string
  rewardAmount: number
  status: 'pending' | 'paid'
  createdAt: string
  referred: { username: string | null; fullName: string }
}

interface ReferralData {
  rewards: ReferralReward[]
  totalEarned: number
  totalReferrals: number
  activeReferrals: number
}

export default function ReferralPage() {
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)

  const referralCode = user?.referralCode ?? '—'
  const referralLink = user?.referralCode ? `pakswap.pk/r/${user.referralCode}` : '—'

  useEffect(() => {
    api.get('/referral')
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pendingEarned = data?.rewards
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.rewardAmount, 0) ?? 0

  function maskName(name: string) {
    const parts = name.trim().split(' ')
    return parts.map((p, i) => i === 0 ? p.charAt(0).toUpperCase() + '***' : p.charAt(0).toUpperCase() + '***').join(' ')
  }

  function statusBadge(status: string) {
    if (status === 'paid') return { label: '✅ Rewarded', bg: '#d1fae5', color: '#065f46' }
    return { label: '⏳ Pending Trade', bg: '#fef3c7', color: '#92400e' }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet' }, { label: 'Referral', href: '/referral', active: true }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: (l as any).active ? 700 : 500, color: (l as any).active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
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
              <button onClick={() => window.open(`https://wa.me/?text=Join%20PakSwap%20using%20my%20referral%20link%3A%20https%3A%2F%2F${referralLink}`, '_blank')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#25d366', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>💬 WhatsApp</button>
              <button onClick={() => window.open(`https://t.me/share/url?url=https%3A%2F%2F${referralLink}`, '_blank')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0088cc', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✈️ Telegram</button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2F${referralLink}`, '_blank')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#1877f2', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>📘 Facebook</button>
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
              {loading ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading...</div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { val: String(data?.totalReferrals ?? 0), label: 'Total Referred', bg: '#f0f9ff', color: '#1d4ed8' },
                      { val: String(data?.activeReferrals ?? 0), label: 'Traded', bg: '#f0fdf4', color: '#10b981' },
                      { val: (data?.totalEarned ?? 0).toLocaleString(), label: 'PKR Earned', bg: '#fffbeb', color: '#d97706' },
                      { val: pendingEarned.toLocaleString(), label: 'PKR Pending', bg: '#fef2f2', color: '#ef4444' },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.bg, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Referred Users */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Referred Users</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading...</div>
              ) : !data?.rewards.length ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                  <div>No referrals yet. Share your link to get started!</div>
                </div>
              ) : (
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
                      {data.rewards.map((r) => {
                        const badge = statusBadge(r.status)
                        const name = maskName(r.referred.fullName || r.referred.username || 'User')
                        const initial = name.charAt(0).toUpperCase()
                        const colors = ['linear-gradient(135deg,#2563eb,#60a5fa)', 'linear-gradient(135deg,#059669,#34d399)', 'linear-gradient(135deg,#7c3aed,#a78bfa)', 'linear-gradient(135deg,#dc2626,#f87171)', 'linear-gradient(135deg,#0284c7,#38bdf8)']
                        const bg = colors[r.id.charCodeAt(0) % colors.length]
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '11px' }}>{initial}</div>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td style={{ padding: '12px' }}><span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{badge.label}</span></td>
                            <td style={{ padding: '12px', fontWeight: 700, color: r.status === 'paid' ? '#10b981' : '#94a3b8', fontSize: '14px' }}>{r.status === 'paid' ? `+${r.rewardAmount.toLocaleString()} PKR` : 'Pending'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Showing {data.rewards.length} of {data.totalReferrals} referrals</div>
                </div>
              )}
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

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#1d4ed8' }}>
              📅 Rewards paid 7 days after referral completes first trade. Minimum 1 completed trade required.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
