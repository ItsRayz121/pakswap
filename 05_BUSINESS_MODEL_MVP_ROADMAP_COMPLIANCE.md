# Business Model, MVP, Roadmap & Compliance
**PakSwap P2P Platform**

---

## 1. MONETIZATION MODEL

### Primary Revenue: Trading Fees

| User Type | Fee Structure |
|-----------|--------------|
| Regular Users | 0.5% on completed trades (charged to taker — the person initiating) |
| Verified Merchants | 0.3% on completed trades |
| Premium Merchant | 0.2% (high-volume tier: > 500 trades/month) |

**Example:**
- User buys 100 USDT = 28,050 PKR at 280.50 PKR/USDT
- Platform fee: 0.5 USDT (0.5% of 100 USDT) = ~140 PKR
- Buyer receives: 99.5 USDT

**Annual Revenue Projection (Conservative):**
```
Avg trade size:         25,000 PKR (~89 USDT)
Daily trades:           500 (Year 1 target)
Daily volume:           12.5M PKR (~44,642 USDT)
Fee per trade:          0.5% → avg 125 PKR
Daily revenue:          62,500 PKR (~$222)
Monthly revenue:        1.875M PKR (~$6,696)
Annual revenue:         22.5M PKR (~$80,000)

Year 2 (1000 trades/day): ~45M PKR/year
Year 3 (3000 trades/day): ~135M PKR/year
```

### Secondary Revenue Streams

| Stream | Description | Est. Monthly (Year 2) |
|--------|-------------|----------------------|
| **Merchant Subscription** | Premium merchant badge: 2,000 PKR/month | 200K PKR (100 merchants) |
| **Ad Promotion** | Pay to boost listing to top | 500 PKR/day per ad |
| **Referral Program Revenue** | Platform earns from referred user's first 50 trades | Included in fee |
| **Withdrawal Fees** | Fixed fee per withdrawal: 1 USDT TRC-20, 0.0002 BTC | Variable |
| **P2P Loan (Future)** | Crypto-backed PKR loans | Phase 3 |
| **Crypto Convert (Future)** | Spot swap: USDT↔BTC at small spread | Phase 3 |

---

## 2. FEE COMPARISON (Pakistan Market Research)

| Platform | Taker Fee | Notes |
|----------|----------|-------|
| Binance P2P | 0% | Cross-subsidized by spot/futures |
| Bybit P2P | 0% | Loss-leader for derivatives |
| Paxful | 1% buyer fee | Higher fees for smaller trades |
| Noones | 0.5-1% | Graduated by volume |
| **PakSwap** | **0.5% → 0.3%** | **Competitive, sustainable** |

**Strategy:** Launch at 0% fees for first 3 months (promotional). Then introduce 0.5% gradually. Build habit before monetizing.

---

## 3. MVP FEATURE LIST

### MVP Phase (Launch — Month 1-3)

**Must Have:**
- [x] User registration with phone + email OTP
- [x] Basic KYC (CNIC upload + selfie)
- [x] P2P marketplace: USDT/PKR only
- [x] 3 payment methods: JazzCash, Easypaisa, Bank Transfer (any bank)
- [x] Trade/escrow room with 15-min timer
- [x] Basic dispute system (manual, via chat)
- [x] Seller ad creation (fixed price)
- [x] User wallet (USDT TRC-20 only)
- [x] SMS + Email notifications
- [x] Basic admin dashboard (KYC approval, trade monitoring)
- [x] Order history
- [x] 2FA (TOTP / SMS)
- [x] Basic merchant profile (after 50 trades)
- [x] Mobile-responsive web app

**Nice to Have (MVP+):**
- [ ] Floating price ads
- [ ] BTC and ETH support
- [ ] In-app referral tracking
- [ ] Payment method verification automation
- [ ] Trade rating system
- [ ] Urdu language toggle
- [ ] React Native mobile app (iOS + Android)

**Exclude from MVP (Phase 2+):**
- [ ] Crypto-to-crypto convert
- [ ] Crypto loans
- [ ] Advanced fraud ML models
- [ ] Automated JazzCash verification API
- [ ] Multiple admin roles with RBAC
- [ ] Advanced analytics dashboard

---

## 4. DEVELOPMENT ROADMAP

### Phase 0 — Foundation (Weeks 1-6)
```
Infrastructure:
  ✓ Setup development environment
  ✓ Database schema design and setup
  ✓ CI/CD pipeline (GitHub Actions)
  ✓ Base API structure (auth, middleware)
  ✓ Blockchain node setup (TRON TRC-20)
  ✓ S3 bucket for KYC docs (encrypted)
  ✓ SMS gateway integration (local Pakistani provider)

Deliverables: Running skeleton app, auth working, DB migrations
```

### Phase 1 — Core P2P (Weeks 7-14)
```
Features:
  ✓ Full registration + KYC flow
  ✓ P2P ad creation (USDT only)
  ✓ Marketplace browsing
  ✓ Trade initiation + escrow lock
  ✓ Trade room (buyer/seller views)
  ✓ Payment confirmation + release
  ✓ Basic dispute (manual)
  ✓ Wallet: deposit + USDT display
  ✓ Admin: KYC queue + trade monitor

Deliverables: Closed beta with 50 test users
```

### Phase 2 — Stabilize + Launch (Weeks 15-20)
```
Features:
  ✓ Multi-coin: BTC, ETH
  ✓ Automated KYC scoring (AI OCR)
  ✓ Mobile app (React Native)
  ✓ Referral program
  ✓ Merchant program
  ✓ Fee system goes live (0% promotional)
  ✓ Full admin panel + fraud monitoring
  ✓ Payment method verification
  ✓ Urdu language

Deliverables: Public launch with 500 users target
```

### Phase 3 — Growth (Months 6-12)
```
Features:
  ✓ USDC support
  ✓ Floating price ads
  ✓ Automated JazzCash verification (API)
  ✓ Advanced risk scoring (ML model)
  ✓ Merchant subscription plan
  ✓ Crypto-to-Crypto convert
  ✓ AML reporting dashboard
  ✓ Volume analytics for merchants
  ✓ Bulk order feature (OTC desk for > 1M PKR)

Deliverables: 5,000 active users, 200 merchants
```

### Phase 4 — Scale (Year 2+)
```
  ✓ Crypto-backed PKR loans (CeFi lending)
  ✓ Stablecoin savings (yield on USDT)
  ✓ Corporate accounts + API access
  ✓ International expansion (Afghan Afghani? UAE Dirham?)
  ✓ Fiat on/off-ramp via bank API (if regulatory clearance)
  ✓ NFT marketplace (optional)
  ✓ PakSwap token (governance/rewards, if regulatory allows)
```

---

## 5. RISK & COMPLIANCE (Pakistan Context)

### 5.1 Regulatory Environment

**Current Status (2026):**
Pakistan's crypto regulatory landscape is evolving. As of 2025-2026:
- **SBP (State Bank of Pakistan):** Has historically discouraged crypto use but has not enacted a blanket ban. Policy position is "cautionary."
- **SECP (Securities and Exchange Commission of Pakistan):** Has moved toward a regulatory framework for Virtual Asset Service Providers (VASPs).
- **FBR (Federal Board of Revenue):** Crypto gains may be subject to capital gains tax.
- **FATF:** Pakistan has been on/off the grey list — AML/CFT compliance is critical.

**Key Regulatory Risks:**
1. SBP may issue new guidance restricting crypto activity
2. New VASP licensing requirements may be introduced
3. Tax reporting requirements for crypto transactions
4. AML/CFT scrutiny of large PKR transfers

### 5.2 Compliance Framework

**KYC/AML Requirements:**
```
Customer Due Diligence (CDD):
  Level 1 (Lite KYC): CNIC + phone → up to 50,000 PKR/day
  Level 2 (Full KYC): + selfie + address → up to 500,000 PKR/day
  Level 3 (EDD — Enhanced Due Diligence): PEP/sanctions check
    Applied to: trades > 100,000 PKR in single transaction
                users with > 50 disputes history
                users flagged by fraud system

Transaction Monitoring:
  - Flag transactions > 500,000 PKR single trade
  - Flag users with > 2M PKR monthly volume (report to FBR/SBP if required)
  - Structuring detection: multiple trades just under reporting thresholds
  - Velocity checks: sudden 10x increase in trading volume

Record Keeping (minimum 5 years):
  - All trade records
  - KYC documents
  - Dispute records
  - Financial transaction logs
```

**Sanctions Screening:**
```
  - Screen all new users against OFAC, UN, EU sanctions lists
  - Screen crypto withdrawal addresses against known illicit addresses
  - Use Chainalysis / Elliptic API (Phase 2)
  - Screen names against Pakistan's designated terrorist lists
```

**PEP (Politically Exposed Persons) Screening:**
```
  - Check against PEP databases
  - Enhanced monitoring for matched users
  - Senior management approval for PEP accounts
```

### 5.3 Terms of Service — Key Restrictions

Users are prohibited from:
1. Using third-party payment accounts (name must match KYC)
2. Trading on behalf of others (no third-party trading)
3. Structuring trades to avoid reporting limits
4. Using VPNs (flag for review, not auto-ban)
5. Engaging in wash trading / price manipulation
6. Creating multiple accounts

Platform restrictions:
- No anonymous trading (full KYC required)
- No cash trades (all digital payments only)
- No peer-to-peer physical meetups coordinated on platform

### 5.4 Data Protection

- Store KYC documents encrypted (AES-256) on AWS S3 Pakistan/UAE region
- Do not share user data with third parties without legal mandate
- Right to deletion (subject to regulatory retention requirements)
- GDPR-inspired data policy (Pakistan does not have GDPR equivalent yet, but be ready)

---

## 6. TRUST & SAFETY FEATURES

### User Protection
| Feature | Description |
|---------|-------------|
| **Escrow** | 100% of crypto held until payment confirmed |
| **Payment Proof** | Screenshot upload required (optional but encouraged) |
| **Trade Timer** | Prevents indefinite trade locks |
| **Dispute Resolution** | 4-hour SLA for dispute agent response |
| **KYC-Name Match** | Payment method must match KYC name |
| **Withdrawal 2FA** | Every withdrawal requires 2FA |
| **Anti-Phishing Code** | User-set code appears in all emails |
| **Device Tracking** | Alert on new device login |

### Platform Protection
| Feature | Description |
|---------|-------------|
| **Rate Limiting** | API rate limits per IP and per user |
| **CAPTCHA** | On registration and login |
| **Fraud Rules Engine** | Automated risk flags |
| **Cold Wallet** | 90% assets in cold storage |
| **Multi-sig** | Hot wallet requires 2-of-3 keys to sign |
| **Bug Bounty** | Public responsible disclosure program |
| **Penetration Testing** | Quarterly third-party security audit |

---

## 7. COMPETITIVE ANALYSIS

### Why Users Choose PakSwap Over Binance P2P

| Pain Point (Binance) | PakSwap Solution |
|---------------------|-----------------|
| English-only interface | Urdu language support |
| International support (slow) | Local PKT timezone support team |
| No JazzCash-specific guidance | JazzCash / Easypaisa optimized flows |
| Merchants don't speak Urdu | Local merchant community |
| Complex for beginners | Simplified 3-step onboarding |
| No local customer service | Whatsapp support + local office |
| International KYC standards | Pakistan CNIC-based KYC |

### Unique Value Proposition (UVP)
> "The only P2P crypto platform built specifically for Pakistanis — local payments, local support, local trust."

---

## 8. GO-TO-MARKET STRATEGY

### Target Audience
**Primary:** Pakistani men 22-40, tech-savvy, urban (Karachi, Lahore, Islamabad)
- Already using JazzCash/Easypaisa
- Currently using Binance P2P but frustrated by complexity
- Want to convert PKR savings to USDT as inflation hedge

**Secondary:** Freelancers receiving USD internationally, want to convert to PKR efficiently

**Tertiary:** Small business importers needing USDT for international payments

### Marketing Channels
1. **YouTube:** Urdu tutorials (how to buy USDT in Pakistan, CNIC registration guide)
2. **TikTok/Instagram Reels:** Short crypto education in Urdu
3. **Telegram Groups:** Pakistani crypto community groups
4. **Influencer Partnerships:** Pakistani financial YouTubers
5. **Google Ads:** Targeted "buy USDT Pakistan", "how to buy crypto in Pakistan"
6. **Referral Program:** Viral growth via 500 PKR referral bonus
7. **Facebook Groups:** Tech and finance groups

### Launch Strategy
- Month 1: Closed beta with 50-100 handpicked users (crypto community leaders)
- Month 2: Referral-only growth
- Month 3: Public launch with marketing push

---

## 9. LEGAL STRUCTURE RECOMMENDATIONS

- Register as a Private Limited Company in Pakistan
- Consider secondary registration in UAE (for crypto-friendly licensing: VARA Dubai)
- Maintain legal counsel familiar with SBP and SECP regulations
- Apply for VASP license when Pakistan framework is finalized
- Keep compliance documentation updated as regulations evolve
- Designate a Compliance Officer (MLRO — Money Laundering Reporting Officer)
