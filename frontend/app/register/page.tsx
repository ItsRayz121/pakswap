'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')

  // Step 2 fields
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)

  // Step 3
  const [checks, setChecks] = useState([false, false, false])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fullPhone = '+92' + phone.replace(/^0/, '').replace(/[^0-9]/g, '')

  function pwdStrength(v: string) {
    return [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length
  }
  const strength = pwdStrength(password)
  const strColors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  const strLabels = ['Enter a password', 'Too weak', 'Could be stronger', 'Good password', 'Strong password ✓']

  async function handleStep1() {
    if (!fullName.trim() || !email.trim() || !phone.trim()) return setError('Please fill in all required fields.')
    setError('')
    setStep(2)
  }

  async function handleSendOtp() {
    setError('')
    setLoading(true)
    try {
      await authApi.resendOtp(fullPhone)
      setOtpSent(true)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to send OTP. Check your phone number.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp() {
    if (otpCode.length < 6) return setError('Enter the 6-digit OTP.')
    setError('')
    setLoading(true)
    try {
      await authApi.verifyOtp(fullPhone, otpCode)
      setPhoneVerified(true)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleStep2() {
    if (!password || password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPwd) return setError('Passwords do not match.')
    if (!phoneVerified) return setError('Please verify your phone number first.')
    setError('')
    setStep(3)
  }

  async function handleRegister() {
    setError('')
    setLoading(true)
    try {
      await authApi.register({
        fullName,
        email,
        phone: fullPhone,
        password,
        ...(referralCode ? { referralCode } : {}),
      })
      router.push('/login?registered=1')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const allChecked = checks[0] && checks[1] && checks[2]

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Pak<span style={{ color: '#bfdbfe' }}>Swap</span></div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{step === 1 ? 'Create Your Account' : 'Almost Done!'}</div>
          <div style={{ fontSize: '14px', opacity: 0.75, marginTop: '4px' }}>
            Step {step} of 3 — {['', 'Basic Information', 'Set Password & Verify', 'Agreement & Consent'][step]}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n < step ? '#10b981' : n === step ? 'white' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="As on your CNIC (e.g. Muhammad Usman)"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Must match your CNIC exactly for verification</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Pakistani Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>🇵🇰 +92</div>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0312-4567890"
                    style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Used for trade notifications and 2FA</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Referral Code <span style={{ color: '#94a3b8' }}>(optional)</span></label>
                <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="e.g. PAKSWAP-USM42"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>🎁 Both you and your referrer earn 500 PKR bonus!</div>
              </div>
              <button onClick={handleStep1} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Create Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                    style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>👁</button>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength * 25}%`, background: strColors[strength], borderRadius: '2px', transition: 'all 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: strColors[strength], marginTop: '4px' }}>{strLabels[strength]}</div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter password"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#1d4ed8' }}>
                📱 We'll send a 6-digit OTP to <strong>{fullPhone}</strong> to verify your number.
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>Verify Phone Number</div>
                {!phoneVerified ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input type="tel" value={fullPhone} readOnly
                        style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc' }} />
                      <button onClick={handleSendOtp} disabled={loading}
                        style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #2563eb', background: 'white', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                    {otpSent && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6}
                          style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                        <button onClick={handleVerifyOtp} disabled={loading}
                          style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #10b981', background: '#f0fdf4', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#065f46' }}>
                          Verify
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#065f46', fontWeight: 600 }}>
                    ✅ Phone number verified!
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setStep(1); setError('') }} style={{ padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
                <button onClick={handleStep2} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Agreement &amp; Consent</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Terms of Service', desc: "I agree to PakSwap's Terms of Service including trading rules and platform policies." },
                  { label: 'Privacy Policy', desc: 'I consent to the collection and processing of my data as described in the Privacy Policy.' },
                  { label: 'Age Confirmation', desc: 'I confirm I am 18 years of age or older.' },
                ].map((c, i) => (
                  <label key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', padding: '14px', border: `1.5px solid ${checks[i] ? '#2563eb' : '#e2e8f0'}`, borderRadius: '10px' }}>
                    <input type="checkbox" checked={checks[i]} onChange={e => { const n = [...checks]; n[i] = e.target.checked; setChecks(n) }}
                      style={{ marginTop: '2px', accentColor: '#2563eb', width: '16px', height: '16px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.label}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={handleRegister}
                disabled={!allChecked || loading}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: allChecked ? '#16a34a' : '#d1d5db', color: 'white', fontWeight: 700, fontSize: '15px', cursor: allChecked ? 'pointer' : 'not-allowed', marginBottom: '12px', opacity: allChecked ? 1 : 0.6 }}
              >
                {loading ? 'Creating account...' : '🎉 Create My Account'}
              </button>
              <button onClick={() => { setStep(2); setError('') }} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
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
