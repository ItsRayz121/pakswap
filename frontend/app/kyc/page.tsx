'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { kycApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

type Step = 1 | 2 | 3 | 'submitted'

export default function KYCPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [step, setStep] = useState<Step>(1)
  const [kycStatus, setKycStatus] = useState<string | null>(null)

  // Files
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [addressProof, setAddressProof] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const cnicFrontRef = useRef<HTMLInputElement>(null)
  const cnicBackRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  // Check existing KYC status on load
  const checkStatus = useCallback(async () => {
    try {
      const res = await kycApi.status()
      const s = res.data.data?.status
      setKycStatus(s)
      if (s === 'approved') setStep('submitted')
      else if (s === 'pending') setStep('submitted')
    } catch {}
  }, [])

  useEffect(() => { checkStatus() }, [checkStatus])

  async function handleSubmit() {
    if (!cnicFront || !cnicBack || !selfie) {
      setError('Please upload CNIC front, CNIC back, and selfie.')
      return
    }
    setError('')
    setSubmitting(true)
    const formData = new FormData()
    formData.append('cnicFront', cnicFront)
    formData.append('cnicBack', cnicBack)
    formData.append('selfie', selfie)
    if (addressProof) formData.append('addressProof', addressProof)

    try {
      await kycApi.submit(formData)
      setStep('submitted')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function FileUpload({ label, hint, file, setFile, inputRef, accept = 'image/*,.pdf' }: {
    label: string; hint: string; file: File | null; setFile: (f: File | null) => void; inputRef: React.RefObject<HTMLInputElement>; accept?: string
  }) {
    return (
      <div>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <div onClick={() => inputRef.current?.click()} style={{ border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: file ? '#f0fdf4' : '#f8fafc' }}>
          {file ? (
            <div style={{ color: '#065f46', fontWeight: 600, fontSize: '13px' }}>✅ {file.name}</div>
          ) : (
            <>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>📄</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Click to upload</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{hint}</div>
            </>
          )}
        </div>
      </div>
    )
  }

  const stepDefs = [
    { n: 1, label: 'CNIC Upload',    done: (step as number) > 1 || step === 'submitted', active: step === 1 },
    { n: 2, label: 'Selfie',         done: (step as number) > 2 || step === 'submitted', active: step === 2 },
    { n: 3, label: 'Address Proof',  done: (step as number) > 3 || step === 'submitted', active: step === 3 },
    { n: 4, label: 'Review',         done: step === 'submitted', active: false },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, color: '#92400e' }}>⚠️ Identity Verification</div>
          <Link href="/dashboard"><button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Dashboard</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Sidebar */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>Verification Steps</div>
          {stepDefs.map(s => (
            <div key={s.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.done ? '#10b981' : s.active ? '#2563eb' : '#e2e8f0', color: s.done || s.active ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                {s.done ? '✓' : s.n}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: s.done ? '#10b981' : s.active ? '#2563eb' : '#94a3b8' }}>Step {s.n}: {s.label}</div>
              </div>
            </div>
          ))}

          <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px', marginTop: '16px', fontSize: '13px', color: '#1d4ed8' }}>
            🔒 Your documents are encrypted and stored securely. Used only for identity verification.
          </div>
        </div>

        {/* Main content */}
        <div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626' }}>{error}</div>
          )}

          {step === 'submitted' && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>{kycStatus === 'approved' ? '✅' : '⏳'}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                {kycStatus === 'approved' ? 'KYC Approved!' : 'Documents Submitted!'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                {kycStatus === 'approved'
                  ? 'Your identity has been verified. You can now trade without limits.'
                  : 'Your documents are under review. This usually takes 1–24 hours. We\'ll notify you by email.'}
              </div>
              {kycStatus === 'approved' && (
                <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: '10px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#065f46' }}>
                  ✅ You can now create ads and trade up to your KYC limit.
                </div>
              )}
              <Link href="/dashboard" style={{ display: 'inline-block', padding: '14px 28px', background: '#2563eb', color: 'white', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Back to Dashboard →
              </Link>
            </div>
          )}

          {step === 1 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 1: Upload CNIC</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Upload clear photos of both sides of your National Identity Card (CNIC)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <FileUpload label="CNIC Front *" hint="Clear photo of front" file={cnicFront} setFile={setCnicFront} inputRef={cnicFrontRef} />
                <FileUpload label="CNIC Back *" hint="Clear photo of back" file={cnicBack} setFile={setCnicBack} inputRef={cnicBackRef} />
              </div>
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
                ⚠️ Ensure the CNIC is not expired, and all text is clearly readable. Photos must be under 10MB.
              </div>
              <button onClick={() => { if (!cnicFront || !cnicBack) { setError('Upload both sides of your CNIC.'); return }; setError(''); setStep(2) }}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 2: Selfie</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Take a clear selfie. Your face must be fully visible and well-lit.</div>
              <div style={{ marginBottom: '20px' }}>
                <FileUpload label="Selfie Photo *" hint="Front-facing, face clearly visible" file={selfie} setFile={setSelfie} inputRef={selfieRef} accept="image/*" />
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1d4ed8' }}>
                💡 Tips: Good lighting, no sunglasses, face centred in frame, no filters.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStep(1); setError('') }} style={{ padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                <button onClick={() => { if (!selfie) { setError('Upload your selfie.'); return }; setError(''); setStep(3) }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 3: Address Proof <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '14px' }}>(optional — for higher limits)</span></div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Upload a utility bill, bank statement, or any document showing your current address (within 3 months).</div>
              <div style={{ marginBottom: '20px' }}>
                <FileUpload label="Address Proof" hint="Utility bill, bank statement, etc." file={addressProof} setFile={setAddressProof} inputRef={addressRef} />
              </div>
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Review your documents:</div>
                {[['CNIC Front', cnicFront], ['CNIC Back', cnicBack], ['Selfie', selfie], ['Address Proof', addressProof]].map(([label, file]) => (
                  <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', color: '#64748b' }}>
                    <span>{label as string}</span>
                    <span style={{ color: file ? '#10b981' : '#94a3b8', fontWeight: 600 }}>{file ? `✅ ${(file as File).name}` : '—'}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStep(2); setError('') }} style={{ padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: submitting ? '#6ee7b7' : '#16a34a', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {submitting ? 'Submitting...' : '🚀 Submit for Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
