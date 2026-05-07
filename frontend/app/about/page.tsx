import Link from 'next/link'

const team = [
  { init: 'A', bg: 'linear-gradient(135deg,#2563eb,#7c3aed)', name: 'Ahmed Raza', role: 'Co-Founder & CEO', desc: 'Former fintech product lead. 8 years in Pakistani payments infrastructure. IBA Karachi alum.' },
  { init: 'S', bg: 'linear-gradient(135deg,#059669,#0d9488)', name: 'Sara Malik', role: 'Co-Founder & CTO', desc: 'Blockchain engineer and AWS certified architect. Previously at a Karachi-based neobank. LUMS CS graduate.' },
  { init: 'U', bg: 'linear-gradient(135deg,#d97706,#dc2626)', name: 'Usman Khan', role: 'Head of Compliance', desc: '10 years in AML/KYC for Pakistani banks. ACCA qualified. Former SBP banking sector consultant.' },
  { init: 'F', bg: 'linear-gradient(135deg,#7c3aed,#db2777)', name: 'Fatima Shah', role: 'Head of Operations', desc: 'P2P dispute resolution and merchant relations. Built PakSwap\'s admin workflow from the ground up.' },
  { init: 'Z', bg: 'linear-gradient(135deg,#0ea5e9,#2563eb)', name: 'Zain Ahmed', role: 'Lead Engineer', desc: 'Node.js and PostgreSQL specialist. Built the escrow engine and real-time trade notification system.' },
  { init: 'N', bg: 'linear-gradient(135deg,#10b981,#2563eb)', name: 'Nadia Hussain', role: 'Customer Experience', desc: 'Leads our 9am–9pm support team. 5 years in Pakistani fintech user support. Urdu and English fluent.' },
]

const values = [
  { icon: '🔐', title: 'Security First', desc: 'Every trade is protected by escrow. Crypto doesn\'t move until payment is confirmed by a human admin — not an automated script. We use AWS KMS for key signing and never hold private keys on-disk.' },
  { icon: '🤝', title: 'Trader Protection', desc: 'Our two-layer payment verification means screenshots are OCR-checked AND human-reviewed before any release. Fraud attempts trigger an immediate freeze and investigation.' },
  { icon: '🇵🇰', title: 'Pakistan-Native', desc: 'JazzCash, Easypaisa, Sadapay, HBL, UBL, MCB, Meezan — all supported. CNIC KYC with Urdu-friendly flows. PKR denomination throughout. Pakistan Standard Time everywhere.' },
  { icon: '⚖️', title: 'Compliance-Ready', desc: 'KYC, AML transaction monitoring, and full audit trails built in from day one. We operate with a long-term view of regulatory compliance in Pakistan\'s evolving crypto landscape.' },
  { icon: '📊', title: 'Transparency', desc: 'Our fee schedule is public. Spreads are shown before you trade. No surprise deductions. Every admin action on your account is logged and visible in your account history.' },
  { icon: '🚀', title: 'Merchant Ecosystem', desc: 'We invest in our merchant partners — verified badge, 5M PKR/day limits, priority dispute SLA, and a dedicated merchant dashboard. Merchants are the backbone of our liquidity.' },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/fees" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Fees</Link>
        <Link href="/help" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Help</Link>
        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 700 }}>About</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/login" style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', color: '#374151' }}>Login</Link>
          <Link href="/register" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇵🇰</div>
        <h1 style={{ fontSize: '38px', fontWeight: 900, color: 'white', marginBottom: '12px' }}>Built for Pakistan.<br />Built for Trust.</h1>
        <p style={{ fontSize: '17px', color: '#93c5fd', maxWidth: '600px', margin: '0 auto' }}>PakSwap is Pakistan's first peer-to-peer crypto exchange designed specifically around how Pakistanis pay — JazzCash, Easypaisa, bank transfers — with CNIC-based identity and full compliance from day one.</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '48px', marginTop: '-32px' }}>
          {[
            { num: '12K+', lbl: 'Registered Users' },
            { num: '₨4.2B', lbl: 'Total Volume Traded' },
            { num: '99.1%', lbl: 'Trade Completion Rate' },
            { num: '2 hr', lbl: 'Avg Dispute Resolution' },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center', padding: '24px 16px', background: 'white', borderRadius: '14px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#2563eb' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>Our Story</h2>
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '28px', fontSize: '15px', color: '#374151', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '16px' }}>PakSwap was founded in 2025 by a team of fintech and blockchain engineers who kept running into the same problem: existing crypto platforms weren't built for Pakistan.</p>
            <p style={{ marginBottom: '16px' }}>International exchanges often block Pakistani IP addresses, don't support local payment methods, require foreign bank accounts, and offer no recourse when trades go wrong. Local alternatives were informal, unregulated, and rife with scams.</p>
            <p style={{ margin: 0 }}>We built PakSwap to fix that. A fully escrow-backed P2P marketplace where every user is CNIC-verified, every payment is human-reviewed before crypto is released, and disputes are resolved by a real team — not an algorithm.</p>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>What We Stand For</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {values.map(v => (
              <div key={v.title} style={{ display: 'flex', gap: '16px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>{v.title}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>The Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {team.map(t => (
              <div key={t.name} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white', margin: '0 auto 14px' }}>{t.init}</div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, margin: '4px 0' }}>{t.role}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Security */}
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '32px', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginBottom: '20px', textAlign: 'center' }}>How We Protect Your Funds</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', textAlign: 'center' }}>
            {[
              { icon: '🏦', title: 'Escrow Protection', desc: 'Seller\'s crypto is locked before payment is sent. Released only after admin confirms payment.' },
              { icon: '🔑', title: 'AWS KMS Signing', desc: 'All blockchain transactions signed with hardware-backed KMS keys. Private keys never touch disk.' },
              { icon: '👁️', title: 'Human Review', desc: 'Every payment screenshot is reviewed by a trained admin before any crypto release. No bots.' },
            ].map(p => (
              <div key={p.title}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{p.title}</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 24px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>👋</div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>Ready to trade?</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>Join thousands of Pakistanis already buying and selling crypto safely on PakSwap.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ padding: '14px 28px', background: '#2563eb', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Create Free Account →</Link>
            <Link href="/marketplace" style={{ padding: '14px 28px', border: '1.5px solid #e2e8f0', background: 'white', color: '#374151', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Browse Marketplace</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
