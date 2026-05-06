'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, ChevronDown, LogOut, Settings, User, Wallet, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { authApi } from '@/lib/api'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    router.push('/login')
  }

  const navLinks = [
    { href: '/marketplace', label: 'P2P Market' },
    { href: '/instant-buy', label: 'Instant Buy' },
    { href: '/fees', label: 'Fees' },
    { href: '/help', label: 'Help' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            PakSwap
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href) ? 'text-brand' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link href="/dashboard" className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <Bell size={20} />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand font-semibold text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 card shadow-xl py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className={`mt-1 badge ${user.kycLevel === 'full' ? 'badge-green' : user.kycLevel === 'basic' ? 'badge-blue' : 'badge-gray'}`}>
                          KYC: {user.kycLevel}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <User size={14} /> Dashboard
                        </Link>
                        <Link href="/wallet" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Wallet size={14} /> Wallet
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Settings size={14} /> Settings
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                          <LogOut size={14} /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-md btn-ghost text-sm">Log In</Link>
                <Link href="/register" className="btn-md btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm text-gray-700 hover:text-brand"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
