import { IsEnum, IsOptional, IsIn } from 'class-validator'
import { TaskType } from '../../domain/enums/task-type.enum'

export class MarkTaskDto {
  @IsEnum(TaskType)
  task: TaskType

  @IsOptional()
  @IsIn(['boss', 'delivery', 'unmark'])
  action?: 'boss' | 'delivery' | 'unmark'
}
