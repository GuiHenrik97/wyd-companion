import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  email: string | null
  emailVerified: boolean
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUserId: (userId: string) => void
  setEmail: (email: string) => void
  setEmailVerified: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      emailVerified: false,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),
      setUserId: (userId) => set({ userId }),
      setEmail: (email) => set({ email }),
      setEmailVerified: (v) => set({ emailVerified: v }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, userId: null, email: null, emailVerified: false, isAuthenticated: false }),
    }),
    { name: 'wyd-auth' }
  )
)
