export abstract class CharacterRepositoryPort {
  abstract findById(id: string): Promise<any | null>
  abstract findAllByUserId(userId: string): Promise<any[]>
  abstract create(data: any): Promise<any>
  abstract updateSeal(characterId: string, data: any): Promise<any>
  abstract updateAccountGear(characterId: string, data: any): Promise<any>
  abstract updateItemSet(characterId: string, data: any): Promise<any>
  abstract delete(id: string): Promise<void>
}

export const CHARACTER_REPOSITORY = 'CHARACTER_REPOSITORY'
