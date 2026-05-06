# 10 — Screenshot Verification Specification

**Status:** Implementation-grade spec  
**Applies to:** Layer 1 AI Scan for all PKR payment proofs (P2P trades, Instant Buy Mode A)  
**Last updated:** 2026-05-05

---

## 1. Overview

Every PKR payment screenshot submitted by a buyer is processed by Layer 1 (automated AI scan) before it enters the Layer 2 (human admin review) queue. Layer 1 **never releases funds** — it produces a structured verdict that the admin sees alongside the screenshot.

---

## 2. OCR Engine

| Priority | Engine | Usage |
|----------|--------|-------|
| Primary | Google Cloud Vision API (`DOCUMENT_TEXT_DETECTION`) | All production requests |
| Fallback | PaddleOCR (self-hosted, CPU) | GCV API failure / timeout >5 s |

The fallback triggers automatically if GCV returns a non-200 response or the job exceeds 5 s. Both engines return a plain-text transcript; downstream parsing is identical.

---

## 3. Supported Payment Methods & Templates

| Method | Template Fields Extracted | Notes |
|--------|--------------------------|-------|
| JazzCash | sender_name, receiver_name, amount, datetime, transaction_id, status_text | "Payment Successful" / "Rs." prefix |
| Easypaisa | sender_name, receiver_name, amount, datetime, transaction_id, status_text | "Transfer Successful" / "PKR" prefix |
| HBL Mobile | sender_name, receiver_name/IBAN, amount, datetime, reference_no | Bank transfer receipts |
| UBL Omni | sender_name, receiver_name/IBAN, amount, datetime, reference_no | |
| Meezan Bank | sender_name, receiver_name/IBAN, amount, datetime, reference_no | |
| Other bank | amount, datetime, reference_no | name matching degraded |

Template matching uses regex patterns compiled per payment method. The correct template is selected by searching for method-specific keywords in the OCR transcript (e.g., "JazzCash", "Easypaisa", "HBL").

---

## 4. Field Extraction Rules

### 4.1 Amount

- Strip currency prefix: `Rs.`, `PKR`, `₨`, comma separators, spaces
- Parse as `DECIMAL(18,2)`
- Expected value from order: `order.pkr_amount`
- Tolerance: ±0 (exact match required; underpayment = fail, overpayment = warn)

### 4.2 Date & Time

- Normalize to `Asia/Karachi` timezone
- Must be within ±30 minutes of `order.created_at`
- Screenshots timestamped >30 min before or any time after order expiry = fail

### 4.3 Transaction / Reference ID

- Extract alphanumeric reference; strip whitespace
- Check against `screenshot_verifications.seen_tx_ids` for duplicates (duplicate = hard fail)
- Store on first successful verification

### 4.4 Status Text

- Must contain a success keyword: `Successful`, `Completed`, `Transferred`, `Sent`
- Any failure keyword (`Failed`, `Reversed`, `Declined`, `Pending`) = hard fail regardless of other fields

---

## 5. Sender Name Matching

### 5.1 Normalization Steps (applied to both OCR name and KYC name)

1. Lowercase
2. Strip diacritics / accents
3. Collapse multiple spaces to single space
4. Remove punctuation except hyphens in compound names
5. Apply Urdu romanization equivalence map (see §5.3)

### 5.2 Match Algorithm

```
distance = levenshtein(normalized_ocr_name, normalized_kyc_name)
char_len  = max(len(normalized_ocr_name), len(normalized_kyc_name))
similarity = 1 - (distance / char_len)
```

| Similarity | Verdict |
|-----------|---------|
| ≥ 0.90 | PASS |
| 0.75 – 0.89 | WARN — flag for admin review |
| < 0.75 | FAIL |

Levenshtein distance ≤ 2 on names ≤ 6 characters is treated as PASS regardless of ratio (handles short names like "Ali").

### 5.3 Urdu Romanization Equivalence Map (non-exhaustive)

| Variant A | Variant B |
|-----------|-----------|
| Muhammad | Mohammad / Muhammed / M. |
| Abdul | Abdul / Abd |
| Ullah | Ullah / Allah |
| Khan | Khn (OCR drop) |
| Hussain | Husain / Hasan |
| Fatima | Fatimah |

This map is applied before distance calculation; matched variants count as identical characters.

---

## 6. Confidence Score Calculation

Each extracted field produces a sub-score:

| Field | Weight |
|-------|--------|
| Amount match | 35% |
| Status text (success keyword) | 25% |
| Sender name match | 20% |
| Datetime within window | 15% |
| Duplicate TX check (pass = no dup) | 5% |

`overall_confidence = Σ (field_weight × field_score)`  
Field score is 1.0 (pass), 0.5 (warn), or 0.0 (fail).

### 6.1 Threshold Interpretation

| Confidence | Layer 1 Verdict | Admin Queue Priority |
|-----------|----------------|---------------------|
| ≥ 90% | PASS | Normal |
| 70 – 89% | WARN | Elevated |
| < 70% | FAIL | High — manual scrutiny required |

**All verdicts — including 100% confidence — proceed to Layer 2 (admin human review). Layer 1 never releases funds.**

---

## 7. Manipulation Detection Checks

Run in parallel with OCR; any triggered check sets the overall verdict to FAIL regardless of confidence score:

| Check | Method |
|-------|--------|
| Metadata consistency | EXIF timestamp vs visible datetime; mismatch = flag |
| Screenshot dimensions | Known-good dimensions per payment app; outlier = flag |
| Font / pixel anomaly | Tesseract confidence per character; unusually high uniformity on numbers = flag |
| Screenshot of screenshot | JPEG artifact double-compression detection |
| Screen recording frame | Aspect ratio + pixel density outside phone norms |

These checks produce boolean flags stored in `screenshot_verifications.manipulation_flags JSONB`.

---

## 8. Fallback Flows

| Scenario | Handling |
|----------|---------|
| OCR returns empty transcript | verdict=FAIL, reason="ocr_empty", admin notified immediately |
| GCV timeout >5 s | Switch to PaddleOCR fallback; log fallback event |
| Both OCR engines fail | verdict=FAIL, reason="ocr_unavailable", admin reviews screenshot manually |
| Unsupported payment method detected | verdict=WARN, reason="unknown_method", admin reviews |
| OCR confidence <40% (illegible image) | verdict=FAIL, reason="illegible_image" |

---

## 9. Database Schema

```sql
CREATE TABLE screenshot_verifications (
  id               BIGSERIAL PRIMARY KEY,
  order_id         BIGINT NOT NULL REFERENCES trades(id),
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ocr_engine       TEXT NOT NULL,           -- 'gcv' | 'paddleocr'
  raw_transcript   TEXT,
  extracted_fields JSONB,                   -- {amount, sender_name, datetime, tx_id, status_text}
  field_scores     JSONB,                   -- per-field 0/0.5/1.0
  confidence       NUMERIC(5,2),            -- 0.00–100.00
  verdict          TEXT NOT NULL,           -- 'pass' | 'warn' | 'fail'
  fail_reasons     TEXT[],
  manipulation_flags JSONB,
  seen_tx_ids      TEXT[],                  -- global dedup store
  reviewed_by      BIGINT REFERENCES admins(id),
  layer2_decision  TEXT,                    -- 'approved' | 'rejected'
  layer2_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX uix_sv_tx_id ON screenshot_verifications
  USING GIN (seen_tx_ids);                  -- fast duplicate lookup
```

---

## 10. BullMQ Job

Queue: `ocr-jobs`  
Priority: 1 (high)  
Attempts: 3 (retry on GCV transient errors)  
Backoff: exponential 2 s base  
Job payload: `{ order_id, s3_key, submitted_by_user_id }`  
On completion: emit `ocr.complete` event → admin queue notification

---

## 11. S3 Storage

- Bucket: `pakswap-kyc-screenshots` (same bucket as KYC docs, separate prefix)
- Key: `payment-proofs/{order_id}/{uuid}.{ext}`
- Access: private; presigned URLs for admin panel (15-min TTL)
- Retention: 7 years (regulatory)
