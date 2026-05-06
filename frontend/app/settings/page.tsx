'use client'
import { useState } from 'react'
import Link from 'next/link'

type Tab = 'security' | 'profile' | 'notifications' | 'sessions' | 'kyc-limits'

const Toggle = ({ checked }: { checked?: boolean }) => {
  const [on, setOn] = useState(!!checked)
  return (
    <div onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#2563eb' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('security')
  const [showPwd, setShowPwd] = useState(false)

  const navItems: { key: Tab; icon: string; label: string }[] = [
    { key: 'security', icon: '🔒', label: 'Security' },
    { key: 'profile', icon: '👤', label: 'Profile' },
    { key: 'notifications', icon: '🔔', label: 'Notifications' },
    { key: 'sessions', icon: '💻', label: 'Sessions' },
    { key: 'kyc-limits', icon: '📊', label: 'KYC & Limits' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', textDecoration: 'none' }}>Pak<span style={{ color: '#2563eb' }}>Swap</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/marketplace" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/wallet" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Wallet</Link>
          <Link href="/settings" style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Settings</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Muhammad U.</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Account Settings</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navItems.map(({ key, icon, label }) => (
                <button key={key} onClick={() => setTab(key)} style={{ padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: tab === key ? 600 : 500, color: tab === key ? '#1d4ed8' : '#374151', background: tab === key ? '#eff6ff' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <span>{icon}</span>{label}
                </button>
              ))}
              <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
              <Link href="/payment-methods" style={{ padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><span>💳</span> Payment Methods</Link>
              <Link href="/referral" style={{ padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><span>🎁</span> Referral</Link>
              <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
              <Link href="/login" style={{ padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#ef4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><span>🚪</span> Log Out</Link>
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Security Tab */}
            {tab === 'security' && (
              <>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div><div style={{ fontSize: 17, fontWeight: 800 }}>Password</div><div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Last changed: 01 April 2026</div></div>
                    <button onClick={() => setShowPwd(!showPwd)} style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>Change Password</button>
                  </div>
                  {showPwd && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                      {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                        <div key={l} style={{ marginBottom: 12 }}>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{l}</label>
                          <input type="password" placeholder={l === 'New Password' ? 'Min 8 characters' : `Enter ${l.toLowerCase()}`} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      ))}
                      <button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Update Password</button>
                    </div>
                  )}
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>Two-Factor Authentication</div>
                    <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🟢 Enabled</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Google Authenticator · Enabled 15 March 2026</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white' }}>View Backup Codes</button>
                    <button style={{ padding: '7px 14px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'none', color: '#ef4444' }}>Disable 2FA</button>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Anti-Phishing Code</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>This code appears in all genuine PakSwap emails. If it's missing, the email is fake.</div>
                  <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Code</div>
                      <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 3, color: '#1d4ed8', fontFamily: 'monospace' }}>PAKSWAP-4721</div>
                    </div>
                    <button style={{ padding: '7px 14px', border: '1.5px solid #93c5fd', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'white', color: '#1d4ed8' }}>Change Code</button>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Login Notifications</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Get alerted when someone accesses your account</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Email on new device login', 'SMS on new device login', 'Email on password change', 'Email on withdrawal'].map(l => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14 }}>{l}</span>
                        <Toggle checked />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #ef4444', padding: 20 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>🔴 Danger Zone</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>These actions are irreversible. Proceed with caution.</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ padding: '8px 16px', border: '1.5px solid #fde68a', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fffbeb', color: '#f59e0b' }}>Deactivate Account</button>
                    <button style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Delete Account</button>
                  </div>
                </div>
              </>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>Profile Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>U</div>
                    <button style={{ position: 'absolute', bottom: -4, right: -4, background: '#2563eb', border: '2px solid white', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Muhammad Usman</div>
                    <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, display: 'inline-block', marginTop: 4 }}>✓ Full KYC Verified</span>
                  </div>
                </div>
                {[['Display Name', 'Muhammad Usman', false], ['Username', '@m.usman', false], ['Email Address', 'm.usman@gmail.com', false], ['Phone Number', '0312-4567890', true]].map(([l, v, ro]) => (
                  <div key={l as string} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{l as string}</label>
                    <input defaultValue={v as string} readOnly={!!ro} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: ro ? '#f8fafc' : 'white' }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  {[['Language', ['English', 'اردو']], ['Timezone', ['PKT (UTC+5)', 'UTC+0']]].map(([l, opts]) => (
                    <div key={l as string}>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{l as string}</label>
                      <select style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                        {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
              </div>
            )}

            {/* Notifications Tab */}
            {tab === 'notifications' && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>Notification Preferences</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 20 }}>
                  {[
                    { title: 'Trade Started / Completed', sub: 'Get notified when a trade begins or ends', on: true },
                    { title: 'Dispute Updates', sub: 'Dispute opened, agent response, resolved', on: true },
                    { title: 'KYC Approved / Rejected', sub: '', on: true },
                    { title: 'Marketing & Promotions', sub: 'Tips, offers, market updates', on: false },
                  ].map(({ title, sub, on }, i, arr) => (
                    <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        {sub && <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>}
                      </div>
                      <Toggle checked={on} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SMS Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 20 }}>
                  {[{ title: 'New Incoming Trade', on: true }, { title: 'Buyer Confirmed Payment (as seller)', on: true }].map(({ title, on }, i, arr) => (
                    <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                      <Toggle checked={on} />
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0 16px' }} />
                <button style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Save Preferences</button>
              </div>
            )}

            {/* Sessions Tab */}
            {tab === 'sessions' && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>Active Sessions</div>
                  <button style={{ padding: '7px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Terminate All Others</button>
                </div>
                {[
                  { icon: '💻', title: 'Chrome on Windows — Current Session', loc: 'Lahore, Pakistan · 05 May 2026, 2:30 PM', note: '✓ Your current session', noteColor: '#10b981', current: true },
                  { icon: '📱', title: 'iPhone 14 — Safari', loc: 'Karachi, Pakistan · 03 May 2026, 11:20 AM', note: '⚠️ Last active 2 days ago', noteColor: '#f59e0b', current: false },
                  { icon: '📱', title: 'Android App', loc: 'Islamabad, Pakistan · 01 May 2026, 9:15 AM', note: '', noteColor: '', current: false },
                ].map(({ icon, title, loc, note, noteColor, current }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, border: `1.5px solid ${current ? '#10b981' : '#e2e8f0'}`, borderRadius: 12, marginBottom: 8, background: current ? '#f0fdf4' : 'white', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 28 }}>{icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{loc}</div>
                        {note && <div style={{ fontSize: 12, color: noteColor, marginTop: 2 }}>{note}</div>}
                      </div>
                    </div>
                    {!current && <button style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 600 }}>Terminate</button>}
                  </div>
                ))}
              </div>
            )}

            {/* KYC & Limits Tab */}
            {tab === 'kyc-limits' && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>KYC Level & Trading Limits</div>
                <div style={{ background: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', border: '1.5px solid #6ee7b7', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 32 }}>🏆</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#065f46' }}>Full KYC Verified</div>
                      <div style={{ fontSize: 13, color: '#10b981' }}>Highest trading limits unlocked</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: 'white', borderRadius: 10, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8' }}>500,000 PKR</div><div style={{ fontSize: 12, color: '#64748b' }}>Daily Buy Limit</div></div>
                    <div style={{ background: 'white', borderRadius: 10, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>500,000 PKR</div><div style={{ fontSize: 12, color: '#64748b' }}>Daily Sell Limit</div></div>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Today's Usage</div>
                {[{ label: 'Buy Used: 17,820 PKR', of: 'of 500,000 PKR', pct: '3.6%', color: '#2563eb' }, { label: 'Sell Used: 0 PKR', of: 'of 500,000 PKR', pct: '0%', color: '#10b981' }].map(({ label, of, pct, color }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{label}</span><span style={{ color: '#64748b' }}>{of}</span></div>
                    <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8 }}><div style={{ width: pct, background: color, height: '100%', borderRadius: 4 }} /></div>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Limits reset daily at 12:00 AM PKT</div>
                <div style={{ height: 1, background: '#f1f5f9', margin: '16px 0' }} />
                <Link href="/kyc"><button style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9' }}>View KYC Status →</button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
