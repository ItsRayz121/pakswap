'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'
import axios from 'axios'

const BENEFITS = [
  { icon: '💸', title: 'Competitive Revenue', desc: 'Set your own spread. Platform only takes 0.5% per fulfilled order.' },
  { icon: '🤖', title: 'Automated Orders', desc: 'PKR orders are AI-verified. Crypto orders trigger automatic releases.' },
  { icon: '🛡️', title: 'Platform Protection', desc: 'Escrow and fraud detection built in. Only verified payments trigger releases.' },
  { icon: '📈', title: 'Scale Your Volume', desc: 'Tap into PakSwap\'s user base. Top providers fulfill 500+ orders monthly.' },
]

const TOKENS = ['BNB', 'ETH', 'SOL', 'TON', 'BTC', 'USDT', 'USDC', 'MATIC', 'ADA', 'XRP']

export default function ProviderApplyPage() {
  const { accessToken } = useAuthStore()
  const [submitted, setSubmitted] = useState(false)
  const [appRef, setAppRef] = useState('')

  const [fullName, setFullName] = useState('')
  const [cnic, setCnic] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [dailyVolume, setDailyVolume] = useState('')
  const [tradeExp, setTradeExp] = useState('')
  const [platforms, setPlatforms] = useState('')
  const [telegram, setTelegram] = useState('')
  const [phone, setPhone] = useState('')
  const [whyJoin, setWhyJoin] = useState('')
  const [comments, setComments] = useState('')
  const [agreed, setAgreed] = useState(false)

  const toggleToken = (t: string) => setSelectedTokens(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const submitMutation = useMutation({
    mutationFn: (body: any) => axios.post('/api/instant-buy/provider-apply', body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }),
    onSuccess: (res) => {
      setAppRef(res.data?.data?.ref ?? `#APP-${Date.now()}`)
      setSubmitted(true)
    },
    onError: (err: any) => toast({ type: 'error', title: 'Submission Failed', description: err.response?.data?.message })
  })

  const handleSubmit = () => {
    if (!agreed) { toast({ type: 'error', title: 'Agreement Required', description: 'Please agree to the Provider Terms of Service.' }); return }
    if (!fullName || !cnic || !city || !selectedTokens.length || !dailyVolume || !telegram || !whyJoin) {
      toast({ type: 'error', title: 'Required Fields', description: 'Please fill all required fields.' })
      return
    }
    submitMutation.mutate({ fullName, cnic, businessName, city, tokens: selectedTokens, dailyVolume, tradeExp, platforms, telegram, phone, whyJoin, comments })
  }

  if (submitted) return (
    <DashboardLayout>
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-5">🎉</div>
        <h1 className="text-2xl font-extrabold mb-3">Application Submitted!</h1>
        <p className="text-gray-500 mb-5">Thank you for applying. We'll review your application and contact you via Telegram within 3–5 business days.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-700">
          📋 Application Reference: <strong>{appRef}</strong>
        </div>
        <a href="/instant-buy" className="btn btn-primary btn-lg rounded-xl">Back to Instant Buy</a>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="rounded-2xl p-10 text-center text-white mb-8" style={{ background: 'linear-gradient(135deg, #166534, #15803d, #16a34a)' }}>
          <div className="text-5xl mb-3">💼</div>
          <h1 className="text-3xl font-extrabold mb-3">Become a Liquidity Provider</h1>
          <p className="text-sm opacity-90 max-w-md mx-auto mb-5">Earn by providing crypto inventory for PakSwap Instant Buy orders. Join our trusted provider network and earn on every fulfilled order.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {['💰 Earn on every order', '🏅 Verified badge', '📊 Provider dashboard'].map(tag => (
              <div key={tag} className="bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold">{tag}</div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {BENEFITS.map(({ icon, title, desc }) => (
            <div key={title} className="card p-4 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-amber-800 mb-3">📋 Provider Requirements</h3>
          <ul className="space-y-2">
            {[
              'Full KYC verified on PakSwap (CNIC + selfie)',
              'Minimum 500 USDT equivalent inventory to start',
              'Maintain dispute rate below 2%',
              'Respond to manual orders within 30 minutes (SLA)',
              '⚠️ Applications are for Phase 2 — we will contact you when ready',
            ].map((req, i) => (
              <li key={i} className="text-sm text-amber-900 flex gap-2">
                <span>{i < 4 ? '✅' : '⚠️'}</span> {req.replace(/^(✅|⚠️)\s*/, '')}
              </li>
            ))}
          </ul>
        </div>

        {/* Application form */}
        <div className="card p-6 space-y-5">
          <div>
            <h2 className="text-xl font-extrabold mb-1">Provider Application</h2>
            <p className="text-sm text-gray-500">Fill this form to join the waitlist. We review applications and contact approved providers directly.</p>
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-bold text-gray-500 uppercase">Personal Information</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input className="form-input mt-1.5" type="text" placeholder="As on your CNIC" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">CNIC Number <span className="text-red-500">*</span></label>
              <input className="form-input mt-1.5" type="text" placeholder="35201-1234567-1" maxLength={15} value={cnic} onChange={e => setCnic(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Business Name <span className="text-gray-400">(optional)</span></label>
              <input className="form-input mt-1.5" type="text" placeholder="Your company or brand name" value={businessName} onChange={e => setBusinessName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">City <span className="text-red-500">*</span></label>
              <select className="form-input mt-1.5" value={city} onChange={e => setCity(e.target.value)}>
                <option value="">Select your city</option>
                {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-bold text-gray-500 uppercase">Trading Capacity</p>

          <div className="form-group">
            <label className="form-label">Which tokens do you want to provide? <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {TOKENS.map(t => (
                <div key={t} onClick={() => toggleToken(t)}
                  className={`border-2 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all ${selectedTokens.includes(t) ? 'border-brand bg-blue-50' : 'border-gray-200 hover:border-brand/50'}`}>
                  <span className="text-sm font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Estimated daily volume (PKR) <span className="text-red-500">*</span></label>
              <select className="form-input mt-1.5" value={dailyVolume} onChange={e => setDailyVolume(e.target.value)}>
                <option value="">Select range</option>
                {['Under 50,000 PKR/day', '50,000 – 200,000 PKR/day', '200,000 – 500,000 PKR/day', '500,000 – 1,000,000 PKR/day', 'Over 1,000,000 PKR/day'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trading experience <span className="text-red-500">*</span></label>
              <select className="form-input mt-1.5" value={tradeExp} onChange={e => setTradeExp(e.target.value)}>
                <option value="">Select</option>
                {['Less than 6 months', '6 months – 1 year', '1–2 years', '2–5 years', '5+ years'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Platforms you currently use</label>
            <input className="form-input mt-1.5" type="text" placeholder="e.g. Binance, Bybit, local exchanges..." value={platforms} onChange={e => setPlatforms(e.target.value)} />
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-bold text-gray-500 uppercase">Contact &amp; Intent</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Telegram Username <span className="text-red-500">*</span></label>
              <input className="form-input mt-1.5" type="text" placeholder="@yourusername" value={telegram} onChange={e => setTelegram(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input mt-1.5" type="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Why do you want to become a provider? <span className="text-red-500">*</span></label>
            <textarea className="form-input mt-1.5 resize-y" rows={4}
              placeholder="Tell us about your experience, why you're a good fit, and what you can bring to the PakSwap provider network..."
              value={whyJoin} onChange={e => setWhyJoin(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Any questions or comments?</label>
            <textarea className="form-input mt-1.5 resize-y" rows={3} placeholder="Anything else you'd like to tell us..."
              value={comments} onChange={e => setComments(e.target.value)} />
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-sm">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0" style={{ accentColor: '#2563eb', width: 16, height: 16 }} />
            <span className="text-gray-700">
              I understand that this is a waitlist application. Approval is subject to review and PakSwap reserves the right to approve or reject any application. I agree to the{' '}
              <a href="/terms" className="text-brand hover:underline">Provider Terms of Service</a>.
            </span>
          </label>

          <button onClick={handleSubmit} disabled={submitMutation.isPending}
            className="btn btn-success btn-lg w-full rounded-xl">
            {submitMutation.isPending ? 'Submitting...' : 'Submit Application →'}
          </button>
          <p className="text-center text-sm text-gray-500">We review applications within 3–5 business days and contact you via Telegram.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
