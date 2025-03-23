import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post()
  async createSession(@Body('userId') userId: number) {
    const encryptedSessionId = await this.sessionService.createSession(userId);
    return { sessionId: encryptedSessionId };
  }

  @Delete(':sessionId')
  async deleteSession(@Param('sessionId') encryptedSessionId: string) {
    const decryptedSessionId = this.sessionService.decryptSessionId(encryptedSessionId);
    await this.sessionService.deleteSession(decryptedSessionId);
    return { message: 'Сессия успешно удалена' };
  }

  @Delete('user/:userId')
  async deleteAllSessions(@Param('userId') userId: string) {
    await this.sessionService.deleteAllSessions(parseInt(userId));
    return { message: 'Все сессии пользователя удалены' };
  }
}