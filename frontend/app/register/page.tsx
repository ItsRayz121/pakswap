'use client'
import { useState } from 'react'
import Link from 'next/link'

type Step = 1 | 2 | 3

const stepTitles = ['Basic Information', 'Set Password & Verify', 'Agreement & Consent']

function strengthInfo(v: string) {
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  const colors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  const labels = ['Enter a password', 'Too weak', 'Could be stronger', 'Good password', 'Strong password ✓']
  return { pct: score * 25, color: colors[score], label: labels[score] }
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [c1, setC1] = useState(false)
  const [c2, setC2] = useState(false)
  const [c3, setC3] = useState(false)

  const str = strengthInfo(pwd)
  const allChecked = c1 && c2 && c3

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white' }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Pak<span style={{ color: '#bfdbfe' }}>Swap</span></div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{step === 1 ? 'Create Your Account' : 'Almost Done!'}</div>
          <div style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>Step {step} of 3 — {stepTitles[step - 1]}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            {([1, 2, 3] as Step[]).map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s < step ? '#10b981' : s === step ? '#2563eb' : '#e2e8f0', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        <div style={{ padding: 32 }}>
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="As on your CNIC (e.g. Muhammad Usman)" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Must match your CNIC exactly for verification</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Pakistani Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>🇵🇰 +92</div>
                  <input type="tel" placeholder="0312-4567890" style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Used for trade notifications and 2FA</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Referral Code <span style={{ color: '#94a3b8' }}>(optional)</span></label>
                <input type="text" placeholder="e.g. PAKSWAP-USM42" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>🎁 Both you and your referrer earn 500 PKR bonus!</div>
              </div>
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Continue →</button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Create Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={pwd} onChange={e => setPwd(e.target.value)} style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>👁</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ background: '#e2e8f0', borderRadius: 2, height: 4, width: '100%' }}>
                    <div style={{ height: 4, borderRadius: 2, width: `${str.pct}%`, background: str.color, transition: 'all 0.3s' }} />
                  </div>
                  <div style={{ fontSize: 12, color: str.color, marginTop: 4 }}>{str.label}</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="password" placeholder="Re-enter password" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e40af', marginBottom: 20 }}>
                📱 We'll send a 6-digit OTP to your phone to verify your number.
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Verify Phone Number</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="tel" placeholder="+92-312-XXXXXXX (pre-filled)" readOnly style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }} />
                  <button onClick={() => setOtpSent(true)} style={{ padding: '10px 16px', border: `1.5px solid ${otpSent ? '#10b981' : '#e2e8f0'}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white', color: otpSent ? '#10b981' : '#374151', whiteSpace: 'nowrap' }}>{otpSent ? 'Sent ✓' : 'Send OTP'}</button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="Enter 6-digit OTP" style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  <button style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9', color: '#374151' }}>Verify</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep(1)} style={{ padding: '12px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9', color: '#374151' }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: 12, background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Continue →</button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Agreement & Consent</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { id: 'c1', val: c1, set: setC1, title: 'Terms of Service', desc: "I agree to PakSwap's Terms of Service including trading rules and platform policies." },
                    { id: 'c2', val: c2, set: setC2, title: 'Privacy Policy', desc: 'I consent to the collection and processing of my data as described in the Privacy Policy.' },
                    { id: 'c3', val: c3, set: setC3, title: 'Age Confirmation', desc: 'I confirm I am 18 years of age or older.' },
                  ].map(({ id, val, set, title, desc }) => (
                    <label key={id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: 14, border: '1.5px solid #e2e8f0', borderRadius: 10 }}>
                      <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ marginTop: 2, accentColor: '#2563eb', width: 16, height: 16, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                  <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: 14, border: '1.5px solid #f1f5f9', borderRadius: 10, background: '#f8fafc' }}>
                    <input type="checkbox" style={{ marginTop: 2, accentColor: '#2563eb', width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#94a3b8' }}>Marketing Emails <span style={{ fontWeight: 400 }}>(optional)</span></div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Receive tips, promotions, and market updates.</div>
                    </div>
                  </label>
                </div>
              </div>

              <Link href="/kyc">
                <button disabled={!allChecked} style={{ width: '100%', padding: 13, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: allChecked ? 'pointer' : 'not-allowed', opacity: allChecked ? 1 : 0.5, marginBottom: 12 }}>🎉 Create My Account</button>
              </Link>
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: 12, border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9', color: '#374151' }}>← Back</button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            Already have an account? <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
