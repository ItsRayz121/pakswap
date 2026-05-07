'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/kyc', label: 'KYC Queue', icon: '🪪' },
  { href: '/admin/payments', label: 'Payment Queue', icon: '💳' },
  { href: '/admin/disputes', label: 'Disputes', icon: '⚖️' },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: '💸' },
  { href: '/admin/instant-buy', label: 'Instant Buy', icon: '⚡' },
  { href: '/admin/trades', label: 'All Trades', icon: '🔄' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/fraud', label: 'Fraud Monitor', icon: '🚨' },
  { href: '/admin/audit-log', label: 'Audit Log', icon: '📋' },
  { href: '/admin/config', label: 'Platform Config', icon: '⚙️' },
  { href: '/admin/team', label: 'Team Management', icon: '🛡️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'kyc_reviewer' && user.role !== 'dispute_agent') {
      router.replace('/dashboard')
    }
  }, [user, router])

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'A'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#1e293b', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #334155' }}>
          <Link href="/" style={{ fontSize: '18px', fontWeight: 900, color: 'white', textDecoration: 'none' }}>
            Pak<span style={{ color: '#3b82f6' }}>Swap</span>
          </Link>
          <div style={{ fontSize: '11px', color: '#60a5fa', background: '#1e40af33', padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginTop: 6, marginLeft: 6 }}>Admin</div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>{initials(user.fullName)}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.fullName.split(' ')[0]} · {user.role}</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, textDecoration: 'none', borderLeft: `3px solid ${active ? '#3b82f6' : 'transparent'}`, background: active ? '#1e40af22' : 'transparent', color: active ? '#60a5fa' : '#94a3b8', fontWeight: active ? 700 : 400 }}>
                <span>{icon}</span>{label}
              </Link>
            )
          })}
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, textDecoration: 'none', color: '#475569', marginTop: 8, borderTop: '1px solid #334155' }}>
            <span>🌐</span> Back to Site
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
