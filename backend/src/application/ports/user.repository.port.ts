import { UserEntity } from '../../domain/entities/user.entity'

export interface UserRepositoryPort {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  save(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity>
  updateRefreshToken(id: string, token: string | null): Promise<void>
}

export const USER_REPOSITORY = 'USER_REPOSITORY'
