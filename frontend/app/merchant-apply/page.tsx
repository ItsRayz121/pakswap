'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MerchantApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [a1, setA1] = useState(false)
  const [a2, setA2] = useState(false)
  const [a3, setA3] = useState(false)
  const [a4, setA4] = useState(false)
  const [statement, setStatement] = useState('')

  const allAgreed = a1 && a2 && a3 && a4

  const benefits = [
    { icon: '🚀', title: 'Daily Limit: 5M PKR', text: 'Regular users cap at 500K/day. Merchants get 5M PKR daily trade volume.' },
    { icon: '🏅', title: 'Verified Merchant Badge', text: 'Display a gold "Verified Merchant" badge on your profile and all ads.' },
    { icon: '📢', title: 'Priority in Marketplace', text: 'Your ads appear at the top of search results for the coins you trade.' },
    { icon: '📊', title: 'Merchant Dashboard', text: 'Dedicated analytics: volume, profit/loss, completion rates, and trade breakdown.' },
    { icon: '🛡️', title: 'Priority Dispute Resolution', text: 'Disputes involving merchants are prioritized — 2-hour SLA vs 4-hour for regular users.' },
    { icon: '💬', title: 'Dedicated Support', text: 'Direct chat with our Merchant Support team — no ticket queues.' },
  ]

  const requirements = [
    ['Full KYC Approved', 'Your CNIC, selfie, and address proof must all be verified. Your account shows "Full KYC."', '✓ You qualify'],
    ['Minimum 20 Completed Trades', 'You need at least 20 completed P2P trades on the platform.', '✓ You have 142 trades'],
    ['Completion Rate ≥ 90%', 'Your trade completion rate over the last 30 trades must be 90% or higher.', '✓ Your rate: 99.3%'],
    ['No Active Disputes or Bans', 'Your account must be in good standing with no current disputes or fraud flags.', '✓ Account clean'],
    ['Account Age ≥ 30 Days', 'Your PakSwap account must be at least 30 days old.', '✓ Your account: 114 days old'],
  ]

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', marginBottom: 10 }}>Application Submitted!</div>
          <div style={{ fontSize: 15, color: '#64748b', marginBottom: 24 }}>Your merchant application is under review. Our team will verify your details and respond within 2–5 business days via SMS and email.</div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: '#1d4ed8' }}>What happens next:</div>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, color: '#374151' }}>
              <div>1️⃣ Our team reviews your trading history and application details</div>
              <div>2️⃣ You may be asked for additional verification</div>
              <div>3️⃣ Decision sent via SMS + email</div>
              <div>4️⃣ If approved, merchant badge activates immediately</div>
            </div>
          </div>
          <Link href="/marketplace"><button style={{ padding: '13px 32px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Back to Dashboard</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>M</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '40px 24px 32px', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1e293b', marginBottom: 10 }}>Become a PakSwap Merchant</h1>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 560, margin: '0 auto 20px' }}>Unlock higher trading limits, a verified badge, priority placement in the marketplace, and access to bulk P2P tools.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {[['✓ Higher Daily Limits', '#2563eb'], ['✓ Verified Badge', '#059669'], ['✓ Priority Listing', '#d97706'], ['✓ Bulk Tools', '#7c3aed']].map(([l, bg]) => (
              <span key={l} style={{ background: bg, color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          {benefits.map(({ icon, title, text }) => (
            <div key={title} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{text}</div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📋 Requirements to Apply</div>
          {requirements.map(([title, desc, ok], i) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < requirements.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{desc} <span style={{ color: '#059669', fontWeight: 600 }}>{ok}</span></div>
              </div>
            </div>
          ))}
          <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#065f46', marginTop: 16, fontWeight: 700 }}>
            🎉 You meet all requirements! Complete the application below.
          </div>
        </div>

        {/* Form */}
        {/* About You */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>👤 About You</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Full Name (as on CNIC)</label>
              <input type="text" value="Muhammad Usman" readOnly style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: '#f8fafc', color: '#64748b', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>City</label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
              <input type="tel" defaultValue="+92 312 4567890" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>WhatsApp Number (for support contact)</label>
              <input type="tel" placeholder="+92 300 0000000" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* Trading Intentions */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📊 Trading Intentions</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Which coins do you primarily want to trade as a merchant?</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[['₮ USDT', true], ['₿ BTC', false], ['Ξ ETH', false], ['$ USDC', false]].map(([coin, checked]) => (
                <label key={coin as string} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '8px 14px', border: `1.5px solid ${checked ? '#2563eb' : '#e2e8f0'}`, background: checked ? '#eff6ff' : 'white', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  <input type="checkbox" defaultChecked={!!checked} style={{ accentColor: '#2563eb' }} /> {coin as string}
                </label>
              ))}
            </div>
          </div>
          {[['Expected monthly trading volume (PKR)', ['Under 1M PKR', '1M – 5M PKR', '5M – 20M PKR', '20M+ PKR'], 1], ['How long have you been trading crypto?', ['Less than 1 year', '1–2 years', '2–5 years', '5+ years'], 2]].map(([label, opts, def]) => (
            <div key={label as string} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{label as string}</label>
              <select defaultValue={(opts as string[])[def as number]} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                {(opts as string[]).map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Statement */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📝 Statement</div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Tell us about yourself and why you want to be a PakSwap merchant</label>
          <textarea value={statement} onChange={e => setStatement(e.target.value)} rows={4} placeholder="e.g. I have been trading crypto in Pakistan since 2021..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Minimum 100 characters</div>
        </div>

        {/* Agreement */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📜 Agreement</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              [a1, setA1, 'I agree to maintain a trade completion rate of at least 80% at all times. Falling below this for 30+ days may result in merchant status suspension.'],
              [a2, setA2, 'I understand that a dispute rate above 5% over any 30-day window will trigger a review of my merchant status.'],
              [a3, setA3, 'I agree to comply with all PakSwap platform rules including the two-layer payment verification policy, and will not attempt to bypass escrow.'],
              [a4, setA4, 'I understand that PakSwap may revoke merchant status if I engage in price manipulation, fraud, or repeated bad-faith disputes.'],
            ].map(([val, set, text], i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={!!val} onChange={e => (set as any)(e.target.checked)} style={{ marginTop: 2, accentColor: '#2563eb' }} />
                {text as string}
              </label>
            ))}
          </div>
          <button onClick={() => allAgreed && setSubmitted(true)} disabled={!allAgreed} style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: allAgreed ? 'pointer' : 'not-allowed', opacity: allAgreed ? 1 : 0.5, marginBottom: 12 }}>Submit Merchant Application →</button>
          <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>Review takes 2–5 business days. You'll receive an SMS and email with the decision.</div>
        </div>
      </div>
    </div>
  )
}
