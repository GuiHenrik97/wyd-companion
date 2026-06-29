import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUserId: (userId: string) => void
  setEmail: (email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),
      setUserId: (userId) => set({ userId }),
      setEmail: (email) => set({ email }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, userId: null, email: null, isAuthenticated: false }),
    }),
    { name: 'wyd-auth' }
  )
)
