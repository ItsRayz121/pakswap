'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { TrendingUp, Zap, ArrowRight, Loader2, CreditCard, Bitcoin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { marketplaceApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'
import axios from 'axios'

const COINS = ['USDT', 'BTC', 'ETH', 'USDC']
const PAYMENT_MODES = [
  { value: 'pkr', label: 'Pay with PKR', desc: 'JazzCash, Easypaisa, or Bank Transfer', icon: CreditCard },
  { value: 'crypto', label: 'Pay with Crypto', desc: 'Swap one crypto for another', icon: Bitcoin },
]

export default function InstantBuyPage() {
  const router = useRouter()
  const [coin, setCoin] = useState('USDT')
  const [paymentMode, setPaymentMode] = useState('pkr')
  const [fromCoin, setFromCoin] = useState('BTC')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: rateData } = useQuery({
    queryKey: ['rate', coin],
    queryFn: () => marketplaceApi.getRate(coin),
    refetchInterval: 10000,
  })

  const rate = rateData?.data?.data?.rate ?? 0
  const estimatedCrypto = paymentMode === 'pkr' && rate > 0 && amount
    ? (parseFloat(amount) / rate).toFixed(6)
    : null

  const placeOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ type: 'error', title: 'Invalid amount' })
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/instant-buy/orders', {
        coin,
        paymentMode,
        fromCoin: paymentMode === 'crypto' ? fromCoin : undefined,
        amount: parseFloat(amount),
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
      router.push(`/instant-buy/order/${res.data.data.id}`)
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message ?? 'Could not place order' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Instant Buy</h1>
          <p className="text-gray-500 text-sm mt-2">Buy crypto instantly at the best available price. Our OTC desk handles the rest.</p>
        </div>

        {/* Rate Banner */}
        {rate > 0 && (
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              <span className="text-sm text-gray-600">Live {coin}/PKR Rate</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">₨{rate.toLocaleString('en-PK', { maximumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="card p-6 space-y-5">
          {/* Coin Selection */}
          <div>
            <label className="form-label">I want to buy</label>
            <div className="flex gap-2 flex-wrap">
              {COINS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCoin(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    coin === c ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-700 hover:border-brand'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="form-label">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_MODES.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMode(value)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    paymentMode === value ? 'border-brand bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} className={paymentMode === value ? 'text-brand mb-2' : 'text-gray-400 mb-2'} />
                  <p className={`text-sm font-medium ${paymentMode === value ? 'text-brand' : 'text-gray-900'}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* From Coin (crypto-to-crypto only) */}
          {paymentMode === 'crypto' && (
            <div>
              <label className="form-label">Pay with</label>
              <select value={fromCoin} onChange={(e) => setFromCoin(e.target.value)} className="form-input">
                {COINS.filter((c) => c !== coin).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="form-label">
              {paymentMode === 'pkr' ? 'Amount (PKR)' : `Amount (${fromCoin})`}
            </label>
            <div className="relative">
              <input
                type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="form-input pr-16" placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                {paymentMode === 'pkr' ? '₨' : fromCoin}
              </span>
            </div>
          </div>

          {/* Estimate */}
          {estimatedCrypto && (
            <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <span className="text-sm text-gray-600">You'll receive approximately</span>
              <span className="font-bold text-gray-900">{estimatedCrypto} {coin}</span>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            Final price locked at order time. All instant buy orders go through our two-layer verification before crypto is released.
          </div>

          <button onClick={placeOrder} disabled={loading || !amount} className="btn-lg btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Zap size={18} /> Buy {coin} Instantly <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* History Link */}
        <div className="text-center">
          <a href="/instant-buy/history" className="text-sm text-brand hover:underline">View order history →</a>
        </div>
      </div>
    </DashboardLayout>
  )
}
