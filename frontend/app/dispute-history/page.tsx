'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Filter = 'all' | 'active' | 'resolved'

interface Detail { id: string; role: string; type: string; amount: string; outcome: 'won' | 'lost'; opened: string; resolved: string; note: string }

const resolvedDisputes: Detail[] = [
  { id: 'DIS-2026-00051', role: 'Buyer', type: 'BUY USDT', amount: '35.71 USDT', outcome: 'won', opened: '15 Apr 2026', resolved: '17 Apr 2026', note: 'Payment confirmed by admin — 35.71 USDT released to buyer (you).' },
  { id: 'DIS-2026-00019', role: 'Seller', type: 'SELL USDT', amount: '50.00 USDT', outcome: 'won', opened: '02 Feb 2026', resolved: '03 Feb 2026', note: 'Buyer confirmed payment received after admin evidence review. USDT released from escrow.' },
]

export default function DisputeHistoryPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [detail, setDetail] = useState<Detail | null>(null)
  const [timer, setTimer] = useState(3 * 60 + 22)

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const timerStr = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')} remaining`

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link href="/orders" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Orders</Link>
          <Link href="/dispute-history" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Disputes</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>M</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Dispute Center</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0 }}>View and manage your current and past trade disputes</p>
          </div>
          <Link href="/dispute/DIS-2026-00088"><button style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>⚖️ View Active Dispute</button></Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[['3', 'Total Disputes', ''], ['1', 'Active', '#ef4444'], ['2', 'Resolved (Won)', '#10b981'], ['0', 'Lost', '#64748b']].map(([v, l, c]) => (
            <div key={l} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: c || '#1e293b' }}>{v}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {[{ key: 'all', label: 'All (3)' }, { key: 'active', label: 'Active (1)' }, { key: 'resolved', label: 'Resolved (2)' }].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key as Filter)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: filter === key ? 700 : 500, color: filter === key ? '#1d4ed8' : '#64748b', background: filter === key ? 'white' : 'transparent', border: 'none', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>

        {/* Active Dispute */}
        {(filter === 'all' || filter === 'active') && (
          <div style={{ background: '#fff8f8', border: '1.5px solid #ef4444', borderRadius: 14, padding: '18px 20px', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>⚖️</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>#DIS-2026-00088</span>
                    <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🔴 Under Review</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>Trade #PKS-472 · Opened 05 May 2026 · Agent: Ali K.</div>
                </div>
              </div>
              <Link href="/dispute/DIS-2026-00088"><button onClick={e => e.stopPropagation()} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Case →</button></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 12, fontSize: 13 }}>
              {[['You opened as', 'Buyer'], ['Trade Type', 'BUY USDT'], ['Amount at Stake', '17.82 USDT'], ['SLA Remaining', timerStr.split(' ')[0]]].map(([l, v], i) => (
                <div key={l} style={{ background: '#fef2f2', borderRadius: 8, padding: 10 }}>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontWeight: 700, color: i >= 2 ? '#ef4444' : undefined }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', background: '#fef2f2', borderRadius: 8, padding: '10px 12px' }}>
              <strong style={{ color: '#dc2626' }}>Your claim:</strong> "I sent 5,000 PKR via JazzCash (TX: JZ2026050500834) but seller claims not received."
            </div>
          </div>
        )}

        {/* Resolved Disputes */}
        {(filter === 'all' || filter === 'resolved') && resolvedDisputes.map(d => (
          <div key={d.id} onClick={() => setDetail(detail?.id === d.id ? null : d)} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>✅</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>#{d.id}</span>
                    <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Resolved — Won</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>Opened {d.opened} · Resolved {d.resolved}</div>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setDetail(detail?.id === d.id ? null : d) }} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600 }}>View Details →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, fontSize: 13 }}>
              {[['Your Role', d.role], ['Trade', `${d.type} ${d.amount}`], ['Outcome', '✓ You Won'], ['Duration', d.id.includes('051') ? '2 days' : '1 day']].map(([l, v]) => (
                <div key={l} style={{ background: '#f0fdf4', borderRadius: 8, padding: 10 }}>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontWeight: 700, color: l === 'Outcome' ? '#059669' : undefined }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Detail Panel */}
        {detail && (
          <div style={{ marginTop: 16, background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Dispute #{detail.id}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{detail.type} · Opened {detail.opened}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600 }}>← Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 20 }}>
              {[{ label: 'Your Role', value: detail.role, bg: '#f8fafc', color: '' }, { label: 'Amount', value: detail.amount, bg: '#f8fafc', color: '#2563eb' }, { label: 'Outcome', value: 'Won ✓', bg: '#d1fae5', color: '#059669' }, { label: 'Opened', value: detail.opened, bg: '#f8fafc', color: '' }, { label: 'Resolved', value: detail.resolved, bg: '#f8fafc', color: '' }].map(({ label, value, bg, color }) => (
                <div key={label} style={{ background: bg, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: color || '#1e293b' }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Resolution Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[`${detail.opened} · 2:30 PM — Dispute opened — evidence submitted`, `${detail.opened} · 4:00 PM — Admin assigned — SLA timer started`, `${detail.resolved} · 10:00 AM — Additional evidence requested from both parties`, `${detail.resolved} · 11:15 AM — ${detail.note}`].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: 14, fontSize: 13, color: '#065f46' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Admin Decision Note:</div>
              <div>{detail.note}</div>
            </div>
          </div>
        )}

        {/* Help CTA */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Need help understanding dispute outcomes?</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Read our guide on how disputes work and how to submit strong evidence.</div>
          </div>
          <Link href="/help"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>📚 Dispute Guide</button></Link>
        </div>
      </div>
    </div>
  )
}
