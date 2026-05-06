'use client'
import { useState } from 'react'
import Link from 'next/link'

type Step = 1 | 2 | 3 | 4 | 5

const steps = [
  { n: 1, title: 'Step 1: CNIC Upload', sub: 'Completed', status: 'done' },
  { n: 2, title: 'Step 2: Selfie Check', sub: 'In Progress', status: 'active' },
  { n: 3, title: 'Step 3: Address Proof', sub: 'For higher limits', status: 'pending' },
  { n: 4, title: 'Step 4: Review', sub: 'Awaiting submission', status: 'pending' },
]

export default function KycPage() {
  const [activeStep, setActiveStep] = useState<Step>(2)
  const [selfieDone, setSelfieDone] = useState(false)
  const [addrUploaded, setAddrUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#92400e' }}>⚠️ Verification Required</div>
          <Link href="/marketplace"><button style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white' }}>Skip for now</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Left Sidebar */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Identity Verification</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Complete all steps to unlock full trading</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {steps.map(s => {
                const isDone = s.status === 'done' || (s.n === 2 && selfieDone && activeStep > 2) || (s.n === 3 && addrUploaded && activeStep > 3)
                const isActive = activeStep === s.n
                return (
                  <div key={s.n} onClick={() => setActiveStep(s.n as Step)} style={{ background: 'white', border: `1.5px solid ${isDone ? '#10b981' : isActive ? '#3b82f6' : '#e2e8f0'}`, borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isDone ? '#ecfdf5' : isActive ? '#eff6ff' : 'white', boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none' } as any}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDone ? '#10b981' : isActive ? '#2563eb' : '#e2e8f0', color: isDone || isActive ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{isDone ? '✓' : s.n}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: isDone || isActive ? '#1e293b' : '#94a3b8' }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: isDone ? '#10b981' : isActive ? '#2563eb' : '#94a3b8' }}>{isDone ? 'Completed' : s.sub}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Why verify?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#64748b' }}>
              <div>✅ Trade up to 500,000 PKR/day</div>
              <div>✅ Access all payment methods</div>
              <div>✅ Merchant eligibility</div>
              <div>✅ Dispute protection</div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            {/* Step 1: CNIC */}
            {activeStep === 1 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</div>
                  <div><div style={{ fontSize: 18, fontWeight: 800 }}>CNIC Upload</div><div style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>Completed successfully</div></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {['Front', 'Back'].map(side => (
                    <div key={side} style={{ border: '2px solid #10b981', borderRadius: 14, padding: '36px 24px', textAlign: 'center', background: '#ecfdf5' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#065f46' }}>CNIC {side} Uploaded</div>
                      <div style={{ fontSize: 12, color: '#6ee7b7', marginTop: 4 }}>cnic_{side.toLowerCase()}.jpg</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 16px', marginTop: 16, fontSize: 13, color: '#065f46' }}>✓ OCR extracted: Name matches account. CNIC number detected. No issues found.</div>
                <button onClick={() => setActiveStep(2)} style={{ marginTop: 16, padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Continue to Selfie →</button>
              </div>
            )}

            {/* Step 2: Selfie */}
            {activeStep === 2 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>2</div>
                  <div><div style={{ fontSize: 18, fontWeight: 800 }}>Selfie Verification</div><div style={{ color: '#2563eb', fontSize: 13 }}>Live face match — quick and easy</div></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {!selfieDone ? (
                    <div onClick={() => setSelfieDone(true)} style={{ width: 240, height: 300, borderRadius: 20, background: 'linear-gradient(135deg,#1e293b,#334155)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, cursor: 'pointer' }}>
                      <div style={{ width: 120, height: 150, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'rgba(255,255,255,0.1)', border: '3px dashed rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Click to Start Camera</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Liveness detection enabled</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ width: 240, height: 300, borderRadius: 20, background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>😊</div>
                      <div style={{ marginTop: 12, color: '#10b981', fontWeight: 700, fontSize: 15 }}>✓ Selfie Captured Successfully</div>
                    </div>
                  )}
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#92400e', marginBottom: 20 }}>
                  <strong>Tips for a good selfie:</strong>
                  <ul style={{ margin: '8px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Face should be fully visible, no glasses</li>
                    <li>Good lighting — avoid shadows and glare</li>
                    <li>Look directly at the camera</li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Liveness Check Steps:</div>
                  {['Look straight at camera', 'Slowly turn left', 'Slowly turn right', 'Smile naturally'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginBottom: 8 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: selfieDone ? '#d1fae5' : '#e2e8f0', color: selfieDone ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{selfieDone ? '✓' : i + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>

                {!selfieDone ? (
                  <button onClick={() => setSelfieDone(true)} style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>📷 Start Liveness Check</button>
                ) : (
                  <button onClick={() => setActiveStep(3)} style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Continue to Address Proof →</button>
                )}
              </div>
            )}

            {/* Step 3: Address */}
            {activeStep === 3 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#94a3b8' }}>3</div>
                  <div><div style={{ fontSize: 18, fontWeight: 800 }}>Address Proof</div><div style={{ color: '#64748b', fontSize: 13 }}>For higher trading limits (optional)</div></div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Upload one of the following:</div>
                  {['Utility Bill', 'Bank Statement', 'NADRA Certificate'].map((doc, i) => (
                    <label key={doc} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', marginBottom: 8 }}>
                      <input type="radio" name="addr" defaultChecked={i === 0} style={{ accentColor: '#2563eb' }} />
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{doc}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>{['Not older than 3 months', 'Last 90 days', 'Current'][i]}</div>
                    </label>
                  ))}
                </div>

                {!addrUploaded ? (
                  <div onClick={() => setAddrUploaded(true)} style={{ border: '2px dashed #cbd5e1', borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'; (e.currentTarget as HTMLElement).style.background = '#eff6ff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1'; (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Click to Upload Document</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>PDF, JPG, PNG — max 10MB</div>
                  </div>
                ) : (
                  <div style={{ border: '2px solid #10b981', borderRadius: 14, padding: '36px 24px', textAlign: 'center', background: '#ecfdf5' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 700, color: '#065f46' }}>Document Uploaded</div>
                    <div style={{ fontSize: 12, color: '#6ee7b7', marginTop: 4 }}>utility_bill.pdf (2.1MB)</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button onClick={() => setActiveStep(2)} style={{ padding: '12px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back</button>
                  <button onClick={() => setActiveStep(4)} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Continue to Review →</button>
                </div>
                <button onClick={() => setActiveStep(4)} style={{ width: '100%', padding: '10px', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'transparent', color: '#64748b', marginTop: 8 }}>Skip for now (lower limits)</button>
              </div>
            )}

            {/* Step 4: Review */}
            {activeStep === 4 && !submitted && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ fontSize: 36 }}>🔍</div>
                  <div><div style={{ fontSize: 18, fontWeight: 800 }}>Review & Submit</div><div style={{ color: '#64748b', fontSize: 13 }}>Check everything before submitting</div></div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Submission Summary</div>
                  {[['CNIC Front & Back', '✓ Uploaded'], ['Selfie / Liveness', selfieDone ? '✓ Captured' : '✕ Not done'], ['Address Proof', addrUploaded ? '✓ Uploaded' : 'Skipped'], ['KYC Level', addrUploaded ? 'Full KYC (500k PKR/day)' : 'Basic KYC (50k PKR/day)']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: v?.startsWith('✓') ? '#10b981' : v?.startsWith('✕') ? '#ef4444' : '#1d4ed8' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1e40af' }}>
                  ⏱ Average review time: <strong>15 min – 2 hours</strong> during business hours (9AM–9PM PKT).
                </div>
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: 14, fontSize: 13, color: '#92400e', marginBottom: 20 }}>
                  ⚠️ <strong>Important:</strong> All documents must match your registered name exactly. Submitting fake or altered documents will result in permanent account ban.
                </div>

                <button onClick={() => setSubmitted(true)} style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>✅ Submit for Review</button>
                <button onClick={() => setActiveStep(3)} style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Go Back</button>
              </div>
            )}

            {/* Submitted */}
            {submitted && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>KYC Submitted — Under Review</div>
                <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Both layers must pass before your account is approved</div>

                <div style={{ border: '2px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 24, textAlign: 'left' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', padding: '12px 16px', color: 'white', fontWeight: 800, fontSize: 14 }}>🔐 Two-Layer KYC Review — MANDATORY</div>
                  <div style={{ padding: 16, background: '#f0f9ff', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Layer 1 — AI Document Scan <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700, marginLeft: 4 }}>⚙️ Processing</span></div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>OCR verification, face match, liveness check, tamper detection</div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Layer 2 — Human Review <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700, marginLeft: 4 }}>MANDATORY</span></div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>Compliance officer reviews all documents. SLA: 2 hours. Cannot be bypassed.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href="/marketplace" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Continue Trading (Basic)</button></Link>
                  <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', padding: '14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Go to Dashboard</button></Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
