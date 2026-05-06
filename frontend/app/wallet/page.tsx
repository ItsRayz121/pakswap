'use client'
import { useState } from 'react'
import Link from 'next/link'

const coins = [
  { id: 'USDT', name: 'Tether', symbol: '₮', bg: 'linear-gradient(135deg,#26a17b,#34d399)', balance: '35.50', pkr: '9,952', available: '35.50', escrow: '0.00' },
  { id: 'BTC', name: 'Bitcoin', symbol: '₿', bg: 'linear-gradient(135deg,#f7931a,#fbbf24)', balance: '0.00142', pkr: '27,264', available: '0.00142', escrow: '0.00' },
  { id: 'ETH', name: 'Ethereum', symbol: 'Ξ', bg: 'linear-gradient(135deg,#627eea,#a78bfa)', balance: '0.0821', pkr: '8,577', available: '0.0821', escrow: '0.00' },
  { id: 'USDC', name: 'USD Coin', symbol: '$', bg: 'linear-gradient(135deg,#2775ca,#60a5fa)', balance: '0.00', pkr: '0', available: '0.00', escrow: null },
]

const txHistory = [
  { icon: '↙', iconBg: '#d1fae5', title: 'P2P Buy — Received', sub: '#PKS-472 · JazzCash · 05 May', amount: '+17.82 USDT', amountColor: '#10b981', status: 'Completed' },
  { icon: '↗', iconBg: '#fee2e2', title: 'P2P Sell — Sent', sub: '#PKS-441 · Bank HBL · 03 May', amount: '-20.00 USDT', amountColor: '#ef4444', status: 'Completed' },
  { icon: '📥', iconBg: '#dbeafe', title: 'Deposit', sub: 'TRC-20 · 01 May · TX: QKx3...', amount: '+50.00 USDT', amountColor: '#10b981', status: 'Confirmed' },
  { icon: '📤', iconBg: '#fee2e2', title: 'Withdrawal', sub: 'TRC-20 · 28 Apr · TX: TXn...', amount: '-30.00 USDT', amountColor: '#ef4444', status: 'Confirmed' },
  { icon: '↙', iconBg: '#d1fae5', title: 'P2P Buy — Received', sub: '#PKS-402 · Easypaisa · 25 Apr', amount: '+35.00 USDT', amountColor: '#10b981', status: 'Completed' },
]

export default function WalletPage() {
  const [selectedCoin, setSelectedCoin] = useState('USDT')
  const [panel, setPanel] = useState<'deposit' | 'withdraw'>('deposit')
  const [network, setNetwork] = useState('TRC-20')
  const [copied, setCopied] = useState(false)
  const [wdAmount, setWdAmount] = useState('')

  const handleCopy = () => {
    navigator.clipboard.writeText('TQn8i7x7C4UQBVV5NpSRH9KVo4G7mJXi3')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wdReceive = Math.max(0, (parseFloat(wdAmount) || 0) - 1).toFixed(2)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/orders" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Orders</Link>
          <Link href="/create-ad" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>+ Create Ad</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>My Wallet</h1>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Total value: <strong style={{ color: '#1e293b' }}>≈ 12,450 PKR</strong> · <strong style={{ color: '#1e293b' }}>≈ $44.25 USD</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setPanel('deposit')} style={{ padding: '10px 20px', border: `1.5px solid ${panel === 'deposit' ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: panel === 'deposit' ? '#eff6ff' : 'white', color: panel === 'deposit' ? '#1d4ed8' : '#374151' }}>📥 Deposit</button>
            <button onClick={() => setPanel('withdraw')} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>📤 Withdraw</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {coins.map(c => (
            <div key={c.id} onClick={() => setSelectedCoin(c.id)} style={{ background: 'white', border: `1.5px solid ${selectedCoin === c.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: 16, padding: 20, cursor: 'pointer', boxShadow: selectedCoin === c.id ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 700 }}>{c.symbol}</div>
                <div><div style={{ fontWeight: 800, fontSize: 16 }}>{c.id}</div><div style={{ fontSize: 12, color: '#64748b' }}>{c.name}</div></div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{c.balance}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>≈ {c.pkr} PKR</div>
              {c.escrow !== null ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: '#94a3b8' }}>Available: {c.available}</span>
                  <span style={{ color: '#f59e0b' }}>Escrow: {c.escrow}</span>
                </div>
              ) : (
                <div style={{ marginTop: 10 }}><button style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: 'white', color: '#374151' }}>Deposit to start</button></div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          <div>
            {panel === 'deposit' ? (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>📥 Deposit {selectedCoin}</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Network</label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {[['TRC-20', 'TRC-20 (Tron)'], ['ERC-20', 'ERC-20 (Ethereum)'], ['BEP-20', 'BEP-20 (BSC)']].map(([key, label]) => (
                      <button key={key} onClick={() => setNetwork(key)} style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${network === key ? '#2563eb' : '#e2e8f0'}`, background: network === key ? '#eff6ff' : 'white', color: network === key ? '#1d4ed8' : '#374151', fontWeight: network === key ? 700 : 600, fontSize: 13, cursor: 'pointer' }}>{label}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
                  ⚠️ Only send <strong>{selectedCoin} ({network})</strong> to this address. Sending wrong coin or network will result in permanent loss.
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Your {selectedCoin} Deposit Address ({network})</label>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#1e293b', wordBreak: 'break-all' }}>TQn8i7x7C4UQBVV5NpSRH9KVo4G7mJXi3</span>
                    <button onClick={handleCopy} style={{ background: copied ? '#d1fae5' : '#e0e7ff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: copied ? '#065f46' : '#3730a3', flexShrink: 0 }}>{copied ? 'Copied ✓' : 'Copy'}</button>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ width: 120, height: 120, background: 'white', border: '3px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>QR Code<br />{network}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Scan QR code with your wallet app</div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, fontSize: 13, color: '#64748b' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>Deposit Info:</div>
                  <div>• Minimum deposit: 1 {selectedCoin}</div>
                  <div>• Network confirmations required: 1 ({network})</div>
                  <div>• Credits usually within 5–10 minutes</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>📤 Withdraw {selectedCoin}</div>
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: '#065f46' }}>Available Balance:</span>
                  <strong style={{ fontSize: 16, color: '#065f46' }}>35.50 {selectedCoin}</strong>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Network</label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: 'white' }}>
                    <option>TRC-20 (Tron) — Fee: 1 USDT</option>
                    <option>ERC-20 (Ethereum) — Fee: 5 USDT</option>
                    <option>BEP-20 (BSC) — Fee: 0.5 USDT</option>
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Withdrawal Address</label>
                  <input type="text" placeholder={`Enter ${selectedCoin} wallet address`} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Amount ({selectedCoin})</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="0.00" value={wdAmount} onChange={e => setWdAmount(e.target.value)} style={{ width: '100%', padding: '10px 70px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    <button onClick={() => setWdAmount('35.50')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#e0e7ff', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#3730a3' }}>MAX</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Network fee: <strong>1 {selectedCoin}</strong></span>
                    <span style={{ color: '#64748b' }}>You receive: <strong>{wdAmount ? wdReceive + ' ' + selectedCoin : '—'}</strong></span>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
                  🔐 2FA verification required to withdraw. Ensure the address is correct — withdrawals are irreversible.
                </div>
                <button style={{ width: '100%', padding: '14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Confirm Withdrawal →</button>
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Transaction History</div>
              <Link href="/orders"><button style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white', color: '#374151' }}>View All</button></Link>
            </div>
            {txHistory.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < txHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: tx.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{tx.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{tx.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{tx.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: tx.amountColor }}>{tx.amount}</div>
                  <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
