'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, CheckCircle, Loader2, Camera, FileText, User, MapPin, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { kycApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'

const basicSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  cnicNumber: z.string().regex(/^\d{5}-\d{7}-\d$/, 'CNIC format: 12345-1234567-1'),
  address: z.string().min(10, 'Full address required'),
  city: z.string().min(2, 'City required'),
  province: z.string().min(2, 'Province required'),
})

type BasicForm = z.infer<typeof basicSchema>

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB']

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User },
  { id: 2, label: 'CNIC Upload', icon: FileText },
  { id: 3, label: 'Selfie', icon: Camera },
  { id: 4, label: 'Address Proof', icon: MapPin },
]

export default function KycPage() {
  const { user, updateUser } = useAuthStore()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BasicForm | null>(null)
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [addressProof, setAddressProof] = useState<File | null>(null)

  const cnicFrontRef = useRef<HTMLInputElement>(null)
  const cnicBackRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<BasicForm>({
    resolver: zodResolver(basicSchema),
  })

  if (user?.kycStatus === 'pending' || user?.kycStatus === 'under_review') {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 size={36} className="text-yellow-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">KYC Under Review</h2>
          <p className="text-gray-500 mb-6">Our team is verifying your documents. This usually takes 2–4 hours during business hours.</p>
          <div className="two-layer-box text-left">
            <p className="text-sm font-semibold text-gray-800 mb-2">What happens next?</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Layer 1: AI scans your CNIC and selfie</li>
              <li>Layer 2: Our compliance team reviews the results</li>
              <li>You receive an email and in-app notification on approval</li>
            </ol>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (user?.kycStatus === 'approved') {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">KYC Verified</h2>
          <p className="text-gray-500 mb-6">Your identity has been verified. You can now trade up to your daily limit.</p>
          <button onClick={() => router.push('/marketplace')} className="btn-lg btn-primary">Go to Marketplace</button>
        </div>
      </DashboardLayout>
    )
  }

  const FileDropZone = ({
    label, hint, file, inputRef, onChange, accept = 'image/*'
  }: {
    label: string; hint: string; file: File | null
    inputRef: React.RefObject<HTMLInputElement>; onChange: (f: File) => void; accept?: string
  }) => (
    <div
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-brand hover:bg-brand-50'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f) }} />
      {file ? (
        <>
          <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700">{file.name}</p>
          <p className="text-xs text-green-600 mt-1">Click to replace</p>
        </>
      ) : (
        <>
          <Upload size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-400 mt-1">{hint}</p>
        </>
      )}
    </div>
  )

  const submitKyc = async () => {
    if (!formData || !cnicFront || !cnicBack || !selfie || !addressProof) return
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      fd.append('cnicFront', cnicFront)
      fd.append('cnicBack', cnicBack)
      fd.append('selfie', selfie)
      fd.append('addressProof', addressProof)
      await kycApi.submit(fd)
      updateUser({ kycStatus: 'pending' })
      toast({ type: 'success', title: 'KYC Submitted', description: 'Our team will review your documents within 4 hours.' })
      setStep(5) // done screen
    } catch (err: any) {
      toast({ type: 'error', title: 'Submission Failed', description: err.response?.data?.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-gray-500 mt-1">Complete KYC to unlock trading. Your data is encrypted and secure.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  step > s.id ? 'bg-green-500 text-white' :
                  step === s.id ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <CheckCircle size={18} /> : <s.icon size={16} />}
                </div>
                <p className={`text-xs mt-1 font-medium ${step === s.id ? 'text-brand' : 'text-gray-400'}`}>{s.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={handleSubmit((data) => { setFormData(data); setStep(2) })} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input {...register('dateOfBirth')} type="date" className="form-input" />
                  {errors.dateOfBirth && <p className="form-error">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className="form-label">CNIC Number</label>
                  <input {...register('cnicNumber')} className="form-input" placeholder="12345-1234567-1" />
                  {errors.cnicNumber && <p className="form-error">{errors.cnicNumber.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Residential Address</label>
                <input {...register('address')} className="form-input" placeholder="House #, Street, Area" />
                {errors.address && <p className="form-error">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">City</label>
                  <input {...register('city')} className="form-input" placeholder="Lahore" />
                  {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="form-label">Province</label>
                  <select {...register('province')} className="form-input">
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="form-error">{errors.province.message}</p>}
                </div>
              </div>
              <button type="submit" className="btn-lg btn-primary w-full mt-2">
                Continue <ChevronRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: CNIC Upload */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">CNIC Photos</h2>
              <p className="text-sm text-gray-500 mb-4">Upload clear photos of both sides of your CNIC. Ensure all text is readable and the card is not expired.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileDropZone label="CNIC Front Side" hint="Show the side with your photo" file={cnicFront} inputRef={cnicFrontRef} onChange={setCnicFront} />
                <FileDropZone label="CNIC Back Side" hint="Show the side with your CNIC number" file={cnicBack} inputRef={cnicBackRef} onChange={setCnicBack} />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                <strong>Tips:</strong> Good lighting, no reflections, full card visible, 5MB max per image.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-lg btn-ghost flex-1">Back</button>
                <button onClick={() => setStep(3)} disabled={!cnicFront || !cnicBack} className="btn-lg btn-primary flex-1">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Selfie */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Selfie with CNIC</h2>
              <p className="text-sm text-gray-500 mb-4">Take a selfie holding your CNIC next to your face. Both must be clearly visible.</p>
              <FileDropZone
                label="Selfie with CNIC"
                hint="Hold CNIC beside your face, look at camera"
                file={selfie}
                inputRef={selfieRef}
                onChange={setSelfie}
              />
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="p-2 bg-green-50 rounded text-green-700">✓ Good lighting</div>
                <div className="p-2 bg-green-50 rounded text-green-700">✓ Face clearly visible</div>
                <div className="p-2 bg-red-50 rounded text-red-700">✗ No sunglasses or masks</div>
                <div className="p-2 bg-red-50 rounded text-red-700">✗ No photo editing</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-lg btn-ghost flex-1">Back</button>
                <button onClick={() => setStep(4)} disabled={!selfie} className="btn-lg btn-primary flex-1">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Address Proof */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Proof of Address</h2>
              <p className="text-sm text-gray-500 mb-4">Upload a utility bill, bank statement, or government letter dated within the last 3 months.</p>
              <FileDropZone
                label="Address Proof Document"
                hint="Utility bill, bank statement, or official letter"
                file={addressProof}
                inputRef={addressRef}
                onChange={setAddressProof}
                accept="image/*,.pdf"
              />
              <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                <strong>Accepted:</strong> Electricity/Gas/Water bill, Bank statement (last 3 months), PTCL bill, Government letter showing your name and address.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="btn-lg btn-ghost flex-1">Back</button>
                <button onClick={submitKyc} disabled={!addressProof || loading} className="btn-lg btn-primary flex-1">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit KYC'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">KYC Submitted!</h2>
              <p className="text-gray-500 mb-2">Your documents are under review.</p>
              <p className="text-sm text-gray-400 mb-8">You'll receive an email notification once verified (usually within 4 hours).</p>
              <div className="two-layer-box text-left mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-2">Two-Layer Verification Process</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-xs">1</div> AI scans your CNIC and matches your selfie</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-xs">2</div> Compliance officer reviews and approves</div>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard')} className="btn-lg btn-primary">Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
