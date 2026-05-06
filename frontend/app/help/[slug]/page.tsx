import Link from 'next/link'
import { Navbar } from '../../components/layout/Navbar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ARTICLES: Record<string, { title: string; content: string }> = {
  'how-to-register': {
    title: 'How to Create an Account',
    content: `
## Step 1: Visit the Registration Page
Go to [PakSwap Register](/register) and fill in your full name (as on CNIC), email address, Pakistani phone number, and a strong password.

## Step 2: Verify Your Phone
After registration, you'll receive a 6-digit OTP on your phone. Enter it to verify your phone number.

## Step 3: Complete KYC
After phone verification, you'll be directed to complete your KYC. You'll need:
- Your CNIC (both sides)
- A selfie holding your CNIC
- Proof of address (utility bill or bank statement)

## Step 4: Wait for Approval
Our team reviews KYC submissions within 4 hours during business hours. You'll receive an email and in-app notification once approved.
    `,
  },
  'how-p2p-works': {
    title: 'How P2P Trading Works',
    content: `
## Overview
P2P (peer-to-peer) trading means you trade directly with other users, not with PakSwap. PakSwap acts as an escrow and verification intermediary.

## The P2P Flow

**Step 1: Browse the marketplace**
Find a seller (if buying) or buyer (if selling) with your preferred payment method and rate.

**Step 2: Place an order**
Click "Buy" on a sell ad. Enter the PKR amount you want to spend and your payment method.

**Step 3: Crypto locked in escrow**
The seller's crypto is immediately locked in our internal escrow. This guarantees you'll receive it if payment is confirmed.

**Step 4: Send payment**
Transfer the PKR amount via JazzCash, Easypaisa, or bank transfer to the seller's account details shown on the trade page.

**Step 5: Upload payment proof**
Take a screenshot of your payment confirmation and upload it on the trade page.

**Step 6: Two-Layer Verification**
- **Layer 1**: Our AI scans the screenshot to verify the amount, account name, and detect any editing.
- **Layer 2**: A human compliance officer reviews the AI result and approves or rejects.

**Step 7: Crypto released**
Once both layers approve, the crypto is released from escrow to your wallet.

## Important Rules
- Never release a payment reference before you see the correct amount in your payment app
- Your payment account name must match your KYC-verified name
- You have 30 minutes to complete payment before the trade expires
    `,
  },
  'upload-payment-proof': {
    title: 'How to Upload Payment Proof',
    content: `
## What is Payment Proof?
A screenshot showing your payment was successfully sent, including: amount, recipient name, date/time, and transaction ID.

## Accepted Formats
- JazzCash payment confirmation screen
- Easypaisa success notification
- Bank transfer receipt or online banking confirmation

## How to Upload
1. On the trade page, click **"Upload Payment Proof"**
2. Select your screenshot from your device
3. Wait for the AI scan to process (usually 1–2 minutes)
4. A compliance officer will then review within 4 hours

## Tips for a Clean Screenshot
- Screenshot must be unedited — any modifications will be flagged
- Show the full screen, not a cropped version
- Ensure the amount, recipient, and date are all clearly visible
- Maximum file size: 10MB
    `,
  },
  'complete-kyc': {
    title: 'How to Complete KYC Verification',
    content: `
## Required Documents
1. **CNIC (Computerized National Identity Card)** — both front and back
2. **Selfie with CNIC** — hold your CNIC next to your face while looking at the camera
3. **Proof of Address** — utility bill, bank statement, or official letter dated within the last 3 months

## KYC Levels
| Level | Daily Limit | Requirements |
|-------|-------------|--------------|
| None | View only | — |
| Basic | ₨50,000/day | CNIC + Selfie |
| Full | ₨500,000/day | + Address Proof |

## Processing Time
- **Typical**: 2–4 hours during business hours (9 AM – 9 PM PKT)
- **Maximum**: 24 hours

## Common Rejection Reasons
- CNIC image is blurry or partially obscured
- Name on payment account doesn't match CNIC
- Selfie face doesn't match CNIC photo
- Address proof is older than 3 months
- Expired CNIC

## Resubmission
You can resubmit KYC up to 5 times total. If you exhaust all attempts, contact support.
    `,
  },
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug]

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="page-container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link href="/help" className="btn-md btn-primary">Back to Help Center</Link>
        </div>
      </div>
    )
  }

  const lines = article.content.trim().split('\n')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-10 max-w-2xl">
        <Link href="/help" className="flex items-center gap-1 text-sm text-brand hover:underline mb-6">
          <ChevronLeft size={16} /> Back to Help Center
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{article.title}</h1>
          <div className="prose prose-sm max-w-none text-gray-700">
            {lines.map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(3)}</h2>
              if (line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-600">{line.slice(2)}</li>
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-900 mt-3">{line.slice(2, -2)}</p>
              if (line.trim() === '') return <div key={i} className="h-2" />
              return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Was this article helpful?</p>
          <div className="flex justify-center gap-3">
            <button className="btn-md btn-secondary">👍 Yes</button>
            <button className="btn-md btn-ghost">👎 No</button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Still need help? <a href="mailto:support@pakswap.com" className="text-brand hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
