# Design System & Component Library
**PakSwap P2P Platform**

---

## 1. DESIGN PHILOSOPHY

**Core Principles:**
1. **Trust First** — Every visual element must reinforce security and reliability
2. **Clarity Over Cleverness** — Users are completing financial transactions; no confusion allowed
3. **Mobile Native** — Design for 375px first, expand to desktop
4. **Pakistani Context** — Colors, patterns, and language that feel local and professional
5. **Accessibility** — WCAG AA minimum; high contrast for outdoor mobile use

**Inspiration Sources:**
- Binance P2P: Clear trade room layout, status indicators
- Paytm (India): Approachable fintech for first-time users
- Revolut: Clean, trust-inducing UI
- JazzCash: Familiar color expectations for Pakistani users

---

## 2. COLOR SYSTEM

### Brand Colors
```
Primary Brand:    #1A56DB  (Deep Blue — trust, security, finance)
Primary Light:    #EBF5FF  (Light Blue — backgrounds, highlights)
Primary Dark:     #1035A8  (Dark Blue — hover states)

Accent Green:     #0E9F6E  (Emerald — success, completed, verified)
Accent Red:       #E02424  (Red — danger, disputes, errors)
Accent Orange:    #FF5A1F  (Orange — warnings, timer urgency)
Accent Gold:      #C27803  (Gold — merchant badge, premium)
```

### Neutral Palette
```
Gray-900:  #111827  (Primary text)
Gray-700:  #374151  (Secondary text)
Gray-500:  #6B7280  (Placeholder, disabled)
Gray-300:  #D1D5DB  (Borders, dividers)
Gray-100:  #F3F4F6  (Card backgrounds)
Gray-50:   #F9FAFB  (Page background)
White:     #FFFFFF
```

### Semantic Colors
```
Success:   #0E9F6E  + bg: #F3FAF7
Warning:   #C27803  + bg: #FDFDEA
Error:     #E02424  + bg: #FDF2F2
Info:      #1A56DB  + bg: #EBF5FF
```

### Coin Brand Colors
```
USDT:  #26A17B (Tether Green)
BTC:   #F7931A (Bitcoin Orange)
ETH:   #627EEA (Ethereum Purple-Blue)
USDC:  #2775CA (Circle Blue)
```

### Dark Mode
- Background: #0F172A
- Card: #1E293B
- Border: #334155
- Text Primary: #F1F5F9
- Text Secondary: #94A3B8

---

## 3. TYPOGRAPHY

### Font Stack
```
Primary:    'Inter' (Google Fonts) — clean, financial
Urdu:       'Noto Nastaliq Urdu' — authentic Urdu rendering
Monospace:  'JetBrains Mono' — wallet addresses, order IDs
```

### Type Scale
```
Display XL:  48px / 600 weight  → Hero headline
Display L:   36px / 600 weight  → Page titles
H1:          30px / 700 weight  → Section headers
H2:          24px / 600 weight  → Card headers
H3:          20px / 600 weight  → Sub-headers
Body L:      18px / 400 weight  → Primary body text
Body:        16px / 400 weight  → Default body
Body S:      14px / 400 weight  → Secondary, captions
Caption:     12px / 400 weight  → Labels, timestamps
Mono:        14px / 400 weight  → Addresses, IDs
```

### Urdu Typography Rules
- Urdu text: right-to-left, 18px minimum for readability
- Use Noto Nastaliq Urdu at 18px+ for body text
- Never kern or letter-space Urdu text
- Maintain separate RTL layout for Urdu mode

---

## 4. SPACING SYSTEM

Base unit: 4px

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  48px  (3rem)
3xl:  64px  (4rem)
```

---

## 5. KEY COMPONENTS

### 5.1 Trade Status Badge
```
Variants:
  [●] Created       — Gray
  [●] Escrow Locked — Blue
  [●] Payment Pending — Yellow
  [●] Payment Claimed — Orange
  [●] Completed      — Green
  [●] Cancelled      — Gray outline
  [●] Disputed       — Red
  [●] Expired        — Gray
```

### 5.2 Merchant Trust Card
```
┌──────────────────────────────────────────────────────┐
│ [Avatar 40px]  CryptoKing        👑 [Gold badge]     │
│                ★ 4.9 · 1,240 trades                  │
│                99.2% · ⚡4 min avg                   │
│ [🟢 Online]   [JazzCash] [HBL]                       │
└──────────────────────────────────────────────────────┘
Props:
  - avatarUrl: string
  - name: string
  - isMerchant: boolean
  - rating: number
  - tradeCount: number
  - completionRate: number
  - avgReleaseMinutes: number
  - isOnline: boolean
  - paymentMethods: string[]
```

### 5.3 Escrow Lock Banner
```
┌──────────────────────────────────────────────────────┐
│  🔒  17.82 USDT LOCKED IN ESCROW                     │
│      Your funds are protected by PakSwap Escrow       │
└──────────────────────────────────────────────────────┘

Colors: Blue background (#EBF5FF), Blue border (#1A56DB)
Always visible at top of trade room — never hidden
Critical trust element
```

### 5.4 Countdown Timer
```
State: Normal (>5min):  [13:42]  Gray/Blue
State: Warning (2-5min): [04:30]  Orange + pulse animation
State: Danger (<2min):   [01:10]  Red + faster pulse

Props:
  - expiresAt: Date
  - onExpire: () => void
  - onWarning: (remaining: number) => void
```

### 5.5 Coin Amount Display
```
Primary amount:   17.82 USDT    (large, bold, coin color)
Secondary amount: ≈ 5,000 PKR   (smaller, gray)

Always show both. Never show only one denomination.
```

### 5.6 KYC Status Indicator
```
○ Not Started    — Gray
◐ Pending Review — Yellow + spinner
● Approved       — Green check
✗ Rejected       — Red X + reason link
```

### 5.7 Payment Method Pill
```
[JazzCash logo] JazzCash
[Easypaisa logo] Easypaisa
[Bank icon] HBL Bank
[Bank icon] MCB Bank

Logo sizing: 20x20px
Background: brand color at 10% opacity
```

### 5.8 Rate Display
```
280.50 PKR / USDT
[▲ +0.58% vs market]  — Green when above market (seller view: better for them)
[▼ -0.30% vs market]  — Red when below market
```

### 5.9 Progress Steps
```
[●]──────[●]──────[○]──────[○]
Step 1   Step 2   Step 3   Step 4
Complete Active   Pending  Pending

Colors: Completed=Green, Active=Blue, Pending=Gray
```

### 5.10 Alert / Banner Components
```
Info Banner:    [ℹ️] Blue left border
Success Banner: [✓]  Green left border
Warning Banner: [⚠️] Orange left border — e.g., "Verify your account to trade"
Error Banner:   [✗]  Red left border — e.g., "Trade expired"
```

---

## 6. PAGE LAYOUT TEMPLATES

### 6.1 Authenticated Page Layout
```
┌─────────────────────────────────────────────────────┐
│  HEADER (64px)                                      │
│  [Logo] [Marketplace] [Wallet] [Orders] [Profile▼] │
│         [KYC Alert if pending]                      │
├─────────────────────────────────────────────────────┤
│  PAGE CONTENT                                       │
│  Max-width: 1200px, centered                        │
│  Padding: 24px horizontal                           │
│                                                     │
│  (Content fills here)                               │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER (minimal)                                   │
│  Terms · Privacy · Support · @2026 PakSwap          │
└─────────────────────────────────────────────────────┘
```

### 6.2 Mobile Layout
```
┌───────────────────┐
│ HEADER (56px)     │
│ [←] Title    [≡] │
├───────────────────┤
│                   │
│  PAGE CONTENT     │
│  padding: 16px    │
│                   │
├───────────────────┤
│ BOTTOM NAV (60px) │
│ 🏠  🔄  💼  👤   │
│ Home Mkt Wallet Me│
└───────────────────┘

Bottom Navigation Items:
  Home → /dashboard
  Market → /marketplace
  Wallet → /wallet
  Me → /settings
  + Floating Action Button: Create Ad (merchants only)
```

### 6.3 Trade Room Layout (Full Screen, Mobile)
```
Trade room takes full screen on mobile — no bottom nav shown.
┌───────────────────┐
│ [←] Trade #472    │
│ 🔒 USDT IN ESCROW │
├───────────────────┤
│ STATUS HEADER     │
│ Timer: 14:32      │
├───────────────────┤
│ MAIN ACTION AREA  │
│ (scrollable)      │
│                   │
├───────────────────┤
│ CHAT AREA         │
│ (collapsible)     │
├───────────────────┤
│ [CONFIRM PAYMENT] │ ← Sticky CTA button, always visible
└───────────────────┘
```

---

## 7. MOTION & ANIMATION

**Guiding Principle:** Animations communicate system state, not decoration.

| Animation | Duration | Use Case |
|-----------|----------|----------|
| Page transition | 200ms ease | Route change |
| Modal enter | 150ms ease-out | Dialogs |
| Card hover | 100ms | Listing cards |
| Timer pulse (warning) | 1s infinite | Trade room 2-5min |
| Timer pulse (danger) | 0.5s infinite | Trade room <2min |
| Success checkmark | 400ms | Trade complete |
| Loading skeleton | Gradient shimmer | Data loading |
| Toast notification | Slide in 200ms, auto-dismiss 4s | Alerts |

**No heavy animations** — many users on low-end Android phones in Pakistan.

---

## 8. ICONOGRAPHY

Library: **Heroicons** (Tailwind-compatible) + custom coin icons

Custom Icons Required:
- Escrow Lock (padlock with P2P arrows)
- Trade Room icon
- Pakistani Rupee (₨) symbol
- JazzCash (custom — brand)
- Easypaisa (custom — brand)
- PakSwap logo mark

All icons: 24px standard, 20px small, 16px inline

---

## 9. FORMS & INPUTS

### Input States
```
Default:   Border #D1D5DB, bg white
Focus:     Border #1A56DB, ring 3px #EBF5FF
Valid:      Border #0E9F6E, right icon ✓
Error:      Border #E02424, right icon ✗, error text below
Disabled:   Border #D1D5DB, bg #F3F4F6, text gray
```

### Amount Input (Special)
```
Large, centered, number-only keyboard on mobile
[  5,000  ] PKR
≈ 17.82 USDT  ← live conversion, updates on type
```

### OTP Input
```
6 individual boxes, 48x56px each
Auto-focus next on input
Auto-submit on 6th digit
```

---

## 10. MOBILE-SPECIFIC UX PATTERNS

### Bottom Sheet (Filter Drawer)
- Opens from bottom with handle
- 60% screen height max
- Dismiss: swipe down or tap backdrop

### Pull-to-Refresh
- On marketplace, orders, wallet pages
- Spinner animation aligned with brand color

### Haptic Feedback (Mobile App)
- Trade complete: success haptic
- Error: error haptic
- Button tap: light haptic

### Long-Press Context Menu
- On order cards: Copy order ID, Report Issue, View Details

### Toast Notifications
```
Position: Top of screen (below status bar)
Duration: 4 seconds
Types:
  ✅ "Payment confirmed — USDT released"
  ⚠️  "Trade expires in 2 minutes"
  🔔 "New trade from CryptoKing"
  ❌ "Trade cancelled"
```

---

## 11. TRUST DESIGN PATTERNS

### Escrow Visibility Pattern
The escrow lock indicator must appear on every page related to an active trade:
- Trade room header
- Order list (active trades)
- Notification content
- Email confirmations

**Rule:** Never let a user feel their funds are "floating" — always show where the crypto is.

### Merchant Verification Visual Hierarchy
```
👑 Gold Badge     → Verified Merchant (top tier)
✓  Blue Check     → KYC Verified User
🟢 Green Dot      → Currently online
⏱ Release Time   → Shown before completion rate (trust proxy)
★★★★★ Rating     → Prominent, always shown
```

### Security Reminder Pattern
On high-stakes actions (trade initiation, withdrawal), show:
```
┌──────────────────────────────────────────────────────┐
│  🔒 Security Reminder                                │
│  PakSwap will NEVER ask for your password or 2FA     │
│  code. Do not share these with anyone, including     │
│  people claiming to be PakSwap support.              │
└──────────────────────────────────────────────────────┘
```
This appears once per session, dismissible.

---

## 12. ERROR STATES & EMPTY STATES

### Error Pages
```
404 Not Found:
  Illustration: Lost person in Islamabad street
  "Page not found. Let's go back home."
  [Go to Homepage]

500 Server Error:
  Illustration: Construction sign
  "Something went wrong on our end. Your funds are safe."
  [Try Again] [Contact Support]
```

### Empty States (per page)
```
Marketplace (no results):
  Illustration: Empty shelf
  "No offers found. Try adjusting your filters or amount."
  [Clear Filters]

Orders (no history):
  Illustration: Empty clipboard
  "You haven't made any trades yet."
  [Browse Marketplace]

Wallet (no balance):
  Illustration: Empty wallet
  "Your wallet is empty. Deposit crypto to get started."
  [Deposit USDT]
```

---

## 13. RESPONSIVE BREAKPOINTS

```
Mobile:         0 — 767px    (primary design target)
Tablet:         768 — 1023px
Desktop:        1024 — 1279px
Wide Desktop:   1280px+

Key differences:
  - Mobile: single column, bottom nav, bottom sheets
  - Tablet: 2-column marketplace, side filters
  - Desktop: full sidebar, multi-column dashboard
```

---

## 14. TAILWIND CSS CONFIGURATION (Suggested)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EBF5FF',
          100: '#C3DAFE',
          500: '#1A56DB',
          600: '#1A47C6',
          900: '#1035A8',
        },
        success:  '#0E9F6E',
        warning:  '#C27803',
        danger:   '#E02424',
        merchant: '#C27803',
        usdt:     '#26A17B',
        bitcoin:  '#F7931A',
        eth:      '#627EEA',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        urdu:  ['Noto Nastaliq Urdu', 'serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
    }
  }
}
```
