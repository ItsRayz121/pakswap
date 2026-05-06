'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, KeyRound, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'
import { z } from 'zod'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendResetEmail = async () => {
    if (!email || !z.string().email().safeParse(email).success) {
      toast({ type: 'error', title: 'Invalid email' })
      return
    }
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setStep('otp')
      toast({ type: 'success', title: 'OTP Sent', description: `Check your email at ${email}` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpStep = async () => {
    if (otp.length !== 6) return
    setStep('reset')
  }

  const resetPassword = async () => {
    if (newPassword.length < 8) {
      toast({ type: 'error', title: 'Password too short', description: 'Minimum 8 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ type: 'error', title: 'Passwords do not match' })
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword({ email, otp, newPassword })
      setStep('done')
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
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
        </div>

        <div className="card p-8">
          {step === 'email' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-brand" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send you a reset code.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="form-input" placeholder="you@example.com"
                    onKeyDown={(e) => e.key === 'Enter' && sendResetEmail()}
                  />
                </div>
                <button onClick={sendResetEmail} disabled={loading} className="btn-lg btn-primary w-full">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Code'}
                </button>
                <p className="text-center text-sm text-gray-600">
                  Remember your password? <Link href="/login" className="text-brand hover:underline">Sign in</Link>
                </p>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={28} className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Enter Reset Code</h1>
                <p className="text-gray-500 text-sm mt-1">We sent a 6-digit code to <strong>{email}</strong></p>
              </div>
              <div className="space-y-4">
                <input
                  type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="form-input text-center text-2xl tracking-widest" placeholder="000000"
                />
                <button onClick={verifyOtpStep} disabled={otp.length !== 6} className="btn-lg btn-primary w-full">Continue</button>
                <button onClick={sendResetEmail} className="text-sm text-brand hover:underline w-full text-center">Resend code</button>
              </div>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">Set New Password</h1>
                <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input pr-10" placeholder="Minimum 8 characters"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input" placeholder="Repeat password"
                  />
                </div>
                <button onClick={resetPassword} disabled={loading} className="btn-lg btn-primary w-full">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
                </button>
              </div>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h1>
              <p className="text-gray-500 text-sm mb-6">Your password has been successfully updated. You can now sign in with your new password.</p>
              <Link href="/login" className="btn-lg btn-primary w-full">Sign In Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
