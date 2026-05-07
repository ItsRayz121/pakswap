'use client'
import { useState } from 'react'
import Link from 'next/link'
import { merchantsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function MerchantApplyPage() {
  const { user } = useAuthStore()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [agrees, setAgrees] = useState([false, false, false, false])
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const allAgreed = agrees.every(Boolean)

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?'
  const displayName = user?.fullName?.split(' ')[0] ?? 'Account'

  function toggle(i: number) {
    setAgrees(prev => { const n = [...prev]; n[i] = !n[i]; return n })
  }

  async function submit() {
    if (!allAgreed) { alert('Please read and agree to all terms before submitting.'); return }
    if (!businessName.trim()) { alert('Please enter a business/trading name.'); return }
    setSubmitting(true)
    setError(null)
    try {
      await merchantsApi.apply({ businessName: businessName.trim() })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/home" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Home</Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initial}</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{displayName}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '40px 24px 32px', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: '20px', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e293b', marginBottom: '10px' }}>Become a PakSwap Merchant</h1>
          <p style={{ fontSize: '16px', color: '#475569', maxWidth: '560px', margin: '0 auto 20px' }}>Unlock higher trading limits, a verified badge, priority placement in the marketplace, and access to bulk P2P tools.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: '✓ Higher Daily Limits', bg: '#2563eb' },
              { label: '✓ Verified Badge', bg: '#059669' },
              { label: '✓ Priority Listing', bg: '#d97706' },
              { label: '✓ Bulk Tools', bg: '#7c3aed' },
            ].map(b => (
              <span key={b.label} style={{ background: b.bg, color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>{b.label}</span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🚀', title: 'Daily Limit: 5M PKR', desc: 'Regular users cap at 500K/day. Merchants get 5M PKR daily trade volume.' },
            { icon: '🏅', title: 'Verified Merchant Badge', desc: 'Display a gold "Verified Merchant" badge on your profile and all ads.' },
            { icon: '📢', title: 'Priority in Marketplace', desc: 'Your ads appear at the top of search results for the coins you trade.' },
            { icon: '📊', title: 'Merchant Dashboard', desc: 'Dedicated analytics: volume, profit/loss, completion rates, and trade breakdown.' },
            { icon: '🛡️', title: 'Priority Dispute Resolution', desc: 'Disputes involving merchants are prioritized — 2-hour SLA vs 4-hour for regular users.' },
            { icon: '💬', title: 'Dedicated Support', desc: 'Direct chat with our Merchant Support team — no ticket queues.' },
          ].map(b => (
            <div key={b.title} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{b.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>{b.title}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px' }}>📋 Requirements to Apply</div>
          {[
            { title: 'Full KYC Approved', desc: 'Your CNIC, selfie, and address proof must all be verified.' },
            { title: 'Minimum 20 Completed Trades', desc: 'You need at least 20 completed P2P trades on the platform.' },
            { title: 'Completion Rate ≥ 90%', desc: 'Your trade completion rate over the last 30 trades must be 90% or higher.' },
            { title: 'No Active Disputes or Bans', desc: 'Your account must be in good standing with no current disputes or fraud flags.' },
            { title: 'Account Age ≥ 30 Days', desc: 'Your PakSwap account must be at least 30 days old.' },
          ].map((r, i) => (
            <div key={r.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e293b', marginBottom: '10px' }}>Application Submitted!</div>
            <div style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', margin: '0 auto 24px' }}>Your merchant application is under review. Our team will verify your details and respond within 2–5 business days via SMS and email.</div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '20px', maxWidth: '400px', margin: '0 auto 24px', textAlign: 'left' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px', color: '#1d4ed8' }}>What happens next:</div>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151' }}>
                <div>1️⃣ Our team reviews your trading history and application details</div>
                <div>2️⃣ You may be asked for additional verification</div>
                <div>3️⃣ Decision sent via SMS + email</div>
                <div>4️⃣ If approved, merchant badge activates immediately</div>
              </div>
            </div>
            <Link href="/home" style={{ padding: '14px 32px', background: '#2563eb', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>Back to Dashboard</Link>
          </div>
        ) : (
          <>
            {/* About You */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>👤 About You</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Full Name (as on CNIC)</label>
                  <input type="text" value={user?.fullName ?? ''} readOnly
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc', color: '#64748b', boxSizing: 'border-box', marginTop: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Business / Trading Name</label>
                  <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. PakCrypto Exchange"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginTop: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>City</label>
                  <select defaultValue="Lahore" style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginTop: '6px' }}>
                    {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>WhatsApp Number (for support contact)</label>
                  <input type="tel" placeholder="+92 300 0000000"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginTop: '6px' }} />
                </div>
              </div>
            </div>

            {/* Trading Intentions */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>📊 Trading Intentions</div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Which coins do you primarily want to trade as a merchant?</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {[['₮ USDT', true], ['₿ BTC', false], ['Ξ ETH', false], ['$ USDC', false]].map(([coin, checked]) => (
                    <label key={coin as string} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '8px 14px', border: `1.5px solid ${checked ? '#2563eb' : '#e2e8f0'}`, background: checked ? '#eff6ff' : 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                      <input type="checkbox" defaultChecked={checked as boolean} style={{ accentColor: '#2563eb' }} /> {coin}
                    </label>
                  ))}
                </div>
              </div>
              {[
                { label: 'Expected monthly trading volume (PKR)', opts: ['Under 1M PKR', '1M – 5M PKR', '5M – 20M PKR', '20M+ PKR'], selected: '1M – 5M PKR' },
                { label: 'How long have you been trading crypto?', opts: ['Less than 1 year', '1–2 years', '2–5 years', '5+ years'], selected: '2–5 years' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                  <select defaultValue={f.selected} style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginTop: '6px' }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Statement */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>📝 Statement</div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Tell us about yourself and why you want to be a PakSwap merchant</label>
              <textarea rows={4} placeholder="e.g. I have been trading crypto in Pakistan since 2021. I want to provide liquidity to the PakSwap community with fair prices and fast response times..."
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'none', marginTop: '6px', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Minimum 100 characters</div>
            </div>

            {/* Agreement */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>📜 Agreement</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {[
                  'I agree to maintain a trade completion rate of at least 80% at all times. Falling below this for 30+ days may result in merchant status suspension.',
                  'I understand that a dispute rate above 5% over any 30-day window will trigger a review of my merchant status.',
                  'I agree to comply with all PakSwap platform rules including the two-layer payment verification policy, and will not attempt to bypass escrow.',
                  'I understand that PakSwap may revoke merchant status if I engage in price manipulation, fraud, or repeated bad-faith disputes.',
                ].map((text, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={agrees[i]} onChange={() => toggle(i)} style={{ marginTop: '2px', accentColor: '#2563eb' }} />
                    {text}
                  </label>
                ))}
              </div>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>
                  ⚠️ {error}
                </div>
              )}
              <button onClick={submit} disabled={submitting || !allAgreed}
                style={{ width: '100%', padding: '14px', background: allAgreed && !submitting ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: allAgreed && !submitting ? 'pointer' : 'not-allowed' }}>
                {submitting ? 'Submitting...' : 'Submit Merchant Application →'}
              </button>
              <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>Review takes 2–5 business days. You'll receive an SMS and email with the decision.</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
