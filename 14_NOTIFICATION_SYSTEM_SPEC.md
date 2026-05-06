# PAKSWAP — NOTIFICATION SYSTEM SPECIFICATION
## Every Notification: Channel, Trigger, Recipient, Message Content

> **Document:** 14 — Notification System Spec
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Pre-Development
> **Audience:** Backend developers, frontend developers, QA team
> **Cross-reference:** Doc 12 (Admin Workflow — SLA alerts), Doc 13 (Rate limits for OTP/SMS)

---

## TABLE OF CONTENTS

1. [Notification Channels Overview](#1-notification-channels-overview)
2. [Channel Decision Matrix — Which Channel for What](#2-channel-decision-matrix--which-channel-for-what)
3. [User Notification Preferences](#3-user-notification-preferences)
4. [P2P Trade Notifications](#4-p2p-trade-notifications)
5. [Instant Buy Notifications](#5-instant-buy-notifications)
6. [KYC Notifications](#6-kyc-notifications)
7. [Account & Security Notifications](#7-account--security-notifications)
8. [Admin Internal Alerts](#8-admin-internal-alerts)
9. [Onboarding Notification Sequence](#9-onboarding-notification-sequence)
10. [Email Templates](#10-email-templates)
11. [SMS Templates](#11-sms-templates)
12. [In-App Notification Center](#12-in-app-notification-center)
13. [Push Notification Configuration](#13-push-notification-configuration)
14. [Database Schema](#14-database-schema)
15. [Technical Implementation](#15-technical-implementation)

---

## 1. NOTIFICATION CHANNELS OVERVIEW

PakSwap uses four notification channels. Each has a different purpose, cost, and urgency level.

| Channel | Provider | Purpose | Can User Opt Out? | Cost |
|---------|----------|---------|-------------------|------|
| **In-App Alert** | Internal (WebSocket + DB) | Real-time status updates while app is open | No — always shown | Free |
| **Push Notification** | Firebase Cloud Messaging (FCM) | Urgent alerts when app is closed / backgrounded | Yes (except security alerts) | Free |
| **Email** | SendGrid | Formal confirmations, summaries, receipts | Partial (transactional cannot be opted out) | ~$0.001/email |
| **SMS** | Twilio (Pakistan: Jazz/Telenor routing) | Critical security events only (OTP, login alerts) | No — security channel, mandatory | ~$0.02/SMS |

### Channel Priority (Highest to Lowest)

```
SMS (security critical) > Push (urgent) > In-App (real-time) > Email (summary/receipt)
```

For most events, multiple channels fire together. See Section 2 for the exact combination per event.

---

## 2. CHANNEL DECISION MATRIX — WHICH CHANNEL FOR WHAT

| Event Category | In-App | Push | Email | SMS |
|----------------|--------|------|-------|-----|
| OTP codes | ❌ | ❌ | ❌ | ✅ |
| Login from new device | ✅ | ✅ | ✅ | ✅ |
| Password changed | ✅ | ✅ | ✅ | ✅ |
| 2FA enabled/disabled | ✅ | ✅ | ✅ | ✅ |
| Trade initiated | ✅ | ✅ | ❌ | ❌ |
| Buyer marked as paid | ✅ | ✅ | ❌ | ❌ |
| Payment approved | ✅ | ✅ | ❌ | ❌ |
| Payment rejected | ✅ | ✅ | ✅ | ❌ |
| Trade completed | ✅ | ✅ | ✅ | ❌ |
| Trade cancelled | ✅ | ✅ | ❌ | ❌ |
| Dispute opened | ✅ | ✅ | ✅ | ❌ |
| Dispute resolved | ✅ | ✅ | ✅ | ❌ |
| Timer warning (2 min left) | ✅ | ✅ | ❌ | ❌ |
| Timer expired | ✅ | ✅ | ❌ | ❌ |
| Instant Buy order created | ✅ | ✅ | ✅ | ❌ |
| Instant Buy token sent | ✅ | ✅ | ✅ | ❌ |
| Instant Buy order expired | ✅ | ✅ | ❌ | ❌ |
| KYC submitted | ✅ | ❌ | ✅ | ❌ |
| KYC approved | ✅ | ✅ | ✅ | ❌ |
| KYC rejected | ✅ | ✅ | ✅ | ❌ |
| Admin SLA breach | ❌ | ❌ | ✅ | ❌ |
| Low inventory alert | ❌ | ❌ | ✅ | ❌ |
| Daily trade summary | ❌ | ❌ | ✅ | ❌ |
| Welcome / registration | ✅ | ❌ | ✅ | ❌ |
| Referral bonus credited | ✅ | ✅ | ✅ | ❌ |

---

## 3. USER NOTIFICATION PREFERENCES

Users can control a subset of notifications. Security-critical channels (SMS for OTP, login alerts) cannot be disabled.

### Settings Screen — Notification Toggles

```
SECURITY (cannot be disabled)
  [ON — locked]  Login from new device alerts
  [ON — locked]  Password change confirmations
  [ON — locked]  OTP codes

TRADING
  [toggle]  Push: New trade activity (buyer paid, seller released, etc.)
  [toggle]  Push: Trade timer warnings
  [toggle]  Email: Trade completion receipts

INSTANT BUY
  [toggle]  Push: Order status updates
  [toggle]  Email: Order confirmation and receipt

KYC
  [toggle]  Push: KYC status updates
  [toggle]  Email: KYC approval/rejection emails

PROMOTIONS (default: off)
  [toggle]  Push: Platform announcements
  [toggle]  Email: Weekly market updates, promotions
```

### Database

User preferences stored in `user_notification_preferences` table:
```sql
user_id, channel ENUM('push','email','sms'), category ENUM('trading','instant_buy','kyc','security','promotions'), is_enabled BOOLEAN
```

Notification system checks preferences before sending. If `is_enabled = false` for a channel+category combination: skip that channel. Security category is never checked — always send.

---

## 4. P2P TRADE NOTIFICATIONS

### 4.1 Trade Initiated (Buyer starts trade with Seller)

**Recipient:** Seller
**Trigger:** `POST /trades` — new trade created, escrow locked

| Channel | Message |
|---------|---------|
| In-App | Bell icon + banner: "New trade request from [Buyer Name] for [X] USDT — [Y] PKR" |
| Push | "New Trade Request — [Buyer Name] wants to buy [X] USDT for [Y] PKR. Respond now." |

---

### 4.2 Buyer Marked Payment as Sent

**Recipient:** Seller
**Trigger:** Buyer clicks "I've Paid" button

| Channel | Message |
|---------|---------|
| In-App | Trade room updates live: "Buyer has submitted payment proof. Awaiting verification." |
| Push | "Payment Submitted — [Buyer Name] has submitted payment proof for trade #[ID]. Review in progress." |

---

### 4.3 Payment Approved by Admin

**Recipients:** Both Buyer and Seller
**Trigger:** Admin clicks "Approve Payment" (Layer 2 approval)

| Channel | Recipient | Message |
|---------|-----------|---------|
| In-App | Seller | "Payment verified ✓ — Please release the USDT to complete this trade. You have 15 minutes." |
| Push | Seller | "Payment Verified — Please release [X] USDT to [Buyer Name]. 15-minute window started." |
| In-App | Buyer | "Payment confirmed ✓ — Waiting for seller to release USDT." |
| Push | Buyer | "Payment Confirmed — Your payment was verified. Seller is releasing USDT." |

---

### 4.4 Payment Rejected by Admin

**Recipient:** Buyer
**Trigger:** Admin clicks "Reject Payment"

| Channel | Message |
|---------|---------|
| In-App | "Payment proof rejected — Reason: [rejection reason]. Please resubmit a valid screenshot or cancel the trade. Attempts remaining: [N]." |
| Push | "Payment Proof Rejected — [Rejection reason]. Resubmit or cancel trade #[ID]." |
| Email | Subject: "Payment proof rejected for Trade #[ID]" — see email template in Section 10 |

---

### 4.5 Trade Completed

**Recipients:** Both Buyer and Seller
**Trigger:** USDT successfully sent to buyer's wallet address

| Channel | Recipient | Message |
|---------|-----------|---------|
| In-App | Buyer | "Trade Complete ✓ — [X] USDT has been sent to your wallet. Transaction: [tx_hash_short]" |
| Push | Buyer | "USDT Received — [X] USDT sent to your wallet. Trade #[ID] complete." |
| Email | Buyer | Trade receipt — see Section 10 |
| In-App | Seller | "Trade Complete ✓ — [Y] PKR received. USDT released. Fee: [Z] USDT." |
| Push | Seller | "Trade Completed — [Y] PKR from [Buyer Name]. Trade #[ID] done." |
| Email | Seller | Trade receipt — see Section 10 |

---

### 4.6 Trade Cancelled

**Recipients:** Both parties
**Trigger:** Auto-cancel (timer expired) or manual cancel

| Channel | Recipient | Message |
|---------|-----------|---------|
| In-App | Buyer | "Trade Cancelled — Trade #[ID] was cancelled. [Reason: timer expired / you cancelled / seller cancelled]." |
| Push | Buyer | "Trade Cancelled — Trade #[ID] with [Seller Name] has been cancelled." |
| In-App | Seller | "Trade Cancelled — Trade #[ID] cancelled. USDT returned to your listing." |
| Push | Seller | "Trade Cancelled — Buyer did not pay in time. USDT returned to listing." |

---

### 4.7 Timer Warning — 2 Minutes Remaining

**Recipient:** Buyer (only)
**Trigger:** 13 minutes elapsed since trade created (2 minutes left on 15-minute window)

| Channel | Message |
|---------|---------|
| In-App | Red countdown banner in trade room: "⚠ 2 minutes left to submit payment proof!" |
| Push | "⚠ Hurry! 2 minutes left to pay for Trade #[ID] with [Seller Name]." |

---

### 4.8 Dispute Opened

**Recipients:** Both parties + assigned admin
**Trigger:** Either party clicks "Open Dispute"

| Channel | Recipient | Message |
|---------|-----------|---------|
| In-App | Other party | "Dispute opened — [Name] has opened a dispute on Trade #[ID]. An admin will review and contact you." |
| Push | Other party | "Dispute Opened — Trade #[ID] is under dispute review. Keep your evidence ready." |
| Email | Both parties | Dispute confirmation — see Section 10 |
| In-App | Admin | "New Dispute — Trade #[ID], opened by [buyer/seller]. Amount: [Y] PKR / [X] USDT." |

---

### 4.9 Dispute Resolved

**Recipients:** Both parties
**Trigger:** Admin submits resolution decision

| Channel | Recipient | Message |
|---------|-----------|---------|
| In-App | Winner | "Dispute Resolved — Decision: [summary]. [USDT released to you / PKR confirmed not received]." |
| Push | Winner | "Dispute Resolved in Your Favor — Trade #[ID]." |
| Email | Both parties | Full resolution email with admin's written summary — see Section 10 |
| In-App | Loser | "Dispute Resolved — Decision: [summary]. If you disagree, you may appeal within 24 hours." |
| Push | Loser | "Dispute Decision Issued — Trade #[ID]. Open app to view details." |

---

### 4.10 Seller Release Reminder (After Payment Approved)

**Recipient:** Seller
**Trigger:** 10 minutes elapsed after payment approval, seller has not released

| Channel | Message |
|---------|---------|
| In-App | "Reminder — Please release the USDT for Trade #[ID]. 5 minutes remaining before admin review." |
| Push | "Release Required — Please release USDT for Trade #[ID] now. 5 minutes left." |

---

## 5. INSTANT BUY NOTIFICATIONS

### 5.1 Order Created (Quote Locked)

**Recipient:** Buyer
**Trigger:** User confirms order, quote locked

| Channel | Message |
|---------|---------|
| In-App | "Order Created — Your order for [X] [Token] has been created. Pay [Y] PKR within 10 minutes." |
| Push | "Order #[ID] Created — Send [Y] PKR within 10 minutes to lock this price." |
| Email | Order confirmation with payment instructions — see Section 10 |

---

### 5.2 Payment Proof Received (Under Review)

**Recipient:** Buyer
**Trigger:** User submits screenshot

| Channel | Message |
|---------|---------|
| In-App | "Proof Submitted — Your payment screenshot is being verified. Usually done in 2–10 minutes." |
| Push | "Payment Proof Received — Verification in progress for Order #[ID]." |

---

### 5.3 Token Released / Order Complete

**Recipient:** Buyer
**Trigger:** Payout transaction confirmed on blockchain

| Channel | Message |
|---------|---------|
| In-App | "Order Complete ✓ — [X] [Token] has been sent to [wallet_address_short]. Tx: [hash_short]" |
| Push | "[X] [Token] Sent ✓ — Order #[ID] complete. Check your wallet." |
| Email | Order receipt with tx hash and amount — see Section 10 |

---

### 5.4 Order Expired (Quote Window Closed)

**Recipient:** Buyer
**Trigger:** 10-minute quote window elapsed without payment submission

| Channel | Message |
|---------|---------|
| In-App | "Order Expired — Your quote expired before payment was submitted. Start a new order for a fresh price." |
| Push | "Order Expired — Order #[ID] expired. Prices may have changed." |

---

### 5.5 Payment Rejected

**Recipient:** Buyer
**Trigger:** Admin rejects payment proof

| Channel | Message |
|---------|---------|
| In-App | "Payment Rejected — Reason: [reason]. Attempts remaining: [N]. Resubmit or cancel." |
| Push | "Payment Proof Rejected — Order #[ID]. Resubmit required." |
| Email | Rejection email with reason and resubmission instructions |

---

### 5.6 Order Cancelled (After 3 Failed Proofs)

**Recipient:** Buyer
**Trigger:** Third payment proof rejected

| Channel | Message |
|---------|---------|
| In-App | "Order Cancelled — Order #[ID] was cancelled after 3 failed payment proof attempts. No charge was made." |
| Push | "Order Cancelled — Too many failed attempts. Order #[ID] closed." |
| Email | Cancellation notice |

---

## 6. KYC NOTIFICATIONS

### 6.1 KYC Submitted Successfully

**Recipient:** User
**Trigger:** KYC submission saved to DB, AI processing started

| Channel | Message |
|---------|---------|
| In-App | "KYC Submitted ✓ — We're reviewing your documents. Level 1 KYC usually takes under 2 hours." |
| Email | Subject: "KYC documents received — PakSwap" — see Section 10 |

---

### 6.2 KYC Approved

**Recipient:** User
**Trigger:** Admin clicks Approve on KYC submission

| Channel | Message |
|---------|---------|
| In-App | "KYC Approved ✓ — You are now verified (Level [1/2]). Daily limit: [X] PKR." |
| Push | "Identity Verified ✓ — KYC Level [N] approved. You can now trade up to [X] PKR/day." |
| Email | KYC approval email — see Section 10 |

---

### 6.3 KYC Rejected

**Recipient:** User
**Trigger:** Admin clicks Reject on KYC submission

| Channel | Message |
|---------|---------|
| In-App | "KYC Not Approved — Reason: [reason]. You may resubmit with corrected documents." |
| Push | "KYC Rejected — [Short reason]. Tap to resubmit." |
| Email | Rejection email with full reason and resubmission instructions — see Section 10 |

---

### 6.4 Level 3 (EDD) Required

**Recipient:** User
**Trigger:** System auto-flags account for EDD review when daily volume approaches 500K PKR

| Channel | Message |
|---------|---------|
| In-App | "Enhanced Verification Required — To continue trading above 500,000 PKR/day, additional verification is required. Our team will contact you within 24 hours." |
| Email | EDD request email with instructions |

---

## 7. ACCOUNT & SECURITY NOTIFICATIONS

### 7.1 New Device Login

**Recipient:** User
**Trigger:** Successful login from a device/IP not seen in the last 30 days

| Channel | Message |
|---------|---------|
| In-App | "New login detected — [Device type], [City, Country], [Timestamp]. Not you? Secure your account immediately." |
| Push | "New Login — Someone logged in from a new device. Not you? Tap to secure your account." |
| Email | Security alert with login details and "Secure Account" button — see Section 10 |
| SMS | "PakSwap: New login from [Device] at [Time]. Not you? Call support: [number]" |

---

### 7.2 Password Changed

**Recipient:** User
**Trigger:** Successful password change

| Channel | Message |
|---------|---------|
| In-App | "Password Updated — Your password was changed. All other sessions have been logged out." |
| Email | Password change confirmation — see Section 10 |
| SMS | "PakSwap: Your password was changed at [Time]. Not you? Contact support immediately." |

---

### 7.3 2FA Enabled

**Recipient:** User
**Trigger:** User successfully enables TOTP 2FA

| Channel | Message |
|---------|---------|
| In-App | "2FA Enabled ✓ — Your account is now protected with two-factor authentication." |
| Email | 2FA setup confirmation with backup code reminder |
| SMS | "PakSwap: 2-factor authentication enabled on your account at [Time]." |

---

### 7.4 2FA Disabled

**Recipient:** User
**Trigger:** User disables TOTP 2FA (if allowed, or forced disable by admin)

| Channel | Message |
|---------|---------|
| In-App | "2FA Disabled — Two-factor authentication has been turned off. We recommend keeping it enabled." |
| Email | 2FA disable notification with re-enable link |
| SMS | "PakSwap: 2FA was disabled on your account at [Time]. Not you? Contact support." |

---

### 7.5 Account Suspended

**Recipient:** User
**Trigger:** Admin suspends account (user will see this on next login attempt)

| Channel | Message |
|---------|---------|
| Email | "Account Suspended — [Admin-written message]. Duration: [X days / indefinite]. Contact support to appeal." |

*Note: No push or SMS for suspension — user is already blocked from the app. Email is the only reachable channel.*

---

### 7.6 Referral Bonus Credited

**Recipient:** Referring user
**Trigger:** Referred user completes their first trade

| Channel | Message |
|---------|---------|
| In-App | "Referral Bonus — [Referred Name] completed their first trade! 500 PKR bonus added to your account." |
| Push | "Referral Bonus ✓ — 500 PKR earned from your referral." |
| Email | Referral bonus credit confirmation |

---

## 8. ADMIN INTERNAL ALERTS

These are not user-facing. They go to admin channels only (email + Slack webhook).

| Alert | Trigger | Recipients | Channel |
|-------|---------|------------|---------|
| KYC SLA breach | 30 min before KYC SLA expires | senior_admin | Email + Slack |
| P2P payment SLA breach | 10 min before 30-min SLA expires | All trade_admins | Slack |
| Instant Buy SLA breach | 10 min before 30-min SLA expires | All trade_admins | Slack |
| Dispute SLA breach | 1 hour before 4-hour SLA expires | senior_admin | Email + Slack |
| Force release pending confirmation | Awaiting second admin for >30 min | super_admin | Email + Slack |
| Inventory warning level hit | Token drops below warning threshold | senior_admin | Email + Slack |
| Inventory critical level hit | Token drops below critical threshold | senior_admin + super_admin | Email + Slack (urgent) |
| DLQ size > 50 (payout/deposit queues) | BullMQ dead letter queue | super_admin | Email |
| Redis failure | Redis health check fails | All admins | Email + SMS (PagerDuty) |
| New fraud flag (risk score > 85) | User risk score crosses 85 | risk_analyst | Slack |
| Duplicate CNIC detected | KYC submission | senior_admin | Slack |
| Duplicate face detected | KYC AI result | senior_admin | Slack |
| 10+ items in P2P verification queue | Queue depth | All trade_admins | Slack |

### Slack Webhook Format

```
[PAKSWAP ALERT] 🔴 KYC SLA BREACH IN 30 MIN
User: Fatima Khan (user_id: abc123)
Submitted: 2026-05-05 10:30 PKT
SLA deadline: 2026-05-05 12:30 PKT
Action: https://admin.pakswap.com/admin/kyc/abc123
```

---

## 9. ONBOARDING NOTIFICATION SEQUENCE

New users receive a timed sequence of notifications to guide them through key platform features.

### Sequence Timeline

| When | Channel | Message |
|------|---------|---------|
| Immediately after registration | In-App + Email | Welcome email (see Section 10) + in-app welcome banner |
| +30 minutes after registration (if KYC not started) | Push | "One step to start trading — Verify your identity in 2 minutes. It's quick and secure." |
| +2 hours after registration (if KYC not started) | Email | "Complete your KYC to start trading" email |
| After KYC approved | In-App + Push | "You're verified! Browse live USDT listings now →" |
| +24 hours after KYC approved (if no trade started) | Push | "Rates are live — Check today's USDT/PKR rates and find a seller." |
| +3 days after KYC approved (if no trade completed) | Email | Tips email: "How to make your first trade safely on PakSwap" |
| After first trade completed | In-App | Congratulations banner: "First trade done! Share your experience and earn 500 PKR referral bonus." |
| After first trade completed | Email | "Welcome to PakSwap — here's what's next" (referral program, Instant Buy intro) |

### Rules for Onboarding Sequence

- Sequence stops as soon as the user completes their first trade
- Each notification checks if the user has already progressed past that step before sending (no stale nudges)
- User can opt out of onboarding nudges via notification preferences (category: `onboarding`)
- Onboarding nudges are implemented as scheduled BullMQ delayed jobs created at registration time

---

## 10. EMAIL TEMPLATES

All emails follow a consistent template structure:
- Header: PakSwap logo + tagline ("Pakistan's Safest Crypto Exchange")
- Body: clear heading, 2-3 short paragraphs, one primary CTA button
- Footer: support email, unsubscribe link (where applicable), legal disclaimer
- Language: English with key phrases in Urdu where culturally appropriate
- Sender: `noreply@pakswap.com` (transactional) | `support@pakswap.com` (support replies)

---

### EMAIL T-01: Welcome / Registration

**Subject:** `خوش آمدید! Welcome to PakSwap — Your crypto journey starts here`
**Trigger:** User completes registration and email verification

```
Heading: Welcome, [First Name]! آپ کا خیر مقدم ہے

Body:
Your PakSwap account is ready. PakSwap is Pakistan's secure P2P crypto exchange —
buy and sell USDT safely with other Pakistanis.

Next step: Verify your identity (CNIC) to start trading.
It takes less than 2 minutes.

[CTA Button: Verify Identity →]

Why verify?
• Trade up to 50,000 PKR per day with Level 1 KYC
• Your funds protected by our escrow system
• Dispute resolution by our team

Questions? Reply to this email or visit our Help Center.
```

---

### EMAIL T-02: KYC Submitted

**Subject:** `KYC documents received — under review`
**Trigger:** User submits KYC documents

```
Heading: We've received your documents

Body:
We're reviewing your identity documents. This usually takes under 2 hours
during business hours (9 AM – 10 PM PKT).

You'll receive an email and push notification as soon as we've reviewed them.
You don't need to do anything right now.

[CTA Button: View KYC Status →]
```

---

### EMAIL T-03: KYC Approved

**Subject:** `✓ Identity Verified — You can now trade on PakSwap`
**Trigger:** Admin approves KYC submission

```
Heading: You're verified! آپ کی تصدیق ہو گئی ✓

Body:
Congratulations! Your identity has been verified (Level [1/2] KYC).

Your trading limits:
• Maximum trade: [X] PKR per trade
• Daily limit: [X] PKR per day

[CTA Button: Browse Live Listings →]

Tip: For higher limits, complete Level 2 KYC with an additional selfie and
address proof.
```

---

### EMAIL T-04: KYC Rejected

**Subject:** `Action required — KYC documents need resubmission`
**Trigger:** Admin rejects KYC submission

```
Heading: We could not verify your documents

Body:
Unfortunately, we were unable to verify your identity documents.

Reason: [rejection_reason]

What to do:
[Specific instructions based on reason — e.g., "Please upload a clearer photo
of your CNIC front with all four corners visible and no glare."]

You can resubmit at any time.

[CTA Button: Resubmit Documents →]

Need help? Reply to this email or visit our Help Center.
```

---

### EMAIL T-05: Trade Completed — Buyer Receipt

**Subject:** `Trade Complete — [X] USDT received`
**Trigger:** Trade status changes to completed, buyer side

```
Heading: Your USDT has been sent ✓

Trade Summary:
  Order ID:         #[trade_id]
  Date:             [timestamp PKT]
  Amount received:  [X] USDT
  PKR paid:         [Y] PKR
  Rate:             1 USDT = [Z] PKR
  Payment method:   [JazzCash / Easypaisa / Bank]
  Sent to:          [wallet_address_masked]
  Transaction:      [tx_hash] (view on explorer →)

[CTA Button: View Trade →]

Keep this email as your receipt. If you have any questions, open a support
ticket referencing order #[trade_id].
```

---

### EMAIL T-06: Trade Completed — Seller Receipt

**Subject:** `Trade Complete — [Y] PKR received from [Buyer Name]`
**Trigger:** Trade status changes to completed, seller side

```
Heading: Trade completed ✓

Trade Summary:
  Order ID:         #[trade_id]
  Date:             [timestamp PKT]
  Amount sold:      [X] USDT
  PKR received:     [Y] PKR
  Rate:             1 USDT = [Z] PKR
  Platform fee:     [fee] USDT (0.5%)
  Net received:     [Y] PKR

[CTA Button: View Trade History →]
```

---

### EMAIL T-07: Dispute Opened

**Subject:** `Dispute opened on Trade #[trade_id]`
**Trigger:** Dispute created on a trade

```
Heading: A dispute has been opened

Body:
[Buyer/Seller] has opened a dispute on Trade #[trade_id].

Trade amount: [X] USDT / [Y] PKR
Opened by: [Buyer / Seller]
Reason given: [dispute_reason]

Our team will review all evidence and reach a decision within 4 hours.
You may be asked to provide additional evidence through the platform.

[CTA Button: View Dispute →]

Do not transfer any funds outside the platform while this dispute is open.
```

---

### EMAIL T-08: Dispute Resolved

**Subject:** `Dispute resolved — Trade #[trade_id]`
**Trigger:** Admin submits dispute resolution

```
Heading: Dispute Decision

Result: [USDT released to buyer / USDT returned to seller]

Admin Summary:
[admin_resolution_summary]

If you disagree with this decision, you have 24 hours to appeal.

[CTA Button: Appeal Decision →]    [CTA Button: View Trade →]
```

---

### EMAIL T-09: New Login Alert

**Subject:** `Security Alert — New login to your PakSwap account`
**Trigger:** Login from new device

```
Heading: New login detected ⚠

Details:
  Time:    [timestamp PKT]
  Device:  [browser / OS]
  Location: [City, Country]
  IP:      [ip_address]

If this was you, no action needed.

If this was NOT you, secure your account immediately:

[CTA Button: Secure My Account →]

Securing your account will:
• Log out all other sessions
• Require a password reset
• Temporarily pause trading
```

---

### EMAIL T-10: Instant Buy Order Confirmation

**Subject:** `Order Confirmed — [X] [Token] for [Y] PKR`
**Trigger:** Instant Buy order created

```
Heading: Order Created ✓

Order Details:
  Order ID:    #[order_id]
  Token:       [X] [Token]
  PKR amount:  [Y] PKR
  Rate:        1 [Token] = [Z] PKR
  Expires:     [timestamp] (10 minutes from now)
  Send to:     [provider payment details]

Next step: Send [Y] PKR to the account above via [payment_method],
then upload your payment screenshot in the app.

[CTA Button: Upload Payment Proof →]

This order expires at [timestamp]. After expiry, a new order must be created.
```

---

### EMAIL T-11: Instant Buy Order Complete

**Subject:** `✓ [X] [Token] sent to your wallet`
**Trigger:** Payout transaction confirmed on blockchain

```
Heading: Your order is complete ✓

Order Summary:
  Order ID:        #[order_id]
  Date:            [timestamp PKT]
  Token received:  [X] [Token]
  PKR paid:        [Y] PKR
  Network:         [BSC / Ethereum / Solana / etc.]
  Sent to:         [wallet_address_masked]
  Transaction:     [tx_hash] (view on explorer →)

[CTA Button: View Transaction →]
```

---

### EMAIL T-12: Payment Proof Rejected (Instant Buy)

**Subject:** `Payment proof rejected — Action required for Order #[ID]`
**Trigger:** Admin rejects Instant Buy payment proof

```
Heading: We could not verify your payment

Reason: [rejection_reason]

What to do:
[Instructions based on reason]

You have [N] remaining attempt(s) to resubmit. After [N] failed attempts,
the order will be automatically cancelled.

[CTA Button: Resubmit Payment Proof →]

Order expires: [timestamp]
```

---

## 11. SMS TEMPLATES

SMS is used only for security-critical events. Messages must be under 160 characters (single SMS unit).

| Event | SMS Text |
|-------|---------|
| OTP — Registration | `PakSwap: Your OTP is [code]. Valid for 10 minutes. Do not share this code with anyone.` |
| OTP — Login | `PakSwap: Login OTP: [code]. Valid 10 min. Not you? Call [support].` |
| OTP — Password reset | `PakSwap: Password reset OTP: [code]. Valid 10 min. If not requested, ignore.` |
| New device login | `PakSwap: New login from [Device] at [Time]. Not you? Call support immediately: [number]` |
| Password changed | `PakSwap: Your password was changed at [Time]. Not you? Call support: [number]` |
| 2FA disabled | `PakSwap: 2FA was turned off at [Time]. Not you? Call support: [number]` |

### SMS Rules

- Maximum 1 OTP SMS per 60 seconds to the same number (enforced in Redis — see Doc 13)
- Maximum 5 OTP SMS per hour to the same number
- Use Twilio Pakistan routing for better delivery (Jazz, Telenor, Ufone, Zong)
- OTP codes are 6 digits, numeric only
- OTP expiry: 10 minutes
- OTP is single-use — invalidated immediately after one successful verification

---

## 12. IN-APP NOTIFICATION CENTER

The bell icon in the navigation bar shows a notification center with a history of all in-app alerts.

### Notification Center Rules

- Shows last 90 days of notifications
- Unread count shown as badge on bell icon (max displayed: "99+")
- Grouped by date: Today, Yesterday, This Week, Earlier
- Mark individual as read (tap) or mark all as read (button)
- Each notification is tappable — navigates to the relevant trade, order, or KYC page
- Notifications older than 90 days are not deleted from DB but are hidden from the center UI

### Notification Record Structure (DB)

```sql
user_notifications (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(100) NOT NULL,  -- 'trade_completed', 'kyc_approved', etc.
  title           VARCHAR(200) NOT NULL,
  body            TEXT NOT NULL,
  action_url      VARCHAR(500),           -- deep link on tap
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 13. PUSH NOTIFICATION CONFIGURATION

### Provider

Firebase Cloud Messaging (FCM) for both iOS and Android.

### Setup Requirements

- Web app: FCM web push (VAPID key)
- Android app (Phase 2): FCM Android SDK
- iOS app (Phase 2): APNs via FCM bridge

### Notification Payload Structure

```json
{
  "to": "[fcm_device_token]",
  "notification": {
    "title": "Payment Verified",
    "body": "Please release the USDT for Trade #A1B2. 15 minutes remaining."
  },
  "data": {
    "type": "trade_payment_approved",
    "trade_id": "uuid",
    "action_url": "/trades/uuid"
  },
  "android": {
    "priority": "high",
    "notification": {
      "sound": "default",
      "channel_id": "trade_alerts"
    }
  },
  "apns": {
    "payload": {
      "aps": {
        "sound": "default",
        "badge": 1
      }
    }
  }
}
```

### Android Notification Channels

| Channel ID | Name | Importance | Used For |
|------------|------|------------|---------|
| `security_alerts` | Security Alerts | HIGH (makes sound, shows heads-up) | Login alerts, password changes |
| `trade_alerts` | Trade Alerts | HIGH | Payment events, timer warnings |
| `order_updates` | Order Updates | DEFAULT | Instant Buy status |
| `kyc_updates` | Verification Updates | DEFAULT | KYC approved/rejected |
| `general` | General | LOW | Promotions, summaries |

### Device Token Management

- FCM token stored in `user_devices` table alongside device fingerprint
- Tokens refreshed: FCM calls `onTokenRefresh` — app sends new token to server automatically
- Invalid tokens (FCM returns `InvalidRegistration`): delete from `user_devices` immediately
- Multiple devices per user supported (e.g., phone + tablet + web browser — all receive push)

---

## 14. DATABASE SCHEMA

```sql
-- Notification log (all channels)
notifications_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),         -- NULL for admin alerts
  admin_id        UUID REFERENCES admin_users(id),   -- NULL for user notifications
  type            VARCHAR(100) NOT NULL,
  channel         ENUM('in_app', 'push', 'email', 'sms') NOT NULL,
  status          ENUM('queued', 'sent', 'delivered', 'failed') DEFAULT 'queued',
  subject         VARCHAR(300),                      -- email only
  body            TEXT NOT NULL,
  metadata        JSONB,                             -- trade_id, order_id, etc.
  sent_at         TIMESTAMPTZ,
  failed_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- User in-app notification center
user_notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(100) NOT NULL,
  title           VARCHAR(200) NOT NULL,
  body            TEXT NOT NULL,
  action_url      VARCHAR(500),
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- User device tokens (push)
user_devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  fcm_token       TEXT NOT NULL,
  device_type     ENUM('web', 'android', 'ios') NOT NULL,
  device_name     VARCHAR(200),
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fcm_token)
)

-- User notification preferences
user_notification_preferences (
  user_id         UUID NOT NULL REFERENCES users(id),
  channel         ENUM('push', 'email', 'sms') NOT NULL,
  category        ENUM('trading', 'instant_buy', 'kyc', 'security', 'promotions', 'onboarding') NOT NULL,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, channel, category)
)
```

---

## 15. TECHNICAL IMPLEMENTATION

### Notification Service Architecture

All notifications are sent through the `notifications` BullMQ queue (defined in Doc 11). This ensures:
- Notifications are non-blocking (trade completion does not wait for email to send)
- Failed notifications are retried (3 attempts, 30s fixed backoff — see Doc 13)
- All sends are logged to `notifications_log`

### Sending a Notification (Internal API)

```typescript
// Called from trade service, KYC service, etc.
await notificationQueue.add('send', {
  userId: 'uuid',
  type: 'trade_payment_approved',
  channels: ['in_app', 'push', 'email'],
  data: {
    tradeId: 'uuid',
    buyerName: 'Ahmed',
    usdtAmount: '100',
  }
})
```

The notification worker resolves the template from type, checks user preferences, and dispatches to each channel.

### Template Resolution

Templates are defined in code (TypeScript objects), not in the database. Template structure:

```typescript
templates['trade_payment_approved'] = {
  in_app: {
    title: (d) => `Payment Verified ✓`,
    body:  (d) => `Please release ${d.usdtAmount} USDT to complete trade #${d.tradeId}. 15 minutes remaining.`,
    action_url: (d) => `/trades/${d.tradeId}`,
  },
  push: {
    title: (d) => `Payment Verified`,
    body:  (d) => `Release ${d.usdtAmount} USDT for trade with ${d.buyerName}. 15 minutes.`,
    data:  (d) => ({ type: 'trade_payment_approved', trade_id: d.tradeId }),
  },
  email: {
    template_id: 'T-payment-approved',  // SendGrid dynamic template ID
    subject: (d) => `Payment verified — please release USDT for Trade #${d.tradeId}`,
  }
}
```

---

*End of Notification System Specification — Document 14*
*Cross-references: Doc 11 (BullMQ queue config), Doc 12 (Admin SLA alerts), Doc 13 (SMS rate limits)*
