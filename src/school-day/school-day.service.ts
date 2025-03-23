import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchoolDayService {
    constructor(private prisma: PrismaService) { }

    async createSchoolDay(sclassId: number, strDate: string) {
        const date = new Date(strDate)
        // Преобразуем дату в день недели (1-7)
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // В JS 0 — воскресенье, переводим в 7

        // Находим шаблон для этого дня недели и класса
        const templateDay = await this.prisma.templateDay.findUnique({
            where: {
                dayOfWeek_sclassId: { dayOfWeek, sclassId }
            },
            include: {
                lessons: true,
            },
        });

        if (!templateDay) {
            throw new Error(`Шаблон для дня ${dayOfWeek} и класса ${sclassId} не найден`);
        }

        // Создаем новый школьный день
        const schoolDay = await this.prisma.schoolDay.create({
            data: {
                date: date,
                sclassId: sclassId,
            },
        });

        // Создаем уроки на основе шаблона
        for (const templateLesson of templateDay.lessons) {
            await this.prisma.lesson.create({
                data: {
                    name: templateLesson.name,
                    homework: "nothing yet", // Значение по умолчанию
                    schoolDayId: schoolDay.id,
                },
            });
        }

        return schoolDay;
    }

    async createSchoolDaysInRange(sclassId: number, startDateStr: string, endDateStr: string): Promise<void> {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        if (startDate > endDate) {
            throw new BadRequestException("Начальная дата не может быть позже конечной");
        }

        // Явно указываем, что dates — это массив объектов Date
        const dates: Date[] = [];
        let currentDate = new Date(startDate);

        // Генерируем массив дат
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Обрабатываем каждую дату
        for (const date of dates) {
            const dateStr = date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
            const existingSchoolDay = await this.prisma.schoolDay.findUnique({
                where: {
                    sclassId_date: { sclassId, date },
                },
            });

            if (!existingSchoolDay) {
                await this.createSchoolDay(sclassId, dateStr);
                console.log(`Создан школьный день для даты: ${dateStr}`);
            } else {
                console.log(`Школьный день для даты: ${dateStr} уже существует`);
                continue
            }
        }
    }

    async createSchoolDayHand(
        data: {
            date: string;
            sclassId: number;
            lessons: { name: string }[];
        }) {
        const day = await this.prisma.schoolDay.findUnique({
            where: {
                sclassId_date: {
                    sclassId: data.sclassId,
                    date: new Date(data.date)
                }
            }
        })

        if (day) {
            await this.deleteSchoolDay(day.id)
            console.log("старый день удален")
        }

        return await this.prisma.schoolDay.create({
            data: {
                date: new Date(data.date),
                sclassId: data.sclassId,
                lessons: {
                    create: data.lessons.map(lesson => ({ name: lesson.name })),
                },
            },
            include: {
                lessons: true,
            },
        });
    }

    async getSchoolDaysInRange(sclassId: number, startDateStr: string, endDateStr: string) {
        return await this.prisma.schoolDay.findMany({
            where: {
                sclassId,
                date: {
                    gte: new Date(startDateStr),
                    lte: new Date(endDateStr)
                }
            }
        })
    }

    async getAllSchoolDays() {
        const schoolDays = await this.prisma.schoolDay.findMany({
            include: { sclass: true, lessons: true },
        });
        return schoolDays;
    }

    // async getSchoolDayById(id: number) {
    //     const schoolDay = await this.prisma.schoolDay.findUnique({
    //         where: { id },
    //         include: { sclass: true, lessons: true },
    //     });
    //     return schoolDay;
    // }

    // async updateSchoolDay(id: number, date?: string, sclassId?: number) {
    //     const schoolDay = await this.prisma.schoolDay.update({
    //         where: { id },
    //         data: {
    //             sclassId,
    //             date: date ? new Date(date) : undefined,
    //         },
    //     });
    //     return schoolDay;
    // }

    async deleteSchoolDay(id: number) {
        await this.prisma.schoolDay.delete({
            where: { id },
        });
    }
}