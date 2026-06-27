import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common'
import { DailyLogRepositoryPort, DAILY_LOG_REPOSITORY } from '../../ports/daily-log.repository.port'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'
import { TaskType } from '../../../domain/enums/task-type.enum'

@Injectable()
export class MarkTaskDoneUseCase {
  constructor(
    @Inject(DAILY_LOG_REPOSITORY) private dailyRepo: DailyLogRepositoryPort,
    @Inject(CHARACTER_REPOSITORY) private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(characterId: string, userId: string, task: TaskType) {
    const character = await this.characterRepo.findById(characterId)
    if (!character || character.userId !== userId) {
      throw new NotFoundException('Personagem não encontrado')
    }

    const today = new Date()
    const log = await this.dailyRepo.findByCharacterAndDate(characterId, today)

    if (task === TaskType.INFERNAL) {
      const current = log?.infernalCount ?? 0
      if (current >= 2) throw new BadRequestException('Infernal já foi feita 2 vezes hoje')
      return this.dailyRepo.upsert(characterId, today, { infernalCount: current + 1 })
    }

    if (task === TaskType.CHECKIN) {
      const cycle = await this.dailyRepo.findCheckinCycle(characterId)
      const currentDay = cycle?.currentDay ?? 1
      const nextDay = currentDay >= 14 ? 1 : currentDay + 1
      await this.dailyRepo.advanceCheckinCycle(characterId, nextDay)
      return this.dailyRepo.upsert(characterId, today, { checkinDone: true })
    }

    const fieldMap: Record<string, string> = {
      [TaskType.DESERTO]: 'desertDone',
      [TaskType.ESPOLIOS]: 'spoilsDone',
      [TaskType.MORTAL]: 'mortalDelivered',
      [TaskType.TORRES]: 'towersDone',
      [TaskType.KEFRA]: 'kefraDone',
      [TaskType.CIDADE]: 'cityWarDone',
    }

    const field = fieldMap[task]
    if (!field) throw new BadRequestException('Task inválida')
    return this.dailyRepo.upsert(characterId, today, { [field]: true })
  }
}
