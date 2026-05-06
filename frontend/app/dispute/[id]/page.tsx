'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, Lock, Clock, CheckCircle, Send, Paperclip, XCircle } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { toast } from '../../components/ui/toaster'
import axios from 'axios'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: 'Open', color: 'badge-yellow', icon: Clock },
  under_review: { label: 'Under Review', color: 'badge-red', icon: Shield },
  resolved_buyer: { label: 'Resolved — Buyer', color: 'badge-green', icon: CheckCircle },
  resolved_seller: { label: 'Resolved — Seller', color: 'badge-green', icon: CheckCircle },
  closed: { label: 'Closed', color: 'badge-gray', icon: XCircle },
}

function SlaTimer({ createdAt }: { createdAt: string }) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    const slaMs = 4 * 60 * 60 * 1000
    const calc = () => setRemaining(Math.max(0, Math.floor((new Date(createdAt).getTime() + slaMs - Date.now()) / 1000)))
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [createdAt])
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  const urgent = remaining < 1800
  return (
    <span className={`font-mono font-bold ${urgent ? 'text-red-600' : 'text-amber-600'}`}>
      {h}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')} remaining
    </span>
  )
}

export default function DisputePage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken, user } = useAuthStore()
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  const headers = { Authorization: `Bearer ${accessToken}` }

  const { data, isLoading } = useQuery({
    queryKey: ['dispute', id],
    queryFn: () => axios.get(`/api/disputes/${id}`, { headers }),
    refetchInterval: 10000,
  })
  const dispute = data?.data?.data
  const conf = dispute ? (STATUS_CONFIG[dispute.status] ?? STATUS_CONFIG.open) : null

  const sendMsgMutation = useMutation({
    mutationFn: (text: string) => axios.post(`/api/disputes/${id}/messages`, { content: text }, { headers }),
    onSuccess: () => { setMessage(''); qc.invalidateQueries({ queryKey: ['dispute', id] }) },
    onError: (err: any) => toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
  })

  const uploadEvidenceMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('evidence', file)
      return axios.post(`/api/disputes/${id}/evidence`, fd, { headers })
    },
    onSuccess: () => { toast({ type: 'success', title: 'Evidence Uploaded' }); qc.invalidateQueries({ queryKey: ['dispute', id] }) },
    onError: (err: any) => toast({ type: 'error', title: 'Upload Failed', description: err.response?.data?.message })
  })

  const handleSend = () => {
    if (!message.trim()) return
    sendMsgMutation.mutate(message)
  }

  if (isLoading) return <DashboardLayout><div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-xl" /><div className="h-60 bg-gray-200 rounded-xl" /></div></DashboardLayout>

  if (!dispute) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Dispute not found.</div>
    </DashboardLayout>
  )

  const isResolved = ['resolved_buyer', 'resolved_seller', 'closed'].includes(dispute.status)

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dispute Center</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your trade dispute</p>
          </div>
          <a href="/dispute-history" className="text-sm text-brand hover:underline">← All Disputes</a>
        </div>

        {/* Active dispute */}
        <div className={`card p-6 ${!isResolved ? 'border-red-400' : 'border-green-400 bg-green-50/30'}`}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{isResolved ? '✅' : '⚖️'}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-extrabold">{dispute.ref ?? `#DIS-${id}`}</span>
                  {conf && (
                    <span className={`badge ${conf.color} flex items-center gap-1`}>
                      <conf.icon size={12} />
                      {conf.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Trade {dispute.trade?.ref} · Opened {new Date(dispute.createdAt).toLocaleDateString('en-PK')}
                  {dispute.agentName ? ` · Agent: ${dispute.agentName}` : ''}
                </p>
              </div>
            </div>
            {!isResolved && (
              <div className="text-right">
                <p className="text-xs text-gray-500">SLA Response:</p>
                <SlaTimer createdAt={dispute.createdAt} />
              </div>
            )}
          </div>

          {/* Escrow banner */}
          <div className="escrow-banner mb-5">
            <Lock size={18} className="text-brand flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">{dispute.escrowAmount} {dispute.coin} Safely Locked in Escrow</p>
              <p className="text-xs text-gray-500 mt-0.5">Funds are protected and cannot be moved until dispute is resolved</p>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Trade Summary</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className={`badge ${dispute.trade?.side === 'buy' ? 'badge-blue' : 'badge-green'}`}>{dispute.trade?.side?.toUpperCase()} {dispute.coin}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amount</span><strong>{dispute.escrowAmount} {dispute.coin}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">PKR Paid</span><strong>₨{parseFloat(dispute.fiatAmount || '0').toLocaleString('en-PK')}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="pay-pill jcash">{dispute.paymentMethod}</span></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Dispute Details</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Opened by</span><strong>{dispute.openedBy === user?.id ? 'You' : 'Counterparty'}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Reason</span><strong>{dispute.reason ?? '—'}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Agent</span><strong>{dispute.agentName ?? 'Unassigned'}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`badge ${conf?.color}`}>{conf?.label}</span></div>
              </div>
            </div>
          </div>

          {/* Resolution banner */}
          {isResolved && dispute.resolution && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="font-bold text-green-800 mb-1">Decision</p>
              <p className="text-sm text-green-700">{dispute.resolution}</p>
            </div>
          )}

          {/* Evidence */}
          {!isResolved && (
            <div className="mb-5">
              <p className="text-sm font-bold mb-2">Your Evidence</p>
              <div className="flex gap-2 flex-wrap">
                {(dispute.evidence ?? []).map((e: any, i: number) => (
                  <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => window.open(e.url, '_blank')}>
                    <span>📸</span><span>{e.fileName ?? `file_${i + 1}`}</span>
                  </div>
                ))}
                <button className="btn btn-outline btn-sm flex items-center gap-1"
                  onClick={() => fileRef.current?.click()}>
                  <Paperclip size={14} /> Add More
                </button>
                <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadEvidenceMutation.mutate(f) }} />
              </div>
            </div>
          )}

          {/* Support chat */}
          <div>
            <p className="text-sm font-bold mb-2">Communication with Support</p>
            <div className="bg-gray-50 rounded-xl p-4 min-h-40 space-y-3 mb-3 max-h-72 overflow-y-auto">
              {(dispute.messages ?? []).length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-8">No messages yet. A support agent will respond shortly.</p>
              )}
              {(dispute.messages ?? []).map((msg: any) => {
                const isMe = msg.senderId === user?.id
                return (
                  <div key={msg.id} className={isMe ? 'text-right' : ''}>
                    <p className="text-xs text-gray-400 mb-1">{isMe ? 'You' : (msg.senderName ?? 'Support Agent')} · {new Date(msg.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className={`inline-block max-w-xs lg:max-w-sm rounded-xl px-4 py-2.5 text-sm ${isMe ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
            </div>
            {!isResolved && (
              <div className="flex gap-2">
                <input className="form-input flex-1" type="text" placeholder="Type a message to support..."
                  value={message} onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend() }} />
                <button onClick={handleSend} disabled={!message.trim() || sendMsgMutation.isPending}
                  className="btn btn-primary btn-sm flex items-center gap-1">
                  <Send size={14} /> Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
