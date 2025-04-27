import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    private readonly logger = new Logger(JwtMiddleware.name);

    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        this.logger.log(`${req.method} - ${req.path}, IP: ${req.ip}`);
        const token = req.cookies["sessionId"];

        // Check if this is a public route that doesn't need authentication
        if (req.path === '/auth/login' || req.path === '/test') {
            return next();
        }

        if (!token) {
            console.log('No authentication token found in request for path:', req.path);
            throw new UnauthorizedException('Authentication required');
        }

        try {
            const decoded = this.jwtService.verify(token);
            console.log('JWT verified successfully for user ID:', decoded.sub);
            req['userId'] = decoded.sub; // sub contains the user ID from the JWT payload
            next();
        } catch (error) {
            console.error('JWT verification error for path', req.path, ':', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
} 