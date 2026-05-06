# System Architecture & Database Design
**PakSwap P2P Platform**

---

## 1. HIGH-LEVEL ARCHITECTURE

```
                        ┌─────────────────────────────────────┐
                        │         CLIENTS                      │
                        │  Web App (React)  Mobile App (RN)    │
                        └────────────────┬────────────────────┘
                                         │ HTTPS / WSS
                        ┌────────────────▼────────────────────┐
                        │          API GATEWAY                 │
                        │   (Rate limiting, Auth, Routing)     │
                        └──┬──────────────┬────────────────┬──┘
                           │              │                │
              ┌────────────▼──┐  ┌────────▼──────┐  ┌─────▼────────┐
              │  Auth Service │  │  Core API     │  │ Notification │
              │  (JWT + 2FA)  │  │  (Trade, KYC, │  │  Service     │
              └───────────────┘  │  Wallet, P2P) │  │(SMS/Email/WS)│
                                 └──────┬────────┘  └──────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
         ┌──────────▼───┐   ┌──────────▼───┐   ┌──────────▼───┐
         │  PostgreSQL  │   │    Redis     │   │  Blockchain  │
         │  (Primary DB)│   │  (Sessions,  │   │  Node(s)     │
         │              │   │   Cache,     │   │  (TRON, ETH, │
         │              │   │   Pub/Sub)   │   │   BTC, BSC)  │
         └──────────────┘   └──────────────┘   └──────────────┘
                    │
         ┌──────────▼───────────────────────┐
         │         File Storage             │
         │  (KYC docs, receipts — AWS S3    │
         │   or Cloudflare R2, encrypted)   │
         └──────────────────────────────────┘

External Services:
  ├── SMS: Twilio / Jazz OTP API / Telenor API
  ├── Email: SendGrid / Amazon SES
  ├── KYC AI: Jumio / Onfido / ComplyAdvantage
  ├── Price Feed: Binance API / CoinGecko
  ├── Sanctions: OFAC list, UN sanctions
  └── Push: Firebase FCM
```

---

## 2. TECH STACK RECOMMENDATION

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend (Web) | Next.js 14 (React) + TypeScript | SSR for SEO, great DX |
| Frontend (Mobile) | React Native + Expo | Code share with web |
| Backend API | Node.js + Fastify OR Go (Fiber) | High concurrency for trades |
| Auth | JWT + refresh tokens + Redis session | Stateless + revocable |
| Primary Database | PostgreSQL 15 | ACID compliance for financial |
| Cache / Pub-Sub | Redis 7 | Trade room real-time, sessions |
| File Storage | AWS S3 (KYC docs) — server-side AES-256 encrypted | Compliance |
| Blockchain | Self-hosted TRON node + ETH node | Avoid third-party dependency |
| Message Queue | BullMQ (Redis) | Async jobs: KYC processing, notifications |
| Websockets | Socket.io / native WS | Real-time trade room, notifications |
| Search | PostgreSQL FTS (sufficient for MVP) → Elasticsearch later | |
| Monitoring | Datadog or Grafana + Prometheus | |
| Infrastructure | AWS or Hetzner (EU/PK region) | Cost-effective |

---

## 3. DATABASE SCHEMA (PostgreSQL)

### 3.1 Users & Authentication

```sql
-- Core user record
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(20) UNIQUE NOT NULL,
  phone_verified  BOOLEAN DEFAULT FALSE,
  email_verified  BOOLEAN DEFAULT FALSE,
  full_name       VARCHAR(255) NOT NULL,
  username        VARCHAR(50) UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            user_role DEFAULT 'user',  -- user, merchant, support, kyc_reviewer, dispute_agent, admin
  status          user_status DEFAULT 'active',  -- active, suspended, banned
  referral_code   VARCHAR(20) UNIQUE,
  referred_by     UUID REFERENCES users(id),
  anti_phishing_code VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Device / session tracking
CREATE TABLE user_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  device_fp       VARCHAR(255),  -- device fingerprint
  ip_address      INET,
  user_agent      TEXT,
  city            VARCHAR(100),
  country_code    CHAR(2),
  token_hash      VARCHAR(255),
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2FA
CREATE TABLE user_2fa (
  user_id         UUID PRIMARY KEY REFERENCES users(id),
  method          VARCHAR(20) DEFAULT 'totp',  -- totp, sms
  secret          TEXT,  -- encrypted TOTP secret
  backup_codes    TEXT[],  -- hashed backup codes
  enabled         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 KYC

```sql
CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'under_review', 'approved', 'rejected', 'resubmit');
CREATE TYPE kyc_level AS ENUM ('none', 'basic', 'full');

CREATE TABLE kyc_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  level           kyc_level DEFAULT 'basic',
  status          kyc_status DEFAULT 'pending',
  cnic_number     VARCHAR(15),  -- encrypted at rest
  cnic_dob        DATE,
  cnic_name       VARCHAR(255),
  cnic_front_url  VARCHAR(512),  -- S3 key, not public URL
  cnic_back_url   VARCHAR(512),
  selfie_url      VARCHAR(512),
  address_proof_url VARCHAR(512),
  liveness_score  DECIMAL(5,4),
  ocr_data        JSONB,  -- extracted data from AI OCR
  sanctions_check VARCHAR(20) DEFAULT 'clear',  -- clear, flagged, review
  reviewer_id     UUID REFERENCES users(id),
  reviewer_notes  TEXT,
  rejection_reason VARCHAR(100),
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ
);

-- Separate limits table per user
CREATE TABLE trading_limits (
  user_id         UUID PRIMARY KEY REFERENCES users(id),
  daily_buy_limit  DECIMAL(15,2) DEFAULT 50000,
  daily_sell_limit DECIMAL(15,2) DEFAULT 50000,
  daily_buy_used   DECIMAL(15,2) DEFAULT 0,
  daily_sell_used  DECIMAL(15,2) DEFAULT 0,
  limit_reset_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Wallets

```sql
CREATE TABLE wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  coin            VARCHAR(10) NOT NULL,  -- USDT, BTC, ETH, USDC
  network         VARCHAR(20),  -- TRC20, ERC20, BEP20, BTC, ETH
  balance         DECIMAL(24,8) DEFAULT 0,  -- available
  locked_balance  DECIMAL(24,8) DEFAULT 0,  -- in escrow
  deposit_address VARCHAR(255),
  UNIQUE (user_id, coin, network)
);

CREATE TABLE wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id       UUID REFERENCES wallets(id),
  user_id         UUID REFERENCES users(id),
  type            VARCHAR(20),  -- deposit, withdrawal, trade_lock, trade_release, fee
  amount          DECIMAL(24,8) NOT NULL,
  coin            VARCHAR(10),
  network         VARCHAR(20),
  tx_hash         VARCHAR(255),  -- blockchain transaction hash
  status          VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, failed
  related_trade_id UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ
);
```

### 3.4 P2P Advertisements

```sql
CREATE TABLE p2p_ads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  side            VARCHAR(4) NOT NULL,  -- buy, sell
  coin            VARCHAR(10) NOT NULL,
  fiat            VARCHAR(3) DEFAULT 'PKR',
  price_type      VARCHAR(10) DEFAULT 'fixed',  -- fixed, floating
  fixed_price     DECIMAL(15,4),
  floating_margin DECIMAL(6,4),  -- e.g. 1.5 = 1.5% above market
  total_amount    DECIMAL(24,8),  -- total crypto available
  min_order_fiat  DECIMAL(15,2),
  max_order_fiat  DECIMAL(15,2),
  payment_methods VARCHAR(30)[],  -- ['jazzcash', 'hbl', 'easypaisa']
  trade_window    INT DEFAULT 15,  -- minutes
  terms           TEXT,
  require_kyc_level kyc_level DEFAULT 'basic',
  require_min_trades INT DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'active',  -- active, paused, completed, deleted
  completed_count INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 Trades (Core Transaction)

```sql
CREATE TYPE trade_status AS ENUM (
  'created', 'escrow_locked', 'payment_pending',
  'payment_claimed', 'releasing', 'completed',
  'cancelled', 'expired', 'disputed', 'resolved'
);

CREATE TABLE trades (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref       VARCHAR(20) UNIQUE NOT NULL,  -- PKS-2026-00472
  ad_id           UUID REFERENCES p2p_ads(id),
  buyer_id        UUID REFERENCES users(id),
  seller_id       UUID REFERENCES users(id),
  coin            VARCHAR(10) NOT NULL,
  coin_amount     DECIMAL(24,8) NOT NULL,  -- crypto
  fiat_amount     DECIMAL(15,2) NOT NULL,  -- PKR
  rate            DECIMAL(15,4) NOT NULL,
  payment_method  VARCHAR(30) NOT NULL,
  payment_details JSONB,  -- snapshot of payment method at trade time
  status          trade_status DEFAULT 'created',
  escrow_locked_at TIMESTAMPTZ,
  payment_claimed_at TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  cancel_reason   VARCHAR(255),
  platform_fee    DECIMAL(24,8),
  buyer_ip        INET,
  seller_ip       INET,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Payment proof uploaded by buyer
CREATE TABLE trade_payment_proofs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id        UUID REFERENCES trades(id),
  uploaded_by     UUID REFERENCES users(id),
  file_url        VARCHAR(512),
  uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Trade chat messages
CREATE TABLE trade_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id        UUID REFERENCES trades(id),
  sender_id       UUID REFERENCES users(id),
  message         TEXT,
  message_type    VARCHAR(20) DEFAULT 'text',  -- text, image, system
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 Disputes

```sql
CREATE TABLE disputes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_ref     VARCHAR(20) UNIQUE NOT NULL,  -- DIS-2026-00088
  trade_id        UUID REFERENCES trades(id),
  opened_by       UUID REFERENCES users(id),
  reason          VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'open',  -- open, under_review, resolved, appealed
  assigned_agent  UUID REFERENCES users(id),
  resolution      VARCHAR(20),  -- release_to_buyer, return_to_seller
  resolution_notes TEXT,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dispute_evidence (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id      UUID REFERENCES disputes(id),
  uploaded_by     UUID REFERENCES users(id),
  file_url        VARCHAR(512),
  description     VARCHAR(255),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dispute_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id      UUID REFERENCES disputes(id),
  sender_id       UUID REFERENCES users(id),
  message         TEXT,
  is_internal     BOOLEAN DEFAULT FALSE,  -- agent-only notes
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.7 Payment Methods

```sql
CREATE TABLE payment_methods (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  type            VARCHAR(20),  -- jazzcash, easypaisa, bank_transfer, nayapay, sadapay
  display_name    VARCHAR(100),
  account_name    VARCHAR(255),
  account_number  VARCHAR(50),  -- encrypted
  iban            VARCHAR(34),  -- encrypted
  bank_name       VARCHAR(100),
  verification_status VARCHAR(20) DEFAULT 'pending',  -- pending, verified, rejected
  verification_doc VARCHAR(512),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.8 Ratings & Reputation

```sql
CREATE TABLE trade_ratings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id        UUID REFERENCES trades(id),
  rater_id        UUID REFERENCES users(id),
  ratee_id        UUID REFERENCES users(id),
  rating          INT CHECK (rating BETWEEN 1 AND 5),
  comment         VARCHAR(500),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (trade_id, rater_id)
);

-- Aggregated stats (updated via trigger or background job)
CREATE TABLE user_trade_stats (
  user_id             UUID PRIMARY KEY REFERENCES users(id),
  total_trades        INT DEFAULT 0,
  completed_trades    INT DEFAULT 0,
  cancelled_trades    INT DEFAULT 0,
  disputed_trades     INT DEFAULT 0,
  avg_rating          DECIMAL(3,2) DEFAULT 0,
  total_ratings       INT DEFAULT 0,
  avg_release_seconds INT DEFAULT 0,  -- for sellers
  is_merchant         BOOLEAN DEFAULT FALSE,
  merchant_since      TIMESTAMPTZ,
  last_online         TIMESTAMPTZ
);
```

### 3.9 Referrals

```sql
CREATE TABLE referral_rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID REFERENCES users(id),
  referred_id     UUID REFERENCES users(id),
  status          VARCHAR(20) DEFAULT 'pending',  -- pending, earned, paid
  reward_amount   DECIMAL(15,2) DEFAULT 500,  -- PKR equivalent
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.10 Platform Risk / Fraud

```sql
CREATE TABLE risk_flags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  flag_type       VARCHAR(50),  -- cancelled_trades_spike, dispute_rate_high, duplicate_cnic, etc.
  severity        VARCHAR(10),  -- low, medium, high
  details         JSONB,
  reviewed        BOOLEAN DEFAULT FALSE,
  reviewed_by     UUID REFERENCES users(id),
  action_taken    VARCHAR(50),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. KEY API ENDPOINTS

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/verify-otp
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/2fa/setup
POST /api/auth/2fa/verify
```

### KYC
```
POST /api/kyc/submit
GET  /api/kyc/status
POST /api/kyc/resubmit
```

### Marketplace
```
GET  /api/marketplace/ads          # query: coin, side, paymentMethod, amount
GET  /api/marketplace/ads/:id
GET  /api/marketplace/rate/:coin   # current market rate
```

### P2P Ads (Merchant)
```
GET    /api/ads                    # my ads
POST   /api/ads                    # create
PATCH  /api/ads/:id                # update
DELETE /api/ads/:id
PATCH  /api/ads/:id/pause
PATCH  /api/ads/:id/activate
```

### Trades
```
POST   /api/trades                 # initiate trade from ad
GET    /api/trades/:id             # trade room data
POST   /api/trades/:id/confirm-payment   # buyer confirms payment
POST   /api/trades/:id/release          # seller releases escrow
POST   /api/trades/:id/cancel
POST   /api/trades/:id/extend-timer
GET    /api/trades                 # trade history
```

### Disputes
```
POST   /api/disputes               # open dispute
GET    /api/disputes/:id
POST   /api/disputes/:id/message
POST   /api/disputes/:id/evidence
```

### Wallet
```
GET    /api/wallet
GET    /api/wallet/address/:coin/:network
POST   /api/wallet/withdraw
GET    /api/wallet/transactions
```

### Admin
```
GET    /api/admin/dashboard/stats
GET    /api/admin/kyc/queue
POST   /api/admin/kyc/:submissionId/approve
POST   /api/admin/kyc/:submissionId/reject
GET    /api/admin/disputes/queue
POST   /api/admin/disputes/:id/resolve
GET    /api/admin/fraud/flags
POST   /api/admin/users/:id/suspend
```

---

## 5. REAL-TIME TRADE ROOM (WebSocket Events)

```
# Client subscribes to trade channel: ws://api/trades/:tradeId

Server → Client events:
  trade:status_update   { status, timestamp }
  trade:timer_update    { remaining_seconds }
  trade:message         { sender, message, timestamp }
  trade:payment_claimed { uploaded_proof_url }
  trade:released        { tx_hash, amount }
  trade:disputed        { dispute_id }
  trade:cancelled       { reason }

Client → Server events:
  trade:send_message    { message }
  trade:typing          {}
```

---

## 6. ESCROW MECHANISM (Technical)

```
When trade created:
1. Check seller's wallet: available_balance >= coin_amount
2. BEGIN TRANSACTION
3. UPDATE wallets SET balance = balance - coin_amount,
                      locked_balance = locked_balance + coin_amount
   WHERE user_id = seller_id AND coin = coin
4. INSERT INTO trades (status = 'escrow_locked')
5. INSERT INTO wallet_transactions (type = 'trade_lock')
6. COMMIT
7. Start trade timer (Redis TTL + DB expires_at)

When seller releases:
1. BEGIN TRANSACTION
2. UPDATE wallets SET locked_balance = locked_balance - coin_amount,
   WHERE user_id = seller_id  (locked decremented)
3. UPDATE wallets SET balance = balance + (coin_amount - platform_fee)
   WHERE user_id = buyer_id   (buyer receives)
4. UPDATE wallets SET balance = balance + platform_fee
   WHERE user_id = platform_wallet_id  (fee collected)
5. UPDATE trades SET status = 'completed'
6. INSERT INTO wallet_transactions x3
7. COMMIT

On trade expire/cancel:
1. BEGIN TRANSACTION
2. UPDATE wallets SET balance = balance + coin_amount,
                      locked_balance = locked_balance - coin_amount
   WHERE user_id = seller_id
3. UPDATE trades SET status = 'expired'/'cancelled'
4. COMMIT
```

All escrow operations use PostgreSQL transactions to ensure atomicity. No crypto leaves the platform during P2P — it's an internal ledger movement.

---

## 7. BLOCKCHAIN INTEGRATION (Deposits / Withdrawals / P2P Escrow)

### 7.1 User Wallet Deposit Flow

HD wallet derivation: `m/44'/{coin}'/{account}'/0/{user_index}` (BIP-44).  
Each user gets one unique deposit address per coin/network, generated at registration.

**Confirmation thresholds before crediting balance:**

| Asset | Network | Required Confs |
|-------|---------|---------------|
| USDT  | TRC20   | 20 |
| USDT  | BEP20   | 15 |
| USDT  | ERC20   | 12 |
| USDC  | ERC20   | 12 |
| BTC   | Bitcoin | 3  |
| ETH   | ERC20   | 12 |
| SOL   | Solana  | 32 |
| BNB   | BEP20   | 15 |

**Deposit state machine:** `watching → detected → pending_confirmations → confirmed → credited | expired`

```
Flow:
1. User requests deposit address → HD derive or return cached
2. Add address to Redis SET per chain (O(1) lookup)
3. Block listener fires on Transfer event → match Redis SET
4. INSERT wallet_transactions (status=pending_confirmations, confs_seen=0)
5. Each new block → UPDATE confs_seen++
6. confs_seen >= required_confs → UPDATE wallets SET balance += amount, status=confirmed
7. Push notification to user
```

### 7.2 Blockchain Monitors (per chain)

| Chain | Method | Tool |
|-------|--------|------|
| EVM (ETH/BSC/AVAX/OP/ARB) | `ethers.js` block subscriber + `Transfer` event filter | Infura/Alchemy (ETH), Ankr/QuickNode (BSC) |
| TRON | TronGrid HTTP polling every 3 s | TronGrid API |
| Solana | Helius WebSocket `accountSubscribe` | Helius |
| Bitcoin | BlockCypher webhooks | BlockCypher |

All monitors publish deposit events to BullMQ queue `deposit-events`. Worker validates: correct token contract, no duplicate TX hash, amount >= minimum, address in watch-list.

### 7.3 P2P Escrow — Seller Deposit (Internal Ledger Only)

P2P escrow is a **pure ledger operation** — no on-chain transaction occurs when a seller lists or accepts a trade. The seller's crypto never moves to a separate on-chain escrow address; it is locked inside the PostgreSQL wallet table.

```sql
-- Seller posts trade / accepts order → lock balance
BEGIN;
  SELECT id, balance, locked_balance FROM wallets
    WHERE user_id = $seller_id AND coin = $coin FOR UPDATE;
  -- Verify balance >= trade_amount
  UPDATE wallets
    SET balance        = balance        - $trade_amount,
        locked_balance = locked_balance + $trade_amount
    WHERE user_id = $seller_id AND coin = $coin;
  INSERT INTO escrow_locks (trade_id, seller_id, coin, amount, locked_at)
    VALUES ($trade_id, $seller_id, $coin, $trade_amount, NOW());
COMMIT;
```

### 7.4 P2P Escrow Release (Two-Layer Verification Complete)

Release is only executed after **both** Layer 1 (AI scan) and Layer 2 (admin manual approval) are confirmed. No partial or automatic release.

```sql
-- Admin triggers release after Layer 2 approval
BEGIN;
  -- Debit seller locked balance
  UPDATE wallets
    SET locked_balance = locked_balance - $trade_amount
    WHERE user_id = $seller_id AND coin = $coin;
  -- Credit buyer (net of platform fee)
  UPDATE wallets
    SET balance = balance + ($trade_amount - $platform_fee)
    WHERE user_id = $buyer_id AND coin = $coin;
  -- Collect platform fee
  UPDATE wallets
    SET balance = balance + $platform_fee
    WHERE user_id = $platform_fee_account_id AND coin = $coin;
  -- Close escrow lock
  UPDATE escrow_locks SET status = 'released', released_at = NOW()
    WHERE trade_id = $trade_id;
  UPDATE trades SET status = 'completed', completed_at = NOW()
    WHERE id = $trade_id;
COMMIT;
```

### 7.5 P2P Escrow Cancellation / Refund

```sql
BEGIN;
  UPDATE wallets
    SET balance        = balance        + $trade_amount,
        locked_balance = locked_balance - $trade_amount
    WHERE user_id = $seller_id AND coin = $coin;
  UPDATE escrow_locks SET status = 'refunded', released_at = NOW()
    WHERE trade_id = $trade_id;
  UPDATE trades SET status = 'cancelled', cancelled_at = NOW()
    WHERE id = $trade_id;
COMMIT;
```

### 7.6 Withdrawal Flow

```
1. User submits withdrawal request (2FA required)
2. Check: available_balance >= amount + network_fee
3. INSERT withdrawals (status=pending)
4. OFAC / sanctions address check
5. For amounts > 100 000 PKR equivalent → goes to admin Layer 2 review queue
6. Admin approves → triggers signing service (admin-authenticated call only)
7. Signing service signs & broadcasts transaction
8. Webhook / polling updates status: pending → processing → confirmed
```

### 7.7 Hot / Warm / Cold Wallet Split

| Tier | % of Assets | Purpose |
|------|------------|---------|
| Hot  | 20% | Instant withdrawals, Instant Buy payouts |
| Warm | 30% | Same-day withdrawals, replenish hot |
| Cold | 50% | Long-term storage, hardware/multi-sig |

Auto-sweep alert fires when hot wallet drops below 15% of 24 h withdrawal volume — triggers warm→hot top-up via signing service (admin-initiated).
