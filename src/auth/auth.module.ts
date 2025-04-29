import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
    //   signOptions: { expiresIn: '7d' },
    // }),
    SessionModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
