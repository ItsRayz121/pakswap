'use client'
import { useState, useEffect, useCallback } from 'react'
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
  outgoingTxHash?: string
  incomingTxHash?: string
  createdAt: string
  completedAt?: string
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

function statusToTimelineState(order: Order) {
  const s = order.status
  const v = order.verificationStatus
  return {
    created: true,
    uploaded: ['payment_uploaded', 'under_review', 'releasing', 'completed'].includes(s),
    layer1Done: v === 'pending_layer2' || v === 'approved',
    layer2Done: v === 'approved' || s === 'completed',
    released: s === 'releasing' || s === 'completed',
    completed: s === 'completed',
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function InstantBuyStatusPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchOrder = useCallback(() => {
    if (!id) return
    instantBuyApi.getOrder(id).then(res => {
      const o = res.data.data as Order
      console.log('[InstantBuy Status] Order polled:', { status: o.status, verificationStatus: o.verificationStatus })
      setOrder(o)
    }).catch(e => {
      const msg = e?.response?.data?.error ?? 'Failed to load order'
      console.error('[InstantBuy Status] Load error:', msg)
      setLoadError(msg)
    })
  }, [id])

  // Initial load
  useEffect(() => { fetchOrder() }, [fetchOrder])

  // Poll every 15s until completed/rejected/cancelled
  useEffect(() => {
    if (!order) return
    const terminal = ['completed', 'cancelled', 'rejected', 'payout_failed']
    if (terminal.includes(order.status)) return
    const iv = setInterval(fetchOrder, 15000)
    return () => clearInterval(iv)
  }, [order, fetchOrder])

  function copyTx(hash: string) {
    navigator.clipboard?.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        Loading order status...
      </div>
    )
  }

  const tl = statusToTimelineState(order)
  const emoji = COIN_EMOJI[order.coin] ?? '🪙'
  const netLabel = NETWORK_LABELS[order.network] ?? order.network
  const isCompleted = order.status === 'completed'
  const isFailed = ['cancelled', 'rejected', 'payout_failed'].includes(order.status)
  const isPkr = order.paymentMode === 'pkr'

  const timelineItems = [
    {
      label: 'Order Created',
      sub: `${order.coinAmount.toFixed(6)} ${order.coin}${isPkr && order.fiatAmount ? ` for ${order.fiatAmount.toLocaleString()} PKR` : ''}`,
      time: fmtDate(order.createdAt),
      state: 'done',
    },
    {
      label: isPkr ? 'Payment Uploaded' : 'Deposit Submitted',
      sub: isPkr ? 'Payment screenshot submitted' : 'Transaction hash submitted',
      time: tl.uploaded ? '—' : 'Waiting...',
      state: tl.uploaded ? 'done' : 'pending',
    },
    {
      label: 'Layer 1 — Automated Verification',
      sub: isPkr ? 'AI OCR + payment analysis' : 'Blockchain confirmation check',
      time: tl.layer1Done ? '—' : tl.uploaded ? 'In progress...' : 'Pending',
      state: tl.layer1Done ? 'done' : tl.uploaded ? 'active' : 'pending',
    },
    {
      label: 'Layer 2 — Admin Human Review',
      sub: 'Mandatory admin verification before release',
      time: tl.layer2Done ? '—' : tl.layer1Done ? 'In queue (SLA: 30 min)' : 'Awaiting Layer 1',
      state: tl.layer2Done ? 'done' : tl.layer1Done ? 'active' : 'pending',
      layer2: true,
    },
    {
      label: 'Token Release',
      sub: `${order.coin} being sent to your wallet`,
      time: tl.released ? '—' : 'Pending admin approval',
      state: tl.released ? 'done' : 'pending',
    },
    {
      label: 'Completed',
      sub: `${order.coin} confirmed in your wallet`,
      time: order.completedAt ? fmtDate(order.completedAt) : 'Pending',
      state: tl.completed ? 'done' : 'pending',
      last: true,
    },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Instant Buy</Link>
        <div style={{ margin: '0 auto', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Order #{order.orderRef}</div>
        <Link href="/instant-buy/history" style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none' }}>View History</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Status hero */}
        {isCompleted ? (
          <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>{order.coinAmount.toFixed(6)} {order.coin} Sent!</h2>
            <p style={{ opacity: 0.9, fontSize: '15px' }}>Your {order.coin} has been sent to your wallet successfully.</p>
            {order.outgoingTxHash && (
              <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0', wordBreak: 'break-all', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap' }}>TX HASH</span>
                <span style={{ flex: 1 }}>{order.outgoingTxHash}</span>
                <button onClick={() => copyTx(order.outgoingTxHash!)} style={{ background: '#334155', border: '1px solid #475569', color: copied ? '#10b981' : '#e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        ) : isFailed ? (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', marginBottom: '8px' }}>Order {order.status.replace('_', ' ')}</h2>
            <p style={{ fontSize: '14px', color: '#ef4444' }}>Contact support with order #{order.orderRef} for assistance.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔐</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Processing Your Order</h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '400px', margin: '0 auto 20px' }}>
              {tl.layer1Done ? 'Layer 1 complete — awaiting admin review (Layer 2).' : tl.uploaded ? 'Verification in progress...' : isPkr ? 'Waiting for your payment upload.' : 'Waiting for deposit.'}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#eff6ff', borderRadius: '10px', padding: '12px 20px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d4ed8' }}>
                Status: {order.status.replace(/_/g, ' ')} · Auto-refreshing every 15s
              </span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Order Timeline</h3>
          {timelineItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
                  background: item.state === 'done' ? '#059669' : item.state === 'active' ? '#2563eb' : '#f1f5f9',
                  color: item.state === 'pending' ? '#94a3b8' : 'white',
                }}>
                  {item.state === 'done' ? '✓' : item.state === 'active' ? '⏳' : i + 1}
                </div>
                {!item.last && <div style={{ width: '2px', flex: 1, minHeight: '32px', margin: '4px 0', background: item.state === 'done' ? '#059669' : '#e2e8f0' }} />}
              </div>
              <div style={{ paddingBottom: item.last ? 0 : '28px', flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                  {item.label}
                  {item.layer2 && <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', padding: '1px 6px', marginLeft: '6px', fontWeight: 700 }}>Layer 2</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{item.sub}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Two-layer info */}
        <div style={{ border: '1.5px solid #bfdbfe', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', fontWeight: 700 }}>
            🔐 Mandatory Two-Layer Verification
            <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
          </div>
          <div style={{ padding: '16px 18px', fontSize: '13px', color: '#374151', lineHeight: 1.8 }}>
            <div><strong>Layer 1 ({tl.layer1Done ? '✓ Complete' : tl.uploaded ? '⏳ In progress' : '⏸ Pending'}):</strong> {isPkr ? 'AI OCR scans your payment screenshot — amount, name, timestamp, manipulation.' : 'Blockchain monitoring — amount, wallet, confirmation count.'}</div>
            <div style={{ marginTop: '8px' }}><strong>Layer 2 ({tl.layer2Done ? '✓ Approved' : tl.layer1Done ? '⏳ In queue' : '⏸ Awaiting L1'}):</strong> A PakSwap admin manually reviews and approves before any token is released. SLA: 30 minutes from Layer 1 completion.</div>
          </div>
        </div>

        {/* Order details grid */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Order Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Order ID', value: order.orderRef, mono: true },
              { label: 'Token', value: `${emoji} ${order.coin}`, mono: false },
              { label: 'You Receive', value: `${order.coinAmount.toFixed(6)} ${order.coin}`, color: '#059669' },
              { label: 'Network', value: netLabel, mono: false },
              ...(isPkr && order.fiatAmount ? [{ label: 'You Paid', value: `${order.fiatAmount.toLocaleString()} PKR`, mono: false }] : []),
              ...(order.rate ? [{ label: 'Rate', value: `PKR ${Math.round(order.rate).toLocaleString()} / ${order.coin}`, mono: false }] : []),
            ].map(d => (
              <div key={d.label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{d.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: d.color || '#1e293b', fontFamily: d.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{d.value}</div>
              </div>
            ))}
          </div>
          {order.toAddress && (
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', marginTop: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Destination Wallet</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.toAddress}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/instant-buy/history" style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', color: '#374151', textDecoration: 'none' }}>View Order History</Link>
          <Link href="/instant-buy" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Buy More Crypto</Link>
        </div>
      </div>
    </div>
  )
}
