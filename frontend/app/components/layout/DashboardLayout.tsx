'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, CreditCard, FileText, Home, MessageSquare, Settings, ShoppingCart, Wallet, Star, Users } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { Navbar } from './Navbar'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/marketplace', icon: ShoppingCart, label: 'P2P Market' },
  { href: '/instant-buy', icon: BarChart2, label: 'Instant Buy' },
  { href: '/orders', icon: FileText, label: 'Orders' },
  { href: '/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/payment-methods', icon: CreditCard, label: 'Payment Methods' },
  { href: '/my-ads', icon: Star, label: 'My Ads' },
  { href: '/dispute-history', icon: MessageSquare, label: 'Disputes' },
  { href: '/referral', icon: Users, label: 'Referral' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200 pt-4 pb-8 fixed">
          <nav className="flex flex-col gap-0.5 px-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-brand-50 text-brand'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56 min-h-[calc(100vh-4rem)]">
          <div className="page-container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
