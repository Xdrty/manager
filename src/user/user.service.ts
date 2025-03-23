import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(username: string, password: string, sclassId: number) {
        const user = await this.prisma.user.create({
            data: {
                username,
                password,
                sclassId,
            },
        });
        return user;
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            include: { sclass: true },
        });
        return users;
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { sclass: true },
        });
        return user;
    }

    async updateUser(id: number, username?: string, password?: string, sclassId?: number) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                username,
                password,
                sclassId
            },
        });
        return user;
    }

    async deleteUser(id: number) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}