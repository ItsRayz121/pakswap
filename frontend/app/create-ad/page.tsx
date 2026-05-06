'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../components/ui/toaster'
import axios from 'axios'

const COINS = ['USDT', 'BTC', 'ETH', 'USDC']
const COIN_COLORS: Record<string, string> = { USDT: '#26a17b', BTC: '#f7931a', ETH: '#627eea', USDC: '#2775ca' }
const PAYMENT_METHODS = [
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function CreateAdPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()

  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [coin, setCoin] = useState('USDT')
  const [priceType, setPriceType] = useState<'fixed' | 'floating'>('fixed')
  const [fixedPrice, setFixedPrice] = useState('280.50')
  const [floatingMargin, setFloatingMargin] = useState('1.5')
  const [totalAmount, setTotalAmount] = useState('500')
  const [minOrder, setMinOrder] = useState('1000')
  const [maxOrder, setMaxOrder] = useState('200000')
  const [selectedPMs, setSelectedPMs] = useState<string[]>(['jazzcash'])
  const [paymentWindow, setPaymentWindow] = useState('15')
  const [requireFullKyc, setRequireFullKyc] = useState(false)
  const [requireMinTrades, setRequireMinTrades] = useState(false)
  const [terms, setTerms] = useState('')

  const marketRate = 280.05
  const rateDiff = priceType === 'fixed'
    ? ((parseFloat(fixedPrice) - marketRate) / marketRate * 100).toFixed(2)
    : parseFloat(floatingMargin).toFixed(2)

  const togglePM = (value: string) => {
    setSelectedPMs(prev =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    )
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/ads', data, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }),
    onSuccess: () => {
      toast({ type: 'success', title: 'Ad Published', description: 'Your ad is now live in the marketplace.' })
      router.push('/my-ads')
    },
    onError: (err: any) => {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message || 'Could not create ad.' })
    }
  })

  const handlePublish = () => {
    if (!selectedPMs.length) {
      toast({ type: 'error', title: 'Select Payment Method', description: 'Choose at least one payment method.' })
      return
    }
    createMutation.mutate({
      side, coin, priceType,
      fixedPrice: priceType === 'fixed' ? parseFloat(fixedPrice) : undefined,
      floatingMargin: priceType === 'floating' ? parseFloat(floatingMargin) : undefined,
      availableAmount: parseFloat(totalAmount),
      minOrderFiat: parseFloat(minOrder),
      maxOrderFiat: parseFloat(maxOrder),
      paymentMethods: selectedPMs,
      paymentWindow: parseInt(paymentWindow),
      requireFullKyc,
      requireMinTrades,
      terms,
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create P2P Advertisement</h1>
            <p className="text-sm text-gray-500 mt-1">Set up your offer for the marketplace</p>
          </div>
          <a href="/my-ads" className="btn btn-ghost btn-sm">View My Ads</a>
        </div>

        {/* Step 1: Trade Direction */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-1">1. Trade Direction</h2>
          <p className="text-sm text-gray-500 mb-4">Are you buying or selling crypto?</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(['sell', 'buy'] as const).map(s => (
              <button key={s} onClick={() => setSide(s)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${side === s ? 'border-brand bg-blue-50 text-brand' : 'border-gray-200 bg-white text-gray-600'}`}>
                <div className="text-2xl mb-1">{s === 'sell' ? '💰' : '🛒'}</div>
                <div className="font-bold">{s === 'sell' ? 'SELL Crypto' : 'BUY Crypto'}</div>
                <div className="text-xs text-gray-500 mt-1">{s === 'sell' ? 'Receive PKR from buyers' : 'Send PKR to sellers'}</div>
              </button>
            ))}
          </div>
          <div>
            <label className="form-label">Cryptocurrency</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {COINS.map(c => (
                <button key={c} onClick={() => setCoin(c)}
                  style={coin === c ? { borderColor: COIN_COLORS[c], background: '#f0fdf4', color: '#065f46' } : {}}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm cursor-pointer transition-all ${coin !== c ? 'border-gray-200 bg-white text-gray-700' : ''}`}>
                  <span className="coin-dot" style={{ background: COIN_COLORS[c], width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>
                    {c === 'USDT' ? '₮' : c === 'BTC' ? '₿' : c === 'ETH' ? 'Ξ' : '$'}
                  </span>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Pricing */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-1">2. Price Setting</h2>
          <p className="text-sm text-gray-500 mb-4">Set your exchange rate — fixed or floating with market</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(['fixed', 'floating'] as const).map(t => (
              <button key={t} onClick={() => setPriceType(t)}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${priceType === t ? 'border-brand bg-blue-50 text-brand' : 'border-gray-200 bg-white text-gray-600'}`}>
                <strong>{t === 'fixed' ? 'Fixed Price' : 'Floating Price'}</strong>
                <div className="text-xs text-gray-500 font-normal mt-1">{t === 'fixed' ? 'Set exact PKR/USDT rate manually' : 'Auto-adjust with market ± margin'}</div>
              </button>
            ))}
          </div>

          {priceType === 'fixed' ? (
            <div className="form-group">
              <label className="form-label">Your Rate (PKR per {coin})</label>
              <div className="relative mt-1.5">
                <input className="form-input text-xl font-bold pr-16" type="number" value={fixedPrice}
                  onChange={e => setFixedPrice(e.target.value)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">PKR</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Market rate: <strong>{marketRate} PKR</strong> ·
                <span className={parseFloat(rateDiff) >= 0 ? 'text-green-600' : 'text-amber-500'}>
                  {' '}{parseFloat(rateDiff) >= 0 ? '▲ +' : '▼ '}{rateDiff}% vs market
                </span>
              </p>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Floating Margin (%)</label>
              <div className="flex items-center gap-3 mt-1.5">
                <button onClick={() => setFloatingMargin(v => Math.max(0, parseFloat(v) - 0.5).toFixed(1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-xl cursor-pointer">−</button>
                <input className="form-input text-center text-xl font-bold w-24" type="number"
                  value={floatingMargin} step="0.1" onChange={e => setFloatingMargin(e.target.value)} />
                <button onClick={() => setFloatingMargin(v => (parseFloat(v) + 0.5).toFixed(1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-xl cursor-pointer">+</button>
                <span className="text-gray-500 font-bold">%</span>
              </div>
              <p className="text-xs text-green-600 mt-1.5">Effective rate: ≈ {(marketRate * (1 + parseFloat(floatingMargin) / 100)).toFixed(2)} PKR/{coin}</p>
            </div>
          )}
        </div>

        {/* Step 3: Limits */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-1">3. Trade Limits</h2>
          <p className="text-sm text-gray-500 mb-4">How much {coin} do you want to trade?</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: `Total ${coin} to ${side === 'sell' ? 'Sell' : 'Buy'}`, value: totalAmount, setter: setTotalAmount, unit: coin },
              { label: 'Min per Trade', value: minOrder, setter: setMinOrder, unit: 'PKR' },
              { label: 'Max per Trade', value: maxOrder, setter: setMaxOrder, unit: 'PKR' },
            ].map(({ label, value, setter, unit }) => (
              <div className="form-group mb-0" key={label}>
                <label className="form-label">{label}</label>
                <div className="relative mt-1.5">
                  <input className="form-input pr-14" type="number" value={value}
                    onChange={e => setter(e.target.value)} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Payment Methods */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-1">4. Payment Methods</h2>
          <p className="text-sm text-gray-500 mb-4">Which payment methods will you accept?</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(pm => (
              <div key={pm.value} onClick={() => togglePM(pm.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPMs.includes(pm.value) ? 'border-brand bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-sm font-semibold flex-1">{pm.label}</span>
                {selectedPMs.includes(pm.value) && (
                  <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 5: Settings */}
        <div className="card p-6">
          <h2 className="text-base font-bold mb-1">5. Trade Settings</h2>
          <p className="text-sm text-gray-500 mb-4">Configure trade window and counterparty requirements</p>
          <div className="grid grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">Trade Window</label>
              <select className="form-input mt-1.5" value={paymentWindow} onChange={e => setPaymentWindow(e.target.value)}>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Requirements</label>
              <div className="mt-1.5 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked disabled style={{ accentColor: '#2563eb' }} />
                  KYC verified (min)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={requireFullKyc} onChange={e => setRequireFullKyc(e.target.checked)} style={{ accentColor: '#2563eb' }} />
                  Full KYC only
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={requireMinTrades} onChange={e => setRequireMinTrades(e.target.checked)} style={{ accentColor: '#2563eb' }} />
                  Min. 1 completed trade
                </label>
              </div>
            </div>
          </div>
          <div className="form-group mt-4">
            <label className="form-label">Ad Terms <span className="text-gray-400 font-normal">(shown to counterparty)</span></label>
            <textarea className="form-input mt-1.5 resize-none" rows={3}
              placeholder="e.g. Send from your own registered account only. No third-party payments."
              value={terms} onChange={e => setTerms(e.target.value)} maxLength={500} />
            <p className="text-right text-xs text-gray-400 mt-1">{terms.length}/500</p>
          </div>
        </div>

        {/* Preview */}
        <div className="card p-6 border-brand bg-blue-50/40">
          <h2 className="text-base font-bold text-brand mb-1">6. Preview Your Ad</h2>
          <p className="text-sm text-gray-500 mb-4">This is how your ad will appear in the marketplace</p>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${side === 'sell' ? 'badge-blue' : 'badge-green'}`}>{side.toUpperCase()} {coin}</span>
                  <span className="font-bold text-sm">{coin} • TRC-20</span>
                </div>
                <p className="text-xs text-gray-500">Limits: {parseInt(minOrder).toLocaleString()}–{parseInt(maxOrder).toLocaleString()} PKR · Available: {totalAmount} {coin}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-gray-900">
                  {priceType === 'fixed' ? parseFloat(fixedPrice).toFixed(2) : (marketRate * (1 + parseFloat(floatingMargin) / 100)).toFixed(2)}
                  <span className="text-sm text-gray-400 font-semibold ml-1">PKR</span>
                </div>
                <p className={`text-xs font-semibold ${parseFloat(rateDiff) >= 0 ? 'text-green-600' : 'text-amber-500'}`}>
                  {parseFloat(rateDiff) >= 0 ? '▲ +' : '▼ '}{rateDiff}% vs market
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              {selectedPMs.map(pm => (
                <span key={pm} className="pay-pill jcash">{PAYMENT_METHODS.find(p => p.value === pm)?.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button onClick={() => router.push('/my-ads')} className="btn btn-secondary btn-lg">Cancel</button>
          <button onClick={handlePublish} disabled={createMutation.isPending}
            className="btn btn-success btn-lg flex-1 rounded-xl">
            {createMutation.isPending ? 'Publishing...' : '🚀 Publish Ad to Marketplace'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
