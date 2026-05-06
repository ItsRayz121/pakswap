import Link from 'next/link'

const relatedArticles = [
  { slug: 'how-to-dispute', title: 'How to Open a Dispute', sub: 'What to do when a trade goes wrong' },
  { slug: 'jazzcash-guide', title: 'JazzCash Payment Guide', sub: 'Step-by-step JazzCash payment for P2P trades' },
  { slug: 'kyc-guide', title: 'KYC Verification Guide', sub: 'How to complete CNIC and selfie verification' },
  { slug: 'escrow', title: 'Understanding Escrow', sub: 'How PakSwap protects your funds during a trade' },
  { slug: 'create-sell-ad', title: 'How to Create a Sell Ad', sub: 'Listing your crypto for sale on the marketplace' },
]

export default function HelpArticlePage() {
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

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>

          {/* Main Article */}
          <div>
            {/* Breadcrumb */}
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              <Link href="/help" style={{ color: '#2563eb', textDecoration: 'none' }}>Help Center</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <Link href="/help" style={{ color: '#2563eb', textDecoration: 'none' }}>Getting Started</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <span>How to Complete a P2P Trade</span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>How to Complete a P2P Trade</h1>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Last updated: 5 May 2026 · 5 min read · 🇵🇰 Pakistan</div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
              <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Getting Started</span>
              <span style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#065f46', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>P2P Trading</span>
            </div>

            {/* TOC */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>In this article</div>
              {['Overview', 'Before You Start', 'Step-by-Step: Buying Crypto', 'Step-by-Step: Selling Crypto', 'The Payment Window Timer', 'How Escrow Works', 'Common Problems'].map(t => (
                <a key={t} href={`#${t.toLowerCase().replace(/[^a-z]+/g, '-')}`} style={{ display: 'block', padding: '6px 0', color: '#2563eb', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}>{t}</a>
              ))}
            </div>

            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>Overview</h2>
              <p style={{ marginBottom: 14 }}>P2P (peer-to-peer) trading on PakSwap lets you buy or sell crypto directly with another user. PakSwap holds the seller's crypto in escrow and releases it only after a human admin confirms the buyer's payment. This protects both sides from fraud.</p>
              <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#065f46', margin: '16px 0' }}>
                ✅ <strong>Quick summary:</strong> Browse ads → Start trade → Send payment via JazzCash/Easypaisa/Bank → Upload screenshot → Wait for admin to release crypto → Done.
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>Before You Start</h2>
              <p style={{ marginBottom: 14 }}>Make sure you have completed the following before your first trade:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
                <li style={{ marginBottom: 4 }}><strong>Phone verification</strong> (Basic KYC) — required for any trading</li>
                <li style={{ marginBottom: 4 }}><strong>CNIC verification</strong> (Standard KYC) — required for trades above 50,000 PKR/day</li>
                <li style={{ marginBottom: 4 }}>A linked payment method: JazzCash, Easypaisa, or bank account</li>
                <li style={{ marginBottom: 4 }}>Sufficient balance in your payment app (for buying) or crypto wallet (for selling)</li>
              </ul>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#1d4ed8', margin: '16px 0' }}>
                💡 Your CNIC name must match the name registered on your JazzCash/Easypaisa/bank account. Mismatched names are a common reason for payment disputes.
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>Step-by-Step: Buying Crypto</h2>
              {[
                ['1', 'Browse the Marketplace', 'Go to Marketplace and use the filters to find SELL ads matching your preferred coin, payment method, and price. Look for merchants with a gold badge and high completion rates for the safest experience.'],
                ['2', 'Enter Amount and Start Trade', 'Click on a SELL ad, enter the PKR amount you want to spend (must be within the ad\'s min/max limits), and click Buy Now. The seller\'s crypto is immediately locked in escrow.'],
                ['3', 'Send Payment', 'Send the exact PKR amount to the seller\'s JazzCash, Easypaisa, or bank account (shown in the trade window). Use your registered account — do not send from a third party\'s account.'],
                ['4', 'Upload Payment Screenshot', 'In the trade window, click I\'ve Paid and upload a clear screenshot of your payment confirmation. The screenshot must show: your name, recipient name, amount, transaction ID, and date/time.'],
                ['5', 'Wait for Admin Verification', 'A PakSwap admin will review your screenshot against the payment record. This usually takes 5–15 minutes during business hours (9am–9pm PKT). Do not close the trade window.'],
                ['6', 'Crypto Released to Your Wallet', 'Once admin confirms the payment, the crypto is released from escrow to your PakSwap wallet instantly. You\'ll receive an SMS and in-app notification. The trade is now complete.'],
              ].map(([num, title, text]) => (
                <div key={num} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{num}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                    <p style={{ marginBottom: 0 }}>{text}</p>
                    {num === '3' && <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#92400e', margin: '12px 0' }}>⚠️ <strong>Send the exact amount.</strong> Sending a different amount (even 1 PKR less) may cause the admin to reject the payment confirmation.</div>}
                  </div>
                </div>
              ))}

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>Step-by-Step: Selling Crypto</h2>
              <p style={{ marginBottom: 14 }}>When you sell, you are the one who creates an ad (or responds to a BUY ad). The flow is reversed:</p>
              <ol style={{ paddingLeft: 20, marginBottom: 14 }}>
                {['Post a SELL ad on the marketplace (or respond to a BUY ad)', 'A buyer initiates a trade — your crypto is locked in escrow immediately', 'The buyer sends payment to your JazzCash/bank account', 'The buyer uploads their payment screenshot', 'Admin verifies the screenshot — once confirmed, you receive the PKR and the buyer gets the crypto', 'Do not cancel or request to cancel once you\'ve received payment'].map(t => (
                  <li key={t} style={{ marginBottom: 4 }}>{t}</li>
                ))}
              </ol>
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#92400e', margin: '16px 0' }}>
                ⚠️ <strong>Never release early.</strong> Do not manually confirm a trade before admin verifies the payment, even if the buyer sends you a screenshot directly in chat.
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>The Payment Window Timer</h2>
              <p style={{ marginBottom: 14 }}>Every trade has a payment window timer — typically 15, 30, or 45 minutes depending on what the ad seller has set.</p>
              <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
                <li style={{ marginBottom: 4 }}>If the buyer does not mark "I've Paid" before the timer expires, the trade is automatically cancelled and crypto is returned to the seller</li>
                <li style={{ marginBottom: 4 }}>If you need more time due to a bank delay, use the in-trade chat to request an extension before the timer hits zero</li>
                <li style={{ marginBottom: 4 }}>Extensions are at the seller's discretion</li>
              </ul>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>How Escrow Works</h2>
              <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
                <li style={{ marginBottom: 4 }}>When a trade starts, the seller's crypto moves from their PakSwap wallet to a locked escrow ledger entry</li>
                <li style={{ marginBottom: 4 }}>Neither the buyer, the seller, nor the escrow holder can move those funds until admin takes action</li>
                <li style={{ marginBottom: 4 }}>Admin can: <strong>Release</strong> (payment confirmed → crypto goes to buyer) or <strong>Refund</strong> (payment rejected / fraud → crypto returns to seller)</li>
                <li style={{ marginBottom: 4 }}>In a dispute, funds remain frozen until the dispute is resolved</li>
              </ul>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#1d4ed8', margin: '16px 0' }}>
                💡 PakSwap uses an internal ledger for escrow — funds never leave the platform during a trade. The blockchain transaction only occurs when you withdraw to an external wallet.
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: '32px 0 12px' }}>Common Problems</h2>
              {[
                ['My timer expired but I already paid', 'Open a dispute immediately from the trade page. Provide your payment screenshot. Admin will investigate and release the crypto if payment is confirmed.'],
                ['The seller is unresponsive', 'Use the in-trade chat. If there is no response within 30 minutes of uploading your payment screenshot, click Open Dispute. Admin will step in.'],
                ['I accidentally sent the wrong amount', 'Contact the seller via trade chat immediately. If the seller agrees, they may manually confirm. Otherwise, open a dispute so admin can review both amounts and decide the correct resolution.'],
                ['I see "Payment Under Review" for a long time', 'During peak hours (6pm–10pm PKT), review times may extend to 30–60 minutes. If it\'s been over 60 minutes, contact support via the Help button in the trade window.'],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '20px 0 8px' }}>{q}</h3>
                  <p style={{ marginBottom: 14 }}>{a}</p>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 20, marginTop: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Was this article helpful?</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>👍 Yes, helpful</button>
                <button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>👎 Not really</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ marginBottom: 20 }}>
              <input type="text" placeholder="🔍 Search help articles..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Related Articles</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relatedArticles.map(({ slug, title, sub }) => (
                  <Link key={slug} href={`/help/${slug}`} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, textDecoration: 'none', display: 'block' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Still need help?</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Our team is available 9am – 9pm PKT, every day.</div>
              <Link href="/help"><button style={{ width: '100%', padding: '8px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Contact Support</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
