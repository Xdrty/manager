import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SclassService } from './sclass.service';

@Controller('sclasses')
export class SclassController {
  constructor(private readonly sclassService: SclassService) { }

  @Post()
  async createSclass(@Body('name') name: string) {
    return this.sclassService.createSclass(name);
  }

  @Get()
  async getAllSclasses() {
    return this.sclassService.getAllSclasses();
  }

  @Get(':id')
  async getSclassById(@Param('id') id: string) {
    return this.sclassService.getSclassById(parseInt(id));
  }

  @Patch(':id')
  async updateSclass(@Param('id') id: string, @Body('name') name: string) {
    return this.sclassService.updateSclass(parseInt(id), name);
  }

  @Delete(':id')
  async deleteSclass(@Param('id') id: string) {
    await this.sclassService.deleteSclass(parseInt(id));
    return { message: 'Класс удален' };
  }
}