import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) { }

    async createLesson(name: string, homework: string, schoolDayId: number) {
        const lesson = await this.prisma.lesson.create({
            data: {
                name,
                homework,
                schoolDayId,
            },
        });
        return lesson;
    }

    async getAllLessons() {
        const lessons = await this.prisma.lesson.findMany({
            include: { schoolDay: true },
        });
        return lessons;
    }

    async getLessonById(id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { schoolDay: true },
        });
        return lesson;
    }

    async updateLesson(id: number, name?: string, homework?: string, schoolDayId?: number) {
        const lesson = await this.prisma.lesson.update({
            where: { id },
            data: {
                name,
                homework,
                schoolDayId
            },
        });
        return lesson;
    }

    async deleteLesson(id: number) {
        await this.prisma.lesson.delete({
            where: { id },
        });
    }
}