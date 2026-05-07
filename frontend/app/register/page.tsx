'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPwd, setShowPwd] = useState(false)
  const [pwd, setPwd] = useState('')
  const [checks, setChecks] = useState([false, false, false])

  function pwdStrength(v: string) {
    let score = 0
    if (v.length >= 8) score++
    if (/[A-Z]/.test(v)) score++
    if (/[0-9]/.test(v)) score++
    if (/[^A-Za-z0-9]/.test(v)) score++
    return score
  }
  const strength = pwdStrength(pwd)
  const strColors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  const strLabels = ['Enter a password', 'Too weak', 'Could be stronger', 'Good password', 'Strong password ✓']

  const allChecked = checks[0] && checks[1] && checks[2]

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Pak<span style={{ color: '#bfdbfe' }}>Swap</span></div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{step === 1 ? 'Create Your Account' : 'Almost Done!'}</div>
          <div style={{ fontSize: '14px', opacity: 0.75, marginTop: '4px' }}>
            Step {step} of 3 — {['', 'Basic Information', 'Set Password & Verify', 'Agreement & Consent'][step]}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n < step ? '#10b981' : n === step ? '#2563eb' : '#e2e8f0', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {step === 1 && (
            <div>
              {[
                { label: 'Full Name', placeholder: 'As on your CNIC (e.g. Muhammad Usman)', hint: 'Must match your CNIC exactly for verification', type: 'text' },
                { label: 'Email Address', placeholder: 'your@email.com', hint: '', type: 'email' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{f.label} <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  {f.hint && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{f.hint}</div>}
                </div>
              ))}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Pakistani Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>🇵🇰 +92</div>
                  <input type="tel" placeholder="0312-4567890" style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Used for trade notifications and 2FA</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Referral Code <span style={{ color: '#94a3b8' }}>(optional)</span></label>
                <input type="text" placeholder="e.g. PAKSWAP-USM42" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>🎁 Both you and your referrer earn 500 PKR bonus!</div>
              </div>
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Create Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Min. 8 characters"
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
                <input type="password" placeholder="Re-enter password" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#1d4ed8' }}>
                📱 We'll send a 6-digit OTP to your phone to verify your number.
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>Verify Phone Number</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="tel" placeholder="+92-312-XXXXXXX (pre-filled)" readOnly style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                  <button style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #2563eb', background: 'white', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Send OTP</button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Enter 6-digit OTP" style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                  <button style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Verify</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep(1)} style={{ padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Continue →</button>
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
                    <input type="checkbox" checked={checks[i]} onChange={e => { const n = [...checks]; n[i] = e.target.checked; setChecks(n) }} style={{ marginTop: '2px', accentColor: '#2563eb', width: '16px', height: '16px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.label}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{c.desc}</div>
                    </div>
                  </label>
                ))}
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', padding: '14px', border: '1.5px solid #f1f5f9', borderRadius: '10px', background: '#f8fafc' }}>
                  <input type="checkbox" style={{ marginTop: '2px', accentColor: '#2563eb', width: '16px', height: '16px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#94a3b8' }}>Marketing Emails <span style={{ fontWeight: 400 }}>(optional)</span></div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Receive tips, promotions, and market updates.</div>
                  </div>
                </label>
              </div>
              <Link href="/kyc">
                <button disabled={!allChecked} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: allChecked ? '#16a34a' : '#d1d5db', color: 'white', fontWeight: 700, fontSize: '15px', cursor: allChecked ? 'pointer' : 'not-allowed', marginBottom: '12px', opacity: allChecked ? 1 : 0.6 }}>
                  🎉 Create My Account
                </button>
              </Link>
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
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
