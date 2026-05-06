# PakSwap — P2P Crypto-PKR Platform Blueprint
## Complete Product Design & Architecture Document

**Platform:** Pakistan P2P Crypto Exchange (USDT, BTC, ETH, USDC ↔ PKR)
**Document Version:** 1.0 | **Date:** May 2026
**Status:** Static Mockup & Blueprint Phase

---

## Document Index

| # | File | Contents | Status |
|---|------|----------|--------|
| 1 | [01_SITEMAP_AND_USER_JOURNEY.md](01_SITEMAP_AND_USER_JOURNEY.md) | Full sitemap, user roles, 3 complete user journey maps (buy flow, sell flow, dispute flow), UX principles | Current |
| 2 | [02_PAGE_WIREFRAMES_PART1.md](02_PAGE_WIREFRAMES_PART1.md) | Pages 1–10 text wireframes — **SUPERSEDED** by HTML mockups in `html/` | Superseded |
| 3 | [03_PAGE_WIREFRAMES_PART2.md](03_PAGE_WIREFRAMES_PART2.md) | Pages 11–20 text wireframes — **SUPERSEDED** by HTML mockups in `html/` | Superseded |
| 4 | [04_SYSTEM_ARCHITECTURE_AND_DATABASE.md](04_SYSTEM_ARCHITECTURE_AND_DATABASE.md) | Tech stack, architecture diagram, full PostgreSQL schema, REST API, WebSocket events, escrow, blockchain integration (updated with P2P escrow deposit monitoring) | Current |
| 5 | [05_BUSINESS_MODEL_MVP_ROADMAP_COMPLIANCE.md](05_BUSINESS_MODEL_MVP_ROADMAP_COMPLIANCE.md) | Monetization, fee model, revenue projections, MVP feature list, 4-phase roadmap, Pakistan compliance framework, AML/KYC rules, go-to-market strategy | Current |
| 6 | [06_DESIGN_SYSTEM_AND_COMPONENTS.md](06_DESIGN_SYSTEM_AND_COMPONENTS.md) | Color palette, typography, spacing, 14 key components spec, page templates, motion design, trust patterns, responsive breakpoints, Tailwind config | Current |
| 7 | [07_PAKSWAP_COMPLETE_MASTER_PLAN.md](07_PAKSWAP_COMPLETE_MASTER_PLAN.md) | Scam vectors (Sec 4), free AI tools (Sec 6), mandatory two-layer verification policy (Sec 11) | Current |
| 8 | [08_INSTANT_BUY_OTC_BLUEPRINT.md](08_INSTANT_BUY_OTC_BLUEPRINT.md) | Instant Buy / OTC — PKR flow (Mode A), pricing engine, DB schema | Current |
| 9 | [09_CRYPTO_TO_CRYPTO_BLUEPRINT.md](09_CRYPTO_TO_CRYPTO_BLUEPRINT.md) | Instant Buy — Crypto payment flow (Mode B), 25+ tokens, 15+ networks, blockchain monitor, payout queue, two-layer enforcement | Current |
| 10 | [10_SCREENSHOT_VERIFICATION_SPEC.md](10_SCREENSHOT_VERIFICATION_SPEC.md) | OCR engine selection, payment method templates, field extraction, name matching (Levenshtein + Urdu romanization), confidence thresholds, manipulation detection, DB schema | Current |
| 11 | [11_TECH_STACK_DECISIONS.md](11_TECH_STACK_DECISIONS.md) | All locked tech decisions — Node.js/Fastify, Prisma, BullMQ, RPC providers, AWS S3, signing service, no auto-payout | Current |
| 12 | [12_ADMIN_WORKFLOW_SPEC.md](12_ADMIN_WORKFLOW_SPEC.md) | Step-by-step admin flows — KYC review, P2P payment approve/reject, dispute resolution, Instant Buy verification, force release, user suspension, provider approval, inventory management, audit log schema, SLA table | Current |
| 13 | [13_RATE_LIMITS_AND_ERROR_STATES.md](13_RATE_LIMITS_AND_ERROR_STATES.md) | All API rate limits, business rule limits, KYC/trade/Instant Buy limits, full error code table with HTTP codes, edge case handling for all flows, WebSocket error states, BullMQ queue error handling | Current |
| 14 | [14_NOTIFICATION_SYSTEM_SPEC.md](14_NOTIFICATION_SYSTEM_SPEC.md) | Every notification: channel (in-app/push/email/SMS), trigger, recipient, exact message text. 12 email templates, SMS templates, onboarding sequence, push payload structure, DB schema | Current |
| 15 | [15_MOBILE_APP_SPEC.md](15_MOBILE_APP_SPEC.md) | React Native (Expo) mobile app — feature scope vs web, biometric auth, navigation structure, push integration, KYC camera capture, deep links, App Store requirements, 36-screen inventory | Current |
| 16 | [16_MERCHANT_DASHBOARD_SPEC.md](16_MERCHANT_DASHBOARD_SPEC.md) | Merchant/provider post-approval access, dashboard pages, inventory deposit/withdraw flow, how merchant inventory connects to Instant Buy order matching, commission calculation and payout, DB schema | Current |
| 17 | [17_DEPLOYMENT_SPEC.md](17_DEPLOYMENT_SPEC.md) | Local dev Docker Compose setup (all 8 services), production AWS architecture (ECS Fargate, RDS, ElastiCache, S3, KMS), CI/CD pipeline, monitoring stack, cost estimates, pre-launch checklist | Current |

---

## Quick Reference: Key Decisions

### Coins Supported (MVP)
- **USDT** (TRC-20 priority, ERC-20 also)
- **BTC** (Phase 2)
- **ETH** (Phase 2)
- **USDC** (Phase 3)

### Payment Methods (MVP)
- JazzCash
- Easypaisa
- All Pakistani bank transfers (manual IBAN)

### Fee Model (Canonical)

**P2P Trading:**
- 0% promotional launch (first 3 months)
- 0.5% taker fee after launch
- 0.3% for verified merchants

**Instant Buy (OTC / Crypto-to-Crypto):**
- Spread built into the quoted price (no explicit taker fee shown to user)
- Spread % varies by token and payment method; defined per-token in Doc 09
- Network/gas fee passed through at cost on Mode B (crypto payment)

### Trust Architecture
- Internal ledger escrow (no crypto leaves platform during P2P)
- CNIC-based KYC with liveness detection
- Payment method name must match KYC name
- 15-minute trade timer with dispute escalation

### Compliance Stance
- Full KYC mandatory (no anonymous trading)
- FATF/AML compliant transaction monitoring
- SECP/SBP aware — regulatory-ready structure
- Data stored in PK/UAE region

---

## Canonical Roadmap (resolves phase contradictions between Doc 08 and Doc 09)

| Phase | Scope | Timeline |
|-------|-------|---------|
| **MVP (Weeks 1–8)** | P2P PKR trading (USDT TRC-20 only), KYC, basic admin, two-layer verification, dispute flow | Launch target |
| **Phase 1 (Weeks 9–16)** | Instant Buy **Mode A** (PKR → crypto), 5 tokens (USDT/USDC/BTC/ETH/BNB), JazzCash/Easypaisa OCR | +8 weeks |
| **Phase 2 (Weeks 17–28)** | Instant Buy **Mode B** (Crypto → crypto), blockchain deposit monitor, payout queue, 25+ tokens, 15+ networks | +12 weeks |
| **Phase 3 (Weeks 29+)** | Merchant/provider system, referral, advanced analytics, mobile app | TBD |

> Doc 08 refers to Instant Buy Crypto as "Phase 2" and Doc 09 originally said "MVP Week 1–4" — both are superseded by this table. Phase 2 above is the correct placement for Mode B (crypto payment).

---

## Design Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Primary color | Deep Blue #1A56DB | Trust, finance, security |
| Mobile-first | 375px breakpoint | 80%+ Pakistani users on mobile |
| Language | English + Urdu toggle | Accessibility for wider audience |
| Framework | Next.js + React Native | Code sharing, SEO, performance |
| Database | PostgreSQL | ACID compliance for financial data |
| Escrow model | Internal ledger | No blockchain risk during P2P |
| KYC approach | CNIC + liveness | Pakistan-specific, fraud-resistant |
| Support hours | 9AM–11PM PKT | Local timezone, extended hours |

---

## Next Steps for Design Team

1. **Figma Prototype:** Convert wireframes in this doc to high-fidelity Figma designs
2. **Component Library:** Build design tokens from [06_DESIGN_SYSTEM_AND_COMPONENTS.md](06_DESIGN_SYSTEM_AND_COMPONENTS.md)
3. **User Testing:** Test KYC flow and trade room with 10 real Pakistani users
4. **Localization:** Prepare Urdu translations for all UI strings
5. **Accessibility Audit:** WCAG AA compliance check

## Environment Setup

| File | Purpose |
|------|---------|
| [.env.example](.env.example) | Complete environment variable reference — copy to `.env` before running. Covers database, Redis, AWS S3, all RPC providers, signing service KMS, SendGrid, Twilio, Firebase, Sentry, feature flags, business rule overrides. |

## Next Steps for Development Team

1. **Database Setup:** Use schema from [04_SYSTEM_ARCHITECTURE_AND_DATABASE.md](04_SYSTEM_ARCHITECTURE_AND_DATABASE.md)
2. **API Structure:** Implement endpoints in listed order (auth first, then KYC, then trading)
3. **Blockchain:** Set up TRON TRC-20 node first (USDT is primary coin)
4. **Escrow Logic:** Implement and unit test escrow mechanism thoroughly before launch
5. **Security Audit:** External pen test before any real funds accepted

---

*This blueprint was designed with reference to Binance P2P, Bybit P2P, OKX P2P, and Paxful/Noones best practices, adapted specifically for the Pakistani market context.*
