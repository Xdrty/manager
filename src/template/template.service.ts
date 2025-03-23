import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Предполагается, что используется PrismaService

@Injectable()
export class TemplateService {
    constructor(private prisma: PrismaService) { }

    async createTemplateDay(
        data: {
            dayOfWeek: number;
            sclassId: number;
            lessons: { name: string }[];
        }) {
        return this.prisma.templateDay.create({
            data: {
                dayOfWeek: data.dayOfWeek,
                sclassId: data.sclassId,
                lessons: {
                    create: data.lessons.map(lesson => ({ name: lesson.name })),
                },
            },
            include: {
                lessons: true, // Возвращаем созданные уроки вместе с шаблоном
            },
        });
    }

    async deleteTemplateDay(id: number) {
        return this.prisma.templateDay.delete({
            where: { id },
        });
    }
}