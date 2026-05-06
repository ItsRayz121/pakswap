'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Copy, Download, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { walletApi } from '@/lib/api'
import { toast } from '../components/ui/toaster'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const withdrawSchema = z.object({
  coin: z.string().min(1),
  network: z.string().min(1),
  address: z.string().min(10, 'Invalid address'),
  amount: z.string().refine((v) => parseFloat(v) > 0, 'Amount must be positive'),
})
type WithdrawForm = z.infer<typeof withdrawSchema>

const TX_ICONS: Record<string, any> = {
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  escrow_lock: Clock,
  escrow_release: CheckCircle,
  trade_fee: XCircle,
}

const TX_COLORS: Record<string, string> = {
  deposit: 'text-green-600',
  withdrawal: 'text-red-600',
  escrow_lock: 'text-yellow-600',
  escrow_release: 'text-blue-600',
  trade_fee: 'text-gray-600',
}

const NETWORKS: Record<string, string[]> = {
  USDT: ['TRC-20 (TRON)', 'ERC-20 (Ethereum)'],
  BTC: ['Bitcoin'],
  ETH: ['Ethereum'],
  USDC: ['ERC-20 (Ethereum)'],
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'balances' | 'deposit' | 'withdraw' | 'history'>('balances')
  const [selectedCoin, setSelectedCoin] = useState('USDT')
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  const { data: walletsData, refetch } = useQuery({ queryKey: ['wallets'], queryFn: () => walletApi.getAll() })
  const { data: txData } = useQuery({ queryKey: ['transactions'], queryFn: () => walletApi.getTransactions({ limit: 50 }) })
  const { data: addressData } = useQuery({
    queryKey: ['deposit-address', selectedCoin],
    queryFn: () => walletApi.getDepositAddress(selectedCoin),
    enabled: activeTab === 'deposit',
  })

  const wallets: any[] = walletsData?.data?.data ?? []
  const transactions: any[] = txData?.data?.data ?? []
  const depositAddress = addressData?.data?.data?.address ?? ''

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { coin: 'USDT', network: 'TRC-20 (TRON)' },
  })

  const watchCoin = watch('coin')
  const selectedWallet = wallets.find((w: any) => w.coin === watchCoin)
  const availableBalance = selectedWallet ? parseFloat(selectedWallet.balance) : 0

  const onWithdraw = async (data: WithdrawForm) => {
    setWithdrawLoading(true)
    try {
      await walletApi.withdraw(data)
      toast({ type: 'success', title: 'Withdrawal Submitted', description: 'Your withdrawal is pending admin approval.' })
      reset()
      refetch()
    } catch (err: any) {
      toast({ type: 'error', title: 'Withdrawal Failed', description: err.response?.data?.message })
    } finally {
      setWithdrawLoading(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    toast({ type: 'success', title: 'Address Copied' })
  }

  const tabs = [
    { id: 'balances', label: 'Balances' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'history', label: 'History' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your crypto balances, deposits, and withdrawals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.id ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Balances */}
        {activeTab === 'balances' && (
          <div className="space-y-3">
            {wallets.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">No wallets found.</div>
            ) : (
              wallets.map((w: any) => (
                <div key={w.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        w.coin === 'USDT' ? 'bg-usdt' : w.coin === 'BTC' ? 'bg-btc' : 'bg-blue-500'
                      }`}>
                        {w.coin.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{w.coin}</p>
                        <p className="text-xs text-gray-400">Available Balance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">{parseFloat(w.balance).toFixed(6)}</p>
                      {w.lockedBalance > 0 && (
                        <p className="text-xs text-yellow-600">{parseFloat(w.lockedBalance).toFixed(6)} locked</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Deposit */}
        {activeTab === 'deposit' && (
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Deposit Crypto</h2>
            <div>
              <label className="form-label">Select Coin</label>
              <div className="flex gap-2">
                {['USDT', 'BTC', 'ETH', 'USDC'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCoin(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedCoin === c ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-700 hover:border-brand'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {depositAddress ? (
              <>
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
                  <QrCode size={80} className="text-gray-400" />
                </div>
                <div>
                  <label className="form-label">Deposit Address ({selectedCoin})</label>
                  <div className="flex items-center gap-2">
                    <input readOnly value={depositAddress} className="form-input font-mono text-sm" />
                    <button onClick={copyAddress} className="btn-md btn-secondary flex-shrink-0">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800 space-y-1">
                  <p><strong>Warning:</strong> Send only {selectedCoin} to this address.</p>
                  <p>Minimum deposit: 10 USDT. Deposits confirmed after 6 network confirmations.</p>
                  <p>Wrong coin sends will result in permanent loss.</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Withdraw */}
        {activeTab === 'withdraw' && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Withdraw Crypto</h2>
            <form onSubmit={handleSubmit(onWithdraw)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Coin</label>
                  <select {...register('coin')} className="form-input">
                    {['USDT', 'BTC', 'ETH', 'USDC'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Network</label>
                  <select {...register('network')} className="form-input">
                    {(NETWORKS[watchCoin] ?? []).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Withdrawal Address</label>
                <input {...register('address')} className="form-input font-mono text-sm" placeholder="Paste recipient address..." />
                {errors.address && <p className="form-error">{errors.address.message}</p>}
              </div>
              <div>
                <label className="form-label">
                  Amount
                  <span className="text-xs text-gray-400 ml-2">Available: {availableBalance.toFixed(6)} {watchCoin}</span>
                </label>
                <input {...register('amount')} type="number" step="any" className="form-input" placeholder="0.00" />
                {errors.amount && <p className="form-error">{errors.amount.message}</p>}
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                <strong>Note:</strong> Withdrawals require admin approval and are processed within 24 hours. Network fees apply.
              </div>
              <button type="submit" disabled={withdrawLoading} className="btn-lg btn-primary w-full">
                {withdrawLoading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><ArrowUpRight size={18} /> Submit Withdrawal</>}
              </button>
            </form>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Transaction History</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {transactions.map((tx: any) => {
                  const Icon = TX_ICONS[tx.txType] ?? Clock
                  const color = TX_COLORS[tx.txType] ?? 'text-gray-600'
                  const isPositive = ['deposit', 'escrow_release'].includes(tx.txType)
                  return (
                    <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                      <div className={`w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center ${color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">{tx.txType.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : '-'}{parseFloat(tx.amount).toFixed(6)} {tx.coin}
                        </p>
                        <p className={`text-xs badge ${tx.status === 'completed' ? 'badge-green' : tx.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
