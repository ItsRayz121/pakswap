'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { marketplaceApi } from '@/lib/api'

interface PlatformCfg {
  fees: {
    p2pTakerBps: number; p2pMakerBps: number; merchantTakerBps: number
    instantBuySpreadBps: Record<string, number>
  }
  networkFees: Record<string, number>
  kycLimits: Record<string, { dailyPkr: number; monthlyPkr: number }>
  minWithdrawal: Record<string, number>
}

const bpsToPct = (bps: number) => `${(bps / 100).toFixed(bps % 100 === 0 ? 1 : 2)}%`
const fmtPkr = (n: number) => n > 0 ? `${n.toLocaleString()} PKR` : 'Unlimited*'

export default function FeesPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([])
  const [cfg, setCfg] = useState<PlatformCfg | null>(null)
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([])
  useEffect(() => {
    marketplaceApi.getConfig().then(r => setCfg(r.data.data)).catch(() => {})
    marketplaceApi.getCms('fees_faqs').then(r => setFaqs(r.data.data ?? [])).catch(() => {})
  }, [])

  function toggleFaq(i: number) {
    setOpenFaqs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const th: React.CSSProperties = { background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid #e2e8f0' }
  const td: React.CSSProperties = { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontSize: '14px' }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/help" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Help</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>Fees</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/login" style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', color: '#374151' }}>Login</Link>
          <Link href="/register" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Get Started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>PakSwap Fee Schedule</h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>Transparent pricing — no hidden charges. All fees in PKR unless stated.</p>
          <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#065f46', marginTop: '16px', fontWeight: 600 }}>
            ✅ PakSwap does not charge account maintenance, inactivity, or deposit fees. You only pay when you trade or withdraw.
          </div>
        </div>

        {/* P2P Trading Fees */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>🔄 P2P Trading Fees</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Applied per completed trade. Charged from the taker (buyer initiating the trade).</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Role</th><th style={th}>Who</th><th style={th}>Fee</th><th style={th}>Notes</th></tr></thead>
            <tbody>
              <tr>
                <td style={td}><span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Maker</span></td>
                <td style={td}>Ad creator (merchant or regular user posting the ad)</td>
                <td style={{ ...td, fontWeight: 800, color: '#2563eb' }}>0%</td>
                <td style={td}>Makers provide liquidity — always free</td>
              </tr>
              <tr>
                <td style={td}><span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Taker</span></td>
                <td style={td}>User who initiates a trade against an existing ad</td>
                <td style={{ ...td, fontWeight: 800, color: '#059669' }}>{cfg ? bpsToPct(cfg.fees.p2pTakerBps) : '—'}</td>
                <td style={td}>Of the PKR trade value</td>
              </tr>
              <tr>
                <td style={td}><span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Verified Merchant — Maker</span></td>
                <td style={td}>Merchant posting the ad</td>
                <td style={{ ...td, fontWeight: 800, color: '#2563eb' }}>0%</td>
                <td style={td}>Free for all merchants</td>
              </tr>
              <tr>
                <td style={{ ...td, borderBottom: 'none' }}><span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Verified Merchant — Taker</span></td>
                <td style={{ ...td, borderBottom: 'none' }}>Trade initiated against a merchant ad</td>
                <td style={{ ...td, borderBottom: 'none', fontWeight: 800, color: '#059669' }}>{cfg ? bpsToPct(cfg.fees.merchantTakerBps) : '—'}</td>
                <td style={{ ...td, borderBottom: 'none' }}>Reduced rate for high-volume pairs</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Instant Buy */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>⚡ Instant Buy / Sell (OTC) Fees</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Instant Buy uses a fixed spread model — no separate commission line item.</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Coin</th><th style={th}>Buy Spread</th><th style={th}>Sell Spread</th><th style={th}>PKR Payment Processing</th></tr></thead>
            <tbody>
              {(() => {
                const sp = cfg?.fees.instantBuySpreadBps
                const fmt = (k: string) => sp ? bpsToPct(sp[k] ?? 0) : '—'
                return [
                  ['USDT (TRC-20)', fmt('USDT_TRC20'), fmt('USDT_TRC20'), 'Included in spread'],
                  ['USDT (ERC-20)', fmt('USDT_ERC20'), fmt('USDT_ERC20'), 'Higher network cost reflected'],
                  ['BTC', fmt('BTC'), fmt('BTC'), 'Included in spread'],
                  ['ETH', fmt('ETH'), fmt('ETH'), 'Included in spread'],
                  ['USDC', fmt('USDC'), fmt('USDC'), 'Included in spread'],
                ]
              })().map(([coin, buy, sell, note], i, arr) => (
                <tr key={coin}>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}><strong>{coin}</strong></td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', fontWeight: 800, color: '#059669' }}>{buy}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', fontWeight: 800, color: '#059669' }}>{sell}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '14px 24px', background: '#f8fafc', fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
            💡 The spread is included in the quoted price. The price you see is the price you pay — no surprise fees at checkout.
          </div>
        </div>

        {/* Withdrawal Fees */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>📤 Crypto Withdrawal Fees</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Network (blockchain) fees are passed through at cost. PakSwap does not add a markup.</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Coin / Network</th><th style={th}>Network Fee (approx.)</th><th style={th}>PakSwap Fee</th><th style={th}>Min Withdrawal</th></tr></thead>
            <tbody>
              {(() => {
                const nf = cfg?.networkFees ?? {}
                const mw = cfg?.minWithdrawal ?? {}
                const f = (k: string, unit: string) => k in nf ? `~${nf[k]} ${unit}` : '—'
                const m = (k: string, unit: string) => k in mw ? `${mw[k]} ${unit}` : '—'
                return [
                  ['USDT — TRC-20', f('USDT_TRC20', 'USDT'), '0', m('USDT', 'USDT')],
                  ['USDT — ERC-20', f('USDT_ERC20', 'USDT'), '0', m('USDT', 'USDT')],
                  ['BTC — Bitcoin', f('BTC_BTC', 'BTC'), '0', m('BTC', 'BTC')],
                  ['ETH — ERC-20', f('ETH_ERC20', 'ETH'), '0', m('ETH', 'ETH')],
                  ['USDC — ERC-20', f('USDC_ERC20', 'USDC'), '0', m('USDC', 'USDC')],
                ]
              })().map(([coin, fee, ps, min], i, arr) => (
                <tr key={coin}>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}><strong>{coin}</strong></td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}>{fee}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', fontWeight: 800, color: '#2563eb' }}>{ps}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}>{min}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '14px 24px', background: '#fef3c7', fontSize: '13px', color: '#92400e', borderTop: '1px solid #f1f5f9' }}>
            ⚠️ Network fees fluctuate with blockchain congestion. The fee shown at withdrawal time is final and real-time.
          </div>
        </div>

        {/* KYC Limits */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>🛡️ Daily Limits by KYC Tier</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Limits reset at midnight PKT (UTC+5). Cumulative across all P2P and Instant Buy activity.</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>KYC Tier</th><th style={th}>Daily Buy Limit</th><th style={th}>Daily Sell Limit</th><th style={th}>Monthly Cap</th></tr></thead>
            <tbody>
              {(() => {
                const lim = cfg?.kycLimits
                const day = (k: string) => lim?.[k] ? fmtPkr(lim[k].dailyPkr) : '—'
                const mon = (k: string) => lim?.[k] ? fmtPkr(lim[k].monthlyPkr) : '—'
                return [
                  { badge: 'No KYC', bg: '#f1f5f9', color: '#64748b', sub: '', buy: 'View only — no trading', sell: '—', cap: '—', highlight: false },
                  { badge: 'Basic KYC', bg: '#fef3c7', color: '#92400e', sub: 'Phone verified', buy: day('basic'), sell: day('basic'), cap: mon('basic'), highlight: false },
                  { badge: 'Standard KYC', bg: '#dbeafe', color: '#1d4ed8', sub: 'CNIC verified', buy: day('standard'), sell: day('standard'), cap: mon('standard'), highlight: false },
                  { badge: 'Full KYC', bg: '#d1fae5', color: '#065f46', sub: 'CNIC + Selfie + Address', buy: day('full'), sell: day('full'), cap: mon('full'), highlight: false },
                  { badge: 'Verified Merchant', bg: '#fdf4ff', color: '#7c3aed', sub: 'Full KYC + approved', buy: day('merchant'), sell: day('merchant'), cap: mon('merchant'), highlight: true },
                ]
              })().map((row, i, arr) => (
                <tr key={row.badge}>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none' }}>
                    <span style={{ background: row.bg, color: row.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>{row.badge}</span>
                    {row.sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{row.sub}</div>}
                  </td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', fontWeight: row.highlight ? 800 : 400, color: row.highlight ? '#059669' : (row.buy.includes('View') ? '#94a3b8' : '#1e293b') }}>{row.buy}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', fontWeight: row.highlight ? 800 : 400, color: row.highlight ? '#059669' : (row.sell === '—' ? '#94a3b8' : '#1e293b') }}>{row.sell}</td>
                  <td style={{ ...td, borderBottom: i < arr.length - 1 ? td.borderBottom : 'none', color: row.cap === '—' ? '#94a3b8' : '#1e293b' }}>{row.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '14px 24px', background: '#f8fafc', fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
            *Merchant monthly cap subject to compliance review for volumes above 50M PKR/month.
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => toggleFaq(i)} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', marginBottom: '8px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '14px' }}>
                {faq.q}
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: openFaqs.includes(i) ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
              {openFaqs.includes(i) && <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px', lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ marginTop: '32px', padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '32px' }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Have a question about fees?</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>Our support team is available 9am – 9pm PKT, 7 days a week.</div>
            <Link href="/help" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Visit Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
