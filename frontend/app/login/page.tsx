'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'otp'>('login')
  const [showPwd, setShowPwd] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  function handleOtpChange(i: number, v: string) {
    const next = [...otp]
    next[i] = v.slice(-1)
    setOtp(next)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
    if (v && i === 5) setTimeout(() => router.push('/marketplace'), 300)
  }

  const bg = 'linear-gradient(135deg,#0f172a,#1e3a8a)'

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: '8px' }}>
          Pak<span style={{ color: '#1e293b' }}>Swap</span>
        </div>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Welcome back! Sign in to your account</div>

        {view === 'login' ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email or Phone Number</label>
              <input type="text" placeholder="e.g. m.usman@gmail.com or 0312-4567890"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
                  style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>👁</button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <Link href="/forgot-password" style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
              🔒 PakSwap will NEVER ask for your 2FA code or password via phone or chat.
            </div>

            <button onClick={() => setView('otp')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              Sign In
            </button>

            <div style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', color: '#94a3b8', position: 'relative' }}>
              <span style={{ background: 'white', padding: '0 12px' }}>or continue with</span>
            </div>

            <button style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>Enter Verification Code</div>
              <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>We sent a 6-digit code to your phone +92-312-XXXXXXX</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((v, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el }} type="text" maxLength={1} value={v}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: 700, border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} />
              ))}
            </div>
            <Link href="/marketplace">
              <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
                Verify &amp; Login
              </button>
            </Link>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              Didn't receive it? <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Resend in 0:45</a>
            </div>
            <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', marginTop: '8px', width: '100%' }}>← Back</button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account? <Link href="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}
