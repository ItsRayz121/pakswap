import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="card p-8 space-y-6 text-sm text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity data:</strong> Full name, CNIC number, date of birth, selfie photo</li>
              <li><strong>Contact data:</strong> Email address, phone number, residential address</li>
              <li><strong>Financial data:</strong> Wallet addresses, transaction history, payment account details</li>
              <li><strong>Technical data:</strong> IP address, device type, browser, session tokens</li>
              <li><strong>Usage data:</strong> Pages visited, features used, trade activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To verify your identity (KYC/AML compliance)</li>
              <li>To process and secure trades via escrow</li>
              <li>To communicate trade updates, disputes, and account alerts</li>
              <li>To detect and prevent fraud, money laundering, and account abuse</li>
              <li>To comply with Pakistani law and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Storage & Security</h2>
            <p>Your documents are stored encrypted on AWS S3 with AES-256 encryption. KYC documents are stored for a minimum of 5 years as required by AML regulations. Passwords are hashed using bcrypt. Crypto private keys are managed by an isolated signing service and never stored in our main application.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Sharing</h2>
            <p className="mb-2">We do not sell your personal data. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Regulatory authorities (FIA, SECP) when legally required</li>
              <li>Our KYC/OCR processing vendors under strict data processing agreements</li>
              <li>Law enforcement in cases of fraud investigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion (subject to legal retention requirements)</li>
              <li><strong>Portability:</strong> Receive your data in machine-readable format</li>
            </ul>
            <p className="mt-2">Submit requests to: <a href="mailto:privacy@pakswap.com" className="text-brand hover:underline">privacy@pakswap.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies</h2>
            <p>We use essential cookies for authentication sessions and security. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Contact</h2>
            <p>Privacy Officer: <a href="mailto:privacy@pakswap.com" className="text-brand hover:underline">privacy@pakswap.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
