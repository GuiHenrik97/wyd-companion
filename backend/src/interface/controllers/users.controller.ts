import { Controller, Delete, Param, UseGuards, UnauthorizedException } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { PrismaService } from '../../infrastructure/database/prisma.service'

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.id !== id) throw new UnauthorizedException()
    await this.prisma.user.delete({ where: { id } })
    return { message: 'Conta excluída com sucesso' }
  }
}
