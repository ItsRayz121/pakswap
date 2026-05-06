import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'
import { Shield, Users, Globe, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4">
        <div className="page-container max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About PakSwap</h1>
          <p className="text-lg text-gray-600">
            Pakistan's first purpose-built P2P crypto exchange — designed for trust, transparency, and local payment methods.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="page-container max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            PakSwap exists to give every Pakistani access to global digital assets through a safe, transparent, and locally-relevant platform. We believe financial access is a right, not a privilege.
          </p>
          <p className="text-gray-600">
            Built by Pakistanis, for Pakistanis — we understand the local banking landscape, mobile money ecosystem, and the trust challenges that have held back crypto adoption. Our two-layer payment verification system was designed specifically to prevent fraud while keeping legitimate transactions fast and smooth.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="page-container max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Security First', desc: 'Every feature is designed with security at its core. Our two-layer verification ensures no crypto is ever released without human oversight.' },
              { icon: Users, title: 'Community Trust', desc: 'We build trust through transparency — clear fees, public dispute processes, and verified trader profiles.' },
              { icon: Globe, title: 'Financial Inclusion', desc: 'Anyone with a CNIC and a JazzCash account can trade. No bank account required for entry-level access.' },
              { icon: Award, title: 'Compliance Ready', desc: 'AML/KYC policies aligned with FATF standards. We work proactively with regulatory frameworks as they evolve in Pakistan.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <Icon size={28} className="text-brand mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How verification works */}
      <section className="py-16 px-4">
        <div className="page-container max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Two-Layer Verification</h2>
          <div className="two-layer-box space-y-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Why we require two approvals for every payment:</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Layer 1 — AI Scan</p>
                  <p className="text-gray-500 mt-0.5">Our OCR engine reads the payment screenshot, extracts the amount, sender name, and timestamp, then checks for tampering or editing artifacts.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Layer 2 — Human Review</p>
                  <p className="text-gray-500 mt-0.5">A trained compliance officer reviews the AI result, cross-references the KYC name match, and makes the final release decision. No crypto is ever released automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand px-4">
        <div className="page-container text-center max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Join Pakistan's Trusted Exchange</h2>
          <Link href="/register" className="btn-lg bg-white text-brand hover:bg-gray-50 px-8">Create Free Account</Link>
        </div>
      </section>

      <footer className="py-8 bg-gray-900 text-center text-sm text-gray-500">
        © 2026 PakSwap. <Link href="/terms" className="hover:text-white">Terms</Link> · <Link href="/privacy" className="hover:text-white">Privacy</Link>
      </footer>
    </div>
  )
}
