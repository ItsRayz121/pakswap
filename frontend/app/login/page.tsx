'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'

const schema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone required'),
  password: z.string().min(1, 'Password required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !process.env.NEXT_PUBLIC_API_URL

    try {
      if (useMock) {
        await new Promise((r) => setTimeout(r, 400))
        const isAdmin = data.emailOrPhone.toLowerCase().includes('admin')
        const mockUser = {
          id: 'mock-' + Math.random().toString(36).slice(2),
          email: data.emailOrPhone.includes('@') ? data.emailOrPhone : `${data.emailOrPhone}@pakswap.com`,
          phone: '+923001234567',
          fullName: isAdmin ? 'Admin User' : 'Demo User',
          username: isAdmin ? 'admin' : 'demouser',
          role: isAdmin ? 'admin' : 'user',
          kycLevel: 'full',
          kycStatus: 'approved',
          twoFaEnabled: false,
          referralCode: 'DEMO1234',
        }
        setAuth(mockUser, 'mock-token-' + Date.now())
        toast({ type: 'success', title: 'Welcome back!', description: `Logged in as ${mockUser.fullName}` })
        router.push(isAdmin ? '/admin' : '/dashboard')
        return
      }

      const res = await authApi.login(data)
      const payload = res.data?.data ?? res.data

      if (payload?.requiresTwoFa) {
        sessionStorage.setItem('preAuthToken', payload.preAuthToken)
        toast({ type: 'info', title: '2FA required', description: 'Enter your 6-digit code' })
        router.push('/login/2fa')
        return
      }

      const accessToken = payload.accessToken
      if (payload.refreshToken) localStorage.setItem('refresh_token', payload.refreshToken)
      localStorage.setItem('access_token', accessToken)

      // Fetch the full user profile
      const meRes = await authApi.me()
      const user = meRes.data?.data ?? meRes.data
      setAuth(user, accessToken)
      toast({ type: 'success', title: 'Welcome back!', description: `Logged in as ${user.fullName}` })
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? 'Invalid credentials'
      toast({ type: 'error', title: 'Login failed', description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-brand mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            PakSwap
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Email or Phone</label>
              <input
                {...register('emailOrPhone')}
                type="text"
                className="form-input"
                placeholder="email@example.com or +923001234567"
                autoComplete="username"
              />
              {errors.emailOrPhone && <p className="form-error">{errors.emailOrPhone.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-lg btn-primary w-full">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
