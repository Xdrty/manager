import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // For demo purposes, if comparison to raw password is needed
        // In a real app, use proper password hashing
        // Example with raw password comparison:
        if (user.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // For future: When using bcrypt:
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }

        const { password: _, ...result } = user;
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
        const token = this.jwtService.sign(payload);
        
        // Set cookie with the token
        res.cookie('sessionId', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        console.log('Login successful, cookie set with token:', token.substring(0, 20) + '...');
        
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
