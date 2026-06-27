import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator'
import { ClassType, MantleType } from '../../domain/enums/equipment-type.enum'
import { ClassType as CT } from '../../domain/enums/class-type.enum'

export class UpdateSealDto {
  @IsOptional() @IsEnum(CT) bodyClass?: CT
  @IsOptional() @IsEnum(CT) class1Type?: CT
  @IsOptional() @IsString() class1Lineage?: string
  @IsOptional() @IsInt() @Min(0) class1Level?: number
  @IsOptional() @IsBoolean() class1Has11th?: boolean
  @IsOptional() @IsBoolean() class1Has12th?: boolean
  @IsOptional() @IsBoolean() class1Spectral?: boolean
  @IsOptional() @IsBoolean() class1Concentration?: boolean
  @IsOptional() @IsBoolean() class1Resurrection?: boolean
  @IsOptional() @IsEnum(CT) class2Type?: CT
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
