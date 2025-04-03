import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TemplateLessonService {
  constructor(private prisma: PrismaService) {}

  async getLessonsByTemplateDay(templateDayId: number) {
    return this.prisma.templateLesson.findMany({
      where: { templateDayId },
      orderBy: { serialNumber: 'asc' },
    });
  }

  async createTemplateLesson(data: {
    templateDayId: number;
    name: string;
    serialNumber: number;
    homework?: string;
  }) {
    return this.prisma.templateLesson.create({
      data: {
        templateDayId: data.templateDayId,
        name: data.name,
        serialNumber: data.serialNumber,
        homework: data.homework || '',
      },
    });
  }

  async updateTemplateLesson(
    id: number,
    data: {
      name?: string;
      serialNumber?: number;
      homework?: string;
    },
  ) {
    return this.prisma.templateLesson.update({
      where: { id },
      data,
    });
  }

  async deleteTemplateLesson(id: number) {
    return this.prisma.templateLesson.delete({
      where: { id },
    });
  }
} 