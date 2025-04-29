import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        // private jwtService: JwtService,
        private readonly sessionService: SessionService,
        private readonly userService: UserService
    ) { }
    private readonly logger = new Logger();

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            this.logger.log(`!user`)
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.password !== password) {
            this.logger.log(`user.password !== password`)
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...result } = user;
        this.logger.log(`return`)
        return result;
    }

    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Don't return the password
        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any, res: Response) {
        const payload = { sub: user.id, username: user.username };
        const userok = await this.userService.findUserByUsername(payload.username)
        if (!userok) throw new NotFoundException("incorrect input data")
        const sessionId = await this.sessionService.createSession(userok.id)

        res.cookie('sessionId', sessionId, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            sclassId: user.sclassId,
        };
    }

    async logout(res: Response) {
        res.clearCookie('sessionId', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        console.log('Logout successful, cookie cleared');

        return { message: 'Logged out successfully' };
    }
}
