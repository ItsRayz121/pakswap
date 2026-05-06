'use client'
import { useQuery } from '@tanstack/react-query'
import { Copy, Gift, Users, TrendingUp, Share2 } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'
import axios from 'axios'

export default function ReferralPage() {
  const { user, accessToken } = useAuthStore()

  const { data } = useQuery({
    queryKey: ['referral'],
    queryFn: () => axios.get('/api/referral', { headers: { Authorization: `Bearer ${accessToken}` } }),
  })

  const referral = data?.data?.data
  const referralCode = user?.referralCode ?? '—'
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${referralCode}` : ''

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({ type: 'success', title: `${label} Copied` })
  }

  const stats = [
    { label: 'Total Referrals', value: referral?.totalReferrals ?? 0, icon: Users, color: 'text-brand' },
    { label: 'Active Traders', value: referral?.activeReferrals ?? 0, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Total Earned', value: `${referral?.totalEarned ?? '0.00'} USDT`, icon: Gift, color: 'text-yellow-600' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-500 text-sm mt-1">Invite friends and earn 10% of their trading fees for life.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card text-center">
              <Icon size={24} className={`${color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="stat-label mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Referral Code */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Your Referral Code</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-2xl font-bold text-brand tracking-widest text-center">
              {referralCode}
            </div>
            <button onClick={() => copy(referralCode, 'Code')} className="btn-md btn-secondary">
              <Copy size={16} />
            </button>
          </div>

          <div>
            <label className="form-label">Referral Link</label>
            <div className="flex items-center gap-2">
              <input readOnly value={referralLink} className="form-input text-sm font-mono" />
              <button onClick={() => copy(referralLink, 'Link')} className="btn-md btn-secondary flex-shrink-0">
                <Copy size={16} />
              </button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={() => navigator.share({ title: 'PakSwap Referral', url: referralLink })}
                  className="btn-md btn-primary flex-shrink-0"
                >
                  <Share2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Share your code', desc: 'Send your referral link or code to friends and family.' },
              { step: '2', title: 'They sign up & trade', desc: 'Your referral registers and completes their first trade.' },
              { step: '3', title: 'You earn 10%', desc: 'You receive 10% of their taker fees credited to your wallet every month.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        {referral?.rewards?.length > 0 && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Rewards</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {referral.rewards.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.referee?.username ?? 'Referred User'}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                  </div>
                  <span className="text-green-600 font-semibold">+{r.amount} USDT</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
