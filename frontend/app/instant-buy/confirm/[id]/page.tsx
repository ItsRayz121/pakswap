'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { instantBuyApi } from '@/lib/api'

interface Order {
  id: string
  orderRef: string
  coin: string
  network: string
  coinAmount: number
  fiatAmount: number | null
  rate: number | null
  paymentMode: string
  status: string
  verificationStatus: string
  toAddress?: string
  createdAt: string
}

const COIN_EMOJI: Record<string, string> = {
  USDT: '💵', USDC: '🔵', BNB: '🟡', ETH: '🔷', SOL: '🟣',
  BTC: '🟠', TRX: '🔴', AVAX: '🔺', APT: '⚡', NEAR: '🌐',
  OP: '🔴', ARB: '💙', SUI: '💧', RON: '⚔️', TON: '💎',
}

const NETWORK_LABELS: Record<string, string> = {
  TRC20: 'TRON (TRC-20)', BEP20: 'BSC (BEP-20)', ERC20: 'Ethereum (ERC-20)',
  SOL: 'Solana (SPL)', ARB: 'Arbitrum One', POLY: 'Polygon (MATIC)',
  OP: 'Optimism', BASE: 'Base', AVAX: 'Avalanche C-Chain',
  BTC: 'Bitcoin', APTOS: 'Aptos', NEAR: 'NEAR Protocol',
  SUI: 'Sui Network', TON: 'TON Network', RONIN: 'Ronin Network',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function InstantBuyConfirmPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    console.log('[InstantBuy Confirm] Loading order:', id)
    instantBuyApi.getOrder(id).then(res => {
      const o = res.data.data as Order
      console.log('[InstantBuy Confirm] Order loaded:', { coin: o.coin, status: o.status, verificationStatus: o.verificationStatus })
      setOrder(o)
    }).catch(e => {
      const msg = e?.response?.data?.error ?? 'Failed to load order'
      console.error('[InstantBuy Confirm] Load error:', msg)
      setLoadError(msg)
    })
  }, [id])

  if (loadError) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>{loadError}</div>
        <Link href="/instant-buy/history" style={{ color: '#2563eb', fontWeight: 600 }}>View My Orders</Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', padding: '64px 24px', textAlign: 'center', color: '#64748b' }}>
        Loading order confirmation...
      </div>
    )
  }

  const emoji = COIN_EMOJI[order.coin] ?? '🪙'
  const netLabel = NETWORK_LABELS[order.network] ?? order.network
  const isPkr = order.paymentMode === 'pkr'
  const isUnderReview = ['under_review', 'payment_uploaded'].includes(order.status)

  const summaryRows: [string, string, boolean][] = [
    ...(isPkr && order.fiatAmount ? [['You paid', `${order.fiatAmount.toLocaleString()} PKR`, false] as [string, string, boolean]] : []),
    ['You receive', `${order.coinAmount.toFixed(6)} ${order.coin}`, false],
    ...(order.rate ? [['Rate', `PKR ${Math.round(order.rate).toLocaleString()} / ${order.coin}`, false] as [string, string, boolean]] : []),
    ['Payment method', isPkr ? '📱 PKR (JazzCash/Bank)' : `🔗 ${order.coin} (Crypto)`, false],
    ['Network', netLabel, false],
    ['Destination wallet', order.toAddress ? `${order.toAddress.slice(0, 10)}...${order.toAddress.slice(-6)}` : '—', true],
    ['Order placed', fmtDate(order.createdAt), true],
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f1f5f9', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/marketplace" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/instant-buy" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Instant Buy</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', marginBottom: '20px', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>✅</div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '20px' }}>
            {isPkr ? 'Your payment proof has been submitted. Our team is now verifying it.' : 'Deposit detected. Verification in progress.'}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 20px', display: 'inline-block' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>Order ID</div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}>{order.orderRef}</div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>📋 Order Summary</div>
          {summaryRows.map(([label, value, mono], i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < summaryRows.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '14px', gap: '12px' }}>
              <span style={{ color: '#64748b', flexShrink: 0 }}>{label}</span>
              <span style={{ fontWeight: 700, color: label === 'You receive' ? '#059669' : '#1e293b', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* What Happens Next */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>⏱️ What Happens Next</div>
          {[
            {
              icon: '✓', iconBg: '#d1fae5', iconColor: '#065f46',
              title: isPkr ? 'Payment Proof Received' : 'Deposit Submitted',
              desc: isPkr ? 'Your payment screenshot has been received by our system.' : 'Your deposit has been submitted for blockchain verification.',
              status: '✓ Submitted', statusColor: '#059669',
            },
            {
              icon: '🔐', iconBg: '#dbeafe', iconColor: '#2563eb',
              title: 'Two-Layer Verification',
              desc: 'Layer 1: Automated verification. Layer 2: Mandatory admin human review — both must pass before any token is released.',
              status: isUnderReview ? '⏳ In progress...' : `Status: ${order.verificationStatus.replace(/_/g, ' ')}`,
              statusColor: '#2563eb',
            },
            {
              icon: `${emoji}`, iconBg: '#f1f5f9', iconColor: '#94a3b8',
              title: `${order.coin} Released to Your Wallet`,
              desc: `Once both layers pass, ${order.coinAmount.toFixed(6)} ${order.coin} will be sent to your wallet.`,
              status: 'Pending verification',
              statusColor: '#94a3b8',
            },
            {
              icon: '📲', iconBg: '#f1f5f9', iconColor: '#94a3b8',
              title: 'SMS & Email Notification',
              desc: "You'll receive a confirmation when the order completes.",
              status: '',
              statusColor: '#94a3b8',
            },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '10px 0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: i < 2 ? '#1e293b' : '#94a3b8' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: i < 2 ? '#64748b' : '#94a3b8', marginTop: '2px' }}>{s.desc}</div>
                {s.status && <div style={{ fontSize: '12px', color: s.statusColor, fontWeight: 600, marginTop: '4px' }}>{s.status}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400e', marginBottom: '8px' }}>⚠️ Important</div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#92400e', lineHeight: 1.8 }}>
            <li>Do <strong>not</strong> request a chargeback from your bank — this will flag your account for fraud review.</li>
            <li>If you don't receive your crypto within <strong>60 minutes</strong>, use the button below to contact support.</li>
            <li>Your order ID is <strong>{order.orderRef}</strong> — save it for reference.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <Link href={`/instant-buy/status/${order.id}`} style={{ padding: '14px', borderRadius: '12px', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', textAlign: 'center' }}>
            📡 Track Order Status →
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/wallet" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none', textAlign: 'center' }}>👛 View Wallet</Link>
            <Link href="/" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none', textAlign: 'center' }}>🏠 Dashboard</Link>
            <Link href="/instant-buy/history" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none', textAlign: 'center' }}>📋 My Orders</Link>
          </div>
        </div>

        {/* Support */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px' }}>🎧</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>Need help with this order?</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Support is available 9am – 9pm PKT · Response in under 15 min</div>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Chat</button>
        </div>
      </div>
    </div>
  )
}
