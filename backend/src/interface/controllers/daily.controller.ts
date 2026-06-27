import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { GetTodayTasksUseCase } from '../../application/use-cases/daily/get-today-tasks.usecase'
import { MarkTaskDoneUseCase } from '../../application/use-cases/daily/mark-task-done.usecase'
import { MarkTaskDto } from '../../application/dtos/mark-task.dto'

@Controller('characters/:id/daily')
@UseGuards(JwtAuthGuard)
export class DailyController {
  constructor(
    private getTodayTasks: GetTodayTasksUseCase,
    private markTaskDone: MarkTaskDoneUseCase,
  ) {}

  @Get()
  today(@Param('id') id: string, @CurrentUser() user: any) {
    return this.getTodayTasks.execute(id, user.id)
  }

  @Post('mark')
  mark(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: MarkTaskDto) {
    return this.markTaskDone.execute(id, user.id, dto.task)
  }
}
