import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'
import { Shield } from 'lucide-react'

export default function AmlPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={28} className="text-brand" />
          <h1 className="text-3xl font-bold text-gray-900">AML / CTF Policy</h1>
        </div>
        <p className="text-gray-500 mb-8">Anti-Money Laundering & Counter-Terrorism Financing Policy — Last updated: May 2026</p>

        <div className="card p-8 space-y-6 text-sm text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Our Commitment</h2>
            <p>PakSwap is committed to preventing money laundering, terrorist financing, and financial crime. Our AML/CTF program is aligned with FATF (Financial Action Task Force) recommendations and applicable Pakistani regulations, including the Anti-Money Laundering Act 2010 and the National Counter Terrorism Authority guidelines.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Know Your Customer (KYC)</h2>
            <p>All users must complete identity verification before trading. Our KYC program includes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>CNIC verification with OCR extraction and facial liveness matching</li>
              <li>Proof of address verification</li>
              <li>Ongoing monitoring of trading behavior</li>
              <li>Enhanced Due Diligence (EDD) for high-volume traders and merchants</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Transaction Monitoring</h2>
            <p>We continuously monitor all transactions for suspicious patterns including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Unusual volume spikes inconsistent with user profile</li>
              <li>Structuring (breaking large amounts into smaller transactions to avoid limits)</li>
              <li>Rapid deposits followed by immediate withdrawals</li>
              <li>Transactions involving high-risk jurisdictions</li>
              <li>Multiple accounts from same device or IP</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Two-Layer Payment Verification</h2>
            <p>Our mandatory two-layer payment verification system acts as a critical AML control:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Layer 1 AI scan validates payment authenticity and detects tampering</li>
              <li>Layer 2 human review ensures KYC name matches payment sender</li>
              <li>No crypto release without both layers approving — eliminates anonymous fund flows</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Suspicious Activity Reporting</h2>
            <p>PakSwap will file Suspicious Transaction Reports (STRs) with the Financial Monitoring Unit (FMU) of Pakistan for any transactions or behaviors meeting reporting thresholds. We cooperate fully with FIA, SECP, and other competent authorities.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Sanctions Screening</h2>
            <p>All users are screened against UN Security Council sanctions lists, OFAC SDN list, and Pakistani designated entities lists at registration and on an ongoing basis.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Record Keeping</h2>
            <p>All KYC records, transaction records, and suspicious activity reports are retained for a minimum of 5 years in compliance with Pakistani AML regulations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Training</h2>
            <p>All PakSwap staff with access to compliance functions receive regular AML/CTF training.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact</h2>
            <p>AML Compliance Officer: <a href="mailto:compliance@pakswap.com" className="text-brand hover:underline">compliance@pakswap.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
