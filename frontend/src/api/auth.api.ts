import { api } from './client'

export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<{ accessToken: string; refreshToken: string; userId: string }>(
      '/auth/login', { email, password }
    ),

  logout: () => api.post('/auth/logout'),
}
