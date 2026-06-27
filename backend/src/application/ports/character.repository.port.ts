export interface CharacterRepositoryPort {
  findById(id: string): Promise<any | null>
  findAllByUserId(userId: string): Promise<any[]>
  create(data: any): Promise<any>
  updateSeal(characterId: string, data: any): Promise<any>
  updateAccountGear(characterId: string, data: any): Promise<any>
  updateItemSet(characterId: string, data: any): Promise<any>
  delete(id: string): Promise<void>
}

export const CHARACTER_REPOSITORY = 'CHARACTER_REPOSITORY'
