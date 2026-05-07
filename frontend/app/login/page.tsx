'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [view, setView] = useState<'login' | 'otp' | 'twofa'>('login')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [preAuthToken, setPreAuthToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  async function handleLogin() {
    if (!emailOrPhone || !password) return setError('Please fill in all fields.')
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ emailOrPhone, password })
      const data = res.data.data
      if (data.requiresTwoFa) {
        setPreAuthToken(data.preAuthToken)
        setView('twofa')
      } else {
        // Persist token BEFORE calling /me — the axios interceptor reads
        // localStorage on every request to attach Authorization. Without
        // this, /me goes out unauthenticated and returns 401.
        localStorage.setItem('access_token', data.accessToken)
        const me = await authApi.me()
        setAuth(me.data.data, data.accessToken)
        router.push('/dashboard')
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpChange(i: number, v: string) {
    const next = [...otp]
    next[i] = v.slice(-1)
    setOtp(next)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }

  async function handle2fa() {
    const code = otp.join('')
    if (code.length < 6) return
    setError('')
    setLoading(true)
    try {
      const res = await authApi.verify2fa(preAuthToken, code)
      const { accessToken } = res.data.data
      localStorage.setItem('access_token', accessToken)
      const me = await authApi.me()
      setAuth(me.data.data, accessToken)
      router.push('/dashboard')
    } catch {
      setError('Invalid 2FA code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const bg = 'linear-gradient(135deg,#0f172a,#1e3a8a)'

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: '8px' }}>
          Pak<span style={{ color: '#1e293b' }}>Swap</span>
        </div>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Welcome back! Sign in to your account</div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {view === 'login' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email or Phone Number</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="e.g. m.usman@gmail.com or 0312-4567890"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <button onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>👁</button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <Link href="/forgot-password" style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
              🔒 PakSwap will NEVER ask for your 2FA code or password via phone or chat.
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        )}

        {view === 'twofa' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>Two-Factor Authentication</div>
              <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Enter the 6-digit code from your authenticator app</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => {
                    handleOtpChange(i, e.target.value)
                    if (e.target.value && i === 5) {
                      const code = [...otp.slice(0, 5), e.target.value].join('')
                      if (code.length === 6) setTimeout(handle2fa, 100)
                    }
                  }}
                  style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: 700, border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }}
                />
              ))}
            </div>
            <button
              onClick={handle2fa}
              disabled={loading || otp.join('').length < 6}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button onClick={() => { setView('login'); setOtp(['', '', '', '', '', '']); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', marginTop: '12px', width: '100%' }}>← Back to login</button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account? <Link href="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}
