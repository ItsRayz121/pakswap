'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { walletApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface Wallet {
  id: string
  coin: string
  balance: string
  availableBalance: string
  lockedBalance: string
}

interface Tx {
  id: string
  type: string
  coin: string
  amount: string
  status: string
  txHash?: string
  network?: string
  createdAt: string
  tradeId?: string
}

const COIN_META: Record<string, { icon: string; iconBg: string; label: string }> = {
  USDT: { icon: '₮', iconBg: '#26a17b', label: 'Tether' },
  BTC:  { icon: '₿', iconBg: '#f7931a', label: 'Bitcoin' },
  ETH:  { icon: 'Ξ', iconBg: '#627eea', label: 'Ethereum' },
  USDC: { icon: '$', iconBg: '#2775ca', label: 'USD Coin' },
}

const TX_ICONS: Record<string, { icon: string; bg: string }> = {
  deposit:  { icon: '📥', bg: '#dbeafe' },
  withdraw: { icon: '📤', bg: '#fee2e2' },
  trade_buy:  { icon: '↙', bg: '#d1fae5' },
  trade_sell: { icon: '↗', bg: '#fee2e2' },
}

const navStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0',
}

export default function WalletPage() {
  const { user } = useAuthStore()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [txs, setTxs] = useState<Tx[]>([])
  const [selectedCoin, setSelectedCoin] = useState('USDT')
  const [panel, setPanel] = useState<'deposit' | 'withdraw'>('deposit')
  const [depositAddress, setDepositAddress] = useState('')
  const [network, setNetwork] = useState('TRC-20')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Withdraw form
  const [wdAddress, setWdAddress] = useState('')
  const [wdAmount, setWdAmount] = useState('')
  const [wdNetwork, setWdNetwork] = useState('TRC-20')
  const [wdLoading, setWdLoading] = useState(false)
  const [wdError, setWdError] = useState('')
  const [wdSuccess, setWdSuccess] = useState(false)

  const fetchWallets = useCallback(async () => {
    try {
      const res = await walletApi.getAll()
      setWallets(res.data.data ?? [])
    } catch { setWallets([]) }
  }, [])

  const fetchTxs = useCallback(async () => {
    try {
      const res = await walletApi.getTransactions({ limit: 10 })
      setTxs(res.data.data ?? [])
    } catch { setTxs([]) }
  }, [])

  const fetchAddress = useCallback(async () => {
    if (!selectedCoin) return
    try {
      const res = await walletApi.getDepositAddress(selectedCoin)
      setDepositAddress(res.data.data?.address ?? '')
    } catch { setDepositAddress('') }
  }, [selectedCoin])

  useEffect(() => {
    Promise.all([fetchWallets(), fetchTxs()]).finally(() => setLoading(false))
  }, [fetchWallets, fetchTxs])

  useEffect(() => { if (panel === 'deposit') fetchAddress() }, [panel, fetchAddress])

  async function handleWithdraw() {
    if (!wdAddress.trim()) return setWdError('Enter a withdrawal address.')
    const amt = parseFloat(wdAmount)
    if (!amt || amt <= 0) return setWdError('Enter a valid amount.')
    const wallet = wallets.find(w => w.coin === selectedCoin)
    if (wallet && amt > parseFloat(wallet.availableBalance)) return setWdError('Insufficient balance.')
    setWdError('')
    setWdLoading(true)
    try {
      await walletApi.withdraw({ coin: selectedCoin, network: wdNetwork, address: wdAddress, amount: amt })
      setWdSuccess(true)
      setWdAmount('')
      setWdAddress('')
      fetchWallets()
    } catch (e: any) {
      setWdError(e?.response?.data?.message ?? 'Withdrawal failed. Try again.')
    } finally {
      setWdLoading(false)
    }
  }

  function copy() {
    if (depositAddress) { navigator.clipboard.writeText(depositAddress); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const selectedWallet = wallets.find(w => w.coin === selectedCoin)
  const availBal = selectedWallet ? parseFloat(selectedWallet.availableBalance) : 0
  const FEE: Record<string, number> = { 'TRC-20': 1, 'ERC-20': 5, 'BEP-20': 0.5 }
  const fee = FEE[wdNetwork] ?? 1
  const wdReceive = Math.max(0, (parseFloat(wdAmount) || 0) - fee).toFixed(4)

  const totalPkrEst = wallets.reduce((s, w) => s + parseFloat(w.balance || '0'), 0)

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet', active: true }, { label: 'Orders', href: '/orders' }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>{initials(user.fullName)}</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.username ?? user.fullName.split(' ')[0]}</span>
          </div>
        )}
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>My Wallet</h1>
            {!loading && <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Total holdings: <strong style={{ color: '#1e293b' }}>{totalPkrEst.toFixed(2)} units</strong></div>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setPanel('deposit'); setWdSuccess(false) }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: panel === 'deposit' ? '#eff6ff' : 'white', color: panel === 'deposit' ? '#1d4ed8' : '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📥 Deposit</button>
            <button onClick={() => { setPanel('withdraw'); setWdSuccess(false) }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📤 Withdraw</button>
          </div>
        </div>

        {/* Coin cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Loading wallets...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px', marginBottom: '28px' }}>
            {wallets.length > 0 ? wallets.map(w => {
              const meta = COIN_META[w.coin] ?? { icon: '?', iconBg: '#94a3b8', label: w.coin }
              return (
                <div key={w.coin} onClick={() => setSelectedCoin(w.coin)} style={{ background: 'white', border: `1.5px solid ${selectedCoin === w.coin ? '#2563eb' : '#e2e8f0'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: selectedCoin === w.coin ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: meta.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px' }}>{meta.icon}</div>
                    <div><div style={{ fontWeight: 800, fontSize: '16px' }}>{w.coin}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{meta.label}</div></div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 900 }}>{parseFloat(w.balance).toFixed(4)}</div>
                  {parseFloat(w.lockedBalance) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
                      <span style={{ color: '#94a3b8' }}>Avail: {parseFloat(w.availableBalance).toFixed(4)}</span>
                      <span style={{ color: '#f59e0b' }}>Escrow: {parseFloat(w.lockedBalance).toFixed(4)}</span>
                    </div>
                  )}
                </div>
              )
            }) : Object.entries(COIN_META).map(([sym, meta]) => (
              <div key={sym} onClick={() => setSelectedCoin(sym)} style={{ background: 'white', border: `1.5px solid ${selectedCoin === sym ? '#2563eb' : '#e2e8f0'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: meta.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px' }}>{meta.icon}</div>
                  <div><div style={{ fontWeight: 800 }}>{sym}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{meta.label}</div></div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 900 }}>0.0000</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Deposit to start</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Deposit / Withdraw panel */}
          <div>
            {panel === 'deposit' ? (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>📥 Deposit {selectedCoin}</div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Network</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {['TRC-20', 'ERC-20', 'BEP-20'].map(n => (
                      <button key={n} onClick={() => setNetwork(n)} style={{ padding: '8px 16px', borderRadius: '8px', border: `2px solid ${network === n ? '#2563eb' : '#e2e8f0'}`, background: network === n ? '#eff6ff' : 'white', color: network === n ? '#1d4ed8' : '#374151', fontWeight: network === n ? 700 : 600, fontSize: '13px', cursor: 'pointer' }}>{n}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
                  ⚠️ Only send <strong>{selectedCoin} ({network})</strong> to this address. Sending wrong coin/network = permanent loss.
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Your {selectedCoin} Deposit Address ({network})</label>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                    <span style={{ color: depositAddress ? '#1e293b' : '#94a3b8' }}>{depositAddress || 'Loading address...'}</span>
                    {depositAddress && (
                      <button onClick={copy} style={{ background: copied ? '#d1fae5' : '#e0e7ff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: copied ? '#065f46' : '#3730a3', flexShrink: 0 }}>{copied ? 'Copied ✓' : 'Copy'}</button>
                    )}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#64748b' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: '#374151' }}>Deposit Info:</div>
                  <div>• Minimum deposit: 1 {selectedCoin}</div>
                  <div>• Confirmations required: 1 ({network})</div>
                  <div>• Credits usually within 5–10 minutes</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>📤 Withdraw {selectedCoin}</div>

                {wdSuccess ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Withdrawal Submitted</div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Your withdrawal is pending admin approval. You'll be notified once processed.</div>
                    <button onClick={() => setWdSuccess(false)} style={{ padding: '10px 24px', borderRadius: '10px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Make Another</button>
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#065f46' }}>Available Balance:</span>
                      <strong style={{ fontSize: '16px', color: '#065f46' }}>{availBal.toFixed(4)} {selectedCoin}</strong>
                    </div>
                    {wdError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>{wdError}</div>}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Network</label>
                      <select value={wdNetwork} onChange={e => setWdNetwork(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                        <option value="TRC-20">TRC-20 (Tron) — Fee: 1 USDT</option>
                        <option value="ERC-20">ERC-20 (Ethereum) — Fee: 5 USDT</option>
                        <option value="BEP-20">BEP-20 (BSC) — Fee: 0.5 USDT</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Withdrawal Address</label>
                      <input type="text" value={wdAddress} onChange={e => setWdAddress(e.target.value)} placeholder={`Enter ${selectedCoin} wallet address`} style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Amount ({selectedCoin})</label>
                      <div style={{ position: 'relative', marginTop: '6px' }}>
                        <input type="number" value={wdAmount} onChange={e => setWdAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px 70px 10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                        <button onClick={() => setWdAmount(availBal.toFixed(4))} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#e0e7ff', border: 'none', borderRadius: '5px', padding: '3px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#3730a3' }}>MAX</button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>Network fee: <strong>{fee} {selectedCoin}</strong></span>
                        <span style={{ color: '#64748b' }}>You receive: <strong>{wdAmount ? `${wdReceive} ${selectedCoin}` : '—'}</strong></span>
                      </div>
                    </div>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
                      🔐 Withdrawals require admin approval. Ensure the address is correct — irreversible.
                    </div>
                    <button onClick={handleWithdraw} disabled={wdLoading} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: wdLoading ? '#fca5a5' : '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
                      {wdLoading ? 'Submitting...' : 'Confirm Withdrawal →'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>Transaction History</div>
              <Link href="/orders"><button style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View All</button></Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>Loading...</div>
            ) : txs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '14px' }}>No transactions yet</div>
            ) : txs.map((tx, i) => {
              const icon = TX_ICONS[tx.type] ?? { icon: '•', bg: '#f1f5f9' }
              const isPos = tx.type === 'deposit' || tx.type === 'trade_buy'
              return (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < txs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{icon.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{tx.coin} · {new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: isPos ? '#10b981' : '#ef4444' }}>{isPos ? '+' : '-'}{tx.amount} {tx.coin}</div>
                    <span style={{ background: tx.status === 'completed' ? '#d1fae5' : '#fef3c7', color: tx.status === 'completed' ? '#065f46' : '#92400e', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>{tx.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
