import { Controller, Post, Body, Res, HttpCode, HttpStatus, Delete, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Вход пользователя
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const login = await this.authService.login(username, password);

    // Устанавливаем куку с зашифрованным sessionId
    res.cookie('sessionId', login.sessionId, {
      httpOnly: true, // Защита от XSS
      secure: process.env.NODE_ENV === 'production', // Только HTTPS в продакшене
      sameSite: 'strict', // Защита от CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    return login.user;
  }

  // Выход пользователя
  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const encryptedSessionId = req.cookies['sessionId'];
    if (encryptedSessionId) {
      await this.authService.logout(encryptedSessionId);
    } else throw new BadRequestException("required params is missed")
    // Удаляем куку
    res.clearCookie('sessionId');
    return { message: 'Выход выполнен успешно' };
  }
}