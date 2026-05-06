'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Filter, Star, Shield, ChevronRight } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { marketplaceApi } from '@/lib/api'

const COINS = ['USDT', 'BTC', 'ETH', 'USDC']
const PAYMENT_METHODS = [
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function MarketplacePage() {
  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [coin, setCoin] = useState('USDT')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amount, setAmount] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace', side, coin, paymentMethod, amount],
    queryFn: () => marketplaceApi.getAds({
      side: side === 'sell' ? 'sell' : 'buy',
      coin,
      paymentMethod: paymentMethod || undefined,
      amount: amount ? parseFloat(amount) : undefined,
    }),
  })

  const { data: rateData } = useQuery({
    queryKey: ['rate', coin],
    queryFn: () => marketplaceApi.getRate(coin),
    refetchInterval: 30000,
  })

  const ads = data?.data?.data ?? []
  const rate = rateData?.data?.data?.rate ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">P2P Marketplace</h1>
              <p className="text-gray-500 text-sm mt-1">
                USDT/PKR live rate: <strong className="text-green-600">₨{rate.toLocaleString('en-PK', { maximumFractionDigits: 2 })}</strong>
              </p>
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
              {[{ v: 'sell', l: 'Buy Crypto' }, { v: 'buy', l: 'Sell Crypto' }].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setSide(v as 'sell' | 'buy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    side === v ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            {/* Coin */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              {COINS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCoin(c)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    coin === c ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Payment Method */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-input w-auto"
            >
              <option value="">All Payment Methods</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/* Amount */}
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input pl-8 w-40"
                placeholder="PKR Amount"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="page-container py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="w-24 h-9 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16 card">
            <Filter size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No ads found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span>Advertiser</span>
              <span>Price</span>
              <span>Limits</span>
              <span>Payment</span>
              <span>Available</span>
              <span />
            </div>

            <div className="space-y-2">
              {ads.map((ad: any) => (
                <div key={ad.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-start md:items-center">
                    {/* Advertiser */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
                        {(ad.user?.fullName ?? '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{ad.user?.username ?? ad.user?.fullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-500">{ad.user?.tradeStats?.avgRating?.toFixed(1) ?? '—'}</span>
                          </div>
                          <span className="text-xs text-gray-400">{ad.user?.tradeStats?.completedTrades ?? 0} trades</span>
                          {ad.user?.tradeStats?.isMerchant && (
                            <span className="badge badge-blue text-xs"><Shield size={9} /> Merchant</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-lg font-bold text-green-600">₨{parseFloat(ad.fixedPrice).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs text-gray-400">per {ad.coin}</p>
                    </div>

                    {/* Limits */}
                    <div className="text-sm text-gray-700">
                      <p>₨{parseFloat(ad.minOrderFiat).toLocaleString('en-PK')} – ₨{parseFloat(ad.maxOrderFiat).toLocaleString('en-PK')}</p>
                    </div>

                    {/* Payment methods */}
                    <div className="flex flex-wrap gap-1">
                      {ad.paymentMethods?.map((pm: string) => (
                        <span key={pm} className="badge badge-gray text-xs">{pm.replace('_', ' ')}</span>
                      ))}
                    </div>

                    {/* Available */}
                    <div className="text-sm text-gray-700">
                      {parseFloat(ad.availableAmount).toFixed(2)} {ad.coin}
                    </div>

                    {/* Action */}
                    <Link
                      href={`/trade/new?adId=${ad.id}`}
                      className={`btn-md ${side === 'sell' ? 'btn-primary' : 'btn-success'} whitespace-nowrap`}
                    >
                      {side === 'sell' ? `Buy ${ad.coin}` : `Sell ${ad.coin}`}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
