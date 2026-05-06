'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Step = 1 | 2 | 3 | 4

function strengthInfo(v: string) {
  const len = v.length >= 8, upper = /[A-Z]/.test(v), num = /[0-9]/.test(v), spec = /[^A-Za-z0-9]/.test(v)
  const score = [len, upper, num, spec].filter(Boolean).length
  const colors = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, color: colors[score] || '#94a3b8', label: v ? (labels[score] + ' password') : 'Enter password to check strength', len, upper, num, spec }
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>(1)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPwd, setNewPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [timer, setTimer] = useState(598)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const timerStr = timer > 0 ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Expired'
  const str = strengthInfo(newPwd)

  const handleOtp = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (!val && i > 0) otpRefs.current[i - 1]?.focus()
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: 24 }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Reset Your Password</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>Enter the email or phone number linked to your account</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email or Phone Number</label>
              <input type="text" placeholder="e.g. m.usman@gmail.com or 0312-4567890" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#92400e', marginBottom: 20 }}>
              🔒 PakSwap will NEVER call you to ask for your reset code. If someone calls asking for it, hang up immediately.
            </div>
            <button onClick={() => setStep(2)} style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>Send Reset Code →</button>
            <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              Remember your password? <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Check Your Phone</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>We sent a 6-digit code to <strong>0312-***-7890</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '16px 0' }}>
              {otp.map((d, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el }} type="text" maxLength={1} value={d} onChange={e => handleOtp(i, e.target.value)}
                  style={{ width: 50, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800, border: '2px solid #e2e8f0', borderRadius: 10, outline: 'none' }} />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              Expires in <span style={{ color: '#ef4444', fontWeight: 700 }}>{timerStr}</span> · <a href="#" onClick={e => { e.preventDefault(); setTimer(598) }} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Resend code</a>
            </div>
            <button onClick={() => setStep(3)} style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>Verify Code →</button>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14 }}>← Change contact</button>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Create New Password</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>Choose a strong password you haven't used before</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} placeholder="Minimum 8 characters" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>👁</button>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= str.score ? str.color : '#e2e8f0' }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: str.color, marginTop: 4 }}>{str.label}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm New Password</label>
              <input type="password" placeholder="Re-enter your new password" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#065f46', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Password Requirements:</div>
              {[['len', str.len, 'At least 8 characters'], ['upper', str.upper, 'One uppercase letter'], ['num', str.num, 'One number'], ['spec', str.spec, 'One special character (!@#$...)']].map(([k, ok, label]) => (
                <div key={k as string} style={{ color: ok ? '#059669' : '#94a3b8' }}>{ok ? '✓' : '○'} {label as string}</div>
              ))}
            </div>
            <button onClick={() => setStep(4)} style={{ width: '100%', padding: 13, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Reset Password →</button>
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>Password Reset!</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Your password has been successfully changed. You can now log in with your new password.</div>
            <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: 10, padding: 12, fontSize: 13, color: '#065f46', marginBottom: 20 }}>
              ✅ All active sessions have been logged out for your security. Please log in again.
            </div>
            <Link href="/login">
              <button style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Sign In Now →</button>
            </Link>
          </div>
        )}

        {step !== 4 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            {([1, 2, 3, 4] as Step[]).map(s => (
              <div key={s} style={{ width: 8, height: 8, borderRadius: '50%', background: s === step ? '#2563eb' : '#e2e8f0' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
