'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.email) setEmail(user.email)
    setTimeout(() => codeRef.current?.focus(), 100)
  }, [user])

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function maskedEmail(e: string) {
    const [local, domain] = e.split('@')
    if (!local || !domain) return e
    const head = local.slice(0, Math.min(2, local.length))
    return `${head}${'•'.repeat(Math.max(1, local.length - 2))}@${domain}`
  }

  async function handleVerify() {
    if (!email) return setError('Email is required.')
    if (code.length !== 6) return setError('Enter the 6-digit code.')
    setError('')
    setLoading(true)
    try {
      await authApi.verifyEmail(email.trim().toLowerCase(), code)
      updateUser({ emailVerified: true })
      router.push('/dashboard?verified=1')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendIn > 0) return
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await authApi.resendEmailOtp(email.trim().toLowerCase())
      setResendIn(60)
      setInfo('A new code has been sent.')
    } catch (e: any) {
      const retry = e?.response?.data?.retryAfter
      if (retry) setResendIn(retry)
      setError(e?.response?.data?.message ?? 'Could not resend code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Pak<span style={{ color: '#bfdbfe' }}>Swap</span></div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Verify your email</div>
          {email && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Code sent to {maskedEmail(email)}</div>}
        </div>
        <div style={{ padding: '28px 32px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}
          {info && !error && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1e40af' }}>{info}</div>
          )}
          {!user && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
            </div>
          )}
          <input
            ref={codeRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            style={{ ...inputStyle, fontSize: 24, letterSpacing: 12, textAlign: 'center', fontWeight: 700 }}
          />
          <button onClick={handleVerify} disabled={loading || code.length !== 6} style={{ ...primaryBtn, marginTop: 16, opacity: loading || code.length !== 6 ? 0.6 : 1 }}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            Didn't get it?{' '}
            {resendIn > 0 ? (
              <span style={{ color: '#94a3b8' }}>Resend in {resendIn}s</span>
            ) : (
              <button type="button" onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 13 }}>Resend code</button>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            <Link href="/dashboard" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>← Back to dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 13, borderRadius: 12, border: 'none',
  background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
}
