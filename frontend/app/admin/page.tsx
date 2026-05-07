'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api'

interface Stats {
  totalUsers: number
  kycPending: number
  activeTrades: number
  openDisputes: number
  completedTrades24h: number
  pendingWithdrawals: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.stats().then(r => setStats(r.data.data ?? r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥', color: '#2563eb', link: '/admin/users' },
    { label: 'Active Trades', value: stats.activeTrades.toString(), icon: '🔄', color: '#10b981', link: '/admin/trades' },
    { label: 'Completed Today', value: stats.completedTrades24h.toString(), icon: '✅', color: '#059669', link: '/admin/trades' },
    { label: 'KYC Pending', value: stats.kycPending.toString(), icon: '🪪', color: stats.kycPending > 10 ? '#ef4444' : '#f59e0b', link: '/admin/kyc' },
    { label: 'Open Disputes', value: stats.openDisputes.toString(), icon: '⚖️', color: stats.openDisputes > 0 ? '#ef4444' : '#64748b', link: '/admin/disputes' },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals.toString(), icon: '💸', color: '#7c3aed', link: '/admin/withdrawals' },
  ] : []

  const quickLinks = [
    { href: '/admin/kyc', label: 'Review KYC Queue', icon: '🪪', desc: 'Approve or reject identity submissions', urgent: stats ? stats.kycPending > 0 : false },
    { href: '/admin/payments', label: 'Verify Payments', icon: '💳', desc: 'Layer 2 payment proof review', urgent: false },
    { href: '/admin/disputes', label: 'Resolve Disputes', icon: '⚖️', desc: 'Open disputes awaiting resolution', urgent: stats ? stats.openDisputes > 0 : false },
    { href: '/admin/withdrawals', label: 'Approve Withdrawals', icon: '💸', desc: 'Pending crypto withdrawal requests', urgent: stats ? stats.pendingWithdrawals > 0 : false },
    { href: '/admin/fraud', label: 'Fraud Flags', icon: '🚨', desc: 'Automated risk alerts to review', urgent: false },
    { href: '/admin/instant-buy', label: 'Instant Buy Queue', icon: '⚡', desc: 'OTC orders pending admin approval', urgent: false },
  ]

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', margin: 0 }}>Operations Dashboard</h1>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Real-time platform health · {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#94a3b8' }}>Loading stats...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
            {cards.map(({ label, value, icon, color, link }) => (
              <Link key={label} href={link} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color }}>{value}</div>
                  </div>
                  <div style={{ fontSize: 32 }}>{icon}</div>
                </div>
              </Link>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {quickLinks.map(({ href, label, icon, desc, urgent }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 12, border: `1.5px solid ${urgent ? '#fca5a5' : '#e2e8f0'}`, padding: 18, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{label}</span>
                    {urgent && <span style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>URGENT</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
