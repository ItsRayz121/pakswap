'use client'
import { useState } from 'react'
import Link from 'next/link'

type Tab = 'security' | 'profile' | 'notifications' | 'sessions' | 'kyc-limits'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('security')
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [toggles, setToggles] = useState({ emailLogin: true, smsLogin: true, emailPwd: true, emailWd: true, tradeMail: true, disputeMail: true, kycMail: true, marketMail: false, tradeNew: true, buyerPaid: true })

  const navItems: { key: Tab; icon: string; label: string }[] = [
    { key: 'security', icon: '🔒', label: 'Security' },
    { key: 'profile', icon: '👤', label: 'Profile' },
    { key: 'notifications', icon: '🔔', label: 'Notifications' },
    { key: 'sessions', icon: '💻', label: 'Sessions' },
    { key: 'kyc-limits', icon: '📊', label: 'KYC & Limits' },
  ]

  const Toggle = ({ on, k }: { on: boolean; k: keyof typeof toggles }) => (
    <div onClick={() => setToggles(t => ({ ...t, [k]: !t[k] }))} style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? '#2563eb' : '#e2e8f0', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: on ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '20px', textDecoration: 'none', color: '#1e293b' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[{ label: 'Marketplace', href: '/marketplace' }, { label: 'Wallet', href: '/wallet' }, { label: 'Settings', href: '/settings', active: true }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: l.active ? 700 : 500, color: l.active ? '#2563eb' : '#374151', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>U</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Account Settings</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map(n => (
                <button key={n.key} onClick={() => setTab(n.key)} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: tab === n.key ? 600 : 500, color: tab === n.key ? '#1d4ed8' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: tab === n.key ? '#eff6ff' : 'transparent', border: 'none', textAlign: 'left' }}>
                  <span>{n.icon}</span> {n.label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
              <Link href="/payment-methods" style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}><span>💳</span> Payment Methods</Link>
              <Link href="/referral" style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}><span>🎁</span> Referral</Link>
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
              <Link href="/login" style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#ef4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}><span>🚪</span> Log Out</Link>
            </div>
          </div>

          {/* Content */}
          <div>
            {tab === 'security' && (
              <div>
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showChangePwd ? '16px' : 0, flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 800 }}>Password</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Last changed: 01 April 2026</div>
                    </div>
                    <button onClick={() => setShowChangePwd(p => !p)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Change Password</button>
                  </div>
                  {showChangePwd && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                        <div key={l} style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{l}</label>
                          <input type="password" placeholder={l === 'New Password' ? 'Min 8 characters' : `Enter ${l.toLowerCase()}`} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      ))}
                      <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Update Password</button>
                    </div>
                  )}
                </div>

                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800 }}>Two-Factor Authentication</div>
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟢 Enabled</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Google Authenticator · Enabled 15 March 2026</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>View Backup Codes</button>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#ef4444' }}>Disable 2FA</button>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>Anti-Phishing Code</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>This code appears in all genuine PakSwap emails. If it's missing, the email is fake.</div>
                  <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Code</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '3px', color: '#1d4ed8', fontFamily: 'monospace' }}>PAKSWAP-4721</div>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #2563eb', background: 'white', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Change Code</button>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>Login Notifications</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Get alerted when someone accesses your account</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Email on new device login', k: 'emailLogin' as const },
                      { label: 'SMS on new device login', k: 'smsLogin' as const },
                      { label: 'Email on password change', k: 'emailPwd' as const },
                      { label: 'Email on withdrawal', k: 'emailWd' as const },
                    ].map(r => (
                      <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px' }}>{r.label}</span>
                        <Toggle on={toggles[r.k]} k={r.k} />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #ef4444', padding: '24px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#dc2626', marginBottom: '4px' }}>🔴 Danger Zone</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>These actions are irreversible. Proceed with caution.</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #f59e0b', background: 'white', color: '#f59e0b', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Deactivate Account</button>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>Profile Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '28px' }}>U</div>
                    <button style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#2563eb', border: '2px solid white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', color: 'white' }}>+</button>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>Muhammad Usman</div>
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>✓ Full KYC Verified</span>
                  </div>
                </div>
                {[
                  { label: 'Display Name', value: 'Muhammad Usman', type: 'text' },
                  { label: 'Username', value: '@m.usman', type: 'text' },
                  { label: 'Email Address', value: 'm.usman@gmail.com', type: 'email', verified: true },
                  { label: 'Phone Number', value: '0312-4567890', type: 'tel', verified: true, readonly: true },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {f.label}
                      {f.verified && <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 6px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>Verified</span>}
                    </label>
                    <input type={f.type} defaultValue={f.value} readOnly={f.readonly} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: f.readonly ? '#f8fafc' : 'white', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  {[{ label: 'Language', options: ['English', 'اردو'] }, { label: 'Timezone', options: ['PKT (UTC+5)', 'UTC+0'] }].map(s => (
                    <div key={s.label}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{s.label}</label>
                      <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                        {s.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Save Changes</button>
              </div>
            )}

            {tab === 'notifications' && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>Notification Preferences</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '20px' }}>
                  {[
                    { label: 'Trade Started / Completed', sub: 'Get notified when a trade begins or ends', k: 'tradeMail' as const },
                    { label: 'Dispute Updates', sub: 'Dispute opened, agent response, resolved', k: 'disputeMail' as const },
                    { label: 'KYC Approved / Rejected', sub: '', k: 'kycMail' as const },
                    { label: 'Marketing & Promotions', sub: 'Tips, offers, market updates', k: 'marketMail' as const },
                  ].map((r, i) => (
                    <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{r.label}</div>
                        {r.sub && <div style={{ fontSize: '12px', color: '#64748b' }}>{r.sub}</div>}
                      </div>
                      <Toggle on={toggles[r.k]} k={r.k} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SMS Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '20px' }}>
                  {[
                    { label: 'New Incoming Trade', k: 'tradeNew' as const },
                    { label: 'Buyer Confirmed Payment (as seller)', k: 'buyerPaid' as const },
                  ].map((r, i) => (
                    <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{r.label}</div>
                      <Toggle on={toggles[r.k]} k={r.k} />
                    </div>
                  ))}
                </div>
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Save Preferences</button>
              </div>
            )}

            {tab === 'sessions' && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800 }}>Active Sessions</div>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Terminate All Others</button>
                </div>
                {[
                  { icon: '💻', label: 'Chrome on Windows — Current Session', sub: 'Lahore, Pakistan · 05 May 2026, 2:30 PM', note: '✓ Your current session', noteColor: '#10b981', current: true },
                  { icon: '📱', label: 'iPhone 14 — Safari', sub: 'Karachi, Pakistan · 03 May 2026, 11:20 AM', note: '⚠️ Last active 2 days ago', noteColor: '#f59e0b', current: false },
                  { icon: '📱', label: 'Android App', sub: 'Islamabad, Pakistan · 01 May 2026, 9:15 AM', note: '', noteColor: '', current: false },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: `1.5px solid ${s.current ? '#10b981' : '#e2e8f0'}`, borderRadius: '12px', marginBottom: '8px', background: s.current ? '#f0fdf4' : 'white', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '28px' }}>{s.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{s.label}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{s.sub}</div>
                        {s.note && <div style={{ fontSize: '12px', color: s.noteColor, marginTop: '2px' }}>{s.note}</div>}
                      </div>
                    </div>
                    {!s.current && <button style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Terminate</button>}
                  </div>
                ))}
              </div>
            )}

            {tab === 'kyc-limits' && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>KYC Level &amp; Trading Limits</div>
                <div style={{ background: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', border: '1.5px solid #6ee7b7', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '32px' }}>🏆</div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#065f46' }}>Full KYC Verified</div>
                      <div style={{ fontSize: '13px', color: '#10b981' }}>Highest trading limits unlocked</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '14px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 900, color: '#1d4ed8' }}>500,000 PKR</div><div style={{ fontSize: '12px', color: '#64748b' }}>Daily Buy Limit</div></div>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '14px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981' }}>500,000 PKR</div><div style={{ fontSize: '12px', color: '#64748b' }}>Daily Sell Limit</div></div>
                  </div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Today's Usage</div>
                {[
                  { label: 'Buy Used: 17,820 PKR', total: 'of 500,000 PKR', pct: 3.6, color: '#2563eb' },
                  { label: 'Sell Used: 0 PKR', total: 'of 500,000 PKR', pct: 0, color: '#10b981' },
                ].map(u => (
                  <div key={u.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}><span>{u.label}</span><span style={{ color: '#64748b' }}>{u.total}</span></div>
                    <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px' }}><div style={{ width: `${u.pct}%`, background: u.color, height: '100%', borderRadius: '4px' }} /></div>
                  </div>
                ))}
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Limits reset daily at 12:00 AM PKT</div>
                <Link href="/kyc"><button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#374151' }}>View KYC Status →</button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
