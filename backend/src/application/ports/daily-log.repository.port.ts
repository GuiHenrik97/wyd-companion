export abstract class DailyLogRepositoryPort {
  abstract findByCharacterAndDate(characterId: string, date: Date): Promise<any | null>
  abstract upsert(characterId: string, date: Date, data: any): Promise<any>
  abstract findCheckinCycle(characterId: string): Promise<any | null>
  abstract advanceCheckinCycle(characterId: string, nextDay: number): Promise<void>
  abstract setCheckinDay(characterId: string, day: number): Promise<void>
}

export const DAILY_LOG_REPOSITORY = 'DAILY_LOG_REPOSITORY'
