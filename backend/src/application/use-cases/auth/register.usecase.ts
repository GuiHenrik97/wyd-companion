import { Injectable, ConflictException, Inject } from '@nestjs/common'
import { UserRepositoryPort, USER_REPOSITORY } from '../../ports/user.repository.port'

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepo: UserRepositoryPort,
    @Inject('BCRYPT_SERVICE')
    private bcrypt: any,
  ) {}

  async execute(email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email)
    if (existing) throw new ConflictException('Email já cadastrado')

    const passwordHash = await this.bcrypt.hash(password)
    return this.userRepo.save({ email, passwordHash, refreshToken: null })
  }
}
