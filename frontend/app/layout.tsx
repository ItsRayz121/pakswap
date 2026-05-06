import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'PakSwap — Pakistan ka apna P2P Crypto Exchange',
  description: 'Buy and sell USDT, BTC, ETH using JazzCash, Easypaisa, and bank transfers. Pakistan-first, KYC-verified, escrow-protected.',
  keywords: 'buy USDT Pakistan, P2P crypto exchange Pakistan, JazzCash USDT, Easypaisa crypto',
  openGraph: {
    title: 'PakSwap',
    description: 'Pakistan ka apna P2P crypto exchange',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
