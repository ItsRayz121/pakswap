'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [edits, setEdits] = useState<Record<string, string>>({})

  useEffect(() => {
    adminApi.auditLog // just confirm api exists
    adminApi.stats().then(() => {}).catch(() => {}) // warmup
    // @ts-ignore
    if (typeof adminApi.getConfig === 'function') {
      // @ts-ignore
      adminApi.getConfig().then((r: any) => {
        const data = r.data.data ?? r.data ?? {}
        setConfig(data)
        const e: Record<string, string> = {}
        Object.entries(data).forEach(([k, v]) => { e[k] = String(v) })
        setEdits(e)
      }).catch(() => {}).finally(() => setLoading(false))
    } else {
      // Fallback: use adminApi config endpoints directly
      fetch((process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000') + '/api/admin/config', {
        headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}` }
      }).then(r => r.json()).then(data => {
        const d = data.data ?? data ?? {}
        setConfig(d)
        const e: Record<string, string> = {}
        Object.entries(d).forEach(([k, v]) => { e[k] = String(v) })
        setEdits(e)
      }).catch(() => {}).finally(() => setLoading(false))
    }
  }, [])

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      const patch: Record<string, any> = {}
      Object.entries(edits).forEach(([k, v]) => {
        const orig = String(config[k])
        if (v !== orig) patch[k] = isNaN(Number(v)) ? v : Number(v)
      })
      if (Object.keys(patch).length === 0) { setMsg('No changes to save.'); setSaving(false); return }
      await fetch((process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000') + '/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}` },
        body: JSON.stringify(patch),
      })
      setConfig(prev => ({ ...prev, ...patch }))
      setMsg('Configuration saved.')
    } catch (e: any) {
      setMsg('Failed to save.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Platform Configuration</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Live settings — changes take effect immediately</div>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: saving ? '#86efac' : '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      {msg && <div style={{ background: msg.includes('Failed') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.includes('Failed') ? '#fecaca' : '#86efac'}`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: msg.includes('Failed') ? '#dc2626' : '#065f46' }}>{msg}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#94a3b8' }}>Loading config...</div>
      ) : Object.keys(config).length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', color: '#94a3b8' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
          No configuration entries found.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {Object.entries(config).map(([key, origVal], i) => {
            const changed = edits[key] !== String(origVal)
            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', padding: '14px 20px', borderBottom: i < Object.keys(config).length - 1 ? '1px solid #f1f5f9' : 'none', gap: 16, background: changed ? '#fffbeb' : 'white' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', fontFamily: 'monospace' }}>{key}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Current: {String(origVal)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    value={edits[key] ?? ''}
                    onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ flex: 1, padding: '8px 12px', border: `1.5px solid ${changed ? '#fde68a' : '#e2e8f0'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                  {changed && <span style={{ fontSize: 11, color: '#d97706', fontWeight: 700, flexShrink: 0 }}>Modified</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
