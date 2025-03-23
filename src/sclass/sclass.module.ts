import { Module } from '@nestjs/common';
import { SclassService } from './sclass.service';
import { SclassController } from './sclass.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SclassController],
  providers: [SclassService, PrismaService],
})
export class SclassModule { }
