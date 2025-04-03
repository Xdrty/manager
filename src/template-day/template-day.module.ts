import { Module } from '@nestjs/common';
import { TemplateDayController } from './template-day.controller';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [TemplateModule],
  controllers: [TemplateDayController],
})
export class TemplateDayModule {} 