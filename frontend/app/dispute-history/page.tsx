'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { disputesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

type Filter = 'all' | 'open' | 'resolved'

interface Dispute {
  id: string
  status: string
  tradeId?: string
  createdAt: string
  resolvedAt?: string | null
  resolution?: string | null
  openedBy?: string
  counterpartyId?: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:       { bg: '#fee2e2', color: '#dc2626', label: '🔴 Under Review' },
  escalated:  { bg: '#fee2e2', color: '#dc2626', label: '🔴 Escalated' },
  resolved:   { bg: '#d1fae5', color: '#065f46', label: 'Resolved' },
  closed:     { bg: '#f1f5f9', color: '#475569', label: 'Closed' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DisputeHistoryPage() {
  const { user } = useAuthStore()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Filter>('all')
  const [detail, setDetail] = useState<Dispute | null>(null)

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?'
  const displayName = user?.fullName?.split(' ')[0] ?? 'Account'

  useEffect(() => {
    disputesApi.getAll().then(res => {
      setDisputes(res.data.data ?? res.data)
    }).catch(e => {
      setError(e?.response?.data?.error ?? 'Failed to load disputes')
    }).finally(() => setLoading(false))
  }, [])

  const filtered = disputes.filter(d => {
    if (tab === 'all') return true
    if (tab === 'open') return d.status === 'open' || d.status === 'escalated'
    if (tab === 'resolved') return d.status === 'resolved' || d.status === 'closed'
    return true
  })

  const activeCount = disputes.filter(d => d.status === 'open' || d.status === 'escalated').length
  const resolvedCount = disputes.filter(d => d.status === 'resolved' || d.status === 'closed').length

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        {['Home', 'Orders', 'Disputes'].map(n => (
          <Link key={n} href={`/${n.toLowerCase()}`} style={{ fontSize: '14px', color: n === 'Disputes' ? '#2563eb' : '#64748b', fontWeight: n === 'Disputes' ? 700 : 500, textDecoration: 'none' }}>{n}</Link>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initial}</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{displayName}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Dispute Center</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>View and manage your current and past trade disputes</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { v: String(disputes.length), l: 'Total Disputes', c: '#1e293b' },
            { v: String(activeCount), l: 'Active', c: '#ef4444' },
            { v: String(resolvedCount), l: 'Resolved', c: '#10b981' },
          ].map(s => (
            <div key={s.l} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', gap: '4px', marginBottom: '20px' }}>
          {([['all', `All (${disputes.length})`], ['open', `Active (${activeCount})`], ['resolved', `Resolved (${resolvedCount})`]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: tab === k ? 'white' : 'transparent', color: tab === k ? '#2563eb' : '#64748b', boxShadow: tab === k ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading disputes...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#dc2626' }}>⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚖️</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>No disputes found</div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>All your disputes will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(d => {
              const st = STATUS_STYLE[d.status] ?? { bg: '#f1f5f9', color: '#64748b', label: d.status }
              const isActive = d.status === 'open' || d.status === 'escalated'
              return (
                <div key={d.id}
                  style={{ background: isActive ? '#fff8f8' : 'white', border: `1.5px solid ${isActive ? '#ef4444' : '#e2e8f0'}`, borderRadius: '14px', padding: '18px 20px', cursor: 'pointer' }}
                  onClick={() => setDetail(d)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '28px' }}>{isActive ? '⚖️' : '✅'}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800 }}>#{d.id.slice(0, 12).toUpperCase()}</span>
                          <span style={{ background: st.bg, color: st.color, fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                          {d.tradeId ? `Trade #${d.tradeId.slice(0, 8).toUpperCase()} · ` : ''}Opened {fmtDate(d.createdAt)}
                          {d.resolvedAt ? ` · Resolved ${fmtDate(d.resolvedAt)}` : ''}
                        </div>
                      </div>
                    </div>
                    <Link href={`/dispute/${d.id}`} onClick={e => e.stopPropagation()}
                      style={{ padding: '6px 14px', background: isActive ? '#ef4444' : '#f1f5f9', color: isActive ? 'white' : '#374151', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                      View Case →
                    </Link>
                  </div>
                  {d.resolution && (
                    <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#065f46' }}>
                      <strong>Resolution:</strong> {d.resolution}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Detail panel */}
        {detail && (
          <div style={{ marginTop: '16px', background: 'white', borderRadius: '14px', border: '1.5px solid #2563eb', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>Dispute #{detail.id.slice(0, 12).toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Opened {fmtDate(detail.createdAt)}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>← Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Status', val: STATUS_STYLE[detail.status]?.label ?? detail.status, color: STATUS_STYLE[detail.status]?.color ?? '#64748b' },
                { label: 'Opened', val: fmtDate(detail.createdAt), color: '#1e293b' },
                { label: 'Resolved', val: detail.resolvedAt ? fmtDate(detail.resolvedAt) : '—', color: '#1e293b' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {detail.resolution && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#065f46', marginBottom: '16px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Admin Decision Note:</div>
                <div>{detail.resolution}</div>
              </div>
            )}
            <Link href={`/dispute/${detail.id}`} style={{ display: 'block', padding: '10px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>
              Open Full Dispute →
            </Link>
          </div>
        )}

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
