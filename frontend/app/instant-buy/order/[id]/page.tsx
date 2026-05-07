'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

const ASSETS: Record<string, { name: string; sym: string; emoji: string; price_pkr: number; price_usd: number; spread: number }> = {
  USDT: { name: 'Tether USD',      sym: 'USDT', emoji: '💵', price_pkr: 280.5,     price_usd: 1,      spread: 0.5 },
  USDC: { name: 'USD Coin',        sym: 'USDC', emoji: '🔵', price_pkr: 280.2,     price_usd: 1,      spread: 0.5 },
  BNB:  { name: 'BNB',             sym: 'BNB',  emoji: '🟡', price_pkr: 168000,    price_usd: 598,    spread: 2.5 },
  ETH:  { name: 'Ethereum',        sym: 'ETH',  emoji: '🔷', price_pkr: 885000,    price_usd: 3150,   spread: 2.0 },
  SOL:  { name: 'Solana',          sym: 'SOL',  emoji: '🟣', price_pkr: 41850,     price_usd: 149,    spread: 2.5 },
  BTC:  { name: 'Bitcoin',         sym: 'BTC',  emoji: '🟠', price_pkr: 26600000,  price_usd: 94800,  spread: 1.5 },
  TRX:  { name: 'TRON',            sym: 'TRX',  emoji: '🔴', price_pkr: 76,        price_usd: 0.27,   spread: 2.5 },
  AVAX: { name: 'Avalanche',       sym: 'AVAX', emoji: '🔺', price_pkr: 10700,     price_usd: 38,     spread: 3.0 },
  APT:  { name: 'Aptos',           sym: 'APT',  emoji: '⚡', price_pkr: 2670,      price_usd: 9.5,    spread: 3.5 },
  NEAR: { name: 'NEAR Protocol',   sym: 'NEAR', emoji: '🌐', price_pkr: 2020,      price_usd: 7.2,    spread: 3.5 },
  OP:   { name: 'Optimism',        sym: 'OP',   emoji: '🔴', price_pkr: 590,       price_usd: 2.1,    spread: 3.5 },
  ARB:  { name: 'Arbitrum',        sym: 'ARB',  emoji: '💙', price_pkr: 310,       price_usd: 1.1,    spread: 3.5 },
  SUI:  { name: 'Sui',             sym: 'SUI',  emoji: '💧', price_pkr: 1065,      price_usd: 3.8,    spread: 3.5 },
  RON:  { name: 'Ronin',           sym: 'RON',  emoji: '⚔️', price_pkr: 898,       price_usd: 3.2,    spread: 3.5 },
  TON:  { name: 'TON',             sym: 'TON',  emoji: '💎', price_pkr: 1630,      price_usd: 5.8,    spread: 3.0 },
}

const NETWORKS: Record<string, { name: string; short: string; conf: number; addrRegex: RegExp; addrHint: string; addrExample: string }> = {
  TRC20:  { name: 'TRON (TRC-20)',      short: 'TRC-20',   conf: 20,  addrRegex: /^T[A-Za-z1-9]{33}$/,                          addrHint: 'TRON address — starts with T, 34 chars',         addrExample: 'TEJmxFDfWCPnRbXZovbWzRLVCZTF5y6aLq' },
  BEP20:  { name: 'BSC (BEP-20)',       short: 'BEP-20',   conf: 15,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'BSC/EVM address — 0x... 42 chars',               addrExample: '0xAbCd1234...EF90' },
  ERC20:  { name: 'Ethereum (ERC-20)',  short: 'ERC-20',   conf: 12,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Ethereum address — 0x... 42 chars',              addrExample: '0xAbCd1234...EF90' },
  SOL:    { name: 'Solana (SPL)',        short: 'SOL',      conf: 32,  addrRegex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,               addrHint: 'Solana address — Base58, 32–44 chars',           addrExample: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV' },
  ARB:    { name: 'Arbitrum One',        short: 'ARB',      conf: 10,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Arbitrum address — 0x... 42 chars',              addrExample: '0xAbCd1234...EF90' },
  POLY:   { name: 'Polygon (MATIC)',     short: 'MATIC',    conf: 100, addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Polygon address — 0x... 42 chars',               addrExample: '0xAbCd1234...EF90' },
  OP:     { name: 'Optimism',            short: 'OP',       conf: 10,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Optimism address — 0x... 42 chars',              addrExample: '0xAbCd1234...EF90' },
  BASE:   { name: 'Base',                short: 'BASE',     conf: 10,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Base address — 0x... 42 chars',                  addrExample: '0xAbCd1234...EF90' },
  AVAX:   { name: 'Avalanche C-Chain',   short: 'C-Chain',  conf: 12,  addrRegex: /^0x[0-9a-fA-F]{40}$/,                         addrHint: 'Avalanche address — 0x... 42 chars',             addrExample: '0xAbCd1234...EF90' },
  BTC:    { name: 'Bitcoin',             short: 'BTC',      conf: 3,   addrRegex: /^(1|3|bc1)[A-HJ-NP-Za-km-z0-9]{25,62}$/,     addrHint: 'Bitcoin address — starts with 1, 3, or bc1',    addrExample: 'bc1qxy2kgdygjrsqtzq2n0yrf...' },
  APTOS:  { name: 'Aptos',               short: 'APT',      conf: 1,   addrRegex: /^0x[0-9a-fA-F]{64}$/,                         addrHint: 'Aptos address — 0x... 66 chars',                 addrExample: '0x1a2b3c...64hexchars' },
  NEAR:   { name: 'NEAR Protocol',       short: 'NEAR',     conf: 1,   addrRegex: /^[a-zA-Z0-9_.-]{2,64}(\.near)?$/,             addrHint: 'NEAR address — e.g. yourname.near',              addrExample: 'yourname.near' },
  SUI:    { name: 'Sui Network',         short: 'SUI',      conf: 1,   addrRegex: /^0x[0-9a-fA-F]{64}$/,                         addrHint: 'Sui address — 0x... 66 chars',                   addrExample: '0x1a2b3c...64hexchars' },
  TON:    { name: 'TON Network',         short: 'TON',      conf: 1,   addrRegex: /^(EQ|UQ)[A-Za-z0-9_-]{46}$/,                  addrHint: 'TON address — starts with EQ or UQ, 48 chars',   addrExample: 'EQAbCdEf...46chars' },
  RONIN:  { name: 'Ronin Network',       short: 'RON',      conf: 5,   addrRegex: /^(0x|ronin:)[0-9a-fA-F]{40}$/,                addrHint: 'Ronin address — ronin:... or 0x... 40 hex chars', addrExample: 'ronin:AbCd1234...EF90' },
}

const PAY_LABELS: Record<string, string> = {
  PKR: 'PKR — JazzCash / Bank Transfer',
  USDT: 'USDT (Crypto)',
  USDC: 'USDC (Crypto)',
  BNB: 'BNB (Crypto)',
  ETH: 'ETH (Crypto)',
  SOL: 'SOL (Crypto)',
}

function OrderForm() {
  const params = useSearchParams()
  const router = useRouter()

  const tokenSym = params.get('token') ?? ''
  const networkId = params.get('network') ?? ''
  const payWith = params.get('payWith') ?? 'PKR'

  const asset = ASSETS[tokenSym]
  const network = NETWORKS[networkId]
  const isPkr = payWith === 'PKR'

  const initPkr = '10000'
  const initCoin = asset ? (parseFloat(initPkr) / asset.price_pkr).toFixed(6) : '1'

  const [pkrAmt, setPkrAmt] = useState(initPkr)
  const [coinAmt, setCoinAmt] = useState(isPkr ? initCoin : '1')
  const [addr, setAddr] = useState('')
  const [addrValid, setAddrValid] = useState<boolean | null>(null)
  const [checked, setChecked] = useState(false)
  const [timer, setTimer] = useState(598)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [])

  // Debug log on mount — helps trace any stale-param issue
  useEffect(() => {
    console.log('[InstantBuy] Order page params:', { tokenSym, networkId, payWith })
  }, [tokenSym, networkId, payWith])

  const mm = Math.floor(timer / 60).toString().padStart(2, '0')
  const ss = (timer % 60).toString().padStart(2, '0')

  function onPkrChange(v: string) {
    setPkrAmt(v)
    if (asset && v) setCoinAmt((parseFloat(v) / asset.price_pkr).toFixed(6))
    else setCoinAmt('')
  }

  function onCoinChange(v: string) {
    setCoinAmt(v)
    if (asset && v) setPkrAmt(String(Math.round(parseFloat(v) * asset.price_pkr)))
    else setPkrAmt('')
  }

  function validateAddr(v: string) {
    setAddr(v)
    if (!v) { setAddrValid(null); return }
    setAddrValid(network ? network.addrRegex.test(v.trim()) : v.length > 10)
  }

  async function handleConfirm() {
    if (!asset || !network || !addr || !addrValid || !checked) return

    const amount = isPkr ? parseFloat(pkrAmt) : parseFloat(coinAmt)
    if (!amount || amount <= 0) { setError('Enter a valid amount'); return }

    const payload = {
      coin: tokenSym,
      network: networkId,
      paymentMode: isPkr ? 'pkr' : 'crypto',
      amount,
      toAddress: addr.trim(),
    }

    console.log('[InstantBuy] Creating order with payload:', payload)

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/instant-buy/orders', payload)
      const order = res.data.data
      console.log('[InstantBuy] Order created — id:', order.id, '| ref:', order.orderRef, '| paymentMode:', order.paymentMode)
      if (isPkr) {
        router.push(`/instant-buy/payment/${order.id}`)
      } else {
        router.push(`/instant-buy/crypto-deposit/${order.id}`)
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to create order. Please try again.'
      setError(msg)
      console.error('[InstantBuy] Order creation failed:', msg, e?.response?.data)
    } finally {
      setLoading(false)
    }
  }

  if (!asset || !network) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Invalid selection</div>
        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          Token "{tokenSym}" or network "{networkId}" is not recognised. Please go back and select again.
        </div>
        <Link href="/instant-buy" style={{ padding: '10px 20px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Instant Buy
        </Link>
      </div>
    )
  }

  const effectiveRate = isPkr ? asset.price_pkr * (1 + asset.spread / 100) : asset.price_usd
  const spreadPkr = Math.round(asset.price_pkr * asset.spread / 100)
  const canSubmit = !!addr && addrValid === true && checked && !loading

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/instant-buy" style={{ fontWeight: 500, fontSize: '16px', color: '#64748b', textDecoration: 'none' }}>← Back to Instant Buy</Link>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
          {asset.emoji} {asset.name} · {network.short}
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', alignItems: 'start' }}>

        {/* LEFT — info panels */}
        <div>
          {/* Token + network header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ fontSize: '40px' }}>{asset.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{asset.name} <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>{asset.sym}</span></div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Network: <strong>{network.name}</strong> · {network.conf} confirmations required
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Market price</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                {isPkr ? `PKR ${asset.price_pkr.toLocaleString()}` : `$${asset.price_usd.toLocaleString()} USDT`}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Spread: {asset.spread}%</div>
            </div>
          </div>

          {/* Order confirmation summary */}
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a5f', marginBottom: '14px' }}>📋 You are buying</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                ['Token', `${asset.emoji} ${asset.name} (${asset.sym})`],
                ['Network', network.name],
                ['Paying with', PAY_LABELS[payWith] ?? payWith],
                ['Amount', isPkr ? `PKR ${pkrAmt} → ${coinAmt} ${tokenSym}` : `${coinAmt} ${tokenSym}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Network & wallet info */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>🌐 Wallet Address Requirements</h4>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: '#1d4ed8', marginBottom: '10px' }}>
              {network.name}
            </div>
            <div style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', lineHeight: 1.6 }}>
              {network.addrHint}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
              Example: {network.addrExample}
            </div>
          </div>

          {/* How it works */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>📋 What Happens After You Order</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isPkr ? [
                { n: 1, title: 'Send payment + upload proof', sub: 'Pay via JazzCash, Easypaisa, or bank. Screenshot required.' },
                { n: 2, title: 'AI + admin two-layer verification', sub: 'Both layers must pass before tokens are released.' },
                { n: 3, title: `${asset.sym} arrives in your wallet`, sub: `Sent to your ${network.short} wallet address. TX hash provided.` },
              ] : [
                { n: 1, title: `Send ${payWith} to deposit address`, sub: 'Exact amount required. Blockchain auto-monitors your payment.' },
                { n: 2, title: 'Blockchain confirmations', sub: `${network.conf} confirmations on ${network.name}.` },
                { n: 3, title: `${asset.sym} released to your wallet`, sub: 'Automatic on confirmation + admin approval.' },
              ]}.map(s => (
                <div key={s.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#2563eb', flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — order form */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Create Order</h3>

          {/* Amount input */}
          {isPkr ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#eff6ff', border: '2px solid #2563eb', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>You Pay</div>
                <input type="number" value={pkrAmt} onChange={e => onPkrChange(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>PKR</div>
              </div>
              <div style={{ fontSize: '18px', textAlign: 'center' }}>⇄</div>
              <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>You Receive</div>
                <input type="number" value={coinAmt} onChange={e => onCoinChange(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{tokenSym}</div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Amount to Buy ({tokenSym})</div>
              <input type="number" value={coinAmt} onChange={e => setCoinAmt(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Pay with: {payWith}</div>
            </div>
          )}

          {/* Rate breakdown */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            {(isPkr ? [
              [`Market rate`, `1 ${tokenSym} = PKR ${asset.price_pkr.toLocaleString()}`],
              [`Spread (${asset.spread}%)`, `+ PKR ${spreadPkr.toLocaleString()}`],
              [`Your rate`, `1 ${tokenSym} = PKR ${Math.round(effectiveRate).toLocaleString()}`],
            ] : [
              [`Market price`, `1 ${tokenSym} = $${asset.price_usd.toLocaleString()} USDT`],
              [`Spread`, `${asset.spread}%`],
            ]).map(([l, v], i, arr) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderTop: i === arr.length - 1 && isPkr ? '1px solid #e2e8f0' : 'none', marginTop: i === arr.length - 1 && isPkr ? '6px' : 0, paddingTop: i === arr.length - 1 && isPkr ? '10px' : '5px', fontWeight: i === arr.length - 1 ? 700 : 400 }}>
                <span style={{ color: i === arr.length - 1 ? '#1e293b' : '#64748b' }}>{l}</span>
                <span style={{ fontWeight: 600, color: i === arr.length - 1 ? '#2563eb' : '#1e293b' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Quote timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef3c7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '16px' }}>
            ⏱️ Quote valid for: <span style={{ fontSize: '16px', color: timer < 60 ? '#ef4444' : '#92400e' }}>{mm}:{ss}</span>
          </div>

          {/* Wallet address */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Your {network.short} Wallet Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ fontSize: '12px', color: '#166534', marginBottom: '8px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '8px 10px' }}>
              🟢 <strong>{network.short} format:</strong> {network.addrHint}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={addr}
                onChange={e => validateAddr(e.target.value)}
                placeholder={`Enter your ${network.short} wallet address`}
                style={{ width: '100%', padding: '10px 44px 10px 12px', border: `1.5px solid ${addrValid === false ? '#fca5a5' : addrValid === true ? '#86efac' : '#d1d5db'}`, borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>
                {addr.length === 0 ? '·' : addrValid ? '✅' : '❌'}
              </span>
            </div>
            {addr.length > 5 && addrValid === false && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#dc2626', marginTop: '8px' }}>
                ⚠️ Invalid {network.short} address format. {network.addrHint}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#dc2626', margin: '12px 0' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#dc2626', margin: '12px 0 16px' }}>
            ⚠️ <strong>Wrong address = permanent loss of funds.</strong> PakSwap cannot recover tokens sent to wrong addresses.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <input type="checkbox" id="cc" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} />
            <label htmlFor="cc" style={{ fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
              I have verified my {network.short} wallet address and understand it cannot be changed after confirmation
            </label>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!canSubmit}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: canSubmit ? '#2563eb' : '#93c5fd', color: 'white', fontWeight: 700, fontSize: '15px', cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.7 }}
          >
            {loading ? 'Creating Order...' : `Confirm & Proceed to ${isPkr ? 'Payment' : 'Deposit'} →`}
          </button>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>By continuing you agree to our Terms of Service</div>
        </div>
      </div>
    </div>
  )
}

export default function InstantBuyOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', fontFamily: 'system-ui' }}>Loading order details...</div>}>
      <OrderForm />
    </Suspense>
  )
}
