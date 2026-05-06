import Link from 'next/link'
import { Navbar } from '../components/layout/Navbar'
import { CheckCircle, Info } from 'lucide-react'

export default function FeesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Schedule</h1>
        <p className="text-gray-500 mb-10">Transparent pricing with no hidden charges.</p>

        {/* P2P Fees */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">P2P Marketplace Fees</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fee</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Maker (Ad Creator)</td>
                  <td className="px-4 py-3 text-green-600 font-bold">0%</td>
                  <td className="px-4 py-3 text-gray-500">Always free</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Taker (Order Placer)</td>
                  <td className="px-4 py-3 font-bold text-gray-900">0.5%</td>
                  <td className="px-4 py-3 text-gray-500">0% promo for first 3 months</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Merchant</td>
                  <td className="px-4 py-3 font-bold text-gray-900">0.3%</td>
                  <td className="px-4 py-3 text-gray-500">Verified merchants get reduced fees</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span>Promotional 0% taker fee applies to all new accounts for their first 90 days.</span>
          </div>
        </section>

        {/* Instant Buy Fees */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instant Buy / OTC Fees</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Payment Mode</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">PKR (JazzCash, Easypaisa, Bank)</td>
                  <td className="px-4 py-3 font-bold">1.0%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Crypto-to-Crypto Swap</td>
                  <td className="px-4 py-3 font-bold">0.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Withdrawal Fees */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Withdrawal Fees</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Coin</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Network</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fee</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Min Withdrawal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { coin: 'USDT', network: 'TRC-20 (TRON)', fee: '1 USDT', min: '10 USDT' },
                  { coin: 'USDT', network: 'ERC-20 (ETH)', fee: '5 USDT', min: '20 USDT' },
                  { coin: 'BTC', network: 'Bitcoin', fee: '0.00005 BTC', min: '0.001 BTC' },
                  { coin: 'ETH', network: 'Ethereum', fee: '0.001 ETH', min: '0.01 ETH' },
                  { coin: 'USDC', network: 'ERC-20 (ETH)', fee: '5 USDC', min: '20 USDC' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.coin}</td>
                    <td className="px-4 py-3 text-gray-600">{row.network}</td>
                    <td className="px-4 py-3 text-gray-900">{row.fee}</td>
                    <td className="px-4 py-3 text-gray-500">{row.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* KYC Limits */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Trading Limits by KYC Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { level: 'No KYC', limit: 'View only', color: 'bg-gray-50 border-gray-200' },
              { level: 'Basic KYC', limit: '₨50,000 / day', color: 'bg-blue-50 border-blue-200' },
              { level: 'Full KYC', limit: '₨500,000 / day', color: 'bg-green-50 border-green-200' },
              { level: 'Merchant', limit: '₨5,000,000 / day', color: 'bg-purple-50 border-purple-200' },
            ].map(({ level, limit, color }) => (
              <div key={level} className={`p-4 rounded-xl border ${color}`}>
                <p className="font-semibold text-gray-900">{level}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{limit}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center text-sm text-gray-500">
          Fees are subject to change. Current rates as of May 2026.{' '}
          <Link href="/help" className="text-brand hover:underline">Contact support</Link> for merchant pricing.
        </div>
      </div>
    </div>
  )
}
