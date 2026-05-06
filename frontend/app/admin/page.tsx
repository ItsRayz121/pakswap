'use client'
import { useState } from 'react'
import Link from 'next/link'

type Section = 'dashboard' | 'kyc' | 'disputes' | 'fraud' | 'trades' | 'users' | 'merchants' | 'advertisements' | 'settings'

const sidebarItems = [
  { section: 'overview', items: [{ id: 'dashboard' as Section, icon: '📊', label: 'Dashboard', badge: null }] },
  {
    section: 'operations', items: [
      { id: 'kyc' as Section, icon: '🪪', label: 'KYC Review', badge: '34' },
      { id: 'disputes' as Section, icon: '⚖️', label: 'Disputes', badge: '5' },
      { id: 'fraud' as Section, icon: '🚨', label: 'Fraud Monitor', badge: '3' },
      { id: 'trades' as Section, icon: '🔄', label: 'Live Trades', badge: null },
    ]
  },
  {
    section: 'management', items: [
      { id: 'users' as Section, icon: '👥', label: 'Users', badge: null },
      { id: 'merchants' as Section, icon: '👑', label: 'Merchants', badge: null },
      { id: 'advertisements' as Section, icon: '📢', label: 'Advertisements', badge: null },
    ]
  },
  { section: 'system', items: [{ id: 'settings' as Section, icon: '⚙️', label: 'Platform Settings', badge: null }] },
]

const metrics1 = [
  { lbl: 'Active Trades', val: '12', color: '#2563eb', icon: '🔄', change: '↑ 3 vs 30min ago', changeColor: '#10b981' },
  { lbl: 'Trades Today', val: '87', color: '#1e293b', icon: '📈', change: '↑ +14% vs yesterday', changeColor: '#10b981' },
  { lbl: 'Volume Today', val: '4.2M', color: '#1e293b', icon: '💰', change: '4,200,000 PKR', changeColor: '#10b981' },
  { lbl: 'Revenue Today', val: '21K', color: '#10b981', icon: '💵', change: '21,000 PKR fees', changeColor: '#10b981' },
]
const metrics2 = [
  { lbl: 'KYC Queue', val: '34', color: '#f59e0b', borderColor: '#f59e0b', change: '⚠️ 8 waiting > 2hrs', changeColor: '#f59e0b' },
  { lbl: 'Open Disputes', val: '5', color: '#ef4444', borderColor: '#ef4444', change: '🔴 1 critical > 3hrs', changeColor: '#ef4444' },
  { lbl: 'New Users Today', val: '42', color: '#1e293b', borderColor: undefined, change: '↑ +8% vs yesterday', changeColor: '#10b981' },
  { lbl: 'Completion Rate', val: '99.1%', color: '#10b981', borderColor: undefined, change: '87/88 trades', changeColor: '#10b981' },
]

export default function AdminPage() {
  const [section, setSection] = useState<Section>('dashboard')
  const [kycReview, setKycReview] = useState(false)
  const [disputeDetail, setDisputeDetail] = useState(false)
  const [rejectForm, setRejectForm] = useState(false)

  const barData = [
    { h: '40%', label: '29 Apr', color: '#bfdbfe', today: false },
    { h: '62%', label: '30 Apr', color: '#3b82f6', today: false },
    { h: '55%', label: '01 May', color: '#3b82f6', today: false },
    { h: '70%', label: '02 May', color: '#3b82f6', today: false },
    { h: '85%', label: '03 May', color: '#3b82f6', today: false },
    { h: '78%', label: '04 May', color: '#3b82f6', today: false },
    { h: '100%', label: 'Today', color: '#1d4ed8', today: true },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter',sans-serif", background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#1e293b', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Pak<span style={{ color: '#3b82f6' }}>Swap</span></div>
          <div style={{ fontSize: 12, color: '#60a5fa', background: '#1e40af22', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginTop: 6 }}>⚙️ Admin Panel</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Ahmad S. · Super Admin</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {sidebarItems.map(({ section: sec, items }) => (
            <div key={sec}>
              <div style={{ padding: '12px 16px 4px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sec}</div>
              {items.map(({ id, icon, label, badge }) => (
                <button key={id} onClick={() => { setSection(id); setKycReview(false); setDisputeDetail(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontSize: 14, borderLeft: `3px solid ${section === id ? '#3b82f6' : 'transparent'}`, background: section === id ? '#1e40af22' : 'transparent', color: section === id ? '#60a5fa' : '#94a3b8' }}>
                  <span>{icon}</span>
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge && <span style={{ background: '#ef4444', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{badge}</span>}
                </button>
              ))}
            </div>
          ))}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#475569', textDecoration: 'none' }}>
            <span>🌐</span> Back to Site
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
        <div style={{ padding: 28, maxWidth: 1280 }}>

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', margin: 0 }}>Operations Dashboard</h1>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>05 May 2026 · 3:15 PM PKT · All systems operational 🟢</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>🔄 Refresh</button>
                  <button style={{ padding: '8px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📊 Export Report</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {metrics1.map(({ lbl, val, color, icon, change, changeColor }) => (
                  <div key={lbl} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{lbl}</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color }}>{val}</div>
                      </div>
                      <div style={{ fontSize: 28 }}>{icon}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: changeColor }}>{change}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {metrics2.map(({ lbl, val, color, borderColor, change, changeColor }) => (
                  <div key={lbl} style={{ background: 'white', borderRadius: 14, border: `1px solid #e2e8f0`, borderLeft: borderColor ? `4px solid ${borderColor}` : '1px solid #e2e8f0', padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{lbl}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color }}>{val}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: changeColor }}>{change}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
                {/* Alerts */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>🚨 Active Alerts</div>
                    <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>6 alerts</span>
                  </div>
                  {[
                    { bg: '#fef2f2', border: '#fecaca', dot: '🔴', title: 'Fraud Flag: User #3201', sub: '5 cancelled trades in 2 hours — possible fee manipulation', time: '3 minutes ago', btn: 'Review', btnBg: '#ef4444', action: () => setSection('fraud') },
                    { bg: '#fef2f2', border: '#fecaca', dot: '🔴', title: 'Dispute #D087 Escalating', sub: 'Over 3 hours without resolution — 40K PKR at stake', time: '15 minutes ago', btn: 'Resolve', btnBg: '#ef4444', action: () => setSection('disputes') },
                    { bg: '#fffbeb', border: '#fde68a', dot: '🟡', title: 'KYC Queue Warning', sub: '34 pending — 8 users waiting over 2 hours (SLA breach)', time: '', btn: 'Process', btnBg: '#fef3c7', action: () => setSection('kyc') },
                    { bg: '#fffbeb', border: '#fde68a', dot: '🟡', title: 'Duplicate CNIC Detected', sub: 'New account #4102 shares CNIC with banned user #1122', time: '', btn: 'Investigate', btnBg: '#f1f5f9', action: () => {} },
                  ].map(({ bg, border, dot, title, sub, time, btn, btnBg, action }) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 10, marginBottom: 8, background: bg, border: `1px solid ${border}` }}>
                      <span style={{ fontSize: 20 }}>{dot}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
                        {time && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{time}</div>}
                      </div>
                      <button onClick={action} style={{ padding: '6px 12px', background: btnBg, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: btn === 'Review' || btn === 'Resolve' ? 'white' : '#92400e', flexShrink: 0 }}>{btn}</button>
                    </div>
                  ))}
                </div>

                {/* Live Trades */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🔴 Live Trades</div>
                  {[
                    { id: '#PKS-473', type: 'BUY USDT', detail: '35.71 USDT · 10,000 PKR', status: 'Active', statusBg: '#d1fae5', statusColor: '#065f46', dotColor: '#10b981', rowBg: '#ecfdf5' },
                    { id: '#PKS-472', type: 'BUY USDT', detail: '17.82 USDT · 5,000 PKR', status: 'Disputed', statusBg: '#fef3c7', statusColor: '#92400e', dotColor: '#f59e0b', rowBg: '#fffbeb' },
                    { id: '#PKS-471', type: 'SELL BTC', detail: '0.002 BTC · 38,400 PKR', status: 'Escrow', statusBg: '#eff6ff', statusColor: '#1d4ed8', dotColor: '#2563eb', rowBg: '#f8fafc' },
                    { id: '#PKS-470', type: 'BUY ETH', detail: '0.2 ETH · 20,900 PKR', status: 'Active', statusBg: '#d1fae5', statusColor: '#065f46', dotColor: '#10b981', rowBg: '#f8fafc' },
                    { id: '#PKS-469', type: 'SELL USDT', detail: '50 USDT · 14,025 PKR', status: 'Active', statusBg: '#d1fae5', statusColor: '#065f46', dotColor: '#10b981', rowBg: '#f8fafc' },
                  ].map(({ id, type, detail, status, statusBg, statusColor, dotColor, rowBg }) => (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: rowBg, marginBottom: 6, fontSize: 13 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{id} {type}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{detail}</div>
                      </div>
                      <span style={{ background: statusBg, color: statusColor, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{status}</span>
                    </div>
                  ))}
                  <button onClick={() => setSection('trades')} style={{ width: '100%', padding: 8, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white', marginTop: 8 }}>View All 12 Active →</button>
                </div>
              </div>

              {/* Volume Chart */}
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>Trading Volume (Last 7 Days)</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['7D', '30D', '90D'].map((t, i) => (
                      <button key={t} style={{ padding: '5px 10px', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', background: i === 0 ? '#2563eb' : 'white', color: i === 0 ? 'white' : '#64748b', fontWeight: 600 }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 4px' }}>
                  {barData.map(({ h, label, color, today }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                      <div style={{ width: '100%', background: color, borderRadius: '6px 6px 0 0', height: h, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                        {today && <div style={{ fontSize: 10, color: 'white', padding: '4px 0', fontWeight: 700 }}>4.2M</div>}
                      </div>
                      <div style={{ fontSize: 11, color: today ? '#1d4ed8' : '#64748b', fontWeight: today ? 700 : 400 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: '#64748b', flexWrap: 'wrap', gap: 8 }}>
                  <span>7-day total: <strong style={{ color: '#1e293b' }}>23.4M PKR</strong></span>
                  <span>7-day revenue: <strong style={{ color: '#10b981' }}>117,000 PKR</strong></span>
                  <span>Completion rate: <strong style={{ color: '#10b981' }}>99.1%</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* KYC SECTION */}
          {section === 'kyc' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>KYC Review Queue <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 14, fontWeight: 700 }}>34 Pending</span></h1>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input placeholder="Search name / CNIC / email" style={{ padding: '8px 14px', fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 10, outline: 'none', width: 220 }} />
                  <select style={{ padding: '8px 12px', fontSize: 13, border: '1.5px solid #e2e8f0', borderRadius: 10, outline: 'none' }}>
                    <option>Oldest First</option><option>Newest First</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>#</span><span>Name</span><span>Submitted</span><span>Wait Time</span><span>Level</span><span>Action</span>
                </div>
                {[
                  { id: '2814', init: 'M', bg: 'linear-gradient(135deg,#1e3a5f,#2563eb)', name: 'Muhammad Usman', email: 'm.usman@gmail.com', time: '3:00 PM', wait: '2h 14m ⚠️', waitColor: '#ef4444', level: 'Full KYC', levelBg: '#eff6ff', levelColor: '#1d4ed8' },
                  { id: '2815', init: 'F', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', name: 'Fatima Khan', email: 'fatima.k@gmail.com', time: '3:30 PM', wait: '1h 44m', waitColor: '#f59e0b', level: 'Basic KYC', levelBg: '#f1f5f9', levelColor: '#64748b' },
                  { id: '2816', init: 'A', bg: 'linear-gradient(135deg,#059669,#34d399)', name: 'Ali Hassan', email: 'ali.h@email.com', time: '4:00 PM', wait: '1h 14m', waitColor: '#64748b', level: 'Full KYC', levelBg: '#eff6ff', levelColor: '#1d4ed8' },
                ].map(({ id, init, bg, name, email, time, wait, waitColor, level, levelBg, levelColor }) => (
                  <div key={id} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, cursor: 'pointer', fontSize: 14 }} onClick={() => setKycReview(true)}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{init}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{email}</div>
                      </div>
                    </div>
                    <span>{time}</span>
                    <span style={{ color: waitColor, fontWeight: 700 }}>{wait}</span>
                    <span style={{ background: levelBg, color: levelColor, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{level}</span>
                    <button onClick={e => { e.stopPropagation(); setKycReview(true); }} style={{ padding: '6px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Review →</button>
                  </div>
                ))}
                <div style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: '#64748b' }}>Showing 3 of 34</div>
              </div>

              {/* KYC Review Detail */}
              {kycReview && (
                <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Reviewing: Muhammad Usman #2814</div>
                    <button onClick={() => setKycReview(false)} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>← Back to Queue</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[['CNIC FRONT', '🪪 cnic_front.jpg'], ['CNIC BACK', '🪪 cnic_back.jpg'], ['SELFIE', '😊']].map(([label, content]) => (
                      <div key={label} style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>{label}</div>
                        <div style={{ height: 120, background: 'linear-gradient(135deg,#e2e8f0,#f1f5f9)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: label === 'SELFIE' ? 40 : 13, color: '#64748b' }}>{content}</div>
                        <button style={{ marginTop: 8, padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'white' }}>Zoom</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>OCR EXTRACTED</div>
                      {[['Name', 'Muhammad Usman'], ['CNIC', '42201-XXXXXXX-X'], ['DOB', '12 Jan 1992'], ['Expiry', '12 Jan 2030 ✓']].map(([l, v]) => (
                        <div key={l} style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>{l}:</span> <strong>{v}</strong></div>
                      ))}
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Layer 1 — AI Scan Results</div>
                      {['✅ CNIC OCR: Name extracted (Muhammad Usman)', '✅ CNIC Authenticity: Real document detected', '✅ Face Match: 91.4% (DeepFace)', '✅ Liveness: Passed (MediaPipe 0.94)', '✅ Duplicate CNIC: None found', '✅ Sanctions Screening: Clear'].map(t => (
                        <div key={t} style={{ fontSize: 13, color: '#10b981', marginBottom: 4 }}>{t}</div>
                      ))}
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>AI Confidence</span>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: '93%', height: '100%', background: 'linear-gradient(90deg,#2563eb,#059669)', borderRadius: 3 }} /></div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#2563eb' }}>93%</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff7ed', border: '1.5px solid #fde68a', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>👤</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                        Layer 2 — Human Admin Review{' '}
                        <span style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 4, padding: '1px 8px', fontSize: 11, marginLeft: 6 }}>MANDATORY</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#78350f' }}>AI scan is complete. <strong>You must now review documents manually</strong> before approving or rejecting.</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Reviewer Notes (required for rejection)</label>
                    <textarea rows={2} placeholder="Any notes about this submission..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ flex: 1, padding: 13, background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✅ Approve KYC</button>
                    <button onClick={() => setRejectForm(!rejectForm)} style={{ flex: 1, padding: 13, background: '#ef4444', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✗ Reject</button>
                  </div>
                  {rejectForm && (
                    <div style={{ marginTop: 12, background: '#fef2f2', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#dc2626' }}>Select Rejection Reason:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                        {['Image too blurry or unclear', 'CNIC expired', "Name doesn't match account", 'Suspected fake/altered document', 'Liveness check failed'].map(r => (
                          <label key={r} style={{ fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><input type="radio" name="rej" style={{ accentColor: '#ef4444' } as any} /> {r}</label>
                        ))}
                      </div>
                      <button style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm Rejection</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DISPUTES SECTION */}
          {section === 'disputes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Dispute Resolution <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 14, fontWeight: 700 }}>5 Open</span></h1>
              </div>
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  <span>Dispute ID</span><span>Trade</span><span>Amount</span><span>Opened</span><span>Action</span>
                </div>
                {[
                  { id: '#D088', idColor: '#ef4444', trade: '#PKS-472 BUY USDT', parties: 'CryptoKing vs User2814', amount: '5,000 PKR', opened: '2h ago ⚠️', openedColor: '#ef4444' },
                  { id: '#D087', idColor: '#f59e0b', trade: '#PKS-441 SELL BTC', parties: 'BTC_Master vs User0821', amount: '40,000 PKR', opened: '5h ago 🔴', openedColor: '#ef4444' },
                ].map(({ id, idColor, trade, parties, amount, opened, openedColor }) => (
                  <div key={id} onClick={() => setDisputeDetail(true)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: idColor }}>{id}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{trade}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{parties}</div>
                    </div>
                    <strong>{amount}</strong>
                    <span style={{ color: openedColor, fontWeight: 600 }}>{opened}</span>
                    <button onClick={e => { e.stopPropagation(); setDisputeDetail(true); }} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Resolve →</button>
                  </div>
                ))}
              </div>

              {disputeDetail && (
                <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Resolving Dispute #D088</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#eff6ff', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: '#1d4ed8' }}>Buyer's Claim</div>
                      <div style={{ fontSize: 13, color: '#374151' }}>"I sent 5,000 PKR via JazzCash. Transaction ID: JZ2026050500834. Here is my screenshot."</div>
                      <div style={{ marginTop: 8, background: '#e2e8f0', borderRadius: 8, padding: 8, fontSize: 12, cursor: 'pointer' }}>📸 payment_proof.jpg</div>
                    </div>
                    <div style={{ background: '#fef2f2', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: '#dc2626' }}>Seller's Claim</div>
                      <div style={{ fontSize: 13, color: '#374151' }}>"I have not received any payment on my JazzCash account. Buyer is lying."</div>
                      <div style={{ marginTop: 8, background: '#e2e8f0', borderRadius: 8, padding: 8, fontSize: 12, cursor: 'pointer' }}>📊 jazzcash_history.jpg</div>
                    </div>
                  </div>

                  {/* Two Layer */}
                  <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ background: '#1e3a5f', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>🔐 Mandatory Two-Layer Evidence Analysis</div>
                      <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>BOTH LAYERS REQUIRED</span>
                    </div>
                    <div style={{ background: '#f0f7ff', borderBottom: '1px solid #bfdbfe' }}>
                      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #bfdbfe' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>1</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3a5f' }}>Layer 1 — AI Evidence Analysis</div>
                          <div style={{ fontSize: 11, color: '#3b82f6' }}>OCR + transaction verification</div>
                        </div>
                        <span style={{ marginLeft: 'auto', background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Complete</span>
                      </div>
                      <div style={{ padding: '10px 16px' }}>
                        {['JazzCash TX JZ2026050500834 verified — PKR 5,000 at 3:12 PM', 'Buyer screenshot not manipulated (EXIF/pixel analysis clean)', 'Sender name matches buyer KYC name'].map(t => (
                          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>✓</div>
                            <span style={{ flex: 1 }}>{t}</span>
                            <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>PASS</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>2</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#78350f' }}>Layer 2 — Admin Human Decision</div>
                          <div style={{ fontSize: 11, color: '#d97706' }}>You must review evidence and decide below</div>
                        </div>
                        <span style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>ACTION REQUIRED</span>
                      </div>
                      <div style={{ padding: '12px 16px', fontSize: 13, color: '#78350f', background: '#fffbeb' }}>
                        ⚠️ AI has completed analysis. <strong>Your human decision is mandatory</strong> — USDT will not move until you execute a resolution below.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Resolution Decision</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1, border: '2px solid #10b981', background: '#ecfdf5', borderRadius: 10, padding: 12, textAlign: 'center', fontWeight: 700, color: '#065f46', cursor: 'pointer' }}>✅ Release to Buyer<br /><span style={{ fontSize: 12, fontWeight: 400 }}>Payment confirmed</span></div>
                      <div style={{ flex: 1, border: '2px solid #e2e8f0', borderRadius: 10, padding: 12, textAlign: 'center', fontWeight: 700, color: '#374151', cursor: 'pointer' }}>↩ Return to Seller<br /><span style={{ fontSize: 12, fontWeight: 400 }}>Payment not found</span></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Decision Notes (required)</label>
                    <textarea rows={2} defaultValue="JazzCash transaction JZ2026050500834 confirmed. 5,000 PKR received at 3:12 PM from buyer's registered account." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' } as any} /> Notify both parties by SMS</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: '#2563eb' } as any} /> Flag seller for review</label>
                  </div>
                  <button style={{ width: '100%', padding: 14, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Execute Decision & Notify Both Parties</button>
                </div>
              )}
            </div>
          )}

          {/* FRAUD SECTION */}
          {section === 'fraud' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 20 }}>Fraud & Risk Monitoring</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { bg: '#fef2f2', border: '#fca5a5', dot: '🔴', title: 'HIGH: User #3201 — Abnormal Cancellation Pattern', body: '5 cancelled trades in last 2 hours. All cancelled just before timer expiry. Possible fee avoidance or price manipulation.', sub: 'Flagged 3 minutes ago by automated rule: cancel_spike', btns: ['Restrict', 'Investigate', 'False Positive'] },
                  { bg: '#fef2f2', border: '#fca5a5', dot: '🔴', title: 'HIGH: Duplicate CNIC Detected — User #4102', body: 'New account (#4102) registered with CNIC that belongs to banned user #1122. Possible ban evasion.', sub: '', btns: ['Ban Account', 'Review KYC'] },
                  { bg: '#fffbeb', border: '#fde68a', dot: '🟡', title: 'MEDIUM: Merchant CryptoKing — Elevated Dispute Rate', body: 'Dispute rate increased to 8% over last 7 days (normally 0.8%). 4 disputes, won 3. Monitoring for patterns.', sub: '', btns: ['Monitor', 'Notify Merchant'] },
                ].map(({ bg, border, dot, title, body, sub, btns }) => (
                  <div key={title} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{dot}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: dot === '🔴' ? '#dc2626' : '#d97706' }}>{title}</div>
                        <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>{body}</div>
                        {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {btns.map(b => <button key={b} style={{ padding: '6px 12px', background: b === 'Restrict' || b === 'Ban Account' ? '#ef4444' : 'white', color: b === 'Restrict' || b === 'Ban Account' ? 'white' : '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{b}</button>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Risk Rules Engine</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Cancel Spike Rule', 'Flag if >3 cancelled trades in 24hrs'],
                    ['High Dispute Rate', 'Flag if dispute rate >5% over 30 trades'],
                    ['Duplicate CNIC', 'Flag if same CNIC exists on multiple accounts'],
                    ['Volume Spike', "Flag if single trade is 10x user's normal pattern"],
                  ].map(([title, sub]) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#f8fafc', borderRadius: 10, flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Active</span>
                        <button style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'white' }}>Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: 12, padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>+ Add New Rule</button>
              </div>
            </div>
          )}

          {/* USERS SECTION */}
          {section === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>User Management</h1>
                <button style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>📥 Export CSV</button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {[['3,241', 'Total Users', 'white', '#e2e8f0', '#1e293b'], ['2,891', 'KYC Approved', '#d1fae5', '#86efac', '#065f46'], ['218', 'Pending KYC', '#fef3c7', '#fde68a', '#92400e'], ['14', 'Banned', '#fee2e2', '#fca5a5', '#991b1b'], ['42', 'New Today', '#eff6ff', '#bfdbfe', '#1d4ed8']].map(([n, l, bg, border, c]) => (
                  <div key={l} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '10px 18px', fontSize: 13 }}><strong style={{ color: c }}>{n}</strong> <span style={{ color: '#64748b' }}>{l}</span></div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>User</span><span>Joined</span><span>KYC</span><span>Trades</span><span>Volume</span><span>Status</span><span>Action</span>
                </div>
                {[
                  { init: 'M', bg: 'linear-gradient(135deg,#1e3a5f,#2563eb)', name: 'Muhammad Usman', email: 'm.usman@gmail.com · #2814', joined: '12 Jan 2026', kyc: 'Full KYC', kycBg: '#eff6ff', kycColor: '#1d4ed8', trades: '142', volume: '1.2M PKR', status: 'Active', statusBg: '#d1fae5', statusColor: '#065f46' },
                  { init: 'F', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', name: 'Fatima Khan', email: 'fatima.k@gmail.com · #2815', joined: '28 Feb 2026', kyc: 'Basic KYC', kycBg: '#f1f5f9', kycColor: '#64748b', trades: '38', volume: '340K PKR', status: 'Active', statusBg: '#d1fae5', statusColor: '#065f46' },
                  { init: 'A', bg: 'linear-gradient(135deg,#059669,#34d399)', name: 'Ali Hassan', email: 'ali.h@email.com · #2816', joined: '15 Mar 2026', kyc: 'Full KYC', kycBg: '#eff6ff', kycColor: '#1d4ed8', trades: '12', volume: '89K PKR', status: 'Restricted', statusBg: '#fef3c7', statusColor: '#92400e' },
                ].map(({ init, bg, name, email, joined, kyc, kycBg, kycColor, trades, volume, status, statusBg, statusColor }) => (
                  <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{init}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{email}</div>
                      </div>
                    </div>
                    <span style={{ color: '#64748b' }}>{joined}</span>
                    <span style={{ background: kycBg, color: kycColor, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{kyc}</span>
                    <strong>{trades}</strong>
                    <span>{volume}</span>
                    <span style={{ background: statusBg, color: statusColor, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{status}</span>
                    <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections — placeholder */}
          {(['trades', 'merchants', 'advertisements', 'settings'] as Section[]).includes(section) && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 20, textTransform: 'capitalize' }}>{section.replace('-', ' ')}</h1>
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Section content coming soon</div>
                <div style={{ fontSize: 14, color: '#64748b' }}>This section mirrors the admin HTML prototype — view admin.html for full details.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
