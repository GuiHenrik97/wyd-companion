import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator'
import { ClassType } from '../../domain/enums/class-type.enum'

export class CreateCharacterDto {
  @IsString()
  nick: string

  @IsOptional()
  @IsString()
  guild?: string

  @IsBoolean()
  @IsOptional()
  hasGuild?: boolean

  @IsEnum(ClassType)
  @IsOptional()
  class1Type?: ClassType

  @IsString()
  @IsOptional()
  class1Lineage?: string
}
