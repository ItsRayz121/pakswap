'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface User {
  id: string
  fullName: string
  email: string
  username?: string
  phone?: string
  role: string
  kycLevel?: string
  kycStatus?: string
  status: string
  tradeCount?: number
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<User | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.users({ page, limit: 20, search: search || undefined })
      setUsers(r.data.data ?? r.data ?? [])
      setTotal(r.data.meta?.total ?? 0)
    } catch { setUsers([]) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

  async function openUser(u: User) {
    try {
      const r = await adminApi.getUser(u.id)
      setSelected(r.data.data ?? r.data ?? u)
    } catch { setSelected(u) }
    setActionReason('')
    setMsg('')
  }

  async function doAction(action: 'suspend' | 'ban' | 'unsuspend') {
    if (!selected) return
    if (action !== 'unsuspend' && !actionReason.trim()) { setMsg('Enter a reason.'); return }
    setActing(true)
    try {
      if (action === 'suspend') await adminApi.suspendUser(selected.id, actionReason)
      else if (action === 'ban') await adminApi.banUser(selected.id, actionReason)
      else await adminApi.unsuspendUser(selected.id)
      setMsg(`User ${action}ed.`)
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  const statusColor: Record<string, { bg: string; color: string }> = {
    active: { bg: '#d1fae5', color: '#065f46' },
    suspended: { bg: '#fef3c7', color: '#92400e' },
    banned: { bg: '#fee2e2', color: '#991b1b' },
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>User Management</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{total.toLocaleString()} total users</div>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}</div>}

      {selected ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{initials(selected.fullName)}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{selected.fullName}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selected.email} · {selected.username ? `@${selected.username}` : 'no username'}</div>
              </div>
            </div>
            <button onClick={() => { setSelected(null); setMsg('') }} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              ['Role', selected.role],
              ['KYC Level', selected.kycLevel ?? 'none'],
              ['KYC Status', selected.kycStatus ?? 'not_submitted'],
              ['Status', selected.status],
              ['Trades', (selected.tradeCount ?? 0).toString()],
              ['Joined', new Date(selected.createdAt).toLocaleDateString()],
            ].map(([l, v]) => (
              <div key={l} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Action Reason</label>
            <input value={actionReason} onChange={e => setActionReason(e.target.value)} placeholder="Reason for suspension/ban..." style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {selected.status !== 'suspended' && selected.status !== 'banned' && (
              <button onClick={() => doAction('suspend')} disabled={acting} style={{ padding: '10px 18px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Suspend</button>
            )}
            {selected.status !== 'banned' && (
              <button onClick={() => doAction('ban')} disabled={acting} style={{ padding: '10px 18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ban</button>
            )}
            {(selected.status === 'suspended' || selected.status === 'banned') && (
              <button onClick={() => doAction('unsuspend')} disabled={acting} style={{ padding: '10px 18px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Unsuspend / Restore</button>
            )}
          </div>
          {msg && <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{msg}</div>}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, email, or username..." style={{ width: '100%', maxWidth: 400, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>User</span><span>KYC</span><span>Trades</span><span>Status</span><span>Joined</span><span>Action</span>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No users found.</div>
            ) : users.map(u => {
              const st = statusColor[u.status] ?? { bg: '#f1f5f9', color: '#64748b' }
              return (
                <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13, cursor: 'pointer' }} onClick={() => openUser(u)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials(u.fullName)}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{u.fullName}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{u.email}</div>
                    </div>
                  </div>
                  <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{u.kycLevel ?? 'none'}</span>
                  <span>{u.tradeCount ?? 0}</span>
                  <span style={{ background: st.bg, color: st.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{u.status}</span>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                  <button onClick={e => { e.stopPropagation(); openUser(u) }} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View →</button>
                </div>
              )
            })}
          </div>
          {total > 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
              <span style={{ padding: '8px 16px', fontSize: 13, color: '#64748b' }}>Page {page} of {Math.ceil(total / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
