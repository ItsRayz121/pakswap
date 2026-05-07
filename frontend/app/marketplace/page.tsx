'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { marketplaceApi, tradesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { KycGateModal } from '@/components/KycGateModal'

interface Ad {
  id: string
  coin: string
  side: string
  fixedPrice: number
  minOrderFiat: number
  maxOrderFiat: number
  availableAmount: number
  paymentMethods: string[]
  terms?: string
  avgReleaseMinutes?: number
  user: {
    id: string
    username?: string
    fullName: string
    tradeStats?: {
      totalTrades: number
      completionRate: number
      avgRating: number
    }
  }
}

const navStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 24px', height: '64px', background: 'white',
  borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100,
}

const COINS = [
  { sym: 'USDT', label: '₮ USDT', bg: '#26a17b' },
  { sym: 'BTC', label: '₿ BTC', bg: '#f7931a' },
  { sym: 'ETH', label: 'Ξ ETH', bg: '#627eea' },
  { sym: 'USDC', label: '$ USDC', bg: '#2775ca' },
]

function pmStyle(p: string) {
  if (p.toLowerCase().includes('jazz')) return { bg: '#fffbeb', border: '#fde68a', color: '#92400e' }
  if (p.toLowerCase().includes('easy')) return { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' }
  return { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' }
}

export default function MarketplacePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [coin, setCoin] = useState('USDT')
  const [ads, setAds] = useState<Ad[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [marketRate, setMarketRate] = useState<number | null>(null)

  const [modal, setModal] = useState<Ad | null>(null)
  const [pkrAmount, setPkrAmount] = useState('5000')
  const [selectedPm, setSelectedPm] = useState(0)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [tradeError, setTradeError] = useState('')
  const [kycGate, setKycGate] = useState(false)

  const userKycLevel = (user?.kycLevel ?? 'none') as 'none' | 'basic' | 'full'
  const userKycApproved = user?.kycStatus === 'approved'

  function handleAdClick(ad: Ad) {
    if (!isAuthenticated) { router.push('/login?redirect=/marketplace'); return }
    if (!userKycApproved || userKycLevel === 'none') {
      setKycGate(true)
      return
    }
    setModal(ad)
    setPkrAmount('5000')
    setSelectedPm(0)
    setTradeError('')
  }

  const fetchAds = useCallback(async () => {
    setLoading(true)
    try {
      const res = await marketplaceApi.getAds({ coin, side, limit: 20 })
      setAds(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      setAds([])
    } finally {
      setLoading(false)
    }
  }, [coin, side])

  const fetchRate = useCallback(async () => {
    try {
      const res = await marketplaceApi.getRate(coin)
      if (res.data.success) setMarketRate(res.data.data.rate)
    } catch {
      setMarketRate(null)
    }
  }, [coin])

  useEffect(() => { fetchAds() }, [fetchAds])
  useEffect(() => { fetchRate() }, [fetchRate])

  async function handleStartTrade() {
    if (!isAuthenticated) { router.push('/login?redirect=/marketplace'); return }
    if (!modal) return
    const fiatAmount = parseFloat(pkrAmount)
    if (!fiatAmount || fiatAmount < modal.minOrderFiat || fiatAmount > modal.maxOrderFiat) {
      setTradeError(`Amount must be between ${modal.minOrderFiat.toLocaleString()} and ${modal.maxOrderFiat.toLocaleString()} PKR.`)
      return
    }
    setTradeError('')
    setTradeLoading(true)
    try {
      const res = await tradesApi.initiate({
        adId: modal.id,
        fiatAmount,
        paymentMethod: modal.paymentMethods[selectedPm] ?? modal.paymentMethods[0],
      })
      router.push(`/trade/${res.data.data.id}`)
    } catch (e: any) {
      if (e?.response?.data?.error === 'KYC_REQUIRED') {
        setModal(null)
        setKycGate(true)
        return
      }
      setTradeError(e?.response?.data?.message ?? 'Failed to start trade. Please try again.')
    } finally {
      setTradeLoading(false)
    }
  }

  const rate = modal?.fixedPrice ?? 0
  const cryptoOut = rate > 0 ? (parseFloat(pkrAmount) / rate || 0).toFixed(4) : '0'

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace', active: true }, { label: 'Wallet', href: '/wallet' }, { label: 'Orders', href: '/orders' }, { label: '+ Create Ad', href: '/create-ad' }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        {isAuthenticated && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>{initials(user.fullName)}</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.username ?? user.fullName.split(' ')[0]}</span>
            {user.kycStatus === 'approved' && <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>✓ KYC</span>}
          </div>
        ) : (
          <Link href="/login" style={{ padding: '8px 18px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Sign In</Link>
        )}
      </nav>

      {/* Coin/Side bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setSide('buy')} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: side === 'buy' ? '#dcfce7' : '#f1f5f9', color: side === 'buy' ? '#166534' : '#64748b' }}>🟢 BUY</button>
            <button onClick={() => setSide('sell')} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: side === 'sell' ? '#fee2e2' : '#f1f5f9', color: side === 'sell' ? '#991b1b' : '#64748b' }}>🔴 SELL</button>
          </div>
          <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {COINS.map(c => (
              <button key={c.sym} onClick={() => setCoin(c.sym)} style={{ padding: '7px 14px', borderRadius: '20px', border: coin === c.sym ? 'none' : '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: 700, background: coin === c.sym ? c.bg : 'white', color: coin === c.sym ? 'white' : '#374151', cursor: 'pointer' }}>{c.label}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Market Rate:</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>{marketRate ? `${marketRate.toLocaleString()} PKR` : '—'}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
            {side === 'buy' ? 'Buy' : 'Sell'} {coin}
            {!loading && <span style={{ color: '#64748b', fontWeight: 400, marginLeft: '8px' }}>{total} offers available</span>}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#64748b' }}>Loading offers...</div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>No offers right now</div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>No active {side} ads for {coin}. Check back soon or create your own ad.</div>
            <Link href="/create-ad" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}>+ Create Ad</Link>
          </div>
        ) : (
          ads.map(ad => {
            const stats = ad.user.tradeStats
            const name = ad.user.username ?? ad.user.fullName
            const diff = marketRate ? ((ad.fixedPrice - marketRate) / marketRate * 100) : null
            return (
              <div key={ad.id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>{initials(name)}</div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>{name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
                        {stats && <>
                          <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(stats.avgRating ?? 0))}</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{stats.avgRating?.toFixed(1) ?? '—'}</span>
                          <span>{stats.totalTrades ?? 0} trades</span>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>{stats.completionRate ? `${(stats.completionRate * 100).toFixed(1)}%` : '—'} completion</span>
                        </>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e293b' }}>{ad.fixedPrice.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>PKR</span></div>
                    {diff !== null && (
                      <div style={{ fontSize: '12px', color: diff >= 0 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(2)}% vs market
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
                  <span>Limits: <strong style={{ color: '#1e293b' }}>{ad.minOrderFiat.toLocaleString()} — {ad.maxOrderFiat.toLocaleString()} PKR</strong></span>
                  <span>Avail: <strong style={{ color: '#1e293b' }}>{ad.availableAmount} {ad.coin}</strong></span>
                  {ad.avgReleaseMinutes && <span>⚡ ~{ad.avgReleaseMinutes} min release</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ad.paymentMethods.map(p => {
                      const s = pmStyle(p)
                      return <span key={p} style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p}</span>
                    })}
                  </div>
                  <button
                    onClick={() => handleAdClick(ad)}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                  >
                    {side === 'buy' ? 'Buy' : 'Sell'} {coin} →
                  </button>
                </div>
                {ad.terms && <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>📋 "{ad.terms}"</div>}
              </div>
            )
          })
        )}
      </div>

      {/* Trade modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{side === 'buy' ? 'Buy' : 'Sell'} {modal.coin} from {modal.user.username ?? modal.user.fullName}</div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Rate: <strong>{modal.fixedPrice.toLocaleString()}</strong> PKR / {modal.coin}</div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Protected by PakSwap Escrow</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>{modal.coin} locked in escrow until payment confirmed</div>
              </div>
            </div>

            {tradeError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>{tradeError}</div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>I want to pay (PKR)</label>
              <div style={{ position: 'relative', marginTop: '6px' }}>
                <input
                  type="number"
                  value={pkrAmount}
                  onChange={e => setPkrAmount(e.target.value)}
                  style={{ width: '100%', padding: '14px', paddingRight: '60px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '22px', fontWeight: 800, boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>PKR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#94a3b8' }}>
                <span>Min: {modal.minOrderFiat.toLocaleString()} PKR</span>
                <span>Max: {modal.maxOrderFiat.toLocaleString()} PKR</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>You will receive:</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#26a17b' }}>{cryptoOut} {modal.coin}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Platform fee:</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>FREE 🎉</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {modal.paymentMethods.map((p, i) => (
                  <div key={p} onClick={() => setSelectedPm(i)} style={{ flex: 1, minWidth: '120px', border: `2px solid ${selectedPm === i ? '#2563eb' : '#e2e8f0'}`, background: selectedPm === i ? '#eff6ff' : 'white', borderRadius: '10px', padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: selectedPm === i ? '#1d4ed8' : '#374151', cursor: 'pointer' }}>{p}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button
                onClick={handleStartTrade}
                disabled={tradeLoading}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: tradeLoading ? '#6ee7b7' : '#059669', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}
              >
                {tradeLoading ? 'Starting trade...' : 'Confirm & Start Trade →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <KycGateModal
        open={kycGate}
        onClose={() => setKycGate(false)}
        reason="trade"
        currentLevel={userKycLevel}
      />
    </div>
  )
}
