import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUserId: (userId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),
      setUserId: (userId) => set({ userId }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, userId: null, isAuthenticated: false }),
    }),
    { name: 'wyd-auth' }
  )
)
