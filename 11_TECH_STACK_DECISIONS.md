# 11 — Tech Stack Decisions (Locked)

**Status:** Final — no open questions  
**Last updated:** 2026-05-05

These decisions are locked. Do not introduce alternatives or "OR" options in other docs. If a change is needed, update this file first.

---

## 1. Runtime & Framework

| Layer | Decision | Rationale |
|-------|----------|-----------|
| Backend runtime | **Node.js 20 LTS** | Team expertise; vast Web3 library ecosystem |
| HTTP framework | **Fastify 4** | Fastest Node.js framework; schema validation built-in; plugin architecture |
| API style | **REST + WebSocket** | REST for CRUD; WS for real-time trade/deposit events |
| Language | **TypeScript 5** | Type safety across backend and shared types |

---

## 2. Database

| Layer | Decision |
|-------|----------|
| Primary DB | **PostgreSQL 16** |
| ORM | **Prisma 5** |
| Migrations | **Prisma Migrate** (no raw SQL migration files; schema.prisma is source of truth) |
| Connection pool | **PgBouncer** (transaction mode, pool_size=20 per service) |
| Read replicas | 1 replica for admin panel queries; primary for all writes |

---

## 3. Cache & Queue

| Layer | Decision |
|-------|----------|
| Cache / pub-sub | **Redis 7** via **ioredis** |
| Job queue | **BullMQ** (backed by Redis) |
| Key queues | `deposit-events`, `ocr-jobs`, `payout-queue`, `kyc-review`, `notifications` |
| Session store | Redis (`connect-redis`) |

---

## 4. Blockchain RPC Providers

| Chain | Provider | Fallback |
|-------|----------|---------|
| Ethereum (ETH/ERC-20) | **Infura** | **Alchemy** |
| BNB Smart Chain (BEP-20) | **Ankr** | **QuickNode** |
| TRON (TRC-20) | **TronGrid** (polling 3 s) | TronWeb self-hosted node |
| Solana | **Helius** (WebSocket) | Triton |
| Bitcoin | **BlockCypher** webhooks | Mempool.space API |
| Avalanche C-Chain | **Ankr** | Infura |
| Arbitrum / Optimism | **Alchemy** | Infura |

---

## 5. File Storage

| Purpose | Decision |
|---------|----------|
| KYC documents | **AWS S3** — bucket `pakswap-kyc-docs` |
| Payment screenshots | **AWS S3** — bucket `pakswap-kyc-screenshots`, prefix `payment-proofs/` |
| Admin access | Presigned URLs, 15-min TTL |
| Retention | 7 years |

---

## 6. OCR

| Priority | Engine | When |
|----------|--------|------|
| Primary | **Google Cloud Vision API** (`DOCUMENT_TEXT_DETECTION`) | All requests |
| Fallback | **PaddleOCR** (self-hosted, CPU Docker container) | GCV failure or >5 s timeout |

---

## 7. Authentication

| Purpose | Decision |
|---------|----------|
| User auth | JWT (access 15 min) + refresh token (httpOnly cookie, 30 days) |
| 2FA | TOTP via `otplib` |
| Admin auth | Separate JWT issuer, stricter expiry (8 h), IP allowlist |
| KYC identity | Keycloak or in-house (TBD — out of scope Phase 1 MVP) |

---

## 8. Signing Service

- **Isolated Node.js process** — not part of the main API
- Communicates only via authenticated internal HTTP (mTLS)
- **Never called by any background worker or BullMQ job automatically**
- Only invoked by an explicit, authenticated admin API action
- Private keys stored in **AWS KMS** (HSM-backed)

---

## 9. Monitoring & Alerting

| Purpose | Decision |
|---------|----------|
| Metrics | **Prometheus** + **Grafana** |
| Error tracking | **Sentry** |
| Logs | **Pino** (structured JSON) → **Loki** |
| Uptime | **Betterstack** |

---

## 10. Infrastructure

| Layer | Decision |
|-------|----------|
| Cloud | **AWS** |
| Compute | **ECS Fargate** (containers) |
| CI/CD | **GitHub Actions** |
| Container registry | **ECR** |
| Secrets | **AWS Secrets Manager** |
| DNS / CDN | **Cloudflare** |

---

## 11. What Is Explicitly NOT Used

| Rejected | Reason |
|----------|--------|
| Go / Gin | No team expertise |
| Mongoose / MongoDB | Relational data model required for P2P trades + wallets |
| TypeORM | Prisma has better DX and migration tooling |
| Auto-payout / scheduled signing | Violates two-layer policy — admin must always approve |
| On-chain P2P escrow | Not needed — internal ledger escrow is sufficient and cheaper |
