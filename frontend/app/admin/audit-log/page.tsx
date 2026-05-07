'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface AuditEntry {
  id: string
  adminId: string
  admin?: { fullName: string; email: string }
  action: string
  targetType: string
  targetId: string
  details?: any
  createdAt: string
  ip?: string
}

export default function AdminAuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.auditLog({ page, limit: 50 })
      setEntries(r.data.data ?? r.data ?? [])
      setTotal(r.data.meta?.total ?? 0)
    } catch { setEntries([]) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const actionColor = (action: string) => {
    if (action.includes('approve') || action.includes('complete')) return '#065f46'
    if (action.includes('reject') || action.includes('ban') || action.includes('suspend')) return '#dc2626'
    return '#1d4ed8'
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Audit Log</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{total.toLocaleString()} total entries · immutable record of admin actions</div>
        </div>
        <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Admin</span><span>Action</span><span>Target</span><span>IP</span><span>Time</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No audit entries found.</div>
        ) : entries.map(e => (
          <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{e.admin?.fullName ?? e.adminId.slice(0, 8)}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>{e.admin?.email}</div>
            </div>
            <span style={{ fontWeight: 700, color: actionColor(e.action), fontFamily: 'monospace', fontSize: 12 }}>{e.action}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{e.targetType}</div>
              <div style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{e.targetId.slice(0, 10)}</div>
            </div>
            <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{e.ip ?? '—'}</span>
            <span style={{ color: '#64748b' }}>{new Date(e.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {total > 50 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
          <span style={{ padding: '8px 16px', fontSize: 13, color: '#64748b' }}>Page {page} of {Math.ceil(total / 50)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 50)} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
