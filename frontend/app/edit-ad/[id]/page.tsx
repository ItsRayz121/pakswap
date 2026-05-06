'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'
import axios from 'axios'

const PAYMENT_METHODS = [
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'sadapay', label: 'Sadapay / Nayapay' },
]

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data, isLoading } = useQuery({
    queryKey: ['ad', id],
    queryFn: () => axios.get(`/api/ads/${id}`, { headers }),
  })
  const ad = data?.data?.data

  const [priceType, setPriceType] = useState<'fixed' | 'floating'>('fixed')
  const [fixedPrice, setFixedPrice] = useState('')
  const [floatingMargin, setFloatingMargin] = useState('1.5')
  const [minOrder, setMinOrder] = useState('')
  const [maxOrder, setMaxOrder] = useState('')
  const [selectedPMs, setSelectedPMs] = useState<string[]>([])
  const [terms, setTerms] = useState('')
  const [paymentWindow, setPaymentWindow] = useState('30')

  useEffect(() => {
    if (ad) {
      setPriceType(ad.priceType ?? 'fixed')
      setFixedPrice(ad.fixedPrice?.toString() ?? '')
      setFloatingMargin(ad.floatingMargin?.toString() ?? '1.5')
      setMinOrder(ad.minOrderFiat?.toString() ?? '')
      setMaxOrder(ad.maxOrderFiat?.toString() ?? '')
      setSelectedPMs(ad.paymentMethods ?? [])
      setTerms(ad.terms ?? '')
      setPaymentWindow(ad.paymentWindow?.toString() ?? '30')
    }
  }, [ad])

  const marketRate = 280.5
  const effectivePrice = priceType === 'fixed' ? parseFloat(fixedPrice) : marketRate * (1 + parseFloat(floatingMargin) / 100)
  const premiumPct = ((effectivePrice - marketRate) / marketRate * 100).toFixed(2)

  const togglePM = (value: string) => {
    setSelectedPMs(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value])
  }

  const updateMutation = useMutation({
    mutationFn: (body: any) => axios.patch(`/api/ads/${id}`, body, { headers }),
    onSuccess: () => {
      toast({ type: 'success', title: 'Ad Updated', description: 'Changes are live in the marketplace.' })
      router.push('/my-ads')
    },
    onError: (err: any) => {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/ads/${id}`, { headers }),
    onSuccess: () => {
      toast({ type: 'success', title: 'Ad Deleted' })
      router.push('/my-ads')
    }
  })

  const handleSave = () => {
    if (!selectedPMs.length) {
      toast({ type: 'error', title: 'Select Payment Method' })
      return
    }
    updateMutation.mutate({
      priceType,
      fixedPrice: priceType === 'fixed' ? parseFloat(fixedPrice) : undefined,
      floatingMargin: priceType === 'floating' ? parseFloat(floatingMargin) : undefined,
      minOrderFiat: parseFloat(minOrder),
      maxOrderFiat: parseFloat(maxOrder),
      paymentMethods: selectedPMs,
      terms,
      paymentWindow: parseInt(paymentWindow),
    })
  }

  const handleDelete = () => {
    if (confirm(`Delete Ad #${id}? This cannot be undone.`)) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) return <DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /><div className="h-60 bg-gray-200 rounded-xl" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <a href="/my-ads" className="hover:underline">← My Ads</a>
              <span>/</span>
              <span className="font-semibold text-gray-700">Edit Ad #{id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Edit Advertisement</h1>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-800">
            ⚠️ Changes take effect immediately for new trade requests
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
          <div className="space-y-4">
            {/* Read-only trade type */}
            <div className="card p-6">
              <h2 className="text-sm font-bold mb-3">🔄 Trade Type &amp; Coin</h2>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <span className={`badge ${ad?.side === 'buy' ? 'badge-green' : 'badge-blue'} font-bold`}>
                  {ad?.side?.toUpperCase()}
                </span>
                <div>
                  <p className="font-bold">{ad?.coin} — {ad?.side === 'sell' ? 'TRC-20' : ''}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Trade type and coin cannot be changed. Delete and create a new ad to change.</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="card p-6">
              <h2 className="text-sm font-bold mb-4">💰 Price Setting</h2>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-4">
                {(['fixed', 'floating'] as const).map(t => (
                  <button key={t} onClick={() => setPriceType(t)}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all ${priceType === t ? 'bg-brand text-white' : 'bg-white text-gray-500'}`}>
                    {t === 'fixed' ? 'Fixed Price' : 'Floating (% market)'}
                  </button>
                ))}
              </div>
              {priceType === 'fixed' ? (
                <div className="form-group">
                  <label className="form-label">Price (PKR per {ad?.coin})</label>
                  <div className="relative mt-1.5">
                    <input className="form-input pr-24" type="number" value={fixedPrice}
                      onChange={e => setFixedPrice(e.target.value)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">PKR/{ad?.coin}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Market today: <strong>{marketRate} PKR</strong> · Your price is{' '}
                    <strong className={parseFloat(premiumPct) >= 0 ? 'text-green-600' : 'text-red-500'}>
                      {parseFloat(premiumPct) >= 0 ? '+' : ''}{premiumPct}% {parseFloat(premiumPct) >= 0 ? 'above' : 'below'} market
                    </strong>
                  </p>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Margin (% above/below market)</label>
                  <div className="relative mt-1.5">
                    <input className="form-input pr-20" type="number" step="0.1" value={floatingMargin}
                      onChange={e => setFloatingMargin(e.target.value)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">% above</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5">Current effective: <strong>{effectivePrice.toFixed(2)} PKR/{ad?.coin}</strong></p>
                </div>
              )}
            </div>

            {/* Limits */}
            <div className="card p-6">
              <h2 className="text-sm font-bold mb-4">📊 Trading Limits</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Minimum Order (PKR)</label>
                  <input className="form-input mt-1.5" type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Order (PKR)</label>
                  <input className="form-input mt-1.5" type="number" value={maxOrder} onChange={e => setMaxOrder(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="card p-6">
              <h2 className="text-sm font-bold mb-4">💳 Accepted Payment Methods</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.value} onClick={() => togglePM(pm.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPMs.includes(pm.value) ? 'border-brand bg-blue-50 text-brand' : 'border-gray-200'}`}>
                    <span className="text-sm font-semibold flex-1">{pm.label}</span>
                    <span className={`text-lg ${selectedPMs.includes(pm.value) ? 'text-green-500' : 'text-gray-200'}`}>✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms + window */}
            <div className="card p-6">
              <h2 className="text-sm font-bold mb-4">📋 Ad Terms &amp; Instructions</h2>
              <div className="form-group">
                <label className="form-label">Terms (optional)</label>
                <textarea className="form-input mt-1.5 resize-none" rows={3} maxLength={500}
                  value={terms} onChange={e => setTerms(e.target.value)} />
                <p className="text-xs text-gray-400 text-right mt-1">{terms.length}/500</p>
              </div>
              <div className="form-group">
                <label className="form-label">Trade Window</label>
                <select className="form-input mt-1.5" value={paymentWindow} onChange={e => setPaymentWindow(e.target.value)}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap pb-8">
              <button onClick={handleSave} disabled={updateMutation.isPending}
                className="btn btn-primary btn-lg flex-1 rounded-xl">
                {updateMutation.isPending ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button onClick={() => router.push('/my-ads')} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={handleDelete} disabled={deleteMutation.isPending} className="btn btn-danger btn-sm">
                🗑 Delete
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="sticky top-20 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Preview</p>
            <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex justify-between items-center mb-3">
                <span className={`badge ${ad?.side === 'buy' ? 'badge-green' : 'badge-blue'}`}>{ad?.side?.toUpperCase()} {ad?.coin}</span>
                <span className="badge badge-green text-xs">Active</span>
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mb-1">
                {isNaN(effectivePrice) ? '—' : effectivePrice.toFixed(2)} PKR
              </div>
              <p className="text-xs text-gray-500 mb-3">per {ad?.coin}</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Limit</span>
                <span className="font-bold">{parseInt(minOrder || '0').toLocaleString()} – {parseInt(maxOrder || '0').toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">Payment</span>
                <span className="font-bold">{selectedPMs.map(p => PAYMENT_METHODS.find(m => m.value === p)?.label).join(' · ') || '—'}</span>
              </div>
              <button className="btn btn-primary btn-sm w-full rounded-lg opacity-50" disabled>
                {ad?.side === 'sell' ? 'Buy' : 'Sell'} {ad?.coin} (preview)
              </button>
            </div>

            {ad && (
              <div className="card p-4">
                <p className="text-sm font-bold mb-3">Ad Performance</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Views (7d)</span><strong>{ad.viewCount ?? 0}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Trade requests</span><strong>{ad.tradeCount ?? 0}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Completed</span><strong className="text-green-600">{ad.completedCount ?? 0}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
