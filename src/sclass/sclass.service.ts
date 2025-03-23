import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SclassService {
  constructor(private prisma: PrismaService) { }

  async createSclass(name: string) {
    const sclass = await this.prisma.sclass.create({
      data: { name },
    });
    return sclass;
  }

  async getAllSclasses() {
    const sclasses = await this.prisma.sclass.findMany({
      include: { users: true, schoolDays: true },
    });
    return sclasses;
  }

  async getSclassById(id: number) {
    const sclass = await this.prisma.sclass.findUnique({
      where: { id },
      include: { users: true, schoolDays: true },
    });
    return sclass;
  }

  async updateSclass(id: number, name: string) {
    const sclass = await this.prisma.sclass.update({
      where: { id },
      data: { name },
    });
    return sclass;
  }

  async deleteSclass(id: number) {
    await this.prisma.sclass.delete({
      where: { id },
    });
  }
}