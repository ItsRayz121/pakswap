'use client'
import { useState } from 'react'
import Link from 'next/link'

const topics: Record<string, { title: string; articles: string[] }> = {
  'getting-started': { title: 'Getting Started', articles: ['How to register your account', 'Complete KYC step by step', 'Make your first trade', 'Understanding trading limits', 'Account verification levels', 'Phone verification guide'] },
  'trading': { title: 'Trading Guide', articles: ['How escrow works on PakSwap', 'How to buy USDT with JazzCash', 'How to sell crypto for PKR', 'Understanding the trade timer', 'What happens when a trade expires', 'Creating your first P2P ad', 'Merchant program requirements'] },
  'payments': { title: 'Payments', articles: ['JazzCash payment guide', 'Easypaisa payment guide', 'Bank transfer (IBFT) guide', 'Adding payment methods', 'Payment method verification', 'Payment limits explained'] },
  'disputes': { title: 'Disputes', articles: ['How to open a dispute', 'What evidence to provide', 'Dispute resolution timeline', 'Appealing a dispute decision', 'Common dispute scenarios', 'Preventing disputes'] },
  'security': { title: 'Security', articles: ['Setting up 2FA', 'Anti-phishing code guide', 'Recognizing fake PakSwap sites', 'Withdrawal security tips', 'Device management', 'Password best practices'] },
  'account': { title: 'My Account', articles: ['Updating your profile', 'Upgrading KYC level', 'Becoming a merchant', 'Referral program explained', 'Account limits', 'Closing your account'] },
}

const faqItems = [
  { q: 'How does escrow protect my trade?', a: 'When you initiate a buy, the seller\'s USDT is locked by PakSwap. It cannot be released until you confirm payment, or a dispute agent decides. You are always protected.' },
  { q: 'My KYC was rejected — what do I do?', a: 'Check the rejection reason in your KYC status page. Common issues: blurry CNIC photo, expired CNIC, name mismatch. Retake photos in good lighting and resubmit.' },
  { q: 'Seller is not releasing USDT after I paid', a: 'Open a dispute immediately via the trade room. Upload your payment proof (JazzCash screenshot with transaction ID). Our team will review and release your USDT within 4 hours.' },
  { q: 'Can I use someone else\'s JazzCash account?', a: 'No. Payment account names must match your KYC name. Third-party payments are prohibited and will result in dispute loss and account restriction.' },
]

export default function HelpPage() {
  const [view, setView] = useState<'home' | string>('home')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const topicCards = [
    { id: 'getting-started', icon: '🚀', title: 'Getting Started', sub: 'Registration, KYC, first trade', count: '12' },
    { id: 'trading', icon: '🔄', title: 'Trading Guide', sub: 'Buy, sell, escrow, trade room', count: '18' },
    { id: 'payments', icon: '💳', title: 'Payments', sub: 'JazzCash, Easypaisa, banks', count: '9' },
    { id: 'disputes', icon: '⚖️', title: 'Disputes', sub: 'How to file, resolve, appeal', count: '7' },
    { id: 'security', icon: '🔒', title: 'Security', sub: '2FA, account protection, phishing', count: '10' },
    { id: 'account', icon: '👤', title: 'My Account', sub: 'Profile, KYC limits, merchant', count: '8' },
  ]

  const topic = view !== 'home' ? topics[view] : null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/help" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Help</Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Login</button></Link>
          <Link href="/register"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Get Started</button></Link>
        </div>
      </nav>

      {/* Hero Search */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 8 }}>How can we help you?</h1>
        <p style={{ color: '#93c5fd', fontSize: 16, marginBottom: 28 }}>Search our knowledge base or browse topics below</p>
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <input type="text" placeholder="🔍  Search: How to release USDT, KYC verification, dispute..." style={{ width: '100%', padding: '16px 60px 16px 20px', borderRadius: 14, border: 'none', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', boxSizing: 'border-box' }} />
          <button style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#2563eb', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Search</button>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {['Escrow', 'JazzCash payment', 'KYC failed', 'Open dispute', 'Withdraw crypto'].map(t => (
            <span key={t} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        {view === 'home' ? (
          <>
            {/* Topic Cards */}
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Browse by Topic</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
              {topicCards.map(({ id, icon, title, sub, count }) => (
                <div key={id} onClick={() => setView(id)} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 24, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{sub}</div>
                  <div style={{ fontSize: 12, color: '#2563eb', marginTop: 8, fontWeight: 600 }}>{count} articles →</div>
                </div>
              ))}
            </div>

            {/* FAQ + Support */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Popular Questions</h2>
                {faqItems.map(({ q, a }, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                    <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: '14px 18px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: openFaq === i ? '#2563eb' : '#1e293b', background: openFaq === i ? '#f8faff' : 'white' }}>
                      <span>{q}</span>
                      <span>{openFaq === i ? '▲' : '▼'}</span>
                    </div>
                    {openFaq === i && <div style={{ padding: '0 18px 14px', fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{a}</div>}
                  </div>
                ))}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Still Need Help?</h2>
                {[
                  { icon: '💬', title: 'Live Chat Support', sub: 'Available 9AM–11PM PKT daily', sub2: '⚡ Avg response: < 5 minutes', sub2Color: '#10b981', btn: 'Start Chat' },
                  { icon: '📧', title: 'Email Support', sub: 'support@pakswap.pk', sub2: 'Response within 2 hours', sub2Color: '#64748b', btn: 'Email Us' },
                  { icon: '✈️', title: 'Telegram Community', sub: 't.me/PakSwapOfficial', sub2: 'Join 3,400+ users', sub2Color: '#64748b', btn: 'Join' },
                ].map(({ icon, title, sub, sub2, sub2Color, btn }) => (
                  <div key={title} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: 32 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{sub}</div>
                        <div style={{ fontSize: 12, color: sub2Color, marginTop: 2 }}>{sub2}</div>
                      </div>
                      <button style={{ padding: '7px 14px', background: btn === 'Start Chat' ? '#2563eb' : 'white', color: btn === 'Start Chat' ? 'white' : '#1e293b', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{btn}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : topic && (
          <>
            <button onClick={() => setView('home')} style={{ marginBottom: 16, padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back to Topics</button>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, position: 'sticky', top: 80 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>{topic.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topic.articles.map((a, i) => (
                    <div key={a} style={{ padding: '8px 0', borderBottom: i < topic.articles.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: 13, cursor: 'pointer', color: i === 0 ? '#2563eb' : '#374151' }}>{a}</div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>How Escrow Works on PakSwap</h2>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Last updated: 01 May 2026 · 5 min read</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>
                  <p style={{ marginBottom: 16 }}>PakSwap uses a <strong>secure escrow system</strong> to protect every P2P trade. Here's how it works:</p>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 10px' }}>Step 1: USDT Locked in Escrow</h3>
                  <p style={{ marginBottom: 16 }}>When a buyer initiates a trade, the seller's cryptocurrency is automatically locked in PakSwap's escrow. This means the seller's USDT cannot be moved, withdrawn, or sent elsewhere until the trade completes.</p>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#1d4ed8', marginBottom: 16 }}>🔒 <strong>Funds are 100% safe in escrow.</strong> Neither party can access the crypto during the trade.</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 10px' }}>Step 2: Buyer Sends Payment</h3>
                  <p style={{ marginBottom: 16 }}>The buyer sends PKR to the seller via the agreed payment method (JazzCash, bank transfer, etc.). The buyer then clicks "I've Paid" and uploads a payment screenshot.</p>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 10px' }}>Step 3: Admin Verifies & Releases</h3>
                  <p style={{ marginBottom: 16 }}>A PakSwap admin reviews the screenshot. Once payment is confirmed, the crypto is released from escrow to the buyer's wallet instantly.</p>
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#92400e', marginBottom: 16 }}>⚠️ <strong>Never cancel a trade after sending payment.</strong> If you sent payment but want to cancel, open a dispute instead.</div>
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ fontSize: 14, color: '#64748b' }}>Was this article helpful?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>👍 Yes</button>
                    <button style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>👎 No</button>
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Related Articles:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link href="/help/how-to-dispute" style={{ fontSize: 14, color: '#2563eb' }}>→ How to open a dispute</Link>
                    <Link href="/help/trade-guide" style={{ fontSize: 14, color: '#2563eb' }}>→ Trade room guide for buyers</Link>
                    <Link href="/help/trade-expires" style={{ fontSize: 14, color: '#2563eb' }}>→ What happens when trade expires</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
