# Page-by-Page Wireframe Descriptions — Part 1 (Pages 1–10)
**PakSwap P2P Platform**

> **SUPERSEDED** — This document contains early text wireframes only. The authoritative UI reference is the HTML mockups in the `html/` directory. Use these text wireframes for historical context only; do not implement from them.

---

## PAGE 1 — LANDING PAGE (`/`)

### Purpose
Convert visitors into registered users. Build trust immediately. Target: Pakistanis who want to buy/sell crypto with PKR.

### Above the Fold (Hero Section)
```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO: PakSwap]          [How it Works] [Fees] [Login] [Register ▶] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ★ Pakistan's Most Trusted P2P Crypto Exchange              │
│                                                              │
│   Buy & Sell USDT, BTC, ETH                                  │
│   with JazzCash, Easypaisa & Bank Transfer                   │
│                                                              │
│   ┌─────────────┐  ┌────────────┐                           │
│   │  I Want to  │  │ I Want to  │                           │
│   │  BUY Crypto │  │ SELL Crypto│                           │
│   └─────────────┘  └────────────┘                           │
│                                                              │
│   [USDT ▼] [Amount in PKR: ________] [Find Best Rate →]     │
│                                                              │
│   🔒 Secured by Escrow   ✓ KYC Verified Merchants            │
└─────────────────────────────────────────────────────────────┘
```

### Trust Bar (Below Hero)
```
┌──────────┬───────────────┬───────────────┬──────────────────┐
│ 50,000+  │  99.1%        │  PKR          │  4.9★            │
│ Trades   │  Completion   │  Payments     │  User Rating     │
│ Completed│  Rate         │  Supported    │  (3,200 reviews) │
└──────────┴───────────────┴───────────────┴──────────────────┘
```

### How It Works Section
```
3-step visual flow (horizontal on desktop, vertical on mobile):

[1. Register & Verify]  →  [2. Choose an Offer]  →  [3. Pay & Receive Crypto]
 Create account in 2min     Browse 100+ merchants      PKR → USDT in 15 min
 KYC with your CNIC          Filter by payment method   Protected by escrow
```

### Supported Coins Section
```
[USDT logo] USDT    [BTC logo] Bitcoin    [ETH logo] Ethereum    [USDC logo] USDC
"More coins coming soon"
```

### Supported Payment Methods
```
[JazzCash] [Easypaisa] [HBL] [MCB] [UBL] [Meezan Bank] [Bank Alfalah]
[+ more banks]
"Any Pakistani bank transfer accepted"
```

### Live Marketplace Preview (Read-only table)
```
┌─────────────────────────────────────────────────────────────┐
│ USDT/PKR Live Rates           [Buy Tab] [Sell Tab]          │
├──────────┬────────┬──────────┬────────────────┬─────────────┤
│ Merchant │ Rate   │ Limits   │ Payment        │             │
├──────────┼────────┼──────────┼────────────────┼─────────────┤
│ CryptoKing│ 280.50│ 1k–200k │ JazzCash       │ [Buy →]     │
│ PKR_Pro  │ 280.20│ 5k–500k │ Bank Transfer  │ [Buy →]     │
│ FastTrade│ 279.90│ 2k–100k │ Easypaisa      │ [Buy →]     │
└──────────┴────────┴──────────┴────────────────┴─────────────┘
[Login to Trade]
```

### Merchant Testimonials
3-card carousel with photo, name (partial), city, and quote about platform safety.

### Security & Trust Section
```
[Shield Icon] Escrow Protection
All trades use non-custodial escrow. Crypto is only released after payment confirmed.

[Verified Icon] 100% KYC Verified
Every user verified with CNIC. No anonymous trading.

[Speed Icon] Fast Resolution
Disputes resolved within 4 hours by our trained team.

[Lock Icon] Bank-Grade Security
2FA, device fingerprinting, SSL encryption on all transactions.
```

### FAQ Accordion
- How does escrow work?
- Is P2P trading legal in Pakistan?
- What if the seller doesn't release crypto?
- How long does KYC take?

### Footer
- Links: About, Fees, Blog, Careers, Contact
- Legal: Terms of Service, Privacy Policy, AML Policy
- Social: Twitter/X, Instagram, Telegram, YouTube
- "© 2026 PakSwap. Crypto trading involves risk."

---

## PAGE 2 — LOGIN / REGISTER (`/login`, `/register`)

### Login Page Layout
```
┌─────────────────────────────────────┐
│          [PakSwap Logo]             │
│                                     │
│   Welcome Back                      │
│   ─────────────────────────         │
│   📧 Email or Phone Number          │
│   [_____________________________]   │
│                                     │
│   🔒 Password                       │
│   [_____________________________]   │
│   [Forgot Password?]                │
│                                     │
│   [        Login         ]          │
│                                     │
│   ──────── or ────────              │
│                                     │
│   [  Continue with Google  ]        │
│                                     │
│   Don't have an account?            │
│   [Create Account]                  │
└─────────────────────────────────────┘
```

**Security Elements:**
- Rate limiting: 5 failed attempts → 15min lockout + email alert
- Device fingerprint check → alert if new device
- reCAPTCHA v3 (invisible)
- OTP required if new device/location

### Register Page — Multi-step Form

**Step 1: Basic Info**
```
┌─────────────────────────────────────┐
│  Create Your Account  [1 of 3] ●○○  │
│                                     │
│  Full Name (as on CNIC)             │
│  [_____________________________]    │
│                                     │
│  Email Address                      │
│  [_____________________________]    │
│                                     │
│  Pakistani Phone Number             │
│  [+92] [_______________________]    │
│                                     │
│  Referral Code (optional)           │
│  [_____________________________]    │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

**Step 2: Password + OTP**
```
  Set Password
  Confirm Password
  [Strength meter: Weak / Good / Strong]

  Verify Phone: OTP sent to +92-3XX-XXXXXXX
  [_] [_] [_] [_] [_] [_]  Resend in 0:45
```

**Step 3: Terms Consent**
```
  ☑ I agree to Terms of Service
  ☑ I agree to Privacy Policy
  ☑ I am 18+ years old
  ☐ Subscribe to updates (optional)

  [Create Account]
```

**Post-Registration:**
- Welcome screen with next step: "Verify your identity to start trading"
- Onboarding checklist sidebar appears

---

## PAGE 3 — KYC VERIFICATION (`/kyc`)

### KYC Hub (Progress Overview)
```
┌─────────────────────────────────────────────────────────┐
│  Identity Verification              Status: ⏳ In Progress│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [✓] Step 1: CNIC Upload           Completed            │
│  [●] Step 2: Selfie Check          In Progress          │
│  [○] Step 3: Address Proof         Pending              │
│  [○] Step 4: Review                Awaiting Submission  │
│                                                          │
│  Why verify? Unlock trading limits up to 500,000 PKR/day│
└─────────────────────────────────────────────────────────┘
```

### Step 1: CNIC Upload
```
┌─────────────────────────────────────────────────────────┐
│  National Identity Card (CNIC)                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │                     │  │                     │       │
│  │   [Upload Front]    │  │   [Upload Back]     │       │
│  │   📷 or drag & drop │  │   📷 or drag & drop │       │
│  │                     │  │                     │       │
│  └─────────────────────┘  └─────────────────────┘       │
│  CNIC Front                CNIC Back                     │
│                                                          │
│  Tips:                                                   │
│  ✓ Photo must be clear and fully visible                 │
│  ✓ No glare or shadows                                   │
│  ✓ Must match your registered name                       │
│  ✗ Screenshots or photocopies not accepted               │
│                                                          │
│  [Continue to Selfie →]                                  │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Selfie / Liveness Check
```
  Live camera view with oval face guide
  Instructions:
  1. "Look straight into camera"
  2. "Slowly turn left"
  3. "Slowly turn right"
  4. "Smile"

  Liveness detection (anti-spoofing)
  Auto-capture when pose detected
```

### Step 3: Address Proof (for higher limits)
```
  Upload ONE of the following:
  ● Utility Bill (not older than 3 months)
  ○ Bank Statement (last 90 days)
  ○ NADRA Certificate

  [Upload Document]
  "Must clearly show your name and address"
```

### KYC Status Page
```
┌─────────────────────────────────────────────────────────┐
│  🕐 Verification Under Review                            │
│                                                          │
│  We're reviewing your documents. This usually takes     │
│  15 minutes to 2 hours during business hours.           │
│                                                          │
│  Submitted: 05 May 2026, 2:30 PM                        │
│  Estimated: 05 May 2026, by 4:30 PM                     │
│                                                          │
│  You'll receive an SMS and email when approved.         │
│                                                          │
│  [View Marketplace] [Go to Dashboard]                   │
└─────────────────────────────────────────────────────────┘
```

**Rejection Handling:**
- Clear reason shown: "CNIC image is blurry — please retake"
- Re-upload button immediately available
- Support chat link

---

## PAGE 4 — P2P MARKETPLACE (`/marketplace`)

### Layout Overview (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│  [BUY] [SELL]    Coin: [USDT ▼]  Pay with: [All Methods ▼]      │
│  Amount (PKR): [___________]    [Search Offers]                  │
├──────────────────────────────────┬──────────────────────────────┤
│  FILTERS (sidebar)               │  LISTINGS                    │
│  ─────────────────               │                              │
│  Price Range                     │  Sorted by: [Best Rate ▼]    │
│  [Min PKR] to [Max PKR]          │                              │
│  ─────────────────               │  ┌──────────────────────────┐│
│  Payment Methods                 │  │ CryptoKing 👑 MERCHANT   ││
│  ☑ JazzCash                      │  │ ★4.9 | 1,240 trades      ││
│  ☑ Easypaisa                     │  │ 99.2% completion         ││
│  ☑ Bank Transfer                 │  │ Avg. release: 4 min      ││
│  ☑ HBL                           │  │ ─────────────────────── ││
│  ☑ MCB                           │  │ Rate: 280.50 PKR/USDT    ││
│  ─────────────────               │  │ Limits: 1,000–200,000 PKR││
│  Amount Range                    │  │ Methods: JazzCash         ││
│  Min: [1,000] Max: [500,000]     │  │                          ││
│  ─────────────────               │  │      [BUY USDT →]        ││
│  Merchant Only                   │  └──────────────────────────┘│
│  [Toggle]                        │  ┌──────────────────────────┐│
│  ─────────────────               │  │ PKR_Pro  ✓ VERIFIED      ││
│  Online Only                     │  │ ★4.7 | 890 trades        ││
│  [Toggle]                        │  │ [...]                    ││
│                                  │  └──────────────────────────┘│
└──────────────────────────────────┴──────────────────────────────┘
```

### Listing Card — Full Spec
```
┌────────────────────────────────────────────────────────┐
│  [Avatar] CryptoKing          👑 Merchant  🟢 Online   │
│           ★ 4.9 (1,240 trades)  99.2% completion       │
│           ⚡ Avg. release: 4 min                        │
├────────────────────────────────────────────────────────┤
│  Price:    280.50 PKR / USDT                           │
│  Available: 5,000 USDT                                  │
│  Limits:   1,000 PKR — 200,000 PKR                     │
│  Payment:  [JazzCash] [Bank HBL]                       │
├────────────────────────────────────────────────────────┤
│  Terms: "Send from registered account only"            │
│                                    [BUY USDT →]        │
└────────────────────────────────────────────────────────┘
```

### Mobile View (375px)
- Single column listings
- Filters in a bottom sheet drawer (tap "Filter" button)
- Coin/side switcher as tab bar at top
- Each card is compact with expandable "See Details"

### Empty State
"No offers found for your filters. Try adjusting amount or payment method."
[Clear Filters] [See All Offers]

---

## PAGE 5 — BUY CRYPTO FLOW

### Step 1: Enter Amount Modal (triggered from marketplace)
```
┌──────────────────────────────────────────────────────┐
│  Buy USDT from CryptoKing                            │
│  Rate: 280.50 PKR per USDT                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  I want to spend (PKR)                               │
│  [_________5,000_________] PKR                      │
│                                                      │
│  You will receive:                                   │
│  ≈ 17.82 USDT  (after 0% fee)                       │
│                                                      │
│  Limits: 1,000 PKR — 200,000 PKR                    │
│                                                      │
│  Payment Method:                                     │
│  ○ JazzCash   ○ Bank Transfer HBL                   │
│                                                      │
│  [Cancel]         [Confirm & Start Trade →]          │
└──────────────────────────────────────────────────────┘
```

### Step 2: Trade Room opens (see Page 7)

### Order Confirmation Screen (Post-trade)
```
┌──────────────────────────────────────────────────────┐
│         ✅ Trade Complete!                            │
│                                                      │
│   17.82 USDT                                         │
│   has been added to your wallet                      │
│                                                      │
│   ┌────────────────────────────────────┐             │
│   │ Order #PKS-2026-00472              │             │
│   │ 05 May 2026, 3:14 PM              │             │
│   │ Rate: 280.50 PKR/USDT             │             │
│   │ Paid: 5,000 PKR (JazzCash)        │             │
│   └────────────────────────────────────┘             │
│                                                      │
│   Rate this trade:  ★ ★ ★ ★ ★                       │
│   Leave a comment for CryptoKing (optional)          │
│   [_____________________________________]            │
│                                                      │
│   [Submit Rating]   [Go to Wallet]                   │
│                                                      │
│   🎁 Refer a friend and earn 500 PKR!               │
│   [Share Referral Link]                              │
└──────────────────────────────────────────────────────┘
```

---

## PAGE 6 — SELL CRYPTO FLOW

### Step 1: Select Sell Offer from Marketplace
Same marketplace but with "SELL" tab active.

### Step 2: Enter Sell Amount
```
┌──────────────────────────────────────────────────────┐
│  Sell USDT to PKR_Pro                                │
│  Rate: 279.20 PKR per USDT                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  I want to sell (USDT)                               │
│  [__________20__________] USDT                      │
│  Available in wallet: 35.50 USDT                    │
│                                                      │
│  You will receive:                                   │
│  ≈ 5,584 PKR                                        │
│                                                      │
│  Receive payment to:                                 │
│  ● JazzCash: 0312-XXXXXXX (saved)                   │
│  ○ Add new payment method                            │
│                                                      │
│  [Cancel]         [Sell & Lock USDT →]               │
└──────────────────────────────────────────────────────┘
```

**Important UX Note:** On clicking "Sell & Lock USDT", the USDT is immediately
moved to escrow. User sees confirmation: "20 USDT locked in escrow. Waiting for buyer."

---

## PAGE 7 — TRADE / ESCROW ROOM (`/trade/:orderId`)

### Most Critical Page — Highest UX Priority

#### Buyer View
```
┌────────────────────────────────────────────────────────────┐
│  Trade #PKS-2026-00472              ⏱ 14:32 remaining      │
│  🔒 USDT IS LOCKED IN ESCROW                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  STATUS: Waiting for your payment                          │
│  ────────────────────────────────                          │
│                                                            │
│  Send  5,000 PKR  via  JazzCash                           │
│  To:   [0312-4567890]  [Copy]                              │
│  Name: Muhammad Ahmed                                      │
│                                                            │
│  ⚠️  Important Instructions:                               │
│  • Send EXACTLY 5,000 PKR — no more, no less              │
│  • Send from your own registered JazzCash account          │
│  • Do NOT include any message/reference                    │
│  • Do NOT cancel after clicking "I've Paid"                │
│                                                            │
│  Seller's Terms:                                           │
│  "Send from your own account only. No third-party."        │
│                                                            │
│  ─────────────────────────────────────────────            │
│  Upload payment proof (optional but recommended):          │
│  [📎 Upload Screenshot]  screenshot_jazzcash.jpg ✓        │
│                                                            │
│  ─────────────────────────────────────────────            │
│                                                            │
│  [  Open Dispute  ]        [✅ I've Paid — Notify Seller ] │
│                                                            │
└────────────────────────────────────────────────────────────┘
│  💬 Trade Chat                                             │
│  ─────────────────────────────────────────────            │
│  [CryptoKing]: Please send from your JazzCash account      │
│  [You]: Payment sent, screenshot uploaded                  │
│  [Type message...]                    [Send]               │
└────────────────────────────────────────────────────────────┘
```

#### Seller View (after buyer confirms payment)
```
┌────────────────────────────────────────────────────────────┐
│  Trade #PKS-2026-00472              STATUS: Payment Claimed │
│  🔒 17.82 USDT IN ESCROW                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Buyer claims they sent:  5,000 PKR via JazzCash           │
│  From: 0300-XXXXXXX (buyer's registered number)           │
│                                                            │
│  Uploaded proof: [View Screenshot]                         │
│                                                            │
│  ⚠️  VERIFY BEFORE RELEASING                               │
│  Check your JazzCash account for:                          │
│  • Amount: Exactly 5,000 PKR                              │
│  • From: Registered account only                          │
│  • Time: After trade started (3:00 PM today)              │
│                                                            │
│  [  Open Dispute  ]        [✅ Payment Received — Release USDT] │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Trade State Machine (Visual)
```
CREATED → ESCROW_LOCKED → PAYMENT_PENDING → PAYMENT_CLAIMED
    → RELEASING → COMPLETED
    → DISPUTED → RESOLVED
    → CANCELLED (only before PAYMENT_CLAIMED)
    → EXPIRED (timer runs out)
```

#### Timer Behavior
- 15 min default (merchant configurable: 10–30 min)
- Yellow warning at 5 min
- Red at 2 min
- On expire: trade auto-cancelled, USDT returned to seller
- "Need more time?" button → extends by 5 min once (buyer must confirm)

---

## PAGE 8 — USER WALLET DASHBOARD (`/wallet`)

```
┌────────────────────────────────────────────────────────────┐
│  My Wallet                              [Deposit] [Withdraw]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Total Balance                                             │
│  ≈ 12,450 PKR equivalent                                  │
│                                                            │
│  ┌──────────┬───────────┬──────────┬──────────────────┐   │
│  │ USDT     │ BTC       │ ETH      │ USDC             │   │
│  │ 35.50    │ 0.00142   │ 0.0821   │ 0.00             │   │
│  │ $35.50   │ $98.20    │ $241.50  │ $0.00            │   │
│  └──────────┴───────────┴──────────┴──────────────────┘   │
│                                                            │
│  [+ Add Coin]                                              │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  USDT Wallet Detail                                        │
│  ─────────────────────────────────────────────────        │
│  Available:  35.50 USDT                                    │
│  In Escrow:   0.00 USDT  [?]                              │
│  Pending:     0.00 USDT                                    │
│                                                            │
│  Deposit Address (TRC-20):                                 │
│  [TXxxxxxxxxxxxxxxxxxxx]  [Copy] [QR Code]                │
│  ⚠️  Only send USDT (TRC-20) to this address               │
│                                                            │
│  [Deposit USDT]    [Withdraw USDT]                         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Recent Transactions                              [View All]│
│  ─────────────────────────────────────────────────        │
│  ↓ +17.82 USDT  P2P Buy  #PKS-472    05 May  Completed    │
│  ↑ -20.00 USDT  P2P Sell #PKS-441   03 May  Completed    │
│  ↓ +50.00 USDT  Deposit              01 May  Confirmed    │
└────────────────────────────────────────────────────────────┘
```

### Deposit Flow
```
1. Select coin + network (USDT: TRC-20 / ERC-20 / BEP-20)
2. Show deposit address + QR code
3. Warning: minimum deposit, correct network
4. Confirmation: "Deposit detected — 1/20 confirmations"
5. Credit after required blockchain confirmations
```

### Withdraw Flow
```
1. Enter withdrawal address
2. Select network
3. Enter amount (shows fee: 1 USDT)
4. 2FA required
5. Email/SMS OTP confirmation
6. Processing: 10–30 minutes
```

---

## PAGE 9 — PAYMENT METHODS (`/payment-methods`)

```
┌────────────────────────────────────────────────────────────┐
│  Payment Methods                            [+ Add Method]  │
├────────────────────────────────────────────────────────────┤
│  These are your verified payment accounts for P2P trading  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📱 JazzCash                            ✓ Verified    │  │
│  │ Account: 0312-4567890                                │  │
│  │ Name: Muhammad Usman                                 │  │
│  │ Status: Active                [Edit] [Remove]        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🏦 HBL Bank Transfer                   ✓ Verified    │  │
│  │ Account: XXXX-XXXX-XXXX-1234                        │  │
│  │ Name: Muhammad Usman                                 │  │
│  │ IBAN: PK36HABB0000000100000000                      │  │
│  │ Status: Active                [Edit] [Remove]        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [+ Add JazzCash]  [+ Add Easypaisa]  [+ Add Bank]         │
└────────────────────────────────────────────────────────────┘
```

### Add Payment Method Flow
```
Step 1: Select type
  ● JazzCash
  ○ Easypaisa
  ○ Bank Transfer
  ○ Nayapay
  ○ SadaPay

Step 2: Enter details
  For JazzCash:
    Phone Number: [0312-_______]
    Account Name: [Auto-fetched or manual]
    [Upload account screenshot for verification]

  For Bank Transfer:
    Bank Name: [Dropdown]
    Account Title: [_______]
    Account Number: [_______]
    IBAN: [PK______________]
    Branch: [Optional]

Step 3: Verification
  "We'll verify this matches your KYC name"
  Manual review: 2–4 hours

Step 4: Confirmed
  "Payment method added and verified ✓"
```

**Important Rule:** Payment method name must match KYC name exactly. This is anti-fraud.

---

## PAGE 10 — ORDERS / TRADE HISTORY (`/orders`)

```
┌────────────────────────────────────────────────────────────┐
│  My Orders                                                  │
├──────────────┬─────────────────┬──────────────────────────┤
│  [Active (2)]│  [Completed]    │  [Cancelled]              │
├──────────────┴─────────────────┴──────────────────────────┤
│                                                            │
│  Search: [_________________]  Filter: [Date▼] [Coin▼]     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ #PKS-2026-00472     BUY USDT         05 May 2026     │ │
│  │ 17.82 USDT  ←  5,000 PKR            3:14 PM         │ │
│  │ Merchant: CryptoKing  |  JazzCash   ✅ Completed     │ │
│  │                                [View Details] [Rate] │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ #PKS-2026-00441     SELL USDT        03 May 2026     │ │
│  │ 20 USDT  →  5,584 PKR               1:45 PM         │ │
│  │ Merchant: PKR_Pro   |  Bank HBL    ✅ Completed     │ │
│  │                                [View Details]        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Showing 2 of 12 orders          [Load More]               │
└────────────────────────────────────────────────────────────┘
```

### Order Detail Modal / Page
```
Order #PKS-2026-00472
─────────────────────────────────────────────
Type:         BUY USDT
Amount:       17.82 USDT
Paid:         5,000 PKR
Rate:         280.50 PKR / USDT
Payment:      JazzCash
Merchant:     CryptoKing (view profile)
Status:       ✅ Completed
Initiated:    05 May 2026, 3:00 PM
Completed:    05 May 2026, 3:14 PM
Duration:     14 minutes
Your Rating:  ★★★★★
─────────────────────────────────────────────
[Download Receipt PDF]  [Report Issue]
```
