'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adsApi, marketplaceApi, walletApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { KycGateModal } from '@/components/KycGateModal'

const COINS = [
  { id: 'USDT', sym: '₮', border: '#26a17b', bg: '#f0fdf4', color: '#065f46' },
  { id: 'BTC',  sym: '₿', border: '#f7931a', bg: '#fff7ed', color: '#9a3412' },
  { id: 'ETH',  sym: 'Ξ', border: '#627eea', bg: '#f0f4ff', color: '#3730a3' },
  { id: 'USDC', sym: '$', border: '#2775ca', bg: '#eff6ff', color: '#1e40af' },
]

const PAYMENT_OPTIONS = ['JazzCash', 'Easypaisa', 'HBL Bank Transfer', 'MCB Bank Transfer', 'UBL Bank Transfer', 'Bank Alfalah', 'Meezan Bank', 'NayaPay', 'SadaPay']

export default function CreateAdPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [coin, setCoin] = useState('USDT')
  const [fixedPrice, setFixedPrice] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [minOrder, setMinOrder] = useState('1000')
  const [maxOrder, setMaxOrder] = useState('200000')
  const [selectedPms, setSelectedPms] = useState<string[]>(['JazzCash'])
  const [terms, setTerms] = useState('')
  const [tradeWindow, setTradeWindow] = useState(30)
  const [marketRate, setMarketRate] = useState<number | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kycGate, setKycGate] = useState(false)
  const userKycLevel = (user?.kycLevel ?? 'none') as 'none' | 'basic' | 'full'
  const userKycApproved = user?.kycStatus === 'approved'

  useEffect(() => {
    marketplaceApi.getRate(coin).then(r => {
      if (r.data.success) {
        const rate = r.data.data.rate
        setMarketRate(rate)
        if (!fixedPrice) setFixedPrice(rate.toFixed(2))
      }
    }).catch(() => {})
  }, [coin]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (side === 'sell') {
      walletApi.getAll().then(r => {
        const w = (r.data.data ?? []).find((w: any) => w.coin === coin)
        setWalletBalance(w ? parseFloat(w.availableBalance) : 0)
      }).catch(() => {})
    }
  }, [coin, side])

  function togglePm(pm: string) {
    setSelectedPms(prev => prev.includes(pm) ? prev.filter(p => p !== pm) : [...prev, pm])
  }

  async function publishAd() {
    if (!userKycApproved || userKycLevel === 'none') {
      setKycGate(true)
      return
    }
    if (!fixedPrice || parseFloat(fixedPrice) <= 0) return setError('Enter a valid price.')
    if (!totalAmount || parseFloat(totalAmount) <= 0) return setError('Enter the total amount.')
    if (selectedPms.length === 0) return setError('Select at least one payment method.')
    if (parseFloat(minOrder) >= parseFloat(maxOrder)) return setError('Min order must be less than max order.')
    setError('')
    setLoading(true)
    try {
      const res = await adsApi.create({
        side,
        coin,
        priceType: 'fixed',
        fixedPrice: parseFloat(fixedPrice),
        totalAmount: parseFloat(totalAmount),
        minOrderFiat: parseFloat(minOrder),
        maxOrderFiat: parseFloat(maxOrder),
        paymentMethods: selectedPms,
        tradeWindow,
        terms: terms || undefined,
        requireKycLevel: 'basic',
        requireMinTrades: 0,
      })
      router.push('/my-ads')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to publish ad. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const rate = parseFloat(fixedPrice) || 0
  const diff = marketRate ? ((rate - marketRate) / marketRate * 100) : 0
  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>+ Create Ad</span>
        {user && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initials(user.fullName)}</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.username ?? user.fullName.split(' ')[0]}</span>
          </div>
        )}
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Create P2P Advertisement</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Set up your offer for the marketplace</p>
          </div>
          <Link href="/my-ads" style={{ padding: '9px 18px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', color: '#374151' }}>My Ads</Link>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626' }}>{error}</div>}

        {/* 1. Direction */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>1. Trade Direction</div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {([['sell', '💰', 'SELL Crypto', 'Receive PKR from buyers'], ['buy', '🛒', 'BUY Crypto', 'Send PKR to sellers']] as const).map(([s, icon, label, sub]) => (
              <button key={s} onClick={() => setSide(s)} style={{ flex: 1, padding: '16px', borderRadius: '10px', border: `2px solid ${side === s ? '#2563eb' : '#e2e8f0'}`, background: side === s ? '#eff6ff' : 'white', color: side === s ? '#1d4ed8' : '#374151', cursor: 'pointer', fontWeight: 600 }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                <div>{label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>{sub}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {COINS.map(c => (
              <button key={c.id} onClick={() => setCoin(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: `2px solid ${coin === c.id ? c.border : '#e2e8f0'}`, background: coin === c.id ? c.bg : 'white', color: coin === c.id ? c.color : '#374151', fontWeight: 700, cursor: 'pointer' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: c.border, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>{c.sym}</div>
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Price */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>2. Price (PKR per {coin})</div>
          <div style={{ position: 'relative' }}>
            <input type="number" value={fixedPrice} onChange={e => setFixedPrice(e.target.value)}
              style={{ width: '100%', padding: '14px', paddingRight: '60px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '22px', fontWeight: 800, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
          </div>
          {marketRate && fixedPrice && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Market rate: <strong>{marketRate.toLocaleString()} PKR</strong></span>
              <span style={{ fontWeight: 600, color: diff >= 0 ? '#10b981' : '#f59e0b' }}>{diff >= 0 ? '▲ +' : '▼ '}{Math.abs(diff).toFixed(2)}% vs market</span>
            </div>
          )}
        </div>

        {/* 3. Limits */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>3. Trade Limits</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Total {coin} to {side === 'sell' ? 'Sell' : 'Buy'}</label>
              <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="e.g. 500"
                style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              {side === 'sell' && walletBalance > 0 && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Available: {walletBalance.toFixed(4)} {coin}</div>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Min per Trade (PKR)</label>
              <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)}
                style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Max per Trade (PKR)</label>
              <input type="number" value={maxOrder} onChange={e => setMaxOrder(e.target.value)}
                style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* 4. Payment Methods */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>4. Payment Methods</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PAYMENT_OPTIONS.map(pm => {
              const selected = selectedPms.includes(pm)
              return (
                <button key={pm} onClick={() => togglePm(pm)} style={{ padding: '8px 16px', borderRadius: '20px', border: `1.5px solid ${selected ? '#2563eb' : '#e2e8f0'}`, background: selected ? '#eff6ff' : 'white', color: selected ? '#1d4ed8' : '#374151', fontWeight: selected ? 700 : 500, fontSize: '13px', cursor: 'pointer' }}>
                  {selected ? '✓ ' : ''}{pm}
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Settings */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>5. Trade Settings</div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Payment Window</label>
            <select value={tradeWindow} onChange={e => setTradeWindow(parseInt(e.target.value))} style={{ display: 'block', marginTop: '6px', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: 'white', outline: 'none' }}>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Terms <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} placeholder="e.g. Send from your own registered account only."
              style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{terms.length}/500</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingBottom: '32px' }}>
          <Link href="/my-ads" style={{ padding: '14px 24px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', color: '#374151', display: 'flex', alignItems: 'center' }}>Cancel</Link>
          <button onClick={publishAd} disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#6ee7b7' : '#16a34a', color: 'white', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Publishing...' : '🚀 Publish Ad to Marketplace'}
          </button>
        </div>
      </div>
      <KycGateModal open={kycGate} onClose={() => setKycGate(false)} reason="create-ad" currentLevel={userKycLevel} />
    </div>
  )
}
