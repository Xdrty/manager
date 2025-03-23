import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly sessionService: SessionService
    ) { }

    async login(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
                password
            },
            select: {
                id: true,
                username: true,
                sclassId: true
            }
        })
        if (!user) throw new NotFoundException("user doesnt exist")

        return {
            sessionId: await this.sessionService.createSession(user.id),
            user: user
        } //return encrypted sessionId and user data
    }

    async logout(encryptedSessionId: string) {
        const decryptedSessionId = this.sessionService.decryptSessionId(encryptedSessionId)
        return await this.sessionService.deleteSession(decryptedSessionId)
    }
}
