export class UserEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public refreshToken: string | null,
    public readonly createdAt: Date,
    public emailVerified: boolean = false,
  ) {}
}
