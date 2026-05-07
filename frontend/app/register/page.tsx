'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

type Stage = 'form' | 'verify'

export default function RegisterPage() {
  const router = useRouter()

  const [stage, setStage] = useState<Stage>('form')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [agree, setAgree] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const [otp, setOtp] = useState('')
  const [resendIn, setResendIn] = useState(0)

  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function pwdStrength(v: string) {
    return [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length
  }
  const strength = pwdStrength(password)
  const strColors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  const strLabels = ['Enter a password', 'Too weak', 'Could be stronger', 'Good password', 'Strong password ✓']

  function maskedEmail(e: string) {
    const [local, domain] = e.split('@')
    if (!local || !domain) return e
    const head = local.slice(0, Math.min(2, local.length))
    return `${head}${'•'.repeat(Math.max(1, local.length - 2))}@${domain}`
  }

  async function handleRegister() {
    setError('')
    if (!fullName.trim() || !email.trim() || !password) return setError('Please fill in all fields.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPwd) return setError('Passwords do not match.')
    if (!agree) return setError('Please agree to the Terms and Privacy Policy.')

    setLoading(true)
    try {
      await authApi.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        ...(referralCode ? { referralCode: referralCode.trim() } : {}),
      })
      setStage('verify')
      setResendIn(60)
      setInfo('We sent a 6-digit code to your email.')
      setTimeout(() => otpRef.current?.focus(), 100)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    setError('')
    if (otp.length !== 6) return setError('Enter the 6-digit code.')
    setLoading(true)
    try {
      await authApi.verifyEmail(email.trim().toLowerCase(), otp)
      router.push('/login?verified=1')
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
      setInfo('A new code has been sent to your email.')
    } catch (e: any) {
      const retry = e?.response?.data?.retryAfter
      if (retry) setResendIn(retry)
      setError(e?.response?.data?.message ?? 'Could not resend code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '460px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Pak<span style={{ color: '#bfdbfe' }}>Swap</span></div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{stage === 'form' ? 'Create your account' : 'Verify your email'}</div>
          <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
            {stage === 'form' ? 'Takes less than 30 seconds' : `Code sent to ${maskedEmail(email)}`}
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
              {error}
            </div>
          )}
          {info && !error && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#1e40af' }}>
              {info}
            </div>
          )}

          {stage === 'form' && (
            <div>
              <Field label="Full Name" required>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Muhammad Usman" style={inputStyle} />
              </Field>

              <Field label="Email Address" required>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" style={inputStyle} />
              </Field>

              <Field label="Password" required>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" autoComplete="new-password" style={{ ...inputStyle, paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} style={eyeBtn}>{showPwd ? '🙈' : '👁'}</button>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', background: strength >= n ? strColors[strength] : '#e2e8f0' }} />
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: strength >= 3 ? '#10b981' : '#94a3b8', marginTop: '4px' }}>{strLabels[strength]}</div>
              </Field>

              <Field label="Confirm Password" required>
                <input type={showPwd ? 'text' : 'password'} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" style={inputStyle} />
              </Field>

              <Field label="Referral Code (optional)">
                <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="ABCD1234" style={inputStyle} />
              </Field>

              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '16px', cursor: 'pointer', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: '3px', accentColor: '#2563eb', flexShrink: 0 }} />
                <span>I agree to the <a href="/terms" style={linkInline}>Terms of Service</a> and <a href="/privacy" style={linkInline}>Privacy Policy</a>, and confirm I am 18 or older.</span>
              </label>

              <button onClick={handleRegister} disabled={loading} style={{ ...primaryBtn, marginTop: '20px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          )}

          {stage === 'verify' && (
            <div>
              <p style={{ margin: '0 0 18px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                Enter the 6-digit code we just emailed to <b>{maskedEmail(email)}</b>. The code expires in 10 minutes.
              </p>

              <input
                ref={otpRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                style={{ ...inputStyle, fontSize: '24px', letterSpacing: '12px', textAlign: 'center', fontWeight: 700 }}
              />

              <button onClick={handleVerify} disabled={loading || otp.length !== 6} style={{ ...primaryBtn, marginTop: '16px', opacity: loading || otp.length !== 6 ? 0.6 : 1 }}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                Didn't get it?{' '}
                {resendIn > 0 ? (
                  <span style={{ color: '#94a3b8' }}>Resend in {resendIn}s</span>
                ) : (
                  <button type="button" onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '13px' }}>Resend code</button>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                Wrong email?{' '}
                <button type="button" onClick={() => { setStage('form'); setOtp(''); setError(''); setInfo('') }} style={{ background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '12px' }}>Go back</button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            Already have an account? <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '13px',
  borderRadius: '12px',
  border: 'none',
  background: '#16a34a',
  color: 'white',
  fontWeight: 700,
  fontSize: '15px',
  cursor: 'pointer',
}

const eyeBtn: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '4px',
}

const linkInline: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 }
