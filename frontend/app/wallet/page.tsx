'use client'
import { useState } from 'react'
import Link from 'next/link'

const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }

const coins = [
  { sym: 'USDT', label: 'Tether', icon: '₮', iconBg: '#26a17b', balance: '35.50', pkr: '9,952', available: '35.50', escrow: '0.00' },
  { sym: 'BTC', label: 'Bitcoin', icon: '₿', iconBg: '#f7931a', balance: '0.00142', pkr: '27,264', available: '0.00142', escrow: '0.00' },
  { sym: 'ETH', label: 'Ethereum', icon: 'Ξ', iconBg: '#627eea', balance: '0.0821', pkr: '8,577', available: '0.0821', escrow: '0.00' },
  { sym: 'USDC', label: 'USD Coin', icon: '$', iconBg: '#2775ca', balance: '0.00', pkr: '0', available: null, escrow: null },
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
  const [net, setNet] = useState('TRC-20')
  const [copied, setCopied] = useState(false)
  const [wdAmount, setWdAmount] = useState('')

  const wdReceive = Math.max(0, (parseFloat(wdAmount) || 0) - 1).toFixed(2)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet', active: true }, { label: 'Orders', href: '/orders' }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>My Wallet</h1>
            <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Total value: <strong style={{ color: '#1e293b' }}>≈ 12,450 PKR</strong> · <strong style={{ color: '#1e293b' }}>≈ $44.25 USD</strong></div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setPanel('deposit')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: panel === 'deposit' ? '#eff6ff' : 'white', color: panel === 'deposit' ? '#1d4ed8' : '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📥 Deposit</button>
            <button onClick={() => setPanel('withdraw')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📤 Withdraw</button>
          </div>
        </div>

        {/* Coin Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
          {coins.map(c => (
            <div key={c.sym} onClick={() => setSelectedCoin(c.sym)} style={{ background: 'white', border: `1.5px solid ${selectedCoin === c.sym ? '#2563eb' : '#e2e8f0'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: selectedCoin === c.sym ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px' }}>{c.icon}</div>
                <div><div style={{ fontWeight: 800, fontSize: '16px' }}>{c.sym}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{c.label}</div></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{c.balance}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>≈ {c.pkr} PKR</div>
              {c.available !== null ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Available: {c.available}</span>
                  <span style={{ color: '#f59e0b' }}>Escrow: {c.escrow}</span>
                </div>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <button style={{ padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '11px' }}>Deposit to start</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Deposit/Withdraw panel */}
          <div>
            {panel === 'deposit' ? (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>📥 Deposit {selectedCoin}</div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Network</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {['TRC-20 (Tron)', 'ERC-20 (Ethereum)', 'BEP-20 (BSC)'].map(n => {
                      const key = n.split(' ')[0]
                      return (
                        <button key={n} onClick={() => setNet(key)} style={{ padding: '8px 16px', borderRadius: '8px', border: `2px solid ${net === key ? '#2563eb' : '#e2e8f0'}`, background: net === key ? '#eff6ff' : 'white', color: net === key ? '#1d4ed8' : '#374151', fontWeight: net === key ? 700 : 600, fontSize: '13px', cursor: 'pointer' }}>{n}</button>
                      )
                    })}
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
                  ⚠️ Only send <strong>{selectedCoin} ({net})</strong> to this address. Sending wrong coin or network will result in permanent loss.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Your {selectedCoin} Deposit Address ({net})</label>
                  <div style={{ marginTop: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                    <span style={{ color: '#1e293b' }}>TQn8i7x7C4UQBVV5NpSRH9KVo4G7mJXi3</span>
                    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: copied ? '#d1fae5' : '#e0e7ff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: copied ? '#065f46' : '#3730a3', flexShrink: 0 }}>{copied ? 'Copied ✓' : 'Copy'}</button>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '120px', height: '120px', background: 'white', border: '3px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>QR Code<br />{net}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Scan QR code with your wallet app</div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#64748b' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: '#374151' }}>Deposit Info:</div>
                  <div>• Minimum deposit: 1 {selectedCoin}</div>
                  <div>• Network confirmations required: 1 ({net})</div>
                  <div>• Credits usually within 5–10 minutes</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>📤 Withdraw {selectedCoin}</div>
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#065f46' }}>Available Balance:</span>
                  <strong style={{ fontSize: '16px', color: '#065f46' }}>35.50 {selectedCoin}</strong>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Network</label>
                  <select style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                    <option>TRC-20 (Tron) — Fee: 1 USDT</option>
                    <option>ERC-20 (Ethereum) — Fee: 5 USDT</option>
                    <option>BEP-20 (BSC) — Fee: 0.5 USDT</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Withdrawal Address</label>
                  <input type="text" placeholder="Enter USDT wallet address" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Amount ({selectedCoin})</label>
                  <div style={{ position: 'relative', marginTop: '6px' }}>
                    <input type="number" value={wdAmount} onChange={e => setWdAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px 70px 10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                    <button onClick={() => setWdAmount('35.50')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#e0e7ff', border: 'none', borderRadius: '5px', padding: '3px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#3730a3' }}>MAX</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Network fee: <strong>1 {selectedCoin}</strong></span>
                    <span style={{ color: '#64748b' }}>You receive: <strong>{wdAmount ? `${wdReceive} ${selectedCoin}` : '—'}</strong></span>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
                  🔐 2FA verification required to withdraw. Ensure the address is correct — withdrawals are irreversible.
                </div>
                <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Confirm Withdrawal →</button>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>Transaction History</div>
              <Link href="/orders"><button style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View All</button></Link>
            </div>
            {txHistory.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < txHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tx.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{tx.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{tx.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{tx.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: tx.amountColor }}>{tx.amount}</div>
                  <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
