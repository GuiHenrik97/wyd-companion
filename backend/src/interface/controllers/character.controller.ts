import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { CreateCharacterUseCase } from '../../application/use-cases/character/create-character.usecase'
import { ListCharactersUseCase } from '../../application/use-cases/character/list-characters.usecase'
import { DeleteCharacterUseCase } from '../../application/use-cases/character/delete-character.usecase'
import { UpdateSealUseCase } from '../../application/use-cases/character/update-seal.usecase'
import { UpdateAccountGearUseCase } from '../../application/use-cases/character/update-account-gear.usecase'
import { UpdateItemSetUseCase } from '../../application/use-cases/character/update-item-set.usecase'
import { CreateCharacterDto } from '../../application/dtos/create-character.dto'
import { UpdateSealDto } from '../../application/dtos/update-seal.dto'
import { PrismaService } from '../../infrastructure/database/prisma.service'

@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(
    private createCharacter: CreateCharacterUseCase,
    private listCharacters: ListCharactersUseCase,
    private deleteCharacter: DeleteCharacterUseCase,
    private updateSeal: UpdateSealUseCase,
    private updateAccountGear: UpdateAccountGearUseCase,
    private updateItemSet: UpdateItemSetUseCase,
    private prisma: PrismaService,
  ) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.listCharacters.execute(user.id)
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCharacterDto) {
    return this.createCharacter.execute(user.id, dto)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { nick?: string; guild?: string; hasGuild?: boolean; mantleColor?: string },
  ) {
    const characters = await this.listCharacters.execute(user.id)
    const char = characters.find((c: any) => c.id === id)
    if (!char) throw new NotFoundException()
    return this.prisma.character.update({
      where: { id },
      data: body,
      include: { seal: true, accountGear: true, itemSet: true },
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const characters = await this.listCharacters.execute(user.id)
    const char = characters.find((c: any) => c.id === id)
    if (!char) throw new NotFoundException()
    await this.deleteCharacter.execute(id)
    return { message: 'Personagem removido' }
  }

  @Patch(':id/seal')
  seal(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateSealDto) {
    return this.updateSeal.execute(id, user.id, dto)
  }

  @Patch(':id/account-gear')
  accountGear(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
    return this.updateAccountGear.execute(id, user.id, body)
  }

  @Patch(':id/item-set')
  itemSet(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
    return this.updateItemSet.execute(id, user.id, body)
  }
}
