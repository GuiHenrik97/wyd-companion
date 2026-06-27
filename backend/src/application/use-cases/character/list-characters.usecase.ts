import { Injectable, Inject } from '@nestjs/common'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'

@Injectable()
export class ListCharactersUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(userId: string) {
    return this.characterRepo.findAllByUserId(userId)
  }
}
