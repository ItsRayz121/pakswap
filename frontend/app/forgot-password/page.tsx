'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [pwd, setPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otpTimer, setOtpTimer] = useState(598)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step !== 2) return
    const iv = setInterval(() => setOtpTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [step])

  const mm = Math.floor(otpTimer / 60)
  const ss = (otpTimer % 60).toString().padStart(2, '0')

  function handleOtp(i: number, v: string) {
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }

  async function handleSendCode() {
    if (!contact.trim()) return setError('Please enter your email or phone number.')
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(contact)
      setStep(2)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to send reset code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    if (pwd.length < 8) return setError('Password must be at least 8 characters.')
    if (pwd !== confirmPwd) return setError('Passwords do not match.')
    const code = otp.join('')
    if (code.length < 6) return setError('Enter the 6-digit code.')
    setError('')
    setLoading(true)
    try {
      const isEmail = contact.includes('@')
      await authApi.resetPassword({
        ...(isEmail ? { email: contact } : { emailOrPhone: contact }),
        otp: code,
        newPassword: pwd,
      })
      setStep(4)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function pwdScore(v: string) {
    return [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length
  }
  const score = pwdScore(pwd)
  const barColors = ['#e2e8f0', '#ef4444', '#f59e0b', '#f59e0b', '#10b981']
  const barLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  const reqs = [
    { met: pwd.length >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(pwd), label: 'One uppercase letter' },
    { met: /[0-9]/.test(pwd), label: 'One number' },
    { met: /[^A-Za-z0-9]/.test(pwd), label: 'One special character (!@#$...)' },
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: '8px' }}>
          Pak<span style={{ color: '#1e293b' }}>Swap</span>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Reset Your Password</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Enter the email or phone number linked to your account</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email or Phone Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                placeholder="e.g. m.usman@gmail.com or 0312-4567890"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#92400e', marginBottom: '20px' }}>
              🔒 PakSwap will NEVER call you to ask for your reset code.
            </div>
            <button onClick={handleSendCode} disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Code →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
              Remember your password? <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Check Your Inbox</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>We sent a 6-digit reset code to <strong>{contact}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '16px 0' }}>
              {otp.map((v, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el }} type="text" maxLength={1} value={v}
                  onChange={e => handleOtp(i, e.target.value)}
                  style={{ width: '50px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: 800, border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Expires in <span style={{ color: '#ef4444', fontWeight: 700 }}>{mm}:{ss}</span> ·{' '}
              <button onClick={handleSendCode} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Resend code</button>
            </div>
            <button onClick={() => setStep(3)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginBottom: '8px' }}>
              Verify Code →
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'transparent', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#64748b' }}>← Change contact</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Create New Password</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Choose a strong password you haven't used before</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Minimum 8 characters"
                  style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>👁</button>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n <= score ? barColors[score] : '#e2e8f0', transition: 'all 0.3s' }} />
                ))}
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px', color: score > 0 ? barColors[score] : '#94a3b8' }}>
                {pwd ? barLabels[score] + ' password' : 'Enter password to check strength'}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter your new password"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#065f46', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Password Requirements:</div>
              {reqs.map(r => (
                <div key={r.label} style={{ color: r.met ? '#059669' : '#94a3b8' }}>{r.met ? '✓' : '○'} {r.label}</div>
              ))}
            </div>
            <button onClick={handleResetPassword} disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#6ee7b7' : '#16a34a', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>Password Reset!</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Your password has been successfully changed. You can now log in with your new password.</div>
            <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#065f46', marginBottom: '20px' }}>
              ✅ All active sessions have been logged out for your security.
            </div>
            <Link href="/login" style={{ display: 'block', padding: '14px', borderRadius: '12px', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
              Sign In Now →
            </Link>
          </div>
        )}

        {step < 4 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ width: '8px', height: '8px', borderRadius: '50%', background: n === step ? '#2563eb' : '#e2e8f0' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
