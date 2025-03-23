import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { SchoolDayService } from './school-day.service';

@Controller('school-days')
export class SchoolDayController {
  constructor(private readonly schoolDayService: SchoolDayService) { }

  @Post()
  async createSchoolDay(
    @Body('sclassId') sclassId: number,
    @Body('date') date: string,
  ) {
    return this.schoolDayService.createSchoolDay(sclassId, date);
  }

  @Post('range')
  async createSchoolDaysInRange(
    @Body('sclassId') sclassId: number,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    await this.schoolDayService.createSchoolDaysInRange(sclassId, startDate, endDate);
    return { message: 'Школьные дни в диапазоне созданы' };
  }

  @Post("hand")
  async create(
    @Body() data: {
      date: string;
      sclassId: number;
      lessons: { name: string, serialNumber: number }[];
    }) {
    return this.schoolDayService.createSchoolDayHand(data);
  }

  @Get()
  async getAllSchoolDays() {
    return this.schoolDayService.getAllSchoolDays();
  }

  @Get('range')
  async getSchoolDaysInRange(
    @Query('sclassId') sclassId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.schoolDayService.getSchoolDaysInRange(
      parseInt(sclassId),
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async getSchoolDayById(@Param('id') id: string) {
    return this.schoolDayService.getSchoolDayById(parseInt(id));
  }

  // @Patch(':id')
  // async updateSchoolDay(
  //   @Param('id') id: string,
  //   @Body() body: { date?: string, sclassId?: number },
  // ) {
  //   return this.schoolDayService.updateSchoolDay(parseInt(id), body.date, body.sclassId);
  // }

  @Delete(':id')
  async deleteSchoolDay(@Param('id') id: string) {
    await this.schoolDayService.deleteSchoolDay(parseInt(id));
    return { message: 'Школьный день удален' };
  }
}