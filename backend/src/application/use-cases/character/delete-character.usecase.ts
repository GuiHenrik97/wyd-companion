import { Injectable, Inject } from '@nestjs/common'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'

@Injectable()
export class DeleteCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(id: string) {
    return this.characterRepo.delete(id)
  }
}
