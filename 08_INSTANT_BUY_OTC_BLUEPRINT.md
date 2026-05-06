# INSTANT BUY / OTC FEATURE — FULL BLUEPRINT
## PakSwap: Direct Crypto Purchase with PKR or USDT

> **Feature Name:** Instant Buy / OTC Desk
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Pre-Development

---

## TABLE OF CONTENTS

1. [Feature Overview](#1-feature-overview)
2. [How It Differs from P2P Marketplace](#2-how-it-differs-from-p2p-marketplace)
3. [Supported Tokens and Networks](#3-supported-tokens-and-networks)
4. [Wallet Address Rules Per Token](#4-wallet-address-rules-per-token)
5. [Full User Flow — PKR Payment](#5-full-user-flow--pkr-payment)
6. [Full User Flow — USDT Payment](#6-full-user-flow--usdt-payment)
7. [Pricing and Fee Engine](#7-pricing-and-fee-engine)
8. [Liquidity Architecture](#8-liquidity-architecture)
9. [Provider Model — Platform vs Merchant](#9-provider-model--platform-vs-merchant)
10. [Apply to Become a Provider](#10-apply-to-become-a-provider)
11. [Backend Architecture](#11-backend-architecture)
12. [Database Schema](#12-database-schema)
13. [AI + Manual Payment Verification](#13-ai--manual-payment-verification)
14. [Security and Fraud Controls](#14-security-and-fraud-controls)
15. [Admin Tooling](#15-admin-tooling)
16. [All Required Pages and UX](#16-all-required-pages-and-ux)
17. [MVP vs Future Roadmap](#17-mvp-vs-future-roadmap)
18. [Implementation Prompt for Developers](#18-implementation-prompt-for-developers)

---

## 1. FEATURE OVERVIEW

Instant Buy is a **fixed-price OTC desk** built directly into PakSwap. Unlike the P2P marketplace where users negotiate with other users, Instant Buy means:

- Platform (or an approved merchant/provider) holds a crypto inventory
- User picks a token, enters amount, gets an instant quote
- User pays with PKR (bank/JazzCash) or USDT
- After payment is verified, token is automatically released to user's wallet

**Think of it like:** Buying crypto at a fixed exchange counter, not haggling in a bazaar.

### Key Properties

| Property | Value |
|---|---|
| Price type | Fixed quote (locked for 10 minutes) |
| Settlement | Automatic after payment verification |
| Who provides inventory | Platform (MVP), approved merchants (Phase 2) |
| Payment methods (PKR) | JazzCash, Easypaisa, Bank Transfer |
| Payment method (crypto) | USDT (TRC-20 / BEP-20) deposited to platform wallet |
| Wallet validation | Token-specific — only correct network addresses accepted |

---

## 2. HOW IT DIFFERS FROM P2P MARKETPLACE

| Aspect | P2P Marketplace | Instant Buy / OTC |
|---|---|---|
| Who you buy from | Another user (seller) | Platform or approved provider |
| Price | Negotiated / market | Fixed quote from platform |
| Speed | 5-30 minutes (human on other side) | 2-10 minutes (automated) |
| Payment verification | Seller manually confirms | AI + admin verifies, auto-release |
| Dispute possibility | Yes (seller can dispute) | Lower — no counterparty |
| Tokens available | Only what sellers list | Platform-controlled inventory |
| Best for | Larger trades, better rates | Quick, convenient, beginner-friendly |

---

## 3. SUPPORTED TOKENS AND NETWORKS

### MVP Tokens

| Token | Network | Priority |
|---|---|---|
| BNB | BSC (BEP-20) | MVP |
| ETH | Ethereum (ERC-20) | MVP |
| SOL | Solana | MVP |
| TON | TON Network | MVP |
| BTC | Bitcoin | MVP |
| USDT | TRC-20 / BEP-20 (for USDT-to-token swaps) | MVP |

### Phase 2 Tokens

| Token | Network |
|---|---|
| MATIC / POL | Polygon |
| TRX | TRON |
| AVAX | Avalanche C-Chain |
| DOT | Polkadot |
| ADA | Cardano |
| XRP | Ripple |

### Admin Configuration Per Token

Each token can be individually:
- Enabled or disabled
- Given min/max order size limits
- Assigned a specific hot wallet address for payouts
- Assigned a pricing oracle source
- Given a custom spread/markup percentage
- Given a fixed fee (flat fee on top of spread)

---

## 4. WALLET ADDRESS RULES PER TOKEN

This is critical. Each blockchain has its own address format. Accepting a wrong-network address means funds are permanently lost. The system must **strictly validate** the address format before accepting an order.

### Validation Rules

| Token | Network | Address Format | Validation Rule |
|---|---|---|---|
| BNB | BSC (BEP-20) | 0x + 40 hex chars | Must start with `0x`, length 42, valid EVM checksum |
| ETH | Ethereum | 0x + 40 hex chars | Same as BNB — EVM checksum validation |
| SOL | Solana | Base58, 32-44 chars | Base58 decode must succeed, length 32-44 |
| TON | TON Network | Starts with `EQ` or `UQ`, base64url, 48 chars | Must start with `EQ` or `UQ`, length exactly 48 |
| BTC | Bitcoin | Starts with `1`, `3`, or `bc1` | Bech32 or legacy format validation |
| TRX | TRON | Starts with `T`, 34 chars | Base58Check, starts with `T` |

### TON Address — Special Rules

TON is the most commonly confused because users may paste:
- An EVM address (wrong — will reject)
- A TRON address (wrong — will reject)
- A TON testnet address (wrong — must be mainnet)
- A raw TON address instead of user-friendly format

**Platform behavior for TON:**
```
1. Show clear label: "TON Wallet Address (starts with EQ or UQ)"
2. Show example: "EQD2j4B9rDfSFBl4mfVBP8w2dJXmK..."
3. Validate in real-time as user types
4. Reject immediately with message if format is wrong:
   "This does not look like a TON address.
    TON addresses start with EQ or UQ and are 48 characters long.
    Example: EQD2j4B9rDfSFBl4mfVBP8w2dJXmK..."
5. Show supported wallets: TON Wallet, Tonkeeper, MyTonWallet, Telegram Wallet
6. Do NOT accept raw hex or other formats
7. Verify address is not a contract address (basic check)
```

### UX for Address Input

```
For every token, show:
- Token logo and name
- Network name (e.g., "TON Network", "Binance Smart Chain")
- Address format hint
- Real-time validation with green check / red X
- Warning: "Double-check your address. Wrong address = permanent loss of funds."
- Optional: QR code scanner for mobile users
```

---

## 5. FULL USER FLOW — PKR PAYMENT

### Step-by-Step

```
Step 1: SELECT TOKEN
- User opens Instant Buy page
- Sees grid of supported tokens with current PKR price
- Clicks token they want to buy (e.g., SOL)

Step 2: ENTER AMOUNT
- User enters either:
  Option A: PKR amount they want to spend (e.g., 10,000 PKR)
  Option B: Token amount they want to receive (e.g., 0.5 SOL)
- Platform shows real-time quote:
  "You pay: 10,000 PKR"
  "You receive: 0.489 SOL"
  "Rate: 1 SOL = 20,450 PKR"
  "Platform fee: 350 PKR (3.5%)"
  "Quote valid for: 10:00 minutes"

Step 3: ENTER WALLET ADDRESS
- Input field labeled specifically for the token
- Real-time address validation
- Warning about wrong address = permanent loss

Step 4: REVIEW AND CONFIRM
- Summary screen:
  Token: SOL
  Amount: 0.489 SOL
  You pay: 10,000 PKR
  Rate: 20,450 PKR/SOL
  Fee: 350 PKR
  Destination: [SOL address]
  Provider: PakSwap Official
  Quote expires: 09:47
- Confirm button → locks the quote

Step 5: PAYMENT INSTRUCTIONS
- Platform shows payment details:
  Pay to: [Provider's JazzCash / bank]
  Account: [Name]
  Amount: EXACTLY 10,000 PKR
  Reference: [Order ID — user must include this]
- Timer shown: quote expires in X minutes
- Upload screenshot button

Step 6: UPLOAD PAYMENT PROOF
- User sends PKR via JazzCash/Easypaisa/bank
- Uploads screenshot of payment
- Clicks "I have paid"

Step 7: VERIFICATION
- AI scans screenshot:
  Checks amount paid = 10,000 PKR
  Checks recipient name matches provider account
  Checks timestamp is within order window
  Checks sender name matches user's KYC name
- If AI confidence > 90%: auto-approve → go to Step 8
- If AI confidence 70-90%: flag for manual admin review (SLA: 30 minutes)
- If AI detects manipulation: auto-reject, order cancelled

Step 8: TOKEN RELEASED
- Platform/provider releases SOL from hot wallet
- Sends to user's provided SOL address
- Transaction ID shown to user
- Order marked complete
- User sees confirmation: "0.489 SOL sent to your wallet"
- SMS/email notification sent

Step 9: ORDER HISTORY
- Order saved in user's purchase history
- User can click to view blockchain explorer link
```

### Edge Cases

| Scenario | Handling |
|---|---|
| User pays wrong amount | AI detects mismatch → admin reviews → user contacted to pay difference or receive refund |
| Quote expires before user pays | Order cancelled, no funds taken. User must start new order |
| Blockchain congestion (slow release) | Status shows "Pending confirmation" — user can track. SLA: 30 minutes max |
| User provides wrong wallet address | Warning shown prominently before confirmation. Once confirmed and released, platform is not liable (stated in ToS) |
| Payment proof is clearly fake | AI rejects, order cancelled, account risk flag +20 points |

---

## 6. FULL USER FLOW — USDT PAYMENT

### Step-by-Step

```
Step 1: SELECT TOKEN
- User selects token (e.g., BNB)
- Selects payment method: "Pay with USDT"

Step 2: ENTER AMOUNT
- User enters USDT amount to spend
- Platform shows quote:
  "You pay: 50 USDT"
  "You receive: 0.0812 BNB"
  "Rate: 1 BNB = 616 USDT"
  "Platform fee: 0.75 USDT (1.5%)"
  "Quote valid for: 10 minutes"

Step 3: ENTER BNB WALLET ADDRESS
- Validated against BEP-20 format (0x...)

Step 4: REVIEW AND CONFIRM
- Summary as above

Step 5: SEND USDT
- Platform shows its USDT deposit address:
  Network: TRC-20 (or BEP-20 — user's choice)
  Address: [Platform hot wallet USDT address]
  Amount: EXACTLY 50 USDT
  Memo/tag if required
- Warning: "Send ONLY on the selected network. Other networks = lost funds."
- QR code shown

Step 6: BLOCKCHAIN CONFIRMATION (AUTOMATIC)
- Platform's blockchain listener watches the deposit address
- Detects incoming USDT transaction
- Waits for N confirmations:
  TRC-20: 19 confirmations (~1 minute)
  BEP-20: 15 confirmations (~45 seconds)
- Verifies:
  Amount received = expected USDT
  Transaction is confirmed on chain
  Sender address is not sanctioned

Step 7: AUTO-RELEASE TOKEN
- No human review needed for USDT (blockchain is the proof)
- Platform releases BNB from its BNB hot wallet
- Sends to user's provided BNB address
- Order confirmed

Step 8: CONFIRMATION
- Transaction hash shown
- "0.0812 BNB sent — TX: 0x1234..."
- Blockchain explorer link
- SMS/email notification
```

### USDT Flow Advantages

- Faster than PKR (no screenshot verification needed)
- Fully automated — no admin intervention
- Lower fraud risk (blockchain is immutable proof)
- Should have slightly lower fees than PKR path (less manual work)

---

## 7. PRICING AND FEE ENGINE

### Price Sources (Oracles)

The platform pulls live market prices from multiple sources and uses a weighted average:

| Source | Weight | Reason |
|---|---|---|
| Binance Spot API | 40% | Highest liquidity, most accurate |
| CoinGecko API | 30% | Free, widely trusted |
| CoinMarketCap API | 30% | Secondary verification |

**Price calculation:**
```
market_price = weighted_average(binance_price, coingecko_price, cmc_price)
```

If any source is unavailable, redistribute weight to remaining sources.
If all sources unavailable, disable Instant Buy temporarily (show "Service temporarily unavailable").

### PKR Rate Calculation

```
pkr_usd_rate = pulled from:
  - SBP open market rate (if available via API)
  - Wise.com rate
  - Weighted average of P2P marketplace USDT/PKR trades on our own platform

pkr_price_of_token = token_usd_price × pkr_usd_rate
```

### Fee Structure

| Fee Type | Description | Configurable |
|---|---|---|
| Spread markup | % added on top of market price (platform profit) | Yes, per token |
| Fixed flat fee (PKR) | Fixed PKR amount added to every PKR order | Yes, per token |
| Fixed flat fee (USDT) | Fixed USDT deducted from every USDT order | Yes, per token |
| Network/gas fee | Estimated blockchain fee for sending the token out | Auto-calculated |

**Example fee breakdown:**

```
Token: SOL
Market price: 19,850 PKR/SOL
Spread markup: 3% → 595 PKR added
Flat fee: 50 PKR
Network fee: ~20 PKR estimated gas

User pays: (19,850 + 595 + 50 + 20) = 20,515 PKR per SOL
Platform profit per order of 1 SOL: 595 + 50 = 645 PKR
```

### Quote Locking

- Quote is locked for **10 minutes** after user confirms
- If market moves more than **2% against platform** during those 10 minutes: platform can cancel order and offer fresh quote
- If market moves in platform's favour: platform keeps the extra (platform's risk is one-sided downward)
- Quote ID is stored in DB with timestamp and locked rates

### Admin Override Pricing

Admin can at any time:
- Set a manual fixed PKR/USDT price for any token (overrides oracle)
- Set a price floor (platform will not sell below this price)
- Set a price ceiling (platform will not sell above this price)
- Pause pricing for a specific token

---

## 8. LIQUIDITY ARCHITECTURE

### How Inventory Works

The platform (or provider) must hold actual tokens in a hot wallet to fulfill orders.

```
Provider (Platform or Merchant)
  └── Hot Wallet (per token, per network)
        ├── Available balance (can fulfill new orders)
        ├── Reserved balance (locked for pending orders)
        └── Threshold alerts (notify admin when balance is low)
```

### Platform-Owned Liquidity (MVP)

At MVP, only the platform provides inventory:

```
PakSwap owns:
  - A BNB hot wallet (BSC)
  - An ETH hot wallet (Ethereum)
  - A SOL hot wallet (Solana)
  - A TON hot wallet (TON Network)
  - A BTC hot wallet (Bitcoin)
  - A USDT receiving wallet (TRC-20 + BEP-20)

Platform acquires inventory by:
  1. Buying crypto from P2P marketplace at competitive rate
  2. Buying from external exchanges (Binance, Bybit)
  3. Converting user PKR payments → buying more crypto to replenish

Inventory management:
  - Min threshold per token: configurable in admin panel
  - Alert when balance falls below threshold
  - Auto-disable token when balance hits zero
```

### Cold vs Hot Wallet Split

| Wallet Type | % of Inventory | Purpose |
|---|---|---|
| Hot wallet (online) | 20% | Fulfill daily order volume |
| Warm wallet (semi-offline) | 30% | Refill hot wallet when needed |
| Cold wallet (offline) | 50% | Long-term inventory storage |

### Inventory Monitoring

- Real-time balance shown in admin panel
- Alerts: email + SMS + Telegram to admin when hot wallet hits 25% of daily volume
- Daily report: inventory levels, orders fulfilled, remaining capacity

---

## 9. PROVIDER MODEL — PLATFORM VS MERCHANT

### MVP: Platform Only

At launch, the platform is the sole provider. This simplifies operations and builds trust.

### Phase 2: Approved Merchant Providers

Third-party merchants can apply to provide liquidity for Instant Buy. This turns PakSwap into a marketplace of liquidity providers.

**How it works:**

```
Merchant Provider applies → Admin reviews → Approved
Merchant deposits their crypto into their provider wallet on platform
Merchant sets their own price (within platform limits) and fees
Merchant's listing appears alongside platform's listing in Instant Buy
User can choose: buy from PakSwap (trusted, slightly higher fee) or approved merchant (potentially better rate)
```

**Provider comparison view for users:**

```
Token: SOL

Provider          Rate (PKR)   Fee    Reputation    Availability
-----------------------------------------------------------------
PakSwap Official  20,515       3.5%   ★★★★★          In stock
Ali Traders       20,300       2.8%   ★★★★☆ (98%)   In stock
FastCrypto PK     20,450       3.2%   ★★★★★ (99%)   In stock
```

### Provider Requirements (Phase 2)

| Requirement | Detail |
|---|---|
| Minimum inventory | 500 USDT equivalent to list |
| KYC | Full business KYC (CNIC + business registration) |
| Reputation | Minimum 100 completed Instant Buy orders before public listing |
| Dispute rate | Must stay below 2% of orders |
| Response SLA | Must process PKR orders within 30 minutes |
| Platform fee | Provider pays platform 0.5% of each order fulfilled |

---

## 10. APPLY TO BECOME A PROVIDER

An "Apply to Become a Provider" form is available from day one even though merchant providers won't be active until Phase 2. This serves as:

- **Market research** — know how many people want to participate
- **Waitlist building** — reach out to approved providers first when feature launches
- **Trust signal** — shows platform is planning to grow

### Application Form Fields

```
1. Full name
2. CNIC number
3. Business name (optional)
4. City (Karachi / Lahore / Islamabad / Other)
5. Tokens you want to provide liquidity for (checkboxes)
6. Estimated daily volume you can support (PKR)
7. How long have you been trading crypto? (dropdown)
8. Current platforms you use (Binance, Bybit, local exchange, etc.)
9. Telegram username (for communication)
10. Why do you want to be a provider? (text)
11. Any questions or comments?
```

### Application Status Flow

```
submitted → under_review → approved / rejected / waitlisted
```

Admin sees all applications in a dedicated panel with approve/reject/waitlist actions.
Approved applications are contacted directly and onboarded when Phase 2 launches.

---

## 11. BACKEND ARCHITECTURE

### New Services Required

```
Instant Buy Service
  ├── Quote Engine         — Fetch prices, calculate fees, lock quotes
  ├── Order Manager        — Create, track, fulfill, cancel orders
  ├── Payment Verifier     — AI + manual verification for PKR proofs
  ├── Blockchain Watcher   — Monitor deposit addresses for USDT payments
  ├── Token Releaser       — Send tokens from hot wallet after verification
  ├── Inventory Manager    — Track balances, send low-stock alerts
  └── Provider Manager     — Manage platform and merchant provider configs
```

### Quote Engine Flow

```
1. Receive request: { token: 'SOL', pay_currency: 'PKR', pay_amount: 10000 }
2. Fetch market price from oracles (with fallback logic)
3. Apply spread markup (from DB config for this token)
4. Add flat fees
5. Calculate estimated gas fee for payout
6. Return quote:
   {
     quote_id: uuid,
     token: 'SOL',
     token_amount: 0.489,
     pay_amount: 10000,
     rate: 20450,
     fee_breakdown: { spread: 595, flat_fee: 50, gas_estimate: 20 },
     provider_id: 'pakswap_official',
     expires_at: now + 10 minutes,
     locked: false
   }
7. Quote stored in Redis with 10-minute TTL
8. When user confirms, quote marked as locked in DB
```

### Order State Machine

```
created
  → payment_pending   (user has confirmed, awaiting payment)
  → payment_uploaded  (user uploaded proof, awaiting verification)
  → payment_verified  (AI/admin approved payment)
  → releasing         (token being sent from hot wallet)
  → completed         (token delivered, tx confirmed)
  → cancelled         (expired, rejected, or user cancelled)
  → disputed          (payment verified but token not received — rare)
  → refunded          (payment confirmed but token could not be sent)
```

### Blockchain Watcher (for USDT orders)

```
For each pending USDT order:
  1. Monitor the platform's deposit address on the correct network
  2. Listen for incoming transactions via WebSocket / polling
  3. On detection: verify amount, verify sender not sanctioned
  4. Wait for required confirmations (TRC-20: 19, BEP-20: 15)
  5. Mark order as payment_verified
  6. Trigger token release job

Implementation:
  - TRON: Use TRON HTTP API (free, no node needed for monitoring)
  - BSC: Use BSC RPC WebSocket or QuickNode
  - Each pending order has a unique deposit address (or sub-address via memo)
  - Alternatively: one deposit address per network with order ID as memo
```

### Token Releaser (Hot Wallet Sender)

```
For each verified order:
  1. Pull provider's hot wallet private key from secure vault (HashiCorp Vault or AWS KMS)
  2. Build transaction:
     from: hot_wallet_address
     to: user_provided_address
     amount: token_amount (after fee deduction)
     gas: auto-estimated
  3. Sign and broadcast transaction
  4. Store transaction hash
  5. Poll for confirmation
  6. Mark order as completed
  7. Trigger notifications to user

Security:
  - Private keys NEVER stored in DB — only in secure vault
  - Signing happens server-side in isolated signing service
  - Amount validated before signing (cannot exceed order amount)
  - Double-spend check: order can only trigger one release
```

---

## 12. DATABASE SCHEMA

### Table: instant_buy_tokens

```sql
CREATE TABLE instant_buy_tokens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol            VARCHAR(20) NOT NULL,          -- 'SOL', 'BNB', 'ETH', 'TON', 'BTC'
  name              VARCHAR(100) NOT NULL,          -- 'Solana', 'BNB', etc.
  network           VARCHAR(50) NOT NULL,           -- 'solana', 'bsc', 'ethereum', 'ton', 'bitcoin'
  contract_address  VARCHAR(200),                  -- null for native coins
  decimals          INTEGER NOT NULL DEFAULT 18,
  address_regex     VARCHAR(500),                  -- regex for address validation
  address_hint      TEXT,                          -- shown to user: "Starts with EQ or UQ, 48 chars"
  address_example   VARCHAR(200),                  -- example address for UX
  logo_url          TEXT,
  is_active         BOOLEAN DEFAULT true,
  min_order_pkr     DECIMAL(18,2) DEFAULT 500,
  max_order_pkr     DECIMAL(18,2) DEFAULT 500000,
  min_order_usdt    DECIMAL(18,8) DEFAULT 2,
  max_order_usdt    DECIMAL(18,8) DEFAULT 2000,
  spread_percent    DECIMAL(5,2) DEFAULT 3.00,     -- platform markup %
  flat_fee_pkr      DECIMAL(18,2) DEFAULT 0,
  flat_fee_usdt     DECIMAL(18,8) DEFAULT 0,
  pkr_enabled       BOOLEAN DEFAULT true,
  usdt_enabled      BOOLEAN DEFAULT true,
  sort_order        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_providers

```sql
CREATE TABLE instant_buy_providers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type              VARCHAR(20) NOT NULL,           -- 'platform', 'merchant'
  name              VARCHAR(100) NOT NULL,          -- 'PakSwap Official', 'Ali Traders'
  user_id           UUID REFERENCES users(id),      -- null for platform
  is_active         BOOLEAN DEFAULT true,
  is_verified       BOOLEAN DEFAULT false,
  reputation_score  DECIMAL(3,2) DEFAULT 5.00,
  total_orders      INTEGER DEFAULT 0,
  dispute_rate      DECIMAL(5,2) DEFAULT 0,
  platform_fee_pct  DECIMAL(5,2) DEFAULT 0.50,    -- fee platform takes from merchant per order
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_provider_wallets

```sql
CREATE TABLE instant_buy_provider_wallets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID REFERENCES instant_buy_providers(id),
  token_id          UUID REFERENCES instant_buy_tokens(id),
  wallet_address    VARCHAR(200) NOT NULL,          -- hot wallet address (payout address)
  deposit_address   VARCHAR(200),                  -- for USDT: address users send USDT to
  available_balance DECIMAL(30,10) DEFAULT 0,
  reserved_balance  DECIMAL(30,10) DEFAULT 0,      -- locked for pending orders
  low_balance_alert DECIMAL(30,10) DEFAULT 0,      -- alert threshold
  last_updated      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, token_id)
);
```

### Table: instant_buy_quotes

```sql
CREATE TABLE instant_buy_quotes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  token_id          UUID REFERENCES instant_buy_tokens(id),
  provider_id       UUID REFERENCES instant_buy_providers(id),
  pay_currency      VARCHAR(10) NOT NULL,           -- 'PKR' or 'USDT'
  pay_amount        DECIMAL(18,2) NOT NULL,
  token_amount      DECIMAL(30,10) NOT NULL,
  rate_pkr          DECIMAL(18,2),                 -- PKR per token at time of quote
  rate_usdt         DECIMAL(18,8),                 -- USDT per token at time of quote
  spread_pct        DECIMAL(5,2),
  fee_flat          DECIMAL(18,8),
  fee_gas_estimate  DECIMAL(18,8),
  oracle_sources    JSONB,                         -- prices from each oracle at quote time
  is_locked         BOOLEAN DEFAULT false,
  locked_at         TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_orders

```sql
CREATE TABLE instant_buy_orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref             VARCHAR(20) UNIQUE NOT NULL,  -- human-readable: IBO-2026-004521
  user_id               UUID REFERENCES users(id),
  quote_id              UUID REFERENCES instant_buy_quotes(id),
  provider_id           UUID REFERENCES instant_buy_providers(id),
  token_id              UUID REFERENCES instant_buy_tokens(id),
  pay_currency          VARCHAR(10) NOT NULL,
  pay_amount            DECIMAL(18,2) NOT NULL,
  token_amount          DECIMAL(30,10) NOT NULL,
  destination_address   VARCHAR(200) NOT NULL,         -- user's wallet address for payout
  destination_network   VARCHAR(50) NOT NULL,
  status                VARCHAR(30) DEFAULT 'created',
  payment_method        VARCHAR(50),                  -- 'jazzcash', 'easypaisa', 'bank', 'usdt_trc20', 'usdt_bep20'
  payment_proof_url     TEXT,
  payment_verified_at   TIMESTAMPTZ,
  payment_verifier      VARCHAR(20),                 -- 'ai', 'admin', 'blockchain'
  payout_tx_hash        VARCHAR(200),
  payout_confirmed_at   TIMESTAMPTZ,
  fee_collected         DECIMAL(18,8),
  provider_fee_collected DECIMAL(18,8),
  cancelled_reason      TEXT,
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_payment_verifications

```sql
CREATE TABLE instant_buy_payment_verifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID REFERENCES instant_buy_orders(id),
  proof_image_url   TEXT,
  ai_extracted      JSONB,    -- { sender_name, recipient, amount, timestamp, reference_no }
  expected_amount   DECIMAL(18,2),
  extracted_amount  DECIMAL(18,2),
  amount_match      BOOLEAN,
  name_match        BOOLEAN,
  timestamp_valid   BOOLEAN,
  manipulation_flag BOOLEAN DEFAULT false,
  ai_confidence     DECIMAL(5,2),
  ai_verdict        VARCHAR(20),   -- 'approved', 'rejected', 'manual_review'
  admin_reviewed_by UUID REFERENCES users(id),
  admin_verdict     VARCHAR(20),
  admin_notes       TEXT,
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_provider_applications

```sql
CREATE TABLE instant_buy_provider_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         VARCHAR(200) NOT NULL,
  cnic              VARCHAR(15) NOT NULL,
  business_name     VARCHAR(200),
  city              VARCHAR(100),
  tokens_wanted     JSONB,          -- array of token symbols
  estimated_daily_volume DECIMAL(18,2),
  trading_experience VARCHAR(50),
  current_platforms TEXT,
  telegram_username VARCHAR(100),
  motivation        TEXT,
  comments          TEXT,
  status            VARCHAR(20) DEFAULT 'submitted',   -- submitted, under_review, approved, rejected, waitlisted
  admin_notes       TEXT,
  reviewed_by       UUID REFERENCES users(id),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: instant_buy_inventory_alerts

```sql
CREATE TABLE instant_buy_inventory_alerts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID REFERENCES instant_buy_providers(id),
  token_id          UUID REFERENCES instant_buy_tokens(id),
  alert_type        VARCHAR(50),    -- 'low_balance', 'zero_balance', 'oracle_failure'
  current_balance   DECIMAL(30,10),
  threshold         DECIMAL(30,10),
  notified_at       TIMESTAMPTZ DEFAULT NOW(),
  resolved_at       TIMESTAMPTZ
);
```

---

## 13. AI + MANUAL PAYMENT VERIFICATION

### Verification Decision Tree (PKR Orders)

```
User uploads payment screenshot
          |
          v
    AI Scanner runs
          |
    +-----+------+
    |            |
 Confidence   Confidence
  >= 90%       < 90%
    |            |
    v            v
 Auto-         Flag for
 Approve     Manual Review
    |         (SLA: 30 min)
    v            |
 Release      Admin reviews
  Token       manually
                 |
            +----+----+
            |         |
          Approve   Reject
            |         |
         Release  Cancel order
          Token   + notify user
```

### What AI Checks on PKR Screenshots

```
1. Amount paid: OCR extracts number → compare to expected order amount
   Pass condition: extracted amount >= expected amount (allowing ±1 PKR tolerance)

2. Recipient name: OCR extracts recipient → compare to provider's registered account name
   Pass condition: name match score >= 80% (fuzzy match for slight abbreviations)

3. Sender name: OCR extracts sender → compare to user's KYC name
   Pass condition: name match score >= 80%

4. Timestamp: OCR extracts date and time → verify within order window
   Pass condition: timestamp is after order creation, before order expiry

5. Transaction reference: OCR extracts reference number → saved for records
   (Not a pass/fail, just recorded)

6. Manipulation detection:
   Check EXIF metadata for editing software traces
   Check for inconsistent font rendering (added text detection)
   Check for copy-paste artifacts in amount field
   Pass condition: no manipulation signals detected

7. Template matching: Compare screenshot layout to known JazzCash/Easypaisa templates
   Pass condition: layout matches a known template (catches completely fake screenshots)
```

### Admin Verification Panel

When AI flags for manual review, admin sees:

```
+-----------------------------------------------+
| ORDER #IBO-2026-004521                        |
|                                               |
| Token: SOL   Amount: 0.489 SOL                |
| User paid: 10,000 PKR   Provider: PakSwap     |
|                                               |
| [PAYMENT SCREENSHOT]                          |
| +-------------------------------------------+ |
| |  [Screenshot displayed full size]          | |
| +-------------------------------------------+ |
|                                               |
| AI FINDINGS:                                  |
| Amount: 10,000 PKR ✓ MATCH                   |
| Recipient: JazzCash **** ✓ MATCH             |
| Sender: Ahmed Ali ✓ MATCH (KYC: Ahmed Ali)   |
| Timestamp: 14:23 today ✓ WITHIN WINDOW       |
| Manipulation: None detected ✓                |
| AI Confidence: 84% → MANUAL REVIEW           |
|                                               |
| [APPROVE AND RELEASE]  [REJECT]  [Ask User]   |
+-----------------------------------------------+
```

---

## 14. SECURITY AND FRAUD CONTROLS

### Address Validation (Most Critical)

- Server-side validation of destination address on order creation
- Client-side real-time validation (UX feedback)
- Format check AND checksum validation (EVM addresses have checksum in mixed case)
- TON: verify starts with EQ or UQ, exactly 48 chars, valid base64url
- Never skip validation — wrong addresses = permanent fund loss

### Double-Release Prevention

- Each order has a `release_lock` flag in Redis
- Before releasing: acquire distributed lock (Redis SETNX)
- If lock exists: skip (another process already releasing)
- Release idempotency: if tx already sent, check tx hash exists and skip
- Order can only transition to `releasing` state once

### Hot Wallet Security

```
Hot wallet private keys:
  - Stored in HashiCorp Vault or AWS KMS (never in DB or .env files)
  - Access requires service authentication (not just API key)
  - Only the signing service can access private keys
  - Signing service runs in isolated container with no internet access
  - Audit log of every signing request

Hot wallet limits:
  - Maximum single transaction limit (configurable per token)
  - Daily withdrawal limit per user from Instant Buy
  - If order exceeds single-tx limit: reject with message to contact support
```

### Fraud Signals Specific to Instant Buy

| Signal | Action |
|---|---|
| Same destination address used in multiple accounts | Flag for review |
| Payment proof uploaded immediately (<30 seconds after order creation) | Suspicious — flag |
| Repeated order cancellations (>3 in 24 hours) | Temporary cooldown |
| Screenshot with editing software metadata | Auto-reject |
| Order amount exactly at max limit repeatedly | Risk score increase |
| Multiple failed payment verifications in 24 hours | Account cooldown |
| IP address in sanctioned country | Block order, flag account |
| VPN/proxy detected on order creation | Additional verification required |

### Rate Limits Per User

```
- Max 3 active (payment pending) orders at same time
- Max 10 completed orders per 24 hours
- Max daily spend: 500,000 PKR (Full KYC) / 50,000 PKR (Lite KYC)
- Min 2 minutes between new orders (prevent spam)
```

---

## 15. ADMIN TOOLING

### 15.1 Instant Buy Dashboard

```
Overview metrics:
- Orders today (total, completed, pending, cancelled, disputed)
- Volume today (PKR + USDT equivalent)
- Revenue today (fees collected)
- Pending verifications requiring manual review (with SLA timer)
- Low inventory alerts
- Oracle health status
```

### 15.2 Token Management Panel

For each token, admin can:
- Enable / Disable instantly
- View and edit: spread %, flat fees, min/max order sizes
- Override price manually (with expiry time)
- View current inventory levels across all provider wallets
- View order history for this token
- Download order report (CSV)

### 15.3 Inventory / Wallet Management Panel

```
For each provider + token combination:
  Hot wallet address (display only)
  Available balance (live from blockchain)
  Reserved balance (from pending orders in DB)
  Effective available balance (available - reserved)
  Low balance threshold (configurable)
  Last replenishment time
  Replenishment history
  [Top Up] button → shows deposit address for adding more inventory
  [Withdraw Excess] button → initiates withdrawal to cold wallet (requires 2FA)
```

### 15.4 Manual Payment Verification Queue

```
Sorted by: oldest first (SLA priority)
Shows SLA timer remaining for each item

Each item shows:
  Order reference
  User name + KYC status
  Token + amount
  Screenshot thumbnail
  AI verdict + confidence score
  Action buttons: [Approve] [Reject] [Request More Info]
  Notes field
```

### 15.5 Provider Application Panel

```
All applications listed with status
Filter by: status, city, tokens_wanted, date
Sort by: date, daily volume stated

Each application shows full form data
Admin actions: [Approve] [Reject] [Waitlist] [Add Note]
Approved applications can be converted to provider account directly
Bulk actions: approve/reject multiple
Export to CSV
```

### 15.6 Order Management Panel

Full order history with filters:
- Date range
- Status
- Token
- Payment method
- Provider
- User search (name, CNIC, email)

Each order shows full detail: quote, payment proof, AI results, tx hash, timeline.

Admin can:
- Manually override order status (with reason + audit log)
- Issue manual refund
- Escalate to dispute
- Ban user from Instant Buy feature

---

## 16. ALL REQUIRED PAGES AND UX

### User-Facing Pages

#### Page 1: Instant Buy Landing / Token Selection

```
Header: "Buy Crypto Instantly"
Subheader: "Fast, safe, direct to your wallet"

Token grid (cards):
  Each card shows:
    - Token logo
    - Token name + symbol
    - Current PKR price
    - 24h price change (% up/down)
    - "Buy" button

Filter bar:
  - Pay with: [PKR] [USDT]
  - Sort: Popular | Price | Newest

Bottom section:
  - "Want to sell crypto instead? Use P2P Marketplace →"
  - "Become a Provider →" (application form link)
```

#### Page 2: Order Creation / Quote Screen

```
Two-column layout:
  Left: Token info + price chart (mini)
  Right: Order form

Order form:
  You pay: [input] PKR  ←→  You receive: [input] SOL
  (both fields linked — updating one updates the other)

  Live quote box:
    Rate: 20,450 PKR/SOL
    Platform fee: 350 PKR
    Network fee: ~20 PKR
    Total cost: 10,420 PKR
    Quote valid: 09:47 countdown

  Destination wallet address:
    Label: "Your SOL Wallet Address"
    Hint: "Solana address (starts with a letter, 32-44 chars)"
    [Input field with real-time validation]
    Green ✓ or Red ✗ indicator
    Warning: "Wrong address = permanent loss. Always verify."

  Payment method selection (PKR only):
    [JazzCash] [Easypaisa] [Bank Transfer]

  Provider selection (if multiple providers):
    Dropdown or card selection showing rate + reputation

  [Get Quote] → [Confirm Order]
```

#### Page 3: Payment Instructions Screen

```
Order #IBO-2026-004521
Status: Awaiting Payment

Pay exactly this amount:
  [10,000 PKR] (large, prominent)
  Copy button

To this account:
  [JazzCash number: 0300-1234567]
  [Account name: PakSwap (Pvt) Ltd]
  Copy button

Important reference:
  Include this in your payment note: [IBO-004521]
  (so payment can be matched to your order)

Timer: Quote expires in 09:23

Payment proof upload:
  [Upload Screenshot] (drag + drop or file picker)
  Supported: JPG, PNG, PDF

[I have made the payment] button → triggers verification
[Cancel Order] link (small)
```

#### Page 4: Order Status / Tracking Screen

```
Order #IBO-2026-004521 — [Status Badge]

Timeline tracker:
  ✓ Order Created          14:23
  ✓ Quote Locked           14:23
  ✓ Payment Uploaded       14:31
  ⟳ Verifying Payment      14:31 (in progress)
  ○ Releasing SOL
  ○ Completed

Current status box:
  "Your payment is being verified.
   This usually takes 2-5 minutes.
   We will notify you immediately."

If completed:
  "0.489 SOL sent to your wallet!
   Transaction: 4xKpZ...83Hs [copy] [explorer link]
   It may take 1-2 minutes to appear in your wallet."
```

#### Page 5: Order History

```
Table / card list of all past Instant Buy orders
Columns: Date, Token, Amount, Paid, Status, TX Hash
Filters: Date range, Status, Token
Click any order → full order detail modal
Export CSV button
```

### Admin Pages

#### Admin Page 1: Instant Buy Overview Dashboard
- Real-time stats, pending verifications, alerts

#### Admin Page 2: Token Configuration
- Enable/disable, edit fees, spreads, limits per token

#### Admin Page 3: Inventory Manager
- All provider wallets, balances, replenishment tools

#### Admin Page 4: Verification Queue
- Manual review queue with SLA timers

#### Admin Page 5: Order Management
- Full order history, search, override tools

#### Admin Page 6: Provider Applications
- Review and process provider applications

#### Admin Page 7: Provider Management (Phase 2)
- Manage approved merchant providers

---

## 17. MVP vs FUTURE ROADMAP

### MVP (Phase 1 of Instant Buy)

```
Tokens: BNB, ETH, SOL, TON, BTC
Payment: PKR (JazzCash, Easypaisa, Bank) + USDT (TRC-20, BEP-20)
Provider: Platform only
Pricing: Oracle-based with manual override
Verification: AI + manual admin (PKR), blockchain-automated (USDT)
Admin: Token config, inventory, verification queue, order management
Applications: Provider application form (waitlist only)
Address validation: All 5 tokens validated
```

### Phase 2

```
- Approved merchant providers go live
- Provider comparison view for users
- Provider reputation and ratings
- Merchant dashboard for providers
- Automated inventory replenishment alerts
- Floating spread (spread adjusts with market volatility)
- Express tier: higher fee = faster processing
- Mobile app Instant Buy flow
- USDC payment support
```

### Phase 3

```
- More tokens: MATIC, ADA, XRP, TRX, AVAX, DOT
- Auto market-making from platform P2P activity
- Bulk OTC for orders > 500,000 PKR (dedicated OTC desk)
- Bank API integration for automated PKR verification
- Cross-chain swaps (buy SOL, pay from BSC USDT)
- Recurring buy (DCA — Dollar Cost Averaging) feature
- Price alerts ("Notify me when SOL hits 18,000 PKR")
```

### Phase 4

```
- Instant Sell (reverse: sell BNB for PKR)
- Limit orders (buy at specific price)
- P2P + Instant Buy hybrid (if no provider has inventory, route to P2P)
- API access for businesses to integrate PakSwap Instant Buy
- White-label solution for other Pakistani fintech apps
```

---

## 18. IMPLEMENTATION PROMPT FOR DEVELOPERS

Use this entire section as a prompt when directing any AI or development team to build this feature.

---

```
You are adding an "Instant Buy / OTC" feature to PakSwap, a Pakistan P2P crypto exchange.

FEATURE OVERVIEW:
Users can buy crypto (BNB, ETH, SOL, TON, BTC) directly using:
  A) PKR via JazzCash / Easypaisa / bank transfer (manual payment + screenshot verification)
  B) USDT via TRC-20 or BEP-20 deposit (blockchain-confirmed, automatic)

AT LAUNCH (MVP):
  Only the platform provides inventory (no third-party merchants yet)
  There IS an "Apply to Become a Provider" form from day one (for future pipeline)

ARCHITECTURE ADDITIONS:
  New services: QuoteEngine, OrderManager, PaymentVerifier, BlockchainWatcher, TokenReleaser, InventoryManager, ProviderManager
  New DB tables: instant_buy_tokens, instant_buy_providers, instant_buy_provider_wallets, instant_buy_quotes, instant_buy_orders, instant_buy_payment_verifications, instant_buy_provider_applications, instant_buy_inventory_alerts

TOKENS AND ADDRESS VALIDATION (CRITICAL):
  BNB (BSC/BEP-20): 0x + 40 hex, EVM checksum validation
  ETH (Ethereum): same as BNB
  SOL (Solana): Base58, 32-44 chars
  TON (TON Network): starts with EQ or UQ, exactly 48 chars, base64url format
  BTC (Bitcoin): Bech32 (bc1...) or legacy (1... or 3...)
  
  For TON specifically:
    Label: "TON Wallet Address (Tonkeeper, TON Wallet, Telegram Wallet)"
    Hint: "Must start with EQ or UQ, 48 characters"
    Example: "EQD2j4B9rDfSFBl4mfVBP8w2dJXmK..."
    Reject any other format with clear error message
    Show supported wallet logos: Tonkeeper, TON Wallet, MyTonWallet, Telegram Wallet

PKR PAYMENT FLOW:
  1. User gets quote (locked for 10 minutes)
  2. User sees provider payment details (JazzCash/bank)
  3. User pays PKR externally and uploads screenshot
  4. AI verifies screenshot: amount, sender name, recipient name, timestamp, manipulation check
  5. If AI confidence >= 90%: auto-approve and release token
  6. If AI confidence 70-90%: queue for admin manual review (SLA: 30 min)
  7. If manipulation detected: auto-reject
  8. On approval: release token from hot wallet to user's address

USDT PAYMENT FLOW:
  1. User gets quote (locked for 10 minutes)
  2. Platform shows unique deposit USDT address (with network selector: TRC-20 or BEP-20)
  3. Blockchain watcher monitors for incoming transaction
  4. On confirmation (TRC-20: 19 confirms, BEP-20: 15 confirms): auto-release token
  5. Fully automated, no human review needed

PRICING ENGINE:
  Market price: weighted average of Binance (40%), CoinGecko (30%), CMC (30%)
  PKR rate: SBP open market rate or wise.com or internal P2P marketplace average
  User price = market_price × (1 + spread_percent) + flat_fee + gas_estimate
  Quote locked for 10 minutes, cancel if market moves >2% against platform

HOT WALLET SECURITY:
  Private keys in HashiCorp Vault or AWS KMS only
  Isolated signing service, no direct DB access to keys
  Double-release lock via Redis SETNX before any payout
  Order idempotency: each order triggers exactly one blockchain transaction

ORDER STATUS STATES:
  created → payment_pending → payment_uploaded → payment_verified → releasing → completed
  Also: cancelled, disputed, refunded

FRAUD CONTROLS:
  Max 3 pending orders per user at once
  Max 10 completed orders per 24 hours
  Daily spending limits per KYC level (50K PKR for Lite, 500K PKR for Full)
  Rate limit: 2 minute minimum between orders
  Address reuse detection across accounts
  Screenshot manipulation detection

ADMIN PAGES REQUIRED:
  1. Instant Buy Dashboard (stats, pending verifications, inventory alerts)
  2. Token Configuration (enable/disable, fees, spreads, limits)
  3. Inventory Manager (wallet balances, replenishment)
  4. Verification Queue (manual review with SLA timers)
  5. Order Management (full history, search, override)
  6. Provider Application Panel (review applications, approve/reject/waitlist)

USER PAGES REQUIRED:
  1. Instant Buy Token Selection page
  2. Quote / Order Creation page
  3. Payment Instructions page (with screenshot upload)
  4. Order Status / Tracking page
  5. Order History page

DATABASE:
  All 8 new tables described in section 12 of 08_INSTANT_BUY_OTC_BLUEPRINT.md
  Integrate with existing users, wallets, kyc_submissions tables from 04_SYSTEM_ARCHITECTURE_AND_DATABASE.md

DESIGN:
  Follow existing design system from 06_DESIGN_SYSTEM_AND_COMPONENTS.md
  Primary color: Deep Blue #1A56DB
  Mobile-first, match existing pages in /html folder
  Add prominent trust signals: escrow guarantee, auto-release, blockchain verification

REFERENCES:
  Full blueprint: 08_INSTANT_BUY_OTC_BLUEPRINT.md
  Existing schema: 04_SYSTEM_ARCHITECTURE_AND_DATABASE.md
  Design system: 06_DESIGN_SYSTEM_AND_COMPONENTS.md
  Existing HTML pages: /html folder

BUILD ORDER:
  1. DB migrations (all 8 new tables)
  2. Token configuration seeding (5 tokens with validation rules)
  3. Quote engine (oracle integration + fee calculation)
  4. Order creation API
  5. PKR payment proof upload + AI verification
  6. USDT blockchain watcher
  7. Token release service (hot wallet integration)
  8. Admin verification queue
  9. Frontend: token selection + order flow pages
  10. Admin panels
  11. Provider application form
  12. End-to-end testing with each token
```

---

*This blueprint integrates with the existing PakSwap architecture documented in files 01-07. All references to users, KYC, wallets, and admin infrastructure assume the base platform exists or is being built in parallel.*
