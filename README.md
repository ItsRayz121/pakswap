# PakSwap — P2P Crypto Exchange

Pakistan's trusted peer-to-peer crypto exchange. USDT, BTC, ETH, USDC ↔ PKR via JazzCash, Easypaisa, and Bank Transfer.

## Quick Start (Development)

### Prerequisites
- Docker Desktop
- Node.js 20+
- npm 10+

### 1. Clone and configure
```bash
cp .env.example .env
# Edit .env with your API keys (Twilio, SendGrid, Google Vision, etc.)
```

### 2. Start all services
```bash
docker compose up -d
```

This starts:
| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | PostgreSQL 16 |
| redis | 6379 | Redis 7 |
| api | 3000 | Fastify backend |
| blockchain-monitor | — | BullMQ blockchain worker |
| paddleocr | 8866 | PaddleOCR fallback |
| deepface | 5000 | Face matching microservice |
| localstack | 4566 | AWS S3/KMS emulator |
| mailhog | 8025 | Email preview UI |

### 3. Set up database
```bash
cd backend
npm install
npx prisma migrate dev
npm run db:seed
```

### 4. Start frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3001**
API runs at **http://localhost:3000**

---

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pakswap.com | Admin@123456 |
| Seller | seller@test.com | Seller@123456 |
| Buyer | buyer@test.com | Buyer@123456 |
| KYC Reviewer | kyc@pakswap.com | Reviewer@123456 |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Next.js 14 Frontend (port 3001)                        │
│  React Query + Zustand + Tailwind CSS                   │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / API Rewrites
┌─────────────────────▼───────────────────────────────────┐
│  Fastify 4 API (port 3000)                              │
│  JWT Auth · Rate Limiting · Multipart · WebSocket       │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
  ┌────▼────┐   ┌─────▼─────┐  ┌───▼────────┐
  │Postgres │   │   Redis    │  │    AWS S3  │
  │  (ORM:  │   │ (Sessions, │  │  (KYC docs,│
  │ Prisma) │   │  BullMQ)   │  │  proofs)   │
  └─────────┘   └─────┬─────┘  └────────────┘
                      │
              ┌───────▼───────┐
              │  BullMQ Workers│
              │  · OCR Worker  │
              │  · Blockchain  │
              │  · Payout      │
              │  · Notify      │
              └───────────────┘
```

## Two-Layer Verification (Critical)

**No crypto is EVER released automatically.**

1. **Layer 1 — AI Scan**: OCR reads payment screenshot, extracts amount + sender name, checks for tampering
2. **Layer 2 — Human Review**: Admin reviews AI result and approves/rejects

This applies to:
- P2P payment proofs → escrow release
- Instant Buy payment proofs → crypto dispatch
- KYC documents → account verification

## Key Directories

```
G:\p2p\
├── backend/
│   ├── src/
│   │   ├── routes/          # All API routes
│   │   ├── services/        # Business logic
│   │   ├── workers/         # BullMQ background jobs
│   │   ├── middleware/      # Auth, rate-limit
│   │   └── lib/             # Prisma, Redis, S3, queues
│   └── prisma/
│       ├── schema.prisma    # Full DB schema
│       └── seed.ts          # Dev seed data
├── frontend/
│   ├── app/                 # Next.js 14 App Router pages
│   ├── components/          # Layout, UI components
│   └── lib/                 # API client, Zustand store
├── services/
│   ├── deepface/            # Face matching microservice (Python)
│   └── paddleocr/           # OCR fallback microservice (Python)
└── docker-compose.yml
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Must be 64+ chars in production
- `GOOGLE_CLOUD_CREDENTIALS_JSON` — For Vision OCR (Layer 1)
- `TWILIO_*` — For SMS OTP
- `SENDGRID_API_KEY` — For email notifications
- `AWS_*` — For S3 file storage

## Production Deployment

Requires:
- Ubuntu 22.04 server
- Docker + Docker Compose
- Nginx reverse proxy with SSL
- PostgreSQL 16 (managed or self-hosted)
- Redis 7 (managed or self-hosted)

See `.github/workflows/deploy.yml` for CI/CD pipeline using GitHub Actions + GHCR.
