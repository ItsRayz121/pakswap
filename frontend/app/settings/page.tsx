'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi, marketplaceApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

type Tab = 'security' | 'profile' | 'sessions' | 'kyc-limits'

interface Session {
  id: string
  deviceFp?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  city?: string | null
  countryCode?: string | null
  createdAt: string
}

const TIER_LABELS: Record<string, string> = {
  none: 'Unverified',
  basic: 'Tier 1 — Basic',
  standard: 'Tier 2 — Standard',
  full: 'Tier 2 — Advanced',
  merchant: 'Verified Merchant',
}
const fmtPkr = (n: number) => n > 0 ? `PKR ${n.toLocaleString()}` : 'Unlimited'

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser, logout: storeLogout } = useAuthStore()
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <Nav user={user} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Account Settings</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
          <Sidebar tab={tab} setTab={setTab} onLogout={async () => {
            try { await authApi.logout() } catch { /* ignore */ }
            storeLogout()
            router.push('/login')
          }} />

          <div>
            {tab === 'profile' && <ProfileTab user={user} updateUser={updateUser} />}
            {tab === 'security' && <SecurityTab user={user} updateUser={updateUser} />}
            {tab === 'sessions' && <SessionsTab />}
            {tab === 'kyc-limits' && <KycLimitsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Nav + Sidebar ───────────────────────────────────────────────────────────

function Nav({ user }: { user: any }) {
  const initials = (name?: string) => (name ?? 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <Link href="/" style={{ fontWeight: 800, fontSize: 20, textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
      <div style={{ display: 'flex', gap: 24 }}>
        {[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Wallet', href: '/wallet' },
          { label: 'Settings', href: '/settings', active: true },
        ].map((l) => (
          <Link key={l.label} href={l.href} style={{ fontSize: 14, fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>{initials(user?.fullName)}</div>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{user?.fullName?.split(' ')[0] ?? 'You'}</span>
      </div>
    </nav>
  )
}

function Sidebar({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  const items: { key: Tab; icon: string; label: string }[] = [
    { key: 'profile', icon: '👤', label: 'Profile' },
    { key: 'security', icon: '🔒', label: 'Security' },
    { key: 'sessions', icon: '💻', label: 'Sessions' },
    { key: 'kyc-limits', icon: '📊', label: 'KYC & Limits' },
  ]
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 12, position: 'sticky', top: 80 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((n) => (
          <button key={n.key} onClick={() => setTab(n.key)}
            style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 14,
              fontWeight: tab === n.key ? 600 : 500,
              color: tab === n.key ? '#1d4ed8' : '#374151',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              background: tab === n.key ? '#eff6ff' : 'transparent',
              border: 'none', textAlign: 'left',
            }}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
        <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
        <Link href="/payment-methods" style={navLink}><span>💳</span> Payment Methods</Link>
        <Link href="/referral" style={navLink}><span>🎁</span> Referral</Link>
        <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
        <button onClick={onLogout} style={{ ...navLink, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', textAlign: 'left' as const, fontFamily: 'inherit' }}>
          <span>🚪</span> Log Out
        </button>
      </div>
    </div>
  )
}

const navLink: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, fontSize: 14,
  color: '#374151', textDecoration: 'none',
  display: 'flex', alignItems: 'center', gap: 10,
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [username, setUsername] = useState(user?.username ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setError(''); setInfo('')
    setSaving(true)
    try {
      const payload: any = {}
      if (username && username !== user?.username) payload.username = username.trim()
      if (phone && phone !== user?.phone) payload.phone = phone.replace(/\s+/g, '')
      if (Object.keys(payload).length === 0) {
        setInfo('Nothing to save.')
        return
      }
      const res = await authApi.updateProfile(payload)
      updateUser(res.data?.data ?? payload)
      setInfo('Profile updated.')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return <Card>Loading…</Card>

  const initials = (user.fullName ?? 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const verifiedBadge = (ok: boolean | undefined) => ok ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Not verified</Badge>
  const kycBadge = user.kycStatus === 'approved'
    ? <Badge tone="green">✓ {TIER_LABELS[user.kycLevel] ?? 'Verified'}</Badge>
    : user.kycStatus === 'pending' || user.kycStatus === 'under_review'
      ? <Badge tone="amber">⏳ Under review</Badge>
      : <Badge tone="slate">Not verified</Badge>

  return (
    <Card>
      <Heading>Profile Information</Heading>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{user.fullName}</div>
          <div style={{ marginTop: 4 }}>{kycBadge}</div>
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {info && !error && <Alert tone="info">{info}</Alert>}

      <Field label="Full Name">
        <input value={user.fullName} readOnly style={{ ...inputStyle, background: '#f8fafc' }} />
        <Hint>Set permanently from your CNIC during KYC.</Hint>
      </Field>

      <Field label={<>Username <span style={{ color: '#94a3b8', fontWeight: 400 }}>(displayed in trades)</span></>}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. usman" style={inputStyle} />
      </Field>

      <Field label={<>Email Address {verifiedBadge(user.emailVerified)}</>}>
        <input value={user.email} readOnly style={{ ...inputStyle, background: '#f8fafc' }} />
        {!user.emailVerified && (
          <Link href="/verify-email" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Verify your email →</Link>
        )}
      </Field>

      <Field label={<>Phone Number {user.phone ? verifiedBadge(user.phoneVerified) : <Badge tone="slate">Not set</Badge>}</>}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="03XX-XXXXXXX or +92 3XX XXXX XXX"
          readOnly={!!user.phone}
          style={{ ...inputStyle, background: user.phone ? '#f8fafc' : 'white' }}
        />
        <Hint>{user.phone ? 'Locked. Contact support to change phone.' : 'Phone is set during Tier 1 KYC.'}</Hint>
      </Field>

      <button onClick={save} disabled={saving} style={{ ...primaryBtn, width: 'auto', padding: '10px 20px', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </Card>
  )
}

// ─── Security Tab ────────────────────────────────────────────────────────────

function SecurityTab({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  return (
    <div>
      <PasswordCard />
      <TwoFactorCard user={user} updateUser={updateUser} />
    </div>
  )
}

function PasswordCard() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setError(''); setInfo('')
    if (next.length < 8) return setError('New password must be at least 8 characters.')
    if (next !== confirm) return setError('New passwords do not match.')
    setBusy(true)
    try {
      await authApi.changePassword({ currentPassword: current, newPassword: next })
      setInfo('Password updated successfully.')
      setCurrent(''); setNext(''); setConfirm('')
      setOpen(false)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not change password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: open ? 16 : 0 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Password</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Use a strong, unique password for your account.</div>
        </div>
        <button onClick={() => setOpen((o) => !o)} style={secondaryBtn}>{open ? 'Cancel' : 'Change Password'}</button>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
          {error && <Alert tone="error">{error}</Alert>}
          {info && !error && <Alert tone="info">{info}</Alert>}
          <Field label="Current Password">
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} style={inputStyle} autoComplete="current-password" />
          </Field>
          <Field label="New Password">
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min 8 characters" style={inputStyle} autoComplete="new-password" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} autoComplete="new-password" />
          </Field>
          <button onClick={submit} disabled={busy} style={{ ...primaryBtn, width: 'auto', padding: '10px 20px', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      )}
    </Card>
  )
}

function TwoFactorCard({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [stage, setStage] = useState<'idle' | 'setup' | 'disable'>('idle')
  const [qr, setQr] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [code, setCode] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const enabled = !!user?.twoFaEnabled

  async function startSetup() {
    setError(''); setInfo('')
    setBusy(true)
    try {
      const res = await authApi.setup2fa()
      setQr(res.data?.data?.qrCodeUrl ?? '')
      setSecret(res.data?.data?.secret ?? '')
      setStage('setup')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not start 2FA setup.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmEnable() {
    if (code.length !== 6) return setError('Enter the 6-digit code from your authenticator app.')
    setError('')
    setBusy(true)
    try {
      await authApi.enable2fa(code)
      updateUser({ twoFaEnabled: true })
      setInfo('Two-factor authentication is now enabled.')
      setStage('idle'); setCode(''); setQr(''); setSecret('')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid code. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmDisable() {
    if (code.length !== 6) return setError('Enter your current 6-digit 2FA code.')
    setError('')
    setBusy(true)
    try {
      await authApi.disable2fa(code)
      updateUser({ twoFaEnabled: false })
      setInfo('Two-factor authentication disabled.')
      setStage('idle'); setCode('')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid code. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 17, fontWeight: 800 }}>Two-Factor Authentication</div>
        {enabled ? <Badge tone="green">🟢 Enabled</Badge> : <Badge tone="slate">Disabled</Badge>}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        {enabled ? 'Your account is protected with TOTP. Required at every login.' : 'Add an extra layer of security with Google Authenticator, Authy, or 1Password.'}
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {info && !error && <Alert tone="info">{info}</Alert>}

      {stage === 'idle' && !enabled && (
        <button onClick={startSetup} disabled={busy} style={{ ...primaryBtn, width: 'auto', padding: '10px 20px', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Loading…' : 'Enable 2FA'}
        </button>
      )}

      {stage === 'idle' && enabled && (
        <button onClick={() => setStage('disable')} style={{ ...secondaryBtn, color: '#ef4444', borderColor: '#fecaca' }}>
          Disable 2FA
        </button>
      )}

      {stage === 'setup' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 20, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            {qr && <img src={qr} alt="2FA QR code" width={180} height={180} style={{ borderRadius: 8 }} />}
            <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
              Scan with Google Authenticator, Authy, or 1Password.<br />
              Or enter this secret manually: <code style={{ background: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{secret}</code>
            </div>
          </div>
          <Field label="Enter the 6-digit code from your app">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              style={{ ...inputStyle, fontSize: 18, letterSpacing: 8, textAlign: 'center', fontWeight: 700 }}
              placeholder="• • • • • •"
            />
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStage('idle'); setCode(''); setError('') }} style={secondaryBtn}>Cancel</button>
            <button onClick={confirmEnable} disabled={busy || code.length !== 6} style={{ ...primaryBtn, flex: 1, opacity: busy || code.length !== 6 ? 0.6 : 1 }}>
              {busy ? 'Enabling…' : 'Confirm & Enable'}
            </button>
          </div>
        </div>
      )}

      {stage === 'disable' && (
        <div>
          <Alert tone="error">Disabling 2FA will reduce your account security. Confirm with your current authenticator code.</Alert>
          <Field label="Current 6-digit 2FA code">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              style={{ ...inputStyle, fontSize: 18, letterSpacing: 8, textAlign: 'center', fontWeight: 700 }}
              placeholder="• • • • • •"
            />
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStage('idle'); setCode(''); setError('') }} style={secondaryBtn}>Cancel</button>
            <button onClick={confirmDisable} disabled={busy || code.length !== 6} style={{ ...primaryBtn, flex: 1, background: '#ef4444', opacity: busy || code.length !== 6 ? 0.6 : 1 }}>
              {busy ? 'Disabling…' : 'Disable 2FA'}
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ─── Sessions Tab ────────────────────────────────────────────────────────────

function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authApi.getSessions()
      setSessions(res.data?.data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not load sessions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function revoke(id: string) {
    setError(''); setInfo('')
    try {
      await authApi.revokeSession(id)
      setInfo('Session terminated.')
      load()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not terminate session.')
    }
  }

  function deviceLabel(s: Session): { icon: string; label: string } {
    const ua = (s.userAgent ?? '').toLowerCase()
    if (ua.includes('iphone') || ua.includes('ipad')) return { icon: '📱', label: 'iOS device' }
    if (ua.includes('android')) return { icon: '📱', label: 'Android device' }
    if (ua.includes('mac')) return { icon: '💻', label: 'macOS' }
    if (ua.includes('windows')) return { icon: '💻', label: 'Windows' }
    if (ua.includes('linux')) return { icon: '🖥️', label: 'Linux' }
    return { icon: '🌐', label: 'Web' }
  }

  function browser(s: Session): string {
    const ua = (s.userAgent ?? '').toLowerCase()
    if (ua.includes('edg/')) return 'Edge'
    if (ua.includes('chrome')) return 'Chrome'
    if (ua.includes('firefox')) return 'Firefox'
    if (ua.includes('safari')) return 'Safari'
    return 'Browser'
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <Heading>Active Sessions</Heading>
        {sessions.length > 1 && (
          <button
            onClick={async () => {
              for (const s of sessions) {
                try { await authApi.revokeSession(s.id) } catch { /* keep going */ }
              }
              setInfo('All other sessions terminated. You may need to re-login on those devices.')
              load()
            }}
            style={{ ...secondaryBtn, color: '#ef4444', borderColor: '#fecaca' }}
          >
            Terminate All Others
          </button>
        )}
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      {info && !error && <Alert tone="info">{info}</Alert>}
      {loading && <div style={{ color: '#64748b', fontSize: 14 }}>Loading sessions…</div>}
      {!loading && sessions.length === 0 && <div style={{ color: '#64748b', fontSize: 14 }}>No active sessions.</div>}
      {sessions.map((s) => {
        const d = deviceLabel(s)
        const where = [s.city, s.countryCode].filter(Boolean).join(', ') || s.ipAddress || 'Unknown location'
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, border: '1.5px solid #e2e8f0', borderRadius: 12, marginBottom: 8, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 28 }}>{d.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{d.label} — {browser(s)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {where} · {new Date(s.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            </div>
            <button
              onClick={() => revoke(s.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Terminate
            </button>
          </div>
        )
      })}
    </Card>
  )
}

// ─── KYC Limits Tab ──────────────────────────────────────────────────────────

function KycLimitsTab({ user }: { user: any }) {
  const [limits, setLimits] = useState<Record<string, { dailyPkr: number; monthlyPkr: number }> | null>(null)
  useEffect(() => {
    marketplaceApi.getConfig().then(r => setLimits(r.data.data.kycLimits)).catch(() => {})
  }, [])

  if (!user) return <Card>Loading…</Card>
  const tierKey = user.kycLevel ?? 'none'
  const tier = limits?.[tierKey]
  const label = TIER_LABELS[tierKey] ?? 'Unverified'
  const isApproved = user.kycStatus === 'approved'
  const isPending = user.kycStatus === 'pending' || user.kycStatus === 'under_review'

  const heroBg = isApproved
    ? 'linear-gradient(135deg,#d1fae5,#ecfdf5)'
    : isPending
      ? 'linear-gradient(135deg,#fef3c7,#fffbeb)'
      : 'linear-gradient(135deg,#fee2e2,#fff1f2)'
  const heroBorder = isApproved ? '#6ee7b7' : isPending ? '#fde68a' : '#fecaca'
  const heroIcon = isApproved ? '🏆' : isPending ? '⏳' : '🪪'
  const heroTitle = isApproved ? `${label} verified` : isPending ? 'Under review' : 'Not yet verified'
  const heroSub = isApproved
    ? 'Your trading limits are unlocked.'
    : isPending
      ? 'We\'ll email you within 24 hours.'
      : 'Verify your identity to start trading.'

  return (
    <Card>
      <Heading>KYC Level &amp; Trading Limits</Heading>
      <div style={{ background: heroBg, border: `1.5px solid ${heroBorder}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 32 }}>{heroIcon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{heroTitle}</div>
            <div style={{ fontSize: 13, color: '#475569' }}>{heroSub}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Stat label="Daily Limit" value={tier ? fmtPkr(tier.dailyPkr) : '—'} color="#1d4ed8" />
          <Stat label="Monthly Limit" value={tier ? fmtPkr(tier.monthlyPkr) : '—'} color="#10b981" />
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Limits reset daily at 12:00 AM PKT.</div>
      <Link href="/kyc">
        <button style={{ ...primaryBtn, width: 'auto', padding: '10px 20px' }}>
          {isApproved ? 'Upgrade tier' : isPending ? 'View status' : 'Start verification'} →
        </button>
      </Link>
    </Card>
  )
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, ...style }}>{children}</div>
}

function Heading({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>{children}</div>
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{children}</div>
}

function Alert({ tone, children }: { tone: 'error' | 'info'; children: React.ReactNode }) {
  const palette = tone === 'error'
    ? { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' }
    : { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af' }
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: palette.color }}>{children}</div>
  )
}

function Badge({ tone, children }: { tone: 'green' | 'amber' | 'slate'; children: React.ReactNode }) {
  const palette = {
    green: { bg: '#d1fae5', color: '#065f46' },
    amber: { bg: '#fef3c7', color: '#92400e' },
    slate: { bg: '#f1f5f9', color: '#64748b' },
  }[tone]
  return (
    <span style={{ background: palette.bg, color: palette.color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'inline-block' }}>{children}</span>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const primaryBtn: React.CSSProperties = {
  padding: 12, borderRadius: 10, border: 'none',
  background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0',
  background: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#374151',
}
