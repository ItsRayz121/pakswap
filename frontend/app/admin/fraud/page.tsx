'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface FraudFlag {
  id: string
  userId: string
  user?: { fullName: string; email: string }
  type: string
  severity: string
  description: string
  status: string
  createdAt: string
  reviewedAt?: string
  actionTaken?: string
}

export default function AdminFraudPage() {
  const [flags, setFlags] = useState<FraudFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [actionText, setActionText] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.fraudFlags()
      setFlags(r.data.data ?? r.data ?? [])
    } catch { setFlags([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function review(id: string) {
    const action = actionText[id]?.trim()
    if (!action) { setMsg('Enter the action taken.'); return }
    setActing(id)
    try {
      await adminApi.reviewFlag(id, action)
      setMsg('Flag reviewed.')
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(null) }
  }

  const severityStyle: Record<string, { bg: string; color: string; border: string }> = {
    high: { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' },
    medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    low: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Fraud Monitor</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Automated risk flags requiring admin review</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {flags.filter(f => f.status === 'pending').length > 0 && (
            <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>
              {flags.filter(f => f.status === 'pending').length} Unreviewed
            </span>
          )}
          <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}<button onClick={() => setMsg('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button></div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#94a3b8' }}>Loading...</div>
      ) : flags.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, background: 'white', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🟢</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>No fraud flags</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {flags.map(f => {
            const sev = severityStyle[f.severity] ?? severityStyle.low
            return (
              <div key={f.id} style={{ background: sev.bg, border: `1.5px solid ${sev.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{f.severity === 'high' ? '🔴' : f.severity === 'medium' ? '🟡' : '⚪'}</span>
                      <span style={{ fontWeight: 800, color: sev.color, fontSize: 14 }}>{f.severity.toUpperCase()}: {f.type.replace(/_/g, ' ')}</span>
                      <span style={{ background: f.status === 'pending' ? '#fee2e2' : '#d1fae5', color: f.status === 'pending' ? '#dc2626' : '#065f46', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{f.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{f.description}</div>
                    {f.user && <div style={{ fontSize: 12, color: '#64748b' }}>User: <strong>{f.user.fullName}</strong> ({f.user.email})</div>}
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{new Date(f.createdAt).toLocaleString()}</div>
                    {f.actionTaken && (
                      <div style={{ fontSize: 12, color: '#065f46', marginTop: 6, background: '#d1fae5', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
                        Action taken: {f.actionTaken}
                      </div>
                    )}
                  </div>
                  {f.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: 'column', flexShrink: 0 }}>
                      <input
                        value={actionText[f.id] ?? ''}
                        onChange={e => setActionText(prev => ({ ...prev, [f.id]: e.target.value }))}
                        placeholder="Action taken (e.g. account suspended)"
                        style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 260 }}
                      />
                      <button onClick={() => review(f.id)} disabled={acting === f.id} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        {acting === f.id ? '...' : 'Mark Reviewed'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
