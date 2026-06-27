import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator'
import { ClassType } from '../../domain/enums/class-type.enum'
import { MantleType } from '../../domain/enums/equipment-type.enum'

export class UpdateSealDto {
  @IsOptional() @IsEnum(ClassType) bodyClass?: ClassType
  @IsOptional() @IsEnum(ClassType) class1Type?: ClassType
  @IsOptional() @IsString() class1Lineage?: string
  @IsOptional() @IsInt() @Min(0) class1Level?: number
  @IsOptional() @IsBoolean() class1Has11th?: boolean
  @IsOptional() @IsBoolean() class1Has12th?: boolean
  @IsOptional() @IsBoolean() class1Spectral?: boolean
  @IsOptional() @IsBoolean() class1Concentration?: boolean
  @IsOptional() @IsBoolean() class1Resurrection?: boolean
  @IsOptional() @IsEnum(ClassType) class2Type?: ClassType
  @IsOptional() @IsString() class2Lineage?: string
  @IsOptional() @IsInt() @Min(0) class2Level?: number
  @IsOptional() @IsBoolean() class2Has11th?: boolean
  @IsOptional() @IsBoolean() class2Has12th?: boolean
  @IsOptional() @IsBoolean() class2Spectral?: boolean
  @IsOptional() @IsBoolean() class2Concentration?: boolean
  @IsOptional() @IsBoolean() class2Resurrection?: boolean
  @IsOptional() @IsEnum(MantleType) mantleType?: MantleType
  @IsOptional() @IsInt() @Min(0) @Max(15) mantleRefinement?: number
  @IsOptional() @IsString() mantleAdditional?: string
  @IsOptional() @IsInt() @Min(0) mantleTier?: number
}
