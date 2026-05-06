'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'

const schema = z.object({
  fullName: z.string().min(1, 'Full name required'),
  email: z.string().min(1, 'Email required'),
  phone: z.string().min(1, 'Phone required'),
  password: z.string().min(1, 'Password required'),
  referralCode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !process.env.NEXT_PUBLIC_API_URL

    try {
      if (useMock) {
        await new Promise((r) => setTimeout(r, 400))
        toast({ type: 'success', title: 'Account Created!', description: 'You can now log in.' })
        router.push('/login')
        return
      }
      await authApi.register(data)
      setPhone(data.phone)
      toast({ type: 'success', title: 'Account created', description: 'Verify the OTP we sent to your phone.' })
      setStep('otp')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? 'Registration failed'
      toast({ type: 'error', title: 'Registration failed', description: msg })
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    try {
      await authApi.verifyOtp(phone, otp)
      toast({ type: 'success', title: 'Phone verified', description: 'You can now sign in.' })
      router.push('/login')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Invalid OTP'
      toast({ type: 'error', title: 'Verification failed', description: msg })
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-brand" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
            <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code sent to <strong>{phone}</strong></p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="form-input text-center text-2xl tracking-widest mb-4"
              placeholder="000000"
            />
            <button onClick={verifyOtp} disabled={loading || otp.length !== 6} className="btn-lg btn-primary w-full mb-3">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify OTP'}
            </button>
            <button onClick={() => authApi.resendOtp(phone)} className="text-sm text-brand hover:underline">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-brand mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            PakSwap
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Pakistan's trusted P2P exchange</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Full Name <span className="text-gray-400 text-xs">(as on CNIC)</span></label>
              <input {...register('fullName')} className="form-input" placeholder="Muhammad Ahmed Khan" />
              {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input {...register('email')} type="email" className="form-input" placeholder="you@example.com" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Phone Number <span className="text-gray-400 text-xs">(Pakistan)</span></label>
              <input {...register('phone')} type="tel" className="form-input" placeholder="+923001234567" />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Referral Code <span className="text-gray-400 text-xs">(optional)</span></label>
              <input {...register('referralCode')} className="form-input" placeholder="ABCD1234" />
            </div>

            <button type="submit" disabled={loading} className="btn-lg btn-primary w-full mt-2">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-brand hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
