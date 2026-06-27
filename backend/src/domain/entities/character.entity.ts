import { ValidationError } from '../errors/domain.error'

export class CharacterEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public nick: string,
    public guild: string | null,
    public hasGuild: boolean,
    public weaponRefinement: number = 0,
    public weaponAncient: boolean = false,
  ) {}

  setWeaponAncient(value: boolean): void {
    if (value && this.weaponRefinement < 9) {
      throw new ValidationError(
        'Arma precisa ter refinação +9 ou superior para ser Ancient'
      )
    }
    this.weaponAncient = value
  }

  advanceCheckinCycle(currentDay: number): number {
    return currentDay >= 14 ? 1 : currentDay + 1
  }

  canDoInfernal(currentCount: number): boolean {
    return currentCount < 2
  }
}
