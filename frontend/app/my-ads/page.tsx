'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pause, Play, Trash2, Edit2, ChevronRight, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { adsApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const adSchema = z.object({
  coin: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  priceType: z.enum(['fixed', 'floating']),
  fixedPrice: z.string().optional(),
  floatingMargin: z.string().optional(),
  minOrderFiat: z.string().min(1),
  maxOrderFiat: z.string().min(1),
  availableAmount: z.string().min(1),
  paymentMethods: z.array(z.string()).min(1, 'Select at least one payment method'),
  paymentWindow: z.string(),
  terms: z.string().optional(),
})
type AdForm = z.infer<typeof adSchema>

const PAYMENT_METHODS = [
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function MyAdsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<any>(null)

  const { data, isLoading } = useQuery({ queryKey: ['my-ads'], queryFn: () => adsApi.getMyAds() })
  const ads: any[] = data?.data?.data ?? []

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<AdForm>({
    resolver: zodResolver(adSchema),
    defaultValues: { coin: 'USDT', side: 'sell', priceType: 'fixed', paymentMethods: [], paymentWindow: '30' },
  })

  const priceType = watch('priceType')
  const selectedPMs = watch('paymentMethods')

  const togglePM = (pm: string) => {
    const cur = selectedPMs ?? []
    setValue('paymentMethods', cur.includes(pm) ? cur.filter((p) => p !== pm) : [...cur, pm])
  }

  const createMutation = useMutation({
    mutationFn: (data: AdForm) => editingAd ? adsApi.update(editingAd.id, data) : adsApi.create(data),
    onSuccess: () => {
      toast({ type: 'success', title: editingAd ? 'Ad Updated' : 'Ad Created' })
      qc.invalidateQueries({ queryKey: ['my-ads'] })
      setShowForm(false)
      setEditingAd(null)
      reset()
    },
    onError: (err: any) => toast({ type: 'error', title: 'Failed', description: err.response?.data?.message }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      status === 'active' ? adsApi.pause(id) : adsApi.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-ads'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adsApi.delete(id),
    onSuccess: () => {
      toast({ type: 'success', title: 'Ad Deleted' })
      qc.invalidateQueries({ queryKey: ['my-ads'] })
    },
  })

  const startEdit = (ad: any) => {
    setEditingAd(ad)
    reset({
      coin: ad.coin, side: ad.side, priceType: ad.priceType,
      fixedPrice: ad.fixedPrice?.toString(),
      floatingMargin: ad.floatingMargin?.toString(),
      minOrderFiat: ad.minOrderFiat?.toString(),
      maxOrderFiat: ad.maxOrderFiat?.toString(),
      availableAmount: ad.availableAmount?.toString(),
      paymentMethods: ad.paymentMethods ?? [],
      paymentWindow: ad.paymentWindow?.toString() ?? '30',
      terms: ad.terms ?? '',
    })
    setShowForm(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
            <p className="text-gray-500 text-sm mt-1">Create and manage your buy/sell advertisements</p>
          </div>
          <button onClick={() => { setEditingAd(null); reset(); setShowForm(true) }} className="btn-md btn-primary">
            <Plus size={16} /> Create Ad
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">{editingAd ? 'Edit Ad' : 'Create New Ad'}</h2>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Coin</label>
                  <select {...register('coin')} className="form-input">
                    {['USDT', 'BTC', 'ETH', 'USDC'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Ad Type</label>
                  <select {...register('side')} className="form-input">
                    <option value="sell">Sell (I want PKR)</option>
                    <option value="buy">Buy (I want Crypto)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Price Type</label>
                  <select {...register('priceType')} className="form-input">
                    <option value="fixed">Fixed Price</option>
                    <option value="floating">Floating %</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Payment Window</label>
                  <select {...register('paymentWindow')} className="form-input">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priceType === 'fixed' ? (
                  <div>
                    <label className="form-label">Fixed Price (PKR)</label>
                    <input {...register('fixedPrice')} type="number" step="0.01" className="form-input" placeholder="280.50" />
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Floating Margin (%)</label>
                    <input {...register('floatingMargin')} type="number" step="0.01" className="form-input" placeholder="1.5" />
                    <p className="text-xs text-gray-400 mt-1">Above/below live market rate</p>
                  </div>
                )}
                <div>
                  <label className="form-label">Min Order (PKR)</label>
                  <input {...register('minOrderFiat')} type="number" className="form-input" placeholder="1000" />
                  {errors.minOrderFiat && <p className="form-error">{errors.minOrderFiat.message}</p>}
                </div>
                <div>
                  <label className="form-label">Max Order (PKR)</label>
                  <input {...register('maxOrderFiat')} type="number" className="form-input" placeholder="50000" />
                  {errors.maxOrderFiat && <p className="form-error">{errors.maxOrderFiat.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Available Amount (Crypto)</label>
                <input {...register('availableAmount')} type="number" step="any" className="form-input w-64" placeholder="100" />
                {errors.availableAmount && <p className="form-error">{errors.availableAmount.message}</p>}
              </div>

              <div>
                <label className="form-label">Payment Methods</label>
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.value}
                      type="button"
                      onClick={() => togglePM(pm.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedPMs?.includes(pm.value) ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-700 hover:border-brand'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
                {errors.paymentMethods && <p className="form-error">{errors.paymentMethods.message as string}</p>}
              </div>

              <div>
                <label className="form-label">Terms & Conditions <span className="text-gray-400 text-xs">(optional)</span></label>
                <textarea {...register('terms')} className="form-input h-20 resize-none" placeholder="Any specific requirements for your counterparty..." />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditingAd(null) }} className="btn-lg btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-lg btn-primary flex-1">
                  {createMutation.isPending ? 'Saving...' : editingAd ? 'Update Ad' : 'Publish Ad'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ads List */}
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4 h-20 animate-pulse bg-gray-100" />)}</div>
        ) : ads.length === 0 ? (
          <div className="card p-12 text-center">
            <TrendingUp size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No ads yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first buy or sell ad to start earning.</p>
            <button onClick={() => setShowForm(true)} className="btn-md btn-primary">
              <Plus size={16} /> Create First Ad
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
              <span>Type</span><span>Price</span><span>Limits</span><span>Available</span><span>Status</span><span />
            </div>
            <div className="divide-y divide-gray-50">
              {ads.map((ad: any) => (
                <div key={ad.id} className="flex flex-col md:grid md:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 items-start md:items-center p-4">
                  <div>
                    <span className={`badge ${ad.side === 'sell' ? 'badge-green' : 'badge-blue'}`}>{ad.side.toUpperCase()}</span>
                    <p className="text-xs text-gray-400 mt-1">{ad.coin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      ₨{ad.priceType === 'fixed' ? parseFloat(ad.fixedPrice).toLocaleString('en-PK', { minimumFractionDigits: 2 }) : `${ad.floatingMargin}%`}
                    </p>
                    <p className="text-xs text-gray-400">{ad.priceType === 'fixed' ? 'Fixed' : 'Floating'}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    ₨{parseFloat(ad.minOrderFiat).toLocaleString('en-PK')} – ₨{parseFloat(ad.maxOrderFiat).toLocaleString('en-PK')}
                  </div>
                  <div className="text-sm text-gray-700">
                    {parseFloat(ad.availableAmount).toFixed(4)} {ad.coin}
                  </div>
                  <div>
                    <span className={`badge ${ad.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{ad.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(ad)} className="btn-sm btn-ghost" title="Edit"><Edit2 size={14} /></button>
                    <button
                      onClick={() => toggleMutation.mutate({ id: ad.id, status: ad.status })}
                      disabled={toggleMutation.isPending}
                      className="btn-sm btn-ghost"
                      title={ad.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {ad.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this ad?')) deleteMutation.mutate(ad.id) }}
                      className="btn-sm btn-ghost text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
