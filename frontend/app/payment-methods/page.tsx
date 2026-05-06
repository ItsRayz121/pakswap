'use client'
import { useState } from 'react'
import Link from 'next/link'

type PMType = 'jazzcash' | 'easypaisa' | 'bank' | 'nayapay'

export default function PaymentMethodsPage() {
  const [modal, setModal] = useState(false)
  const [pmType, setPmType] = useState<PMType>('jazzcash')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/settings" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Settings</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Payment Methods</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0 }}>Manage your verified payment accounts for P2P trading</p>
          </div>
          <button onClick={() => setModal(true)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add Method</button>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#1e40af', marginBottom: 20 }}>
          🔒 <strong>Security Note:</strong> All payment account names must exactly match your KYC name. This protects both buyers and sellers from fraud.
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Active Methods</div>

        {/* JazzCash */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: 14, padding: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#92400e' }}>JCash</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>JazzCash</span>
                  <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2, fontFamily: 'monospace' }}>0312-4567890</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Account Name: <strong>Muhammad Usman</strong></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Added 01 May 2026 · Used in 8 trades</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Active</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Edit</button>
                <button style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* HBL */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: 14, padding: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#5b21b6' }}>HBL</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>HBL Bank Transfer</span>
                  <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2, fontFamily: 'monospace' }}>XXXX-XXXX-1234</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>IBAN: <strong>PK36HABB0000000100000000</strong></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Account Title: Muhammad Usman · Added 28 Apr 2026 · Used in 3 trades</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Active</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '6px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Edit</button>
                <button style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* Easypaisa pending */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderLeft: '4px solid #f59e0b', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#065f46' }}>Easy</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>Easypaisa</span>
                  <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>⏳ Under Review</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2, fontFamily: 'monospace' }}>0333-9876543</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Account Name: <strong>Muhammad Usman</strong></div>
                <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>⏳ Verification in progress — usually 2–4 hours</div>
              </div>
            </div>
            <button style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>Cancel</button>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Quick Add</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['NayaPay', 'SadaPay', 'MCB Bank', 'UBL Bank', 'Meezan Bank', 'Bank Alfalah'].map(n => (
            <button key={n} onClick={() => { setPmType('bank'); setModal(true) }} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>+ {n}</button>
          ))}
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#92400e', marginTop: 20 }}>
          ⚠️ You can have a maximum of <strong>5 active payment methods</strong>. Each must be verified before use in trades. Verification takes 2–4 hours.
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Add Payment Method</div>
              <button onClick={() => setModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Select payment type:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[{ key: 'jazzcash', icon: '⚡', label: 'JazzCash' }, { key: 'easypaisa', icon: '💚', label: 'Easypaisa' }, { key: 'bank', icon: '🏦', label: 'Bank Transfer' }, { key: 'nayapay', icon: '💳', label: 'NayaPay' }].map(({ key, icon, label }) => (
                <div key={key} onClick={() => setPmType(key as PMType)} style={{ border: `2px solid ${pmType === key ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, padding: 14, cursor: 'pointer', textAlign: 'center', background: pmType === key ? '#eff6ff' : 'white' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                </div>
              ))}
            </div>

            {pmType !== 'bank' ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>🇵🇰 +92</div>
                    <input type="tel" placeholder="0312-4567890" style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as any }} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Account Name (must match KYC)</label>
                  <input type="text" value="Muhammad Usman" readOnly style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' as any }} />
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Pre-filled from your KYC — cannot be changed</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Upload Account Screenshot</label>
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📱</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Upload screenshot showing account name and number</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>JPG, PNG · Max 5MB</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Bank Name</label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as any }}>
                    <option>Select bank...</option>
                    <option>HBL — Habib Bank Limited</option>
                    <option>MCB Bank</option>
                    <option>UBL — United Bank Limited</option>
                    <option>Meezan Bank</option>
                    <option>Bank Alfalah</option>
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Account Title</label>
                  <input type="text" value="Muhammad Usman" readOnly style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' as any }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>IBAN</label>
                  <input type="text" placeholder="PK36HABB0000000100000000" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as any }} />
                </div>
              </>
            )}

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e40af', marginBottom: 16 }}>
              ⏱ Verification takes <strong>2–4 hours</strong>. You'll receive an SMS when approved.
            </div>
            <button onClick={() => setModal(false)} style={{ width: '100%', padding: 13, background: '#10b981', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Submit for Verification</button>
          </div>
        </div>
      )}
    </div>
  )
}
