# Page-by-Page Wireframe Descriptions — Part 2 (Pages 11–20)
**PakSwap P2P Platform**

> **SUPERSEDED** — This document contains early text wireframes only. The authoritative UI reference is the HTML mockups in the `html/` directory. Use these text wireframes for historical context only; do not implement from them.

---

## PAGE 11 — DISPUTE CENTER (`/disputes`)

### Open Dispute Entry (from Trade Room)
```
┌────────────────────────────────────────────────────────────┐
│  Open a Dispute — Trade #PKS-2026-00472                    │
├────────────────────────────────────────────────────────────┤
│  ⚠️  Only open a dispute if there is a real problem.        │
│  False disputes may result in account restrictions.        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Select the issue:                                         │
│  ● Seller has not released crypto after I paid             │
│  ○ Buyer claims payment but I received nothing             │
│  ○ Wrong amount was sent                                   │
│  ○ Payment sent to wrong account                           │
│  ○ Seller/Buyer is unresponsive                            │
│  ○ Other (describe below)                                  │
│                                                            │
│  Describe your issue:                                      │
│  [_____________________________________________]           │
│  [_____________________________________________]           │
│  [_____________________________________________]           │
│                                                            │
│  Upload Evidence:                                          │
│  [📎 Upload Screenshot/Receipt]  (max 5 files, 10MB each) │
│  ✓ payment_proof_jazzcash.jpg                             │
│  ✓ chat_screenshot.jpg                                     │
│                                                            │
│  [Cancel]           [Submit Dispute — USDT Stays in Escrow]│
└────────────────────────────────────────────────────────────┘
```

### Active Dispute View
```
┌────────────────────────────────────────────────────────────┐
│  Dispute #DIS-2026-00088     Trade #PKS-2026-00472          │
│  Status: 🔴 Under Review    Opened: 05 May 2026, 3:40 PM   │
│  Agent Assigned: Support Agent (reply within 4 hours)      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Trade Summary:                                            │
│  Buy 17.82 USDT | Paid 5,000 PKR | Via JazzCash            │
│  Your party: BUYER    |  Other party: CryptoKing            │
│                                                            │
│  USDT Status: 🔒 Locked in Escrow (safe)                   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Dispute Communication                                     │
│  ─────────────────────────────────────────────            │
│  [Support Agent] 3:45 PM:                                  │
│  "Thank you for opening this dispute. We're reviewing      │
│   the evidence. Can you please confirm the JazzCash        │
│   transaction ID?"                                         │
│                                                            │
│  [You] 3:47 PM:                                            │
│  "Transaction ID: JZ2026050500834"                         │
│                                                            │
│  [Type your message...]                      [Send]        │
├────────────────────────────────────────────────────────────┤
│  Your Evidence Submitted:                                  │
│  [payment_proof.jpg] [chat_screenshot.jpg]                 │
│  [+ Upload More Evidence]                                  │
└────────────────────────────────────────────────────────────┘
```

### Dispute Resolution Notification
```
  RESOLVED — in your favor
  ─────────────────────────
  17.82 USDT has been released to your wallet.

  Decision: "Buyer's payment was confirmed via
  JazzCash transaction ID JZ2026050500834."

  [View Wallet]  [Leave Feedback for Support]
```

---

## PAGE 12 — MERCHANT PROFILE (`/merchant/profile/:id`)

### Public-Facing Merchant Card
```
┌────────────────────────────────────────────────────────────┐
│  [Avatar]  CryptoKing                  👑 Verified Merchant │
│            ★ 4.9  (1,240 ratings)                          │
│            🟢 Online Now                                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📊 Trading Statistics                                     │
│  ─────────────────────────────────────────────            │
│  Total Trades:        1,240                               │
│  Completion Rate:     99.2%                               │
│  Avg. Release Time:   4 minutes                           │
│  First Trade:         January 2025                        │
│  KYC Level:          ✓ Full KYC                           │
│                                                            │
│  💳 Accepted Payment Methods                              │
│  JazzCash  |  HBL Bank Transfer  |  Easypaisa             │
│                                                            │
│  📣 About this Merchant                                    │
│  "Fast and reliable. Trading since 2023. I release         │
│   USDT within 5 minutes of payment confirmation.          │
│   Please send from your own account only."                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Active Offers                                             │
│  ─────────────────────────────────────────────            │
│  SELL USDT | 280.50 PKR | 1k–200k | JazzCash  [BUY →]    │
│  SELL USDT | 280.20 PKR | 500–50k | Bank HBL  [BUY →]    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Recent Reviews                            [See All 1,240] │
│  ─────────────────────────────────────────────            │
│  ★★★★★ "Fast release, highly recommended!" — User_A***   │
│  ★★★★★ "Smooth transaction, very professional" — User_R***│
│  ★★★★☆ "Good, but slight delay once" — User_K***          │
└────────────────────────────────────────────────────────────┘
```

### Merchant Application (`/merchant/apply`)
```
  Requirements to become a Merchant:
  ✓ Full KYC completed
  ✓ Minimum 50 completed trades
  ✓ Completion rate above 95%
  ✓ No active disputes or bans

  Your current status:
  ✅ KYC: Full          ✅ Trades: 87
  ✅ Completion: 97.2%  ✅ No bans

  [Apply for Merchant Status →]

  Benefits:
  • 👑 Merchant badge on all listings
  • Priority placement in marketplace
  • Higher trading limits
  • Dedicated support channel
  • Lower fees (0.3% vs 0.5%)
```

---

## PAGE 13 — CREATE P2P AD (`/ads/create`)

```
┌────────────────────────────────────────────────────────────┐
│  Create P2P Advertisement                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Step 1: Basic Setup                                       │
│  ──────────────────────────────────                        │
│  I want to:  ● SELL Crypto  ○ BUY Crypto                  │
│                                                            │
│  Cryptocurrency:  [USDT ▼]                                │
│  Fiat Currency:   PKR  (fixed)                             │
│                                                            │
│  Step 2: Pricing                                           │
│  ──────────────────────────────────                        │
│  Pricing Type:                                             │
│  ● Fixed Price:   [280.50] PKR per USDT                   │
│  ○ Floating:      Market Rate  [+] [-] [1.5] %            │
│    (Floating: auto-updates with Binance price)             │
│                                                            │
│  Current Market Rate: 278.90 PKR/USDT                     │
│  Your Price: 280.50 PKR/USDT (+0.58% above market)        │
│                                                            │
│  Step 3: Trade Limits                                      │
│  ──────────────────────────────────                        │
│  Total USDT to sell: [_____500_____] USDT                 │
│  Minimum per trade:  [__1,000___] PKR                      │
│  Maximum per trade:  [_200,000__] PKR                      │
│                                                            │
│  Step 4: Payment Methods                                   │
│  ──────────────────────────────────                        │
│  ☑ JazzCash (0312-XXXXXXX — Verified)                     │
│  ☑ HBL Bank Transfer (IBAN: PK36...)                      │
│  ☐ Easypaisa (Add Easypaisa first)                        │
│                                                            │
│  Step 5: Trade Settings                                    │
│  ──────────────────────────────────                        │
│  Trade Window:  [15 ▼] minutes                             │
│  Counterparty must be:                                     │
│  ☑ KYC Verified (minimum)                                  │
│  ☐ Full KYC only                                           │
│  ☐ Minimum 1 completed trade                               │
│                                                            │
│  Ad Terms (shown to buyers):                               │
│  [_____________________________________________]           │
│  [_____________________________________________]           │
│  Max 500 characters. Plain text only.                      │
│                                                            │
│  Step 6: Review & Publish                                  │
│  ──────────────────────────────────                        │
│  Summary:                                                  │
│  Selling 500 USDT at 280.50 PKR via JazzCash + HBL        │
│  Limits: 1,000–200,000 PKR | Trade window: 15 min         │
│                                                            │
│  [Save as Draft]        [Publish Ad →]                     │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 14 — REFERRAL PAGE (`/referral`)

```
┌────────────────────────────────────────────────────────────┐
│  🎁 Refer & Earn                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Your Referral Code:  PAKSWAP-USM42                        │
│  Your Referral Link:  pakswap.pk/r/USM42                  │
│  [Copy Link]  [Share on WhatsApp]  [Share on Telegram]     │
│                                                            │
│  How it Works:                                             │
│  ────────────                                              │
│  1. Share your link with friends                           │
│  2. They register using your code                          │
│  3. They complete their first trade                        │
│  4. You both earn 500 PKR bonus                            │
│                                                            │
│  Bonus Structure:                                          │
│  • You earn: 500 PKR per successful referral               │
│  • Friend earns: 500 PKR first trade bonus                 │
│  • Paid as USDT to your wallet after 7 days                │
│                                                            │
│  ──────────────────────────────────────────               │
│                                                            │
│  Your Stats                                                │
│  ─────────────────                                        │
│  Total Referrals:     12                                   │
│  Completed Trades:    8                                    │
│  Total Earned:        4,000 PKR (14.28 USDT)              │
│  Pending:             2,000 PKR                            │
│                                                            │
│  Referred Users:                                           │
│  Asim K*** — Joined 01 May — ✅ Traded — 500 PKR earned   │
│  Raza M*** — Joined 03 May — ⏳ Pending trade             │
│                                                            │
│  [Withdraw Earnings to Wallet]                             │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 15 — SUPPORT / HELP CENTER (`/help`)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  Help Center                                                │
│  ─────────────────────────────────────────────            │
│  [🔍 Search: "How to release USDT?"]                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Popular Topics:                                           │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ 🚀 Getting Started│  │ 💳 Payments      │               │
│  │ Registration, KYC │  │ JazzCash, Banks  │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ 🔄 Trading Guide  │  │ ⚖️ Disputes      │               │
│  │ Buy, sell, escrow │  │ How to file one  │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ 🔒 Security       │  │ 👤 My Account    │               │
│  │ 2FA, passwords   │  │ Settings, KYC    │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Can't find your answer?                                   │
│  💬 Live Chat (available 9AM–11PM PKT)  [Start Chat]       │
│  📧 Email Support: support@pakswap.pk                     │
│  ⏱ Avg response: < 2 hours                                │
└────────────────────────────────────────────────────────────┘
```

### Article Page Example: "How Escrow Works"
- Clear step-by-step with icons
- FAQ accordion at bottom
- "Was this helpful?" rating
- "Related articles" links
- Breadcrumb: Help > Trading Guide > How Escrow Works

---

## PAGE 16 — ADMIN DASHBOARD (`/admin/dashboard`)

```
┌────────────────────────────────────────────────────────────┐
│  [PakSwap Admin]  Dashboard  │ Staff: Ahmad (Admin)  [↗ Log Out]│
├──────────────────────────────┤                              │
│  NAVIGATION                  │  OVERVIEW CARDS              │
│  ─────────────               │  ────────────                │
│  📊 Dashboard                │  ┌────────┐ ┌────────┐      │
│  👥 Users                    │  │Active  │ │Trades  │      │
│  🔍 KYC Queue                │  │Trades  │ │Today   │      │
│  ⚖️  Disputes                │  │  12    │ │  87    │      │
│  💰 Trades                   │  └────────┘ └────────┘      │
│  🚨 Fraud Monitor            │  ┌────────┐ ┌────────┐      │
│  📢 Ads                      │  │KYC     │ │Open    │      │
│  👑 Merchants                │  │Pending │ │Disputes│      │
│  ⚙️  Settings                │  │  34    │ │   5    │      │
│                              │  └────────┘ └────────┘      │
│                              │                              │
│                              │  ┌────────┐ ┌────────┐      │
│                              │  │Volume  │ │Revenue │      │
│                              │  │Today   │ │Today   │      │
│                              │  │4.2M PKR│ │21k PKR │      │
│                              │  └────────┘ └────────┘      │
│                              │                              │
│                              │  LIVE TRADE FEED             │
│                              │  #PKS-472  BUY 17 USDT  🟢  │
│                              │  #PKS-471  SELL 50 USDT 🟡  │
│                              │  #PKS-470  DISPUTED     🔴  │
│                              │                              │
│                              │  ALERTS                      │
│                              │  🔴 Fraud flag: User #2814  │
│                              │  🟡 KYC: 34 pending > 2hrs  │
│                              │  🟡 Dispute #88 > 3hrs      │
├──────────────────────────────┴──────────────────────────────┤
│  Volume Chart (7-day bar chart): PKR volume per day         │
│  User Growth Chart (30-day line chart)                      │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 17 — KYC REVIEW PANEL (`/admin/kyc`)

### Queue View
```
┌────────────────────────────────────────────────────────────┐
│  KYC Review Queue                   [34 Pending] [Filter▼] │
├──────────────────────────────────────────────────────────────┤
│  Search: [Name / CNIC / Email]  Sort: [Oldest First ▼]     │
├─────┬───────────────────┬──────────┬─────────────┬──────────┤
│ ID  │ Name              │ Submitted│ Wait Time   │ Action   │
├─────┼───────────────────┼──────────┼─────────────┼──────────┤
│ 2814│ Muhammad Usman    │ 3:00 PM  │ 2h 14m  ⚠️ │ [Review] │
│ 2815│ Fatima Khan       │ 3:30 PM  │ 1h 44m     │ [Review] │
│ 2816│ Ali Hassan        │ 4:00 PM  │ 1h 14m     │ [Review] │
└─────┴───────────────────┴──────────┴─────────────┴──────────┘
```

### Individual KYC Review
```
┌────────────────────────────────────────────────────────────┐
│  KYC Review — User #2814  Muhammad Usman                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  User Info:                    Submitted: 05 May, 3:00 PM  │
│  Email: m.usman@gmail.com      Phone: 0312-XXXXXXX         │
│  Registered: 05 May 2026                                   │
│                                                            │
│  ┌───────────────────┐  ┌───────────────────┐             │
│  │  CNIC FRONT       │  │  CNIC BACK        │             │
│  │  [Image viewer]   │  │  [Image viewer]   │             │
│  │  [Zoom] [Rotate]  │  │  [Zoom] [Rotate]  │             │
│  └───────────────────┘  └───────────────────┘             │
│                                                            │
│  ┌───────────────────┐                                     │
│  │  SELFIE           │  OCR Extracted:                     │
│  │  [Image viewer]   │  Name: Muhammad Usman               │
│  │                   │  CNIC: 42201-XXXXXXX-X              │
│  └───────────────────┘  DOB: 12 Jan 1992                   │
│                          Match: ✅ Name matches account     │
│                                                            │
│  Liveness Check: ✅ Passed                                  │
│  Duplicate CNIC: ✅ Not found                               │
│  Sanctions Check: ✅ Clear                                  │
│                                                            │
│  Reviewer Notes:                                           │
│  [________________________________________________]        │
│                                                            │
│  [← Previous]  [Approve ✓]  [Reject ✗]  [Next →]         │
│                                                            │
│  Reject Reason (if rejecting):                             │
│  ● Image too blurry                                        │
│  ○ CNIC expired                                            │
│  ○ Name mismatch                                           │
│  ○ Suspected fake document                                 │
│  ○ Other: [_____________]                                  │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 18 — DISPUTE RESOLUTION ADMIN PANEL (`/admin/disputes`)

### Dispute Queue
```
┌────────────────────────────────────────────────────────────┐
│  Dispute Resolution                  [5 Open] [Filter▼]    │
├──────┬──────────────────┬────────┬─────────────┬───────────┤
│ ID   │ Trade            │ Amount │ Opened      │ Status    │
├──────┼──────────────────┼────────┼─────────────┼───────────┤
│ D088 │ #PKS-472 BUY USDT│ 5k PKR │ 2h ago      │ [Resolve] │
│ D087 │ #PKS-441 SELL BTC│ 40k PKR│ 5h ago ⚠️  │ [Resolve] │
└──────┴──────────────────┴────────┴─────────────┴───────────┘
```

### Dispute Resolution View
```
┌────────────────────────────────────────────────────────────┐
│  Dispute #D088 — Trade #PKS-472                            │
│  Opened: 05 May 2026, 3:40 PM   Agent: You                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  BUYER: Muhammad Usman (#2814)    KYC: ✅ Full             │
│  SELLER: CryptoKing (#0042)       KYC: ✅ Full Merchant    │
│  Amount: 17.82 USDT | 5,000 PKR | JazzCash                 │
│  USDT Status: 🔒 In Escrow                                 │
│                                                            │
│  Buyer's Claim:                                            │
│  "I sent 5,000 PKR via JazzCash. Here is my screenshot."   │
│  [payment_proof.jpg] [chat_screenshot.jpg]                 │
│                                                            │
│  Seller's Claim:                                           │
│  "I have not received any payment on JazzCash."            │
│  [seller_jazzcash_history.jpg]                             │
│                                                            │
│  Timeline of Trade:                                        │
│  3:00 PM - Trade created                                   │
│  3:02 PM - Escrow locked                                   │
│  3:14 PM - Buyer clicked "I've Paid"                       │
│  3:15 PM - Seller opened dispute                           │
│                                                            │
│  JazzCash TX ID provided by buyer: JZ2026050500834         │
│  [Request JazzCash Verification ▶] (contact JazzCash API)  │
│                                                            │
│  Chat Log: [View Full Trade Chat]                          │
│                                                            │
│  Resolution:                                               │
│  ● Release USDT to Buyer (payment confirmed)               │
│  ○ Return USDT to Seller (payment not found)               │
│                                                            │
│  Decision Notes (required):                                │
│  [__________________________________________________]      │
│                                                            │
│  ☑ Notify both parties by SMS + Email                      │
│  ☑ Add note to loser's account                             │
│  ☐ Flag user for suspicious activity                       │
│  ☐ Suspend user account pending investigation              │
│                                                            │
│  [Chat with Buyer]  [Chat with Seller]  [Execute Decision] │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 19 — FRAUD / RISK MONITORING (`/admin/fraud`)

```
┌────────────────────────────────────────────────────────────┐
│  Fraud & Risk Monitoring                                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔴 HIGH RISK ALERTS (3)                                   │
│  ─────────────────────────────────────────────            │
│  ⚠️  User #3201: 5 cancelled trades in 2 hours (possible   │
│     fee avoidance or manipulation)  [View] [Restrict]      │
│                                                            │
│  ⚠️  User #0042 (CryptoKing): Dispute rate spiked to 8%    │
│     over past 7 days  [View] [Notify]                      │
│                                                            │
│  ⚠️  New user registered with same CNIC as banned user #1122│
│     [View] [Ban] [Mark False Positive]                     │
│                                                            │
│  🟡 MEDIUM RISK FLAGS (12)                                 │
│  ─────────────────────────────────────────────            │
│  • Multiple accounts sharing same device fingerprint (7)   │
│  • Unusual trading pattern: Buy + Sell same coin (5)       │
│                                                            │
│  ─────────────────────────────────────────────            │
│                                                            │
│  Risk Rules Engine                                         │
│  ─────────────────────────────────────────────            │
│  Rule 1: Flag if > 3 cancelled trades / 24hrs              │
│  Rule 2: Flag if dispute rate > 5% over 30 trades          │
│  Rule 3: Flag if same CNIC on multiple accounts            │
│  Rule 4: Flag if trade amount suddenly 10x normal pattern  │
│  Rule 5: Flag if IP geolocation mismatch                   │
│  [+ Add Rule]  [Edit Rules]                                │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Suspicious Trade Monitor (live)                           │
│  [Trade map: live graph of active trades]                  │
│  [Volume anomaly chart: hourly PKR volume vs 30-day avg]   │
└────────────────────────────────────────────────────────────┘
```

---

## PAGE 20 — SETTINGS / SECURITY (`/settings`)

### Security Tab
```
┌────────────────────────────────────────────────────────────┐
│  Security Settings                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Password                                                  │
│  Last changed: 01 April 2026                              │
│  [Change Password]                                         │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Two-Factor Authentication (2FA)              🟢 ENABLED  │
│  Google Authenticator                                      │
│  [Disable 2FA]  [View Backup Codes]                        │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Anti-Phishing Code                                        │
│  "PAKSWAP-4721"                                            │
│  This code appears in all genuine PakSwap emails.          │
│  [Change Code]                                             │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Login Notifications                                       │
│  ☑ Email me on new login                                   │
│  ☑ SMS me on new device login                              │
│  ☑ Email me on password change                             │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Active Sessions                                           │
│  ✅ Current: Chrome | Lahore, PK | 05 May 2026            │
│  ⚠️  iPhone 14 | Karachi, PK | 03 May 2026               │
│  [Terminate Other Sessions]                                │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Withdrawal Whitelist                                      │
│  Only allow withdrawals to approved addresses.             │
│  [Manage Whitelist] [OFF ●]                                │
│                                                            │
│  ─────────────────────────────────────────────            │
│  🔴 Danger Zone                                            │
│  [Deactivate Account]  [Delete Account]                    │
└────────────────────────────────────────────────────────────┘
```

### Notification Settings Tab
```
  Email Notifications:
  ☑ Trade started / completed
  ☑ Dispute opened / resolved
  ☑ KYC approved / rejected
  ☑ New device login
  ☐ Marketing & promotions

  SMS Notifications:
  ☑ Trade started (incoming)
  ☑ Payment claimed (as seller)
  ☑ New device login

  Push Notifications (app):
  ☑ All trade activity
  ☑ Dispute updates
  ☑ Price alerts
```

### Profile Settings Tab
```
  Display Name: Muhammad Usman
  Username: @m.usman  (cannot change after 30 days)
  Email: m.usman@gmail.com  [Verified ✓]
  Phone: 0312-XXXXXXX  [Verified ✓]
  Language: English | اردو
  Timezone: PKT (UTC+5)
  [Save Changes]
```
