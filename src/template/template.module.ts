import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, PrismaService],
  exports: [TemplateService],
})
export class TemplateModule {}
