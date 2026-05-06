# PAKSWAP — MOBILE APP SPECIFICATION
## React Native App: Features, Auth, Push, Platform Differences

> **Document:** 15 — Mobile App Spec
> **Version:** 1.0
> **Date:** 2026-05-05
> **Status:** Blueprint — Phase 2 (Weeks 17–28 per roadmap in Doc 00)
> **Audience:** Mobile developers, backend developers adding mobile-specific endpoints
> **Cross-reference:** Doc 01 (sitemap), Doc 06 (design system), Doc 11 (tech stack), Doc 14 (push notifications)

---

## TABLE OF CONTENTS

1. [Technology Decision](#1-technology-decision)
2. [Feature Scope — Mobile vs Web](#2-feature-scope--mobile-vs-web)
3. [Mobile-Specific Authentication](#3-mobile-specific-authentication)
4. [Navigation Structure](#4-navigation-structure)
5. [Push Notification Integration](#5-push-notification-integration)
6. [Camera & Document Capture (KYC)](#6-camera--document-capture-kyc)
7. [Biometric Authentication](#7-biometric-authentication)
8. [Offline & Network Handling](#8-offline--network-handling)
9. [Deep Links](#9-deep-links)
10. [App Store Requirements](#10-app-store-requirements)
11. [Mobile-Specific API Differences](#11-mobile-specific-api-differences)
12. [Build & Release Pipeline](#12-build--release-pipeline)
13. [Mobile Screen Inventory](#13-mobile-screen-inventory)

---

## 1. TECHNOLOGY DECISION

**Framework: React Native (Expo managed workflow)**

### Why React Native over Flutter

| Factor | React Native (Expo) | Flutter |
|--------|--------------------|---------| 
| Team fit | JavaScript/TypeScript — same language as the web backend | Dart — new language to learn |
| Code sharing | Share types, validation logic, and API client with web app | No sharing |
| Ecosystem | Mature Pakistan-specific libraries (payment SDKs) | Less mature |
| OTA updates | Expo EAS Update — push JS updates without App Store review | Requires full release for logic changes |
| Time to market | Faster given existing web codebase | Slower start |

### Expo Configuration

- **Workflow:** Expo managed (EAS Build for production binaries)
- **SDK version:** Expo SDK 51+ (latest stable at dev time)
- **Targets:** Android 8.0+ (API 26+), iOS 14+
- **Min Android market coverage in Pakistan:** ~99% of active Android devices
- **Architecture:** New Architecture (Fabric + JSI) enabled from day one

### Shared Code with Web

The monorepo structure should allow sharing:
- TypeScript API client (`packages/api-client`)
- Validation schemas (`packages/validators`) — wallet address validation, CNIC format, etc.
- Type definitions (`packages/types`)
- Business constants (`packages/constants`) — fee rates, timer durations, etc.

Do NOT try to share React components between web and mobile — the component libraries are different.

---

## 2. FEATURE SCOPE — MOBILE VS WEB

### Phase 2 Mobile MVP (Weeks 17–28)

The mobile app launches with the most-used features. Admin panel is web-only — never on mobile.

| Feature | Mobile MVP | Web | Notes |
|---------|-----------|-----|-------|
| Registration + email/phone verify | ✅ | ✅ | |
| Login (email/phone + password + 2FA) | ✅ | ✅ | |
| Biometric login (fingerprint / Face ID) | ✅ | ❌ | Mobile only |
| KYC Level 1 (CNIC photo upload) | ✅ | ✅ | Mobile: camera capture preferred |
| KYC Level 2 (selfie + liveness) | ✅ | ✅ | Mobile: better liveness UX |
| Browse P2P marketplace | ✅ | ✅ | |
| Initiate and complete P2P trade | ✅ | ✅ | |
| Real-time trade room (WebSocket) | ✅ | ✅ | |
| Screenshot upload for payment proof | ✅ | ✅ | Mobile: photo library picker + camera |
| Trade history | ✅ | ✅ | |
| Open/view disputes | ✅ | ✅ | |
| Instant Buy (Mode A — PKR) | ✅ | ✅ | |
| Instant Buy (Mode B — Crypto) | ✅ | ✅ | |
| Create P2P sell ads | ✅ | ✅ | |
| Manage payment methods | ✅ | ✅ | |
| Notification center | ✅ | ✅ | |
| Push notifications | ✅ | ✅ (web push) | FCM for both |
| Profile / settings | ✅ | ✅ | |
| Referral | ✅ | ✅ | |
| Help / FAQ | ✅ | ✅ | |
| Admin panel | ❌ | ✅ | Web only, always |
| Provider/merchant dashboard | Phase 3 | ✅ Phase 2 | |
| Wallet balance view | ✅ | ✅ | View only — no deposit/withdraw UI needed (see platform model in Doc 07) |

### Features Deferred to Mobile Phase 3

- Merchant/provider dashboard
- Advanced analytics charts
- Bulk ad management
- In-app customer support chat (will use third-party SDK — Intercom or Crisp)

---

## 3. MOBILE-SPECIFIC AUTHENTICATION

### Login Flow

Mobile login is identical to web with these additions:

**Biometric shortcut (after first login):**
```
First login on device:
  → Standard email + password + 2FA
  → After success: prompt "Enable fingerprint/Face ID for faster login?"
  → If user accepts: store session refresh token in device Secure Enclave / Android Keystore
  → Future logins: user taps biometric prompt → secure token retrieved → silent re-auth with server

Biometric re-auth flow (backend):
  → Client sends biometric_token (a long-lived device-bound token, separate from JWT)
  → Server validates biometric_token, checks device is still trusted, issues new JWT pair
  → biometric_token rotated on each use (sliding window)
  → biometric_token expires after 30 days of inactivity
```

### New Endpoint Required: Biometric Token

```
POST /auth/biometric/register
  Body: { device_id, device_fingerprint }
  Response: { biometric_token }  -- stored in Secure Enclave by client
  Auth: Requires valid JWT (called right after standard login)

POST /auth/biometric/authenticate
  Body: { biometric_token, device_id }
  Response: { access_token, refresh_token }
  Auth: None (this IS the auth)
  Rate limit: 10 attempts per hour per device_id (separate from password login rate limit)
```

### Biometric Token Storage

- **iOS:** Keychain with `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly` flag — token is deleted if device passcode is removed
- **Android:** Android Keystore with `setUserAuthenticationRequired(true)` — token requires biometric verification to access

### Session Security on Mobile

| Rule | Implementation |
|------|---------------|
| App goes to background for >15 minutes | Show lock screen. User must re-enter PIN or biometric to continue. JWT is still valid — just UI lock. |
| App goes to background for >7 days | JWT refresh token expires. User must re-login with password + 2FA. |
| User reports device lost | Admin or user can revoke all device sessions from web. Deletes all `user_devices` records for that user, invalidates all refresh tokens. |
| Jailbreak / root detection | Warn user: "Running on a modified device may reduce security." Do not block, just warn. |
| Certificate pinning | Pin to PakSwap API certificate. If pinning fails: block all API calls and show "Security error — please update the app." |

---

## 4. NAVIGATION STRUCTURE

### Bottom Tab Bar (always visible when logged in)

```
[Home]  [Trade]  [Instant Buy]  [Orders]  [Profile]
```

| Tab | Screen | Notes |
|-----|--------|-------|
| Home | Dashboard — live rates, quick actions, notification badge | |
| Trade | P2P Marketplace — browse listings | |
| Instant Buy | Token selector | |
| Orders | Combined history — P2P trades + Instant Buy orders | |
| Profile | Settings, KYC status, payment methods, referral, help | |

### Stack Navigation (within tabs)

```
Home
  └─ Notification Center

Trade
  ├─ Marketplace (listing)
  ├─ Seller Profile
  ├─ Trade Room  ← Deep linkable: pakswap://trade/{id}
  └─ Create Ad

Instant Buy
  ├─ Token Grid
  ├─ Order Form (amount + wallet address)
  ├─ Payment Instructions
  ├─ Order Status  ← Deep linkable: pakswap://order/{id}
  └─ Order History

Orders
  ├─ P2P Trade Detail
  └─ Instant Buy Order Detail

Profile
  ├─ Edit Profile
  ├─ KYC (Level 1 / Level 2)
  ├─ Payment Methods
  ├─ Security (password, 2FA, biometric, active sessions)
  ├─ Referral
  ├─ Notification Preferences
  └─ Help & Support
```

### Authentication Stack (when not logged in)

```
Splash → Onboarding (3 slides, first install only) → Login / Register
```

Onboarding slides (first install):
1. "Trade USDT safely" — escrow protection illustration
2. "Verified sellers only" — KYC badge illustration
3. "Dispute protection" — admin support illustration

---

## 5. PUSH NOTIFICATION INTEGRATION

Full notification spec is in Doc 14. Mobile-specific configuration:

### Setup

```
expo install expo-notifications expo-device expo-constants
```

### Permission Request Flow

```
On first login (not on app launch — asking on launch annoys users):
  → After KYC approval: show in-app prompt first:
    "Enable notifications to get trade alerts and payment updates.
     We only send important trade activity — no spam."
    [Enable Notifications]  [Maybe Later]
  
  → If user taps Enable: call Notifications.requestPermissionsAsync()
  → If user taps Maybe Later: ask again after first trade completion
  → If user permanently denies via OS: show settings link to re-enable
```

### FCM Token Registration

```typescript
// On app start (every time), after login:
const token = await Notifications.getExpoPushTokenAsync({ projectId });
await api.post('/auth/devices/register', {
  fcm_token: token.data,
  device_type: Platform.OS,   // 'android' | 'ios'
  device_name: Device.deviceName,
});
```

### Notification Tap Handling (Deep Link on Tap)

```typescript
// App in foreground: show in-app alert
Notifications.addNotificationReceivedListener(notification => {
  showInAppToast(notification.request.content);
});

// App backgrounded or closed: navigate on tap
Notifications.addNotificationResponseReceivedListener(response => {
  const url = response.notification.request.content.data?.action_url;
  if (url) router.push(url);
});
```

### Android Notification Channels

Must be created on app launch (see Doc 14 Section 13 for channel list):
```typescript
await Notifications.setNotificationChannelAsync('trade_alerts', {
  name: 'Trade Alerts',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
});
// ... repeat for all channels
```

---

## 6. CAMERA & DOCUMENT CAPTURE (KYC)

Mobile provides a better KYC experience than web because users can take photos directly.

### Libraries

```
expo install expo-camera expo-image-picker expo-media-library
```

### CNIC Capture Flow (Mobile)

```
Step 1: Show two buttons: "Take Photo" (camera) and "Choose from Gallery" (image picker)

Step 2: If camera:
  → Full-screen camera view with CNIC outline guide overlay
  → Text overlay: "Place your CNIC inside the frame"
  → Auto-capture when image stabilizes (optional — manual capture also available)
  → Flash auto-enabled in low light

Step 3: Preview screen after capture:
  → User sees the captured image
  → "Use This Photo" or "Retake"
  → If gallery: same preview screen

Step 4: Upload
  → Compress to max 2 MB before upload (expo-image-manipulator)
  → Minimum 400×400 px enforced client-side before upload
  → Upload with progress indicator
```

### Selfie + Liveness (Level 2 KYC)

```
Step 1: Selfie capture
  → Front camera, circular face guide overlay
  → Lighting guidance: "Good lighting ✓" / "Too dark ⚠ Move to better lighting"
  → Tap to capture

Step 2: Liveness check
  → Instruct user to slowly turn head left → right
  → Or: follow a moving dot on screen
  → MediaPipe Face Mesh runs on-device to detect real movement
  → Captured as a short video clip (3–5 seconds)
  → Video uploaded to server for server-side liveness verification

Step 3: Preview + upload
  → Show selfie preview
  → "Looks good" or "Retake"
```

### Payment Screenshot Upload

```
Two options shown:
  [Take Screenshot with Phone]   — opens photo library picker
  [Upload from Gallery]          — same picker, different label for clarity

Note: "Take Screenshot with Phone" means the user already took a JazzCash screenshot 
and it's in their gallery. The camera is not used here — the phone's screenshot 
is already a file.

File validation (client-side before upload):
  → File type check: JPEG, PNG only
  → Size check: max 10 MB
  → Minimum dimensions: 400×400 px
  → If fails: show error, do not upload
```

---

## 7. BIOMETRIC AUTHENTICATION

### Libraries

```
expo install expo-local-authentication
```

### Supported Methods

| Platform | Supported |
|----------|-----------|
| Android fingerprint | ✅ |
| Android Face Unlock | ✅ (if device supports) |
| iOS Touch ID | ✅ |
| iOS Face ID | ✅ |

### Implementation

```typescript
// Check capability
const hasHardware = await LocalAuthentication.hasHardwareAsync();
const isEnrolled = await LocalAuthentication.isEnrolledAsync();

// Authenticate
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Confirm your identity to continue',
  fallbackLabel: 'Use password instead',
  cancelLabel: 'Cancel',
  disableDeviceFallback: false,  // allow PIN as fallback
});

if (result.success) {
  // retrieve biometric_token from Keychain/Keystore
  // call POST /auth/biometric/authenticate
}
```

### Biometric Fallback

Always provide "Use password instead" as fallback. Never lock user out if biometric fails.

---

## 8. OFFLINE & NETWORK HANDLING

### Network State Detection

```
expo install @react-native-community/netinfo
```

### Offline Rules

| Screen | Offline Behavior |
|--------|----------------|
| Marketplace / Browse | Show cached listings from last fetch (stale-while-revalidate). Show "Offline — showing cached rates" banner. |
| Active Trade Room | Show "Connection lost" banner. WebSocket auto-reconnects. Countdown timer continues client-side. |
| Uploading screenshot | Disable upload button. Show "No internet connection. Connect to upload." |
| Submitting any form | Disable submit button. Show offline banner. Queue is NOT used — user must be online to submit. |
| Notification Center | Show cached notifications. |

### No Background Sync

Mobile app does not run background sync jobs. All data is fetched when the app is foregrounded. This is intentional — simplicity over complexity for MVP.

### Request Timeout Configuration

```typescript
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,  // 15 seconds
});

// On timeout: show "Request timed out. Check your connection and try again."
// On 503: show "Service temporarily unavailable. Please try again shortly."
// Full error code handling: see Doc 13
```

---

## 9. DEEP LINKS

Deep links allow push notifications and external URLs to open specific screens.

### URL Scheme

- Development: `exp://`
- Production: `pakswap://` (custom scheme) + `https://pakswap.com` (Universal Links / App Links)

### Deep Link Routes

| URL | Opens |
|-----|-------|
| `pakswap://trade/{tradeId}` | Trade Room for that trade |
| `pakswap://order/{orderId}` | Instant Buy order status |
| `pakswap://kyc` | KYC submission screen |
| `pakswap://dispute/{disputeId}` | Dispute detail |
| `pakswap://referral` | Referral screen |
| `pakswap://settings/security` | Security settings |
| `https://pakswap.com/trade/{tradeId}` | Same as above (Universal Link) |

### Deep Link Auth Guard

If a deep link arrives and the user is not logged in:
1. Navigate to Login screen
2. After successful login: navigate to the original deep link destination

---

## 10. APP STORE REQUIREMENTS

### Google Play Store

| Requirement | How Met |
|-------------|---------|
| Data safety form | Complete — list: account info, financial info, device ID. Encryption in transit: ✅. Deletion request: supported via settings. |
| Camera permission justification | "Used to capture CNIC and selfie for identity verification." |
| Notification permission | Requested at appropriate time (after login, not on launch). |
| Target API level | API 34+ (Android 14) required for new submissions |
| Pakistan crypto classification | List as "Financial" category. Not "Gambling." |
| Age rating | 18+ (financial services) |

### Apple App Store

| Requirement | How Met |
|-------------|---------|
| App Review — crypto exchanges | Must clearly explain P2P model. No exchange of crypto for fiat on-platform (no wallet management). Classify as "marketplace" not "exchange" to reduce regulatory flags. |
| Privacy labels | Complete data usage declarations required |
| Face ID usage description | "Used for quick and secure login after initial password authentication." |
| Camera usage description | "Used to capture identity documents for account verification." |
| Photo library usage description | "Used to upload payment screenshots for trade verification." |
| In-app purchases | None — platform takes fee on trades, not via Apple IAP |
| Minimum iOS | iOS 14 |

### App Review Strategy

Apple review for crypto apps can be slow (2–4 weeks). Submit MVP web version first, launch mobile only after web is stable. During review, ensure the test account provided to Apple reviewers is pre-KYC approved so they can test the full flow.

---

## 11. MOBILE-SPECIFIC API DIFFERENCES

Most mobile API calls are identical to web. These endpoints are mobile-specific or have mobile-specific parameters.

### New Headers Required from Mobile Clients

```
X-Client-Type: mobile
X-Client-Version: 1.0.0
X-Platform: android | ios
X-Device-ID: [uuid generated on first install, stored in SecureStore]
```

These headers are used for:
- Rate limit bucketing (mobile gets slightly looser limits for unstable connections)
- Analytics (what % of volume is mobile vs web)
- Push notification targeting

### Endpoint Additions for Mobile

```
POST /auth/biometric/register
POST /auth/biometric/authenticate
DELETE /auth/biometric/{deviceId}  -- revoke biometric for a device

POST /auth/devices/register        -- register FCM token
DELETE /auth/devices/{deviceId}    -- deregister (logout)
GET /auth/devices                  -- list all registered devices (for "manage devices" screen)

GET /marketplace?page=1&limit=20   -- pagination required (web can load more at once)
```

### Response Optimizations for Mobile

Add a `?mobile=true` query parameter to certain endpoints. When present:
- Return smaller image URLs (thumbnails instead of full-size) for listing screens
- Omit heavy fields not needed on mobile (e.g., full ad description truncated to 120 chars in listing view)
- This is an optional optimization — do not implement until performance is measured as an issue

---

## 12. BUILD & RELEASE PIPELINE

### EAS Build Configuration (`eas.json`)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "credentialsSource": "remote" }
    }
  },
  "submit": {
    "production": {
      "android": { "serviceAccountKeyPath": "./google-play-key.json" },
      "ios": { "appleId": "contact@pakswap.com", "ascAppId": "[app_store_connect_id]" }
    }
  }
}
```

### Environment Variables (Mobile)

```
EXPO_PUBLIC_API_URL=https://api.pakswap.com
EXPO_PUBLIC_FCM_SENDER_ID=[firebase_sender_id]
EXPO_PUBLIC_SENTRY_DSN=[sentry_dsn_mobile]
EXPO_PUBLIC_APP_ENV=production
```

Note: `EXPO_PUBLIC_` prefix makes variables available in JS bundle. Do NOT prefix secret keys — those go in EAS secrets, not in the bundle.

### OTA Update Policy

- Bug fixes and UI changes: deploy via EAS Update (instant, no store review)
- New screens or navigation changes: full store release
- API contract changes: coordinate with backend, do not OTA update if backend API version changes

### Release Cadence

| Release Type | Frequency | Method |
|--------------|-----------|--------|
| Bug fix | As needed | EAS Update (OTA) |
| Feature release | Bi-weekly | Full store release |
| Security patch | Immediate | EAS Update if possible; store release if native code affected |

---

## 13. MOBILE SCREEN INVENTORY

All screens the mobile app must implement. Admin screens are excluded — web only.

| Screen | Route | Notes |
|--------|-------|-------|
| Splash | `/` | Logo + loading |
| Onboarding | `/onboarding` | 3 slides, first install only |
| Login | `/auth/login` | Email/phone + password + 2FA |
| Biometric Login | `/auth/biometric` | Fingerprint/Face ID |
| Register | `/auth/register` | Phone/email, OTP verify |
| Forgot Password | `/auth/forgot-password` | OTP + new password |
| Home / Dashboard | `/home` | Rates, quick actions, notifications |
| Notification Center | `/notifications` | Full notification history |
| Marketplace | `/trade` | Listing browse, filters |
| Seller Profile | `/trade/seller/{id}` | Public merchant profile |
| Create Ad | `/trade/create-ad` | Post sell listing |
| Trade Room | `/trade/{tradeId}` | Live escrow room |
| Order History | `/orders` | Combined P2P + Instant Buy |
| P2P Trade Detail | `/orders/trade/{id}` | Past trade detail |
| Instant Buy Home | `/instant-buy` | Token grid |
| Instant Buy Form | `/instant-buy/{tokenId}` | Amount + address |
| Instant Buy Payment | `/instant-buy/{orderId}/payment` | Payment instructions + upload |
| Instant Buy Status | `/instant-buy/{orderId}/status` | Order tracking |
| Instant Buy History | `/instant-buy/history` | Past IB orders |
| KYC Level 1 | `/profile/kyc/level-1` | CNIC upload |
| KYC Level 2 | `/profile/kyc/level-2` | Selfie + liveness |
| KYC Status | `/profile/kyc/status` | Pending / approved / rejected state |
| Profile | `/profile` | Summary page |
| Edit Profile | `/profile/edit` | Name, phone, email |
| Security Settings | `/profile/security` | Password, 2FA, biometric, sessions |
| Payment Methods | `/profile/payment-methods` | Add/edit JazzCash, Easypaisa, bank |
| Notification Preferences | `/profile/notifications` | Toggle settings |
| Referral | `/profile/referral` | Link + earnings |
| Help | `/profile/help` | FAQ, contact support |
| Dispute Center | `/disputes/{tradeId}` | Open/view dispute |

Total: **36 screens**

---

*End of Mobile App Specification — Document 15*
*Cross-references: Doc 06 (design system — colors, typography apply to mobile), Doc 11 (shared tech stack), Doc 14 (push notification implementation details)*
