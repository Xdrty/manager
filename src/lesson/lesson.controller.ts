import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @Post()
  async createLesson(
    @Body('name') name: string,
    @Body('homework') homework: string,
    @Body('schoolDayId') schoolDayId: number,
  ) {
    return this.lessonService.createLesson(name, homework, schoolDayId);
  }

  // @Get()
  // async getAllLessons() {
  //   return this.lessonService.getAllLessons();
  // }

  @Get(':id')
  async getLessonById(@Param('id') id: string) {
    return this.lessonService.getLessonById(parseInt(id));
  }

  @Patch(':id')
  async updateLesson(
    @Param('id') id: string,
    @Body() body: { name?: string; homework?: string; schoolDayId?: number },
  ) {
    return this.lessonService.updateLesson(parseInt(id), body.name, body.homework, body.schoolDayId);
  }

  @Delete(':id')
  async deleteLesson(@Param('id') id: string) {
    await this.lessonService.deleteLesson(parseInt(id));
    return { message: 'Урок удален' };
  }
}