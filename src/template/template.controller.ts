import { Controller, Post, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { TemplateService } from './template.service'; // Обновленный импорт сервиса

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  @Post()
  async create(
    @Body() data: {
      dayOfWeek: number;
      sclassId: number;
      lessons: { name: string, serialNumber: number, homework: string }[];
    }) {
    return this.templateService.createTemplateDay(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.deleteTemplateDay(id);
  }
}