import { Controller, Post, Body, UseGuards, BadRequestException, Inject } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { RegisterUseCase } from '../../application/use-cases/auth/register.usecase'
import { LoginUseCase } from '../../application/use-cases/auth/login.usecase'
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.usecase'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { USER_REPOSITORY } from '../../application/ports/user.repository.port'
import { UserRepositoryPort } from '../../application/ports/user.repository.port'
import { PrismaService } from '../../infrastructure/database/prisma.service'
import { EmailService } from '../../infrastructure/auth/email.service'

class RegisterDto {
  @IsEmail() email: string
  @IsString() @MinLength(6) password: string
}

class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
}

class RefreshDto {
  @IsString() refreshToken: string
}

@Controller('auth')
export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    @Inject(USER_REPOSITORY) private userRepo: UserRepositoryPort,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto.email, dto.password)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password)
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto, @CurrentUser() user: any) {
    return this.refreshTokenUseCase.execute(user.id, dto.refreshToken)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: any) {
    return { message: 'Logout realizado' }
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    const user = await this.userRepo.findByVerificationToken(body.token)
    if (!user) throw new BadRequestException('Token inválido ou expirado')
    await this.userRepo.verifyEmail(user.id)
    return { message: 'Email verificado com sucesso' }
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  async resendVerification(@CurrentUser() user: any) {
    const dbUser = await this.userRepo.findById(user.id)
    if (!dbUser || dbUser.emailVerified) return { message: 'ok' }
    const token = randomUUID()
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: token },
    })
    await this.emailService.sendVerificationEmail(dbUser.email, token)
    return { message: 'Email reenviado' }
  }
}
