'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Shield, Clock, TrendingUp, Star } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'
import axios from 'axios'

export default function MerchantProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuthStore()
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}

  const { data, isLoading } = useQuery({
    queryKey: ['merchant', id],
    queryFn: () => axios.get(`/api/users/${id}/profile`, { headers }),
  })
  const profile = data?.data?.data

  const { data: adsData } = useQuery({
    queryKey: ['merchant-ads', id],
    queryFn: () => axios.get(`/api/ads?userId=${id}&status=active`, { headers }),
  })
  const ads: any[] = adsData?.data?.data ?? []

  if (isLoading) return (
    <div className="page-wrapper max-w-4xl animate-pulse space-y-4 py-8">
      <div className="h-52 bg-gray-200 rounded-2xl" />
      <div className="h-80 bg-gray-200 rounded-2xl" />
    </div>
  )

  if (!profile) return (
    <div className="page-wrapper text-center py-20 text-gray-400">Merchant not found.</div>
  )

  const stats = [
    { value: profile.totalTrades?.toLocaleString() ?? '0', label: 'Total Trades' },
    { value: `${profile.completionRate ?? 0}%`, label: 'Completion Rate', color: 'text-green-600' },
    { value: `${profile.avgRating ?? '0'} ★`, label: 'Avg Rating', color: 'text-amber-500' },
    { value: `⚡ ${profile.avgReleaseMinutes ?? '—'} min`, label: 'Avg Release', color: 'text-brand' },
  ]

  return (
    <div className="page-wrapper max-w-4xl">
      <a href="/marketplace" className="text-sm text-gray-500 hover:underline mb-6 inline-block">← Back to Marketplace</a>

      {/* Merchant header */}
      <div className="card p-6 mb-6 border-amber-300 bg-gradient-to-br from-amber-50 to-white">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative">
            <div className="merchant-avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
              {profile.displayName?.[0]?.toUpperCase() ?? 'M'}
            </div>
            {profile.isMerchant && (
              <div className="absolute -bottom-1 -right-1 bg-amber-600 rounded-full w-7 h-7 flex items-center justify-center text-base border-2 border-white">👑</div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="text-3xl font-extrabold text-gray-900">{profile.displayName}</span>
              {profile.isMerchant && <span className="badge badge-gold text-sm px-3 py-1">👑 Verified Merchant</span>}
              {profile.kycLevel === 'full' && <span className="kyc-badge full text-sm">✓ Full KYC</span>}
              <span className="flex items-center gap-1.5 text-sm">
                <span className={`dot ${profile.isOnline ? 'dot-green' : 'dot-gray'}`} />
                <span className={profile.isOnline ? 'text-green-600 font-semibold' : 'text-gray-400'}>{profile.isOnline ? 'Online Now' : 'Offline'}</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Member since {profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }) : '—'}
              {profile.city ? ` · ${profile.city}, Pakistan` : ''}
            </p>
            <div className="flex gap-8 flex-wrap">
              {stats.map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <div className={`text-2xl font-extrabold ${color ?? 'text-gray-900'}`}>{value}</div>
                  <div className="text-xs text-gray-500 font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => toast({ type: 'info', title: 'Merchant Blocked' })} className="btn btn-ghost btn-sm">Block Merchant</button>
            <button onClick={() => toast({ type: 'info', title: 'Reported' })} className="btn btn-ghost btn-sm">Report</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-5">
          {/* About */}
          {profile.bio && (
            <div className="card p-5">
              <h2 className="text-base font-extrabold mb-3">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Active Offers */}
          <div className="card p-5">
            <h2 className="text-base font-extrabold mb-4">Active Offers</h2>
            {ads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No active offers right now.</p>
            ) : (
              <div className="space-y-3">
                {ads.map((ad: any) => (
                  <div key={ad.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`badge ${ad.side === 'sell' ? 'badge-blue' : 'badge-green'}`}>{ad.side.toUpperCase()} {ad.coin}</span>
                        <span className="text-lg font-extrabold">{parseFloat(ad.fixedPrice ?? 0).toFixed(2)} PKR/{ad.coin}</span>
                        {ad.marketPremium !== undefined && (
                          <span className={`text-xs font-semibold ${ad.marketPremium >= 0 ? 'text-green-600' : 'text-amber-500'}`}>
                            {ad.marketPremium >= 0 ? '▲ +' : '▼ '}{ad.marketPremium.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Limits: {parseInt(ad.minOrderFiat).toLocaleString()}–{parseInt(ad.maxOrderFiat).toLocaleString()} PKR · Available: {ad.availableAmount} {ad.coin}</p>
                      <div className="flex gap-2 mt-2">
                        {(ad.paymentMethods ?? []).map((pm: string) => (
                          <span key={pm} className="pay-pill jcash">{pm}</span>
                        ))}
                      </div>
                    </div>
                    <a href={`/trade/new?adId=${ad.id}`} className="btn btn-primary btn-sm">
                      {ad.side === 'sell' ? 'Buy' : 'Sell'} {ad.coin} →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="card p-5">
            <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
              <h2 className="text-base font-extrabold">Reviews ({profile.totalReviews ?? 0})</h2>
              {profile.avgRating && (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold text-amber-500">{parseFloat(profile.avgRating).toFixed(1)}</span>
                  <div>
                    <div className="stars text-lg">{'★'.repeat(Math.round(profile.avgRating))}</div>
                    <p className="text-xs text-gray-500">{profile.totalReviews} ratings</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {(profile.reviews ?? []).map((r: any) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="merchant-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{r.reviewerName?.[0] ?? 'U'}</div>
                      <span className="font-semibold text-sm">{r.reviewerName ?? 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-PK')}</span>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
                </div>
              ))}
            </div>
            {(profile.totalReviews ?? 0) > 3 && (
              <button className="btn btn-ghost w-full mt-4">View All {profile.totalReviews} Reviews</button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold mb-3">Detailed Stats</h3>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Total Volume', value: profile.totalVolumePkr ? `~${(profile.totalVolumePkr / 1e6).toFixed(1)}M PKR` : '—' },
                { label: 'Buy Trades', value: profile.buyTrades ?? '—' },
                { label: 'Sell Trades', value: profile.sellTrades ?? '—' },
                { label: 'First Trade', value: profile.firstTradeDate ? new Date(profile.firstTradeDate).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }) : '—' },
                { label: 'Response Time', value: profile.avgResponseMinutes ? `⚡ ~${profile.avgResponseMinutes} min` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between"><span className="text-gray-500">{label}</span><strong>{value}</strong></div>
              ))}
            </div>
          </div>

          {profile.paymentMethods?.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-bold mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {profile.paymentMethods.map((pm: string) => (
                  <span key={pm} className="pay-pill jcash block py-2 px-3 text-sm">{pm}</span>
                ))}
              </div>
            </div>
          )}

          <div className="alert alert-info text-sm">
            🛡️ <strong>Trading Safety:</strong> Always verify payment in your own account before releasing. Never trust screenshots alone.
          </div>
        </div>
      </div>
    </div>
  )
}
