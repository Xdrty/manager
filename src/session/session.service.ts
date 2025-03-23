import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
    constructor(private readonly prisma: PrismaService) { }

    async createSession(userId: number) {
        await this.deleteAllSessions(userId);
        const uuid = crypto.randomUUID();
        const session = await this.prisma.session.create({
            data: {
                id: uuid,
                userId,
                expiresAt: Math.round(Date.now() / 1000) + 60 * 60 * 24 * 30, // месяц
            },
        });
        return this.encryptSessionId(session.id);
    }

    async deleteSession(decryptedSessionId: string) {
        return await this.prisma.session.delete({
            where: { id: decryptedSessionId },
        });
    }

    async deleteAllSessions(userId: number) {
        return await this.prisma.session.deleteMany({
            where: { userId },
        });
    }

    async findSession(decryptedSessionId: string) {
        return await this.prisma.session.findUnique({
            where: { id: decryptedSessionId }
        })
    }

    private getEncryptionKey(): Buffer {
        const secret = process.env.SESSION_SECRET;
        if (!secret) {
            throw new Error('SESSION_SECRET is not defined in environment variables.');
        }
        const key = Buffer.from(secret, 'hex');
        if (key.length !== 32) {
            throw new Error('Invalid SESSION_SECRET length. It must be 32 bytes.');
        }
        return key;
    }

    encryptSessionId(toEncrypt: string): string {
        const iv = crypto.randomBytes(16);
        const key = this.getEncryptionKey();
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(toEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    }

    decryptSessionId(toDecrypt: string): string {
        const parts = toDecrypt.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted value format.');
        }
        const [ivHex, encrypted] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const key = this.getEncryptionKey();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}