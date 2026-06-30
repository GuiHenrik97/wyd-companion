import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepositoryPort, USER_REPOSITORY } from '../../ports/user.repository.port'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: UserRepositoryPort,
    private jwtService: JwtService,
  ) {}

  async execute(refreshToken: string) {
    let payload: any
    try {
      payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
    } catch {
      throw new UnauthorizedException('Refresh token expirado')
    }

    const user = await this.userRepo.findById(payload.sub)
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido')
    }

    const newPayload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' })

    return { accessToken }
  }
}
