import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Предполагается, что используется PrismaService

@Injectable()
export class TemplateService {
    constructor(private prisma: PrismaService) { }

    async getTemplateDaysByClassId(sclassId: number) {
        return this.prisma.templateDay.findMany({
            where: { sclassId },
            include: {
                lessons: {
                    orderBy: { serialNumber: 'asc' }
                }
            },
            orderBy: { dayOfWeek: 'asc' }
        });
    }

    async getTemplateDayById(id: number) {
        return this.prisma.templateDay.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { serialNumber: 'asc' }
                }
            }
        });
    }

    async createTemplateDay(
        data: {
            dayOfWeek: number;
            sclassId: number;
            lessons: { name: string, serialNumber: number, homework: string }[];
        }) {
        return this.prisma.templateDay.create({
            data: {
                dayOfWeek: data.dayOfWeek,
                sclassId: data.sclassId,
                lessons: {
                    create: data.lessons.map(lesson => ({ name: lesson.name, serialNumber: lesson.serialNumber, homework: lesson.homework })),
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