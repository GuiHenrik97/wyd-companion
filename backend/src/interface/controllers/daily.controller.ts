import { Controller, Get, Post, Patch, Param, Body, UseGuards, Inject, NotFoundException } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { GetTodayTasksUseCase } from '../../application/use-cases/daily/get-today-tasks.usecase'
import { MarkTaskDoneUseCase } from '../../application/use-cases/daily/mark-task-done.usecase'
import { MarkTaskDto } from '../../application/dtos/mark-task.dto'
import { CharacterRepositoryPort, CHARACTER_REPOSITORY } from '../../application/ports/character.repository.port'
import { DailyLogRepositoryPort, DAILY_LOG_REPOSITORY } from '../../application/ports/daily-log.repository.port'

@Controller('characters/:id/daily')
@UseGuards(JwtAuthGuard)
export class DailyController {
  constructor(
    private getTodayTasks: GetTodayTasksUseCase,
    private markTaskDone: MarkTaskDoneUseCase,
    @Inject(CHARACTER_REPOSITORY) private characterRepo: CharacterRepositoryPort,
    @Inject(DAILY_LOG_REPOSITORY) private dailyLogRepo: DailyLogRepositoryPort,
  ) {}

  @Get()
  today(@Param('id') id: string, @CurrentUser() user: any) {
    return this.getTodayTasks.execute(id, user.id)
  }

  @Post('mark')
  mark(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: MarkTaskDto) {
    return this.markTaskDone.execute(id, user.id, dto.task, dto.action)
  }

  @Patch('checkin-cycle')
  async setCheckinDay(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { day: number }
  ) {
    const character = await this.characterRepo.findById(id)
    if (!character || character.userId !== user.id) throw new NotFoundException()
    await this.dailyLogRepo.setCheckinDay(id, body.day)
    return { currentDay: body.day }
  }
}
