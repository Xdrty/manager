import { Module } from '@nestjs/common';
import { SchoolDayService } from './school-day.service';
import { SchoolDayController } from './school-day.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SchoolDayController],
  providers: [SchoolDayService, PrismaService],
  exports: [SchoolDayService]
})
export class SchoolDayModule {}
