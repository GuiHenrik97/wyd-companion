import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DailyLogRepositoryPort } from '../../../application/ports/daily-log.repository.port'

@Injectable()
export class PrismaDailyLogRepository implements DailyLogRepositoryPort {
  constructor(private prisma: PrismaService) {}

  private startOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  async findByCharacterAndDate(characterId: string, date: Date) {
    return this.prisma.dailyLog.findUnique({
      where: { characterId_date: { characterId, date: this.startOfDay(date) } },
    })
  }

  async upsert(characterId: string, date: Date, data: any) {
    const day = this.startOfDay(date)
    return this.prisma.dailyLog.upsert({
      where: { characterId_date: { characterId, date: day } },
      update: data,
      create: { characterId, date: day, ...data },
    })
  }

  async findCheckinCycle(characterId: string) {
    return this.prisma.checkinCycle.findUnique({ where: { characterId } })
  }

  async advanceCheckinCycle(characterId: string, nextDay: number) {
    await this.prisma.checkinCycle.update({
      where: { characterId },
      data: { currentDay: nextDay, lastCheckin: new Date() },
    })
  }

  async setCheckinDay(characterId: string, day: number): Promise<void> {
    await this.prisma.checkinCycle.update({
      where: { characterId },
      data: { currentDay: day },
    })
  }
}
