import { Module } from '@nestjs/common';
import { TemplateLessonController } from './template-lesson.controller';
import { TemplateLessonService } from './template-lesson.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TemplateLessonController],
  providers: [TemplateLessonService, PrismaService],
  exports: [TemplateLessonService],
})
export class TemplateLessonModule {} 