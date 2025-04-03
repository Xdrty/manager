import { Controller, Post, Body, Delete, Patch, Param, ParseIntPipe, Get } from '@nestjs/common';
import { TemplateLessonService } from './template-lesson.service';

@Controller('template-lessons')
export class TemplateLessonController {
  constructor(private readonly templateLessonService: TemplateLessonService) {}

  @Get('by-day/:templateDayId')
  async getByDayId(@Param('templateDayId', ParseIntPipe) templateDayId: number) {
    return this.templateLessonService.getLessonsByTemplateDay(templateDayId);
  }

  @Post()
  async create(
    @Body() data: {
      templateDayId: number;
      name: string;
      serialNumber: number;
      homework?: string;
    },
  ) {
    return this.templateLessonService.createTemplateLesson(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: {
      name?: string;
      serialNumber?: number;
      homework?: string;
    },
  ) {
    return this.templateLessonService.updateTemplateLesson(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.templateLessonService.deleteTemplateLesson(id);
  }
} 