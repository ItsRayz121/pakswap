import Link from 'next/link'
import { Shield, Zap, Users, TrendingUp, ChevronRight, CheckCircle } from 'lucide-react'
import { Navbar } from './components/layout/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-white py-20 px-4">
        <div className="page-container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm text-brand font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Pakistan's Most Trusted P2P Crypto Exchange
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Buy & Sell Crypto with<br />
            <span className="text-brand">Pakistani Rupees</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Trade USDT, BTC, ETH, and USDC directly with other Pakistanis via JazzCash, Easypaisa, or Bank Transfer. No hidden fees. Full KYC protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-lg btn-primary px-8">
              Start Trading Free <ChevronRight size={18} />
            </Link>
            <Link href="/marketplace" className="btn-lg btn-secondary px-8">
              Browse Market
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No account needed to browse. KYC required to trade.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '₨2.8B+', label: 'Trading Volume' },
              { value: '15,000+', label: 'Active Traders' },
              { value: '99.2%', label: 'Dispute Resolution Rate' },
              { value: '< 4hr', label: 'Avg KYC Approval' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-brand">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="page-container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why PakSwap?</h2>
            <p className="text-gray-500">Built from the ground up for the Pakistani crypto market.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, color: 'bg-blue-50 text-blue-600', title: 'Two-Layer Security', desc: 'Every payment verified by AI scan + human admin. Funds only released after both layers approve.' },
              { icon: Zap, color: 'bg-yellow-50 text-yellow-600', title: 'Instant Escrow', desc: 'Crypto locked in internal escrow the moment you trade. No smart contracts, no on-chain risk.' },
              { icon: Users, color: 'bg-green-50 text-green-600', title: 'Verified Traders', desc: 'All traders go through CNIC + selfie verification. Trade with confidence.' },
              { icon: TrendingUp, color: 'bg-purple-50 text-purple-600', title: 'Live PKR Rates', desc: 'Real-time USDT/PKR rate updated every 30 seconds. No stale pricing.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="page-container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How to Buy Crypto</h2>
            <p className="text-gray-500">Simple, fast, and secure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Register with your email and phone number in under 2 minutes.' },
              { step: '02', title: 'Complete KYC', desc: 'Upload your CNIC and selfie. Approved within 4 hours.' },
              { step: '03', title: 'Browse Ads', desc: 'Find the best rates from verified sellers in the marketplace.' },
              { step: '04', title: 'Trade Safely', desc: 'Send PKR, upload proof, and receive crypto after verification.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4">
        <div className="page-container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Supported Payment Methods</h2>
          <p className="text-gray-500 mb-8">Pay and receive in the way that's most convenient for you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['JazzCash', 'Easypaisa', 'Bank Transfer (IBAN)', 'HBL', 'MCB', 'UBL', 'Meezan Bank'].map((pm) => (
              <div key={pm} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                <CheckCircle size={14} className="text-green-500" />
                {pm}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand px-4">
        <div className="page-container text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start?</h2>
          <p className="text-white/70 mb-8">Join thousands of Pakistanis trading crypto safely every day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-lg bg-white text-brand hover:bg-gray-50 px-8">
              Create Free Account
            </Link>
            <Link href="/marketplace" className="btn-lg bg-white/20 text-white hover:bg-white/30 px-8">
              Browse Market
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 px-4">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">PakSwap</h4>
              <p className="text-gray-400 text-sm">Pakistan's trusted P2P crypto exchange. Trade safely with KYC verification and two-layer payment security.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">P2P Marketplace</Link></li>
                <li><Link href="/instant-buy" className="hover:text-white transition-colors">Instant Buy</Link></li>
                <li><Link href="/fees" className="hover:text-white transition-colors">Fee Schedule</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/aml-policy" className="hover:text-white transition-colors">AML Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © 2026 PakSwap. All rights reserved. Not regulated by SBP. Trade at your own risk.
          </div>
        </div>
      </footer>
    </div>
  )
}
