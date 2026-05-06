'use client'
import { useState } from 'react'
import Link from 'next/link'

type Step = 1 | 2 | 3 | 4 | 'submitted'

export default function KYCPage() {
  const [step, setStep] = useState<Step>(2)
  const [livenessStep, setLivenessStep] = useState(0)
  const [selfieCapt, setSelfieCapt] = useState(false)

  const startLiveness = () => {
    let i = 0
    const go = () => {
      if (i >= 4) { setSelfieCapt(true); return }
      setLivenessStep(i + 1)
      i++
      setTimeout(go, 700)
    }
    go()
  }

  const steps = [
    { n: 1, label: 'Step 1: CNIC Upload', sub: 'Completed', done: true },
    { n: 2, label: 'Step 2: Selfie Check', sub: 'In Progress', active: step === 2 },
    { n: 3, label: 'Step 3: Address Proof', sub: 'For higher limits', locked: step < 3 },
    { n: 4, label: 'Step 4: Review', sub: 'Awaiting submission', locked: step < 4 },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, color: '#92400e' }}>⚠️ Verification Required</div>
          <Link href="/marketplace"><button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Skip for now</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left: Steps */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Identity Verification</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Complete all steps to unlock full trading</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {steps.map(s => (
              <div key={s.n} onClick={() => setStep(s.n as Step)} style={{
                background: s.done ? '#ecfdf5' : s.active ? '#eff6ff' : 'white',
                border: `1.5px solid ${s.done ? '#10b981' : s.active ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                boxShadow: s.active ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: s.done ? '#10b981' : s.active ? '#2563eb' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.done || s.active ? 'white' : '#94a3b8', fontWeight: 700, fontSize: s.done ? '16px' : '14px',
                }}>{s.done ? '✓' : s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: s.locked ? '#94a3b8' : '#1e293b' }}>{s.label}</div>
                  <div style={{ fontSize: '12px', color: s.done ? '#10b981' : s.active ? '#2563eb' : '#94a3b8' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 16px' }} />
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Why verify?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748b' }}>
            <div>✅ Trade up to 500,000 PKR/day</div>
            <div>✅ Access all payment methods</div>
            <div>✅ Merchant eligibility</div>
            <div>✅ Dispute protection</div>
          </div>
        </div>

        {/* Right: Active step content */}
        <div>
          {/* Step 1: CNIC */}
          {step === 1 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✓</div>
                <div><div style={{ fontSize: '18px', fontWeight: 800 }}>CNIC Upload</div><div style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>Completed successfully</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {['Front', 'Back'].map(side => (
                  <div key={side} style={{ border: '2px solid #10b981', borderRadius: '14px', padding: '36px 24px', textAlign: 'center', background: '#ecfdf5' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#065f46' }}>CNIC {side} Uploaded</div>
                    <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>cnic_{side.toLowerCase()}.jpg</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#065f46', marginBottom: '16px' }}>✓ OCR extracted: Name matches account. CNIC number detected. No issues found.</div>
              <button onClick={() => setStep(2)} style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Continue to Selfie →</button>
            </div>
          )}

          {/* Step 2: Selfie */}
          {step === 2 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>2</div>
                <div><div style={{ fontSize: '18px', fontWeight: 800 }}>Selfie Verification</div><div style={{ color: '#2563eb', fontSize: '13px' }}>Live face match — quick and easy</div></div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {!selfieCapt ? (
                  <div onClick={startLiveness} style={{ width: '240px', height: '300px', borderRadius: '20px', background: 'linear-gradient(135deg,#1e293b,#334155)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '120px', height: '150px', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'rgba(255,255,255,0.1)', border: '3px dashed rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>👤</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600 }}>Click to Start Camera</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Liveness detection enabled</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: '240px', height: '300px', borderRadius: '20px', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>😊</div>
                    <div style={{ marginTop: '12px', color: '#10b981', fontWeight: 700, fontSize: '15px' }}>✓ Selfie Captured Successfully</div>
                  </div>
                )}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#92400e', marginBottom: '20px' }}>
                <strong>Tips for a good selfie:</strong>
                <ul style={{ margin: '8px 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Face should be fully visible, no glasses</li>
                  <li>Good lighting — avoid shadows and glare</li>
                  <li>Look directly at the camera</li>
                  <li>Remove hat, hijab can stay on</li>
                </ul>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#374151' }}>Liveness Check Steps:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Look straight at camera', 'Slowly turn left', 'Slowly turn right', 'Smile naturally'].map((label, i) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: livenessStep > i ? '#065f46' : '#374151' }}>
                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: livenessStep > i ? '#10b981' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: livenessStep > i ? 'white' : '#94a3b8', flexShrink: 0 }}>{livenessStep > i ? '✓' : i + 1}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {!selfieCapt ? (
                <button onClick={startLiveness} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>📷 Start Liveness Check</button>
              ) : (
                <button onClick={() => setStep(3)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Continue to Address Proof →</button>
              )}
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#94a3b8', fontWeight: 700 }}>3</div>
                <div><div style={{ fontSize: '18px', fontWeight: 800 }}>Address Proof</div><div style={{ color: '#64748b', fontSize: '13px' }}>For higher trading limits (optional)</div></div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Upload one of the following:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Utility Bill', note: 'Not older than 3 months' },
                    { label: 'Bank Statement', note: 'Last 90 days' },
                    { label: 'NADRA Certificate', note: 'Current' },
                  ].map((opt, i) => (
                    <label key={opt.label} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' }}>
                      <input type="radio" name="addr" defaultChecked={i === 0} style={{ accentColor: '#2563eb' }} />
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{opt.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginLeft: 'auto' }}>{opt.note}</div>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '36px 24px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Click to Upload Document</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>PDF, JPG, PNG — max 10MB</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => setStep(2)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Continue to Review →</button>
              </div>
              <button onClick={() => setStep(4)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>Skip for now (lower limits)</button>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '36px' }}>🔍</div>
                <div><div style={{ fontSize: '18px', fontWeight: 800 }}>Review &amp; Submit</div><div style={{ color: '#64748b', fontSize: '13px' }}>Check everything before submitting</div></div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Submission Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                  {[
                    ['CNIC Front & Back', '✓ Uploaded'],
                    ['Selfie / Liveness', '✓ Captured'],
                    ['Address Proof', '✓ Uploaded'],
                    ['KYC Level', 'Full KYC (500k PKR/day)', '#1d4ed8'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>{label}</span>
                      <span style={{ color: color || '#10b981', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#1d4ed8', marginBottom: '20px' }}>
                ⏱ Average review time: <strong>15 min – 2 hours</strong> during business hours (9AM–9PM PKT). You'll receive an SMS and email when approved.
              </div>
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#92400e', marginBottom: '20px' }}>
                ⚠️ <strong>Important:</strong> All documents must match your registered name exactly. Submitting fake or altered documents will result in permanent account ban.
              </div>
              <button onClick={() => setStep('submitted')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>✅ Submit for Review</button>
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>← Go Back</button>
            </div>
          )}

          {/* Submitted — Two-Layer Status */}
          {step === 'submitted' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>KYC Submitted — Under Review</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Both layers must pass before your account is approved</div>
              </div>

              {/* Two-Layer Box */}
              <div style={{ background: '#f0f7ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#dbeafe', borderBottom: '1px solid #bfdbfe' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>🔐 KYC Verification — Mandatory Two-Layer Review</span>
                  <span style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>BOTH REQUIRED</span>
                </div>

                {/* Layer 1 AI */}
                <div style={{ borderBottom: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#eff6ff' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>1</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>AI Automated Scan</div>
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>OCR · Face Match · Liveness · Duplicate Check</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>✓ AI Passed</span>
                  </div>
                  <div style={{ padding: '10px 18px' }}>
                    {[
                      ['CNIC OCR', 'Name extracted: Muhammad Usman · ID: 35201-XXXXXXX-X', 'PASS'],
                      ['CNIC Authenticity', 'Layout, font, and format match genuine NADRA CNIC', 'PASS'],
                      ['Face Match', 'Selfie vs CNIC photo similarity: 91.4% (threshold: 85%)', '91.4%'],
                      ['Liveness Detection', 'Real person confirmed, no photo spoof detected', 'PASS'],
                      ['Duplicate Check', 'No existing account found with this CNIC or face', 'CLEAR'],
                      ['Sanctions Screening', 'Not on OFAC, UN, or Pakistan designated lists', 'CLEAR'],
                    ].map(([label, detail, badge]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</div>
                        <div style={{ flex: 1 }}><strong>{label}</strong> — {detail}</div>
                        <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>{badge}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0 4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>AI Confidence</span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '93%', height: '100%', background: '#059669', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669', whiteSpace: 'nowrap' }}>93%</span>
                    </div>
                  </div>
                </div>

                {/* Layer 2 Human */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#fffbeb' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>2</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>Human Admin Review <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, marginLeft: '6px' }}>MANDATORY</span></div>
                      <div style={{ fontSize: '12px', color: '#92400e' }}>A trained reviewer checks every KYC — no exceptions</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>⏳ In Review</span>
                  </div>
                  <div style={{ padding: '14px 18px', background: '#fffbeb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>KYC Reviewer assigned</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Currently reviewing your documents visually</div>
                      </div>
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>SLA</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#d97706' }}>~2 hrs</div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#92400e', marginBottom: '14px' }}>
                      🔍 <strong>What the reviewer checks:</strong> Document quality, name consistency, photo clarity, address document validity, any red flags AI may have missed
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7 }}>
                      ✉️ You'll receive an <strong>SMS and email</strong> once the human review is complete.<br />
                      📅 Submitted: <strong>05 May 2026, 2:30 PM</strong> · Expected by: <strong>4:30 PM PKT</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#166534', marginBottom: '20px' }}>
                ✅ <strong>AI scan passed (Layer 1).</strong> Your application is now in the human review queue (Layer 2). Most applications are approved within 2 hours during business hours (9AM–9PM PKT).
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/marketplace" style={{ flex: 1 }}><button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Browse Marketplace</button></Link>
                <Link href="/wallet" style={{ flex: 1 }}><button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>Go to Wallet</button></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
