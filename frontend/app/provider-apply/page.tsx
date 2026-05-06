'use client'
import { useState } from 'react'
import Link from 'next/link'

const tokens = [
  { id: 'bnb', label: '🟡 BNB' },
  { id: 'eth', label: '🔷 ETH' },
  { id: 'sol', label: '🟣 SOL' },
  { id: 'ton', label: '💎 TON' },
  { id: 'btc', label: '🟠 BTC' },
  { id: 'usdt', label: '💵 USDT' },
]

const benefits = [
  { icon: '💸', title: 'Competitive Revenue', text: 'Set your own spread. Platform only takes 0.5% per fulfilled order.' },
  { icon: '🤖', title: 'Automated Orders', text: 'PKR orders are AI-verified. USDT orders are 100% automatic — no manual work.' },
  { icon: '🛡️', title: 'Platform Protection', text: 'Escrow and fraud detection built in. Only verified payments trigger releases.' },
  { icon: '📈', title: 'Scale Your Volume', text: "Tap into PakSwap's user base. Top providers fulfill 500+ orders monthly." },
]

export default function ProviderApplyPage() {
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set())
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleToken = (id: string) => {
    const s = new Set(selectedTokens)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelectedTokens(s)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 40, maxWidth: 460, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Application Submitted!</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 24 }}>Thank you for applying to become a PakSwap liquidity provider. We'll review your application and contact you via Telegram within 3–5 business days.</p>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 14, color: '#166534' }}>
            📋 Application Reference: <strong>#APP-2026-001847</strong>
          </div>
          <Link href="/instant-buy"><button style={{ width: '100%', padding: 13, background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Back to Instant Buy</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/instant-buy" style={{ fontSize: 16, color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>← Instant Buy</Link>
        <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>🔓 Open Applications</span>
        <div />
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#166534,#15803d,#16a34a)', borderRadius: 20, padding: 40, color: 'white', textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Become a Liquidity Provider</h1>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 500, margin: '0 auto' }}>Earn by providing crypto inventory for PakSwap Instant Buy orders. Join our trusted provider network and earn on every fulfilled order.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {['💰 Earn on every order', '🏅 Verified badge', '📊 Provider dashboard'].map(t => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 32 }}>
          {benefits.map(({ icon, title, text }) => (
            <div key={title} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#92400e', marginBottom: 12 }}>📋 Provider Requirements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '✅ Full KYC verified on PakSwap (CNIC + selfie)',
              '✅ Minimum 500 USDT equivalent inventory to start',
              '✅ Complete 100 test orders successfully before public listing',
              '✅ Maintain dispute rate below 2%',
              '✅ Respond to manual orders within 30 minutes (SLA)',
              '⚠️ Applications are for Phase 2 — we will contact you when ready',
            ].map(t => (
              <div key={t} style={{ fontSize: 14, color: '#78350f' }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Provider Application</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Fill this form to join the waitlist. We review applications and contact approved providers directly.</p>

          {/* Personal Info */}
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            Personal Information <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="As on your CNIC" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>CNIC Number <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="35201-1234567-1" maxLength={15} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Business Name <span style={{ color: '#94a3b8' }}>(optional)</span></label>
              <input type="text" placeholder="Your company or brand name" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>City <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Select your city</option>
                {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Trading Capacity */}
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            Trading Capacity <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Which tokens do you want to provide? <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
              {tokens.map(({ id, label }) => (
                <div key={id} onClick={() => toggleToken(id)} style={{ border: `2px solid ${selectedTokens.has(id) ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: selectedTokens.has(id) ? '#eff6ff' : 'white' }}>
                  <input type="checkbox" checked={selectedTokens.has(id)} readOnly style={{ accentColor: '#2563eb', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Estimated daily volume (PKR) <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Select range</option>
                {['Under 50,000 PKR/day', '50,000 – 200,000 PKR/day', '200,000 – 500,000 PKR/day', '500,000 – 1,000,000 PKR/day', 'Over 1,000,000 PKR/day'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Trading experience <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Select</option>
                {['Less than 6 months', '6 months – 1 year', '1–2 years', '2–5 years', '5+ years'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Platforms you currently use</label>
            <input type="text" placeholder="e.g. Binance, Bybit, local exchanges..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Contact */}
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            Contact & Intent <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Telegram Username <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="@yourusername" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
              <input type="tel" placeholder="03XX-XXXXXXX" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Why do you want to become a provider? <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea rows={4} placeholder="Tell us about your experience, why you're a good fit, and what you can bring to the PakSwap provider network..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Any questions or comments?</label>
            <textarea rows={3} placeholder="Anything else you'd like to tell us..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#2563eb', marginTop: 2, flexShrink: 0 }} />
            <label style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>
              I understand that this is a waitlist application. Approval is subject to review and PakSwap reserves the right to approve or reject any application. I agree to the{' '}
              <Link href="#" style={{ color: '#2563eb' }}>Provider Terms of Service</Link>.
            </label>
          </div>

          <button onClick={() => agreed && setSubmitted(true)} disabled={!agreed} style={{ width: '100%', padding: 14, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: agreed ? 'pointer' : 'not-allowed', opacity: agreed ? 1 : 0.5 }}>
            Submit Application →
          </button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            We review applications within 3–5 business days and contact you via Telegram.
          </div>
        </div>
      </div>
    </div>
  )
}
