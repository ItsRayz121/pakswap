'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PaymentMethodsPage() {
  const [showModal, setShowModal] = useState(false)
  const [pmType, setPmType] = useState<'jazzcash' | 'easypaisa' | 'bank' | 'nayapay'>('jazzcash')

  function submitPM() {
    setShowModal(false)
    alert("✅ Payment method submitted!\nVerification will complete in 2–4 hours.\nYou'll receive an SMS when approved.")
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '60px' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>Pak<span style={{ color: '#1e293b' }}>Swap</span></Link>
        <Link href="/marketplace" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/wallet" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
        <Link href="/settings" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Settings</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Payment Methods</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>Manage your verified payment accounts for P2P trading</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>+ Add Method</button>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#1d4ed8', marginBottom: '20px', marginTop: '16px' }}>
          🔒 <strong>Security Note:</strong> All payment account names must exactly match your KYC name. This protects both buyers and sellers from fraud.
        </div>

        <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Active Methods</div>

        {/* JazzCash */}
        <div style={{ background: 'white', borderLeft: '4px solid #10b981', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#92400e' }}>JCash</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800 }}>JazzCash</span>
                  <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✓ Verified</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '2px', fontFamily: 'monospace' }}>0312-4567890</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Account Name: <strong>Muhammad Usman</strong></div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Added 01 May 2026 · Used in 8 trades</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>Active</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => alert('Edit JazzCash details')} style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => confirm('Remove this payment method?') && alert('Removed')} style={{ padding: '6px 14px', border: '1.5px solid #fca5a5', background: '#fef2f2', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* HBL */}
        <div style={{ background: 'white', borderLeft: '4px solid #10b981', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#5b21b6' }}>HBL</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800 }}>HBL Bank Transfer</span>
                  <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✓ Verified</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '2px', fontFamily: 'monospace' }}>XXXX-XXXX-1234</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>IBAN: <strong>PK36HABB0000000100000000</strong></div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Account Title: Muhammad Usman · Added 28 Apr 2026 · Used in 3 trades</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>Active</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ padding: '6px 14px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => confirm('Remove?') && alert('Removed')} style={{ padding: '6px 14px', border: '1.5px solid #fca5a5', background: '#fef2f2', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* Easypaisa pending */}
        <div style={{ background: 'white', borderLeft: '4px solid #f59e0b', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#065f46' }}>Easy</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800 }}>Easypaisa</span>
                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⏳ Under Review</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '2px', fontFamily: 'monospace' }}>0333-9876543</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Account Name: <strong>Muhammad Usman</strong></div>
                <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>⏳ Verification in progress — usually 2–4 hours</div>
              </div>
            </div>
            <button onClick={() => confirm('Cancel this addition?') && alert('Cancelled')} style={{ padding: '6px 14px', border: '1.5px solid #fca5a5', background: '#fef2f2', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#dc2626' }}>Cancel</button>
          </div>
        </div>

        <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Quick Add</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['+ NayaPay', '+ SadaPay', '+ MCB Bank', '+ UBL Bank', '+ Meezan Bank', '+ Bank Alfalah'].map(label => (
            <button key={label} onClick={() => setShowModal(true)} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>{label}</button>
          ))}
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#92400e', marginTop: '20px' }}>
          ⚠️ You can have a maximum of <strong>5 active payment methods</strong>. Each must be verified before use in trades. Verification takes 2–4 hours.
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px' }}>
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
                    <input type="tel" placeholder="0312-4567890" style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Account Name (must match KYC)</label>
                  <input type="text" defaultValue="Muhammad Usman" readOnly style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginTop: '6px' }} />
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ Pre-filled from your KYC — cannot be changed</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Upload Account Screenshot</label>
                  <div onClick={() => alert('File picker opens')} style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginTop: '6px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>📱</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Upload screenshot showing account name and number</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>JPG, PNG · Max 5MB</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {[
                  { label: 'Bank Name', type: 'select' as const },
                  { label: 'Account Title', type: 'text' as const, value: 'Muhammad Usman', readOnly: true },
                  { label: 'IBAN', type: 'text' as const, placeholder: 'PK36HABB0000000100000000' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginTop: '6px' }}>
                        <option>Select bank...</option>
                        {['HBL — Habib Bank Limited', 'MCB Bank', 'UBL — United Bank Limited', 'Meezan Bank', 'Bank Alfalah', 'Standard Chartered', 'Faysal Bank', 'Other'].map(b => <option key={b}>{b}</option>)}
                      </select>
                    ) : (
                      <input type="text" defaultValue={(f as any).value} readOnly={(f as any).readOnly} placeholder={(f as any).placeholder}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: (f as any).readOnly ? '#f8fafc' : 'white', boxSizing: 'border-box', marginTop: '6px' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1d4ed8', marginBottom: '16px' }}>
              ⏱ Verification takes <strong>2–4 hours</strong>. You'll receive an SMS when approved.
            </div>
            <button onClick={submitPM} style={{ width: '100%', padding: '14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Submit for Verification</button>
          </div>
        </div>
      )}
    </div>
  )
}
