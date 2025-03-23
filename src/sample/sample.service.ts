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
            "1": [
                { "name": "Математика", "serialNumber": 1, "homework": "повторять теорию" },
                { "name": "Русский язык", "serialNumber": 2, "homework": "почитать учебник" },
                { "name": "Литература", "serialNumber": 3 },
                { "name": "Физика", "serialNumber": 4 },
                { "name": "Химия", "serialNumber": 5 }
            ],
            "2": [
                { "name": "История", "serialNumber": 1, "homework": "пересказать параграф" },
                { "name": "Биология", "serialNumber": 2, "homework": "изучить материал" },
                { "name": "География", "serialNumber": 3 },
                { "name": "Английский язык", "serialNumber": 4 },
                { "name": "Обществознание", "serialNumber": 5 }
            ],
            "3": [
                { "name": "Физкультура", "serialNumber": 1, "homework": "выполнить упражнения" },
                { "name": "Информатика", "serialNumber": 2, "homework": "повторить теорию" },
                { "name": "Технология", "serialNumber": 3 },
                { "name": "Музыка", "serialNumber": 4 }
            ],
            "4": [
                { "name": "Математика", "serialNumber": 1, "homework": "решать задачи" },
                { "name": "Русский язык", "serialNumber": 2, "homework": "повторить правила" },
                { "name": "Литература", "serialNumber": 3 },
                { "name": "История", "serialNumber": 4 },
                { "name": "Физика", "serialNumber": 5 },
                { "name": "Химия", "serialNumber": 6 }
            ],
            "5": [
                { "name": "Биология", "serialNumber": 1, "homework": "почитать учебник" },
                { "name": "Химия", "serialNumber": 2, "homework": "изучить формулы" },
                { "name": "Физика", "serialNumber": 3 },
                { "name": "Английский язык", "serialNumber": 4 },
                { "name": "Немецкий язык", "serialNumber": 5 },
                { "name": "Математика", "serialNumber": 6 }
            ],
            "6": [
                { "name": "Физкультура", "serialNumber": 1, "homework": "выполнить разминку" },
                { "name": "Труд", "serialNumber": 2, "homework": "подготовить материалы" },
                { "name": "Проектная деятельность", "serialNumber": 3 },
                { "name": "Искусство", "serialNumber": 4 }
            ],
            "7": []
        }

        for (const dayOfWeek of daysOfWeek) {
            const lessons = lessonsByDay[dayOfWeek].map((obj) => ({ name: obj.name, serialNumber: obj.serialNumber, homework: obj.homework ? obj.homework : "nothing" }));
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

    async clearDB() {
        await this.prisma.sclass.deleteMany()
        await this.prisma.user.deleteMany()
    }
}