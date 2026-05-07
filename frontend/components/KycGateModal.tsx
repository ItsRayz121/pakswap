'use client'
import Link from 'next/link'

/**
 * Friendly modal shown when a user attempts an action gated by KYC level.
 * Used by marketplace (initiate trade), trade/new, instant-buy, and create-ad.
 */
export function KycGateModal({
  open,
  onClose,
  reason = 'trade',
  currentLevel = 'none',
}: {
  open: boolean
  onClose: () => void
  reason?: 'trade' | 'withdraw' | 'instant-buy' | 'create-ad' | 'higher-limit'
  currentLevel?: 'none' | 'basic' | 'full'
}) {
  if (!open) return null

  const targetTier = currentLevel === 'none' ? 'Tier 1 — Basic' : 'Tier 2 — Advanced'

  const COPY: Record<string, { title: string; body: string }> = {
    trade: {
      title: 'Verify your identity to trade',
      body: 'PakSwap requires every trader to complete KYC. This protects you and the community from fraud, and complies with Pakistani regulations.',
    },
    withdraw: {
      title: 'Verify your identity to withdraw',
      body: 'For your security, withdrawals require a verified identity. Submit your CNIC and a selfie to unlock withdrawals.',
    },
    'instant-buy': {
      title: 'Verify your identity for Instant Buy',
      body: 'Instant Buy uses your verified identity to settle the order with a merchant. Complete KYC once and you\'re good to go.',
    },
    'create-ad': {
      title: 'Verify your identity to post ads',
      body: 'Only verified traders can post P2P ads. Counterparties trust verified profiles more — so do we.',
    },
    'higher-limit': {
      title: 'Upgrade your verification tier',
      body: `You've hit your ${currentLevel === 'basic' ? 'Tier 1 (PKR 50,000/day)' : 'current'} limit. Upgrade to ${targetTier} for higher limits.`,
    },
  }

  const copy = COPY[reason] ?? COPY.trade
  const tierLabel = currentLevel === 'none' ? 'Tier 1 — Basic' : currentLevel === 'basic' ? 'Tier 2 — Advanced' : 'Tier 2 — Advanced'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, width: '100%', maxWidth: 440,
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden',
        }}
      >
        <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', padding: '28px 32px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>🪪</div>
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 8 }}>{copy.title}</div>
        </div>

        <div style={{ padding: 28 }}>
          <p style={{ margin: '0 0 18px', color: '#475569', fontSize: 14, lineHeight: 1.6 }}>{copy.body}</p>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>What you'll need for {tierLabel}</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 13, lineHeight: 1.8 }}>
              {currentLevel === 'none' ? (
                <>
                  <li>Your phone number</li>
                  <li>CNIC photos (front & back)</li>
                  <li>A clear selfie</li>
                </>
              ) : (
                <>
                  <li>Bank statement OR utility bill (last 3 months)</li>
                  <li>Name and address must be visible</li>
                </>
              )}
            </ul>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>⏱ Takes 2 minutes. Reviewed within 24 hours.</div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#475569' }}
            >
              Maybe later
            </button>
            <Link href="/kyc" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Verify now →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
