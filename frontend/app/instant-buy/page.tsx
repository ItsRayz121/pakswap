'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PAY_OPTIONS = [
  { id: 'PKR', icon: '🇵🇰', name: 'PKR', sub: 'JazzCash / Bank' },
  { id: 'USDT', icon: '💵', name: 'USDT', sub: 'Any network' },
  { id: 'USDC', icon: '🔵', name: 'USDC', sub: 'Any network' },
  { id: 'BNB', icon: '🟡', name: 'BNB', sub: 'BSC / BEP-20' },
  { id: 'ETH', icon: '🔷', name: 'ETH', sub: 'Any EVM chain' },
  { id: 'SOL', icon: '🟣', name: 'SOL', sub: 'Solana' },
]

const TOKENS = [
  { id: 'USDT', name: 'Tether USD', emoji: '💵', cat: ['popular', 'stable'], pricePkr: 280.5, priceUsd: 1, networks: ['TRC-20', 'BEP-20', 'ERC-20', 'ARB', 'SOL'] },
  { id: 'USDC', name: 'USD Coin', emoji: '🔵', cat: ['stable'], pricePkr: 280.2, priceUsd: 1, networks: ['BEP-20', 'ERC-20', 'SOL'] },
  { id: 'BNB', name: 'BNB', emoji: '🟡', cat: ['popular', 'gas'], pricePkr: 168000, priceUsd: 598, networks: ['BEP-20'] },
  { id: 'ETH', name: 'Ethereum', emoji: '🔷', cat: ['popular', 'gas'], pricePkr: 885000, priceUsd: 3150, networks: ['ERC-20', 'ARB', 'BASE'] },
  { id: 'SOL', name: 'Solana', emoji: '🟣', cat: ['popular', 'gas'], pricePkr: 41850, priceUsd: 149, networks: ['SOL'] },
  { id: 'BTC', name: 'Bitcoin', emoji: '🟠', cat: ['popular'], pricePkr: 26600000, priceUsd: 94800, networks: ['BTC', 'BEP-20'] },
  { id: 'TRX', name: 'TRON', emoji: '🔴', cat: ['gas'], pricePkr: 76, priceUsd: 0.27, networks: ['TRC-20'] },
  { id: 'TON', name: 'TON', emoji: '💎', cat: ['popular', 'gas'], pricePkr: 1630, priceUsd: 5.8, networks: ['TON'] },
  { id: 'AVAX', name: 'Avalanche', emoji: '🔺', cat: ['gas'], pricePkr: 10700, priceUsd: 38, networks: ['AVAX'] },
  { id: 'ARB', name: 'Arbitrum', emoji: '💙', cat: ['gas'], pricePkr: 310, priceUsd: 1.1, networks: ['ARB'] },
  { id: 'OP', name: 'Optimism', emoji: '🔴', cat: ['gas'], pricePkr: 590, priceUsd: 2.1, networks: ['OP'] },
  { id: 'SUI', name: 'Sui', emoji: '💧', cat: ['gas'], pricePkr: 1065, priceUsd: 3.8, networks: ['SUI'] },
]

const NETWORK_INFO: Record<string, { speed: string; speedColor: string; fee: string; confirm: string }> = {
  'TRC-20': { speed: '⚡ Fast', speedColor: '#059669', fee: '1 USDT', confirm: '~1 min' },
  'BEP-20': { speed: '⚡ Fast', speedColor: '#059669', fee: '0.5 USDT', confirm: '~3 min' },
  'ERC-20': { speed: '🐌 Slow', speedColor: '#ef4444', fee: '5–15 USDT', confirm: '~5 min' },
  'ARB': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.1 USDT', confirm: '~1 min' },
  'SOL': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.01 USDT', confirm: '< 30s' },
  'BASE': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.1 USDT', confirm: '~2 min' },
  'BTC': { speed: '🐢 Slow', speedColor: '#f59e0b', fee: 'Variable', confirm: '~10 min' },
  'TON': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.01 USDT', confirm: '< 30s' },
  'AVAX': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.1 USDT', confirm: '~2 min' },
  'ARB': { speed: '⚡ Fast', speedColor: '#059669', fee: '< 0.1 USDT', confirm: '~1 min' },
}

const CATS = ['popular', 'stable', 'gas', 'all']
const CAT_LABELS: Record<string, string> = { popular: '⭐ Popular', stable: '💵 Stablecoins', gas: '⚡ Gas Tokens', all: '🌐 All Tokens' }

export default function InstantBuyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [payWith, setPayWith] = useState('PKR')
  const [cat, setCat] = useState('popular')
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [selectedNet, setSelectedNet] = useState<string | null>(null)

  const token = TOKENS.find(t => t.id === selectedToken)

  const filteredTokens = cat === 'all' ? TOKENS : TOKENS.filter(t => t.cat.includes(cat))

  const goStep = (n: number) => {
    if (n === 3 && !selectedToken) return
    setStep(n)
    if (n !== 3) setSelectedNet(null)
  }

  const handleTokenSelect = (id: string) => {
    setSelectedToken(id)
    setSelectedNet(null)
    setStep(3)
  }

  const proceed = () => {
    if (!selectedToken || !selectedNet) return
    router.push('/instant-buy/order/new')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/trade" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>P2P Trade</Link>
          <Link href="/instant-buy" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Instant Buy</Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/kyc"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>My Account</button></Link>
          <Link href="/trade"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Trade P2P</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb)', padding: '48px 24px 72px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, position: 'relative' }}>Buy Crypto Instantly in Pakistan</h1>
        <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 520, margin: '0 auto 28px', position: 'relative' }}>Pay with PKR, USDT, or any supported crypto. 25+ tokens, 15+ networks. Instant delivery to your wallet.</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['⚡ Auto blockchain verification', '🔐 Two-layer security', '🇵🇰 JazzCash & Easypaisa supported', '💬 24/7 support'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, opacity: 0.9 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Wizard */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', maxWidth: 820, margin: '-36px auto 32px', position: 'relative', overflow: 'hidden' }}>
          {/* Step bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {[{ n: 1, label: 'Pay With' }, { n: 2, label: 'Select Token' }, { n: 3, label: 'Select Network' }].map(s => (
              <div key={s.n} onClick={() => goStep(s.n)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: step === s.n ? '#1d4ed8' : step > s.n ? '#059669' : '#94a3b8', borderBottom: `3px solid ${step === s.n ? '#2563eb' : 'transparent'}`, background: step === s.n ? 'white' : 'transparent' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: step > s.n ? '#059669' : step === s.n ? '#2563eb' : '#e2e8f0', color: step >= s.n ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{step > s.n ? '✓' : s.n}</div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ padding: '28px 32px 0' }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>How will you pay?</div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Choose your payment currency. PKR orders use JazzCash / bank transfer. Crypto orders are verified automatically on-chain.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
                {PAY_OPTIONS.map(p => (
                  <div key={p.id} onClick={() => setPayWith(p.id)} style={{ border: `2px solid ${payWith === p.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', background: payWith === p.id ? '#eff6ff' : 'white', boxShadow: payWith === p.id ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{p.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{p.sub}</div>
                  </div>
                ))}
              </div>
              {payWith !== 'PKR' && (
                <div style={{ marginTop: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#166534' }}>
                  ⚡ <strong>Crypto payments are verified automatically on-chain.</strong> No screenshot needed — send crypto to the deposit address and the system confirms it instantly.
                </div>
              )}
              <div style={{ padding: '16px 0', borderTop: '1px solid #f1f5f9', marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>PKR orders: JazzCash, Bank Transfer, Easypaisa</div>
                <button onClick={() => goStep(2)} style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Select Token →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ padding: '28px 32px 0' }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Which token do you want to receive?</div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Select the crypto asset you want to buy. <span style={{ fontWeight: 600, color: '#1d4ed8' }}>Paying with {payWith}</span></div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {CATS.map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${cat === c ? '#2563eb' : '#e2e8f0'}`, background: cat === c ? '#2563eb' : 'white', color: cat === c ? 'white' : '#64748b' }}>{CAT_LABELS[c]}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(152px,1fr))', gap: 10 }}>
                {filteredTokens.map(t => (
                  <div key={t.id} onClick={() => handleTokenSelect(t.id)} style={{ border: `2px solid ${selectedToken === t.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: 14, padding: 14, cursor: 'pointer', background: selectedToken === t.id ? '#eff6ff' : 'white', boxShadow: selectedToken === t.id ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none', transition: 'all 0.15s', position: 'relative' }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{t.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{t.id}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#2563eb', marginTop: 6, fontWeight: 600 }}>{t.networks.length} networks</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 8 }}>
                      {t.priceUsd >= 1000 ? `$${(t.priceUsd / 1000).toFixed(0)}k` : `$${t.priceUsd.toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 0', borderTop: '1px solid #f1f5f9', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => goStep(1)} style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back</button>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selectedToken ? `${selectedToken} selected` : 'Select a token to continue'}</div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && token && (
            <div style={{ padding: '28px 32px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 36 }}>{token.emoji}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{token.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>${token.priceUsd.toLocaleString()} · {token.pricePkr.toLocaleString()} PKR</div>
                </div>
                <button onClick={() => goStep(2)} style={{ marginLeft: 'auto', padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white' }}>Change Token</button>
              </div>

              <div style={{ background: '#f8fafc', border: '1.5px solid #bfdbfe', borderRadius: 16, padding: 20, marginTop: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 }}>Select the receiving network</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Make sure your wallet supports the selected network. Tokens sent to the wrong network may be lost forever.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8 }}>
                  {token.networks.map(n => {
                    const info = NETWORK_INFO[n] || { speed: '⚡ Fast', speedColor: '#059669', fee: 'Variable', confirm: '~5 min' }
                    return (
                      <div key={n} onClick={() => setSelectedNet(n)} style={{ border: `2px solid ${selectedNet === n ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, padding: '11px 12px', cursor: 'pointer', background: selectedNet === n ? '#eff6ff' : 'white', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{n}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{info.confirm}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: info.speedColor }}>{info.speed}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedNet === 'ERC-20' && (
                <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#92400e', display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                  <div><strong>Ethereum ERC-20 has high gas fees.</strong> For small amounts, consider BEP-20 (BSC) or TRC-20 — same token, lower fees, faster confirmation.</div>
                </div>
              )}

              {selectedNet && (
                <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: 14, padding: '16px 20px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 22 }}>📊</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#166534', fontWeight: 700 }}>Live Rate Preview</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginTop: 2 }}>1 {token.id} = {token.pricePkr.toLocaleString()} PKR</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Platform fee</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>0.5% + network fee</div>
                  </div>
                </div>
              )}

              <div style={{ padding: '16px 0', borderTop: '1px solid #f1f5f9', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => goStep(2)} style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back</button>
                <button onClick={proceed} disabled={!selectedNet} style={{ padding: '12px 28px', background: selectedNet ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: selectedNet ? 'pointer' : 'not-allowed', opacity: selectedNet ? 1 : 0.6 }}>Preview Order →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Below wizard */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 40px' }}>
        {/* How it works */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>How Instant Buy Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 20 }}>
            {[['🪙', '1', 'Choose Token & Network', 'Select what to buy and which blockchain to receive it on'], ['💰', '2', 'Enter Amount', 'Enter PKR or crypto amount. Live oracle rate locks for 10 minutes'], ['📲', '3', 'Make Payment', 'PKR: send via JazzCash/bank. Crypto: auto verified on-chain'], ['🔐', '4', 'Verification', 'AI + human two-layer check (PKR) or automatic blockchain confirmation'], ['🚀', '5', 'Receive Crypto', 'Token sent directly to your wallet with transaction hash']].map(([icon, num, title, sub]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Networks */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Supported Networks</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[['🟡 BSC / BEP-20', '#fffbeb', '#fde68a', '#92400e'], ['🔴 TRON / TRC-20', '#fef2f2', '#fca5a5', '#991b1b'], ['🟣 Solana', '#faf5ff', '#e9d5ff', '#6d28d9'], ['🔷 Ethereum / ERC-20', '#eff6ff', '#bfdbfe', '#1d4ed8'], ['💙 Arbitrum', '#eff6ff', '#bfdbfe', '#1d4ed8'], ['🔴 Optimism', '#fef2f2', '#fca5a5', '#991b1b'], ['🟢 Polygon', '#f0fdf4', '#bbf7d0', '#166534'], ['🔵 Base', '#eff6ff', '#bfdbfe', '#1d4ed8'], ['🔺 Avalanche', '#fff7ed', '#fed7aa', '#9a3412'], ['💎 TON', '#f0f9ff', '#bae6fd', '#0369a1'], ['💧 Sui', '#f0f9ff', '#bae6fd', '#0369a1']].map(([label, bg, border, color]) => (
              <div key={label as string} style={{ background: bg as string, border: `1px solid ${border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontWeight: 600, color: color as string }}>{label}</div>
            ))}
          </div>
        </div>

        {/* Provider Banner */}
        <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: 16, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#166534' }}>💼 Become a Liquidity Provider</div>
            <div style={{ fontSize: 14, color: '#15803d', marginTop: 4 }}>Earn by providing crypto inventory. 0.5% on every fulfilled order. 500+ orders/month for top providers.</div>
          </div>
          <Link href="/provider-apply"><button style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Apply Now →</button></Link>
        </div>
      </div>
    </div>
  )
}
