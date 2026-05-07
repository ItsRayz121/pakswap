'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Filter = 'all' | 'active' | 'resolved'

interface DetailData {
  id: string; role: string; type: string; amount: string; outcome: string;
  opened: string; resolved: string; note: string;
}

export default function DisputeHistoryPage() {
  const [tab, setTab] = useState<Filter>('all')
  const [detail, setDetail] = useState<DetailData | null>(null)

  const disputes = [
    { id: 'DIS-2026-00088', status: 'active' as const },
    { id: 'DIS-2026-00051', status: 'resolved' as const },
    { id: 'DIS-2026-00019', status: 'resolved' as const },
  ]
  const visible = disputes.filter(d => tab === 'all' || d.status === tab)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        {['Home', 'Orders', 'Disputes'].map(n => (
          <Link key={n} href={`/${n.toLowerCase()}`} style={{ fontSize: '14px', color: n === 'Disputes' ? '#2563eb' : '#64748b', fontWeight: n === 'Disputes' ? 700 : 500, textDecoration: 'none' }}>{n}</Link>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>M</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Dispute Center</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>View and manage your current and past trade disputes</p>
          </div>
          <Link href="/dispute/DIS-2026-00088" style={{ padding: '8px 16px', background: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>⚖️ View Active Dispute</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { v: '3', l: 'Total Disputes', c: '#1e293b' },
            { v: '1', l: 'Active', c: '#ef4444' },
            { v: '2', l: 'Resolved (Won)', c: '#10b981' },
            { v: '0', l: 'Lost', c: '#64748b' },
          ].map(s => (
            <div key={s.l} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', gap: '4px', marginBottom: '20px' }}>
          {([['all', 'All (3)'], ['active', 'Active (1)'], ['resolved', 'Resolved (2)']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: tab === k ? 'white' : 'transparent', color: tab === k ? '#2563eb' : '#64748b', boxShadow: tab === k ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{label}</button>
          ))}
        </div>

        {/* Active dispute card */}
        {(tab === 'all' || tab === 'active') && (
          <div style={{ background: '#fff8f8', border: '1.5px solid #ef4444', borderRadius: '14px', padding: '18px 20px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => window.location.href = '/dispute/DIS-2026-00088'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>⚖️</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800 }}>#DIS-2026-00088</span>
                    <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>🔴 Under Review</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Trade #PKS-472 · Opened 05 May 2026 · Agent: Ali K.</div>
                </div>
              </div>
              <Link href="/dispute/DIS-2026-00088" onClick={e => e.stopPropagation()} style={{ padding: '6px 14px', background: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>View Case →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px', marginBottom: '12px', fontSize: '13px' }}>
              {[['You opened as', 'Buyer'], ['Trade Type', 'BUY USDT'], ['Amount at Stake', '17.82 USDT'], ['SLA Remaining', '3h 22m']].map(([l, v], i) => (
                <div key={l} style={{ background: '#fef2f2', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>{l}</div>
                  <div style={{ fontWeight: 700, color: i >= 2 ? '#ef4444' : '#1e293b' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', background: '#fef2f2', borderRadius: '8px', padding: '10px 12px' }}>
              <strong style={{ color: '#dc2626' }}>Your claim:</strong> "I sent 5,000 PKR via JazzCash (TX: JZ2026050500834) but seller claims not received."
            </div>
          </div>
        )}

        {/* Resolved disputes */}
        {[
          { id: 'DIS-2026-00051', trade: '#PKS-398', dates: 'Opened 15 Apr · Resolved 17 Apr 2026 (2 days)', role: 'Buyer', tradeLabel: 'BUY 35.71 USDT', duration: '2 days', note: 'Payment confirmed by admin — 35.71 USDT released to buyer (you).', opened: '15 Apr 2026', resolved: '17 Apr 2026' },
          { id: 'DIS-2026-00019', trade: '#PKS-201', dates: 'Opened 02 Feb · Resolved 03 Feb 2026 (1 day)', role: 'Seller', tradeLabel: 'SELL 50.00 USDT', duration: '1 day', note: 'Buyer confirmed payment received after admin evidence review. USDT released from escrow.', opened: '02 Feb 2026', resolved: '03 Feb 2026' },
        ].filter(() => tab === 'all' || tab === 'resolved').map(d => (
          <div key={d.id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', marginBottom: '10px', cursor: 'pointer' }}
            onClick={() => setDetail({ id: d.id, role: d.role, type: d.tradeLabel, amount: d.tradeLabel.split(' ')[1] + ' USDT', outcome: 'won', opened: d.opened, resolved: d.resolved, note: d.note })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>✅</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800 }}>#{d.id}</span>
                    <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>Resolved — Won</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Trade {d.trade} · {d.dates}</div>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setDetail({ id: d.id, role: d.role, type: d.tradeLabel, amount: d.tradeLabel.split(' ')[1] + ' USDT', outcome: 'won', opened: d.opened, resolved: d.resolved, note: d.note }) }}
                style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>View Details →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px', fontSize: '13px' }}>
              {[['Your Role', d.role], ['Trade', d.tradeLabel], ['Outcome', '✓ You Won'], ['Duration', d.duration]].map(([l, v], i) => (
                <div key={l} style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>{l}</div>
                  <div style={{ fontWeight: 700, color: i === 2 ? '#059669' : '#1e293b' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Detail panel */}
        {detail && (
          <div style={{ marginTop: '16px', background: 'white', borderRadius: '14px', border: '1.5px solid #2563eb', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>Dispute #{detail.id}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{detail.type} · Opened {detail.opened}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>← Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Your Role', val: detail.role, bg: '#f8fafc', color: '#1e293b' },
                { label: 'Amount', val: detail.amount, bg: '#f8fafc', color: '#2563eb' },
                { label: 'Outcome', val: 'Won ✓', bg: '#d1fae5', color: '#059669' },
                { label: 'Opened', val: detail.opened, bg: '#f8fafc', color: '#1e293b' },
                { label: 'Resolved', val: detail.resolved, bg: '#f8fafc', color: '#1e293b' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#374151' }}>Resolution Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  [`${detail.opened} · 2:30 PM`, 'Dispute opened — evidence submitted'],
                  [`${detail.opened} · 4:00 PM`, 'Admin assigned — SLA timer started'],
                  [`${detail.opened} · 10:00 AM`, 'Additional evidence requested from both parties'],
                  [`${detail.resolved} · 11:15 AM`, detail.note],
                ].map(([time, text]) => (
                  <div key={time} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                    <span style={{ color: '#64748b', minWidth: '120px' }}>{time}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#065f46' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Admin Decision Note:</div>
              <div>{detail.note}</div>
            </div>
          </div>
        )}

        {/* Help CTA */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Need help understanding dispute outcomes?</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Read our guide on how disputes work and how to submit strong evidence.</div>
          </div>
          <Link href="/help" style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', color: '#374151' }}>📚 Dispute Guide</Link>
        </div>
      </div>
    </div>
  )
}
