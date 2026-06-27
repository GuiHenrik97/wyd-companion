import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserRepositoryPort } from '../../../application/ports/user.repository.port'
import { UserEntity } from '../../../domain/entities/user.entity'

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) return null
    return new UserEntity(user.id, user.email, user.passwordHash, user.refreshToken, user.createdAt)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    return new UserEntity(user.id, user.email, user.passwordHash, user.refreshToken, user.createdAt)
  }

  async save(data: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: { email: data.email, passwordHash: data.passwordHash },
    })
    return new UserEntity(user.id, user.email, user.passwordHash, user.refreshToken, user.createdAt)
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { refreshToken: token } })
  }
}
