import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  phone?: string | null
  emailVerified?: boolean
  phoneVerified?: boolean
  fullName: string
  username?: string
  role: string
  kycLevel: string
  kycStatus: string
  twoFaEnabled: boolean
  referralCode?: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        localStorage.setItem('access_token', accessToken)
        // Set cookie so middleware can protect routes server-side
        document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
        set({ user, accessToken, isAuthenticated: true })
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      logout: () => {
        localStorage.removeItem('access_token')
        document.cookie = 'access_token=; path=/; max-age=0'
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'pakswap-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
