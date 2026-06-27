import { api } from './client'

export const dailyApi = {
  getTasks: (characterId: string) => api.get(`/characters/${characterId}/daily`),
  markDone: (characterId: string, task: string, action?: string) =>
    api.post(`/characters/${characterId}/daily/mark`, { task, action }),
  unmark: (characterId: string, task: string) =>
    api.post(`/characters/${characterId}/daily/mark`, { task, action: 'unmark' }),
  setCheckinDay: (characterId: string, day: number) =>
    api.patch(`/characters/${characterId}/daily/checkin-cycle`, { day }),
}
