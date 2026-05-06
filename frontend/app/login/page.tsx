'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [showPwd, setShowPwd] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: 8 }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></div>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 15, marginBottom: 32 }}>Welcome back! Sign in to your account</div>

        {step === 'login' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email or Phone Number</label>
              <input type="text" placeholder="e.g. m.usman@gmail.com or 0312-4567890" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>👁</button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <Link href="/forgot-password" style={{ fontSize: 13, color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 16 }}>
              🔒 PakSwap will NEVER ask for your 2FA code or password via phone or chat.
            </div>

            <button onClick={() => setStep('otp')} style={{ width: '100%', padding: '13px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>Sign In</button>

            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 16, position: 'relative' }}>
              <span style={{ background: 'white', padding: '0 12px', position: 'relative', zIndex: 1 }}>or continue with</span>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e2e8f0', zIndex: 0 }} />
            </div>

            <button style={{ width: '100%', padding: 12, border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Enter Verification Code</div>
              <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>We sent a 6-digit code to your phone +92-312-XXXXXXX</div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  style={{ width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700, border: '2px solid #e2e8f0', borderRadius: 10, outline: 'none' }}
                />
              ))}
            </div>

            <Link href="/marketplace">
              <button style={{ width: '100%', padding: '13px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>Verify & Login</button>
            </Link>

            <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 8 }}>
              Didn't receive it? <a href="#" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Resend in 0:45</a>
            </div>

            <button onClick={() => setStep('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, width: '100%' }}>← Back</button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
          Don't have an account? <Link href="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}
