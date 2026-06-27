import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { RegisterUseCase } from '../../application/use-cases/auth/register.usecase'
import { LoginUseCase } from '../../application/use-cases/auth/login.usecase'
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.usecase'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'

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
}
