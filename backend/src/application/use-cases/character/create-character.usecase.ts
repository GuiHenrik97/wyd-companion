import { Injectable, Inject } from '@nestjs/common'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'

@Injectable()
export class CreateCharacterUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(userId: string, data: { nick: string; guild?: string; hasGuild?: boolean; mantleColor?: string }) {
    return this.characterRepo.create({ userId, ...data })
  }
}
