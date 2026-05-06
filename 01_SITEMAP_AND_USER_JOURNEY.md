# P2P Crypto-PKR Platform — Sitemap & User Journey
**Platform Codename:** PakSwap (placeholder)
**Document Version:** 1.0 | Date: 2026-05-05

---

## 1. SITEMAP

```
pakswap.pk/
│
├── PUBLIC ZONE (unauthenticated)
│   ├── /                          Landing Page
│   ├── /about                     About Us
│   ├── /fees                      Fee Schedule
│   ├── /blog                      Blog / News
│   ├── /help                      Help Center
│   │   ├── /help/getting-started
│   │   ├── /help/buying-crypto
│   │   ├── /help/selling-crypto
│   │   ├── /help/kyc-guide
│   │   ├── /help/disputes
│   │   └── /help/security
│   ├── /login                     Login Page
│   └── /register                  Registration Page
│
├── AUTH ZONE (authenticated users)
│   ├── /dashboard                 User Dashboard / Wallet Overview
│   │
│   ├── /kyc                       KYC Verification Hub
│   │   ├── /kyc/identity          Step 1 — CNIC Upload
│   │   ├── /kyc/selfie            Step 2 — Selfie / Liveness
│   │   ├── /kyc/address           Step 3 — Address Proof
│   │   └── /kyc/status            KYC Status Tracker
│   │
│   ├── /marketplace               P2P Marketplace (Buy/Sell listings)
│   │   ├── ?side=buy              Buy Crypto tab
│   │   ├── ?side=sell             Sell Crypto tab
│   │   └── ?coin=USDT&fiat=PKR   Filtered view
│   │
│   ├── /trade/:orderId            Trade / Escrow Room
│   │   ├── (buyer view)
│   │   └── (seller view)
│   │
│   ├── /wallet                    Wallet Dashboard
│   │   ├── /wallet/deposit        Deposit crypto
│   │   ├── /wallet/withdraw       Withdraw crypto
│   │   └── /wallet/history        Transaction history
│   │
│   ├── /orders                    Orders & Trade History
│   │   ├── ?tab=active
│   │   ├── ?tab=completed
│   │   └── ?tab=cancelled
│   │
│   ├── /payment-methods           Payment Methods Manager
│   │   ├── /payment-methods/add
│   │   └── /payment-methods/edit/:id
│   │
│   ├── /ads                       My P2P Advertisements
│   │   ├── /ads/create            Create New Ad
│   │   ├── /ads/:adId/edit        Edit Ad
│   │   └── /ads/:adId             Ad Detail
│   │
│   ├── /merchant                  Merchant Program
│   │   ├── /merchant/apply        Apply for Merchant Status
│   │   └── /merchant/profile/:id  Public Merchant Profile
│   │
│   ├── /disputes                  Dispute Center
│   │   ├── /disputes/:tradeId     Open / View Dispute
│   │   └── /disputes/history      Past Disputes
│   │
│   ├── /referral                  Referral Program
│   │
│   └── /settings                  Account Settings
│       ├── /settings/security     Security (2FA, password)
│       ├── /settings/notifications Notification Preferences
│       ├── /settings/profile      Profile Info
│       └── /settings/devices      Active Sessions
│
└── ADMIN ZONE (/admin — role-gated)
    ├── /admin/dashboard           Admin Overview Dashboard
    ├── /admin/kyc                 KYC Review Panel
    │   ├── /admin/kyc/queue       Pending KYC applications
    │   └── /admin/kyc/:userId     Individual KYC review
    ├── /admin/disputes            Dispute Resolution Panel
    │   ├── /admin/disputes/queue
    │   └── /admin/disputes/:id
    ├── /admin/users               User Management
    ├── /admin/trades              Trade Monitoring
    ├── /admin/fraud               Fraud / Risk Monitoring
    ├── /admin/ads                 Ad Management
    ├── /admin/merchants           Merchant Management
    └── /admin/settings            Platform Settings
```

---

## 2. USER ROLES

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Guest** | Unauthenticated visitor | View landing, browse public help |
| **Registered User** | Email verified, no KYC | Register only — no trading |
| **KYC Lite** | Basic ID verified | Buy up to 50,000 PKR/day |
| **KYC Full** | Full ID + selfie + address | Full trading, up to 500,000 PKR/day |
| **Merchant** | Approved high-volume trader | Create ads, higher limits, badge |
| **Support Agent** | Staff role | View trades, assist disputes |
| **KYC Reviewer** | Staff role | Approve/reject KYC submissions |
| **Dispute Agent** | Staff role | Resolve trade disputes |
| **Admin** | Super access | Full platform control |

---

## 3. USER JOURNEY MAPS

### 3A. NEW USER — FIRST BUY FLOW

```
AWARENESS
    │
    ▼
[Lands on Landing Page]
    │  sees "Buy USDT with JazzCash" headline
    │  sees trust signals: escrow badge, PKR support, "50,000+ trades"
    ▼
[Clicks "Get Started" CTA]
    │
    ▼
[Register Page]
    │  Email + Phone + Password
    │  OTP verification (SMS + Email)
    ▼
[Email/Phone Verified] → onboarding tooltip overlay begins
    │
    ▼
[KYC Prompt Modal] — "Verify to start trading"
    │  User chooses: "Verify Now" or "Later"
    │
    ▼
[KYC Flow]
    │  Step 1: CNIC front + back photo upload
    │  Step 2: Selfie / liveness check
    │  Step 3: Review & submit
    │  Status: "Under Review" — email sent
    │
    ▼
[KYC Approved] (avg. 15 min–2 hours)
    │  Push notification + email: "You're verified!"
    │
    ▼
[P2P Marketplace]
    │  Coin = USDT | Side = Buy | Amount = 5,000 PKR
    │  Sees merchant listings sorted by: best rate, trusted merchant
    │  Filter by: payment method (JazzCash), min/max amount
    │
    ▼
[Selects a Merchant Offer]
    │  Views merchant profile: completion rate 99.2%, 1,240 trades
    │  Sees rate: 1 USDT = 280 PKR
    │  Clicks "Buy 17.85 USDT"
    │
    ▼
[Trade / Escrow Room Opens]
    │  Timer starts: 15:00 minutes
    │  Instructions: "Send 5,000 PKR to JazzCash: 0312-XXXXXXX"
    │  Escrow status: "USDT locked in escrow ✓"
    │
    ▼
[Buyer sends PKR payment via JazzCash]
    │  Uploads screenshot of payment
    │  Clicks "I've Paid — Confirm Payment"
    │
    ▼
[Seller receives notification]
    │  Verifies JazzCash receipt
    │  Clicks "Release USDT"
    │
    ▼
[Trade Complete]
    │  USDT credited to buyer's wallet
    │  Confirmation screen + rate seller prompt
    │  "Share & Earn" referral nudge
    ▼
[Buyer rates seller ★★★★★]
```

---

### 3B. MERCHANT — CREATE AD & SELL FLOW

```
[Merchant logs in]
    │
    ▼
[Goes to /ads/create]
    │  Selects: Sell USDT | Payment: JazzCash + Bank Transfer
    │  Sets rate: market rate + 1.5% premium
    │  Sets limits: Min 2,000 PKR | Max 100,000 PKR
    │  Sets trade window: 15 minutes
    │  Adds terms: "Send from your own account only"
    │
    ▼
[Ad goes live on marketplace]
    │
    ▼
[Buyer initiates trade]
    │  Merchant gets push notification + SMS
    │
    ▼
[Trade / Escrow Room]
    │  Merchant's USDT auto-locked in escrow
    │  Waits for buyer's payment confirmation
    │
    ▼
[Buyer confirms payment + uploads receipt]
    │
    ▼
[Merchant verifies JazzCash account]
    │  Confirms PKR received
    │  Clicks "Release USDT"
    │
    ▼
[Trade Complete — PKR in merchant's bank]
    │  Merchant wallet: USDT decremented
    │  Rating received from buyer
```

---

### 3C. DISPUTE FLOW

```
[Trade in progress — buyer claims paid, seller disputes]
    │
    ▼
[Either party clicks "Open Dispute"]
    │  Selects reason: "Payment not received" / "Wrong amount" / etc.
    │  Uploads evidence (screenshots, receipts)
    │
    ▼
[Dispute ticket created]
    │  Trade timer paused
    │  USDT remains locked in escrow
    │  Dispute agent assigned (SLA: 4 hours)
    │
    ▼
[Admin Dispute Panel]
    │  Reviews uploaded evidence from both parties
    │  May request additional evidence (24hr window)
    │  Communicates via in-dispute chat
    │
    ▼
[Decision made]
    │  Option A: Release to buyer (payment confirmed)
    │  Option B: Return to seller (payment not confirmed)
    │  Option C: Partial release (rare edge case)
    │
    ▼
[Decision executed automatically]
    │  Losing party can appeal within 24 hours
    │  Repeat offenders flagged for fraud review
```

---

## 4. CRITICAL USER EXPERIENCE PRINCIPLES

### Trust Hierarchy (most important)
1. **Escrow Visibility** — Always show "USDT Locked in Escrow" prominently during trade
2. **Merchant Reputation** — Completion rate, trade count, avg. release time visible before trade
3. **KYC Badges** — Visual indicator on every merchant listing
4. **Platform Guarantee** — "Protected by PakSwap Escrow" badge on trade room

### Pakistan-Specific UX Rules
- **Language**: English primary, Urdu secondary (toggle available)
- **Payment Methods**: JazzCash and Easypaisa displayed with official logos/colors
- **Amounts**: Always show PKR amounts prominently; crypto amount secondary
- **SMS/WhatsApp Notifications**: Users prefer SMS/WhatsApp over email
- **Mobile-First**: 80%+ Pakistani fintech users on mobile; all flows optimized for 375px width
- **Low Bandwidth**: Use skeleton loaders, compress images, avoid heavy animations
- **Trust Signals**: "PakSwap is registered under SECP" (if applicable), SSL badges
- **Dark/Light Mode**: Default light; dark mode available
