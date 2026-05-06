'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { walletApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'

const PM_TYPES = [
  { value: 'jazzcash', label: 'JazzCash', icon: Smartphone, color: 'bg-red-500' },
  { value: 'easypaisa', label: 'Easypaisa', icon: Smartphone, color: 'bg-green-600' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2, color: 'bg-blue-600' },
]

const jazzSchema = z.object({
  type: z.literal('jazzcash'),
  accountName: z.string().min(2, 'Account name required'),
  mobileNumber: z.string().regex(/^03\d{9}$/, 'Format: 03XX-XXXXXXX'),
})

const easypaisaSchema = z.object({
  type: z.literal('easypaisa'),
  accountName: z.string().min(2),
  mobileNumber: z.string().regex(/^03\d{9}$/, 'Format: 03XX-XXXXXXX'),
})

const bankSchema = z.object({
  type: z.literal('bank_transfer'),
  accountName: z.string().min(2),
  accountNumber: z.string().min(10, 'Account number required'),
  bankName: z.string().min(2),
  ibanNumber: z.string().regex(/^PK\d{2}[A-Z]{4}\d{16}$/, 'IBAN: PK + 2 digits + 4 chars + 16 digits').optional().or(z.literal('')),
})

type PMForm = z.infer<typeof jazzSchema> | z.infer<typeof easypaisaSchema> | z.infer<typeof bankSchema>

const BANKS = ['HBL', 'MCB', 'UBL', 'Meezan Bank', 'Bank Alfalah', 'Standard Chartered', 'Allied Bank', 'NBP', 'Faysal Bank', 'Habib Metro', 'Other']

export default function PaymentMethodsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState('jazzcash')

  const { data } = useQuery({ queryKey: ['payment-methods'], queryFn: () => walletApi.getPaymentMethods() })
  const methods: any[] = data?.data?.data ?? []

  const getSchema = () => {
    if (selectedType === 'bank_transfer') return bankSchema
    if (selectedType === 'easypaisa') return easypaisaSchema
    return jazzSchema
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(getSchema()),
  })

  const addMutation = useMutation({
    mutationFn: (d: any) => walletApi.addPaymentMethod({ ...d, type: selectedType }),
    onSuccess: () => {
      toast({ type: 'success', title: 'Payment Method Added' })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      setShowForm(false)
      reset()
    },
    onError: (err: any) => toast({ type: 'error', title: 'Failed', description: err.response?.data?.message }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => walletApi.deletePaymentMethod(id),
    onSuccess: () => {
      toast({ type: 'success', title: 'Removed' })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })

  const getMethodIcon = (type: string) => {
    const pm = PM_TYPES.find((p) => p.value === type)
    return pm ? { Icon: pm.icon, color: pm.color, label: pm.label } : { Icon: CreditCard, color: 'bg-gray-500', label: type }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your bank accounts and mobile wallets</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-md btn-primary">
            <Plus size={16} /> Add Method
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Add Payment Method</h2>
            <div className="flex gap-2 mb-5">
              {PM_TYPES.map((pm) => (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => { setSelectedType(pm.value); reset() }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedType === pm.value ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-700 hover:border-brand'
                  }`}
                >
                  <pm.icon size={16} />
                  {pm.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit((d) => addMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="form-label">Account Holder Name <span className="text-xs text-gray-400">(must match KYC name)</span></label>
                <input {...register('accountName')} className="form-input" placeholder="Muhammad Ahmed Khan" />
                {errors.accountName && <p className="form-error">{(errors.accountName as any).message}</p>}
              </div>

              {(selectedType === 'jazzcash' || selectedType === 'easypaisa') && (
                <div>
                  <label className="form-label">Mobile Number</label>
                  <input {...register('mobileNumber')} className="form-input" placeholder="0300 1234567" />
                  {errors.mobileNumber && <p className="form-error">{(errors.mobileNumber as any).message}</p>}
                </div>
              )}

              {selectedType === 'bank_transfer' && (
                <>
                  <div>
                    <label className="form-label">Bank Name</label>
                    <select {...register('bankName')} className="form-input">
                      <option value="">Select bank</option>
                      {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.bankName && <p className="form-error">{(errors.bankName as any).message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Account Number</label>
                    <input {...register('accountNumber')} className="form-input font-mono" placeholder="0123-456789012" />
                    {errors.accountNumber && <p className="form-error">{(errors.accountNumber as any).message}</p>}
                  </div>
                  <div>
                    <label className="form-label">IBAN <span className="text-gray-400 text-xs">(optional)</span></label>
                    <input {...register('ibanNumber')} className="form-input font-mono" placeholder="PK36SCBL0000001123456702" />
                    {errors.ibanNumber && <p className="form-error">{(errors.ibanNumber as any).message}</p>}
                  </div>
                </>
              )}

              <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                <strong>Important:</strong> Account name must exactly match your verified KYC name. Mismatched accounts will be rejected during trades.
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); reset() }} className="btn-md btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={addMutation.isPending} className="btn-md btn-primary flex-1">
                  {addMutation.isPending ? 'Adding...' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {methods.length === 0 && !showForm ? (
          <div className="card p-12 text-center">
            <CreditCard size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No payment methods</h3>
            <p className="text-gray-500 text-sm mb-6">Add a JazzCash, Easypaisa, or bank account to start trading.</p>
            <button onClick={() => setShowForm(true)} className="btn-md btn-primary"><Plus size={16} /> Add First Method</button>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((pm: any) => {
              const { Icon, color, label } = getMethodIcon(pm.type)
              return (
                <div key={pm.id} className="card p-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{label}</p>
                      {pm.isVerified && <CheckCircle size={14} className="text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{pm.accountName}</p>
                    <p className="text-xs text-gray-400 font-mono">{pm.mobileNumber ?? pm.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => { if (confirm('Remove this payment method?')) deleteMutation.mutate(pm.id) }}
                    className="btn-sm btn-ghost text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
