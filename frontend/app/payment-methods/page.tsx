'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { walletApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface PaymentMethod {
  id: string
  type: string
  accountNumber?: string
  accountName?: string
  bankName?: string
  iban?: string
  status: string
  createdAt?: string
  tradesCount?: number
}

const TYPE_META: Record<string, { label: string; abbr: string; bg: string; color: string }> = {
  jazzcash:  { label: 'JazzCash',      abbr: 'JCash', bg: '#fef3c7', color: '#92400e' },
  easypaisa: { label: 'Easypaisa',     abbr: 'Easy',  bg: '#d1fae5', color: '#065f46' },
  bank:      { label: 'Bank Transfer', abbr: 'Bank',  bg: '#ede9fe', color: '#5b21b6' },
  nayapay:   { label: 'NayaPay',       abbr: 'Naya',  bg: '#dbeafe', color: '#1d4ed8' },
  sadapay:   { label: 'SadaPay',       abbr: 'Sada',  bg: '#fce7f3', color: '#9d174d' },
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; border: string }> = {
  active:    { bg: '#d1fae5', color: '#065f46', label: '✓ Verified', border: '#10b981' },
  verified:  { bg: '#d1fae5', color: '#065f46', label: '✓ Verified', border: '#10b981' },
  pending:   { bg: '#fef3c7', color: '#92400e', label: '⏳ Under Review', border: '#f59e0b' },
  rejected:  { bg: '#fee2e2', color: '#dc2626', label: '✗ Rejected', border: '#ef4444' },
}

export default function PaymentMethodsPage() {
  const { user } = useAuthStore()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [pmType, setPmType] = useState<'jazzcash' | 'easypaisa' | 'bank' | 'nayapay'>('jazzcash')
  const [phone, setPhone] = useState('')
  const [iban, setIban] = useState('')
  const [bankName, setBankName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?'
  const displayName = user?.fullName?.split(' ')[0] ?? 'Account'

  function loadMethods() {
    walletApi.getPaymentMethods().then(res => {
      setMethods(res.data.data ?? res.data)
    }).catch(() => {
      setMethods([])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { loadMethods() }, [])

  async function submitPM() {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('type', pmType)
      if (pmType !== 'bank') {
        formData.append('accountNumber', phone)
      } else {
        formData.append('bankName', bankName)
        formData.append('iban', iban)
      }
      formData.append('accountName', user?.fullName ?? '')
      if (fileRef.current?.files?.[0]) {
        formData.append('screenshot', fileRef.current.files[0])
      }
      await walletApi.addPaymentMethod(formData)
      setShowModal(false)
      setPhone('')
      setIban('')
      setBankName('')
      loadMethods()
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message ?? 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function removeMethod(id: string) {
    if (!confirm('Remove this payment method?')) return
    try {
      await walletApi.deletePaymentMethod(id)
      setMethods(prev => prev.filter(m => m.id !== id))
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to remove payment method.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <Link href="/settings" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Settings</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{initial}</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{displayName}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Payment Methods</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Manage your verified payment accounts for P2P trading</p>
          </div>
          <button onClick={() => { setShowModal(true); setSubmitError(null) }} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>+ Add Method</button>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#1d4ed8', marginBottom: '20px', marginTop: '16px' }}>
          🔒 <strong>Security Note:</strong> All payment account names must exactly match your KYC name. This protects both buyers and sellers from fraud.
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading payment methods...</div>
        ) : methods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>No payment methods yet</div>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Add a JazzCash, Easypaisa, or bank account to start trading.</div>
            <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>+ Add Payment Method</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Your Methods</div>
            {methods.map(m => {
              const meta = TYPE_META[m.type] ?? { label: m.type, abbr: m.type.slice(0, 4).toUpperCase(), bg: '#f1f5f9', color: '#374151' }
              const st = STATUS_STYLE[m.status] ?? { bg: '#f1f5f9', color: '#64748b', label: m.status, border: '#e2e8f0' }
              return (
                <div key={m.id} style={{ background: 'white', borderLeft: `4px solid ${st.border}`, border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: meta.color }}>{meta.abbr}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800 }}>{meta.label}</span>
                          <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{st.label}</span>
                        </div>
                        {m.accountNumber && <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '2px', fontFamily: 'monospace' }}>{m.accountNumber}</div>}
                        {m.iban && <div style={{ fontSize: '13px', color: '#64748b' }}>IBAN: <strong>{m.iban}</strong></div>}
                        {m.accountName && <div style={{ fontSize: '13px', color: '#64748b' }}>Account Name: <strong>{m.accountName}</strong></div>}
                        {m.bankName && <div style={{ fontSize: '13px', color: '#64748b' }}>Bank: {m.bankName}</div>}
                        {m.status === 'pending' && <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>⏳ Verification in progress — usually 2–4 hours</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => removeMethod(m.id)} style={{ padding: '6px 14px', border: '1.5px solid #fca5a5', background: '#fef2f2', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', marginTop: '24px' }}>Quick Add</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['+ NayaPay', '+ SadaPay', '+ MCB Bank', '+ UBL Bank', '+ Meezan Bank', '+ Bank Alfalah'].map(label => (
            <button key={label} onClick={() => { setShowModal(true); setSubmitError(null) }} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>{label}</button>
          ))}
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#92400e', marginTop: '20px' }}>
          ⚠️ You can have a maximum of <strong>5 active payment methods</strong>. Each must be verified before use in trades. Verification takes 2–4 hours.
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>Add Payment Method</div>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Select payment type:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {([['jazzcash', '⚡', 'JazzCash'], ['easypaisa', '💚', 'Easypaisa'], ['bank', '🏦', 'Bank Transfer'], ['nayapay', '💳', 'NayaPay']] as const).map(([t, icon, label]) => (
                <div key={t} onClick={() => setPmType(t)} style={{ border: `2px solid ${pmType === t ? '#2563eb' : '#e2e8f0'}`, borderRadius: '12px', padding: '14px', cursor: 'pointer', textAlign: 'center', background: pmType === t ? '#eff6ff' : 'white' }}>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{icon}</div>
                  <div style={{ fontWeight: 700 }}>{label}</div>
                </div>
              ))}
            </div>

            {pmType !== 'bank' ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Phone Number</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>🇵🇰 +92</div>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0312-4567890" style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Account Name (must match KYC)</label>
                  <input type="text" value={user?.fullName ?? ''} readOnly style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginTop: '6px' }} />
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ Pre-filled from your KYC — cannot be changed</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Upload Account Screenshot</label>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
                  <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginTop: '6px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>📱</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Upload screenshot showing account name and number</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>JPG, PNG · Max 5MB</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Bank Name</label>
                  <select value={bankName} onChange={e => setBankName(e.target.value)} style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginTop: '6px' }}>
                    <option value="">Select bank...</option>
                    {['HBL — Habib Bank Limited', 'MCB Bank', 'UBL — United Bank Limited', 'Meezan Bank', 'Bank Alfalah', 'Standard Chartered', 'Faysal Bank', 'Other'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Account Title</label>
                  <input type="text" value={user?.fullName ?? ''} readOnly style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginTop: '6px' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>IBAN</label>
                  <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="PK36HABB0000000100000000"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginTop: '6px' }} />
                </div>
              </div>
            )}

            {submitError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>
                ⚠️ {submitError}
              </div>
            )}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1d4ed8', marginBottom: '16px' }}>
              ⏱ Verification takes <strong>2–4 hours</strong>. You'll receive an SMS when approved.
            </div>
            <button onClick={submitPM} disabled={submitting} style={{ width: '100%', padding: '14px', background: submitting ? '#94a3b8' : '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
