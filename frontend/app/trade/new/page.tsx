'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowRight, Loader2, AlertCircle, Shield } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { marketplaceApi, tradesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'
import { KycGateModal } from '@/components/KycGateModal'

function NewTradeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const adId = params.get('adId') ?? ''
  const { user } = useAuthStore()
  const [fiatAmount, setFiatAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [kycGate, setKycGate] = useState(false)
  const userKycLevel = (user?.kycLevel ?? 'none') as 'none' | 'basic' | 'full'
  const userKycApproved = user?.kycStatus === 'approved'

  const { data: adData, isLoading } = useQuery({
    queryKey: ['ad', adId],
    queryFn: () => marketplaceApi.getAd(adId),
    enabled: !!adId,
  })

  const ad = adData?.data?.data

  const coinAmount = ad && fiatAmount
    ? (parseFloat(fiatAmount) / parseFloat(ad.fixedPrice)).toFixed(6)
    : null

  const withinLimits = ad && fiatAmount
    ? parseFloat(fiatAmount) >= parseFloat(ad.minOrderFiat) &&
      parseFloat(fiatAmount) <= parseFloat(ad.maxOrderFiat)
    : false

  const tradeMutation = useMutation({
    mutationFn: () => {
      if (!userKycApproved || userKycLevel === 'none') {
        setKycGate(true)
        throw new Error('KYC_REQUIRED')
      }
      return tradesApi.initiate({ adId, fiatAmount: parseFloat(fiatAmount), paymentMethod })
    },
    onSuccess: (res) => {
      const tradeId = res.data?.data?.id
      toast({ type: 'success', title: 'Trade Started!', description: 'Crypto has been locked in escrow.' })
      router.push(`/trade/${tradeId}`)
    },
    onError: (err: any) => {
      if (err?.response?.data?.error === 'KYC_REQUIRED' || err?.message === 'KYC_REQUIRED') {
        setKycGate(true)
        return
      }
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    },
  })

  if (!adId) return (
    <DashboardLayout><p className="text-gray-500">No ad selected. <a href="/marketplace" className="text-brand">Browse the market</a>.</p></DashboardLayout>
  )

  if (isLoading) return (
    <DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /></div></DashboardLayout>
  )

  if (!ad) return (
    <DashboardLayout><p className="text-gray-500">Ad not found or no longer available.</p></DashboardLayout>
  )

  const isBuyingFromSeller = ad.side === 'sell'

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isBuyingFromSeller ? `Buy ${ad.coin}` : `Sell ${ad.coin}`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review the details and confirm your trade.</p>
        </div>

        {/* Ad Summary */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-semibold">
              {(ad.user?.fullName ?? '?').charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{ad.user?.username ?? ad.user?.fullName}</p>
              <p className="text-xs text-gray-400">{ad.user?.tradeStats?.completedTrades ?? 0} trades completed</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Rate</p>
              <p className="font-bold text-gray-900">₨{parseFloat(ad.fixedPrice).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Available</p>
              <p className="font-bold text-gray-900">{parseFloat(ad.availableAmount).toFixed(2)} {ad.coin}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
              <p className="text-gray-500 text-xs">Order Limits</p>
              <p className="font-bold text-gray-900">
                ₨{parseFloat(ad.minOrderFiat).toLocaleString('en-PK')} – ₨{parseFloat(ad.maxOrderFiat).toLocaleString('en-PK')}
              </p>
            </div>
          </div>
        </div>

        {/* KYC Check */}
        {(user?.kycStatus !== 'approved') && (
          <div className="card p-4 border-l-4 border-l-yellow-500 bg-yellow-50 flex items-start gap-3">
            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">KYC Required to Trade</p>
              <a href="/kyc" className="text-xs text-brand hover:underline">Complete KYC →</a>
            </div>
          </div>
        )}

        {/* Order Form */}
        <div className="card p-5 space-y-4">
          <div>
            <label className="form-label">
              Amount to {isBuyingFromSeller ? 'Spend' : 'Receive'} (PKR)
            </label>
            <div className="relative">
              <input
                type="number"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="form-input pr-12"
                placeholder={`${parseFloat(ad.minOrderFiat).toLocaleString('en-PK')}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">PKR</span>
            </div>
            {fiatAmount && !withinLimits && (
              <p className="form-error">Amount must be between ₨{parseFloat(ad.minOrderFiat).toLocaleString('en-PK')} and ₨{parseFloat(ad.maxOrderFiat).toLocaleString('en-PK')}</p>
            )}
          </div>

          {coinAmount && withinLimits && (
            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
              <span className="text-sm text-gray-600">You will {isBuyingFromSeller ? 'receive' : 'send'}</span>
              <span className="font-bold text-brand text-lg">{coinAmount} {ad.coin}</span>
            </div>
          )}

          <div>
            <label className="form-label">Payment Method</label>
            <div className="flex gap-2 flex-wrap">
              {(ad.paymentMethods ?? []).map((pm: string) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${
                    paymentMethod === pm ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-700 hover:border-brand'
                  }`}
                >
                  {pm.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          {ad.terms && (
            <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
              <strong>Seller's Terms:</strong> {ad.terms}
            </div>
          )}

          <div className="two-layer-box text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand flex-shrink-0" />
              <span>Your payment proof will be verified by AI + admin before crypto is released.</span>
            </div>
          </div>

          <button
            onClick={() => tradeMutation.mutate()}
            disabled={!fiatAmount || !withinLimits || !paymentMethod || tradeMutation.isPending || user?.kycStatus !== 'approved'}
            className="btn-lg btn-primary w-full"
          >
            {tradeMutation.isPending
              ? <><Loader2 size={18} className="animate-spin" /> Starting Trade...</>
              : <>{isBuyingFromSeller ? `Buy ${ad.coin}` : `Sell ${ad.coin}`} <ArrowRight size={18} /></>
            }
          </button>
        </div>
      </div>
      <KycGateModal open={kycGate} onClose={() => setKycGate(false)} reason="trade" currentLevel={userKycLevel} />
    </DashboardLayout>
  )
}

export default function NewTradePage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /></div></DashboardLayout>}>
      <NewTradeContent />
    </Suspense>
  )
}
