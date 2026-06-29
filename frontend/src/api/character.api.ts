import { api } from './client'

export const characterApi = {
  list: () => api.get('/characters'),
  create: (data: { nick: string; guild?: string; hasGuild?: boolean }) =>
    api.post('/characters', data),
  updateSeal: (id: string, data: any) => api.patch(`/characters/${id}/seal`, data),
  updateAccountGear: (id: string, data: any) => api.patch(`/characters/${id}/account-gear`, data),
  updateItemSet: (id: string, data: any) => api.patch(`/characters/${id}/item-set`, data),
  update: (id: string, data: { nick?: string; guild?: string; hasGuild?: boolean; mantleColor?: string }) =>
    api.patch(`/characters/${id}`, data),
}
