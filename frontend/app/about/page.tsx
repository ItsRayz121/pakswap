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
  ['🔐', 'Security First', 'Every trade is protected by escrow. Crypto doesn\'t move until payment is confirmed by a human admin — not an automated script. We use AWS KMS for key signing and never hold private keys on-disk.'],
  ['🤝', 'Trader Protection', 'Our two-layer payment verification means screenshots are OCR-checked AND human-reviewed before any release. Fraud attempts trigger an immediate freeze and investigation.'],
  ['🇵🇰', 'Pakistan-Native', 'JazzCash, Easypaisa, Sadapay, HBL, UBL, MCB, Meezan — all supported. CNIC KYC with Urdu-friendly flows. PKR denomination throughout. Pakistan Standard Time everywhere.'],
  ['⚖️', 'Compliance-Ready', 'KYC, AML transaction monitoring, and full audit trails built in from day one. We operate with a long-term view of regulatory compliance in Pakistan\'s evolving crypto landscape.'],
  ['📊', 'Transparency', 'Our fee schedule is public. Spreads are shown before you trade. No surprise deductions. Every admin action on your account is logged and visible in your account history.'],
  ['🚀', 'Merchant Ecosystem', 'We invest in our merchant partners — verified badge, 5M PKR/day limits, priority dispute SLA, and a dedicated merchant dashboard. Merchants are the backbone of our liquidity.'],
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/fees" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Fees</Link>
          <Link href="/help" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Help</Link>
          <Link href="/about" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>About</Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Login</button></Link>
          <Link href="/register"><button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Get Started</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🇵🇰</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: 'white', marginBottom: 12 }}>Built for Pakistan.<br />Built for Trust.</h1>
        <p style={{ fontSize: 17, color: '#93c5fd', maxWidth: 600, margin: '0 auto' }}>PakSwap is Pakistan's first peer-to-peer crypto exchange designed specifically around how Pakistanis pay — JazzCash, Easypaisa, bank transfers — with CNIC-based identity and full compliance from day one.</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 48px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 48, marginTop: -32 }}>
          {[['12K+', 'Registered Users'], ['₨4.2B', 'Total Volume Traded'], ['99.1%', 'Trade Completion Rate'], ['2 hr', 'Avg Dispute Resolution']].map(([n, l]) => (
            <div key={l} style={{ background: 'white', borderRadius: 14, border: '1.5px solid #e2e8f0', padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#2563eb' }}>{n}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>Our Story</h2>
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 28, fontSize: 15, color: '#374151', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>PakSwap was founded in 2025 by a team of fintech and blockchain engineers who kept running into the same problem: existing crypto platforms weren't built for Pakistan.</p>
            <p style={{ marginBottom: 16 }}>International exchanges often block Pakistani IP addresses, don't support local payment methods, require foreign bank accounts, and offer no recourse when trades go wrong. Local alternatives were informal, unregulated, and rife with scams.</p>
            <p style={{ marginBottom: 0 }}>We built PakSwap to fix that. A fully escrow-backed P2P marketplace where every user is CNIC-verified, every payment is human-reviewed before crypto is released, and disputes are resolved by a real team — not an algorithm.</p>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>What We Stand For</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {values.map(([icon, title, text]) => (
              <div key={title} style={{ display: 'flex', gap: 16, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>The Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {team.map(({ init, bg, name, role, desc }) => (
              <div key={name} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', margin: '0 auto 14px' }}>{init}</div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{name}</div>
                <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, margin: '4px 0' }}>{role}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe', borderRadius: 16, padding: 32, marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 20, textAlign: 'center' }}>How We Protect Your Funds</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, textAlign: 'center' }}>
            {[['🏦', 'Escrow Protection', "Seller's crypto is locked before payment is sent. Released only after admin confirms payment."], ['🔑', 'AWS KMS Signing', 'All blockchain transactions signed with hardware-backed KMS keys. Private keys never touch disk.'], ['👁️', 'Human Review', 'Every payment screenshot is reviewed by a trained admin before any crypto release. No bots.']].map(([icon, title, text]) => (
              <div key={title}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 24px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>👋</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>Ready to trade?</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Join thousands of Pakistanis already buying and selling crypto safely on PakSwap.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register"><button style={{ padding: '13px 28px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Create Free Account →</button></Link>
            <Link href="/marketplace"><button style={{ padding: '13px 28px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Browse Marketplace</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
