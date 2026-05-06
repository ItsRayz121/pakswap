# PAKSWAP — COMPLETE MASTER PLAN
## Pakistan P2P Crypto-to-PKR Exchange: A-Z Blueprint

> **Version:** 2.0 — Comprehensive Edition
> **Date:** 2026-05-05
> **Stage:** Blueprint / Pre-Development
> **Core Model:** Zero-Liquidity Middleman Platform

---

## QUICK SUMMARY FOR ANY AI / DEVELOPER / DESIGNER

Build a **Pakistan-specific P2P crypto exchange** where:

- Sellers list USDT (or other crypto) for PKR
- Buyers find a seller, send PKR via JazzCash / Easypaisa / bank
- Platform holds seller's USDT in escrow during trade
- AI + human verify payment proof
- Seller confirms and releases USDT to buyer's wallet address
- Platform earns 0.5% fee on completed trades
- **Platform never holds or owns any USDT — it only escrows the seller's coins**

---

## TABLE OF CONTENTS

1. [Core Business Model — No Liquidity Needed](#1-core-business-model--no-liquidity-needed)
2. [How Money Is Made — Complete Earning Model](#2-how-money-is-made--complete-earning-model)
3. [The Trade Flow — Step by Step](#3-the-trade-flow--step-by-step)
4. [Scam-Free Blueprint — Protection at Every Stage](#4-scam-free-blueprint--protection-at-every-stage)
5. [KYC System — AI + Manual Hybrid](#5-kyc-system--ai--manual-hybrid)
6. [Free AI Tools for Verification](#6-free-ai-tools-for-verification)
7. [What Is Already in the Existing Docs](#7-what-is-already-in-the-existing-docs)
8. [What Was Missing — Now Added](#8-what-was-missing--now-added)
9. [Full Platform Architecture](#9-full-platform-architecture)
10. [Database Schema Additions](#10-database-schema-additions)
11. [All Pages and Features Required](#11-all-pages-and-features-required)
12. [Design System Summary](#12-design-system-summary)
13. [Tech Stack](#13-tech-stack)
14. [Development Roadmap](#14-development-roadmap)
15. [Compliance and Legal](#15-compliance-and-legal)
16. [Go-To-Market Strategy](#16-go-to-market-strategy)
17. [Complete Implementation Prompt for Claude / Builder](#17-complete-implementation-prompt-for-claude--builder)

---

## 1. CORE BUSINESS MODEL — NO LIQUIDITY NEEDED

### The Model

PakSwap is a **pure middleman escrow platform**. The platform:

- Does NOT own any USDT or crypto
- Does NOT need startup capital for liquidity
- Does NOT take on price risk
- Simply facilitates peer-to-peer trades between real buyers and real sellers

### How Escrow Works Without Platform Liquidity

```
Step 1: Seller deposits their own USDT into escrow smart contract / platform wallet
        → This USDT belongs to the seller, NOT the platform
        → It is locked until trade completes or is cancelled

Step 2: Buyer initiates a trade against seller's listing

Step 3: Buyer sends PKR to seller via JazzCash / Easypaisa / bank
        → Buyer uploads payment screenshot as proof

Step 4: Platform AI + admin verify the payment proof (optional human review)

Step 5: Seller confirms receipt of PKR in their own bank/wallet
        → Seller can also verify independently

Step 6: Seller approves release
        → Platform sends USDT to buyer's provided wallet address
        → Buyer can give ANY wallet address: BEP-20, TRC-20, ERC-20, etc.

Step 7: Trade completed
        → Platform deducts 0.5% fee from the USDT before sending to buyer
        → Fee stays in platform's revenue wallet
```

### Why This Model Is Perfect for a Startup

| Advantage | Explanation |
|---|---|
| Zero capital requirement | You don't need 10 million PKR to start |
| Zero price risk | You never hold crypto on your own balance sheet |
| Instantly scalable | Volume can grow without increasing capital |
| Trusted model | Same model used by Binance P2P, Bybit P2P, Paxful |
| Seller bears custody risk before escrow | Seller chooses when to list |

---

## 2. HOW MONEY IS MADE — COMPLETE EARNING MODEL

### Primary Revenue

#### Trading Fees (Main Income)

| User Type | Fee | Applied To |
|---|---|---|
| Regular buyer | 0.5% | Deducted from USDT sent to buyer |
| Verified merchant (seller) | 0.3% | Deducted on their completed sales |
| Premium merchant (500+ trades/month) | 0.2% | Volume discount |

**Example:**
- Buyer purchases 100 USDT
- Platform deducts 0.5 USDT as fee
- Buyer receives 99.5 USDT
- Platform keeps 0.5 USDT (~140 PKR at 280 PKR/USDT)

**Revenue Projection:**

| Year | Daily Trades | Daily Volume | Annual Revenue |
|---|---|---|---|
| Year 1 | 500 trades | 12.5M PKR | ~22.5M PKR (~$80K) |
| Year 2 | 1,000 trades | 25M PKR | ~45M PKR (~$160K) |
| Year 3 | 3,000 trades | 75M PKR | ~135M PKR (~$480K) |

### Secondary Revenue Streams

| Stream | When | Estimated Monthly (Year 2) |
|---|---|---|
| Merchant subscription | Year 1+ | 200K PKR (100 merchants × 2,000 PKR) |
| Ad promotion (boost listings) | Year 1+ | 150K PKR |
| Withdrawal fees | From launch | 1 USDT per TRC-20 withdrawal |
| Dispute fee (if both parties at fault) | Year 2 | Small fee for egregious abuse |
| OTC desk (trades over 1M PKR) | Year 2 | 0.2% fee on large trades |
| Crypto convert (USDT ↔ BTC in-app) | Year 2 | 0.3% spread |
| Crypto-backed PKR loans | Year 3 | Interest income |
| Stablecoin savings / yield | Year 3 | Yield spread |

### Launch Strategy

- Months 1–3: **0% trading fee** (build user base, create habit)
- Month 4: Introduce 0.5% fee with advance notice
- This is the same strategy Binance and Bybit used to dominate markets

---

## 3. THE TRADE FLOW — STEP BY STEP

### Buyer Flow (Buying USDT with PKR)

```
1. Browse marketplace → see active seller listings
2. Select a seller → view their price, payment methods, rating
3. Enter amount to buy (PKR or USDT amount)
4. Platform locks seller's USDT in escrow immediately
5. Platform shows seller's payment details (JazzCash number / bank IBAN)
6. Buyer sends PKR from their own JazzCash/Easypaisa/bank
7. Buyer uploads payment screenshot as proof
8. Buyer marks payment as sent
9. Timer starts (15 minutes for seller to confirm or dispute)
10. Seller verifies PKR received in their account
11. Seller clicks "Release USDT"
12. Platform sends USDT (minus 0.5% fee) to buyer's provided wallet address
13. Trade marked complete
14. Both parties can rate each other
```

### Seller Flow (Selling USDT for PKR)

```
1. Complete KYC verification
2. Deposit USDT into platform wallet (from any external wallet)
3. Create a listing: set price per USDT (PKR), min/max order size, payment methods accepted
4. Listing goes live in marketplace
5. Buyer finds listing and initiates trade
6. Platform auto-locks the USDT from seller's balance into escrow
7. Seller receives notification: "Trade initiated — awaiting payment"
8. Seller's payment details shown to buyer
9. Buyer sends PKR to seller's JazzCash/bank
10. Buyer uploads payment proof
11. Seller receives notification: "Buyer claims payment sent"
12. Seller logs into JazzCash/bank to verify PKR received
13. Seller clicks "Confirm and Release"
14. Buyer receives USDT at their wallet address
15. Trade complete — seller's PKR is in their bank, buyer's USDT is at their address
```

### Dispute Flow

```
1. Seller claims no payment received OR buyer claims sent but seller not releasing
2. Either party can open a dispute within the active trade window
3. Platform admin (human) reviews:
   - Payment screenshot
   - AI analysis of screenshot (amount, account name, timestamp)
   - Blockchain confirmation of escrow lock
   - Both parties' chat history
4. Admin makes decision within 4 hours:
   Option A: Release to buyer (payment confirmed genuine)
   Option B: Return to seller (payment not confirmed)
5. Losing party can appeal within 24 hours with new evidence
6. Final decision is binding
```

---

## 4. SCAM-FREE BLUEPRINT — PROTECTION AT EVERY STAGE

This is the most critical section. Every scam vector is mapped and countered.

### Scam Type 1: Fake Payment Screenshot (Most Common)

**Attack:** Buyer edits a screenshot to show payment made when it was not.

**Counters:**
- AI screenshot analysis (detect Photoshop artifacts, metadata inconsistencies)
- Seller instructed to NEVER release before checking their own JazzCash/bank app directly
- Platform warning: "Always verify in your bank app, not just the screenshot"
- Dispute system: if seller releases without verifying and gets scammed, they bear responsibility (Terms of Service)
- Pattern detection: buyer with 3+ disputes gets flagged for enhanced review

### Scam Type 2: Chargeback / Reversal (Bank Dispute Scam)

**Attack:** Buyer pays PKR, receives USDT, then disputes the bank transfer claiming unauthorized transaction.

**Counters:**
- JazzCash / Easypaisa transactions are difficult to chargeback (unlike credit cards)
- Preferred payment methods avoid chargeback-prone channels
- Bank transfer: seller checks IBAN and name matches before releasing
- KYC-name match: buyer's payment account name must match their verified KYC name
- Trade records stored permanently for legal evidence
- Account frozen immediately upon bank dispute claim pending investigation

### Scam Type 3: Seller Takes USDT Back After Buyer Pays

**Attack:** Seller cancels trade or asks platform to cancel after buyer has already sent PKR.

**Counters:**
- Escrow lock is immediate and cannot be reversed by seller
- Only admin can release escrow during dispute
- Timer system: seller who doesn't respond loses the dispute automatically
- Seller fraud pattern detection: multiple cancellations after payment proof uploaded

### Scam Type 4: Buyer Never Pays (Wasting Escrow Lock)

**Attack:** Buyer initiates trade, never pays, locks seller's USDT for 15 minutes.

**Counters:**
- 15-minute payment timer — trade auto-cancels and escrow unlocked if buyer doesn't mark payment
- First cancellation: warning
- 3 cancellations in 7 days: account restricted
- 5 cancellations: account suspended pending review
- Rate limiting on trade initiation

### Scam Type 5: Wrong Amount Sent

**Attack:** Buyer sends less PKR than agreed, claims full payment.

**Counters:**
- AI reads payment screenshot amount and compares to expected trade amount
- Mismatch flagged automatically for both parties
- Seller sees exact expected PKR amount in trade room interface
- Dispute resolution reviews amounts explicitly

### Scam Type 6: Account Takeover (Hacker Releases Escrow)

**Attack:** Hacker gains access to seller account and releases USDT to themselves.

**Counters:**
- Release requires 2FA confirmation (TOTP or SMS)
- New device login triggers email/SMS alert
- 24-hour withdrawal delay for new wallet addresses
- IP change during active trade triggers re-authentication
- Anti-phishing code in all platform emails

### Scam Type 7: Platform Rug Pull (Trust in Platform)

**Attack:** Platform disappears with seller's escrowed USDT.

**Counters (for user trust):**
- On-chain proof of escrow where possible (transparent TRON wallet address)
- Regular public audit of escrow wallets
- Escrow wallet address publicly viewable
- Regulatory registration (transparency)
- Cold storage proof published
- No co-mingling of user funds and platform revenue

### Platform-Level Fraud Controls

| Control | Description |
|---|---|
| Velocity checks | Flag users with sudden 10x trade volume increase |
| Duplicate CNIC detection | Auto-block duplicate identity across accounts |
| Device fingerprinting | Detect multiple accounts on same device |
| IP-based risk scoring | VPN/proxy usage flagged for review |
| Structured transaction detection | Splitting large trades to avoid reporting thresholds |
| Merchant dispute rate threshold | Merchants with >5% dispute rate lose merchant status |
| Automated risk score | Every user has a live risk score (0-100) updated on each action |

---

## 5. KYC SYSTEM — AI + MANUAL HYBRID

### Why Both AI and Manual

At launch, both AI and human review are used:

- **AI:** Fast, consistent, available 24/7, catches obvious issues
- **Human:** Catches edge cases, handles disputes, gives confidence to regulators

As volume grows, AI handles 80%+ and human team handles escalations only.

### KYC Level 1 — Basic (Lite KYC)

**Requirement:** CNIC front + back photo

**Limits after approval:** 50,000 PKR/day trading

**AI Checks:**
- CNIC authenticity (font, layout, hologram detection)
- CNIC expiry date validation
- Name extraction via OCR
- ID number format validation (13-digit CNIC)
- Image quality check (blur, glare, crop)

**Human Review:**
- Visual inspection of submitted photos
- Cross-check name against provided name at registration
- Flag suspected forgeries for rejection

### KYC Level 2 — Full KYC

**Requirement:** CNIC + Selfie + Liveness Check + Address Proof

**Limits after approval:** 500,000 PKR/day trading

**AI Checks:**
- Face match: selfie vs CNIC photo (face similarity score >85%)
- Liveness detection: user blinks/turns head to prevent photo spoof
- Address document OCR: extract address, name, match to CNIC
- Duplicate face detection across platform database

**Human Review:**
- Approve borderline AI scores (75-85% face match)
- Review address documents manually
- Final sign-off for merchant status applications

### KYC Level 3 — Enhanced Due Diligence (EDD)

**Triggered by:**
- Single trade over 500,000 PKR
- Monthly volume over 2M PKR
- Dispute rate >5%
- Sanctions list match
- Risk score over 75

**Requires:**
- Source of funds declaration
- Additional identity verification
- Manual senior review and approval

### KYC States

```
not_submitted → pending_review → ai_in_review → human_review → approved / rejected / needs_resubmit
```

---

## 6. FREE AI TOOLS FOR VERIFICATION

The following free or low-cost AI tools can handle verification tasks:

### Face Matching (Selfie vs CNIC Photo)

| Tool | Cost | Notes |
|---|---|---|
| **face-api.js** | Free, open source | Run in Node.js, no API needed |
| **OpenCV** | Free, open source | Python-based, high accuracy |
| **AWS Rekognition** | ~$0.001/image | Very accurate, free tier available |
| **DeepFace (Python)** | Free | Multiple backends: VGG-Face, ArcFace |
| **CompreFace** | Free, self-hosted | Docker-based, fully on-premise |

**Recommendation:** Start with **DeepFace** (free, Python, accurate). Upgrade to AWS Rekognition at scale.

### OCR for CNIC Text Extraction

| Tool | Cost | Notes |
|---|---|---|
| **Tesseract OCR** | Free, open source | Works well for printed CNIC text |
| **EasyOCR** | Free, open source | Python, supports Urdu and English |
| **Google Cloud Vision OCR** | Free tier: 1,000/month | Excellent accuracy |
| **Doctr (by Mindee)** | Free, open source | Document-specific OCR, very good |
| **PaddleOCR** | Free, open source | Multi-language, fast |

**Recommendation:** **EasyOCR** for bilingual CNIC (English + Urdu fields). Google Vision OCR at scale.

### Liveness Detection

| Tool | Cost | Notes |
|---|---|---|
| **FaceLiveness (AWS)** | Pay per use | Very accurate |
| **BioID** | Freemium | Passive liveness detection |
| **OpenCV + blink detection** | Free | Basic, easy to spoof with video |
| **MediaPipe Face Mesh** | Free, Google | Detects real 3D face vs flat photo |
| **FaceIO** | Freemium | Web SDK, easy integration |

**Recommendation:** **MediaPipe** for MVP (free, accurate enough). AWS for production.

### Payment Screenshot Verification (AI)

| Tool | Cost | Notes |
|---|---|---|
| **Google Cloud Vision** | Free tier | Extract amount, name, timestamp from screenshot |
| **Tesseract OCR** | Free | Extract numbers from JazzCash screenshots |
| **GPT-4 Vision** (API) | ~$0.01/image | Can read any screenshot format intelligently |
| **Custom regex parser** | Free | Parse known JazzCash/Easypaisa screenshot formats |

**Recommendation:** Build **custom OCR parser** trained on JazzCash/Easypaisa screenshot layouts. GPT-4 Vision for fallback on unrecognized formats.

### What the AI Screenshot Verifier Checks

```
1. Extract sender account name → match against buyer's KYC name
2. Extract recipient account name → match against seller's registered payment method name
3. Extract amount → compare to agreed trade amount (within 1 PKR tolerance)
4. Extract timestamp → confirm it falls within the trade window
5. Extract transaction reference → save for records
6. Detect image manipulation artifacts (metadata analysis)
7. Compare screenshot layout to known JazzCash/Easypaisa templates
```

---

## 7. WHAT IS ALREADY IN THE EXISTING DOCS

The following are already fully documented in the 6 existing files:

| Feature | Existing File |
|---|---|
| Full site map and all page wireframes | 01, 02, 03 |
| Complete PostgreSQL database schema (10 modules, 70+ tables) | 04 |
| REST API endpoints (40+ endpoints) | 04 |
| WebSocket events for real-time trade room | 04 |
| Escrow mechanism overview | 04 |
| Tech stack recommendations | 04 |
| Business model and fee structure | 05 |
| 4-phase development roadmap | 05 |
| Pakistan compliance framework | 05 |
| AML/KYC requirements | 05 |
| Competitive analysis | 05 |
| Design system (colors, typography, components) | 06 |
| 16 HTML mockup pages | html/ folder |
| All user roles (9 roles) | 01 |
| Trust and safety features list | 05 |

---

## 8. WHAT WAS MISSING — NOW ADDED IN THIS DOCUMENT

| Gap | Where Added |
|---|---|
| No-liquidity model explained clearly | Section 1 |
| Complete earning model with all revenue streams | Section 2 |
| Full trade flow step by step (buyer + seller + dispute) | Section 3 |
| Scam-by-scam anti-fraud blueprint | Section 4 |
| Free AI tools for KYC, face match, OCR, liveness | Section 6 |
| Payment screenshot AI verification system | Section 6 |
| AI + manual KYC hybrid explained | Section 5 |
| EDD (enhanced due diligence) for large trades | Section 5 |
| CNIC OCR and face match implementation options | Section 6 |

---

## 9. FULL PLATFORM ARCHITECTURE

```
+----------------------------------------------------------+
|                    USER INTERFACES                       |
|  Web App (Next.js)     |    Mobile App (React Native)    |
|  Telegram Bot (Phase 2)|    Admin Panel (Next.js)        |
+----------------------------------------------------------+
                         |
                    API Gateway
                         |
+----------------------------------------------------------+
|                    BACKEND SERVICES                      |
|  Auth Service    |  KYC Service   |  Trade Service       |
|  Wallet Service  |  Escrow Engine |  Notification Svc    |
|  Dispute Service |  Fee Service   |  Admin Service       |
+----------------------------------------------------------+
           |                |               |
    PostgreSQL DB       Redis Cache    Message Queue (BullMQ)
           |
    AWS S3 (KYC docs)
           |
+----------------------------------------------------------+
|                  BLOCKCHAIN LAYER                       |
|  TRON Node (USDT TRC-20)  |  ETH Node (ERC-20, Phase 2) |
|  Blockchain Listener      |  Deposit Address Generator  |
|  Withdrawal Broadcaster   |  Address Validator          |
+----------------------------------------------------------+
           |
+----------------------------------------------------------+
|                    AI / VERIFICATION                    |
|  DeepFace (face match)    |  EasyOCR (CNIC extraction)  |
|  MediaPipe (liveness)     |  Screenshot parser (JazzCash)|
|  Risk scoring engine      |  Duplicate detection        |
+----------------------------------------------------------+
```

### Escrow Architecture (No Platform Liquidity)

```
Seller owns USDT at all times:

Before trade:    [Seller's USDT] → in seller's platform wallet balance
Trade initiated: [Seller's USDT] → locked in escrow (internal ledger debit)
Payment verified:[Seller's USDT] → released to buyer's external wallet address
Trade cancelled: [Seller's USDT] → returned to seller's platform wallet balance

Platform's own wallet is ONLY for:
- Collecting the 0.5% fee on completed trades
- Paying blockchain transaction fees (gas/bandwidth)
```

---

## 10. DATABASE SCHEMA ADDITIONS

The existing schema in `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` covers core tables.
These are the **additions needed** for missing features:

### Table: kyc_ai_results

```sql
CREATE TABLE kyc_ai_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_id          UUID REFERENCES kyc_submissions(id),
  check_type      VARCHAR(50),  -- 'cnic_ocr', 'face_match', 'liveness', 'duplicate_check'
  ai_provider     VARCHAR(50),  -- 'deepface', 'easyocr', 'mediapipe', 'custom'
  confidence_score DECIMAL(5,2), -- 0.00 to 100.00
  extracted_data  JSONB,        -- OCR results, face vectors, etc.
  passed          BOOLEAN,
  failure_reason  TEXT,
  reviewed_by_human BOOLEAN DEFAULT false,
  human_override  BOOLEAN,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: payment_proof_verifications

```sql
CREATE TABLE payment_proof_verifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id        UUID REFERENCES trades(id),
  proof_image_url TEXT NOT NULL,
  ai_extracted    JSONB, -- { sender_name, recipient_name, amount, timestamp, reference }
  expected_amount DECIMAL(18,2),
  extracted_amount DECIMAL(18,2),
  amount_match    BOOLEAN,
  name_match      BOOLEAN,
  timestamp_valid BOOLEAN,
  manipulation_detected BOOLEAN DEFAULT false,
  confidence_score DECIMAL(5,2),
  ai_verdict      VARCHAR(20), -- 'verified', 'suspicious', 'failed', 'manual_needed'
  human_reviewed  BOOLEAN DEFAULT false,
  human_verdict   VARCHAR(20),
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: user_risk_scores

```sql
CREATE TABLE user_risk_scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) UNIQUE,
  current_score   INTEGER DEFAULT 0, -- 0 (safe) to 100 (high risk)
  last_calculated TIMESTAMPTZ,
  factors         JSONB, -- { cancellation_rate, dispute_rate, velocity, etc. }
  level           VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  auto_restricted BOOLEAN DEFAULT false,
  manual_review_required BOOLEAN DEFAULT false,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: scam_patterns

```sql
CREATE TABLE scam_patterns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name    VARCHAR(100),
  description     TEXT,
  detection_rule  JSONB,
  action          VARCHAR(50), -- 'flag', 'restrict', 'ban', 'notify_admin'
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 11. ALL PAGES AND FEATURES REQUIRED

### Public Pages (No Login)

| Page | Purpose | Priority |
|---|---|---|
| Landing page | Hero, how it works, stats, trust badges | MVP |
| About us | Team, mission, Pakistan focus | MVP |
| Fees page | Transparent fee table | MVP |
| Help center | FAQ, guides, video tutorials | MVP |
| Login | Email/phone + OTP | MVP |
| Register | Sign up flow | MVP |
| Blog | SEO content (how to buy USDT in Pakistan) | Phase 2 |

### User Dashboard Pages

| Page | Purpose | Priority |
|---|---|---|
| Dashboard / Home | Portfolio, recent trades, quick actions | MVP |
| KYC Verification | 3-step KYC flow | MVP |
| P2P Marketplace | Browse all active listings | MVP |
| Create Trade (Buy) | Initiate buy order | MVP |
| Create Trade (Sell) | Post sell listing / create ad | MVP |
| Trade Room | Active escrow trade screen | MVP |
| Wallet | Balances, deposit, withdraw | MVP |
| Order History | All past trades | MVP |
| Payment Methods | Manage JazzCash / bank accounts | MVP |
| My Listings | Manage my sell ads | MVP |
| Merchant Profile | Public merchant reputation page | MVP |
| Dispute Center | Open and track disputes | MVP |
| Referral Program | Referral link, earnings, stats | Phase 2 |
| Settings | Profile, security, notifications | MVP |
| 2FA Setup | TOTP / SMS 2FA setup | MVP |

### Admin Pages

| Page | Purpose | Priority |
|---|---|---|
| Admin Dashboard | Platform stats, revenue, alerts | MVP |
| KYC Queue | Review pending KYC submissions | MVP |
| KYC Detail View | Full applicant review with AI scores | MVP |
| Trade Monitor | All active and recent trades | MVP |
| Dispute Queue | Pending disputes for resolution | MVP |
| Dispute Detail | Evidence, chat, decision tools | MVP |
| User Management | Search, view, suspend, ban users | MVP |
| Fraud Monitor | Risk flags, suspicious patterns | MVP |
| Merchant Management | Approve/revoke merchant status | Phase 2 |
| Platform Settings | Fees, limits, system config | MVP |
| Revenue Dashboard | Fee income, volume analytics | Phase 2 |

---

## 12. DESIGN SYSTEM SUMMARY

### Colors

| Purpose | Color | Hex |
|---|---|---|
| Primary brand | Deep Blue | #1A56DB |
| Success / completed | Emerald | #0E9F6E |
| Warning / pending | Orange | #FF5A1F |
| Danger / dispute | Red | #E02424 |
| USDT | Tether Green | #26A17B |
| BTC | Bitcoin Orange | #F7931A |
| Background | Near white | #F9FAFB |
| Card background | White | #FFFFFF |

### Typography

- **Primary:** Inter (Google Fonts) — clean, financial feel
- **Urdu text:** Noto Nastaliq Urdu
- **Numbers / addresses:** JetBrains Mono

### Key UX Principles

1. **Mobile-first** — 80%+ Pakistani users are on mobile
2. **Trust signals everywhere** — escrow lock banners, verified badges, trade counts
3. **Never block progress** — clear CTAs at every step, no dead ends
4. **Urdu support** — all UI translatable to Urdu (right-to-left layout ready)
5. **Always show expected PKR/USDT amounts** — no confusion about what you get

---

## 13. TECH STACK

### Recommended Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Web | Next.js 14 + React + TypeScript | SSR, SEO, performance |
| Mobile App | React Native + Expo | iOS + Android, code sharing |
| Backend API | Node.js + Fastify OR Go (Fiber) | High concurrency for P2P |
| Database | PostgreSQL 15 | ACID for financial data |
| Cache | Redis 7 | Sessions, rate limiting, pub/sub |
| File Storage | AWS S3 (encrypted) | KYC document storage |
| Real-time | Socket.io / native WebSockets | Trade room live updates |
| Message Queue | BullMQ (Redis) | Async jobs: KYC processing, notifications |
| Blockchain | Self-hosted TRON node | USDT TRC-20 deposits/withdrawals |
| AI / KYC | DeepFace + EasyOCR + MediaPipe | Face match, OCR, liveness (all free) |
| SMS | Local Pakistani gateway (e.g. Twilio PK) | OTP, notifications |
| Email | SendGrid or AWS SES | Transactional emails |
| Hosting | AWS (Mumbai or Bahrain region) | Low latency for Pakistan |
| Monitoring | Grafana + Prometheus | Platform health, trade metrics |

### Why Not Blockchain Escrow

Many platforms use on-chain smart contracts for escrow. PakSwap uses **internal ledger escrow** because:

- Blockchain transactions are slow (can't wait 3 minutes for a confirmation)
- Gas fees add cost to every trade
- Internal ledger is instant and free
- Legal clarity: platform is custodian during trade window
- Binance P2P and Bybit P2P both use internal ledger — industry standard

---

## 14. DEVELOPMENT ROADMAP

### Phase 0 — Foundation (Weeks 1-6)

```
Infrastructure:
- Dev environment + CI/CD (GitHub Actions)
- PostgreSQL setup + all migrations
- Redis setup
- Base API with authentication
- TRON node setup (TRC-20 USDT)
- AWS S3 bucket (KYC, encrypted)
- SMS gateway integration (local Pakistani)
- AI stack setup (DeepFace, EasyOCR, MediaPipe)

Deliverable: Running skeleton with auth + DB
```

### Phase 1 — Core P2P MVP (Weeks 7-14)

```
Features:
- Full registration with OTP
- KYC Level 1 (CNIC upload + AI OCR + manual review)
- P2P marketplace (USDT/PKR only)
- Sell ad creation
- Trade initiation + escrow lock
- Trade room (buyer/seller views)
- Payment proof upload
- AI screenshot verification
- Payment confirmation + USDT release
- Trade cancel + escrow return
- Basic manual dispute system
- Wallet (USDT TRC-20 deposit + balance)
- Admin: KYC queue + trade monitor
- SMS + Email notifications
- 2FA (TOTP)

Deliverable: Closed beta — 50 test users
```

### Phase 2 — Stabilize + Public Launch (Weeks 15-20)

```
Features:
- KYC Level 2 (selfie + liveness + face match)
- Merchant program (auto after 50 trades)
- Ratings and reputation system
- Referral program (500 PKR bonus)
- Fee system (0% promotional launch)
- Full admin panel (dispute resolution, fraud monitor)
- Urdu language toggle
- Mobile web optimization
- React Native mobile app (iOS + Android)
- BTC + ETH wallet support (deposit/withdraw)

Deliverable: Public launch — 500 user target
```

### Phase 3 — Growth (Months 6-12)

```
Features:
- USDC support
- Floating price ads (market-rate linked)
- JazzCash API verification (if partnership available)
- ML risk scoring (replace rule-based engine)
- Merchant subscription plan (2,000 PKR/month)
- Crypto-to-crypto convert (USDT ↔ BTC spread)
- AML reporting dashboard (for compliance team)
- OTC desk for large trades (>1M PKR)
- Volume analytics for merchants
- Advanced dispute tools

Deliverable: 5,000 active users, 200+ merchants
```

### Phase 4 — Scale (Year 2+)

```
Features:
- Crypto-backed PKR loans
- Stablecoin savings (yield on USDT)
- Corporate accounts + API access
- International expansion (Afghanistan, UAE)
- Fiat on/off-ramp via bank API
- Advanced AI fraud detection
- PakSwap ecosystem token (if regulatory clarity)

Deliverable: 50,000 users, market leader in Pakistan
```

---

## 15. COMPLIANCE AND LEGAL

### KYC / AML Rules

| Threshold | Action |
|---|---|
| Trade > 500,000 PKR | Auto-flag for EDD review |
| Monthly volume > 2M PKR | Compliance team review, possible STR filing |
| Structuring detected | Account freeze, manual investigation |
| Velocity: 10x spike in 7 days | Automatic risk flag |
| Duplicate CNIC detected | Block second account, investigate |

### Sanctions Screening

- Screen all users at registration against OFAC, UN, EU lists
- Screen all withdrawal addresses against known illicit wallet databases
- Use free tools: Chainalysis Go (limited free), OpenSanctions (free for non-commercial use)
- Chainalysis or Elliptic API at scale (Phase 2)

### Data Compliance

- KYC documents: AES-256 encrypted, stored in AWS S3 (Pakistan/UAE region)
- 5-year minimum retention for all trade records
- GDPR-inspired data policy (no current Pakistan equivalent, but be ready)
- No selling user data to third parties ever

### Legal Structure

- Register: Private Limited Company in Pakistan (Pvt Ltd)
- Consider: UAE VARA (Virtual Assets Regulatory Authority) secondary registration for crypto legitimacy
- Designate: MLRO (Money Laundering Reporting Officer) from day one
- Apply for VASP license when Pakistan finalizes framework

---

## 16. GO-TO-MARKET STRATEGY

### Target Users

| Segment | Description | Size |
|---|---|---|
| Primary | Tech-savvy Pakistani men 22-40, urban, already using Binance P2P but frustrated | Millions |
| Secondary | Freelancers receiving USD internationally wanting to convert efficiently to PKR | Hundreds of thousands |
| Tertiary | Small business importers needing USDT for international B2B payments | Tens of thousands |

### Marketing Channels

1. **YouTube (Urdu)** — "How to buy USDT in Pakistan 2026" tutorials — highest SEO intent
2. **TikTok / Instagram Reels** — Short Urdu crypto education clips
3. **Telegram Groups** — Pakistani crypto community (already large and engaged)
4. **Google Ads** — Target: "buy USDT Pakistan", "USDT se PKR", "JazzCash crypto"
5. **Pakistani financial YouTubers** — Paid partnerships
6. **Facebook Groups** — Tech and finance communities
7. **Referral Program** — 500 PKR per successful referral drives viral growth

### Launch Strategy

```
Month 1: Closed beta — 50-100 handpicked users from Pakistani crypto Telegram groups
Month 2: Referral-only growth — invite system, build trust stories
Month 3: Public launch with full marketing campaign
          - 0% fees promotional offer prominently advertised
          - "Pakistan ka apna P2P exchange" messaging
Month 4-6: Fee introduction + merchant recruitment campaign
```

### Unique Value Proposition

> "Pakistan ka apna P2P crypto exchange — local payments, local support, no bank disputes."

What makes PakSwap better than Binance P2P for Pakistanis:

| Binance P2P Pain Point | PakSwap Solution |
|---|---|
| English only | Full Urdu interface |
| International support team (slow, foreign) | Local PKT timezone support |
| No guidance for JazzCash-specific issues | JazzCash/Easypaisa-optimized flows |
| Confusing for beginners | Simplified 3-step beginner flow |
| Complex KYC (no CNIC-specific guidance) | Pakistan CNIC-specific KYC |
| No local community | Pakistani merchant community + Telegram group |

---

## 17. COMPLETE IMPLEMENTATION PROMPT FOR CLAUDE / BUILDER

Use this prompt when starting development with any AI coding tool or developer team.

---

```
You are building PakSwap, a Pakistan-specific P2P crypto-to-PKR exchange platform.

CORE CONCEPT:
- Pure middleman platform — no platform liquidity required
- Sellers list their own USDT for PKR
- Platform escrows seller's USDT during trade (internal ledger, not blockchain)
- Buyer sends PKR via JazzCash / Easypaisa / bank transfer
- AI + admin verify payment proof
- Seller confirms and releases USDT to buyer's external wallet address
- Platform earns 0.5% fee on completed trades
- Platform NEVER owns the USDT — it only holds it in escrow temporarily

TECH STACK:
- Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
- Backend: Node.js + Fastify (or Go + Fiber)
- Database: PostgreSQL 15
- Cache: Redis 7
- File storage: AWS S3 (AES-256 encrypted)
- Real-time: Socket.io WebSockets
- Queue: BullMQ
- Blockchain: TRON node (USDT TRC-20 primary)
- AI/KYC: DeepFace (face match), EasyOCR (CNIC OCR), MediaPipe (liveness)
- Mobile: React Native + Expo (Phase 2)

USERS AND ROLES:
- Guest: browse landing page only
- Registered User: browse marketplace, cannot trade
- KYC Lite: CNIC verified → 50,000 PKR/day trading limit
- KYC Full: CNIC + selfie + address → 500,000 PKR/day limit
- Merchant: 50+ completed trades → create ads, lower fees
- Support Agent: view trades, assist users
- KYC Reviewer: approve/reject KYC submissions
- Dispute Agent: resolve active disputes (4-hour SLA)
- Admin: full platform access

PAYMENT METHODS (MVP):
- JazzCash
- Easypaisa
- Bank transfer (any Pakistani bank, IBAN-based)

ESCROW MECHANISM:
1. Trade initiated → seller's USDT locked in escrow (internal DB debit from seller's available balance to locked balance)
2. Buyer sends PKR → uploads screenshot
3. AI verifies screenshot: sender name, recipient name, amount, timestamp
4. Seller confirms PKR received → clicks release
5. Platform sends USDT to buyer's provided external wallet address (TRC-20 / BEP-20 / ERC-20)
6. Fee (0.5%) deducted before sending
7. Trade completed, both parties can rate

ANTI-SCAM REQUIREMENTS:
- AI screenshot verifier: OCR amount, name, timestamp from JazzCash/Easypaisa screenshots
- Face match: selfie vs CNIC photo (DeepFace, threshold 85%)
- Liveness detection: MediaPipe on selfie during KYC
- KYC name must match payment method account name
- Payment method name must match KYC name
- 15-minute trade timer (buyer must pay within 15 min)
- Cancellation limits (3 cancels in 7 days = restriction)
- Device fingerprinting for duplicate account detection
- Risk scoring per user (0-100, updated on every action)
- 2FA required for USDT release and withdrawals

KYC SYSTEM:
Level 1 (Lite): CNIC front + back → AI OCR + human review → 50K PKR/day limit
Level 2 (Full): + selfie + liveness + address proof → AI face match + human review → 500K PKR/day limit
Level 3 (EDD): Manual senior review for trades >500K PKR or risk score >75

FREE AI TOOLS TO USE:
- Face match: DeepFace (Python, free)
- CNIC OCR: EasyOCR (Python, free)
- Liveness: MediaPipe Face Mesh (Google, free)
- Screenshot OCR: Tesseract + custom template parser for JazzCash/Easypaisa layouts
- Fallback: Google Cloud Vision OCR (free tier 1000/month)

DATABASE:
Use the full schema from 04_SYSTEM_ARCHITECTURE_AND_DATABASE.md.
Add these additional tables:
- kyc_ai_results (AI check results per KYC submission)
- payment_proof_verifications (AI analysis of each payment screenshot)
- user_risk_scores (live risk score per user)
- scam_patterns (rules for fraud detection)

FEE MODEL:
- MVP launch: 0% fees (3 months promotional)
- After launch: 0.5% taker fee (charged from buyer's received USDT)
- Verified merchant: 0.3%
- Premium merchant (500+ trades/month): 0.2%
- Withdrawal fee: 1 USDT flat (TRC-20 network fee)

PAGES TO BUILD:
Public: Landing, Login, Register, About, Fees, Help Center
User: Dashboard, KYC Flow, Marketplace, Trade Room, Wallet, Orders, Payment Methods,
      My Listings (Create Ad), Merchant Profile, Dispute Center, Referral, Settings, 2FA Setup
Admin: Dashboard, KYC Queue, KYC Detail, Trade Monitor, Dispute Queue, Dispute Detail,
       User Management, Fraud Monitor, Merchant Management, Platform Settings, Revenue Dashboard

EXISTING MOCKUPS:
16 HTML/CSS mockup pages already exist in /html folder.
Reference these for design and layout when building the real frontend.
Do not change the design language — maintain Deep Blue (#1A56DB) primary color.

MUST-HAVES BEFORE LAUNCH:
1. Escrow mechanism fully tested (unit tests + integration tests)
2. KYC flow with both AI and manual review working
3. AI screenshot verifier for JazzCash/Easypaisa payments
4. Dispute system with admin resolution tools
5. 2FA on all sensitive actions (release, withdraw, login)
6. Anti-cheat timers and cancellation limits
7. Mobile-responsive on all pages (primary audience is mobile)

COMPLIANCE:
- Full KYC mandatory — no anonymous trading
- Payment account name must match KYC name
- Flag trades >500K PKR for EDD
- Flag users with >2M PKR monthly volume
- Store all records for minimum 5 years
- OFAC / UN sanctions screen all users at registration
- Register as Pakistan Pvt Ltd company

BUILD ORDER:
Phase 0: Auth + DB + blockchain node setup
Phase 1: KYC + Marketplace + Trade Escrow + Dispute + Admin basics
Phase 2: Merchant program + Ratings + Referral + Mobile app + Fees
Phase 3: Multi-coin + ML risk scoring + OTC desk + Analytics
Phase 4: Loans + Savings + Corporate + International expansion

The full blueprint reference documents are:
- 00_INDEX.md — overview and decisions
- 01_SITEMAP_AND_USER_JOURNEY.md — all pages and user flows
- 02_PAGE_WIREFRAMES_PART1.md — wireframes pages 1-10
- 03_PAGE_WIREFRAMES_PART2.md — wireframes pages 11-20
- 04_SYSTEM_ARCHITECTURE_AND_DATABASE.md — full DB schema and API endpoints
- 05_BUSINESS_MODEL_MVP_ROADMAP_COMPLIANCE.md — business model and roadmap
- 06_DESIGN_SYSTEM_AND_COMPONENTS.md — colors, typography, components
- html/*.html — 16 static HTML mockup pages for reference

Start by reading these reference docs, then implement step by step starting from Phase 0.
```

---

## APPENDIX: QUESTIONS ANSWERED FROM DISCUSSION

**Q: Does the platform need its own USDT liquidity?**
No. The seller deposits their own USDT. The platform only escrows it temporarily. Zero capital required for liquidity.

**Q: Can buyers send USDT to any wallet address?**
Yes. Buyer provides their wallet address at time of trade initiation. They can give BEP-20, TRC-20, ERC-20, or any supported network address.

**Q: How does the platform earn without liquidity?**
0.5% fee on every completed trade deducted from the USDT before it reaches the buyer. At 500 trades/day this is ~22.5M PKR/year by Year 1.

**Q: What are the future earning channels?**
Merchant subscriptions, ad boosting, withdrawal fees, OTC desk fees, crypto convert spread, P2P lending interest (Phase 3+).

**Q: Are there free AI tools for KYC?**
Yes — DeepFace (face match), EasyOCR (CNIC text), MediaPipe (liveness). All free and open source. Google Cloud Vision free tier for scale.

**Q: Was safety for buyer, seller and platform considered?**
Yes — Section 4 maps every known scam type with specific technical countermeasures for each party.

**Q: Was earning model considered in the platform design?**
Yes — every revenue stream is woven into the platform features: fees in escrow engine, merchant subscriptions in merchant program, ad boosts in marketplace listing system.

**Q: What is the core trust promise?**
"Your crypto is safe in escrow. You only release it after your PKR is confirmed. If anything goes wrong, our dispute team resolves it within 4 hours."


---

## SECTION 11: MANDATORY TWO-LAYER VERIFICATION SYSTEM

> **Platform Policy:** Every verification, payment confirmation, KYC approval, trade release, dispute resolution, and Instant Buy order release MUST pass through BOTH layers before any action is executed. Neither layer alone is sufficient � this is non-negotiable.

---

### 11.1 Why Two Layers?

| Risk | Single-Layer Problem | Two-Layer Solution |
|------|---------------------|--------------------|
| AI false positives | Fake screenshots may fool OCR at low confidence | Human catches what AI misses |
| AI false negatives | Real payments rejected, user funds stuck | Human overrides unjust AI rejections |
| Fraud escalation | Sophisticated fraudsters train against AI patterns | Human judgment cannot be automated against |
| Compliance | Regulators require human accountability in financial decisions | Layer 2 creates audit trail with named reviewer |
| Trust | Users don't trust fully automated systems for money | Human review builds user confidence |

---

### 11.2 Platform-Wide Layer Definitions

**Layer 1 � AI Automated Scan (always runs first)**
- Runs immediately on submission, no human delay
- Tools: EasyOCR / Tesseract (text extraction), DeepFace (face match), MediaPipe (liveness), custom manipulation detection
- Outputs: per-check PASS/FAIL/WARN results + overall confidence score (0�100%)
- Result: data presented to Layer 2 human reviewer � AI cannot independently approve anything

**Layer 2 � Human Review (always runs after Layer 1, mandatory)**
- Triggered automatically when Layer 1 completes
- Reviewer sees full AI results + raw submitted documents
- Reviewer must make an explicit decision (approve/reject) � system does not auto-approve
- Applies to ALL actions regardless of AI confidence score (even 99% confidence requires human sign-off)
- Every decision is logged with reviewer ID, timestamp, and optional notes for audit

---

### 11.3 Two-Layer Application by Action Type

| Action | Layer 1 AI Checks | Layer 2 Human Required |
|--------|------------------|----------------------|
| **KYC Lite (CNIC)** | CNIC OCR, expiry check, duplicate CNIC, sanctions | Admin reviews document + extracted data |
| **KYC Full** | + Face match (DeepFace 91%+ threshold), liveness (MediaPipe) | Admin checks photo vs selfie, liveness video |
| **P2P Payment Release** | Screenshot OCR: amount, recipient, sender, timestamp, manipulation detection | Seller manually verifies payment in their own banking app |
| **Instant Buy Payment** | Same as P2P payment checks above | Admin reviews screenshot + AI results before releasing token |
| **Dispute Resolution** | AI analyzes payment proof + seller JazzCash history + chat transcript | Admin makes final decision � executes release or refund |
| **Withdrawal** | Destination address format validation, velocity check, sanctions screen | Admin approves large withdrawals (>100K PKR equivalent) |
| **Merchant Approval** | Automated KYC check, fraud history scan | Admin reviews application + conducts onboarding call |

---

### 11.4 SLA Requirements per Layer

| Action | Layer 1 SLA | Layer 2 SLA |
|--------|------------|------------|
| KYC Review | Instant (< 30 seconds) | 2 hours (SLA breach alert at 1.5 hrs) |
| Instant Buy Payment Verification | Instant (< 60 seconds) | 30 minutes (SLA breach alert at 20 min) |
| P2P Dispute | Instant (< 2 minutes) | 4 hours (critical alert at 3 hrs) |
| Withdrawal Review | Instant | 1 hour |

---

### 11.5 What Happens When AI and Human Disagree?

- AI passes, Human rejects ? Human decision wins. AI data logged for model retraining.
- AI flags WARN, Human approves ? Human decision wins. Flagged for weekly audit review.
- AI fails, Human overrides to approve ? Requires senior admin approval + mandatory detailed notes.
- AI fails, Human agrees ? Action rejected. User notified with specific reason.

---

### 11.6 Implementation Notes for Developers

- Every reviewable action must have a  enum: 
- Frontend shows the two-layer component (defined in ) on every status page visible to users
- Admin UI always shows Layer 1 results before presenting Layer 2 decision buttons � buttons are disabled until Layer 1 is complete
- All Layer 2 decisions write to an  table: 
- No background job, cron, or automated script may transition a record from  to  without a human actor


---

## SECTION 11: MANDATORY TWO-LAYER VERIFICATION SYSTEM

> **Platform Policy:** Every verification, payment confirmation, KYC approval, trade release, dispute resolution, and Instant Buy order release MUST pass through BOTH layers before any action executes. Neither layer alone is sufficient.

---

### 11.1 Why Two Layers?

| Risk | Single-Layer Problem | Two-Layer Solution |
|------|---------------------|--------------------|
| AI false positives | Fake screenshots may fool OCR | Human catches what AI misses |
| AI false negatives | Real payments rejected unfairly | Human overrides unjust rejections |
| Fraud escalation | Fraudsters train against AI patterns | Human judgment cannot be automated against |
| Compliance | Regulators require human accountability | Layer 2 creates named-reviewer audit trail |
| Trust | Users don't trust fully-automated money systems | Human review builds confidence |

---

### 11.2 Layer Definitions

**Layer 1 - AI Automated Scan (always first)**
- Runs immediately on submission (under 60 seconds)
- Tools: EasyOCR/Tesseract (OCR), DeepFace (face match), MediaPipe (liveness), manipulation detection
- Outputs: per-check PASS/FAIL/WARN + overall confidence score (0-100%)
- Cannot independently approve anything - outputs are presented to Layer 2 human

**Layer 2 - Human Review (always after Layer 1, mandatory)**
- Triggered when Layer 1 completes
- Reviewer sees full AI results plus raw submitted documents
- Must make explicit decision (approve/reject) - system never auto-approves
- Applies to ALL actions regardless of AI confidence score (even 99% requires human sign-off)
- Every decision logged: reviewer ID, timestamp, notes for full audit trail

---

### 11.3 Two-Layer Application by Action Type

| Action | Layer 1 AI Checks | Layer 2 Human Required |
|--------|------------------|----------------------|
| KYC Lite | CNIC OCR, expiry, duplicate, sanctions | Admin reviews document + extracted data |
| KYC Full | + Face match (DeepFace 91%+), liveness (MediaPipe) | Admin checks photo vs selfie |
| P2P Payment Release | Screenshot: amount, recipient, sender, timestamp, manipulation | Seller verifies payment in their banking app |
| Instant Buy Payment | Same P2P checks | Admin reviews screenshot + AI results before token release |
| Dispute Resolution | AI analyzes payment proof + seller history + chat | Admin makes final release or refund decision |
| Withdrawal | Address validation, velocity check, sanctions | Admin approves withdrawals over 100K PKR |
| Merchant Approval | KYC check, fraud history scan | Admin reviews application |

---

### 11.4 SLA Requirements

| Action | Layer 1 SLA | Layer 2 SLA |
|--------|------------|------------|
| KYC Review | Under 30 seconds | 2 hours (alert at 1.5 hrs) |
| Instant Buy Payment | Under 60 seconds | 30 minutes (alert at 20 min) |
| P2P Dispute | Under 2 minutes | 4 hours (critical alert at 3 hrs) |
| Withdrawal Review | Under 30 seconds | 1 hour |

---

### 11.5 AI vs Human Disagreement Policy

- AI passes, human rejects: Human wins. AI data logged for model retraining.
- AI warns, human approves: Human wins. Flagged for weekly audit.
- AI fails, human overrides: Requires senior admin + mandatory detailed notes.
- Both fail: Action rejected. User notified with specific reason.

---

### 11.6 Developer Implementation Requirements

- Every reviewable action must have verification_status: pending_layer1 > pending_layer2 > approved or rejected
- Frontend shows the two-layer CSS component (styles.css .two-layer-box) on all relevant status pages
- Admin UI shows Layer 1 results before presenting Layer 2 decision buttons (buttons disabled until Layer 1 completes)
- All Layer 2 decisions write to admin_audit_log: admin_id, action_type, resource_id, decision, notes, timestamp
- No automated script may transition a record from pending_layer2 to approved without a human actor
