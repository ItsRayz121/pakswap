'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { instantBuyApi } from '@/lib/api'

interface PaymentConfig {
  jazzcash: string | null
  easypaisa: string | null
  accountName: string
  bankIban: string | null
  bankName: string | null
  supportWhatsapp: string | null
}

interface Order {
  id: string
  orderRef: string
  coin: string
  network: string
  coinAmount: number
  fiatAmount: number | null
  rate: number | null
  status: string
  toAddress?: string
  quoteExpiresAt?: string
}

const NETWORK_LABELS: Record<string, string> = {
  TRC20: 'TRON (TRC-20)', BEP20: 'BSC (BEP-20)', ERC20: 'Ethereum (ERC-20)',
  SOL: 'Solana (SPL)', ARB: 'Arbitrum One', POLY: 'Polygon (MATIC)',
  OP: 'Optimism', BASE: 'Base', AVAX: 'Avalanche C-Chain',
  BTC: 'Bitcoin', APTOS: 'Aptos', NEAR: 'NEAR Protocol',
  SUI: 'Sui Network', TON: 'TON Network', RONIN: 'Ronin Network',
}

const COIN_EMOJI: Record<string, string> = {
  USDT: '💵', USDC: '🔵', BNB: '🟡', ETH: '🔷', SOL: '🟣',
  BTC: '🟠', TRX: '🔴', AVAX: '🔺', APT: '⚡', NEAR: '🌐',
  OP: '🔴', ARB: '💙', SUI: '💧', RON: '⚔️', TON: '💎',
}

export default function InstantBuyPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [payConfig, setPayConfig] = useState<PaymentConfig | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileObj, setFileObj] = useState<File | null>(null)
  const [timer, setTimer] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      instantBuyApi.getOrder(id),
      instantBuyApi.getPaymentConfig(),
    ]).then(([orderRes, configRes]) => {
      const o = orderRes.data.data as Order
      const cfg = configRes.data.data as PaymentConfig
      setOrder(o)
      setPayConfig(cfg)
      // Set timer from real quoteExpiresAt
      if (o.quoteExpiresAt) {
        const remaining = Math.max(0, Math.floor((new Date(o.quoteExpiresAt).getTime() - Date.now()) / 1000))
        setTimer(remaining)
      } else {
        setTimer(30 * 60) // 30 min fallback
      }
    }).catch(e => {
      const msg = e?.response?.data?.error ?? 'Failed to load order'
      setLoadError(msg)
    })
  }, [id])

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function copyText(text: string, key: string) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  function handleFileSelect(file: File) {
    setFileObj(file)
    setFileName(file.name)
    setFileUploaded(true)
  }

  async function handleSubmitPayment() {
    if (!fileObj || !id) return
    setSubmitting(true)
    setSubmitError(null)
    console.log('[InstantBuy Payment] Uploading payment proof for order:', id)
    const formData = new FormData()
    formData.append('file', fileObj)
    try {
      await instantBuyApi.submitPayment(id, formData)
      console.log('[InstantBuy Payment] Payment proof submitted, redirecting to status page')
      router.push(`/instant-buy/status/${id}`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to upload payment proof. Please try again.'
      setSubmitError(msg)
      console.error('[InstantBuy Payment] Upload failed:', msg)
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

  const emoji = COIN_EMOJI[order.coin] ?? '🪙'
  const netLabel = NETWORK_LABELS[order.network] ?? order.network
  const pkrTotal = order.fiatAmount ?? 0
  const rateStr = order.rate ? `PKR ${Math.round(order.rate).toLocaleString()} / ${order.coin}` : '—'
  const shortAddr = order.toAddress ? order.toAddress.slice(0, 8) + '...' + order.toAddress.slice(-4) : '—'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Edit Order</Link>
        <div style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Order #{order.orderRef}</div>
        <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>⏳ Awaiting Payment</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          {/* Order Summary Bar */}
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '32px' }}>{emoji}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>Buying {order.coinAmount.toFixed(6)} {order.coin}</div>
                <div style={{ fontSize: '13px', color: '#3b82f6' }}>{netLabel}</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Total to pay</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>{pkrTotal.toLocaleString()} PKR</div>
            </div>
          </div>

          {/* Important Note */}
          <div style={{ background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c', marginBottom: '8px' }}>⚠️ Important — Read before paying</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                `✅ Pay the exact amount shown — not more, not less`,
                `✅ Your payment account name must match your KYC name`,
                `✅ Include the order reference (${order.orderRef}) in payment note`,
                `❌ Do NOT pay from a third-party account — your name must match`,
                `❌ Do NOT send via Raast — use JazzCash wallet-to-wallet or bank IBAN`,
              ].map((item, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#9a3412' }}>{item}</div>
              ))}
            </div>
          </div>

          {/* Payment Details Box */}
          <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '16px' }}>Payment Details</div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Pay exactly this amount</div>
              <div style={{ fontSize: '40px', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px' }}>{pkrTotal.toLocaleString()} <span style={{ fontSize: '22px' }}>PKR</span></div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Do not round up or down</div>
            </div>
            {[
              ...(payConfig?.jazzcash ? [{ label: '📱 JazzCash', value: payConfig.jazzcash, copyKey: 'jazzcash' }] : []),
              ...(payConfig?.easypaisa ? [{ label: '💚 Easypaisa', value: payConfig.easypaisa, copyKey: 'easypaisa' }] : []),
              { label: '👤 Account Name', value: payConfig?.accountName ?? 'PakSwap (Pvt) Ltd', copyKey: null },
              ...(payConfig?.bankIban ? [{ label: '🏦 Bank IBAN', value: payConfig.bankIban, copyKey: 'iban' }] : []),
              { label: '🔖 Reference / Note', value: order.orderRef, copyKey: 'ref' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{r.label}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {r.value}
                  {r.copyKey && (
                    <button onClick={() => copyText(r.value, r.copyKey!)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: copied === r.copyKey ? '#059669' : '#2563eb', cursor: 'pointer' }}>
                      {copied === r.copyKey ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </span>
              </div>
            ))}
            {(payConfig?.bankName || payConfig?.bankIban) && (
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', paddingTop: '12px', fontSize: '12px', color: '#64748b' }}>
                {payConfig.bankName && <span>🏦 {payConfig.bankName}</span>}
              </div>
            )}
          </div>

          {/* Upload Section */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Upload Payment Screenshot</h3>
          {!fileUploaded ? (
            <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginBottom: '16px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Click to upload or drag &amp; drop</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>JPG, PNG, PDF — max 10MB</p>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>Your JazzCash / Easypaisa / Bank screenshot</p>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }} />
            </label>
          ) : (
            <div style={{ border: '1.5px solid #86efac', background: '#f0fdf4', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📎</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{fileName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Ready for submission</div>
              </div>
              <button onClick={() => { setFileUploaded(false); setFileObj(null); setFileName('') }}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
          )}

          {submitError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>
              ⚠️ {submitError}
            </div>
          )}

          <button
            onClick={handleSubmitPayment}
            disabled={!fileUploaded || submitting}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: fileUploaded && !submitting ? '#2563eb' : '#93c5fd', color: 'white', fontWeight: 700, fontSize: '15px', cursor: fileUploaded && !submitting ? 'pointer' : 'not-allowed', marginBottom: '12px', opacity: fileUploaded && !submitting ? 1 : 0.7 }}
          >
            {submitting ? 'Uploading...' : '✅ Submit Payment Proof'}
          </button>
          <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>
            Cancel Order
          </button>
        </div>

        {/* RIGHT: Timer + Summary */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>Order Expires In</h3>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Quote locked — pay before time runs out</div>
            <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', margin: '8px 0', color: timer < 120 ? '#ef4444' : '#f59e0b' }}>{mm}:{ss}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Order will be cancelled if not paid</div>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Order Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {[
              ['Order ID', order.orderRef, true],
              ['Token', `${emoji} ${order.coin}`, false],
              ['Network', netLabel, false],
              ['You receive', `${order.coinAmount.toFixed(6)} ${order.coin}`, false],
              ['Rate', rateStr, false],
              ['To wallet', shortAddr, true],
            ].map(([label, value, mono]) => (
              <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '8px' }}>
                <span style={{ color: '#64748b', flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', color: label === 'You receive' ? '#059669' : '#1e293b', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total</span>
              <span style={{ color: '#1d4ed8' }}>{pkrTotal.toLocaleString()} PKR</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#64748b', lineHeight: 1.7 }}>
            <strong style={{ color: '#374151' }}>Need help?</strong><br />
            {payConfig?.supportWhatsapp
              ? <>WhatsApp: {payConfig.supportWhatsapp}<br /></>
              : null}
            Available 9AM–11PM PKT
          </div>
        </div>
      </div>
    </div>
  )
}
