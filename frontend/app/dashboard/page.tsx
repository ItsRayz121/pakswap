'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi, walletApi, tradesApi, marketplaceApi, notificationsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface Wallet { coin: string; balance: string; availableBalance: string }
interface Trade { id: string; orderRef: string; status: string; coin: string; cryptoAmount: string; fiatAmount: string; createdAt: string }
interface Notification { id: string; title: string; body: string; read: boolean }

const COIN_META: Record<string, { icon: string; iconBg: string }> = {
  USDT: { icon: '₮', iconBg: '#26a17b' },
  BTC:  { icon: '₿', iconBg: '#f7931a' },
  ETH:  { icon: 'Ξ', iconBg: '#627eea' },
  USDC: { icon: '$', iconBg: '#2775ca' },
}

const TRADE_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  escrow_locked:   { label: 'Awaiting Payment', bg: '#dbeafe', color: '#1d4ed8' },
  payment_pending: { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  payment_claimed: { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  under_review:    { label: 'Under Review',     bg: '#fef3c7', color: '#92400e' },
  completed:       { label: 'Completed',        bg: '#d1fae5', color: '#065f46' },
  cancelled:       { label: 'Cancelled',        bg: '#fee2e2', color: '#991b1b' },
}

const QUICK_ACTIONS = [
  { href: '/marketplace', icon: '🛒', label: 'Buy Crypto',  sub: 'Browse P2P offers' },
  { href: '/marketplace', icon: '💰', label: 'Sell Crypto', sub: 'Post or find buyers' },
  { href: '/instant-buy', icon: '⚡', label: 'Instant Buy', sub: 'JazzCash / Easypaisa' },
  { href: '/wallet',      icon: '📥', label: 'Deposit',     sub: 'Add crypto to wallet' },
  { href: '/wallet',      icon: '📤', label: 'Withdraw',    sub: 'Send crypto out' },
  { href: '/create-ad',   icon: '📢', label: 'Create Ad',   sub: 'Post a P2P offer' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, setAuth, logout } = useAuthStore()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('access_token') ?? ''
    const [meRes, walletsRes, tradesRes, notifRes] = await Promise.allSettled([
      authApi.me(),
      walletApi.getAll(),
      tradesApi.getAll({ limit: 5 }),
      notificationsApi.getAll({ limit: 5 }),
    ])
    if (meRes.status === 'fulfilled') setAuth(meRes.value.data.data, token)
    if (walletsRes.status === 'fulfilled') setWallets(walletsRes.value.data.data ?? [])
    if (tradesRes.status === 'fulfilled') setTrades(tradesRes.value.data.data ?? [])
    if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data.data ?? [])

    const rateResults = await Promise.allSettled(['USDT', 'BTC', 'ETH', 'USDC'].map(c => marketplaceApi.getRate(c)))
    const rateMap: Record<string, number> = {}
    rateResults.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value.data.success) rateMap[['USDT', 'BTC', 'ETH', 'USDC'][i]] = r.value.data.data.rate
    })
    setRates(rateMap)
    setLoading(false)
  }, [setAuth])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleLogout() {
    try { await authApi.logout() } catch {}
    logout()
    router.push('/login')
  }

  async function markAllRead() {
    try { await notificationsApi.markAllRead(); setNotifications([]) } catch {}
  }

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'
  const displayName = user?.username ?? user?.fullName?.split(' ')[0] ?? 'User'
  const unread = notifications.filter(n => !n.read).length
  const totalPkr = wallets.reduce((s, w) => s + parseFloat(w.balance || '0') * (rates[w.coin] ?? 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[{ label: 'Home', href: '/dashboard', active: true }, { label: 'Marketplace', href: '/marketplace' }, { label: 'Instant Buy', href: '/instant-buy' }, { label: 'Wallet', href: '/wallet' }, { label: 'Orders', href: '/orders' }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 14, fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#64748b', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ position: 'relative', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>
              🔔
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
            </button>
          )}
          <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{user ? initials(user.fullName) : 'U'}</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{displayName}</span>
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#64748b', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b' }}>{greeting()}, {displayName}! 👋</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/instant-buy"><button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>⚡ Instant Buy</button></Link>
            <Link href="/marketplace"><button style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Browse P2P</button></Link>
          </div>
        </div>

        {/* Verification banner — drives users through the onboarding tiers */}
        {user && !user.emailVerified && (
          <VerificationBanner
            tone="warn"
            icon="📧"
            title="Verify your email"
            body="We sent a verification code to your email. Verify to unlock full account access."
            cta={{ href: '/verify-email', label: 'Verify now' }}
          />
        )}
        {user?.emailVerified && user?.kycStatus !== 'approved' && (
          <VerificationBanner
            tone="info"
            icon="🪪"
            title={user?.kycLevel === 'none' ? 'Complete Basic Verification (Tier 1)' : 'Upgrade to Advanced Verification (Tier 2)'}
            body={user?.kycLevel === 'none'
              ? 'Submit your CNIC and selfie to start trading up to PKR 50,000/day.'
              : 'Add a bank statement or utility bill to raise your daily limit to PKR 500,000.'}
            cta={{ href: '/kyc', label: user?.kycLevel === 'none' ? 'Start KYC' : 'Upgrade tier' }}
          />
        )}

        {/* Portfolio + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', borderRadius: 16, padding: 24, color: 'white' }}>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginBottom: 8 }}>Total Portfolio Value</div>
            {loading ? (
              <div style={{ fontSize: 24, opacity: 0.6 }}>Loading...</div>
            ) : wallets.length === 0 ? (
              <div>
                <div style={{ fontSize: 30, fontWeight: 900 }}>PKR 0</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Deposit crypto to get started</div>
                <Link href="/wallet" style={{ display: 'inline-block', marginTop: 16, padding: '8px 18px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>📥 Deposit Now</Link>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 36, fontWeight: 900 }}>{totalPkr.toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                  {wallets.slice(0, 4).map(w => (
                    <div key={w.coin} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{w.coin}</div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{parseFloat(w.balance).toFixed(4)}</div>
                      <div style={{ fontSize: 11, opacity: 0.65 }}>≈ {(parseFloat(w.balance) * (rates[w.coin] ?? 0)).toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {QUICK_ACTIONS.map(a => (
                <Link key={a.label} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{a.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Live Rates */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Live Market Rates</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
            {Object.entries(COIN_META).map(([coin, meta]) => (
              <div key={coin} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: meta.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>{meta.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{coin}</div>
                  <div style={{ fontSize: 13, color: rates[coin] ? '#1e293b' : '#94a3b8', fontWeight: 600 }}>{rates[coin] ? `${rates[coin].toLocaleString()} PKR` : loading ? '...' : '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Recent Trades */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Recent Trades</div>
              <Link href="/orders" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>Loading...</div>
            ) : trades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>No trades yet</div>
                <Link href="/marketplace" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>Browse marketplace →</Link>
              </div>
            ) : trades.map((t, i) => {
              const st = TRADE_STATUS[t.status] ?? { label: t.status, bg: '#f1f5f9', color: '#64748b' }
              return (
                <Link key={t.id} href={`/trade/${t.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < trades.length - 1 ? '1px solid #f1f5f9' : 'none', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{COIN_META[t.coin]?.icon ?? '?'}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.coin} — #{t.orderRef}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{parseFloat(t.cryptoAmount).toFixed(4)} {t.coin}</div>
                    <span style={{ background: st.bg, color: st.color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{st.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Account + Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Account</div>
              {user && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700 }}>{initials(user.fullName)}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{user.fullName}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{user.email}</div>
                    </div>
                  </div>
                  {[
                    ['KYC', user.kycStatus === 'approved' ? `✅ ${user.kycLevel}` : '⚠️ Incomplete', user.kycStatus === 'approved' ? '#065f46' : '#dc2626'],
                    ['2FA', user.twoFaEnabled ? '✅ On' : '⚠️ Off', user.twoFaEnabled ? '#065f46' : '#dc2626'],
                  ].map(([label, value, color]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                      <span style={{ color: '#64748b' }}>{label}</span>
                      <strong style={{ color: color as string }}>{value}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Link href="/kyc" style={{ flex: 1, padding: '7px', borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600, fontSize: 12, textAlign: 'center', textDecoration: 'none' }}>KYC →</Link>
                    <Link href="/settings" style={{ flex: 1, padding: '7px', borderRadius: 8, background: '#f1f5f9', color: '#374151', fontWeight: 600, fontSize: 12, textAlign: 'center', textDecoration: 'none' }}>Settings →</Link>
                  </div>
                </>
              )}
            </div>

            {notifications.length > 0 && (
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>Notifications {unread > 0 && <span style={{ background: '#ef4444', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 11 }}>{unread}</span>}</div>
                  <button onClick={markAllRead} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
                </div>
                {notifications.slice(0, 4).map((n, i) => (
                  <div key={n.id} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VerificationBanner({
  tone, icon, title, body, cta,
}: {
  tone: 'warn' | 'info'
  icon: string
  title: string
  body: string
  cta: { href: string; label: string }
}) {
  const palette = tone === 'warn'
    ? { bg: '#fffbeb', border: '#fde68a', titleColor: '#92400e', bodyColor: '#78350f', btn: '#f59e0b' }
    : { bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1e40af', bodyColor: '#1e3a8a', btn: '#2563eb' }
  return (
    <div style={{
      background: palette.bg, border: `1.5px solid ${palette.border}`, borderRadius: 14,
      padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: palette.titleColor }}>{title}</div>
        <div style={{ fontSize: 13, color: palette.bodyColor, marginTop: 2 }}>{body}</div>
      </div>
      <Link href={cta.href} style={{
        padding: '9px 16px', background: palette.btn, color: 'white', borderRadius: 10,
        fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        {cta.label} →
      </Link>
    </div>
  )
}
