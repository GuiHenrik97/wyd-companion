import { IsEnum } from 'class-validator'
import { TaskType } from '../../domain/enums/task-type.enum'

export class MarkTaskDto {
  @IsEnum(TaskType)
  task: TaskType
}
