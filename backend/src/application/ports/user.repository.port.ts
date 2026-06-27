export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<any | null>
  abstract findByEmail(email: string): Promise<any | null>
  abstract save(user: any): Promise<any>
  abstract updateRefreshToken(id: string, token: string | null): Promise<void>
}

export const USER_REPOSITORY = 'USER_REPOSITORY'
