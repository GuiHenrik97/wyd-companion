import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'

@Injectable()
export class UpdateItemSetUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(characterId: string, userId: string, data: any) {
    const character = await this.characterRepo.findById(characterId)
    if (!character || character.userId !== userId) {
      throw new NotFoundException('Personagem não encontrado')
    }
    return this.characterRepo.updateItemSet(characterId, data)
  }
}
