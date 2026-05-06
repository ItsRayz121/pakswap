'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'
import axios from 'axios'

const BENEFITS = [
  { icon: '🚀', title: 'Daily Limit: 5M PKR', desc: 'Regular users cap at 500K/day. Merchants get 5M PKR daily trade volume.' },
  { icon: '🏅', title: 'Verified Merchant Badge', desc: 'Display a gold "Verified Merchant" badge on your profile and all ads.' },
  { icon: '📢', title: 'Priority in Marketplace', desc: 'Your ads appear at the top of search results for the coins you trade.' },
  { icon: '📊', title: 'Merchant Dashboard', desc: 'Dedicated analytics: volume, profit/loss, completion rates, and trade breakdown.' },
  { icon: '🛡️', title: 'Priority Dispute Resolution', desc: '2-hour SLA vs 4-hour for regular users.' },
  { icon: '💬', title: 'Dedicated Support', desc: 'Direct chat with our Merchant Support team — no ticket queues.' },
]

const COINS = ['USDT', 'BTC', 'ETH', 'USDC']

export default function MerchantApplyPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const [submitted, setSubmitted] = useState(false)
  const [city, setCity] = useState('Karachi')
  const [whatsapp, setWhatsapp] = useState('')
  const [selectedCoins, setSelectedCoins] = useState<string[]>(['USDT'])
  const [monthlyVolume, setMonthlyVolume] = useState('1M – 5M PKR')
  const [experience, setExperience] = useState('2–5 years')
  const [statement, setStatement] = useState('')
  const [agrees, setAgrees] = useState([false, false, false, false])

  const toggleCoin = (c: string) => setSelectedCoins(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleAgree = (i: number) => setAgrees(prev => prev.map((v, idx) => idx === i ? !v : v))

  const submitMutation = useMutation({
    mutationFn: (body: any) => axios.post('/api/merchant/apply', body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }),
    onSuccess: () => setSubmitted(true),
    onError: (err: any) => toast({ type: 'error', title: 'Submission Failed', description: err.response?.data?.message })
  })

  const handleSubmit = () => {
    if (!agrees.every(Boolean)) {
      toast({ type: 'error', title: 'Agreement Required', description: 'Please agree to all terms before submitting.' })
      return
    }
    if (statement.length < 100) {
      toast({ type: 'error', title: 'Statement Too Short', description: 'Please write at least 100 characters in your statement.' })
      return
    }
    submitMutation.mutate({ city, whatsapp, coins: selectedCoins, monthlyVolume, experience, statement })
  }

  if (submitted) return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-6xl mb-5">🎉</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Application Submitted!</h1>
        <p className="text-gray-500 mb-6">Your merchant application is under review. Our team will verify your details and respond within 2–5 business days via SMS and email.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-left">
          <p className="font-bold text-brand mb-3">What happens next:</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>1️⃣ Our team reviews your trading history and application details</p>
            <p>2️⃣ You may be asked for additional verification</p>
            <p>3️⃣ Decision sent via SMS + email</p>
            <p>4️⃣ If approved, merchant badge activates immediately</p>
          </div>
        </div>
        <a href="/dashboard" className="btn btn-primary btn-lg rounded-xl">Back to Dashboard</a>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center py-10 px-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-8">
          <div className="text-5xl mb-3">👑</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Become a PakSwap Merchant</h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-5">Unlock higher trading limits, a verified badge, priority placement in the marketplace, and access to bulk P2P tools.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {['✓ Higher Daily Limits', '✓ Verified Badge', '✓ Priority Listing', '✓ Bulk Tools'].map((tag, i) => (
              <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${['bg-brand', 'bg-green-600', 'bg-amber-600', 'bg-purple-600'][i]}`}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {BENEFITS.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <div className="text-4xl mb-2">{icon}</div>
              <h3 className="text-sm font-extrabold mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="card p-6 mb-6">
          <h2 className="text-base font-extrabold mb-4">📋 Requirements to Apply</h2>
          {[
            { label: 'Full KYC Approved', desc: 'CNIC, selfie, and address proof must all be verified.' },
            { label: 'Minimum 20 Completed Trades', desc: 'At least 20 completed P2P trades on the platform.' },
            { label: 'Completion Rate ≥ 90%', desc: 'Your completion rate over last 30 trades must be 90%+.' },
            { label: 'No Active Disputes or Bans', desc: 'Account must be in good standing.' },
            { label: 'Account Age ≥ 30 Days', desc: 'Your PakSwap account must be at least 30 days old.' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm">✓</div>
              <div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-semibold">
            🎉 Complete the application below to submit your request.
          </div>
        </div>

        {/* Application form */}
        <div className="space-y-4">
          {/* About */}
          <div className="card p-6">
            <h2 className="text-sm font-bold mb-4">👤 About You</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-input mt-1.5" value={city} onChange={e => setCity(e.target.value)}>
                  {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp (for support contact)</label>
                <input className="form-input mt-1.5" type="tel" placeholder="+92 300 0000000"
                  value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Trading */}
          <div className="card p-6">
            <h2 className="text-sm font-bold mb-4">📊 Trading Intentions</h2>
            <div className="form-group mb-4">
              <label className="form-label">Coins you primarily want to trade</label>
              <div className="flex gap-2 flex-wrap mt-2">
                {COINS.map(c => (
                  <label key={c} className={`flex items-center gap-2 cursor-pointer px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all ${selectedCoins.includes(c) ? 'border-brand bg-blue-50 text-brand' : 'border-gray-200'}`}>
                    <input type="checkbox" className="hidden" checked={selectedCoins.includes(c)} onChange={() => toggleCoin(c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Expected monthly volume (PKR)</label>
                <select className="form-input mt-1.5" value={monthlyVolume} onChange={e => setMonthlyVolume(e.target.value)}>
                  {['Under 1M PKR', '1M – 5M PKR', '5M – 20M PKR', '20M+ PKR'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Trading experience</label>
                <select className="form-input mt-1.5" value={experience} onChange={e => setExperience(e.target.value)}>
                  {['Less than 1 year', '1–2 years', '2–5 years', '5+ years'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Statement */}
          <div className="card p-6">
            <h2 className="text-sm font-bold mb-4">📝 Statement</h2>
            <div className="form-group">
              <label className="form-label">Tell us about yourself and why you want to be a PakSwap merchant</label>
              <textarea className="form-input mt-1.5 resize-none" rows={4} minLength={100}
                placeholder="e.g. I have been trading crypto in Pakistan since 2021. I want to provide liquidity to the PakSwap community..."
                value={statement} onChange={e => setStatement(e.target.value)} />
              <p className={`text-xs mt-1 ${statement.length < 100 ? 'text-amber-500' : 'text-green-600'}`}>{statement.length}/100 minimum</p>
            </div>
          </div>

          {/* Agreement */}
          <div className="card p-6">
            <h2 className="text-sm font-bold mb-4">📜 Agreement</h2>
            <div className="space-y-3 mb-5">
              {[
                'I agree to maintain a trade completion rate of at least 80% at all times.',
                'I understand that a dispute rate above 5% over any 30-day window will trigger a review of my merchant status.',
                'I agree to comply with all PakSwap platform rules including the two-layer payment verification policy.',
                'I understand that PakSwap may revoke merchant status if I engage in price manipulation, fraud, or repeated bad-faith disputes.',
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer text-sm">
                  <input type="checkbox" checked={agrees[i]} onChange={() => toggleAgree(i)}
                    className="mt-0.5 flex-shrink-0" style={{ accentColor: '#2563eb' }} />
                  {text}
                </label>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={submitMutation.isPending}
              className="btn btn-primary btn-lg w-full rounded-xl">
              {submitMutation.isPending ? 'Submitting...' : 'Submit Merchant Application →'}
            </button>
            <p className="text-sm text-gray-500 text-center mt-3">Review takes 2–5 business days. You'll receive an SMS and email with the decision.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
