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

  async execute(characterId: string, userId: string, task: TaskType, action?: string) {
    const character = await this.characterRepo.findById(characterId)
    if (!character || character.userId !== userId) {
      throw new NotFoundException('Personagem não encontrado')
    }

    const today = new Date()
    const log = await this.dailyRepo.findByCharacterAndDate(characterId, today)

    if (action === 'unmark') {
      const fieldMap: Record<string, any> = {
        [TaskType.CHECKIN]: { checkinDone: false },
        [TaskType.INFERNAL]: { infernalCount: 0 },
        [TaskType.MORTAL]: { mortalDelivered: false },
        [TaskType.DESERTO]: { desertDone: false },
        [TaskType.ESPOLIOS]: { spoilsDone: false },
        [TaskType.TORRES]: { towersDone: false },
        [TaskType.KEFRA]: { kefraDone: false },
        [TaskType.CIDADE]: { cityWarDone: false },
        [TaskType.CACA]: { cacaBossDone: false, cacaDeliveryDone: false },
      }
      const data = fieldMap[task]
      if (!data) throw new BadRequestException('Task inválida')
      return this.dailyRepo.upsert(characterId, today, data)
    }

    if (task === TaskType.CACA) {
      if (action === 'boss') return this.dailyRepo.upsert(characterId, today, { cacaBossDone: true })
      if (action === 'delivery') return this.dailyRepo.upsert(characterId, today, { cacaDeliveryDone: true })
      throw new BadRequestException('Ação inválida para CACA: use boss ou delivery')
    }

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
