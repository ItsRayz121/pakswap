import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="card p-8 prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing or using PakSwap ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Eligibility</h2>
            <p>You must be at least 18 years old and a resident of Pakistan to use PakSwap. You must hold a valid Computerized National Identity Card (CNIC). You must not be on any financial sanctions list.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. KYC / Identity Verification</h2>
            <p>All users must complete Know Your Customer (KYC) verification before trading. You agree to provide accurate, genuine, and up-to-date identification documents. Submitting false, edited, or stolen documents is a criminal offence and will result in permanent account ban and reporting to relevant authorities.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Two-Layer Payment Verification</h2>
            <p>All payment proofs are subject to AI analysis (Layer 1) and human review (Layer 2). PakSwap does not release crypto automatically under any circumstances. Submitting edited or fabricated payment screenshots is fraud and may result in legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Escrow Service</h2>
            <p>When a trade is initiated, the seller's crypto is locked in PakSwap's internal escrow. PakSwap acts as a neutral intermediary. Escrowed funds are only released upon successful two-layer payment verification. Funds are returned to the seller upon trade cancellation or dispute resolution in seller's favour.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Prohibited Activities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Money laundering or terrorist financing</li>
              <li>Using PakSwap for illegal goods or services</li>
              <li>Creating multiple accounts</li>
              <li>Market manipulation or wash trading</li>
              <li>Attempting to bypass verification systems</li>
              <li>Harassing, threatening, or defrauding counterparties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Fees</h2>
            <p>Fees are as described on our <Link href="/fees" className="text-brand hover:underline">Fee Schedule</Link> page. Fees may change with 7 days notice. Promotional zero-fee periods are time-limited.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Disputes</h2>
            <p>Disputes must be raised within the trade window. PakSwap's dispute resolution decision is final. In cases of proven fraud, PakSwap reserves the right to freeze accounts and report to FIA or SECP.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
            <p>PakSwap is not liable for: blockchain network failures, price volatility losses, payment delays caused by third-party providers (JazzCash, Easypaisa, banks), or force majeure events. Our maximum liability is limited to the platform fee paid on the disputed transaction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Governing Law</h2>
            <p>These Terms are governed by the laws of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Lahore, Punjab, Pakistan.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Contact</h2>
            <p>Legal enquiries: <a href="mailto:legal@pakswap.com" className="text-brand hover:underline">legal@pakswap.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
