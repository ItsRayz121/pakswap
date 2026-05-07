'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

interface KycItem {
  id: string
  userId: string
  user: { fullName: string; email: string; username?: string }
  level: string
  status: string
  createdAt: string
  documents?: { cnicFront?: string; cnicBack?: string; selfie?: string; addressProof?: string }
  aiResults?: any
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function AdminKycPage() {
  const [queue, setQueue] = useState<KycItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<KycItem | null>(null)
  const [approveLevel, setApproveLevel] = useState<'basic' | 'full'>('basic')
  const [notes, setNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.kycQueue()
      setQueue(r.data.data ?? r.data ?? [])
    } catch { setQueue([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function openDetail(item: KycItem) {
    try {
      const r = await adminApi.getKycSubmission(item.id)
      setSelected(r.data.data ?? r.data ?? item)
    } catch { setSelected(item) }
    setNotes('')
    setRejectReason('')
    setMsg('')
  }

  async function approve() {
    if (!selected) return
    setActing(true)
    try {
      await adminApi.approveKyc(selected.id, { level: approveLevel, notes: notes || undefined })
      setMsg('KYC approved.')
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  async function reject() {
    if (!selected || rejectReason.length < 10) { setMsg('Reason must be at least 10 characters.'); return }
    setActing(true)
    try {
      await adminApi.rejectKyc(selected.id, { reason: rejectReason })
      setMsg('KYC rejected.')
      setSelected(null)
      load()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Failed.')
    } finally { setActing(false) }
  }

  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'
  const waitTime = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>KYC Review Queue</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>All submissions require Layer 2 human review</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {queue.length > 0 && <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{queue.length} Pending</span>}
          <button onClick={load} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#065f46' }}>{msg}</div>}

      {selected ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Review: {selected.user.fullName}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{selected.user.email} · Submitted {new Date(selected.createdAt).toLocaleString()}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          </div>

          {/* Documents */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {(['cnicFront', 'cnicBack', 'selfie', 'addressProof'] as const).map(key => {
              const url = selected.documents?.[key]
              const label = { cnicFront: 'CNIC Front', cnicBack: 'CNIC Back', selfie: 'Selfie', addressProof: 'Address Proof' }[key]
              return (
                <div key={key} style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', background: '#f8fafc', textTransform: 'uppercase' }}>{label}</div>
                  {url ? (
                    <a href={`${API_BASE}${url}`} target="_blank" rel="noreferrer">
                      <img src={`${API_BASE}${url}`} alt={label} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    </a>
                  ) : (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>Not provided</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Two-layer badge */}
          <div style={{ background: '#fff7ed', border: '1.5px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
            <strong>Layer 2 — Human Admin Review MANDATORY.</strong> Review the documents above before approving or rejecting.
          </div>

          {/* Approve */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#065f46' }}>✅ Approve KYC</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Verification Level</label>
                <select value={approveLevel} onChange={e => setApproveLevel(e.target.value as any)} style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}>
                  <option value="basic">Basic KYC</option>
                  <option value="full">Full KYC</option>
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Notes (optional)</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button onClick={approve} disabled={acting} style={{ width: '100%', padding: '11px', background: acting ? '#86efac' : '#10b981', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {acting ? 'Processing...' : '✅ Approve'}
              </button>
            </div>
            <div style={{ border: '1.5px solid #fca5a5', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#dc2626' }}>✗ Reject KYC</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Rejection Reason (required, min 10 chars)</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="e.g. Image is blurry and CNIC text not readable." style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{rejectReason.length}/500</div>
              </div>
              <button onClick={reject} disabled={acting} style={{ width: '100%', padding: '11px', background: acting ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {acting ? 'Processing...' : '✗ Reject'}
              </button>
            </div>
          </div>
          {msg && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{msg}</div>}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>User</span><span>Level</span><span>Submitted</span><span>Wait</span><span>Action</span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
          ) : queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              No pending KYC submissions.
            </div>
          ) : queue.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13, cursor: 'pointer' }} onClick={() => openDetail(item)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials(item.user.fullName)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.user.fullName}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{item.user.email}</div>
                </div>
              </div>
              <span style={{ background: item.level === 'full' ? '#eff6ff' : '#f1f5f9', color: item.level === 'full' ? '#1d4ed8' : '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{item.level ?? 'basic'} KYC</span>
              <span style={{ color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span style={{ fontWeight: 600, color: '#64748b' }}>{waitTime(item.createdAt)}</span>
              <button onClick={e => { e.stopPropagation(); openDetail(item) }} style={{ padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Review →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
