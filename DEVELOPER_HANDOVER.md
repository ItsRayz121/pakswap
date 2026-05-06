# PakSwap — Complete Developer Handover Guide
**Version:** 1.0 | **Date:** May 2026 | **Prepared for:** Lead Developer

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [What Has Been Delivered](#2-what-has-been-delivered)
3. [The 17 Specification Documents](#3-the-17-specification-documents)
4. [The 33 HTML Mockup Pages — Full Map](#4-the-33-html-mockup-pages--full-map)
5. [How to Use the HTML Mockups](#5-how-to-use-the-html-mockups)
6. [Tech Stack — All Locked Decisions](#6-tech-stack--all-locked-decisions)
7. [Non-Negotiable Business Rules](#7-non-negotiable-business-rules)
8. [What Is Left to Build (Backend)](#8-what-is-left-to-build-backend)
9. [Build Order — Recommended Sequence](#9-build-order--recommended-sequence)
10. [Key Integrations and Third-Party Services](#10-key-integrations-and-third-party-services)
11. [Security Checklist](#11-security-checklist)
12. [Pakistan-Specific Requirements](#12-pakistan-specific-requirements)

---

## 1. What This Project Is

**PakSwap** is a peer-to-peer crypto exchange built specifically for Pakistan. It allows Pakistani users to buy and sell crypto (USDT, BTC, ETH, USDC) using local payment methods — JazzCash, Easypaisa, and bank transfers — with PKR as the denominator.

**Two core products:**
- **P2P Marketplace** — Users post buy/sell ads, trade directly with each other. Crypto held in internal escrow. Payments manually verified by admin before release.
- **Instant Buy / OTC** — Fixed-price buy/sell against merchant inventory. Mode A: user pays in PKR (screenshot). Mode B: user pays in crypto (blockchain deposit).

**Target users:** Pakistani retail crypto traders, merchants (high-volume traders), and Instant Buy providers (businesses providing liquidity).

**Admin/Owner panel** — Full internal dashboard for KYC review, payment verification, dispute resolution, fraud monitoring, user management, and platform settings.

---

## 2. What Has Been Delivered

### Specification Documents (17 files)
Complete product, architecture, database, and business rules — see Section 3.

### HTML Mockups (33 pages)
Pixel-accurate static mockups of every user-facing and admin screen — see Section 4.
- Built with vanilla HTML + CSS (`styles.css`) + inline JavaScript
- No framework. No build step required to view — just open in a browser.
- Shared stylesheet: `html/styles.css`
- These are the **source of truth for UI** — all components, layouts, and UX flows are defined here.

---

## 3. The 17 Specification Documents

All files are in the root `g:/p2p/` directory. Read them in this order before writing a single line of backend code.

| # | File | What It Covers | Priority |
|---|------|----------------|----------|
| 00 | `00_INDEX.md` | Master index, quick-reference decisions, canonical roadmap, fee model | **Read first** |
| 04 | `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` | Full PostgreSQL schema, REST API routes, WebSocket events, escrow engine, blockchain integration | **Critical** |
| 11 | `11_TECH_STACK_DECISIONS.md` | All locked tech decisions — do not deviate without discussion | **Critical** |
| 07 | `07_PAKSWAP_COMPLETE_MASTER_PLAN.md` | Scam vectors (Sec 4), free AI tools (Sec 6), **mandatory two-layer verification policy (Sec 11)** | **Critical** |
| 12 | `12_ADMIN_WORKFLOW_SPEC.md` | Step-by-step admin flows — KYC, payment approve/reject, disputes, force release, user suspension, audit log | **Critical** |
| 10 | `10_SCREENSHOT_VERIFICATION_SPEC.md` | OCR engine, payment template fields, name matching (Levenshtein + Urdu romanization), manipulation detection | **Critical** |
| 13 | `13_RATE_LIMITS_AND_ERROR_STATES.md` | All API rate limits, KYC/trade limits, full error code table, edge case handling | **Critical** |
| 08 | `08_INSTANT_BUY_OTC_BLUEPRINT.md` | Instant Buy Mode A (PKR flow), pricing engine, DB schema | High |
| 09 | `09_CRYPTO_TO_CRYPTO_BLUEPRINT.md` | Instant Buy Mode B (crypto payment), blockchain monitor, payout queue | High |
| 17 | `17_DEPLOYMENT_SPEC.md` | Docker Compose local dev (8 services), AWS production architecture, CI/CD, cost estimates, pre-launch checklist | High |
| 05 | `05_BUSINESS_MODEL_MVP_ROADMAP_COMPLIANCE.md` | Fee model, revenue projections, MVP scope, 4-phase roadmap, AML/KYC compliance rules | High |
| 14 | `14_NOTIFICATION_SYSTEM_SPEC.md` | Every notification trigger, channel (SMS/email/push/in-app), exact message templates | Medium |
| 16 | `16_MERCHANT_DASHBOARD_SPEC.md` | Merchant post-approval access, inventory flows, commission calculation, payout | Medium |
| 06 | `06_DESIGN_SYSTEM_AND_COMPONENTS.md` | Color palette, typography, spacing, components — **already built into styles.css** | Reference |
| 01 | `01_SITEMAP_AND_USER_JOURNEY.md` | Full sitemap, 3 complete user journey maps (buy/sell/dispute) | Reference |
| 15 | `15_MOBILE_APP_SPEC.md` | React Native (Expo) mobile app spec — Phase 3 | Future |
| 02 | `02_PAGE_WIREFRAMES_PART1.md` | **Superseded** by HTML mockups | Archive |
| 03 | `03_PAGE_WIREFRAMES_PART2.md` | **Superseded** by HTML mockups | Archive |

---

## 4. The 33 HTML Mockup Pages — Full Map

All files are in `g:/p2p/html/`. Open `html/index.html` in a browser to start navigating.

### Public Pages (no login required)

| File | Page Title | Links To | Notes |
|------|-----------|----------|-------|
| `index.html` | Landing / Home | marketplace, login, register, help, fees, about | Main landing with features, stats, how-it-works |
| `login.html` | Login | register, forgot-password, dashboard (post-login) | 2-step: credentials → OTP |
| `register.html` | Register | login, kyc (post-register) | Email/phone + password + phone OTP |
| `forgot-password.html` | Forgot Password | login | 4-step: contact → OTP → new password → success |
| `marketplace.html` | P2P Marketplace | trade, login | Filter by coin/payment/type. Buy/Sell tabs. |
| `fees.html` | Fee Schedule | help | P2P fees, Instant Buy spreads, withdrawal fees, KYC tier limits |
| `about.html` | About PakSwap | marketplace, register | Team, values, trust explainer, CTA |
| `help.html` | Help Center | help-article, (login optional) | Topic cards, search, FAQ accordion |
| `help-article.html` | Help Article Template | help | Generic template — all 6+ help topics point here |

### Auth-Required User Pages

| File | Page Title | Links To | Notes |
|------|-----------|----------|-------|
| `dashboard.html` | User Dashboard | all major pages | Balance, quick actions, active trades, notifications, market rates |
| `kyc.html` | KYC Verification | dashboard (post-KYC) | 4-step: Basic → CNIC → Selfie → Address. Progress stepper. |
| `trade.html` | P2P Trade Room | dispute, orders | Live countdown timer, chat, upload payment screenshot, open dispute |
| `orders.html` | My Orders | trade, dispute | Trade history with filters and status badges |
| `wallet.html` | Wallet | (deposit/withdraw panels inline) | Balance cards, deposit, withdraw, transaction history |
| `payment-methods.html` | Payment Methods | settings | Add/remove JazzCash, Easypaisa, bank accounts |
| `dispute.html` | Open Dispute | orders | File dispute, upload evidence, track status |
| `dispute-history.html` | Dispute History | dispute | All past disputes, expandable detail panel |
| `my-ads.html` | My Advertisements | create-ad, edit-ad | Manage all P2P ads — active/paused/completed |
| `create-ad.html` | Create New Ad | my-ads (after submit) | Post a buy or sell ad with pricing, limits, payment methods |
| `edit-ad.html` | Edit Ad | my-ads | Edit existing ad with live preview panel |
| `referral.html` | Referral Program | dashboard | Referral link, earnings, leaderboard |
| `settings.html` | Account Settings | (in-page tabs) | Security, profile, notifications, sessions, KYC limits |
| `merchant.html` | Merchant Profile | (public view) | Public-facing merchant page with ads, stats, reviews |
| `merchant-apply.html` | Apply to Be Merchant | dashboard (post-submit) | Requirements checker + full application form |

### Instant Buy Flow (sequential)

| File | Page Title | Links To | Notes |
|------|-----------|----------|-------|
| `instant-buy.html` | Instant Buy Home | instant-buy-order | Browse providers, choose coin/amount |
| `instant-buy-order.html` | Place Order | instant-buy-payment, instant-buy-crypto-deposit | Order summary + confirm |
| `instant-buy-payment.html` | PKR Payment (Mode A) | instant-buy-confirm | Screenshot upload, JazzCash/bank instructions |
| `instant-buy-crypto-deposit.html` | Crypto Deposit (Mode B) | instant-buy-status | Blockchain deposit address + QR + live confirmation count |
| `instant-buy-confirm.html` | Order Confirmed | instant-buy-status, wallet, dashboard | Post-payment confirmation screen with "What Happens Next" |
| `instant-buy-status.html` | Order Status / Tracker | wallet | Live timeline — OCR check, human review, payout |
| `instant-buy-history.html` | Instant Buy History | instant-buy-status | All past Instant Buy orders |
| `provider-apply.html` | Apply as IB Provider | (post-submit success state inline) | Liquidity provider application |

### Admin Panel (owner/staff only — separate login)

| File | Page Title | Notes |
|------|-----------|-------|
| `admin.html` | Main Admin Panel | 9 sections via JS: Dashboard, KYC Review, Disputes, Fraud Monitor, Live Trades, Users, Merchants, Advertisements, Platform Settings. All in one file — `showSection()` function controls which section is visible. |
| `admin-instant-buy.html` | Instant Buy Admin | 3 tabs: All Orders (full order queue + detail panel), Provider Apps (applications + approval flow), Settings. |

---

## 5. How to Use the HTML Mockups

### Viewing
```
Open html/index.html in any browser. No server needed.
All navigation between pages uses relative hrefs.
```

### What to extract from each HTML file

**Layout and structure** — the HTML gives you the exact component hierarchy and information architecture for each page. Use it as the spec for your React/Next.js component tree.

**Component classes** — `styles.css` defines the design system. Key classes to know:
```
.navbar               — top navigation bar
.page-wrapper         — main content container (max-width centered)
.card                 — white bordered container
.btn btn-primary      — primary blue button
.btn btn-secondary    — secondary button
.btn btn-ghost        — ghost/outline button
.btn btn-danger       — red destructive button
.btn btn-success      — green success button
.btn-sm / .btn-lg     — size modifiers
.btn-full             — full width button
.form-input           — text/select input
.form-label           — input label
.form-group           — label + input wrapper
.badge badge-green    — green status badge
.badge badge-yellow   — yellow/amber badge
.badge badge-gray     — grey/neutral badge
.stat-card            — metric card with value + label
.four-col             — 4-column grid for stat cards
.tab-bar / .tab       — tab navigation
.merchant-avatar      — circular avatar with initials
.alert alert-warning  — warning callout box
.two-col              — 2-column layout grid
```

**JavaScript interactions** — each page's `<script>` block shows the exact UI states and transitions. For example:
- `trade.html` — countdown timer, chat, screenshot upload state
- `admin.html` — `showSection()` section switching, `openUserDetail()` panel
- `kyc.html` — step progression, file upload preview
- `forgot-password.html` — 4-step form, OTP countdown, password strength meter

**States already mocked** — use these to know what UI states your backend must support:
- Trade states: waiting_payment, payment_uploaded, under_review, completed, cancelled, disputed
- KYC states: not_started, basic, standard, full, rejected, pending
- Ad states: active, paused, completed
- Order states: verifying, completed, rejected, releasing, payout_failed
- Dispute states: open, under_review, resolved_buyer, resolved_seller

### Converting to React/Next.js

1. Each HTML page → one Next.js route (e.g. `trade.html` → `app/trade/[id]/page.tsx`)
2. Repeated UI blocks (navbar, stat cards, badges) → shared React components
3. Inline `<style>` blocks in HTML → move into CSS Modules or Tailwind classes
4. `<script>` blocks → React `useState` / `useEffect` hooks
5. Mock data in HTML (hardcoded names, values) → replace with API calls + React Query / SWR

---

## 6. Tech Stack — All Locked Decisions

Do not change these without explicit discussion. Full rationale in `11_TECH_STACK_DECISIONS.md`.

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend (Web)** | Next.js 14 (App Router) + TypeScript | SSR for public pages, client-side for dashboard |
| **Frontend (Mobile)** | React Native + Expo | Phase 3 — not MVP |
| **Styling** | Tailwind CSS | Mirror the design system from `styles.css` |
| **API** | Node.js + Fastify | REST + WebSocket |
| **ORM** | Prisma | PostgreSQL |
| **Database** | PostgreSQL 15 | ACID for all financial data |
| **Cache / Queues** | Redis + BullMQ | Rate limiting, job queues, sessions |
| **File Storage** | AWS S3 | KYC docs, payment screenshots |
| **Key Signing** | AWS KMS | Blockchain transaction signing — private keys never on disk |
| **OCR** | PaddleOCR (self-hosted) | Screenshot verification layer 1 |
| **Face Match** | DeepFace (self-hosted) | KYC selfie vs CNIC photo |
| **SMS** | Twilio | OTP, trade notifications |
| **Email** | SendGrid | Templates from Doc 14 |
| **Push** | Firebase Cloud Messaging | Mobile + web push |
| **Monitoring** | Sentry + Datadog | Error tracking + APM |
| **TRON RPC** | TronGrid (primary) + TronStack (fallback) | USDT TRC-20 — highest priority |
| **Deployment** | AWS ECS Fargate | Containerized, see Doc 17 |
| **CI/CD** | GitHub Actions | Test → build → deploy pipeline |
| **Local Dev** | Docker Compose | 8 services — see Doc 17 |

---

## 7. Non-Negotiable Business Rules

These are rules that were made deliberately and must never be bypassed in code, no matter what.

### The Two-Layer Verification Rule — MOST IMPORTANT
**Source:** `07_PAKSWAP_COMPLETE_MASTER_PLAN.md` Section 11

> **NO crypto release is ever automatic. Ever.**

- **Layer 1** — OCR/AI checks the payment screenshot (amount, name, date, transaction ID)
- **Layer 2** — A human admin reviews the Layer 1 result and makes the final decision
- Blockchain confirmation (Mode B) counts as Layer 1 only. Admin must still do Layer 2.
- There is NO auto-payout path. No exceptions. No "trusted user" bypass. No merchant bypass.
- Any pull request that adds an automatic release path should be rejected.

### KYC Rules
**Source:** `13_RATE_LIMITS_AND_ERROR_STATES.md`

- Maximum **5 lifetime KYC submission attempts** per user
- After 5 rejections: account is flagged and requires `senior_admin` manual unlock before any further resubmission
- KYC name must exactly match (fuzzy allowed via Levenshtein) the name on payment method
- No anonymous trading — even Basic KYC (phone only) required to view prices; trading requires at minimum Basic KYC

### Escrow Rules
- Crypto is locked to the escrow ledger the moment a trade is accepted
- Funds do not leave escrow unless admin takes an explicit Release or Refund action
- Escrow is internal ledger only — no on-chain smart contracts
- Cancellation returns funds to seller only after admin confirms no payment was received

### Trading Limits by KYC Tier
| Tier | Daily Buy | Daily Sell | Monthly |
|------|----------|-----------|---------|
| No KYC | View only | — | — |
| Basic KYC (phone) | 50,000 PKR | 50,000 PKR | 500,000 PKR |
| Standard KYC (CNIC) | 200,000 PKR | 200,000 PKR | 2,000,000 PKR |
| Full KYC (CNIC + selfie + address) | 500,000 PKR | 500,000 PKR | 10,000,000 PKR |
| Verified Merchant | 5,000,000 PKR | 5,000,000 PKR | Unlimited* |

### Payment Matching Rule
- The name on the payment screenshot must match the user's KYC name
- Urdu romanization fuzzy matching is required (e.g. "Muhammad" = "Mohammad" = "Muhammed")
- If name match fails → admin must manually review; cannot auto-approve

### Fee Model (Canonical — do not use different values)
- P2P Maker: 0% always
- P2P Taker: 0% for first 3 months post-launch, then 0.5%
- P2P Taker (merchant): 0.3%
- Instant Buy: spread built into quoted price (user never sees a separate fee line)
- Crypto withdrawal: network fee at cost only, no PakSwap markup

### Trade Timer
- Default payment window: 30 minutes (ad creator can set 15/30/45/60 min)
- Timer starts when buyer confirms the trade
- If timer expires and no payment marked: auto-cancel, escrow returned to seller
- Buyer must mark "I've Paid" before timer expires — this does NOT release crypto, it triggers admin review

---

## 8. What Is Left to Build (Backend)

The HTML mockups are complete. Everything below is backend work.

### MVP (Weeks 1–8) — Must ship to launch

#### Authentication
- [ ] Register with phone OTP (Twilio)
- [ ] Login with password + 2FA OTP
- [ ] JWT session management (Redis)
- [ ] Forgot password flow (OTP → reset)
- [ ] Google OAuth (optional at MVP)
- [ ] Session list + remote logout (settings.html already mocks this)

#### KYC System
- [ ] Phone verification (Basic KYC)
- [ ] CNIC front/back upload → PaddleOCR extraction → field storage
- [ ] Selfie capture → DeepFace match against CNIC photo
- [ ] Address proof upload
- [ ] Admin KYC review queue (wired to admin.html KYC section)
- [ ] KYC status + attempt counter (5 max, then lock)
- [ ] KYC name → payment method name matching logic

#### P2P Marketplace
- [ ] Create/edit/pause/delete ads (my-ads.html, create-ad.html, edit-ad.html)
- [ ] Marketplace listing with filters (marketplace.html)
- [ ] Trade initiation + escrow lock
- [ ] Trade room: countdown timer, in-trade chat (WebSocket), status updates
- [ ] "I've Paid" → screenshot upload → admin review queue
- [ ] Admin: approve payment → release from escrow → credit buyer wallet
- [ ] Admin: reject payment → return escrow to seller
- [ ] Trade cancellation flow (pre-payment)
- [ ] Orders history (orders.html)

#### Dispute System
- [ ] File dispute (freeze trade, notify admin)
- [ ] Admin dispute resolution panel (admin.html disputes section)
- [ ] Dispute decision → execute release or refund
- [ ] Dispute history (dispute-history.html)

#### Wallet / Balances
- [ ] Internal ledger (user balance per coin)
- [ ] Deposit: generate TRON/ETH wallet address per user per coin
- [ ] Blockchain deposit monitor (BullMQ job watches for confirmations)
- [ ] Withdrawal: admin-signed blockchain TX via AWS KMS
- [ ] Transaction history (wallet.html)

#### Admin Panel
- [ ] Admin login (separate route, role-based)
- [ ] KYC queue + approve/reject + document viewer
- [ ] Payment verification queue
- [ ] Dispute panel
- [ ] Live trades dashboard
- [ ] Fraud monitor + user suspend/ban
- [ ] User management (search, view, edit limits)
- [ ] Audit log (every admin action logged with timestamp + admin ID)

#### Notifications
- [ ] SMS templates wired to Twilio (all triggers from Doc 14)
- [ ] Email templates wired to SendGrid (12 templates from Doc 14)
- [ ] In-app notification bell (database-backed, real-time via WebSocket)

#### Infrastructure
- [ ] Docker Compose local dev (8 services from Doc 17)
- [ ] Environment variables (.env from .env.example)
- [ ] Database migrations (Prisma schema from Doc 04)
- [ ] BullMQ queues: screenshot-verification, blockchain-monitor, notification, payout
- [ ] Rate limiting (Redis — all limits from Doc 13)
- [ ] Sentry error tracking

---

### Phase 1 (Weeks 9–16) — Instant Buy Mode A (PKR → Crypto)

- [ ] Instant Buy provider onboarding + admin approval (provider-apply.html, admin-instant-buy.html Provider Apps tab)
- [ ] Provider inventory management (deposit/lock crypto for liquidity)
- [ ] Order matching engine (user amount → best available provider)
- [ ] Instant Buy order flow: place order → PKR payment instructions → screenshot upload
- [ ] OCR verification (same pipeline as P2P but with Instant Buy-specific templates)
- [ ] Admin Instant Buy queue (admin-instant-buy.html All Orders tab)
- [ ] Admin approve → trigger payout to user wallet
- [ ] Admin reject → cancel order + notify user
- [ ] Instant Buy history (instant-buy-history.html)
- [ ] Instant Buy order confirmation screen (instant-buy-confirm.html)
- [ ] Instant Buy status tracker with live timeline (instant-buy-status.html)

---

### Phase 2 (Weeks 17–28) — Instant Buy Mode B (Crypto → Crypto)

- [ ] Per-order blockchain deposit address generation (KMS-signed)
- [ ] Blockchain monitor watching for incoming TXs (BullMQ + TRON/ETH RPC)
- [ ] Confirmation threshold logic (1 conf for TRON, 12 for ETH)
- [ ] Payout queue: on confirmation → admin triggers release → KMS-signed outgoing TX
- [ ] Support for 25+ tokens, 15+ networks (from Doc 09)
- [ ] Crypto deposit UI (instant-buy-crypto-deposit.html)

---

### Phase 3 (Weeks 29+) — Merchant Ecosystem

- [ ] Merchant application + admin approval (merchant-apply.html, admin.html merchants section)
- [ ] Merchant dashboard (merchant.html public profile, Doc 16 full spec)
- [ ] Verified merchant badge + elevated daily limits
- [ ] Priority dispute SLA for merchants (2-hour vs 4-hour standard)
- [ ] Referral system (referral.html)
- [ ] React Native mobile app (Doc 15)

---

### Legal Pages (anytime — low effort, needed pre-launch)
- [ ] `terms.html` — Terms of Service
- [ ] `privacy.html` — Privacy Policy
- [ ] `aml-policy.html` — AML/KYC Policy (required for compliance)
- [ ] `risk.html` — Risk Disclosure

---

## 9. Build Order — Recommended Sequence

Follow this order strictly. Later features depend on earlier ones being stable.

```
Week 1–2:   Database schema (Doc 04) + Docker Compose local env (Doc 17)
Week 2–3:   Auth (register, login, OTP, JWT, sessions)
Week 3–4:   KYC pipeline (upload, OCR, face match, admin queue)
Week 4–5:   Wallet infrastructure (internal ledger, deposit addresses, blockchain monitor for deposits)
Week 5–6:   P2P core (ads, trade initiation, escrow lock/release, timer)
Week 6–7:   Admin panel wiring (KYC queue, payment queue, dispute queue)
Week 7:     Dispute system
Week 7–8:   Notifications (SMS + email) + rate limiting + security hardening
Week 8:     QA, pen test, pre-launch checklist (Doc 17 §Pre-launch)
--- LAUNCH ---
Week 9–16:  Instant Buy Mode A (PKR payment)
Week 17–28: Instant Buy Mode B (crypto payment)
Week 29+:   Merchant system, referral, mobile app
```

---

## 10. Key Integrations and Third-Party Services

| Service | Purpose | Where Configured |
|---------|---------|-----------------|
| **Twilio** | SMS OTP, trade notifications | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` in .env |
| **SendGrid** | Email (12 templates from Doc 14) | `SENDGRID_API_KEY` in .env |
| **Firebase** | Push notifications | `FCM_SERVER_KEY` in .env |
| **TronGrid** | TRON blockchain RPC (primary) | `TRONGRID_API_KEY` in .env |
| **TronStack** | TRON RPC fallback | `TRONSTARK_API_KEY` in .env |
| **Infura / Alchemy** | ETH/ERC-20 RPC | `ETH_RPC_URL` in .env |
| **AWS S3** | KYC document storage, screenshots | `AWS_S3_BUCKET` in .env |
| **AWS KMS** | Blockchain transaction signing | `AWS_KMS_KEY_ID` in .env |
| **PaddleOCR** | Screenshot text extraction (self-hosted) | Docker service `paddle-ocr` on port 8080 |
| **DeepFace** | KYC selfie face matching (self-hosted) | Docker service `deepface` on port 8081 |
| **Sentry** | Error tracking | `SENTRY_DSN` in .env |
| **Localstack** | AWS services for local dev | Included in Docker Compose |

---

## 11. Security Checklist

These must all be done before accepting any real user funds.

### Authentication
- [ ] Passwords hashed with bcrypt (cost factor ≥ 12)
- [ ] JWT tokens short-lived (15 min access, 7 day refresh)
- [ ] 2FA mandatory for admin accounts
- [ ] Rate limit login attempts (5 per 15 min per IP — Doc 13)
- [ ] OTP expires in 10 minutes, single-use
- [ ] Session invalidation on password reset

### API Security
- [ ] All endpoints behind authentication middleware except public routes
- [ ] CORS configured to your domain only
- [ ] Helmet.js headers (CSP, HSTS, X-Frame-Options)
- [ ] Input validation on every endpoint (Zod or Fastify schema validation)
- [ ] SQL injection impossible via Prisma ORM (never raw string queries)
- [ ] File upload validation: type check, size limit (10MB), virus scan before S3
- [ ] Rate limiting via Redis on all sensitive endpoints (Doc 13)

### Financial Security
- [ ] Escrow state machine: only valid transitions (no direct DB writes bypassing state machine)
- [ ] Double-spend prevention: atomic DB transactions for all balance operations
- [ ] Admin actions require re-authentication for destructive operations
- [ ] Every balance change logged in audit_log table with admin ID + timestamp
- [ ] KMS key rotation scheduled — private keys never touch application memory
- [ ] Withdrawal whitelist: only to user's own verified wallet addresses

### Infrastructure
- [ ] All secrets in AWS Secrets Manager / .env (never hardcoded)
- [ ] S3 buckets private — KYC docs served via pre-signed URLs only
- [ ] VPC with private subnets for DB and Redis (not publicly accessible)
- [ ] WAF in front of load balancer
- [ ] External penetration test before launch
- [ ] Dependency audit: `npm audit` clean before launch

---

## 12. Pakistan-Specific Requirements

These are non-obvious requirements specific to the Pakistani market context.

### Payment Methods
- **JazzCash** — mobile wallet. Screenshot shows: sender name, recipient, amount, transaction ID, timestamp. OCR template in Doc 10.
- **Easypaisa** — mobile wallet. Similar screenshot fields. Doc 10.
- **Bank Transfer (IBAN)** — HBL, UBL, MCB, Meezan Bank are most common. Screenshots vary by bank app. Doc 10.
- **Sadapay / Nayapay** — fintech wallets, growing. Support in Phase 1+.

### KYC Documents
- **CNIC** (Computerized National Identity Card) — Pakistan national ID. 13-digit number format: `XXXXX-XXXXXXX-X`. Both front and back required.
- CNIC has an expiry date — must be checked; expired CNICs should be flagged.
- Names on CNIC may be in English or Urdu. OCR must handle both. Romanization fuzzy matching is essential (Muhammad ≈ Mohammad ≈ Muhammed ≈ Muhamad).

### Time Zone
- All timestamps displayed in **PKT (Pakistan Standard Time, UTC+5)**
- Daily limits reset at midnight PKT
- Support hours: 9am–9pm PKT

### Language
- MVP: English only
- Phase 2: Urdu toggle (right-to-left layout, `dir="rtl"`)
- Urdu support requires RTL CSS flip and Noto Nastaliq Urdu or similar font

### Compliance
- **FATF guidelines** — Pakistan is on the FATF action plan. Your AML monitoring must be real and documented.
- **SECP** — Securities and Exchange Commission of Pakistan — crypto regulation is evolving. Build with compliance-ready structure.
- **SBP** — State Bank of Pakistan — PKR transactions and payment method integrations must be aware of SBP digital payment regulations.
- Full details in `05_BUSINESS_MODEL_MVP_ROADMAP_COMPLIANCE.md`

### Mobile-First
- 80%+ of Pakistani crypto users are on Android (budget phones)
- Test on 360px viewport width minimum
- Avoid hover-only interactions
- Keyboard/numpad optimized inputs for PKR amounts and phone numbers

---

## Quick Links for the Developer

| What you need | Where to find it |
|--------------|-----------------|
| Database schema (all tables) | `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` |
| REST API routes | `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` |
| WebSocket events | `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` |
| Admin step-by-step workflows | `12_ADMIN_WORKFLOW_SPEC.md` |
| OCR + screenshot verification | `10_SCREENSHOT_VERIFICATION_SPEC.md` |
| All rate limits + error codes | `13_RATE_LIMITS_AND_ERROR_STATES.md` |
| SMS + email message templates | `14_NOTIFICATION_SYSTEM_SPEC.md` |
| Instant Buy Mode A (PKR) | `08_INSTANT_BUY_OTC_BLUEPRINT.md` |
| Instant Buy Mode B (Crypto) | `09_CRYPTO_TO_CRYPTO_BLUEPRINT.md` |
| Docker Compose + AWS deployment | `17_DEPLOYMENT_SPEC.md` |
| Merchant post-approval features | `16_MERCHANT_DASHBOARD_SPEC.md` |
| Fee model (canonical) | `00_INDEX.md` Quick Reference |
| All UI components + classes | `html/styles.css` |
| Every screen's HTML | `html/*.html` |

---

*PakSwap Blueprint — Confidential. For internal development use only.*
*All 17 spec documents + 33 HTML pages are the complete product definition.*
*Questions? All ambiguities are resolved in the spec documents — read those first.*
