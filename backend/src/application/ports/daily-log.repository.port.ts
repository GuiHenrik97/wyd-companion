export interface DailyLogRepositoryPort {
  findByCharacterAndDate(characterId: string, date: Date): Promise<any | null>
  upsert(characterId: string, date: Date, data: any): Promise<any>
  findCheckinCycle(characterId: string): Promise<any | null>
  advanceCheckinCycle(characterId: string, nextDay: number): Promise<void>
}

export const DAILY_LOG_REPOSITORY = 'DAILY_LOG_REPOSITORY'
