import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { PrismaService } from 'src/prisma.service';
import { SchoolDayModule } from 'src/school-day/school-day.module';

@Module({
  imports: [SchoolDayModule],
  controllers: [SampleController],
  providers: [SampleService, PrismaService],
})
export class SampleModule {}
