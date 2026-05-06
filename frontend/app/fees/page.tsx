'use client'
import { useState } from 'react'
import Link from 'next/link'

const faqItems = [
  ['When exactly is the P2P taker fee deducted?', 'The 0.5% taker fee is deducted from the crypto amount at the moment the trade is marked complete and USDT is released from escrow. You will see the exact fee amount on the trade receipt before you confirm the trade.'],
  ['Can I see the fee before I submit a trade?', 'Yes. The order confirmation screen always displays the fee breakdown: trade amount, fee amount, and the net crypto you receive — before you commit.'],
  ['Is there a fee for depositing crypto into PakSwap?', 'No. Crypto deposits are always free on the PakSwap side. You only pay the blockchain network fee charged by miners/validators to send from your external wallet.'],
  ['Are Instant Buy fees negotiable for high-volume buyers?', 'Merchant accounts trading above 20M PKR/month may apply for custom spread rates through our merchant support team. Contact us via the merchant dashboard.'],
  ['What happens to fees on a cancelled or disputed trade?', "No fee is charged on cancelled trades. If a dispute is resolved in the buyer's favour, any deducted fee is refunded. If resolved in the seller's favour, the fee is not refunded."],
]

const Table = ({ headers, rows, note, noteBg = '#f8fafc', noteColor = '#64748b' }: any) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {headers.map((h: string) => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid #e2e8f0' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: any[], i: number) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '14px 16px', color: '#1e293b' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {note && <div style={{ padding: '14px 24px', background: noteBg, fontSize: 13, color: noteColor, borderTop: '1px solid #f1f5f9' }}>{note}</div>}
  </div>
)

const Badge = ({ children, bg, color }: any) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: bg, color }}>{children}</span>
)

export default function FeesPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/help" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Help</Link>
          <Link href="/fees" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Fees</Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Login</button></Link>
          <Link href="/register"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Get Started</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>PakSwap Fee Schedule</h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>Transparent pricing — no hidden charges. All fees in PKR unless stated.</p>
          <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#065f46', marginTop: 16, fontWeight: 600 }}>
            ✅ PakSwap does not charge account maintenance, inactivity, or deposit fees. You only pay when you trade or withdraw.
          </div>
        </div>

        {/* P2P Trading */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🔄 P2P Trading Fees</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Applied per completed trade. Charged from the taker (buyer initiating the trade).</div>
          </div>
          <Table
            headers={['Role', 'Who', 'Fee', 'Notes']}
            rows={[
              [<Badge bg="#d1fae5" color="#065f46">Maker</Badge>, 'Ad creator (merchant or regular user posting the ad)', <span style={{ fontWeight: 800, color: '#2563eb' }}>0%</span>, 'Makers provide liquidity — always free'],
              [<Badge bg="#eff6ff" color="#1d4ed8">Taker</Badge>, 'User who initiates a trade against an existing ad', <span style={{ fontWeight: 800, color: '#059669' }}>0.5%</span>, 'Of the PKR trade value'],
              [<Badge bg="#fef3c7" color="#92400e">Verified Merchant — Maker</Badge>, 'Merchant posting the ad', <span style={{ fontWeight: 800, color: '#2563eb' }}>0%</span>, 'Free for all merchants'],
              [<Badge bg="#fef3c7" color="#92400e">Verified Merchant — Taker</Badge>, 'Trade initiated against a merchant ad', <span style={{ fontWeight: 800, color: '#059669' }}>0.3%</span>, 'Reduced rate for high-volume pairs'],
            ]}
          />
        </div>

        {/* Instant Buy */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>⚡ Instant Buy / Sell (OTC) Fees</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Instant Buy uses a fixed spread model — no separate commission line item.</div>
          </div>
          <Table
            headers={['Coin', 'Buy Spread', 'Sell Spread', 'PKR Payment Processing']}
            rows={[
              ['USDT (TRC-20)', <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, 'Included in spread'],
              ['USDT (ERC-20)', <span style={{ fontWeight: 800, color: '#059669' }}>1.8%</span>, <span style={{ fontWeight: 800, color: '#059669' }}>1.8%</span>, 'Higher network cost reflected'],
              ['BTC', <span style={{ fontWeight: 800, color: '#059669' }}>1.2%</span>, <span style={{ fontWeight: 800, color: '#059669' }}>1.2%</span>, 'Included in spread'],
              ['ETH', <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, 'Included in spread'],
              ['USDC', <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, <span style={{ fontWeight: 800, color: '#059669' }}>1.5%</span>, 'Included in spread'],
            ]}
            note="💡 The spread is included in the quoted price. The price you see is the price you pay — no surprise fees at checkout."
          />
        </div>

        {/* Withdrawals */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>📤 Crypto Withdrawal Fees</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Network (blockchain) fees are passed through at cost. PakSwap does not add a markup.</div>
          </div>
          <Table
            headers={['Coin / Network', 'Network Fee (approx.)', 'PakSwap Fee', 'Min Withdrawal']}
            rows={[
              ['USDT — TRC-20', '~1 USDT', <span style={{ fontWeight: 800, color: '#2563eb' }}>0</span>, '10 USDT'],
              ['USDT — ERC-20', '~5–15 USDT (varies with gas)', <span style={{ fontWeight: 800, color: '#2563eb' }}>0</span>, '20 USDT'],
              ['BTC — Bitcoin', '~0.00005 BTC', <span style={{ fontWeight: 800, color: '#2563eb' }}>0</span>, '0.001 BTC'],
              ['ETH — ERC-20', '~0.001 ETH (varies)', <span style={{ fontWeight: 800, color: '#2563eb' }}>0</span>, '0.01 ETH'],
              ['USDC — ERC-20', '~5–15 USDT equiv.', <span style={{ fontWeight: 800, color: '#2563eb' }}>0</span>, '20 USDC'],
            ]}
            note="⚠️ Network fees fluctuate with blockchain congestion. The fee shown at withdrawal time is final and real-time."
            noteBg="#fef3c7"
            noteColor="#92400e"
          />
        </div>

        {/* KYC Limits */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🛡️ Daily Limits by KYC Tier</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Limits reset at midnight PKT (UTC+5). Cumulative across all P2P and Instant Buy activity.</div>
          </div>
          <Table
            headers={['KYC Tier', 'Daily Buy Limit', 'Daily Sell Limit', 'Monthly Cap']}
            rows={[
              [<Badge bg="#f1f5f9" color="#64748b">No KYC</Badge>, <span style={{ color: '#94a3b8' }}>View only — no trading</span>, <span style={{ color: '#94a3b8' }}>—</span>, <span style={{ color: '#94a3b8' }}>—</span>],
              [<><Badge bg="#fef3c7" color="#92400e">Basic KYC</Badge><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Phone verified</div></>, '50,000 PKR', '50,000 PKR', '500,000 PKR'],
              [<><Badge bg="#dbeafe" color="#1d4ed8">Standard KYC</Badge><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>CNIC verified</div></>, '200,000 PKR', '200,000 PKR', '2,000,000 PKR'],
              [<><Badge bg="#d1fae5" color="#065f46">Full KYC</Badge><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>CNIC + Selfie + Address</div></>, '500,000 PKR', '500,000 PKR', '10,000,000 PKR'],
              [<><Badge bg="#fdf4ff" color="#7c3aed">Verified Merchant</Badge><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Full KYC + approved</div></>, <span style={{ fontWeight: 800, color: '#059669' }}>5,000,000 PKR</span>, <span style={{ fontWeight: 800, color: '#059669' }}>5,000,000 PKR</span>, 'Unlimited*'],
            ]}
            note="*Merchant monthly cap subject to compliance review for volumes above 50M PKR/month."
          />
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {faqItems.map(([q, a], i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', marginBottom: 8, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 14 }}>
                {q}
                <span style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#94a3b8' }}>▾</span>
              </div>
              {open === i && <div style={{ fontSize: 13, color: '#64748b', marginTop: 10, lineHeight: 1.7 }}>{a}</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 32 }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Have a question about fees?</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>Our support team is available 9am – 9pm PKT, 7 days a week.</div>
            <Link href="/help"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Visit Help Center</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
