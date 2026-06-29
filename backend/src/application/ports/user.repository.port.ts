export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<any | null>
  abstract findByEmail(email: string): Promise<any | null>
  abstract save(user: {
    email: string
    passwordHash: string
    refreshToken: string | null
    emailVerified?: boolean
    emailVerificationToken?: string
  }): Promise<any>
  abstract updateRefreshToken(id: string, token: string | null): Promise<void>
  abstract findByVerificationToken(token: string): Promise<any | null>
  abstract verifyEmail(id: string): Promise<void>
}

export const USER_REPOSITORY = 'USER_REPOSITORY'
