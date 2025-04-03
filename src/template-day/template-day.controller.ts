import { Controller, Post, Body, Delete, Param, ParseIntPipe, Get } from '@nestjs/common';
import { TemplateService } from '../template/template.service';

@Controller('template-days')
export class TemplateDayController {
  constructor(private readonly templateService: TemplateService) { }

  @Get('by-sclass/:sclassId')
  async getByClassId(@Param('sclassId', ParseIntPipe) sclassId: number) {
    return this.templateService.getTemplateDaysByClassId(sclassId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.getTemplateDayById(id);
  }

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