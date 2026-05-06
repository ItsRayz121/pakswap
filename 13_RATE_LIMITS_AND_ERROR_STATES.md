# PAKSWAP — RATE LIMITS & ERROR STATES
## Consolidated Reference: API Throttling, Business Rules, Edge Cases, Error Codes

> **Document:** 13 — Rate Limits and Error States
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Pre-Development
> **Audience:** Backend developers, API gateway configuration, QA team

---

## TABLE OF CONTENTS

1. [API Rate Limits — Global Rules](#1-api-rate-limits--global-rules)
2. [Feature-Level Rate Limits](#2-feature-level-rate-limits)
3. [Business Rule Limits](#3-business-rule-limits)
4. [Error Code Reference](#4-error-code-reference)
5. [Edge Case Handling — P2P Trades](#5-edge-case-handling--p2p-trades)
6. [Edge Case Handling — Instant Buy](#6-edge-case-handling--instant-buy)
7. [Edge Case Handling — KYC](#7-edge-case-handling--kyc)
8. [Edge Case Handling — Screenshots & OCR](#8-edge-case-handling--screenshots--ocr)
9. [Edge Case Handling — Blockchain & Payments](#9-edge-case-handling--blockchain--payments)
10. [WebSocket Error States](#10-websocket-error-states)
11. [Admin API Rate Limits](#11-admin-api-rate-limits)
12. [Rate Limit Response Format](#12-rate-limit-response-format)
13. [Queue & Job Error States](#13-queue--job-error-states)

---

## 1. API RATE LIMITS — GLOBAL RULES

### Implementation

All rate limits are enforced at the API gateway level using Redis-backed counters with sliding window algorithm.

Key format: `ratelimit:{type}:{identifier}:{window}`

Windows: `1m` (1 minute), `1h` (1 hour), `24h` (24 hours)

### Unauthenticated Endpoints

| Endpoint Group | Limit | Window | Identifier |
|----------------|-------|--------|------------|
| All public endpoints | 60 requests | 1 minute | IP address |
| `/auth/login` | 10 attempts | 1 hour | IP address |
| `/auth/login` | 5 attempts | 1 hour | Email/phone (separate from IP) |
| `/auth/register` | 5 attempts | 1 hour | IP address |
| `/auth/send-otp` | 5 attempts | 1 hour | Phone number |
| `/auth/verify-otp` | 10 attempts | 1 hour | IP address |
| Price/rate endpoints | 120 requests | 1 minute | IP address |

### Authenticated User Endpoints (General)

| Endpoint Group | Limit | Window | Notes |
|----------------|-------|--------|-------|
| All authenticated endpoints | 300 requests | 1 minute | Per user ID |
| All authenticated endpoints | 5,000 requests | 24 hours | Per user ID |
| File uploads (any endpoint) | 20 uploads | 1 hour | Per user ID |
| File uploads (any endpoint) | 50 uploads | 24 hours | Per user ID |

### Rate Limit Violation Response

HTTP `429 Too Many Requests` with headers:

```
X-RateLimit-Limit: [max]
X-RateLimit-Remaining: 0
X-RateLimit-Reset: [Unix timestamp when limit resets]
Retry-After: [seconds until reset]
```

Response body:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in [N] minutes.",
    "retry_after_seconds": 120
  }
}
```

---

## 2. FEATURE-LEVEL RATE LIMITS

### Authentication

| Action | Limit | Window | Lockout Action |
|--------|-------|--------|----------------|
| Login failed attempts (by email) | 5 failures | 1 hour | Lock account login for 1 hour. Notify user by email. |
| Login failed attempts (by IP) | 20 failures | 1 hour | Block IP for 1 hour |
| 2FA wrong code entries | 10 failures | 1 hour | Invalidate 2FA session, force re-login |
| OTP requests (same phone) | 5 requests | 1 hour | Block further OTP for 24 hours, flag phone number |
| Password reset requests | 3 requests | 1 hour | Block further resets, notify user |
| New device login attempts | 3 per device | 24 hours | Require re-verification for additional attempts |

### KYC

| Action | Limit | Window | Behavior on Breach |
|--------|-------|--------|-------------------|
| KYC submissions (Level 1) | 5 total | Lifetime | After 5 rejections: account flagged, requires senior_admin manual review to resubmit |
| KYC submissions (Level 2) | 5 total | Lifetime | Same as above |
| CNIC number unique | 1 per CNIC | Platform-wide | Second account with same CNIC: reject + fraud flag |
| Face match unique | 1 per face | Platform-wide | Duplicate face detected: reject + fraud flag both accounts |
| Liveness retries (single session) | 3 attempts | Per session | After 3: fail submission, user must start KYC over |

### P2P Trading

| Action | Limit | Window | Behavior on Breach |
|--------|-------|--------|-------------------|
| Active trades (simultaneous) | 3 trades | At any time | Reject new trade initiation: "You have too many active trades" |
| Trades initiated | 20 trades | 24 hours | Soft limit: flag for review after 20, hard block after 30 |
| Trade cancellations | 5 cancellations | 24 hours | Warning added to account; 10 in 24h = 24h trade suspension |
| Payment screenshot uploads per trade | 3 attempts | Per trade | After 3 rejections: trade auto-cancelled |
| Payment proof uploads | 10 uploads | 1 hour | Temporary upload block for 30 minutes |
| Trade chat messages | 30 messages | 5 minutes | Temporary chat block for 10 minutes per trade |
| New ad creation | 5 ads | 24 hours | Reject with error |
| Active ads simultaneously | 10 ads | At any time | Reject with error until an ad is deactivated |

### Instant Buy

| Action | Limit | Window | Behavior on Breach |
|--------|-------|--------|-------------------|
| Pending orders (simultaneously) | 3 orders | At any time | Reject new order: "You have 3 pending orders. Complete or cancel one first." |
| Orders created | 10 orders | 24 hours | Block further orders for remainder of 24h window |
| Quote requests | 30 requests | 1 hour | Rate limit to prevent price scraping |
| Screenshot resubmissions per order | 3 attempts | Per order | After 3 rejections: order cancelled |
| Orders (new accounts < 7 days old) | 2 orders | 24 hours | Stricter limit for new accounts |

### File Uploads

| Rule | Value | Notes |
|------|-------|-------|
| Maximum file size | 10 MB | Applies to all uploads |
| Allowed file types | JPEG, PNG, PDF, WEBP | Validated by MIME type + file header, not extension |
| Minimum image dimensions | 400×400 px | Reject blurry/thumbnail screenshots |
| Maximum image dimensions | 8000×8000 px | Resize server-side if over 2000×2000 before S3 storage |
| Virus / malware scan | Required | ClamAV scan before processing. Reject if infected. |

---

## 3. BUSINESS RULE LIMITS

### KYC Trading Limits

| KYC Level | Max Trade Size (Single) | Daily Cumulative Limit | Instant Buy Limit |
|-----------|------------------------|------------------------|-------------------|
| None (unverified) | Cannot trade | Cannot trade | Cannot buy |
| Level 1 (CNIC only) | 50,000 PKR | 50,000 PKR | 25,000 PKR/day |
| Level 2 (Full KYC) | 500,000 PKR | 500,000 PKR | 200,000 PKR/day |
| Level 3 (EDD — manual) | Unlimited | As agreed with compliance | As agreed |
| Merchant accounts | As configured per merchant | As configured | As configured |

### P2P Trade Timers

| Timer | Duration | Action on Expiry |
|-------|----------|-----------------|
| Buyer payment window | 15 minutes | Trade auto-cancelled, USDT escrow returned to seller |
| Seller release window (after payment approved) | 15 minutes | Alert sent to seller |
| Seller release window (extended) | 30 additional minutes | Admin alert; force release process may begin |
| Dispute evidence collection | 2 hours per party | Admin rules on available evidence if no response |
| Dispute resolution SLA | 4 hours | Auto-escalate to senior_admin |
| Trade chat message window | Entire trade duration | Archived permanently after trade ends |

### Instant Buy Timers

| Timer | Duration | Action on Expiry |
|-------|----------|-----------------|
| Quote lock | 10 minutes | Order expired; user must request new quote |
| Payment submission after quote | 10 minutes | If user does not submit payment: order expires automatically |
| Admin review SLA | 30 minutes | Alert sent; SLA breach recorded |

### Merchant / Provider Limits

| Rule | Value |
|------|-------|
| Minimum daily volume to qualify as provider | 100,000 PKR equivalent |
| Maximum providers per token (MVP) | 5 |
| Provider commission range | 0.1% – 0.3% (set by admin per provider) |
| Provider application cooldown after rejection | 30 days |
| Maximum pending provider applications | 3 per applicant |

---

## 4. ERROR CODE REFERENCE

### Format

All API errors follow this response structure:

```json
{
  "error": {
    "code": "SNAKE_CASE_CODE",
    "message": "Human-readable message for developers (English)",
    "user_message": "Urdu or simple English message for users (optional, for user-facing errors)",
    "details": {}    // Optional: field-level validation errors or context
  }
}
```

### Authentication Errors (HTTP 401 / 403)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email/phone or password | Login failed |
| `AUTH_ACCOUNT_LOCKED` | 401 | Account temporarily locked due to too many failed attempts | After 5 failures |
| `AUTH_ACCOUNT_SUSPENDED` | 403 | Your account has been suspended | User suspended by admin |
| `AUTH_ACCOUNT_BANNED` | 403 | Your account has been permanently banned | Permanent ban |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token expired | JWT past expiry |
| `AUTH_TOKEN_INVALID` | 401 | Invalid token | Tampered or wrong secret |
| `AUTH_TOKEN_REVOKED` | 401 | Token has been revoked | Forced logout (e.g., password changed) |
| `AUTH_2FA_REQUIRED` | 403 | Two-factor authentication required | 2FA not yet completed |
| `AUTH_2FA_INVALID` | 401 | Invalid 2FA code | Wrong TOTP code |
| `AUTH_2FA_EXPIRED` | 401 | 2FA code has expired | TOTP code from wrong time window |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | You do not have permission to perform this action | Role mismatch |
| `AUTH_KYC_REQUIRED` | 403 | KYC verification required to access this feature | User tries to trade without KYC |
| `AUTH_KYC_LEVEL_INSUFFICIENT` | 403 | Your KYC level does not allow this trade amount | Amount exceeds KYC tier limit |

### Validation Errors (HTTP 400)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `VALIDATION_ERROR` | 400 | One or more fields are invalid | Generic validation fail |
| `INVALID_PHONE_NUMBER` | 400 | Invalid Pakistan phone number format | Not 03xx-xxxxxxx format |
| `INVALID_CNIC` | 400 | Invalid CNIC format | Not 13 digits or incorrect format |
| `INVALID_WALLET_ADDRESS` | 400 | Invalid wallet address for [network] | Address fails network-specific validation |
| `INVALID_AMOUNT` | 400 | Amount must be a positive number | Zero, negative, or non-numeric |
| `AMOUNT_BELOW_MINIMUM` | 400 | Amount is below the minimum of [value] | Below per-token minimum |
| `AMOUNT_ABOVE_MAXIMUM` | 400 | Amount exceeds maximum allowed | Above KYC tier or single-trade limit |
| `AMOUNT_ABOVE_DAILY_LIMIT` | 400 | This trade would exceed your daily limit | Daily cumulative limit hit |
| `INVALID_FILE_TYPE` | 400 | Only JPEG, PNG, or PDF files are accepted | Unsupported file type uploaded |
| `FILE_TOO_LARGE` | 400 | File exceeds maximum size of 10 MB | File > 10 MB |
| `FILE_DIMENSIONS_TOO_SMALL` | 400 | Image is too small to be verified | Below 400×400 px |
| `DUPLICATE_TRANSACTION_ID` | 400 | This transaction has already been used | Screenshot reuse attempt |

### Trade Errors (HTTP 400 / 409)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `TRADE_AD_NOT_FOUND` | 404 | This listing is no longer available | Ad deleted or deactivated |
| `TRADE_AD_INACTIVE` | 409 | This listing is currently paused | Seller paused their ad |
| `TRADE_BELOW_AD_MINIMUM` | 400 | Minimum trade amount for this listing is [value] | Under seller's min |
| `TRADE_ABOVE_AD_MAXIMUM` | 400 | Maximum trade amount for this listing is [value] | Over seller's max |
| `TRADE_INSUFFICIENT_SELLER_BALANCE` | 409 | Seller does not have enough USDT for this trade | Seller escrow failed |
| `TRADE_TOO_MANY_ACTIVE` | 409 | You already have 3 active trades. Complete one first. | Simultaneous trade limit |
| `TRADE_SELF_TRADE` | 409 | You cannot trade with your own listing | Buyer = seller |
| `TRADE_PAYMENT_WINDOW_EXPIRED` | 409 | Payment window has expired. Trade was cancelled. | Timer ran out |
| `TRADE_ALREADY_PAID` | 409 | Payment has already been submitted for this trade | Duplicate submission |
| `TRADE_NOT_IN_CORRECT_STATE` | 409 | This action is not allowed in the current trade state | State machine violation |
| `TRADE_SCREENSHOT_LIMIT_REACHED` | 409 | Maximum screenshot attempts reached. Trade cancelled. | 3 failures |
| `TRADE_CANCELLATION_LIMIT` | 429 | You have cancelled too many trades today | 5 cancellations/day |
| `TRADE_AD_PAYMENT_METHOD_MISMATCH` | 400 | Your saved payment method does not match this listing | Payment method filter |

### Instant Buy Errors (HTTP 400 / 409)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `IB_TOKEN_NOT_FOUND` | 404 | Token not found or not available | Invalid token ID |
| `IB_TOKEN_UNAVAILABLE` | 409 | This token is temporarily unavailable | Admin disabled / inventory critical |
| `IB_QUOTE_EXPIRED` | 409 | Quote has expired. Please request a new quote. | 10-minute window passed |
| `IB_QUOTE_NOT_FOUND` | 404 | Quote not found or already used | Quote ID invalid |
| `IB_INSUFFICIENT_INVENTORY` | 409 | Not enough inventory to fill this order | Stock too low |
| `IB_PENDING_ORDERS_LIMIT` | 409 | You have 3 pending orders. Complete or cancel one first. | Simultaneous order limit |
| `IB_DAILY_LIMIT_REACHED` | 429 | Daily order limit reached. Try again tomorrow. | 10 orders/day |
| `IB_SPENDING_LIMIT_EXCEEDED` | 400 | This order exceeds your daily spending limit | KYC tier limit |
| `IB_ORDER_NOT_FOUND` | 404 | Order not found | Invalid order ID |
| `IB_ORDER_ALREADY_COMPLETE` | 409 | Order is already completed | Double-action attempt |
| `IB_ORDER_CANCELLED` | 409 | This order has been cancelled | Action on dead order |
| `IB_SCREENSHOT_LIMIT_REACHED` | 409 | Maximum proof submissions reached. Order cancelled. | 3 failures |
| `IB_NETWORK_MISMATCH` | 400 | Wallet address does not match the selected network | Wrong chain address |
| `IB_ADDRESS_BLACKLISTED` | 400 | This wallet address cannot be used | Fraud blacklist |

### KYC Errors (HTTP 400 / 409)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `KYC_ALREADY_APPROVED` | 409 | Your KYC is already verified | Trying to re-submit when approved |
| `KYC_PENDING_REVIEW` | 409 | Your KYC submission is currently under review | Already has pending submission |
| `KYC_SUBMISSION_LIMIT` | 429 | Maximum KYC submission attempts reached | 5 lifetime attempts |
| `KYC_CNIC_DUPLICATE` | 409 | This CNIC is already registered to another account | Duplicate CNIC detection |
| `KYC_FACE_DUPLICATE` | 409 | A matching face has been detected on another account | Duplicate face detection |
| `KYC_DOCUMENT_EXPIRED` | 400 | Your CNIC appears to be expired | CNIC expiry date passed |
| `KYC_LIVENESS_FAILED` | 400 | Liveness check failed. Please try in good lighting. | Anti-spoofing failed |
| `KYC_OCR_FAILED` | 400 | Unable to read document. Please upload a clearer image. | OCR returned empty |

### Server Errors (HTTP 500 / 503)

| Code | HTTP | Message | When |
|------|------|---------|------|
| `INTERNAL_ERROR` | 500 | An unexpected error occurred. Our team has been notified. | Unhandled exception |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable. Please try again shortly. | Dependency down |
| `BLOCKCHAIN_RPC_ERROR` | 503 | Blockchain network temporarily unreachable. Please retry. | RPC node failure |
| `OCR_SERVICE_ERROR` | 503 | Verification service temporarily unavailable | Google Vision / PaddleOCR down |
| `PAYMENT_PROCESSING_TIMEOUT` | 504 | Payment verification timed out. Your submission is saved and will be reviewed shortly. | OCR job timeout |
| `QUEUE_OVERLOADED` | 503 | System is experiencing high demand. Your request is queued. | BullMQ queue depth exceeded |
| `DUPLICATE_REQUEST` | 409 | This request is already being processed | Idempotency key match |

---

## 5. EDGE CASE HANDLING — P2P TRADES

| Edge Case | What Happens | System Action |
|-----------|--------------|---------------|
| Buyer pays but forgets to click "I've Paid" | Trade timer expires | Trade auto-cancelled; USDT returned to seller. Buyer can open dispute if they actually paid. |
| Buyer pays correct amount but to wrong account | Seller claims not received | Treated as non-payment by default. Buyer must prove payment to correct account. If wrong account: buyer's problem, seller wins dispute. |
| Buyer sends partial payment | Screenshot shows wrong amount | AI flags amount mismatch. Admin rejects. Buyer told to send remaining or cancel. |
| Seller goes offline during active trade | Seller unresponsive to release prompt | After 45 min from payment approval: admin can force-release (Section 4 of Doc 12). |
| Network outage — buyer cannot upload screenshot | Timer is running | Timer still runs. User should reach out to support. Admin can manually pause timer if outage confirmed. This requires senior_admin action. |
| Screenshot uploaded but AI job crashes | OCR queue failure | Job retried up to 3 times (exponential backoff: 30s, 2m, 10m). If all retries fail: order moves to `pending_admin_review` with flag `ocr_failed = true`. Admin reviews without AI results. |
| Seller accepts payment but tries to cancel trade | Seller presses cancel | If trade is in `buyer_paid` state or later: cancel button disabled for seller. Seller can only open a dispute. |
| Same buyer and seller have 3+ simultaneous trades | N/A — blocked | System prevents initiating a new trade with the same counterparty if there are already 2 active trades between them. |
| Buyer opens dispute immediately after paying | Before admin reviews | Dispute opens. Payment verification queue item kept. Admin reviews payment proof as part of dispute resolution. |
| Ad price changes while trade is active | N/A — does not apply | Price is locked at trade initiation. Ad owner can change price for future trades only. |
| Seller deletes ad while trade is active | N/A — does not apply | Active trades linked to the ad continue normally. Deleting an ad only prevents new trades. |
| USDT amount in escrow is short due to fee calculation error | Rounding discrepancy | Platform fee calculation uses `Math.floor` (round down to 6 decimal places for USDT). Any sub-satoshi shortfall is absorbed by platform fee. |

---

## 6. EDGE CASE HANDLING — INSTANT BUY

| Edge Case | What Happens | System Action |
|-----------|--------------|---------------|
| Quote expires while user is on payment screen | 10-minute window passed | Order marked `expired`. User shown: "Your quote expired. Start a new order to get a fresh price." No charge. |
| Quote expires while admin is reviewing screenshot | Admin still processes it | See Section 6 of Doc 12. Admin can still approve/reject. Payout uses current market price. If >2% worse for user: escalate to senior_admin. |
| User submits screenshot of a screenshot (photo of phone screen) | Manipulation detection may flag | AI checks for double-compression and screen moiré patterns. If flagged: WARN. Admin checks manually. |
| Network congestion — payout transaction not confirmed in expected time | Confirmation taking longer than expected | Payout job monitors for up to 6 hours. If not confirmed: alert senior_admin. Manual investigation. Do NOT rebroadcast automatically (risk of double-send). |
| Payout transaction fails (insufficient gas / network error) | Broadcast failed | Requeue in payout-queue with higher gas estimate. Max 3 retry attempts. If all fail: senior_admin alert. Order stays `releasing` state. Manual intervention required. |
| User submits wrong wallet address (correct format, wrong actual address) | Platform sends to that address | Validated for format only. Platform cannot verify the address is the user's own. No reversal possible once broadcast. User warned: "Verify your address carefully. Sent funds cannot be recovered." |
| User submits correct-network address but wrong token (e.g., ERC-20 address for BEP-20 order) | Address format is the same (0x...) | Platform sends on BSC to that 0x address. If user's address is an ETH-only wallet, user may need to add BSC network to see funds. Platform cannot distinguish — user bears responsibility. Warning shown on address entry screen. |
| Inventory drops to zero mid-queue | New orders filling while last inventory sold | Stock check happens at order creation AND at payout time. If inventory is 0 at payout: order stays in `admin_approved` state. Admin must either top up inventory or cancel the order (full refund to user). |
| Provider is offline/unavailable when order is matched to their inventory | Provider not responding | Instant Buy uses platform inventory for MVP. In Phase 2 (merchant providers): if merchant's inventory is used, platform guarantees fulfillment regardless of merchant availability. Merchant liability clause in provider agreement. |
| User tries to create same order twice (double-click) | Duplicate request | Idempotency key (hash of user_id + token + amount + timestamp rounded to 10s) prevents duplicate orders. Second request returns `DUPLICATE_REQUEST` error. |
| OCR job takes longer than 3 minutes (very busy) | Job in queue | User-facing status shows "Verification in progress." After 5 minutes without result: move to `pending_admin_review` with `ocr_timeout = true` flag. Admin reviews manually without AI results. |

---

## 7. EDGE CASE HANDLING — KYC

| Edge Case | What Happens | System Action |
|-----------|--------------|---------------|
| User uploads CNIC photo taken at an angle | OCR may partially fail | If confidence < 70% on extracted fields: return `KYC_OCR_FAILED` with message "Please upload a straight-on photo of your CNIC." Do not auto-reject — give user chance to re-upload. |
| User's CNIC is in Urdu text only | OCR must handle Urdu | EasyOCR supports Urdu script. If extraction fails: fallback to manual admin review. Flag submission with `ocr_language = 'ur'` for manual priority queue. |
| User's face is obscured (glasses, niqab) | Face match may fail | Liveness check still runs. If face match confidence < 60%: move to manual review. Admin can approve based on visual inspection if documents are otherwise valid. |
| User's CNIC is expired by less than 1 year | Reject or accept? | Reject. Policy: CNIC must be valid at time of submission. User must renew their CNIC and resubmit. Error: `KYC_DOCUMENT_EXPIRED`. |
| KYC is approved but user wants Level 2 after already having Level 1 | Upgrade path | User submits Level 2 documents. New `kyc_submissions` record created. Previous Level 1 approval remains active during review. If Level 2 approved: `user.kyc_level` updated to 2. |
| User's selfie lighting is too dark | Face match fails | Return error: "Please take your selfie in well-lit conditions." Allow resubmission in same session (up to 3 attempts). If 3 fail: submission rejected, user must start over. |
| AI results arrive but admin SLA has already breached | Late review | Admin reviews, result recorded. SLA breach is flagged separately in compliance report. Decision is still valid. Do not skip admin review due to SLA breach. |
| Level 3 (EDD) triggered automatically mid-trading | User hits 500K PKR cumulative | System flags account: `kyc_level_3_required = true`. User can complete existing active trades. New trades above 50K PKR blocked until EDD complete. |

---

## 8. EDGE CASE HANDLING — SCREENSHOTS & OCR

| Edge Case | System Behavior |
|-----------|----------------|
| Screenshot is a PDF (bank statement) | Accept PDF. Extract first page only. OCR on first page. If relevant transaction found within page: proceed. If not found: admin reviews all pages manually. |
| Screenshot has watermark / "VOID" text | Flag as suspicious. AI confidence penalized. Move to admin review with `manipulation_flag = 'watermark_detected'`. |
| Screenshot is in a language other than Urdu/English | Log `ocr_language_unsupported`. Move to admin review. Admin checks visually. |
| Two transactions on the same screenshot | AI looks for the transaction that matches the expected amount. If ambiguous: flag for admin review. |
| Screenshot timestamp is in future | Hard reject. Return `VALIDATION_ERROR` with message "Screenshot timestamp is in the future. This screenshot cannot be accepted." Create risk flag on user. |
| Screenshot is from a sandbox / test mode payment app | AI may not detect this. Admin must visually verify. After first occurrence: known test-mode visual signatures are added to manipulation detection rules. |
| OCR extracts amount with comma formatting (e.g., "50,000") | Normalize: strip commas, parse as float. Compare numerically. |
| OCR extracts amount in mixed Urdu-Arabic numerals | Convert Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to Western numerals before comparison. |
| Same screenshot submitted on two different trades | Duplicate detection via perceptual hash (pHash). Hard reject on duplicate. Create risk flag on user. Error: `DUPLICATE_TRANSACTION_ID`. |
| Google Vision API is completely down | Fallback to PaddleOCR (self-hosted). If PaddleOCR also fails: job marked `ocr_failed`, moves to admin review queue. Admin notified. SLA clock starts from OCR failure time. |
| Screenshot file is valid image but blank / all white | OCR returns empty. Return `KYC_OCR_FAILED` / `VALIDATION_ERROR`. User instructed to re-upload. |

---

## 9. EDGE CASE HANDLING — BLOCKCHAIN & PAYMENTS

| Edge Case | System Behavior |
|-----------|----------------|
| Blockchain RPC node is down | Failover to backup RPC provider (Alchemy as fallback for ETH/BSC). If both down: `BLOCKCHAIN_RPC_ERROR`. Queue deposit monitoring jobs; retry every 60s for up to 6 hours. |
| Transaction detected but has 0 confirmations | Do not process. Wait for minimum confirmations per chain (see Doc 09 for per-chain confirmation requirements). |
| Transaction detected but amount is wrong (e.g., user sends less than order amount) | Do not release. Flag order as `amount_mismatch`. Alert admin. Admin decides: refund (minus gas) or allow user to top up (not supported in MVP — refund only). |
| Same transaction hash reported twice (webhook duplication) | Idempotency on tx_hash. Second event with same hash is silently ignored. |
| Chain reorganization (reorg) removes a confirmed transaction | Detected when confirmed tx disappears from canonical chain. Order moved back to `monitoring` state. Admin alerted. Manual review required. |
| User sends to deposit address after order expired | Funds arrive but order is expired. Flag as `orphan_deposit`. Admin reviews. Refund to user manually minus gas. This is an exceptional case. |
| Transaction confirmed on wrong network (e.g., BSC when ETH expected) | System only monitors the correct chain. Funds arrive on wrong chain — not detectable. Platform cannot recover cross-chain sends. Warning shown to user: "Verify the network carefully. Cross-network sends cannot be recovered." |
| Gas fee spike makes payout uneconomic (gas > 5% of payout value) | Payout job pauses. Alert senior_admin. Admin decides: delay payout (wait for lower gas) or absorb gas cost. Order stays `admin_approved`. User notified of delay. |
| Hot wallet balance is insufficient for payout (inventory drained faster than replenished) | Payout job fails with `IB_INSUFFICIENT_INVENTORY`. Order stays `admin_approved`. Admin alerted immediately. Instant Buy for that token paused until inventory topped up. User notified: "Your order is being processed. Expected completion: [estimate]." |
| TRON network freeze (energy/bandwidth exhaustion) | TRC-20 transfers fail. Fallback: use BEP-20 (BSC) USDT deposit address instead. Admin can switch default network for affected users. |

---

## 10. WEBSOCKET ERROR STATES

WebSocket connections are used for real-time trade room updates, order status, and admin notification.

### Connection Error Handling

| Scenario | Client Behavior | Server Behavior |
|----------|----------------|----------------|
| Client disconnects mid-trade | Show "Reconnecting…" banner | Server holds the trade state. Events queued. On reconnect: send missed events via `sync` message. |
| Server restart during active trade | Client WebSocket drops | Client auto-reconnects using exponential backoff (1s, 2s, 4s, 8s, max 30s). Server sends `sync` with full current state on reconnect. |
| Client sends message to ended trade | Server rejects with error | `WS_ERROR: TRADE_ENDED` — trade is no longer active |
| Client sends message with invalid JWT | Immediate disconnect | Server sends `WS_ERROR: AUTH_TOKEN_INVALID` then closes connection |
| Admin WebSocket disconnects during review | Admin review session pauses | Trade review timer pauses if in progress. On reconnect: state restored. |
| Too many WebSocket connections from same user | Reject additional connections | Max 3 simultaneous WebSocket connections per user (browser + mobile + admin view). 4th connection rejected with `WS_ERROR: TOO_MANY_CONNECTIONS`. |

### WebSocket Event Error Codes

| Code | Trigger |
|------|---------|
| `WS_ERROR: AUTH_TOKEN_INVALID` | Bad or expired JWT on connect |
| `WS_ERROR: TRADE_NOT_FOUND` | Subscribe to non-existent trade |
| `WS_ERROR: NOT_IN_TRADE` | Message sent to trade user is not part of |
| `WS_ERROR: TRADE_ENDED` | Action on completed/cancelled trade |
| `WS_ERROR: MESSAGE_TOO_LONG` | Chat message > 500 characters |
| `WS_ERROR: RATE_LIMITED` | Message rate limit hit (30 messages / 5 min) |
| `WS_ERROR: TOO_MANY_CONNECTIONS` | 4th connection attempt |
| `WS_ERROR: SERVER_ERROR` | Unhandled server exception on this connection |

---

## 11. ADMIN API RATE LIMITS

Admin panel has stricter, separate rate limits enforced on the admin JWT (separate Redis namespace: `admin_ratelimit`).

| Action | Limit | Window | Notes |
|--------|-------|--------|-------|
| All admin API requests | 100 requests | 1 minute | Per admin user ID |
| Bulk actions (e.g., bulk suspend) | 10 actions | 1 minute | Prevent mass accidental actions |
| KYC decisions | 50 decisions | 1 hour | Unusually high rate triggers alert to super_admin |
| Payment approvals/rejections | 30 actions | 1 hour | Same |
| User suspension | 20 actions | 1 hour | Same |
| Permanent bans | 5 actions | 24 hours | Hard limit regardless of role (except super_admin: 10) |
| Export / download requests | 5 exports | 1 hour | Prevent data exfiltration via export endpoint |
| Admin login attempts | 5 attempts | 1 hour | Lock admin account; alert super_admin |

---

## 12. RATE LIMIT RESPONSE FORMAT

### Standard Rate Limit Response (HTTP 429)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests.",
    "user_message": "آپ نے بہت زیادہ کوششیں کی ہیں۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔",
    "retry_after_seconds": 3600,
    "limit_type": "login_attempts",
    "reset_at": "2026-05-05T14:30:00Z"
  }
}
```

### Business Rule Limit Response (HTTP 409)

```json
{
  "error": {
    "code": "TRADE_TOO_MANY_ACTIVE",
    "message": "You already have 3 active trades. Complete or cancel one first.",
    "user_message": "آپ کے 3 فعال ٹریڈ پہلے سے موجود ہیں۔",
    "details": {
      "active_trade_count": 3,
      "max_allowed": 3,
      "active_trade_ids": ["uuid1", "uuid2", "uuid3"]
    }
  }
}
```

### Validation Error Response (HTTP 400) — Multi-field

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": {
      "fields": [
        {
          "field": "wallet_address",
          "code": "INVALID_WALLET_ADDRESS",
          "message": "Invalid BEP-20 address. Must start with 0x and be 42 characters."
        },
        {
          "field": "amount",
          "code": "AMOUNT_BELOW_MINIMUM",
          "message": "Minimum order amount is 1000 PKR."
        }
      ]
    }
  }
}
```

---

## 13. QUEUE & JOB ERROR STATES

### BullMQ Queue Error Handling

| Queue | Job Type | Max Retries | Backoff | On Final Failure |
|-------|----------|-------------|---------|-----------------|
| `ocr-jobs` | Screenshot OCR | 3 | Exponential: 30s, 2m, 10m | Move to `pending_admin_review` with `ocr_failed = true` |
| `kyc-review` | KYC AI processing | 3 | Exponential: 30s, 2m, 10m | Move to `pending_admin_review` with `ai_failed = true` |
| `deposit-events` | Blockchain deposit detection | 5 | Exponential: 10s, 30s, 2m, 10m, 30m | Alert senior_admin; event logged for manual check |
| `payout-queue` | Crypto payout broadcast | 3 | Exponential: 60s, 5m, 30m | Alert senior_admin; order stays `releasing`; DO NOT cancel automatically |
| `notifications` | Push / email / SMS sends | 3 | Fixed: 30s | Log failure; no user impact (best-effort delivery) |

### Dead Letter Queue (DLQ)

All failed jobs after max retries are moved to a Dead Letter Queue:
- DLQ is reviewed by senior_admin weekly
- Jobs in DLQ are never automatically retried — manual re-queue only
- DLQ alerts: if DLQ size exceeds 50 items for `payout-queue` or `deposit-events`, immediate alert to super_admin
- DLQ retention: 30 days before permanent deletion

### Job Idempotency

| Queue | Idempotency Key | Why |
|-------|----------------|-----|
| `payout-queue` | `order_id` | Prevent double-payout if job is retried after partial execution |
| `deposit-events` | `chain:tx_hash:log_index` | Prevent double-crediting from duplicate webhook events |
| `ocr-jobs` | `screenshot_file_hash` | Prevent double-processing of same file |
| `kyc-review` | `kyc_submission_id` | Prevent duplicate AI runs |

### Redis Failure Contingency

If Redis goes down:
1. BullMQ jobs cannot be enqueued
2. Rate limiting is bypassed (fail-open for user experience) — log all requests for post-recovery audit
3. Sessions still work (JWT is stateless)
4. WebSocket connections drop (Redis Pub/Sub used for multi-node WS)
5. Alert fires immediately to all admins
6. Recovery: Redis restores from AOF/RDB. BullMQ jobs that were in-flight before failure: check DB state and manually re-queue if needed.

---

*End of Rate Limits & Error States — Document 13*
*This document must be read alongside: 07_PAKSWAP_COMPLETE_MASTER_PLAN.md (Section 11 — Two-Layer Policy), 11_TECH_STACK_DECISIONS.md (queue and Redis configuration), 12_ADMIN_WORKFLOW_SPEC.md (SLA reference)*
