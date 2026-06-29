import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CharacterRepositoryPort } from '../../../application/ports/character.repository.port'

@Injectable()
export class PrismaCharacterRepository implements CharacterRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
      include: { seal: true, accountGear: true, itemSet: true },
    })
  }

  async findAllByUserId(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      include: { seal: true, accountGear: true, itemSet: true },
    })
  }

  async create(data: { userId: string; nick: string; guild?: string; hasGuild?: boolean; mantleColor?: string }) {
    return this.prisma.character.create({
      data: {
        userId: data.userId,
        nick: data.nick,
        guild: data.guild,
        hasGuild: data.hasGuild ?? false,
        mantleColor: data.mantleColor ?? null,
        seal: { create: { bodyClass: 'TK', class1Type: 'TK', class1Lineage: '' } },
        accountGear: { create: {} },
        itemSet: { create: {} },
        checkinCycle: { create: { currentDay: 1 } },
      },
      include: { seal: true, accountGear: true, itemSet: true },
    })
  }

  async updateSeal(characterId: string, data: any) {
    return this.prisma.seal.upsert({
      where: { characterId },
      update: data,
      create: { characterId, bodyClass: 'TK', class1Type: 'TK', class1Lineage: '', ...data },
    })
  }

  async updateAccountGear(characterId: string, data: any) {
    return this.prisma.accountGear.upsert({
      where: { characterId },
      update: data,
      create: { characterId, ...data },
    })
  }

  async updateItemSet(characterId: string, data: any) {
    return this.prisma.itemSet.upsert({
      where: { characterId },
      update: data,
      create: { characterId, ...data },
    })
  }

  async delete(id: string) {
    await this.prisma.character.delete({ where: { id } })
  }
}
