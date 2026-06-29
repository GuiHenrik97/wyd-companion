import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { PrismaService } from './infrastructure/database/prisma.service'
import { PrismaUserRepository } from './infrastructure/database/repositories/prisma-user.repository'
import { PrismaCharacterRepository } from './infrastructure/database/repositories/prisma-character.repository'
import { PrismaDailyLogRepository } from './infrastructure/database/repositories/prisma-daily-log.repository'
import { BcryptService } from './infrastructure/auth/bcrypt.service'
import { JwtStrategy } from './infrastructure/auth/jwt.strategy'

import { RegisterUseCase } from './application/use-cases/auth/register.usecase'
import { LoginUseCase } from './application/use-cases/auth/login.usecase'
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.usecase'
import { CreateCharacterUseCase } from './application/use-cases/character/create-character.usecase'
import { ListCharactersUseCase } from './application/use-cases/character/list-characters.usecase'
import { UpdateSealUseCase } from './application/use-cases/character/update-seal.usecase'
import { UpdateAccountGearUseCase } from './application/use-cases/character/update-account-gear.usecase'
import { UpdateItemSetUseCase } from './application/use-cases/character/update-item-set.usecase'
import { GetTodayTasksUseCase } from './application/use-cases/daily/get-today-tasks.usecase'
import { MarkTaskDoneUseCase } from './application/use-cases/daily/mark-task-done.usecase'

import { AuthController } from './interface/controllers/auth.controller'
import { CharacterController } from './interface/controllers/character.controller'
import { DailyController } from './interface/controllers/daily.controller'
import { CalculatorController } from './interface/controllers/calculator.controller'
import { UsersController } from './interface/controllers/users.controller'

import { USER_REPOSITORY } from './application/ports/user.repository.port'
import { CHARACTER_REPOSITORY } from './application/ports/character.repository.port'
import { DAILY_LOG_REPOSITORY } from './application/ports/daily-log.repository.port'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController, CharacterController, DailyController, CalculatorController, UsersController],
  providers: [
    PrismaService,
    JwtStrategy,

    { provide: 'BCRYPT_SERVICE', useClass: BcryptService },

    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: CHARACTER_REPOSITORY, useClass: PrismaCharacterRepository },
    { provide: DAILY_LOG_REPOSITORY, useClass: PrismaDailyLogRepository },

    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    CreateCharacterUseCase,
    ListCharactersUseCase,
    UpdateSealUseCase,
    UpdateAccountGearUseCase,
    UpdateItemSetUseCase,
    GetTodayTasksUseCase,
    MarkTaskDoneUseCase,
  ],
})
export class AppModule {}
