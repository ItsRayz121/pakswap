'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface Withdrawal {
  id: string
  userId: string
  user?: { fullName: string; email: string }
  coin: string
  network: string
  amount: string
  address: string
  status: string
  createdAt: string
  txHash?: string
}

export default function AdminWithdrawalsPage() {
  const [queue, setQueue] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.withdrawals({ status: 'pending' })
      setQueue(r.data.data ?? r.data ?? [])
    } catch { setQueue([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function approve(id: string) {
    setActing(id)
    try {
      await adminApi.approveWithdrawal(id)
      setMsg('Withdrawal approved.')
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(null) }
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) { setMsg('Enter rejection reason.'); return }
    setActing(id)
    try {
      await adminApi.rejectWithdrawal(id, rejectReason)
      setMsg('Withdrawal rejected.')
      setRejectTarget(null)
      setRejectReason('')
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(null) }
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Withdrawal Approvals</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Review and approve pending crypto withdrawals</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {queue.length > 0 && <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{queue.length} Pending</span>}
          <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}<button onClick={() => setMsg('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}>×</button></div>}

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>User</span><span>Coin</span><span>Amount</span><span>Network</span><span>Requested</span><span>Actions</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
        ) : queue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            No pending withdrawals.
          </div>
        ) : queue.map(w => (
          <div key={w.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{w.user?.fullName ?? w.userId.slice(0, 8)}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{w.user?.email}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>{w.address.slice(0, 20)}...</div>
              </div>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{w.coin}</span>
              <strong>{parseFloat(w.amount).toFixed(6)}</strong>
              <span>{w.network}</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>{new Date(w.createdAt).toLocaleString()}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => approve(w.id)} disabled={acting === w.id} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {acting === w.id ? '...' : '✅'}
                </button>
                <button onClick={() => setRejectTarget(w.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✗</button>
              </div>
            </div>
            {rejectTarget === w.id && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'center' }}>
                <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Rejection reason..." style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #fca5a5', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                <button onClick={() => reject(w.id)} disabled={acting === w.id} style={{ padding: '8px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Confirm Reject</button>
                <button onClick={() => { setRejectTarget(null); setRejectReason('') }} style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
