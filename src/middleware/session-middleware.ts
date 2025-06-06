import { Injectable, NestMiddleware, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(private readonly sessionService: SessionService) { }
    private readonly logger = new Logger();

    async use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            this.logger.log(
                `${req.method} ${req.originalUrl} ${res.statusCode} — IP: ${req.ip}`
            );
        });
        this.logger.log(`any request in middleware`)

        const sessionId = req.cookies["sessionId"]
        if (!sessionId) throw new UnauthorizedException
        try {
            const decryptedSessionId = this.sessionService.decryptSessionId(sessionId)
            if (!decryptedSessionId) throw new BadRequestException
            const session = await this.sessionService.findSession(decryptedSessionId)
            if (!session) throw new UnauthorizedException
            const currentTimestamp = Math.round(Date.now() / 1000)
            if (session.expiresAt < currentTimestamp) throw new UnauthorizedException
            req['userId'] = session.userId
        } catch (e) {
            throw new UnauthorizedException(e)
        }
        next()
    }
}