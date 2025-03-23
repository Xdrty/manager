import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SchoolDayService } from '../school-day/school-day.service';

@Injectable()
export class SampleService {
    constructor(
        private prisma: PrismaService,
        private schoolDayService: SchoolDayService,
    ) { }

    async createSampleData() {
        // 1. Создание класса "9i"
        const sclass = await this.createClass();

        // 2. Создание 20 учеников для класса "9i"
        await this.createUsers(sclass.id);

        // 3. Создание шаблонов дней для всех дней недели
        await this.createTemplateDays(sclass.id);

        // 4. Создание школьных дней с 23 февраля по 23 апреля 2025 года
        await this.createSchoolDays(sclass.id);

        console.log('Тестовые данные для класса "9i" успешно созданы!');
    }

    /** Создание класса "9i" */
    private async createClass() {
        const sclass = await this.prisma.sclass.create({
            data: { name: '9i' },
        });
        return sclass;
    }

    /** Создание 20 учеников для класса */
    private async createUsers(sclassId: number) {
        for (let i = 1; i <= 20; i++) {
            await this.prisma.user.create({
                data: {
                    username: `student${i}_9i`,
                    password: 'pass123', // В реальном приложении пароль должен быть захеширован
                    sclassId,
                },
            });
        }
    }

    /** Создание шаблонов дней для всех дней недели */
    private async createTemplateDays(sclassId: number) {
        const daysOfWeek = [1, 2, 3, 4, 5, 6, 7]; // Понедельник - Воскресенье
        const lessonsByDay = {
            1: ['Математика', 'Русский язык', 'Литература', 'Физика', 'Химия'], // 5 уроков
            2: ['История', 'Биология', 'География', 'Английский язык', 'Обществознание'], // 5 уроков
            3: ['Физкультура', 'Информатика', 'Технология', 'Музыка'], // 4 урока
            4: ['Математика', 'Русский язык', 'Литература', 'История', 'Физика', 'Химия'], // 6 уроков
            5: ['Биология', 'Химия', 'Физика', 'Английский язык', 'Немецкий язык', 'Математика'], // 6 уроков
            6: ['Физкультура', 'Труд', 'Проектная деятельность', 'Искусство'], // 4 урока
            7: [], // Воскресенье — 0 уроков
        };

        for (const dayOfWeek of daysOfWeek) {
            const lessons = lessonsByDay[dayOfWeek].map((name) => ({ name }));
            await this.prisma.templateDay.create({
                data: {
                    dayOfWeek,
                    sclassId,
                    lessons: {
                        create: lessons,
                    },
                },
            });
        }
    }

    /** Создание школьных дней с 23 февраля по 23 апреля 2025 года */
    private async createSchoolDays(sclassId: number) {
        const startDate = '2025-02-23';
        const endDate = '2025-04-23';

        await this.schoolDayService.createSchoolDaysInRange(
            sclassId,
            startDate,
            endDate,
        );
    }
}