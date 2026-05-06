'use client'
import { useState } from 'react'
import Link from 'next/link'

const faqItems = [
  ['How does the escrow work?', "When you initiate a buy trade, the seller's cryptocurrency is immediately locked in PakSwap's escrow system. The crypto cannot be moved until you confirm your payment. Once you pay and confirm, the seller verifies and releases the crypto to your wallet. If there's a dispute, our team reviews evidence from both parties."],
  ['Is P2P crypto trading legal in Pakistan?', "P2P trading operates in a regulatory grey area in Pakistan. The SBP has issued advisories about crypto risks but has not enacted an outright ban. PakSwap maintains full KYC/AML compliance and is structured to align with SECP's emerging VASP framework. We strongly recommend consulting a local financial advisor about your specific situation."],
  ["What if the seller doesn't release my crypto?", "If you've paid and the seller doesn't release within the trade window, you can open a dispute. Our dispute agents will review your payment proof (JazzCash screenshot, bank transfer receipt) and the seller's account. If your payment is confirmed, the crypto will be released to you from escrow."],
  ['How long does KYC verification take?', 'KYC is typically approved within 15 minutes to 2 hours during business hours (9AM–9PM PKT). You\'ll receive an SMS and email notification as soon as your documents are reviewed. Clear, well-lit CNIC photos and a liveness selfie make the process fastest.'],
  ["What are PakSwap's trading fees?", "PakSwap charges 0% trading fees during our launch promotional period. After the promotional period, a 0.5% taker fee applies on completed trades. Verified merchants enjoy 0.3% fees. There are no deposit fees; standard blockchain fees apply for withdrawals."],
]

const merchants = [
  { init: 'C', bg: 'linear-gradient(135deg,#1e3a5f,#2563eb)', name: 'CryptoKing', meta: '⭐ 4.9 · 1,240 trades · 99.2%', badge: '👑 Merchant', badgeBg: '#fef3c7', badgeColor: '#92400e', rate: '280.50', limits: '1k – 200k PKR', pm: '⚡ JazzCash' },
  { init: 'P', bg: 'linear-gradient(135deg,#059669,#34d399)', name: 'PKR_Pro', meta: '⭐ 4.7 · 890 trades · 98.5%', badge: '✓ Verified', badgeBg: '#eff6ff', badgeColor: '#1d4ed8', rate: '280.20', limits: '5k – 500k PKR', pm: '🏦 Bank HBL' },
  { init: 'F', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', name: 'FastTrade', meta: '⭐ 4.8 · 654 trades · 99.0%', badge: '👑 Merchant', badgeBg: '#fef3c7', badgeColor: '#92400e', rate: '279.90', limits: '2k – 100k PKR', pm: '💚 Easypaisa' },
]

const coins = [
  { sym: '₮', bg: '#26a17b', name: 'USDT', sub: 'Tether', price: '280.50 PKR', color: '#26a17b' },
  { sym: '₿', bg: '#f7931a', name: 'BTC', sub: 'Bitcoin', price: '19.2M PKR', color: '#f7931a' },
  { sym: 'Ξ', bg: '#627eea', name: 'ETH', sub: 'Ethereum', price: '1,04,500 PKR', color: '#627eea' },
  { sym: '$', bg: '#2775ca', name: 'USDC', sub: 'USD Coin', price: '279.80 PKR', color: '#2775ca' },
]

const paymentMethods = [
  { label: 'JCash', bg: '#fef3c7', color: '#92400e', name: 'JazzCash', sub: 'Mobile Wallet' },
  { label: 'Easy', bg: '#d1fae5', color: '#065f46', name: 'Easypaisa', sub: 'Mobile Wallet' },
  { label: 'HBL', bg: '#ede9fe', color: '#5b21b6', name: 'HBL Bank', sub: 'Bank Transfer' },
  { label: 'MCB', bg: '#fce7f3', color: '#9d174d', name: 'MCB Bank', sub: 'Bank Transfer' },
  { label: 'UBL', bg: '#dbeafe', color: '#1d4ed8', name: 'UBL Bank', sub: 'Bank Transfer' },
  { label: 'Meezan', bg: '#f0fdf4', color: '#166534', name: 'Meezan Bank', sub: 'Islamic Banking' },
]

export default function HomePage() {
  const [open, setOpen] = useState<number | null>(0)
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [heroTab, setHeroTab] = useState<'buy' | 'sell'>('buy')
  const [pkrAmount, setPkrAmount] = useState('5000')

  const cryptoEst = pkrAmount ? (parseFloat(pkrAmount) / 280.5).toFixed(2) : '0'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Home</Link>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/help" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Help</Link>
          <Link href="/fees" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Fees</Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Login</button></Link>
          <Link href="/register"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Get Started</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1d4ed8 100%)', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>🇵🇰 Pakistan's #1 P2P Crypto Exchange</div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5, margin: '0 0 16px' }}>Buy & Sell Crypto<br />with <span style={{ color: '#60a5fa' }}>JazzCash</span> &<br />Pakistani Banks</h1>
            <p style={{ fontSize: 18, color: '#93c5fd', margin: '0 0 32px', maxWidth: 480, lineHeight: 1.7 }}>Trusted escrow protection. 100% KYC verified merchants. Trade USDT, BTC, ETH with PKR in minutes.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/register"><button style={{ padding: '14px 28px', background: 'white', color: '#1d4ed8', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>🚀 Start Trading Free</button></Link>
              <Link href="/marketplace"><button style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Browse Offers →</button></Link>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
              <div style={{ color: '#93c5fd', fontSize: 13 }}>🔒 Escrow Protected</div>
              <div style={{ color: '#93c5fd', fontSize: 13 }}>✓ KYC Verified Merchants</div>
              <div style={{ color: '#93c5fd', fontSize: 13 }}>⚡ 15 Min Trades</div>
            </div>
          </div>

          {/* Hero Box */}
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 20 }}>Find Best Rate</div>
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
              {(['buy', 'sell'] as const).map(t => (
                <button key={t} onClick={() => setHeroTab(t)} style={{ flex: 1, padding: 8, borderRadius: 8, background: heroTab === t ? 'white' : 'transparent', color: heroTab === t ? '#1d4ed8' : 'rgba(255,255,255,0.6)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14, textTransform: 'uppercase' }}>{t}</button>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>CRYPTOCURRENCY</div>
              <select style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 10, padding: '10px 14px', fontSize: 15, fontFamily: 'inherit', width: '100%', outline: 'none' }}>
                <option style={{ background: '#1e3a8a' }}>USDT — Tether</option>
                <option style={{ background: '#1e3a8a' }}>BTC — Bitcoin</option>
                <option style={{ background: '#1e3a8a' }}>ETH — Ethereum</option>
                <option style={{ background: '#1e3a8a' }}>USDC — USD Coin</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>AMOUNT (PKR)</div>
              <input type="number" value={pkrAmount} onChange={e => setPkrAmount(e.target.value)} placeholder="5,000" style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 10, padding: '12px 14px', fontSize: 18, fontWeight: 700, fontFamily: 'inherit', width: '100%', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 6 }}>≈ {cryptoEst} USDT at best rate</div>
            </div>
            <Link href="/marketplace"><button style={{ width: '100%', padding: 14, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Find Best Rate →</button></Link>
            <div style={{ textAlign: 'center', marginTop: 12, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>No account needed to browse rates</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {[['50,000+', 'Trades Completed'], ['99.1%', 'Completion Rate'], ['8,200+', 'Verified Users'], ['4.9 ★', 'User Rating (3,200 reviews)'], ['< 15 min', 'Avg Trade Time']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>How PakSwap Works</h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>Buy or sell crypto with PKR in 3 simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { num: '1', icon: '📝', title: 'Register & Verify', text: 'Create your account in 2 minutes. Verify your CNIC identity to unlock trading. Quick approval within 15 minutes.', highlight: false },
              { num: '2', icon: '🔍', title: 'Choose Your Offer', text: 'Browse 100+ verified merchant offers. Filter by JazzCash, Easypaisa, or bank transfer. See ratings before you trade.', highlight: true },
              { num: '3', icon: '⚡', title: 'Pay & Receive Crypto', text: 'Send PKR via your chosen payment method. Crypto is auto-released from escrow within minutes of payment confirmation.', highlight: false },
            ].map(({ num, icon, title, text, highlight }) => (
              <div key={num} style={{ background: highlight ? '#f0f9ff' : 'white', border: `1px solid ${highlight ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: 16, padding: 28, textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d4ed8', margin: '0 auto 16px', fontSize: 18 }}>{num}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 20px', fontSize: 14, color: '#1d4ed8', maxWidth: 600 }}>
              🔒 <div><strong>PakSwap Escrow Guarantee:</strong> Your crypto is held in escrow until payment is confirmed. You are always protected — 100% of the time.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Coins */}
      <section style={{ background: '#f8fafc', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>Supported Cryptocurrencies</h2>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>Trade the most popular coins with PKR</p>
            </div>
            <Link href="/marketplace"><button style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View All Offers →</button></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {coins.map(({ sym, bg, name, sub, price, color }) => (
              <Link key={name} href="/marketplace" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{sym}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{name}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{sub}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color, marginTop: 4 }}>{price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Offers */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>Live Market Offers</h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>Current best rates from verified merchants — updated live</p>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '12px 20px', display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0' }}>
              {(['buy', 'sell'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: tab === t ? '#2563eb' : 'white', color: tab === t ? 'white' : '#64748b' }}>{t === 'buy' ? '🟢 Buy USDT' : '🔴 Sell USDT'}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.5fr auto', padding: '10px 20px', gap: 12, background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>Merchant</span><span>Rate (PKR)</span><span>Limits</span><span>Payment</span><span></span>
            </div>
            {merchants.map(({ init, bg, name, meta, badge, badgeBg, badgeColor, rate, limits, pm }) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.5fr auto', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{init}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{meta}</div>
                  </div>
                  <span style={{ background: badgeBg, color: badgeColor, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{badge}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{rate}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{limits}</div>
                <div><span style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #86efac', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{pm}</span></div>
                <Link href="/login"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Buy →</button></Link>
              </div>
            ))}
            <div style={{ padding: '16px 20px', textAlign: 'center', background: '#f8fafc' }}>
              <Link href="/marketplace"><button style={{ padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View All 48 Offers →</button></Link>
              <span style={{ fontSize: 13, color: '#64748b', marginLeft: 16 }}>Login required to trade</span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section style={{ background: '#f8fafc', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>All Pakistani Payment Methods</h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>Pay or receive with your preferred local method</p>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {paymentMethods.map(({ label, bg, color, name, sub }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 14, padding: '16px 24px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, letterSpacing: -0.3 }}>{label}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, color: '#64748b', fontSize: 14 }}>+ All other Pakistani banks via IBFT</div>
        </div>
      </section>

      {/* Security */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>Your Security is Our Priority</h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>Bank-grade security for every transaction</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              ['🔒', 'Escrow Protection', "Crypto is locked in secure escrow during every trade. Only released after your payment is confirmed."],
              ['🪪', '100% KYC Verified', 'Every user verified with Pakistani CNIC. No anonymous trading. Full accountability.'],
              ['⚖️', 'Dispute Resolution', 'Trained dispute agents resolve conflicts within 4 hours. Fair decisions backed by evidence.'],
              ['🛡️', '2FA & Device Guard', 'Two-factor authentication on every login and withdrawal. New device alerts via SMS and email.'],
            ].map(([icon, title, text]) => (
              <div key={title as string} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f8fafc', padding: '64px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, margin: 0 }}>Frequently Asked Questions</h2>
          </div>
          {faqItems.map(([q, a], i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
              <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: '16px 20px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: open === i ? '#2563eb' : '#1e293b', background: 'white' }}>
                <span>{q}</span>
                <span style={{ color: '#94a3b8' }}>▼</span>
              </div>
              {open === i && <div style={{ padding: '0 20px 16px', fontSize: 14, color: '#64748b', lineHeight: 1.7, background: 'white' }}>{a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '80px 24px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>Start Trading in 5 Minutes</h2>
        <p style={{ fontSize: 18, color: '#93c5fd', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>Join 8,200+ Pakistanis who trust PakSwap to buy and sell crypto safely.</p>
        <Link href="/register"><button style={{ padding: '16px 36px', background: 'white', color: '#1d4ed8', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>Create Free Account →</button></Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 12 }}>Pak<span style={{ color: '#3b82f6' }}>Swap</span></div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280, margin: 0 }}>Pakistan's most trusted P2P cryptocurrency exchange. Secure, fast, and built for Pakistanis.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, fontSize: 20 }}>
                <span style={{ cursor: 'pointer' }}>📱</span><span style={{ cursor: 'pointer' }}>📺</span><span style={{ cursor: 'pointer' }}>✈️</span><span style={{ cursor: 'pointer' }}>📸</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Trading</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['P2P Marketplace', '/marketplace'], ['Create Ad', '/create-ad'], ['Wallet', '/wallet'], ['Trade History', '/orders']].map(([l, h]) => (
                  <Link key={l} href={h} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['About Us', '/about'], ['Careers', '#'], ['Help Center', '/help'], ['Referral Program', '/referral']].map(([l, h]) => (
                  <Link key={l} href={h} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Terms of Service', 'Privacy Policy', 'AML Policy', 'Risk Disclosure'].map(l => (
                  <Link key={l} href="#" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e3a8a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13 }}>© 2026 PakSwap Pvt. Ltd. All rights reserved.</div>
            <div style={{ fontSize: 12, color: '#475569' }}>⚠️ Crypto trading involves risk. Please trade responsibly.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
