import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepositoryPort, USER_REPOSITORY } from '../../ports/user.repository.port'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: UserRepositoryPort,
    private jwtService: JwtService,
  ) {}

  async execute(userId: string, refreshToken: string) {
    const user = await this.userRepo.findById(userId)
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido')
    }

    try {
      this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
    } catch {
      throw new UnauthorizedException('Refresh token expirado')
    }

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })

    return { accessToken }
  }
}
