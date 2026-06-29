import { Injectable, ConflictException, Inject } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UserRepositoryPort, USER_REPOSITORY } from '../../ports/user.repository.port'
import { EmailService } from '../../../infrastructure/auth/email.service'

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: UserRepositoryPort,
    @Inject('BCRYPT_SERVICE') private bcrypt: any,
    private emailService: EmailService,
  ) {}

  async execute(email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email)
    if (existing) throw new ConflictException('Email já cadastrado')

    const passwordHash = await this.bcrypt.hash(password)
    const emailVerificationToken = randomUUID()

    const user = await this.userRepo.save({
      email,
      passwordHash,
      refreshToken: null,
      emailVerified: false,
      emailVerificationToken,
    })

    try {
      await this.emailService.sendVerificationEmail(email, emailVerificationToken)
    } catch (e) {
      console.error('Failed to send verification email:', e)
    }

    return user
  }
}
