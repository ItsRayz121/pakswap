'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { marketplaceApi } from '@/lib/api'

const ASSETS: Record<string, { name: string; sym: string; emoji: string; cat: string[]; networks: string[] }> = {
  USDT: { name: 'Tether USD',    sym: 'USDT', emoji: '💵', cat: ['popular', 'stable'], networks: ['TRC20', 'BEP20', 'ERC20', 'ARB', 'POLY', 'SOL', 'OP'] },
  USDC: { name: 'USD Coin',      sym: 'USDC', emoji: '🔵', cat: ['stable'],             networks: ['BEP20', 'ERC20', 'ARB', 'POLY', 'SOL', 'OP'] },
  BNB:  { name: 'BNB',           sym: 'BNB',  emoji: '🟡', cat: ['popular', 'gas'],    networks: ['BEP20'] },
  ETH:  { name: 'Ethereum',      sym: 'ETH',  emoji: '🔷', cat: ['popular', 'gas'],    networks: ['ERC20', 'BASE', 'ARB', 'POLY', 'OP'] },
  SOL:  { name: 'Solana',        sym: 'SOL',  emoji: '🟣', cat: ['popular', 'gas'],    networks: ['SOL'] },
  BTC:  { name: 'Bitcoin',       sym: 'BTC',  emoji: '🟠', cat: ['popular'],            networks: ['BTC', 'BEP20'] },
  TRX:  { name: 'TRON',          sym: 'TRX',  emoji: '🔴', cat: ['gas'],                networks: ['TRC20'] },
  AVAX: { name: 'Avalanche',     sym: 'AVAX', emoji: '🔺', cat: ['gas'],                networks: ['AVAX'] },
  APT:  { name: 'Aptos',         sym: 'APT',  emoji: '⚡', cat: ['gas'],                networks: ['APTOS'] },
  NEAR: { name: 'NEAR Protocol', sym: 'NEAR', emoji: '🌐', cat: ['gas'],                networks: ['NEAR'] },
  OP:   { name: 'Optimism',      sym: 'OP',   emoji: '🔴', cat: ['gas'],                networks: ['OP'] },
  ARB:  { name: 'Arbitrum',      sym: 'ARB',  emoji: '💙', cat: ['gas'],                networks: ['ARB'] },
  SUI:  { name: 'Sui',           sym: 'SUI',  emoji: '💧', cat: ['gas'],                networks: ['SUI'] },
  RON:  { name: 'Ronin',         sym: 'RON',  emoji: '⚔️', cat: ['gas'],                networks: ['RONIN'] },
  TON:  { name: 'TON',           sym: 'TON',  emoji: '💎', cat: ['popular', 'gas'],    networks: ['TON'] },
}

const NETWORKS: Record<string, { name: string; short: string; conf: number; speed: string; mvp: boolean; warn: string | null }> = {
  TRC20: { name: 'TRON (TRC-20)', short: 'TRC-20', conf: 20, speed: 'fast', mvp: true, warn: null },
  BEP20: { name: 'BSC (BEP-20)', short: 'BEP-20', conf: 15, speed: 'fast', mvp: true, warn: null },
  ERC20: { name: 'Ethereum (ERC-20)', short: 'ERC-20', conf: 12, speed: 'medium', mvp: false, warn: 'erc20' },
  ARB: { name: 'Arbitrum One', short: 'ARB', conf: 10, speed: 'fast', mvp: false, warn: null },
  POLY: { name: 'Polygon (MATIC)', short: 'MATIC', conf: 100, speed: 'fast', mvp: false, warn: null },
  SOL: { name: 'Solana (SPL)', short: 'SOL', conf: 32, speed: 'fast', mvp: true, warn: null },
  OP: { name: 'Optimism', short: 'OP', conf: 10, speed: 'fast', mvp: false, warn: null },
  BASE: { name: 'Base', short: 'BASE', conf: 10, speed: 'fast', mvp: false, warn: null },
  AVAX: { name: 'Avalanche C-Chain', short: 'C-Chain', conf: 12, speed: 'fast', mvp: false, warn: null },
  BTC: { name: 'Bitcoin', short: 'BTC', conf: 3, speed: 'slow', mvp: false, warn: null },
  APTOS: { name: 'Aptos', short: 'APT', conf: 1, speed: 'fast', mvp: false, warn: null },
  NEAR: { name: 'NEAR Protocol', short: 'NEAR', conf: 1, speed: 'fast', mvp: false, warn: null },
  SUI: { name: 'Sui Network', short: 'SUI', conf: 1, speed: 'fast', mvp: false, warn: null },
  TON: { name: 'TON Network', short: 'TON', conf: 1, speed: 'fast', mvp: false, warn: null },
  RONIN: { name: 'Ronin Network', short: 'RON', conf: 5, speed: 'medium', mvp: false, warn: null },
}

function fmtPkr(pkr: number) {
  if (pkr >= 1000000) return 'PKR ' + (pkr / 1000000).toFixed(2) + 'M'
  if (pkr >= 1000) return 'PKR ' + (pkr / 1000).toFixed(1) + 'K'
  return 'PKR ' + pkr.toFixed(2)
}

export default function InstantBuyPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [payWith, setPayWith] = useState('PKR')
  const [cat, setCat] = useState('popular')
  const [token, setToken] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [ratesLoading, setRatesLoading] = useState(false)

  useEffect(() => {
    if (step !== 2) return
    setRatesLoading(true)
    const tokens = Object.keys(ASSETS).filter(sym => sym !== payWith)
    Promise.allSettled(
      tokens.map(sym =>
        marketplaceApi.getRate(sym).then(res => {
          const r = res.data?.data?.rate ?? res.data?.rate ?? res.data?.data
          return { sym, rate: typeof r === 'number' ? r : null }
        })
      )
    ).then(results => {
      const newRates: Record<string, number> = {}
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value.rate !== null) {
          newRates[r.value.sym] = r.value.rate
        }
      })
      setRates(newRates)
    }).finally(() => setRatesLoading(false))
  }, [step, payWith])

  const payOptions = [
    { id: 'PKR', icon: '🇵🇰', name: 'PKR', sub: 'JazzCash / Bank' },
    { id: 'USDT', icon: '💵', name: 'USDT', sub: 'Any network' },
    { id: 'USDC', icon: '🔵', name: 'USDC', sub: 'Any network' },
    { id: 'BNB', icon: '🟡', name: 'BNB', sub: 'BSC / BEP-20' },
    { id: 'ETH', icon: '🔷', name: 'ETH', sub: 'Any EVM chain' },
    { id: 'SOL', icon: '🟣', name: 'SOL', sub: 'Solana' },
  ]

  const filteredTokens = Object.entries(ASSETS).filter(([sym, a]) => {
    if (sym === payWith) return false
    if (cat === 'all') return true
    if (cat === 'popular') return a.cat.includes('popular')
    return a.cat.includes(cat)
  })

  const selAsset = token ? ASSETS[token] : null
  const selNet = network ? NETWORKS[network] : null

  const speedColor = (s: string) => s === 'fast' ? '#059669' : s === 'medium' ? '#f59e0b' : '#ef4444'
  const speedLabel = (s: string) => s === 'fast' ? '⚡ Fast' : s === 'medium' ? '⏱ Medium' : '🐢 Slow'

  const navStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/marketplace" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>P2P Trade</Link>
          <Link href="/instant-buy" style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>Instant Buy</Link>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/kyc" style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', color: '#374151', textDecoration: 'none' }}>My Account</Link>
          <Link href="/marketplace" style={{ padding: '8px 16px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Trade P2P</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8 50%,#2563eb)', padding: '48px 24px 72px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '10px' }}>Buy Crypto Instantly in Pakistan</h1>
        <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '520px', margin: '0 auto 28px' }}>Pay with PKR, USDT, or any supported crypto. 25+ tokens, 15+ networks. Instant delivery to your wallet.</p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['⚡ Auto blockchain verification', '🔐 Two-layer security', '🇵🇰 JazzCash & Easypaisa supported', '💬 24/7 support'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', opacity: 0.9 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Wizard */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', maxWidth: '820px', margin: '-36px auto 32px', overflow: 'hidden' }}>
          {/* Step bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {[{ n: 1, label: 'Pay With' }, { n: 2, label: 'Select Token' }, { n: 3, label: 'Select Network' }].map(s => (
              <div key={s.n} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: step === s.n ? '#1d4ed8' : step > s.n ? '#059669' : '#94a3b8', borderBottom: step === s.n ? '3px solid #2563eb' : '3px solid transparent', background: step === s.n ? 'white' : 'transparent' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, background: step === s.n ? '#2563eb' : step > s.n ? '#059669' : '#e2e8f0', color: step >= s.n ? 'white' : '#64748b' }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                {s.label}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ padding: '28px 32px 24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>How will you pay?</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Choose your payment currency. PKR orders use JazzCash / bank transfer. Crypto orders are verified automatically on-chain.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '10px', marginBottom: '4px' }}>
                {payOptions.map(p => (
                  <div key={p.id} onClick={() => setPayWith(p.id)} style={{ border: `2px solid ${payWith === p.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: '12px', padding: '14px 10px', textAlign: 'center', cursor: 'pointer', background: payWith === p.id ? '#eff6ff' : 'white', boxShadow: payWith === p.id ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none' }}>
                    <div style={{ fontSize: '26px', marginBottom: '6px' }}>{p.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{p.sub}</div>
                  </div>
                ))}
              </div>
              {payWith !== 'PKR' && (
                <div style={{ marginTop: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#166534' }}>
                  ⚡ <strong>Crypto payments are verified automatically on-chain.</strong> No screenshot needed — send crypto to the deposit address and the system confirms it instantly.
                </div>
              )}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>PKR orders: JazzCash, Bank Transfer, Easypaisa</div>
                <button onClick={() => setStep(2)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Select Token →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ padding: '28px 32px 24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Which token do you want to receive?</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Select the crypto asset you want to buy. <span style={{ fontWeight: 600, color: '#1d4ed8' }}>Paying with: {payWith}</span></div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[{ key: 'popular', label: '⭐ Popular' }, { key: 'stable', label: '💵 Stablecoins' }, { key: 'gas', label: '⚡ Gas Tokens' }, { key: 'all', label: '🌐 All Tokens' }].map(c => (
                  <button key={c.key} onClick={() => setCat(c.key)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${cat === c.key ? '#2563eb' : '#e2e8f0'}`, background: cat === c.key ? '#2563eb' : 'white', color: cat === c.key ? 'white' : '#64748b' }}>{c.label}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(152px,1fr))', gap: '10px' }}>
                {filteredTokens.map(([sym, a]) => {
                  const mvpNets = a.networks.filter(n => NETWORKS[n]?.mvp).length
                  return (
                    <div key={sym} onClick={() => { setToken(sym); setNetwork(null); setTimeout(() => setStep(3), 100) }} style={{ border: `2px solid ${token === sym ? '#2563eb' : '#e2e8f0'}`, borderRadius: '14px', padding: '14px', cursor: 'pointer', background: token === sym ? '#eff6ff' : 'white', boxShadow: token === sym ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none', position: 'relative' }}>
                      <div style={{ fontSize: '30px', marginBottom: '8px' }}>{a.emoji}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{a.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{sym}</div>
                      <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '6px', fontWeight: 600 }}>{a.networks.length} network{a.networks.length > 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>
                        {rates[sym] ? fmtPkr(rates[sym]) : ratesLoading ? '...' : '—'}
                      </div>
                      <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', padding: '2px 6px', borderRadius: '20px', background: mvpNets > 0 ? '#d1fae5' : '#f1f5f9', color: mvpNets > 0 ? '#065f46' : '#64748b', fontWeight: 700 }}>{mvpNets > 0 ? 'Live' : 'Soon'}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{token ? `${ASSETS[token].emoji} ${ASSETS[token].name} selected — next: choose network` : 'Select a token to continue'}</div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && selAsset && (
            <div style={{ padding: '28px 32px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <div style={{ fontSize: '36px' }}>{selAsset.emoji}</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{selAsset.name} ({selAsset.sym})</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{fmtPkr(selAsset.price_pkr)} per {selAsset.sym} · Spread: {selAsset.spread}%</div>
                </div>
                <button onClick={() => setStep(2)} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Change Token</button>
              </div>
              <div style={{ background: '#f8fafc', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a5f', marginBottom: '4px' }}>Select the receiving network</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Make sure your wallet supports the selected network. Tokens sent to the wrong network may be lost forever.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '8px', marginTop: '12px' }}>
                  {selAsset.networks.map(netId => {
                    const n = NETWORKS[netId]
                    if (!n) return null
                    return (
                      <div key={netId} onClick={() => setNetwork(netId)} style={{ border: `2px solid ${network === netId ? '#2563eb' : '#e2e8f0'}`, borderRadius: '10px', padding: '11px 12px', cursor: 'pointer', background: network === netId ? '#eff6ff' : 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            {n.short}
                            {n.mvp && <span style={{ fontSize: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '3px', padding: '1px 4px', fontWeight: 700, marginLeft: '4px' }}>Live</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{n.name}</div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: speedColor(n.speed), marginTop: '3px' }}>{speedLabel(n.speed)} · {n.conf} confs</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {network && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#dc2626', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                  <div><strong>Wrong network = permanent loss of funds.</strong> Only send to the exact network you select. PakSwap cannot recover tokens sent to the wrong network.</div>
                </div>
              )}
              {network === 'ERC20' && (
                <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#92400e', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
                  <div><strong>Ethereum ERC-20 has high gas fees.</strong> For small amounts, consider BEP-20 (BSC) or TRC-20 — same token, lower fees, faster confirmation.</div>
                </div>
              )}
              {network && selNet && (
                <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: '14px', padding: '16px 20px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '22px' }}>📊</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>Live Rate Preview</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                      {token && rates[token]
                        ? `1 ${selAsset.sym} = PKR ${rates[token].toLocaleString()}`
                        : 'Rate loading...'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Network</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{selNet.mvp ? '✓ Live' : 'Coming soon'}</div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>← Back</button>
                <Link href={network ? `/instant-buy/order/new?token=${token}&network=${network}&payWith=${payWith}` : '#'}>
                  <button disabled={!network} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: network ? '#2563eb' : '#93c5fd', color: 'white', fontWeight: 700, fontSize: '15px', cursor: network ? 'pointer' : 'not-allowed', opacity: network ? 1 : 0.6 }}>Preview Order →</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Below wizard */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 24px 40px' }}>
        {/* How It Works */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>How Instant Buy Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '20px' }}>
            {[
              { icon: '🪙', n: 1, title: 'Choose Token & Network', sub: 'Select what you want to buy and which blockchain network to receive it on' },
              { icon: '💰', n: 2, title: 'Enter Amount', sub: 'Enter PKR or crypto amount. Live oracle rate locks for 10 minutes' },
              { icon: '📲', n: 3, title: 'Make Payment', sub: 'PKR: send via JazzCash/bank. Crypto: send to deposit address — auto verified on-chain' },
              { icon: '🔐', n: 4, title: 'Verification', sub: 'AI + human two-layer check (PKR) or automatic blockchain confirmation (Crypto)' },
              { icon: '🚀', n: 5, title: 'Receive Crypto', sub: 'Token sent directly to your wallet. Transaction hash provided for tracking' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{s.n}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Networks */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Supported Networks</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { bg: '#fffbeb', border: '#fde68a', color: '#92400e', label: '🟡 BSC / BEP-20', mvp: true },
              { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', label: '🔴 TRON / TRC-20', mvp: true },
              { bg: '#faf5ff', border: '#e9d5ff', color: '#6d28d9', label: '🟣 Solana', mvp: true },
              { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', label: '🔷 Ethereum / ERC-20', mvp: false },
              { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', label: '💙 Arbitrum', mvp: false },
              { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', label: '🔴 Optimism', mvp: false },
              { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', label: '🟢 Polygon', mvp: false },
              { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', label: '🔵 Base', mvp: false },
              { bg: '#fff7ed', border: '#fed7aa', color: '#9a3412', label: '🔺 Avalanche C-Chain', mvp: false },
              { bg: '#f8fafc', border: '#e2e8f0', color: '#475569', label: '⚔️ Ronin', mvp: false },
              { bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1', label: '💧 Sui', mvp: false },
              { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', label: '⚡ Aptos', mvp: false },
              { bg: '#f8fafc', border: '#e2e8f0', color: '#475569', label: '🌐 NEAR Protocol', mvp: false },
            ].map(n => (
              <div key={n.label} style={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: '8px', padding: '7px 12px', fontSize: '13px', fontWeight: 600, color: n.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {n.label}
                {n.mvp && <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} />}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} /> MVP networks — live now. Others rolling out in Phase 2.
          </div>
        </div>

        {/* Provider Banner */}
        <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: '16px', padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#166534' }}>💼 Become a Liquidity Provider</div>
            <div style={{ fontSize: '14px', color: '#15803d', marginTop: '4px' }}>Earn by providing crypto inventory. 0.5% on every fulfilled order. 500+ orders/month for top providers.</div>
          </div>
          <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Apply Now →</button>
        </div>
      </div>
    </div>
  )
}
