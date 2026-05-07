'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { instantBuyApi } from '@/lib/api'

type Step = 'waiting' | 'detected' | 'confirming' | 'confirmed' | 'complete'

interface Order {
  id: string
  orderRef: string
  coin: string
  network: string
  coinAmount: number
  paymentMode: string
  depositAddress?: string
  incomingTxHash?: string
  status: string
}

const NETWORK_LABELS: Record<string, { name: string; short: string; conf: number }> = {
  TRC20:  { name: 'TRON (TRC-20)',     short: 'TRC-20',  conf: 20 },
  BEP20:  { name: 'BSC (BEP-20)',      short: 'BEP-20',  conf: 15 },
  ERC20:  { name: 'Ethereum (ERC-20)', short: 'ERC-20',  conf: 12 },
  SOL:    { name: 'Solana (SPL)',       short: 'SOL',     conf: 32 },
  ARB:    { name: 'Arbitrum One',       short: 'ARB',     conf: 10 },
  POLY:   { name: 'Polygon (MATIC)',    short: 'MATIC',   conf: 100 },
  OP:     { name: 'Optimism',           short: 'OP',      conf: 10 },
  BASE:   { name: 'Base',               short: 'BASE',    conf: 10 },
  AVAX:   { name: 'Avalanche C-Chain',  short: 'C-Chain', conf: 12 },
  BTC:    { name: 'Bitcoin',            short: 'BTC',     conf: 3 },
  APTOS:  { name: 'Aptos',              short: 'APT',     conf: 1 },
  NEAR:   { name: 'NEAR Protocol',      short: 'NEAR',    conf: 1 },
  SUI:    { name: 'Sui Network',        short: 'SUI',     conf: 1 },
  TON:    { name: 'TON Network',        short: 'TON',     conf: 1 },
  RONIN:  { name: 'Ronin Network',      short: 'RON',     conf: 5 },
}

export default function InstantBuyCryptoDepositPage() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<Order | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [timer, setTimer] = useState(15 * 60)
  const [step, setStep] = useState<Step>('waiting')
  const [confs, setConfs] = useState(0)
  const [copied, setCopied] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Load order on mount
  useEffect(() => {
    if (!id) return
    console.log('[InstantBuy CryptoDeposit] Loading order:', id)
    instantBuyApi.getOrder(id).then(res => {
      const o = res.data.data as Order
      console.log('[InstantBuy CryptoDeposit] Order loaded:', { coin: o.coin, network: o.network, amount: o.coinAmount, status: o.status })
      setOrder(o)
    }).catch(e => {
      const msg = e?.response?.data?.error ?? 'Failed to load order'
      console.error('[InstantBuy CryptoDeposit] Load failed:', msg)
      setLoadError(msg)
    })
  }, [id])

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function copyAddr() {
    if (!order?.depositAddress) return
    navigator.clipboard?.writeText(order.depositAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmitTx() {
    if (!txHash.trim() || !id) return
    setSubmitting(true)
    setSubmitError(null)
    console.log('[InstantBuy CryptoDeposit] Submitting tx hash:', txHash, 'for order:', id)
    try {
      await instantBuyApi.confirmDeposit(id, txHash.trim())
      setStep('detected')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to submit transaction'
      setSubmitError(msg)
      console.error('[InstantBuy CryptoDeposit] TX submit failed:', msg)
    } finally {
      setSubmitting(false)
    }
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
        Loading order...
      </div>
    )
  }

  const net = NETWORK_LABELS[order.network] ?? { name: order.network, short: order.network, conf: 20 }
  const depositAddr = order.depositAddress ?? '—'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Instant Buy</Link>
        <div style={{ margin: '0 auto', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Send {order.coin} · #{order.orderRef}</div>
        <Link href="/instant-buy/history" style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none' }}>My Orders</Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: '20px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Order #{order.orderRef} · Crypto Payment</div>
          <div style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Send {order.coin} to Receive {order.coin}</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              `💰 Receive: ${order.coinAmount.toFixed(6)} ${order.coin}`,
              `🌐 Network: ${net.name}`,
              `🔗 Confirmations: ${net.conf}`,
            ].map(m => (
              <div key={m} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600 }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div style={{ background: 'white', borderRadius: '16px', border: '2px solid #fde68a', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#fef3c7,#fde68a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 900, color: timer < 180 ? '#dc2626' : '#92400e', lineHeight: 1 }}>{mm}:{ss}</div>
            <div style={{ fontSize: '9px', color: '#d97706', fontWeight: 600, textTransform: 'uppercase' }}>left</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#92400e' }}>Order expires in 15 minutes</div>
            <div style={{ fontSize: '13px', color: '#d97706', marginTop: '3px' }}>Send the exact amount shown. Order is cancelled after expiry.</div>
          </div>
        </div>

        {/* Deposit Address */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1.5px solid #2563eb', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 700, color: '#1d4ed8', marginBottom: '12px' }}>
            🌐 {net.name} · {net.conf} confirmations required
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '8px' }}>Send your {order.coin} to this deposit address</div>
          <div style={{ background: '#f8fafc', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#1e293b', wordBreak: 'break-all', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1, lineHeight: 1.6 }}>{depositAddr}</div>
            <button onClick={copyAddr} style={{ background: copied ? '#059669' : '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: copied ? 'white' : '#2563eb', cursor: 'pointer', flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '2px solid #86efac', borderRadius: '14px', padding: '18px 20px', marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>EXACT Amount to Send</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#166534' }}>{order.coinAmount.toFixed(6)}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#15803d' }}>{order.coin}</div>
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px', opacity: 0.8 }}>⚠️ Send EXACTLY this amount. Under/over payment may delay your order.</div>
          </div>
        </div>

        {/* Manual TX hash submission (fallback) */}
        {step === 'waiting' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>📤 Already sent? Submit your transaction hash</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
              If you have already sent the payment, paste your transaction hash below so our system can verify it immediately.
            </div>
            <input
              type="text"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder="Paste your transaction hash..."
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
            />
            {submitError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#dc2626', marginBottom: '10px' }}>
                ⚠️ {submitError}
              </div>
            )}
            <button
              onClick={handleSubmitTx}
              disabled={!txHash.trim() || submitting}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: txHash.trim() && !submitting ? '#2563eb' : '#93c5fd', color: 'white', fontWeight: 600, fontSize: '14px', cursor: txHash.trim() && !submitting ? 'pointer' : 'not-allowed' }}
            >
              {submitting ? 'Submitting...' : 'Submit Transaction Hash'}
            </button>
          </div>
        )}

        {/* Warnings */}
        {[
          { style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }, icon: '🚫', text: <><strong>Wrong network = permanent loss of funds.</strong> Only send {order.coin} on the <strong>{net.name}</strong> network. PakSwap cannot recover wrong-network deposits.</> },
          { style: { background: '#fffbeb', border: '1.5px solid #fde68a', color: '#92400e' }, icon: '⏳', text: <><strong>{net.name} requires {net.conf} confirmations.</strong> Your tokens will be released automatically once confirmed.</> },
        ].map((w, i) => (
          <div key={i} style={{ ...w.style, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '13px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{w.icon}</span>
            <div>{w.text}</div>
          </div>
        ))}

        {/* Status */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>🔗 Verification Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: step === 'waiting' ? '#e2e8f0' : step === 'complete' ? '#059669' : '#2563eb' }} />
            <div style={{ fontSize: '15px', fontWeight: 700 }}>
              {step === 'waiting' ? 'Waiting for your transaction...' :
               step === 'detected' ? 'Transaction submitted — verifying...' :
               step === 'complete' ? 'Confirmed — releasing tokens!' : `${confs}/${net.conf} confirmations`}
            </div>
          </div>
        </div>

        {/* Two-Layer notice */}
        <div style={{ border: '1.5px solid #bfdbfe', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', fontWeight: 700 }}>
            🔐 Mandatory Two-Layer Verification
            <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
          </div>
          <div style={{ padding: '14px 18px', background: '#fffbeb', fontSize: '13px', color: '#92400e' }}>
            <strong>Layer 1:</strong> Blockchain auto-verification ({net.conf} confirmations on {net.name})<br />
            <strong>Layer 2:</strong> Admin human review — token release is blocked until a PakSwap admin approves, even after blockchain confirmation.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/instant-buy/history" style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', color: '#374151', textDecoration: 'none' }}>View My Orders</Link>
        </div>
      </div>
    </div>
  )
}
