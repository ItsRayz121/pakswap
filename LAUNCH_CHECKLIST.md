# PakSwap Launch Checklist

Status of blockers fixed in this session and what you must complete before going live.

## Fixed in code

- [x] Frontend login wired to real backend (`/api/auth/login` → `/api/auth/me`)
- [x] Frontend register wired to real backend with phone OTP step
- [x] Mock fallback preserved via `NEXT_PUBLIC_USE_MOCK=true` for static preview
- [x] Merchant/Provider backend routes (`/api/merchants/*`)
  - apply / me / list / get / inventory CRUD / admin queue / approve / reject
- [x] Frontend `merchant-apply` page wired to merchant API
- [x] Wallet HD address derivation (EVM via `ethers`, BIP44 path)
- [x] Network fee lookup (env-driven `NETWORK_FEE_<COIN>_<NETWORK>` with safe defaults)
- [x] SendGrid graceful fallback when template IDs missing (plain-text emails)
- [x] Twilio graceful fallback when credentials missing (logs to console)
- [x] Backend respects Railway `PORT`
- [x] `vercel.json` rewritten for Next.js subdirectory build
- [x] `railway.json` added for backend deploy
- [x] `frontend/.env.example` added

## You must do before launch

### 1. Provision infrastructure
- [ ] PostgreSQL (Railway Postgres or RDS) — set `DATABASE_URL`
- [ ] Redis (Railway Redis or ElastiCache) — set `REDIS_URL`
- [ ] S3 buckets for KYC + screenshots — set `S3_BUCKET_*` and AWS keys

### 2. Required env vars on Railway (backend)
Critical:
- `NODE_ENV=production`
- `DATABASE_URL`, `REDIS_URL`
- `JWT_SECRET` (≥64 random chars), `ADMIN_JWT_SECRET` (different value)
- `ENCRYPTION_KEY` (32-byte hex)
- `CORS_ORIGINS=https://your-vercel-domain.vercel.app`
- `WALLET_MNEMONIC` (12-word BIP-39, generate offline, store in secret manager)

Notifications (optional but recommended):
- `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`

Blockchain (optional — only required for chains you support):
- `ETH_RPC_URL`, `BSC_RPC_URL`, `TRON_API_URL`, etc.
- `DEPOSIT_POOL_USDT_TRC20=Tabc…,Tdef…` for non-EVM chains until KMS HD wiring is added

### 3. Required env vars on Vercel (frontend)
- `NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app`
- `NEXT_PUBLIC_USE_MOCK=false`

### 4. Database
- [ ] Run `npx prisma migrate deploy` (the Railway start command does this)
- [ ] Seed admin user: `npm run db:seed` once

### 5. Smoke tests after deploy
- [ ] `GET /health` returns `{"status":"ok"}` on Railway URL
- [ ] Register → OTP → login flow works on the live frontend
- [ ] `GET /api/marketplace/ads` returns (empty array OK)
- [ ] Admin login → admin dashboard loads

### 6. Known incomplete items (post-launch hardening)
- KYC AI services (DeepFace/MediaPipe/PaddleOCR microservices) — Layer 2 admin review still works without them
- Blockchain deposit listener is scaffolded but won't credit until RPC keys + signing service are wired
- Withdrawal payouts require the signing service (KMS) — admin-approved withdrawals will queue but not broadcast
- Mobile app (Doc 15) — not built
