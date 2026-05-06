'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Shield, Monitor, Bell, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { authApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'
import { useQuery, useMutation } from '@tanstack/react-query'

const profileSchema = z.object({
  username: z.string().min(3).max(30),
  phone: z.string().min(10).max(20),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

const SIDEBAR = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'twofa', label: '2FA', icon: Shield },
  { id: 'sessions', label: 'Sessions', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [section, setSection] = useState('profile')
  const [showPw, setShowPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [twoFaStep, setTwoFaStep] = useState<'idle' | 'setup' | 'verify'>('idle')
  const [twoFaCode, setTwoFaCode] = useState('')
  const [twoFaQr, setTwoFaQr] = useState('')
  const [twoFaSecret, setTwoFaSecret] = useState('')

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authApi.getSessions(),
    enabled: section === 'sessions',
  })
  const sessions: any[] = sessionsData?.data?.data ?? []

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: user?.username ?? '', phone: user?.phone ?? '' },
  })

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const profileMutation = useMutation({
    mutationFn: (d: ProfileForm) => authApi.updateProfile(d),
    onSuccess: (res) => { updateUser(res.data.data); toast({ type: 'success', title: 'Profile Updated' }) },
    onError: (err: any) => toast({ type: 'error', title: 'Failed', description: err.response?.data?.message }),
  })

  const passwordMutation = useMutation({
    mutationFn: (d: PasswordForm) => authApi.changePassword(d),
    onSuccess: () => { toast({ type: 'success', title: 'Password Changed' }); passwordForm.reset() },
    onError: (err: any) => toast({ type: 'error', title: 'Failed', description: err.response?.data?.message }),
  })

  const setup2fa = async () => {
    try {
      const res = await authApi.setup2fa()
      setTwoFaQr(res.data.data.qrCodeUrl)
      setTwoFaSecret(res.data.data.secret)
      setTwoFaStep('setup')
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    }
  }

  const verify2fa = async () => {
    try {
      await authApi.verify2fa(twoFaCode)
      updateUser({ twoFaEnabled: true })
      toast({ type: 'success', title: '2FA Enabled', description: 'Your account is now more secure.' })
      setTwoFaStep('idle')
    } catch {
      toast({ type: 'error', title: 'Invalid Code', description: 'Check your authenticator app and try again.' })
    }
  }

  const disable2fa = async () => {
    if (!confirm('Disable 2FA? This will reduce your account security.')) return
    try {
      await authApi.disable2fa(twoFaCode)
      updateUser({ twoFaEnabled: false })
      toast({ type: 'success', title: '2FA Disabled' })
      setTwoFaCode('')
    } catch {
      toast({ type: 'error', title: 'Invalid Code' })
    }
  }

  const revokeSession = async (id: string) => {
    await authApi.revokeSession(id)
    toast({ type: 'success', title: 'Session Revoked' })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {SIDEBAR.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    section === id ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 card p-6">
            {/* Profile */}
            {section === 'profile' && (
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900 text-lg">Profile Information</h2>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
                    {user?.fullName?.charAt(0) ?? 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className={`badge mt-1 ${user?.kycStatus === 'approved' ? 'badge-green' : 'badge-yellow'}`}>
                      KYC {user?.kycLevel ?? 'None'}
                    </span>
                  </div>
                </div>
                <form onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
                  <div>
                    <label className="form-label">Username</label>
                    <input {...profileForm.register('username')} className="form-input" />
                    {profileForm.formState.errors.username && <p className="form-error">{profileForm.formState.errors.username.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input {...profileForm.register('phone')} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input value={user?.email ?? ''} disabled className="form-input bg-gray-50" />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
                  </div>
                  <button type="submit" disabled={profileMutation.isPending} className="btn-md btn-primary">
                    {profileMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security */}
            {section === 'security' && (
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900 text-lg">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
                  <div>
                    <label className="form-label">Current Password</label>
                    <div className="relative">
                      <input {...passwordForm.register('currentPassword')} type={showPw ? 'text' : 'password'} className="form-input pr-10" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && <p className="form-error">{passwordForm.formState.errors.currentPassword.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <div className="relative">
                      <input {...passwordForm.register('newPassword')} type={showNewPw ? 'text' : 'password'} className="form-input pr-10" />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input {...passwordForm.register('confirmPassword')} type="password" className="form-input" />
                    {passwordForm.formState.errors.confirmPassword && <p className="form-error">{passwordForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" disabled={passwordMutation.isPending} className="btn-md btn-primary">
                    {passwordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* 2FA */}
            {section === 'twofa' && (
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900 text-lg">Two-Factor Authentication</h2>
                {user?.twoFaEnabled ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle size={20} className="text-green-500" />
                      <div>
                        <p className="font-medium text-green-800">2FA is enabled</p>
                        <p className="text-sm text-green-600">Your account is protected with an authenticator app.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <p className="text-sm font-medium text-red-800 mb-3">Disable 2FA</p>
                      <input
                        type="text" inputMode="numeric" maxLength={6}
                        value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)}
                        className="form-input mb-3" placeholder="Enter 6-digit code from app"
                      />
                      <button onClick={disable2fa} disabled={twoFaCode.length !== 6} className="btn-md btn-danger">Disable 2FA</button>
                    </div>
                  </div>
                ) : twoFaStep === 'idle' ? (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Enable 2FA to add an extra layer of security. You'll need an authenticator app like Google Authenticator or Authy.</p>
                    <button onClick={setup2fa} className="btn-md btn-primary"><Shield size={16} /> Enable 2FA</button>
                  </div>
                ) : twoFaStep === 'setup' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Scan this QR code with your authenticator app:</p>
                    {twoFaQr && <img src={twoFaQr} alt="2FA QR Code" className="w-48 h-48 border rounded-lg" />}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Manual entry key:</p>
                      <p className="font-mono text-sm text-gray-900">{twoFaSecret}</p>
                    </div>
                    <button onClick={() => setTwoFaStep('verify')} className="btn-md btn-primary">I've scanned it</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app to verify:</p>
                    <input
                      type="text" inputMode="numeric" maxLength={6}
                      value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)}
                      className="form-input text-center text-2xl tracking-widest w-48" placeholder="000000"
                    />
                    <button onClick={verify2fa} disabled={twoFaCode.length !== 6} className="btn-md btn-primary">Verify & Enable</button>
                  </div>
                )}
              </div>
            )}

            {/* Sessions */}
            {section === 'sessions' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Active Sessions</h2>
                {sessions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No active sessions found.</p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.deviceInfo ?? 'Unknown Device'}</p>
                          <p className="text-xs text-gray-400">{s.ipAddress} • Last active {new Date(s.lastUsedAt).toLocaleDateString('en-PK')}</p>
                        </div>
                        {s.isCurrent ? (
                          <span className="badge badge-green text-xs">Current</span>
                        ) : (
                          <button onClick={() => revokeSession(s.id)} className="btn-sm btn-danger">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {section === 'notifications' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Notification Preferences</h2>
                {[
                  { key: 'emailTrades', label: 'Trade updates', desc: 'New trades, payment confirmations, releases' },
                  { key: 'emailDisputes', label: 'Dispute alerts', desc: 'Dispute opened, resolved, or needs attention' },
                  { key: 'emailKyc', label: 'KYC status', desc: 'KYC approved, rejected, or requires resubmission' },
                  { key: 'smsAlerts', label: 'SMS alerts', desc: 'Critical alerts sent to your phone' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-brand cursor-pointer" />
                  </div>
                ))}
                <button className="btn-md btn-primary">Save Preferences</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
