# PAKSWAP — MERCHANT / PROVIDER DASHBOARD SPECIFICATION
## What Merchants Get After Approval, Inventory Management, Instant Buy Connection

> **Document:** 16 — Merchant Dashboard Spec
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Phase 2 (per roadmap in Doc 00)
> **Audience:** Backend and frontend developers
> **Cross-reference:** Doc 08 (Instant Buy OTC Blueprint — provider model), Doc 12 Section 8 (application review by admin — not repeated here)

---

## TABLE OF CONTENTS

1. [What a Merchant Is](#1-what-a-merchant-is)
2. [Two Types of Merchants](#2-two-types-of-merchants)
3. [What Merchants Get After Approval](#3-what-merchants-get-after-approval)
4. [Merchant Dashboard Pages](#4-merchant-dashboard-pages)
5. [How Merchant Inventory Connects to Instant Buy](#5-how-merchant-inventory-connects-to-instant-buy)
6. [How Orders Are Matched to Providers](#6-how-orders-are-matched-to-providers)
7. [Merchant Earnings and Commission](#7-merchant-earnings-and-commission)
8. [Merchant Responsibilities and Rules](#8-merchant-responsibilities-and-rules)
9. [Merchant Suspension and Offboarding](#9-merchant-suspension-and-offboarding)
10. [Database Schema](#10-database-schema)
11. [Merchant-Specific API Endpoints](#11-merchant-specific-api-endpoints)

---

## 1. WHAT A MERCHANT IS

A merchant on PakSwap is a verified, high-volume user who has been approved to:

1. **Post P2P sell ads** at preferred fee rates (0.3% vs 0.5% standard)
2. **Provide inventory for Instant Buy** — holding crypto that platform uses to fill user orders
3. **Earn commission** from Instant Buy orders filled from their inventory

A regular user can trade P2P without being a merchant. Merchant status adds the Instant Buy provider role and the reduced fee tier.

**Platform model reminder (from Doc 07):** Platform holds no crypto of its own for P2P. For Instant Buy MVP, platform holds inventory. In Phase 2, approved merchants hold and provide the inventory — platform connects buyers to merchant inventory and guarantees fulfillment.

---

## 2. TWO TYPES OF MERCHANTS

| Type | Description | Access |
|------|-------------|--------|
| **P2P Merchant** | High-volume P2P seller. Reduced fees, merchant badge on profile. No Instant Buy involvement. | Reduced fee (0.3%), merchant badge, priority listing |
| **Instant Buy Provider** | Holds crypto inventory that platform deploys for Instant Buy orders. Earns commission per order filled. | All P2P Merchant access + Instant Buy provider dashboard |

A merchant can be both types. Admin configures which types are granted during the application approval process (Doc 12 Section 8).

---

## 3. WHAT MERCHANTS GET AFTER APPROVAL

### Immediately on Approval

| Access Granted | Details |
|----------------|---------|
| Merchant badge on public profile | Green "Verified Merchant" badge visible on all listings and trade rooms |
| Reduced P2P trading fee | 0.3% instead of 0.5% (configurable per merchant by admin) |
| Increased ad limits | Up to 20 active ads (vs 10 for regular users) |
| Merchant dashboard section | New "Merchant" tab appears in their account navigation |
| Priority listing placement | Merchant ads ranked above non-merchant ads at same price |

### For Instant Buy Providers (Additional)

| Access Granted | Details |
|----------------|---------|
| Instant Buy provider dashboard | Full inventory management and order tracking interface |
| Wallet deposit instructions | Platform provides dedicated deposit addresses per token for their inventory |
| Commission earnings | Per order filled from their inventory (0.1%–0.3%, set by admin per provider) |
| Provider API key (Phase 3) | Programmatic inventory management for sophisticated providers |

### Welcome Email on Approval

See Doc 14 — admin approval triggers a dedicated welcome email with:
- Summary of granted access and fee rates
- Link to merchant dashboard
- Instructions for depositing first inventory (if Instant Buy provider)
- Link to merchant terms and responsibilities

---

## 4. MERCHANT DASHBOARD PAGES

The merchant dashboard is a section within the regular user account area — not a separate login. Merchant sees their standard user UI plus these additional tabs.

### 4.1 Merchant Overview

**URL:** `/merchant/overview`

Displays:
```
Today's Stats:
  P2P Trades Completed:  [N]
  P2P Volume (PKR):      [amount]
  IB Orders Filled:      [N]
  Commission Earned:     [amount] PKR equivalent

This Month:
  Total Volume:          [amount]
  Total Commission:      [amount]
  Average Rating:        [X.X] / 5.0 (based on last 30 trades)
  Dispute Rate:          [X]%
  Completion Rate:       [X]%
  Response Time Avg:     [X] minutes

Account Status:
  P2P Merchant:          Active ✓
  Instant Buy Provider:  Active ✓ / Not enrolled
  Fee Rate (P2P):        0.3%
  Commission Rate (IB):  0.2%
  Daily Volume Cap (IB): 500,000 PKR
```

### 4.2 P2P Ad Management

**URL:** `/merchant/ads`

Extended version of the regular "My Ads" page. Adds:
- Bulk enable / disable all ads
- Analytics per ad: views, trade starts, completion rate
- Clone ad (duplicate settings to create a new ad quickly)
- Ad performance chart (7-day volume per ad)

### 4.3 Instant Buy Inventory

**URL:** `/merchant/inventory`
*Only visible to Instant Buy Providers.*

```
Per token row:
  Token:              BNB
  Network:            BSC (BEP-20)
  Deposit Address:    0x[address]  [Copy] [QR Code]
  Current Balance:    45.23 BNB
  PKR Equivalent:     ~1,247,400 PKR
  Warning Level:      10 BNB (set by merchant)
  Status:             Active ✓
  
  [Add Inventory →]   [Pause This Token]   [View Deposit History]
```

**Add Inventory flow:**
```
Step 1: Merchant clicks "Add Inventory" for a token
Step 2: System shows deposit address + QR code + network instructions
Step 3: Merchant sends crypto from their external wallet to the deposit address
Step 4: Platform's blockchain monitor detects the incoming transaction
Step 5: After required confirmations (per-chain, see Doc 09): balance credited to merchant inventory
Step 6: Merchant notified: "[X] BNB received. Your inventory is now [total] BNB."
Step 7: Platform does NOT require admin approval for inventory deposits — 
        blockchain confirmation is sufficient
```

**Withdraw Inventory flow:**
```
Note: Merchants CAN withdraw their own inventory back out (unlike trade escrow which is user-controlled).

Step 1: Merchant clicks "Withdraw Inventory" for a token
Step 2: Enters amount and destination wallet address
Step 3: System checks: amount <= available balance (not allocated to pending orders)
        If pending orders exist that use this inventory: only unallocated balance can be withdrawn
Step 4: Withdrawal request created with status 'pending_admin_approval'
Step 5: Admin reviews (same two-layer rule applies — merchant inventory withdrawal is also admin-approved)
Step 6: Admin approves → signing service broadcasts → blockchain confirms → withdrawal complete
Step 7: Merchant notified with tx hash
```

### 4.4 Instant Buy Order History

**URL:** `/merchant/orders`
*Only visible to Instant Buy Providers.*

Table of all Instant Buy orders that were filled from this merchant's inventory.

| Column | Value |
|--------|-------|
| Order ID | Clickable — shows full order detail |
| Date | Timestamp |
| Token | BNB / ETH / etc. |
| Amount | Units of token |
| PKR Value | At time of order |
| Commission Earned | PKR equivalent |
| Status | Completed / Cancelled / Refunded |

Filters: date range, token, status.

Export CSV button for accounting.

### 4.5 Commission Earnings

**URL:** `/merchant/earnings`

```
Earnings Summary:
  Today:              [amount] PKR
  This Week:          [amount] PKR
  This Month:         [amount] PKR
  All Time:           [amount] PKR
  Pending Payout:     [amount] PKR (commissions earned but not yet paid out)

Payout Schedule:
  Commissions are accumulated and settled weekly every Sunday.
  Payout method: [Admin-configured per merchant — bank transfer details on file]

Earnings History Table:
  Date | Orders | Token | Volume | Commission Rate | Commission Earned
```

**Payout Process (admin-managed):**
- Admin reviews weekly commission summary
- Admin initiates PKR transfer to merchant's registered bank account
- Admin records payout in system → merchant notified by email
- Commission is paid in PKR (converted at the rate at time of settlement), not in crypto

### 4.6 Merchant Profile Settings

**URL:** `/merchant/profile`

```
Public Profile:
  Business name:      [editable]
  Description:        [editable — shown on public merchant profile]
  Languages spoken:   [Urdu / English / Punjabi — checkboxes]
  Online hours:       [schedule — e.g., "9 AM – 11 PM PKT"]
  Auto-reply message: [text shown to buyers when merchant is offline]

P2P Preferences:
  Minimum trade amount:  [PKR]
  Maximum trade amount:  [PKR]
  Preferred payment methods: [JazzCash / Easypaisa / Bank — checkboxes]
  Trade terms:           [free text, max 500 chars — shown to buyers before trade]

Instant Buy Settings (providers only):
  Auto-warning when inventory drops below: [X] PKR equivalent
  Pause all tokens if below: [Y] PKR equivalent
```

---

## 5. HOW MERCHANT INVENTORY CONNECTS TO INSTANT BUY

This section explains the backend logic connecting merchant inventory to the Instant Buy order flow.

### Inventory Allocation at Order Creation

When a user creates an Instant Buy order:

```
Step 1: User requests quote for [X] BNB

Step 2: Pricing engine calculates quote (Doc 08 pricing engine)

Step 3: System checks inventory availability:
        → Query: SELECT providers with available BNB inventory >= X + gas buffer
        → Priority order for provider selection:
            1. Platform inventory (if available and token is enabled for platform)
            2. Merchant providers — sorted by: lowest spread offered, then highest available balance

Step 4: System reserves [X] BNB from the selected provider's inventory:
        → UPDATE inventory SET allocated_amount = allocated_amount + X
           WHERE provider_id = [selected] AND token = BNB
        → This is a soft reservation — held until order completes or expires

Step 5: Order created with provider_id recorded

Step 6: If order expires without payment: release reservation
        → UPDATE inventory SET allocated_amount = allocated_amount - X

Step 7: If admin approves payment:
        → Payout job sends [X] BNB from provider's wallet to user's address
        → On blockchain confirmation: deduct from provider's balance
        → Credit commission to merchant's earnings

Step 8: If order cancelled or payment rejected (all attempts):
        → Release reservation
        → No deduction from provider balance
        → No commission earned
```

### Inventory States per Token per Provider

```
total_balance       -- total deposited (confirmed on-chain)
allocated_amount    -- reserved for pending orders (not yet sent)
available_balance   -- total_balance - allocated_amount (can be used for new orders)
```

**Rule:** `available_balance` must be >= requested order amount before the order can be created. If available balance across all providers is insufficient: return `IB_INSUFFICIENT_INVENTORY` error (see Doc 13).

### Multi-Provider Order Fulfillment

An order is always filled from a single provider (not split across providers). This simplifies accounting and payout.

If no single provider has enough available balance for the full order: order fails with `IB_INSUFFICIENT_INVENTORY`, even if the combined balance of all providers would be sufficient.

---

## 6. HOW ORDERS ARE MATCHED TO PROVIDERS

### Matching Priority

```
1. Platform inventory (if enabled for this token and has sufficient balance)
2. Merchants sorted by: spread_offered ASC, available_balance DESC, response_time_avg ASC
3. First match with sufficient available_balance wins
```

### Why Platform Inventory Takes Priority

The platform's own inventory has zero commission cost. Using platform inventory before merchant inventory maximizes platform revenue per order.

Merchants benefit when platform inventory is depleted or the platform has disabled a token.

### Provider Visibility to Users

Users do NOT see which provider is filling their order. From the user's perspective, they are always buying from "PakSwap." This is by design — the provider model is a backend infrastructure detail.

The order detail page shows "Fulfilled by PakSwap" regardless of whether it was platform or merchant inventory.

---

## 7. MERCHANT EARNINGS AND COMMISSION

### Commission Calculation

```
Commission = order_amount_pkr × commission_rate

Example:
  User buys 0.05 ETH = 80,000 PKR order
  Merchant commission rate: 0.2%
  Commission = 80,000 × 0.002 = 160 PKR

The commission is taken from the spread revenue (not an additional charge to the user).
The user pays the quoted price regardless of which provider fills the order.
```

### Commission Recording

Every completed order creates a `merchant_commission_events` record:

```sql
merchant_commission_events (
  id, provider_id, order_id, token, amount_token, amount_pkr, 
  commission_rate, commission_pkr, settlement_status ENUM('pending','settled'),
  settled_at, created_at
)
```

### Commission Payout

- Accumulated weekly (Sunday end of day)
- Paid by admin via bank transfer to merchant's registered account
- Minimum payout threshold: 5,000 PKR (commissions below this roll over to next week)
- Admin marks payout as settled in the system (updates `settlement_status = 'settled'`)
- Merchant notified by email with breakdown

### Merchant Statement Download

Merchants can download a monthly CSV statement from `/merchant/earnings` showing:
- Per-order breakdown
- Commission earned
- Payout received

---

## 8. MERCHANT RESPONSIBILITIES AND RULES

These rules are part of the merchant agreement (accepted during application).

### Inventory Requirements

| Rule | Detail |
|------|--------|
| Minimum inventory level | Must maintain at least 50,000 PKR equivalent per active token or pause the token |
| Response to inventory alerts | Top up or pause token within 24 hours of receiving a warning alert |
| Withdrawal timing | Cannot withdraw inventory allocated to pending orders |
| Source of funds | Merchant's crypto must come from their own verified wallet (same KYC name) |

### Performance Requirements

| Metric | Minimum Required | Consequence if Breached |
|--------|-----------------|------------------------|
| Instant Buy fill rate | > 95% (orders allocated but not filled due to merchant error) | Warning, then provider suspension |
| P2P completion rate | > 90% | Warning, then merchant badge review |
| P2P dispute rate | < 5% | Warning |
| Response time (P2P) | Average < 15 minutes during stated online hours | Warning |

### Prohibited Actions

- Providing false inventory records (claiming to have balance they do not hold)
- Using another person's bank account for commission payouts (must match KYC name)
- Coordinating with buyers/sellers to bypass platform fees
- Running multiple merchant accounts
- Withdrawing inventory while orders are pending against it (system prevents this but attempting it is a violation)

---

## 9. MERCHANT SUSPENSION AND OFFBOARDING

### Suspension Triggers (Admin Action Required)

| Trigger | Action |
|---------|--------|
| Fill rate drops below 95% for 2 consecutive weeks | Warning email |
| 3 warnings in 90 days | Merchant status review — admin evaluates |
| Fraudulent inventory records | Immediate suspension, pending investigation |
| KYC account suspended | Merchant status suspended (tied to the user account) |
| Voluntary offboarding request | Process below |

### Suspension Effects

When merchant Instant Buy provider status is suspended:
- Active tokens moved to paused state immediately
- No new orders allocated to this provider
- Pending orders (already allocated) complete normally — merchant must fulfil them
- Inventory available for withdrawal after all pending orders complete

P2P merchant status suspension (separate from provider suspension):
- Merchant badge removed
- Fee rate reverts to standard 0.5%
- Active ads remain visible but without priority

### Voluntary Offboarding

```
Merchant requests offboarding via support ticket:
  1. Admin confirms no pending orders remain against their inventory
  2. Admin approves withdrawal of all remaining inventory
  3. Merchant confirms bank account for final commission payout
  4. Admin marks merchant status as 'offboarded'
  5. Merchant badge removed; fee reverts to standard
  6. Historical order data retained (7-year compliance)
```

---

## 10. DATABASE SCHEMA

```sql
-- Merchant profile (extends users table)
instant_buy_providers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) UNIQUE,
  business_name     VARCHAR(200),
  description       TEXT,
  commission_rate   DECIMAL(5,4) NOT NULL,  -- e.g., 0.0020 for 0.2%
  daily_volume_cap  DECIMAL(20,2),          -- max PKR per day this provider can fill
  status            ENUM('active','paused','suspended','offboarded') DEFAULT 'active',
  approved_by       UUID REFERENCES admin_users(id),
  approved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
)

-- Inventory per token per provider
instant_buy_provider_inventory (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID NOT NULL REFERENCES instant_buy_providers(id),
  token_id          UUID NOT NULL REFERENCES instant_buy_tokens(id),
  total_balance     DECIMAL(30,10) NOT NULL DEFAULT 0,
  allocated_amount  DECIMAL(30,10) NOT NULL DEFAULT 0,  -- reserved for pending orders
  warning_level     DECIMAL(30,10),                     -- merchant-set threshold
  is_active         BOOLEAN DEFAULT TRUE,
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider_id, token_id)
)

-- Computed column (available_balance = total_balance - allocated_amount)
-- Do not store — always compute at query time

-- Deposit events (inventory top-ups)
instant_buy_inventory_deposits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID NOT NULL REFERENCES instant_buy_providers(id),
  token_id          UUID NOT NULL REFERENCES instant_buy_tokens(id),
  amount            DECIMAL(30,10) NOT NULL,
  tx_hash           VARCHAR(200) NOT NULL UNIQUE,
  network           VARCHAR(50) NOT NULL,
  status            ENUM('pending','confirmed') DEFAULT 'pending',
  confirmed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
)

-- Commission earnings
merchant_commission_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID NOT NULL REFERENCES instant_buy_providers(id),
  order_id          UUID NOT NULL REFERENCES instant_buy_orders(id),
  token_id          UUID NOT NULL REFERENCES instant_buy_tokens(id),
  amount_token      DECIMAL(30,10) NOT NULL,
  amount_pkr        DECIMAL(20,2) NOT NULL,
  commission_rate   DECIMAL(5,4) NOT NULL,
  commission_pkr    DECIMAL(20,2) NOT NULL,
  settlement_status ENUM('pending','settled') DEFAULT 'pending',
  settled_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
)

-- Commission payouts (weekly settlements)
merchant_payouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       UUID NOT NULL REFERENCES instant_buy_providers(id),
  amount_pkr        DECIMAL(20,2) NOT NULL,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  bank_reference    VARCHAR(200),   -- bank transaction reference from admin
  paid_by           UUID REFERENCES admin_users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 11. MERCHANT-SPECIFIC API ENDPOINTS

All endpoints require authenticated user JWT + merchant role check middleware.

```
GET  /merchant/overview
     Response: stats summary, status, fee rates

GET  /merchant/inventory
     Response: array of { token, balance, allocated, available, warning_level, is_active }

POST /merchant/inventory/{tokenId}/withdraw
     Body: { amount, destination_address }
     Creates withdrawal request (admin approval required)

PATCH /merchant/inventory/{tokenId}
     Body: { warning_level?, is_active? }
     Update thresholds or pause/unpause a token

GET  /merchant/orders?page=1&limit=20&token=&status=
     Paginated list of Instant Buy orders filled from this merchant

GET  /merchant/earnings?from=&to=
     Commission summary and per-order breakdown for date range

GET  /merchant/earnings/export?from=&to=
     CSV download of earnings

GET  /merchant/profile
PATCH /merchant/profile
     Update business name, description, online hours, auto-reply
```

---

*End of Merchant Dashboard Specification — Document 16*
*Cross-references: Doc 08 (Instant Buy OTC — provider model, Section 9), Doc 12 Section 8 (application review process — not repeated here), Doc 09 (blockchain deposit confirmation requirements)*
