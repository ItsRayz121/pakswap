# PAKSWAP — ADMIN WORKFLOW SPECIFICATION
## Step-by-Step Admin Action Flows for Every Admin Operation

> **Document:** 12 — Admin Workflow Spec
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Pre-Development
> **Audience:** Backend developers, frontend developers building admin panel, QA team

---

## TABLE OF CONTENTS

1. [Admin Roles and Access Levels](#1-admin-roles-and-access-levels)
2. [Admin Authentication Flow](#2-admin-authentication-flow)
3. [KYC Review Workflow](#3-kyc-review-workflow)
4. [P2P Trade — Payment Approve / Reject](#4-p2p-trade--payment-approve--reject)
5. [P2P Trade — Dispute Resolution](#5-p2p-trade--dispute-resolution)
6. [Instant Buy — Payment Verification (PKR Mode)](#6-instant-buy--payment-verification-pkr-mode)
7. [Instant Buy — Order Override](#7-instant-buy--order-override)
8. [Merchant / Provider Application Review](#8-merchant--provider-application-review)
9. [User Account Actions](#9-user-account-actions)
10. [Platform Inventory Management (Instant Buy)](#10-platform-inventory-management-instant-buy)
11. [Risk & Fraud Review Queue](#11-risk--fraud-review-queue)
12. [Admin Audit Log Requirements](#12-admin-audit-log-requirements)
13. [SLA Reference Table](#13-sla-reference-table)
14. [Admin Panel Page Map](#14-admin-panel-page-map)

---

## 1. ADMIN ROLES AND ACCESS LEVELS

### Role Hierarchy

| Role | Code | Description |
|------|------|-------------|
| Super Admin | `super_admin` | Full access. Can create/demote other admins. Only role that can touch token config and fee settings. |
| Senior Admin | `senior_admin` | Full operational access. Cannot modify token config or create other admins. |
| KYC Reviewer | `kyc_reviewer` | KYC queue only. Cannot see trades, disputes, or financial data. |
| Trade Admin | `trade_admin` | P2P trade management, disputes, Instant Buy queue. Cannot see KYC document images. |
| Risk Analyst | `risk_analyst` | Read-only access to risk flags, transaction history, user profiles. Cannot take actions. |

### Permission Matrix

| Action | super_admin | senior_admin | kyc_reviewer | trade_admin | risk_analyst |
|--------|-------------|--------------|--------------|-------------|--------------|
| Approve / reject KYC | ✅ | ✅ | ✅ | ❌ | ❌ |
| View KYC documents | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve / reject P2P payment | ✅ | ✅ | ❌ | ✅ | ❌ |
| Resolve disputes | ✅ | ✅ | ❌ | ✅ | ❌ |
| Approve Instant Buy payment | ✅ | ✅ | ❌ | ✅ | ❌ |
| Suspend / ban users | ✅ | ✅ | ❌ | ✅ | ❌ |
| View risk flags | ✅ | ✅ | ❌ | ✅ | ✅ |
| Edit token config | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit fee settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create / demote admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve provider applications | ✅ | ✅ | ❌ | ✅ | ❌ |

### Database

```sql
admin_users (
  id, email, password_hash, role ENUM, is_active BOOLEAN,
  ip_allowlist TEXT[],   -- only these IPs can log in as this admin
  last_login_at, created_at
)
```

---

## 2. ADMIN AUTHENTICATION FLOW

Admin login is separate from user login. Different JWT secret, different endpoint, IP allowlist enforced at middleware level.

### Step-by-Step

```
Step 1: Admin navigates to /admin/login (not the public login page)

Step 2: Admin enters email + password
        → Server checks admin_users table (NOT users table)
        → If not found or inactive: return generic "Invalid credentials"

Step 3: Password verified via bcrypt
        → If wrong: increment failed_attempts counter
        → After 5 failed attempts: lock account for 30 minutes, alert super_admin by email

Step 4: IP check
        → Request IP must be in admin_users.ip_allowlist
        → If IP not allowed: reject with "Access denied from this location"
        → Log the denied attempt

Step 5: TOTP 2FA check
        → Admin must enter 6-digit TOTP code (Google Authenticator)
        → 2FA is mandatory for all admin accounts, no exceptions

Step 6: JWT issued
        → Access token: 8-hour expiry (not 15 min like user tokens)
        → Payload includes: admin_id, role, issued_at, ip (bound to issuing IP)
        → Refresh tokens: NOT issued for admin (must re-login after 8 hours)

Step 7: Admin reaches dashboard
        → All subsequent requests validated: JWT signature, IP match, role permissions
```

### Admin Session Security Rules

- Token is IP-bound. If the admin's IP changes mid-session (VPN disconnect, etc.), the token is invalidated immediately.
- Every admin action (not just login) is written to `admin_audit_log` (see Section 12).
- Concurrent sessions from different IPs are not allowed for the same admin account.

---

## 3. KYC REVIEW WORKFLOW

### Overview

KYC submissions go through two layers:
- **Layer 1 (Automated AI):** Runs immediately on submission — CNIC OCR, face match, liveness check, document manipulation detection
- **Layer 2 (Human Admin):** Admin reviews AI results + original documents and makes the final decision

Human admin decision is ALWAYS required. AI results are advisory, not final.

### KYC Submission States

```
submitted → ai_processing → pending_review → approved
                                           → rejected
                                           → escalated → approved
                                                       → rejected
```

### Step-by-Step: Admin Reviews a KYC Submission

```
Step 1: Admin opens KYC Queue
        → Sorted by: oldest first (FIFO), escalated submissions pinned to top
        → Each row shows: user name, KYC level requested, submitted time, AI confidence score, time in queue
        → Color coding: Green (AI passed, >90%), Yellow (AI uncertain, 70-90%), Red (AI flagged, <70% or manipulation detected)

Step 2: Admin clicks a submission to open the review panel
        → Left panel: Original documents (CNIC front, CNIC back, selfie, liveness video if Level 2)
        → Right panel: AI results breakdown
            - CNIC OCR extracted fields (name, CNIC number, DOB, expiry)
            - Face match confidence % (selfie vs CNIC photo)
            - Liveness check result (pass/fail + confidence)
            - Manipulation detection flags (if any)
            - Duplicate CNIC check (is this CNIC already registered?)
            - Duplicate face check (has this face been submitted under another account?)

Step 3: Admin performs manual checks
        → Compare selfie to CNIC photo visually
        → Verify CNIC number format (13 digits, first 5 digits = district code)
        → Check name on CNIC matches name user entered during registration
        → Check expiry date is valid (not expired)
        → Verify liveness video is natural (not a photo of a photo, not a video replay)
        → For Level 2: verify address proof document matches CNIC address

Step 4: Admin makes decision

        APPROVE:
        → Click "Approve" button
        → Select KYC level granted (Level 1 or Level 2)
        → Optional: add a note (visible in audit log, not visible to user)
        → Confirm action in modal ("Are you sure? This will upgrade user to Level 1/2 KYC.")
        → System: updates user.kyc_level, sets kyc_submissions.status = 'approved', 
                  records admin_id + timestamp in kyc_submissions.reviewed_by
        → User receives notification: "Your KYC has been approved. You can now trade up to [limit] PKR/day."

        REJECT:
        → Click "Reject" button
        → REQUIRED: select rejection reason from dropdown:
            - CNIC image unclear / unreadable
            - Selfie does not match CNIC photo
            - CNIC appears expired
            - CNIC appears altered / tampered
            - Liveness check failed (photo held up / video replay detected)
            - Name mismatch between registration and CNIC
            - CNIC already registered to another account
            - Duplicate face detected on another account
            - Address proof missing or invalid (Level 2 only)
        → Optional: add internal note
        → Confirm action in modal
        → System: sets kyc_submissions.status = 'rejected', records reason + admin_id + timestamp
        → User receives notification: "Your KYC was not approved. Reason: [reason]. You may resubmit."
        → User is allowed to resubmit (maximum 5 lifetime attempts; after 5 rejections account is flagged and requires senior_admin manual unlock before further resubmission is permitted — see doc 13 §6 KYC rate limits)

        ESCALATE:
        → Click "Escalate" button
        → Write escalation note (required — must explain why)
        → Submission moves to escalated queue, visible only to senior_admin and super_admin
        → Original reviewer cannot take further action on this submission
        → Senior admin sees the escalation note + all prior review activity

Step 5: SLA timer
        → KYC submission must be reviewed within 2 hours during business hours (9 AM - 10 PM PKT)
        → If approaching SLA breach (30 minutes remaining): admin panel shows red timer, 
          system sends Slack/email alert to senior_admin
        → If SLA breached: automatically escalated + alert sent
```

### KYC Re-submission Rules

- After rejection, user can resubmit immediately (no cooldown unless fraud flag)
- User can resubmit maximum 5 times before account is flagged for manual risk review
- Each re-submission creates a new `kyc_submissions` record (old ones are never deleted — 7-year retention)
- If CNIC already exists on another account: reject + create `fraud_flags` record + alert risk_analyst

---

## 4. P2P TRADE — PAYMENT APPROVE / REJECT

### Context

In a P2P trade, the buyer sends PKR to the seller via JazzCash / Easypaisa / bank. The buyer uploads a screenshot. AI (Layer 1) scans it. Then admin (Layer 2) must make the final decision before the USDT escrow is released to the buyer.

**Key rule: Admin never releases USDT directly. Admin approves the payment. The system then instructs the seller to release, OR admin can force-release if seller is unresponsive (with proper escalation steps).**

### Trade States

```
created → buyer_paid → payment_under_review → payment_approved → seller_releasing → completed
                                            → payment_rejected → buyer_must_repay
                                                               → trade_cancelled
       → expired (buyer never paid within 15 minutes)
       → cancelled_by_buyer (before payment)
       → disputed → resolved_buyer_wins
                 → resolved_seller_wins
```

### Step-by-Step: Admin Reviews a Payment Proof

```
Step 1: Admin opens Trade Verification Queue
        → Sorted by: time screenshot submitted (oldest first)
        → Each row shows: trade ID, buyer name, seller name, amount (PKR + USDT), 
          payment method, AI result (PASS/WARN/FAIL), time waiting
        → WARN and FAIL rows highlighted

Step 2: Admin clicks a trade to open the review panel

        Left panel:
        → Original screenshot (full resolution, cannot be right-clicked / downloaded — 
          display only via signed S3 URL, no permanent URL)
        → Screenshot metadata shown below image: file size, upload timestamp, 
          device reported (if available)

        Right panel — AI Analysis Results:
        → Amount extracted by OCR: [value] | Expected: [trade amount] | Match: YES/NO
        → Payment status extracted: [text] | Recognized as success: YES/NO
        → Sender name extracted: [name] | Buyer registered name: [name] | Fuzzy match: [%]
        → Recipient name extracted: [name] | Seller payment method name: [name] | Match: YES/NO
        → Transaction timestamp: [datetime] | Trade initiated at: [datetime] | Within window: YES/NO
        → Transaction ID: [value] | Previously seen on platform: YES/NO
        → Manipulation flags: [list of flags or "None detected"]
        → Overall AI confidence: [score]% → [PASS / WARN / FAIL]

Step 3: Admin performs manual checks
        → Look at screenshot visually — does it look like a real JazzCash/Easypaisa/bank screenshot?
        → Verify the amount shown in screenshot exactly matches the trade amount
        → Check sender name matches buyer's KYC name
        → Check recipient name matches seller's payment method account name
        → Check timestamp is reasonable (not a screenshot from a week ago)
        → If AI flagged manipulation: zoom in on font rendering, check for copy-paste artifacts

Step 4: Admin makes decision

        APPROVE:
        → Click "Approve Payment"
        → Optional: add note
        → Confirm in modal
        → System actions (in order):
            1. Set trade.payment_status = 'approved'
            2. Set trade.payment_approved_by = admin_id
            3. Send notification to seller: "Payment verified. Please release the USDT now."
            4. Start seller release timer (15 minutes for seller to act)
            5. If seller releases: trade moves to 'completed', USDT sent to buyer's address
        → If seller does NOT release within 15 minutes:
            → Admin receives alert: "Seller [name] has not released after payment approval"
            → Admin can send reminder to seller (system message to trade chat)
            → If seller still does not release within additional 30 minutes:
              → Admin can escalate to "force release" (see below)

        REJECT:
        → Click "Reject Payment"
        → REQUIRED: select rejection reason:
            - Amount in screenshot does not match trade amount
            - Screenshot appears to be manipulated / edited
            - Sender name does not match buyer's KYC name
            - Recipient name does not match seller's payment account
            - Transaction already used in a previous trade (duplicate)
            - Screenshot is too old (timestamp outside acceptable window)
            - Image is unreadable / too blurry
            - Payment method in screenshot does not match selected payment method
        → Confirm in modal
        → System actions:
            1. Set trade.payment_status = 'rejected'
            2. Buyer is notified: "Your payment proof was rejected. Reason: [reason]. 
               Please resubmit a valid screenshot or cancel the trade."
            3. Buyer can re-upload a new screenshot (up to 3 attempts)
            4. Trade timer is paused during re-upload (buyer gets 10 minutes to re-upload)
            5. After 3 failed attempts: trade is cancelled, USDT escrow released back to seller

Step 5: Force Release (Admin Override — Exceptional Cases Only)
        Conditions when allowed:
        → Payment has been approved by admin AND seller is unresponsive for 45+ minutes
        → Seller is confirmed scamming (evidence in dispute)
        
        Process:
        → senior_admin or super_admin only (not trade_admin)
        → Click "Force Release"
        → REQUIRED: write detailed justification (minimum 50 characters)
        → Second admin must confirm (4-eyes principle) — system sends request to another senior_admin
        → Second admin reviews justification + full trade history and clicks Confirm
        → System releases USDT to buyer's address
        → Seller account flagged, risk score increased, incident recorded
        → Both admins' IDs recorded in audit log
```

---

## 5. P2P TRADE — DISPUTE RESOLUTION

### When a Dispute Occurs

Buyer or seller can open a dispute at any point during an active trade. Common reasons:
- Seller claims payment not received but buyer claims they paid
- Buyer claims they paid correct amount but screenshot was rejected
- Seller is unresponsive
- Buyer sent wrong amount
- Suspected fraud from either side

### Dispute States

```
opened → admin_assigned → evidence_collection → under_review → resolved_buyer_wins
                                                             → resolved_seller_wins
                                                             → resolved_partial (rare)
                                              → escalated → resolved by senior admin
```

### Step-by-Step: Admin Works a Dispute

```
Step 1: Admin opens Dispute Queue
        → Sorted by: time opened (oldest first), with escalated pinned to top
        → Each row: dispute ID, trade ID, opened by (buyer/seller), trade amount, reason, 
          hours open, evidence count
        → SLA indicator: disputes must be resolved within 4 hours during business hours

Step 2: Admin clicks dispute to open dispute workspace

        Top section — Trade Summary:
        → Trade ID, creation time, buyer details (name, KYC level, trade history, risk score)
        → Seller details (name, merchant status, completion rate, risk score)
        → Trade amount (PKR + USDT), payment method selected

        Middle section — Timeline:
        → Full chronological log of every action in this trade:
          [timestamp] Trade created
          [timestamp] Buyer marked payment sent
          [timestamp] Screenshot uploaded (link to view)
          [timestamp] AI result: [score] — [PASS/WARN/FAIL]
          [timestamp] Dispute opened by [buyer/seller] — Reason: [text]
          [timestamp] [any subsequent actions]

        Evidence section:
        → Buyer's submitted screenshots (all attempts)
        → Seller's evidence (if submitted) — seller can upload their own bank/JazzCash 
          statement showing no payment received
        → Trade chat log (full message history)

Step 3: Admin collects additional evidence if needed
        → "Request evidence from buyer" — sends buyer a message with specific request 
          (e.g., "Please submit your JazzCash transaction history for today")
        → "Request evidence from seller" — same for seller
        → Both parties have 2 hours to respond, or admin rules based on available evidence
        → Admin can also view: buyer's full trade history, seller's full trade history,
          buyer's risk score history, seller's risk score history

Step 4: Admin makes judgment

        RESOLVE — BUYER WINS (USDT goes to buyer):
        → Evidence supports that payment was made correctly
        → Click "Resolve — Release to Buyer"
        → REQUIRED: write resolution summary (minimum 100 characters, this is shown to both parties)
        → Confirm in modal
        → System actions:
            1. USDT released to buyer's address
            2. Platform fee (0.5%) deducted from released amount
            3. Trade status = 'completed'
            4. Seller's completion rate drops (disputed + lost = counts as failed trade)
            5. Seller's risk score increased
            6. Both parties notified with resolution summary
            7. If clear fraud by seller: seller account flagged, may be suspended (separate action)

        RESOLVE — SELLER WINS (USDT returned to seller):
        → Evidence supports that payment was NOT made or was fraudulent
        → Click "Resolve — Return to Seller"
        → REQUIRED: write resolution summary
        → Confirm in modal
        → System actions:
            1. USDT escrow unlocked and returned to seller's listing (or released back to seller)
            2. Trade status = 'cancelled_dispute_seller_wins'
            3. Buyer's risk score increased
            4. Both parties notified
            5. If buyer submitted fake screenshot: create fraud_flags record, 
               consider suspension (separate action)

        ESCALATE:
        → Case is complex, admin is uncertain, or trade amount is above 500K PKR
        → Click "Escalate"
        → Write escalation reason (required)
        → senior_admin is notified and takes over
        → SLA resets to 4 hours for senior admin

Step 5: Appeal process
        → Either party can appeal within 24 hours of resolution
        → Appeal goes directly to senior_admin queue
        → Maximum 1 appeal per dispute
        → Appeal outcome is final, no further appeals
        → Appeal SLA: 8 hours
```

---

## 6. INSTANT BUY — PAYMENT VERIFICATION (PKR MODE)

### Context

In Instant Buy PKR mode, the user pays JazzCash/Easypaisa/bank and uploads a screenshot. AI scans it. If AI confidence is 70-90% (WARN), admin must review. If AI confidence is ≥90% (PASS), the system marks Layer 1 as complete but admin must still provide Layer 2 approval before tokens are released.

**Two-layer rule applies here identically as in P2P. AI can never auto-release. Admin always reviews.**

### Instant Buy Order States

```
created → quote_locked → payment_submitted → ai_processing → pending_admin_review 
        → admin_approved → releasing → completed
        → admin_rejected → user_resubmit (up to 3 attempts)
                        → cancelled (after 3 failures)
        → expired (user never paid within 10-minute quote window)
        → cancelled_by_user
```

### Step-by-Step: Admin Reviews an Instant Buy Payment

```
Step 1: Admin opens Instant Buy Verification Queue
        → Same layout as P2P queue but scoped to Instant Buy orders
        → Shows: order ID, user name, token purchased, PKR amount, payment method,
          provider name (platform or merchant), AI result, time waiting

Step 2: Admin clicks order to open review panel

        Order summary:
        → Token: [e.g., BNB], Amount: [e.g., 0.05 BNB], PKR equivalent: [value]
        → Rate locked at: [price], Quote locked at: [timestamp], Quote expires at: [timestamp]
        → Destination wallet address: [address] (validated on submission — token-specific)
        → Provider: Platform / [Merchant Name]

        Payment proof panel (same layout as P2P — screenshot + AI breakdown)

Step 3: Admin reviews (same checks as P2P payment review)

Step 4: Admin makes decision

        APPROVE:
        → Click "Approve and Release"
        → Confirm in modal: "This will immediately send [amount] [token] to [address] on [network]."
        → System actions:
            1. Set order.status = 'admin_approved'
            2. Enqueue payout job in payout-queue (BullMQ)
            3. Payout job calls signing service (isolated process, AWS KMS)
            4. Signing service broadcasts transaction
            5. System monitors for on-chain confirmation
            6. On confirmation: order.status = 'completed', user notified with tx hash
        → Admin sees status update in real time (no page refresh needed — WebSocket)

        REJECT:
        → Same rejection reasons as P2P (Section 4)
        → User can resubmit up to 3 times within the same order
        → After 3 rejections: order cancelled, no charge to user
        → Quote is not extended even on rejection — user must create a new order at new price

Step 5: Quote expiry during review
        → If admin has not reviewed and quote expires (10 minutes):
          → Order is NOT automatically cancelled
          → Admin can still approve/reject
          → However, the payout will use the CURRENT market price, not the locked quote price
          → If new price is worse for user by more than 2%: flag for senior_admin to review
          → This edge case is rare (admin SLA is 30 minutes, quote is 10 minutes, 
            so most reviews happen before expiry)
```

---

## 7. INSTANT BUY — ORDER OVERRIDE

Senior admins and super admins can override any Instant Buy order state directly. This is an exceptional action, not a routine workflow.

### Override Actions Available

| Action | Who Can Do It | When Used |
|--------|---------------|-----------|
| Cancel order (refund user) | senior_admin, super_admin | User paid but order stuck in error state |
| Force complete | super_admin only | Transaction confirmed on-chain but system failed to detect |
| Extend quote | senior_admin, super_admin | System error caused quote to expire unfairly |
| Change destination address | super_admin only | User submitted wrong address AND funds not yet sent |
| Requeue payout | senior_admin, super_admin | Payout job failed due to network congestion / gas issue |

### Changing Destination Address Rule

This is extremely high risk. Process:
```
1. User must submit a formal support ticket requesting address change
2. User must verify identity again (re-enter 2FA code)
3. User must provide reason in writing
4. super_admin only (no other role can do this)
5. Two super_admins must both confirm
6. Change is only allowed if: tx has NOT been broadcast yet (order.status != 'releasing')
7. Full change history recorded in audit log
```

---

## 8. MERCHANT / PROVIDER APPLICATION REVIEW

### Context

Merchants apply to become Instant Buy providers. They hold their own crypto inventory and earn a share of the spread when their inventory is used to fill Instant Buy orders.

### Application States

```
submitted → under_review → approved → active
                        → rejected
                        → more_info_requested → resubmitted → under_review
```

### Step-by-Step

```
Step 1: Admin opens Provider Application Queue
        → Shows: applicant name, business type, daily volume capacity (PKR), 
          tokens offered, submission date

Step 2: Admin opens application detail
        → Business information: legal name, business type, years operating, 
          website/social links
        → Experience: which platforms previously operated on, volume history
        → Verification: CNIC or business registration number, bank account details
        → Proposed tokens and daily capacity
        → Wallet addresses for their inventory

Step 3: Admin verification checks
        → Verify CNIC / business registration via KYC system
        → Check if applicant's personal account is already KYC Level 2
        → Check applicant's P2P trading history on PakSwap (if any)
        → Google the business name / phone number for red flags
        → Check proposed wallet addresses are valid (not blacklisted on-chain)

Step 4: Admin makes decision

        APPROVE:
        → Click "Approve Provider"
        → Set commission rate (default: 0.2% of volume, configurable per provider)
        → Set daily volume cap (max PKR per day this provider can fill)
        → Set token permissions (which tokens they are approved for)
        → Confirm
        → System: creates instant_buy_providers record, sends welcome email with 
          provider dashboard access instructions

        REQUEST MORE INFO:
        → Click "Request More Information"
        → Write specific questions (free text)
        → System sends message to applicant
        → Application goes back to 'more_info_requested' state
        → Applicant has 72 hours to respond

        REJECT:
        → Click "Reject"
        → Select reason: Insufficient verification / Low volume capacity / 
          Suspicious activity detected / Business not verifiable / 
          Tokens not supported in current phase
        → Write brief explanation (sent to applicant)
```

---

## 9. USER ACCOUNT ACTIONS

### Available Admin Actions on User Accounts

```
Warning → Trade Suspension (temporary) → Full Suspension → Permanent Ban
```

### Actions and Who Can Take Them

| Action | Role Required | Reversible | Notes |
|--------|---------------|------------|-------|
| Issue warning | trade_admin+ | Yes | Adds note to user profile, user not notified unless specified |
| Trade suspension (1-30 days) | trade_admin+ | Yes | User can view platform but cannot initiate trades or Instant Buy |
| Full suspension | senior_admin+ | Yes | User cannot log in. Shows "account suspended" message. |
| Permanent ban | super_admin only | No (requires super_admin to reverse) | Blocks all access + blacklists CNIC |
| Reset 2FA | senior_admin+ | N/A | Used when user loses 2FA device. Requires user to re-verify identity via KYC. |
| Upgrade KYC level manually | kyc_reviewer+ | Yes | For edge cases where AI failed but documents are clearly valid |
| Reset risk score | senior_admin+ | N/A | Used after investigation concludes user was falsely flagged |
| Flag for manual monitoring | risk_analyst+ | Yes | All this user's future activity gets risk_analyst notifications |

### Step-by-Step: Suspending a User

```
Step 1: Navigate to user profile (Admin > Users > search by email / CNIC / user ID)

Step 2: Review user's history:
        → Trade history (completed, cancelled, disputed)
        → Risk score history + flag reasons
        → KYC status
        → Device fingerprints used
        → IP history
        → Prior warnings or suspensions

Step 3: Click "Account Actions" → "Suspend Account"

Step 4: Fill form:
        → Suspension type: Trade Only / Full Account Access
        → Duration: [1 / 3 / 7 / 14 / 30 days / indefinite]
        → Reason (internal, not shown to user)
        → User-facing message (shown when they try to log in or trade)
        → Notify user by email: Yes / No

Step 5: Confirm
        → If Full Suspension: requires confirmation from a second admin (4-eyes)
        → If Permanent Ban: requires super_admin + second super_admin confirmation

Step 6: System actions:
        → Sets user.account_status accordingly
        → If Full Suspension: invalidates all active JWT sessions immediately
        → Any active trades: moves to 'cancelled_admin_action', USDT escrow returned to seller
        → Any pending Instant Buy orders: cancelled, no charge
        → Records suspension in admin_audit_log
```

---

## 10. PLATFORM INVENTORY MANAGEMENT (INSTANT BUY)

### Who Does This

Only super_admin and senior_admin can manage platform inventory. This is a financial operation.

### Inventory Levels

Each token has three thresholds configured by super_admin:

| Threshold | Action |
|-----------|--------|
| `warning_level` | System sends alert to senior_admin: "BNB inventory below warning level" |
| `critical_level` | Instant Buy for that token is paused. Admin must manually top up and re-enable. |
| `maximum_level` | Alert if inventory goes above this (indicates a deposit error or accounting mismatch) |

### Admin Inventory Actions

```
View current inventory:
→ Admin panel → Inventory → Shows each token: current balance, warning level, 
  critical level, 24h volume, estimated days of runway at current rate

Enable / Disable a token for Instant Buy:
→ Toggle button per token
→ When disabled: token still shows on Instant Buy page but shows "Temporarily unavailable"
→ Requires: senior_admin+

Add inventory (record a top-up):
→ Admin records that X amount of [token] was deposited to hot wallet
→ This is a manual bookkeeping step — admin does NOT control the wallet keys directly
→ signing service handles the actual wallet; admin records the intent and the tx hash
→ Amount is verified against on-chain transaction before inventory balance updates
→ Requires: super_admin only

Reconcile inventory:
→ Admin triggers a reconcile job
→ System queries each blockchain for actual hot wallet balance
→ Compares against internal inventory_balance records
→ Flags any discrepancies above 0.0001 [token] for review
→ Reconciliation runs automatically once per hour; manual trigger available
```

---

## 11. RISK & FRAUD REVIEW QUEUE

### What Goes Into Risk Queue

The system automatically creates `risk_flags` records when:

- User's risk score exceeds 70 (out of 100)
- Payment screenshot matches a previously rejected screenshot (perceptual hash match)
- Same CNIC submitted on multiple accounts
- Same face detected on multiple accounts
- User submits 3+ rejected payment proofs in 24 hours
- Destination wallet address appears on a known fraud wallet list
- User's IP matches a known VPN/proxy exit node (flag only, not auto-block)
- Trade volume spike: user completes 10x their normal daily volume
- New account attempting trade > 50,000 PKR within 24 hours of registration

### Step-by-Step: Risk Analyst Reviews a Flag

```
Step 1: Open Risk Queue
        → Sorted by: risk score descending
        → Each row: user, flag type, risk score, trades in last 7 days, KYC level, flag date

Step 2: Open flag detail
        → Flag type and trigger description
        → User profile summary
        → Recent activity timeline
        → Related flags (if same user has multiple flags)

Step 3: Risk analyst assessment (read-only role — cannot take action directly)
        → Can add a note: "Reviewed. Pattern consistent with [observation]. 
          Recommend [no action / warning / suspension] — escalating to trade_admin."
        → Escalates to trade_admin or senior_admin for action

Step 4: trade_admin or senior_admin sees escalated flag
        → Chooses action from: No action (dismiss flag) / Warning / Trade Suspension / Full Suspension
        → Action taken per Section 9 process
```

---

## 12. ADMIN AUDIT LOG REQUIREMENTS

Every admin action — without exception — must be recorded in `admin_audit_log`.

### Database Schema

```sql
admin_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID NOT NULL REFERENCES admin_users(id),
  action_type     VARCHAR(100) NOT NULL,   -- 'kyc_approved', 'payment_rejected', 'user_suspended', etc.
  target_type     VARCHAR(50),             -- 'kyc_submission', 'trade', 'user', 'order', etc.
  target_id       UUID,                    -- ID of the affected record
  details         JSONB,                   -- Full context: reason, notes, previous state, new state
  ip_address      INET NOT NULL,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)
```

### What Must Be Logged

| Action | What to Include in `details` |
|--------|-------------------------------|
| KYC approved/rejected | kyc_submission_id, user_id, rejection_reason (if reject), ai_confidence_score, admin notes |
| Payment approved/rejected | trade_id, buyer_id, seller_id, amount_pkr, amount_usdt, rejection_reason, ai_result |
| Dispute resolved | dispute_id, trade_id, resolution (buyer/seller wins), resolution_summary |
| User suspended/banned | user_id, suspension_type, duration, reason, previous_status |
| Force release | trade_id, justification, second_confirming_admin_id |
| Order override | order_id, override_type, justification |
| Provider approved/rejected | application_id, decision, commission_rate (if approved), rejection_reason |
| Token enabled/disabled | token_id, previous_state, new_state |
| Address change | order_id, old_address, new_address, justification, both admin IDs |

### Audit Log Rules

- Logs are **append-only** — no admin (including super_admin) can edit or delete audit log records
- Audit logs are retained for **7 years**
- Audit logs are stored in a separate database table with no DELETE permission granted to the application user
- Monthly audit reports are exported to S3 (encrypted) as a compliance record
- Sensitive fields (CNIC numbers, full bank account numbers) are masked in logs: `****1234`

---

## 13. SLA REFERENCE TABLE

| Action Type | SLA | Business Hours Only? | Alert If Breaching |
|-------------|-----|---------------------|-------------------|
| KYC review (Level 1) | 2 hours | Yes (9 AM - 10 PM PKT) | 30 min before breach → alert senior_admin |
| KYC review (Level 2) | 4 hours | Yes | 1 hour before breach → alert senior_admin |
| P2P payment verification | 30 minutes | No (24/7) | 10 min before breach → alert all trade_admins |
| Instant Buy payment verification | 30 minutes | No (24/7) | 10 min before breach → alert all trade_admins |
| Dispute resolution | 4 hours | Yes | 1 hour before breach → alert senior_admin |
| Dispute appeal | 8 hours | Yes | 2 hours before breach → alert super_admin |
| Provider application review | 72 hours | Yes | 24 hours before breach → alert senior_admin |
| Risk flag review | 24 hours | Yes | 6 hours before breach → alert senior_admin |
| Seller release after payment approval | 15 minutes | No (24/7) | On breach → alert trade_admin |
| Force release second confirmation | 2 hours | No (24/7) | 30 min before breach → alert super_admin |

### Outside Business Hours (10 PM - 9 AM PKT)

- P2P and Instant Buy queues must be covered 24/7 (on-call admin rotation)
- KYC and disputes can queue overnight — SLA clock pauses outside business hours
- If a P2P payment verification queue has more than 10 items at any time, on-call admin is paged regardless of time

---

## 14. ADMIN PANEL PAGE MAP

These are the pages that must exist in the admin panel UI. Each page should be accessible from the left-side navigation.

| Page | URL | Primary Role | Key Features |
|------|-----|--------------|--------------|
| Dashboard | /admin | All | Platform stats, queue counts, SLA status, recent alerts |
| KYC Queue | /admin/kyc | kyc_reviewer+ | List + review interface, filters by status/confidence |
| User Management | /admin/users | trade_admin+ | Search, view profile, account actions, trade history |
| P2P Trades | /admin/trades | trade_admin+ | Active trades, verification queue, completed, cancelled |
| Disputes | /admin/disputes | trade_admin+ | Open disputes, evidence workspace, resolution log |
| Instant Buy Orders | /admin/instant-buy | trade_admin+ | Verification queue, order history, override tools |
| Inventory | /admin/inventory | senior_admin+ | Token balances, thresholds, enable/disable, reconcile |
| Token Config | /admin/tokens | super_admin | Token list, networks, fees, wallet addresses |
| Provider Applications | /admin/providers | trade_admin+ | Application queue, approved providers, commission settings |
| Risk & Fraud | /admin/risk | risk_analyst+ | Risk flags, fraud patterns, user risk scores |
| Audit Log | /admin/audit | senior_admin+ | Full log, filters by admin/action/target, export |
| Admin Accounts | /admin/accounts | super_admin | Create/edit admin users, role assignment, IP allowlist |
| Settings | /admin/settings | super_admin | Fee rates, platform toggles, announcement banners |

---

*End of Admin Workflow Specification — Document 12*
*This document must be read alongside: 07_PAKSWAP_COMPLETE_MASTER_PLAN.md (Section 11 — Two-Layer Policy), 08_INSTANT_BUY_OTC_BLUEPRINT.md (Section 15 — Admin Tooling), 10_SCREENSHOT_VERIFICATION_SPEC.md*
