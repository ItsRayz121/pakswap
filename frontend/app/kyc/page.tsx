'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { kycApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

type TierKey = 'basic' | 'advanced' | 'merchant'
type View = 'overview' | TierKey | 'submitted'

interface Tier {
  key: TierKey
  name: string
  badge: string
  daily: string
  monthly: string
  features: string[]
  requires: string[]
  level: 'basic' | 'full'
  serverLevel: 'basic' | 'full'
}

const TIERS: Tier[] = [
  {
    key: 'basic',
    name: 'Tier 1 — Basic',
    badge: '🪪',
    daily: 'PKR 50,000',
    monthly: 'PKR 500,000',
    features: ['Buy & sell crypto', 'P2P trading', 'Withdraw to bank'],
    requires: ['Phone number', 'CNIC (front + back)', 'Selfie'],
    level: 'basic',
    serverLevel: 'basic',
  },
  {
    key: 'advanced',
    name: 'Tier 2 — Advanced',
    badge: '🛡️',
    daily: 'PKR 500,000',
    monthly: 'PKR 5,000,000',
    features: ['10× higher trade limits', 'Priority support', 'Higher withdrawal cap'],
    requires: ['Tier 1 approved', 'Bank statement OR utility bill (≤ 3 months)'],
    level: 'full',
    serverLevel: 'full',
  },
  {
    key: 'merchant',
    name: 'Merchant',
    badge: '🏪',
    daily: 'Unlimited',
    monthly: 'Unlimited',
    features: ['Post merchant ads', 'Custom spread', 'Dedicated support'],
    requires: ['Tier 2 approved', 'NTN / FBR Active Taxpayer', 'Business registration'],
    level: 'full',
    serverLevel: 'full',
  },
]

export default function KYCPage() {
  const { user } = useAuthStore()
  const [view, setView] = useState<View>('overview')
  const [kycStatus, setKycStatus] = useState<string>('not_started')
  const [kycLevel, setKycLevel] = useState<string>('none')

  const checkStatus = useCallback(async () => {
    try {
      const res = await kycApi.status()
      const d = res.data?.data
      if (d?.kycStatus) setKycStatus(d.kycStatus)
      if (d?.kycLevel) setKycLevel(d.kycLevel)
    } catch { /* not signed in / no KYC yet */ }
  }, [])

  useEffect(() => { checkStatus() }, [checkStatus])

  const isPending = kycStatus === 'pending' || kycStatus === 'under_review'
  const isApproved = kycStatus === 'approved'

  function tierStatus(t: Tier): 'locked' | 'available' | 'pending' | 'approved' {
    if (isApproved && kycLevel === 'full' && t.serverLevel === 'full') return 'approved'
    if (isApproved && kycLevel !== 'none' && t.serverLevel === 'basic') return 'approved'
    if (isPending) return 'pending'
    if (t.key === 'advanced' && kycLevel === 'none') return 'locked'
    if (t.key === 'merchant' && kycLevel !== 'full') return 'locked'
    return 'available'
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Back to dashboard</Link>
          <h1 style={{ margin: '12px 0 6px', fontSize: 28, color: '#0f172a' }}>Identity Verification</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
            Pakistan-compliant verification (per FBR & SBP guidelines). Higher tier = higher trading limits.
          </p>
        </div>

        {view === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {TIERS.map((t) => {
              const s = tierStatus(t)
              return <TierCard key={t.key} tier={t} status={s} onSelect={() => setView(t.key)} />
            })}
          </div>
        )}

        {view === 'basic' && <BasicForm onDone={() => setView('submitted')} userPhone={user?.phone ?? ''} />}
        {view === 'advanced' && <AdvancedForm onDone={() => setView('submitted')} />}
        {view === 'merchant' && <MerchantForm onDone={() => setView('submitted')} />}
        {view === 'submitted' && <Submitted approved={isApproved} />}

        {(view === 'basic' || view === 'advanced' || view === 'merchant') && (
          <button onClick={() => setView('overview')} style={{ marginTop: 16, padding: '10px 16px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569' }}>
            ← Back to tiers
          </button>
        )}
      </div>
    </div>
  )
}

function Nav() {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <Link href="/" style={{ fontWeight: 800, fontSize: 20, textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
      <Link href="/dashboard"><button style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13 }}>Dashboard</button></Link>
    </nav>
  )
}

function TierCard({ tier, status, onSelect }: { tier: Tier; status: 'locked' | 'available' | 'pending' | 'approved'; onSelect: () => void }) {
  const statusBadge = {
    locked: { bg: '#f1f5f9', color: '#94a3b8', label: '🔒 Locked' },
    available: { bg: '#dbeafe', color: '#1d4ed8', label: '✨ Start now' },
    pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Under review' },
    approved: { bg: '#d1fae5', color: '#065f46', label: '✅ Approved' },
  }[status]

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 32 }}>{tier.badge}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{tier.name}</div>
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusBadge.bg, color: statusBadge.color }}>{statusBadge.label}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Daily</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{tier.daily}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Monthly</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{tier.monthly}</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>What you get</div>
        {tier.features.map((f) => <div key={f} style={{ fontSize: 13, color: '#475569', padding: '2px 0' }}>✓ {f}</div>)}
      </div>

      <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Required</div>
        {tier.requires.map((r) => <div key={r} style={{ fontSize: 12, color: '#64748b', padding: '1px 0' }}>• {r}</div>)}
      </div>

      <button
        onClick={onSelect}
        disabled={status === 'locked' || status === 'approved'}
        style={{
          marginTop: 14, width: '100%', padding: 12, borderRadius: 10, border: 'none',
          background: status === 'locked' ? '#e2e8f0' : status === 'approved' ? '#d1fae5' : '#2563eb',
          color: status === 'locked' ? '#94a3b8' : status === 'approved' ? '#065f46' : 'white',
          fontWeight: 700, fontSize: 13, cursor: status === 'locked' || status === 'approved' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'approved' ? 'Already verified' : status === 'pending' ? 'View status' : status === 'locked' ? 'Complete previous tier first' : 'Start verification'}
      </button>
    </div>
  )
}

function BasicForm({ onDone, userPhone }: { onDone: () => void; userPhone: string }) {
  const [phone, setPhone] = useState(userPhone || '')
  const [cnicNumber, setCnicNumber] = useState('')
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!phone || phone.replace(/\D/g, '').length < 10) return setError('Enter a valid phone number.')
    if (!cnicNumber || cnicNumber.replace(/\D/g, '').length !== 13) return setError('CNIC must be 13 digits (e.g. 35202-1234567-8).')
    if (!cnicFront || !cnicBack || !selfie) return setError('CNIC front, back, and a selfie are all required.')
    setError('')
    setSubmitting(true)
    const fd = new FormData()
    fd.append('level', 'basic')
    fd.append('phone', phone)
    fd.append('cnicNumber', cnicNumber)
    fd.append('cnicFront', cnicFront)
    fd.append('cnicBack', cnicBack)
    fd.append('selfie', selfie)
    try {
      await kycApi.submit(fd)
      onDone()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card title="Tier 1 — Basic Verification" sub="Daily limit: PKR 50,000  ·  Monthly: PKR 500,000">
      {error && <ErrorBox>{error}</ErrorBox>}
      <FormField label="Phone number" required>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX or +92 3XX XXXX XXX" style={input} />
        <Hint>The number you use for JazzCash, Easypaisa, or your bank.</Hint>
      </FormField>
      <FormField label="CNIC number" required>
        <input value={cnicNumber} onChange={(e) => setCnicNumber(e.target.value)} placeholder="35202-1234567-8" style={input} maxLength={15} />
        <Hint>13 digits exactly as printed on your CNIC.</Hint>
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FilePicker label="CNIC Front" file={cnicFront} setFile={setCnicFront} />
        <FilePicker label="CNIC Back" file={cnicBack} setFile={setCnicBack} />
      </div>
      <FilePicker label="Selfie (face clearly visible, no filters)" file={selfie} setFile={setSelfie} accept="image/*" />
      <button onClick={submit} disabled={submitting} style={{ ...primaryBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </button>
      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Reviewed within 24 hours. We'll email you when it's done.</p>
    </Card>
  )
}

function AdvancedForm({ onDone }: { onDone: () => void }) {
  const [addressProof, setAddressProof] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!addressProof) return setError('Upload a bank statement or utility bill.')
    setError('')
    setSubmitting(true)
    const fd = new FormData()
    fd.append('level', 'full')
    fd.append('addressProof', addressProof)
    try { await kycApi.submit(fd); onDone() }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Submission failed.') }
    finally { setSubmitting(false) }
  }

  return (
    <Card title="Tier 2 — Advanced Verification" sub="Daily limit: PKR 500,000  ·  Monthly: PKR 5,000,000">
      {error && <ErrorBox>{error}</ErrorBox>}
      <FilePicker label="Bank statement OR utility bill (last 3 months, name + address visible)" file={addressProof} setFile={setAddressProof} />
      <button onClick={submit} disabled={submitting} style={{ ...primaryBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </Card>
  )
}

function MerchantForm({ onDone }: { onDone: () => void }) {
  return (
    <Card title="Merchant Application" sub="Unlimited limits, post merchant ads, dedicated support">
      <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
        Merchant onboarding is a manual process. Email <a href="mailto:merchants@pakswap.com" style={{ color: '#2563eb', fontWeight: 600 }}>merchants@pakswap.com</a> with the following:
      </p>
      <ul style={{ color: '#475569', fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
        <li>Business name + registration number (SECP / partnership deed)</li>
        <li>NTN certificate</li>
        <li>FBR Active Taxpayer (ATL) screenshot</li>
        <li>Estimated monthly trading volume (PKR)</li>
        <li>Bank account details (in business name)</li>
      </ul>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 16 }}>You'll hear back within 3 business days.</p>
      <button onClick={onDone} style={{ ...primaryBtn, marginTop: 8 }}>Got it</button>
    </Card>
  )
}

function Submitted({ approved }: { approved: boolean }) {
  return (
    <Card title={approved ? 'You\'re verified ✓' : 'Submitted for review'} sub={approved ? 'You can trade up to your tier limit.' : 'We\'ll notify you by email once reviewed (usually within 24 hours).'}>
      <div style={{ fontSize: 56, textAlign: 'center', margin: '20px 0' }}>{approved ? '✅' : '⏳'}</div>
      <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', padding: 14, background: '#2563eb', color: 'white', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>Back to dashboard</Link>
    </Card>
  )
}

// ─── primitives ──────────────────────────────────────────────────────────────

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, color: '#0f172a' }}>{title}</h2>
      {sub && <p style={{ margin: '0 0 18px', fontSize: 13, color: '#64748b' }}>{sub}</p>}
      {children}
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function FilePicker({ label, file, setFile, accept = 'image/*,.pdf' }: { label: string; file: File | null; setFile: (f: File | null) => void; accept?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div onClick={() => ref.current?.click()} style={{ border: '2px dashed #bfdbfe', borderRadius: 12, padding: 18, textAlign: 'center', cursor: 'pointer', background: file ? '#f0fdf4' : '#f8fafc' }}>
        {file
          ? <div style={{ color: '#065f46', fontWeight: 600, fontSize: 13 }}>✅ {file.name}</div>
          : <div style={{ color: '#64748b', fontSize: 13 }}>📄 Click to upload</div>}
      </div>
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{children}</div>
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{children}</div>
}

const input: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 13, borderRadius: 12, border: 'none',
  background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
}
