'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InstantBuyConfirmPage() {
  const [reviewDone, setReviewDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReviewDone(true), 8000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f1f5f9', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Home</Link>
          <Link href="/marketplace" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none' }}>Marketplace</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>M</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', marginBottom: '20px', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>✅</div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '20px' }}>Your payment has been received. We're now verifying it and processing your crypto.</p>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 20px', display: 'inline-block' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>Order ID</div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}>IBO-2026-004521</div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>📋 Order Summary</div>
          {[
            ['You paid', '28,300 PKR', false, '#1e293b'],
            ['You receive', '100.00 USDT', false, '#059669'],
            ['Rate', '283 PKR / USDT', false, '#1e293b'],
            ['Spread fee', '1.5% (included in rate)', false, '#1e293b'],
            ['Payment method', '📱 JazzCash', false, '#1e293b'],
            ['Network', 'TRC-20 (TRON)', false, '#1e293b'],
            ['Destination wallet', 'Your PakSwap Wallet', false, '#2563eb'],
            ['Order placed', '06 May 2026 · 14:32 PKT', true, '#1e293b'],
          ].map(([label, value, mono, color], i) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 7 ? '1px solid #f1f5f9' : 'none', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ fontWeight: mono ? 600 : 800, fontSize: label === 'You paid' || label === 'You receive' ? '16px' : '14px', color: color as string, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* What Happens Next */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>⏱️ What Happens Next</div>
          <div>
            {[
              { icon: '✓', iconBg: '#d1fae5', iconColor: '#065f46', title: 'Payment Received', desc: 'Your JazzCash payment has been received by our system.', status: '✓ Completed · 14:32 PKT', statusColor: '#059669', active: false },
              { icon: '🔍', iconBg: '#dbeafe', iconColor: '#2563eb', title: 'Admin Verification', desc: 'Our team is reviewing your payment screenshot and transaction record. This typically takes 5–15 minutes.', status: reviewDone ? '✓ Verified — crypto releasing now' : '⏳ In progress...', statusColor: '#2563eb', active: true },
              { icon: '💰', iconBg: '#f1f5f9', iconColor: '#94a3b8', title: 'Crypto Released to Wallet', desc: 'Once verified, 100.00 USDT will appear in your PakSwap wallet instantly.', status: 'Pending verification', statusColor: '#94a3b8', active: false },
              { icon: '📲', iconBg: '#f1f5f9', iconColor: '#94a3b8', title: 'SMS & Email Notification', desc: "You'll receive a confirmation SMS to your registered number and email when the order completes.", status: '', statusColor: '#94a3b8', active: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '10px 0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: s.active ? '#1e293b' : i < 2 ? '#1e293b' : '#94a3b8' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: i < 2 ? '#64748b' : '#94a3b8', marginTop: '2px' }}>{s.desc}</div>
                  {s.status && <div style={{ fontSize: '12px', color: s.statusColor, fontWeight: 600, marginTop: '4px' }}>{s.status}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400e', marginBottom: '8px' }}>⚠️ Important</div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#92400e', lineHeight: 1.8 }}>
            <li>Do <strong>not</strong> request a chargeback from your bank — this will flag your account for fraud review.</li>
            <li>If you don't receive your crypto within <strong>60 minutes</strong>, use the button below to contact support.</li>
            <li>Your order ID is <strong>IBO-2026-004521</strong> — save it for reference.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <Link href="/instant-buy/status/demo" style={{ padding: '14px', borderRadius: '12px', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', textAlign: 'center' }}>
            📡 Track Order Status →
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/wallet" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none', textAlign: 'center' }}>👛 View Wallet</Link>
            <Link href="/" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', color: '#374151', textDecoration: 'none', textAlign: 'center' }}>🏠 Dashboard</Link>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>📤 Share Receipt</button>
          </div>
        </div>

        {/* Support */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px' }}>🎧</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>Need help with this order?</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Support is available 9am – 9pm PKT · Response in under 15 min</div>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Chat</button>
        </div>
      </div>
    </div>
  )
}
