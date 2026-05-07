'use client'
import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface TeamMember {
  id: string
  fullName: string
  email: string
  role: string
  status: string
  lastLoginAt: string | null
  createdAt: string
}

const ROLES = ['admin', 'kyc_reviewer', 'dispute_agent', 'support', 'user'] as const

const ROLE_META: Record<string, { label: string; bg: string; color: string; desc: string }> = {
  super_admin:    { label: 'Super Admin',    bg: '#1e1b4b', color: '#a5b4fc', desc: 'Full platform control · cannot be revoked' },
  admin:          { label: 'Admin',          bg: '#eff6ff', color: '#1d4ed8', desc: 'Full admin panel access' },
  kyc_reviewer:   { label: 'KYC Reviewer',  bg: '#f0fdf4', color: '#065f46', desc: 'KYC queue only' },
  dispute_agent:  { label: 'Dispute Agent', bg: '#fff7ed', color: '#c2410c', desc: 'Dispute resolution only' },
  support:        { label: 'Support',        bg: '#fdf4ff', color: '#7e22ce', desc: 'Read-only support access' },
  user:           { label: 'User',           bg: '#f1f5f9', color: '#64748b', desc: 'No admin access' },
}

export default function AdminTeamPage() {
  const { user: me } = useAuthStore()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('admin')
  const [inviting, setInviting] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [changingRole, setChangingRole] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await adminApi.getTeam()
      setTeam(r.data.data ?? [])
    } catch { setTeam([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function invite() {
    if (!inviteEmail.includes('@')) { setMsg({ text: 'Enter a valid email.', ok: false }); return }
    setInviting(true)
    setMsg(null)
    try {
      const r = await adminApi.inviteTeam(inviteEmail, inviteRole)
      if (r.data.success) {
        setMsg({ text: r.data.message ?? `${inviteEmail} added as ${inviteRole}`, ok: true })
        setInviteEmail('')
        load()
      } else {
        setMsg({ text: r.data.message ?? 'Failed.', ok: false })
      }
    } catch (e: any) {
      setMsg({ text: e?.response?.data?.message ?? 'Failed.', ok: false })
    } finally { setInviting(false) }
  }

  async function changeRole(userId: string, role: string) {
    setChangingRole(userId)
    setMsg(null)
    try {
      const r = await adminApi.changeTeamRole(userId, role)
      setMsg({ text: r.data.message ?? 'Role updated.', ok: true })
      load()
    } catch (e: any) {
      setMsg({ text: e?.response?.data?.message ?? 'Failed.', ok: false })
    } finally { setChangingRole(null) }
  }

  async function revoke(member: TeamMember) {
    if (!confirm(`Revoke ${member.fullName}'s admin access? They will become a regular user.`)) return
    setRevoking(member.id)
    setMsg(null)
    try {
      const r = await adminApi.revokeTeam(member.id)
      setMsg({ text: r.data.message ?? 'Access revoked.', ok: true })
      load()
    } catch (e: any) {
      setMsg({ text: e?.response?.data?.message ?? 'Failed.', ok: false })
    } finally { setRevoking(null) }
  }

  const isSelf = (id: string) => id === me?.id
  const canModify = (m: TeamMember) => m.role !== 'super_admin' && !isSelf(m.id)
  const initials = (name: string) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Team Management</h1>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Invite staff and manage their admin panel access · super_admin only</div>
      </div>

      {/* Role legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {Object.entries(ROLE_META).map(([role, { label, bg, color, desc }]) => (
          <div key={role} style={{ background: bg, borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
            <span style={{ fontWeight: 700, color }}>{label}</span>
            <span style={{ color: '#94a3b8', marginLeft: 6 }}>{desc}</span>
          </div>
        ))}
      </div>

      {msg && (
        <div style={{ background: msg.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.ok ? '#86efac' : '#fecaca'}`, borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: msg.ok ? '#065f46' : '#dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Invite panel */}
      <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #2563eb', padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: '#1e293b' }}>Invite / Promote by Email</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
          The person must already have a PakSwap account. Enter their email and assign a role.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Email address</label>
            <input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && invite()}
              placeholder="colleague@example.com"
              type="email"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Role</label>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}
            >
              {ROLES.filter(r => r !== 'user').map(r => (
                <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>
              ))}
            </select>
          </div>
          <button
            onClick={invite}
            disabled={inviting}
            style={{ padding: '10px 22px', background: inviting ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
          >
            {inviting ? 'Adding...' : '+ Add to Team'}
          </button>
        </div>
      </div>

      {/* Team table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr auto', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Member</span><span>Role</span><span>Last Login</span><span>Added</span><span>Actions</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</div>
        ) : team.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No team members yet.</div>
        ) : team.map(member => {
          const rm = ROLE_META[member.role] ?? ROLE_META.user
          const self = isSelf(member.id)
          const modifiable = canModify(member)
          return (
            <div key={member.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr auto', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', gap: 10, fontSize: 13, background: self ? '#fafbff' : 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: member.role === 'super_admin' ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {initials(member.fullName)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{member.fullName} {self && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>(you)</span>}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{member.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {modifiable ? (
                  <select
                    value={member.role}
                    onChange={e => changeRole(member.id, e.target.value)}
                    disabled={changingRole === member.id}
                    style={{ padding: '5px 8px', border: `1.5px solid ${rm.color}`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: rm.color, background: rm.bg, outline: 'none', cursor: 'pointer' }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>)}
                  </select>
                ) : (
                  <span style={{ background: rm.bg, color: rm.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{rm.label}</span>
                )}
                {changingRole === member.id && <span style={{ fontSize: 11, color: '#94a3b8' }}>saving...</span>}
              </div>

              <span style={{ color: '#64748b', fontSize: 12 }}>
                {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString() : 'Never'}
              </span>
              <span style={{ color: '#64748b', fontSize: 12 }}>
                {new Date(member.createdAt).toLocaleDateString()}
              </span>

              <div>
                {modifiable && member.role !== 'user' ? (
                  <button
                    onClick={() => revoke(member)}
                    disabled={revoking === member.id}
                    style={{ padding: '6px 12px', background: 'white', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {revoking === member.id ? '...' : 'Revoke'}
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: '#cbd5e1' }}>{member.role === 'super_admin' ? '🔒' : '—'}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
