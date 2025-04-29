import { Controller, Post, Body, Res, HttpCode, HttpStatus, Delete, Req, BadRequestException, UnauthorizedException, Get, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  private readonly logger = new Logger();

  // User login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // First validate the user
      this.logger.log(`start user`)
      const user = await this.authService.validateUser(username, password);
      this.logger.log(`returned user`)
      
      // Then login with the validated user
      this.logger.log(`start login`)
      return await this.authService.login(user, res);
    } catch (error) {
      throw new UnauthorizedException('Invalid username or password', error);
    }
  }

  // Get current user
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    try {
      // The user ID is set by the JWT middleware
      const userId = req['userId'];
      if (!userId) {
        throw new UnauthorizedException('Authentication required');
      }
      
      return await this.authService.getUserById(userId);
    } catch (error) {
      throw new UnauthorizedException('Authentication required');
    }
  }

  // User logout
  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      return await this.authService.logout(res);
    } catch (error) {
      throw new BadRequestException('Failed to logout');
    }
  }
}