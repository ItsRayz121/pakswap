import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'
import { Search, ChevronRight, MessageCircle, Book, Shield, Wallet, TrendingUp, AlertCircle } from 'lucide-react'

const CATEGORIES = [
  {
    icon: Book,
    title: 'Getting Started',
    desc: 'Account setup, KYC verification, first trade',
    articles: [
      { slug: 'how-to-register', title: 'How to create an account' },
      { slug: 'complete-kyc', title: 'How to complete KYC verification' },
      { slug: 'first-trade', title: 'How to place your first trade' },
    ],
  },
  {
    icon: TrendingUp,
    title: 'Trading',
    desc: 'P2P marketplace, ads, orders, chat',
    articles: [
      { slug: 'how-p2p-works', title: 'How P2P trading works' },
      { slug: 'upload-payment-proof', title: 'How to upload payment proof' },
      { slug: 'trade-timer', title: 'Understanding the payment timer' },
    ],
  },
  {
    icon: Wallet,
    title: 'Wallet & Payments',
    desc: 'Deposits, withdrawals, payment methods',
    articles: [
      { slug: 'deposit-crypto', title: 'How to deposit cryptocurrency' },
      { slug: 'withdraw-crypto', title: 'How to withdraw cryptocurrency' },
      { slug: 'add-payment-method', title: 'Adding JazzCash / Easypaisa / Bank account' },
    ],
  },
  {
    icon: Shield,
    title: 'Security & KYC',
    desc: 'Two-factor authentication, identity verification',
    articles: [
      { slug: 'enable-2fa', title: 'How to enable 2FA' },
      { slug: 'kyc-rejected', title: 'What to do if KYC is rejected' },
      { slug: 'account-security', title: 'Keeping your account secure' },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Disputes',
    desc: 'Open disputes, evidence, resolution process',
    articles: [
      { slug: 'open-dispute', title: 'How to open a dispute' },
      { slug: 'dispute-evidence', title: 'What evidence to provide' },
      { slug: 'dispute-resolution', title: 'How disputes are resolved' },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-brand py-12 px-4">
        <div className="page-container max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">How can we help?</h1>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </div>

      <div className="page-container py-12 max-w-4xl">
        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {CATEGORIES.map(({ icon: Icon, title, desc, articles }) => (
            <div key={title} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{title}</h2>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {articles.map(({ slug, title: articleTitle }) => (
                  <li key={slug}>
                    <Link href={`/help/${slug}`} className="flex items-center justify-between text-sm text-gray-700 hover:text-brand py-1.5 border-b border-gray-50 last:border-0 group">
                      <span>{articleTitle}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="card p-8 text-center">
          <MessageCircle size={40} className="text-brand mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Can't find your answer?</h2>
          <p className="text-gray-500 mb-6">Our support team is available 9 AM – 9 PM PKT, 7 days a week.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@pakswap.com" className="btn-md btn-primary">Email Support</a>
            <a href="https://t.me/pakswap_support" className="btn-md btn-secondary" target="_blank" rel="noopener noreferrer">Telegram Support</a>
          </div>
        </div>
      </div>

      <footer className="py-8 bg-gray-900 text-center text-sm text-gray-500">
        © 2026 PakSwap. <Link href="/terms" className="hover:text-white">Terms</Link> · <Link href="/privacy" className="hover:text-white">Privacy</Link>
      </footer>
    </div>
  )
}
