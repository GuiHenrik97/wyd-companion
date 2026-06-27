import { Injectable, Inject } from '@nestjs/common'
import { DailyLogRepositoryPort, DAILY_LOG_REPOSITORY } from '../../ports/daily-log.repository.port'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../ports/character.repository.port'
import { TaskType, GUILD_TASKS, GUILD_TASK_DAYS } from '../../../domain/enums/task-type.enum'

@Injectable()
export class GetTodayTasksUseCase {
  constructor(
    @Inject(DAILY_LOG_REPOSITORY) private dailyRepo: DailyLogRepositoryPort,
    @Inject(CHARACTER_REPOSITORY) private characterRepo: CharacterRepositoryPort,
  ) {}

  async execute(characterId: string, userId: string) {
    const character = await this.characterRepo.findById(characterId)
    if (!character || character.userId !== userId) return null

    const today = new Date()
    const dayOfWeek = today.getDay()
    const log = await this.dailyRepo.findByCharacterAndDate(characterId, today)
    const cycle = await this.dailyRepo.findCheckinCycle(characterId)

    const tasks = [
      { type: TaskType.CHECKIN, done: log?.checkinDone ?? false, cycleDay: cycle?.currentDay ?? 1 },
      { type: TaskType.INFERNAL, count: log?.infernalCount ?? 0, max: 2 },
      { type: TaskType.MORTAL, done: log?.mortalDelivered ?? false },
      { type: TaskType.DESERTO, done: log?.desertDone ?? false },
      { type: TaskType.ESPOLIOS, done: log?.spoilsDone ?? false },
    ]

    if (character.hasGuild) {
      const towersDays = [1, 2, 3, 4, 5]
      if (towersDays.includes(dayOfWeek)) {
        tasks.push({ type: TaskType.TORRES, done: log?.towersDone ?? false })
      }
      if (dayOfWeek === 6) {
        tasks.push({ type: TaskType.KEFRA, done: log?.kefraDone ?? false })
      }
      if (dayOfWeek === 0) {
        tasks.push({ type: TaskType.CIDADE, done: log?.cityWarDone ?? false })
      }
    }

    return tasks
  }
}
