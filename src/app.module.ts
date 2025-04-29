import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SampleModule } from './sample/sample.module';
import { AuthModule } from './auth/auth.module';
import { SchoolDayModule } from './school-day/school-day.module';
import { LessonModule } from './lesson/lesson.module';
import { SclassModule } from './sclass/sclass.module';
import { UserModule } from './user/user.module';
import { TemplateModule } from './template/template.module';
import { TemplateDayModule } from './template-day/template-day.module';
import { TemplateLessonModule } from './template-lesson/template-lesson.module';
import { JwtMiddleware } from './middleware/jwt-middleware';
import { JwtModule } from '@nestjs/jwt';
import { TestModule } from './test/test.module';
import { SessionMiddleware } from './middleware/session-middleware';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    UserModule, 
    SclassModule, 
    LessonModule, 
    SchoolDayModule, 
    AuthModule, 
    SampleModule, 
    TemplateModule,
    TemplateDayModule,
    TemplateLessonModule,
    TestModule,
    SessionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtMiddleware, SessionMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(JwtMiddleware)
    //   .exclude(
    //     { path: "auth/login", method: RequestMethod.POST },
    //     { path: "sample", method: RequestMethod.POST },
    //     { path: "users", method: RequestMethod.POST },
    //     { path: "sample/clearDB", method: RequestMethod.DELETE },
    //     { path: "users", method: RequestMethod.GET },
    //     { path: "test", method: RequestMethod.GET }
    //   )
    //   .forRoutes("*")
    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        { path: "sample", method: RequestMethod.POST },
        { path: "users", method: RequestMethod.POST },
        { path: "sample/clearDB", method: RequestMethod.DELETE },
        { path: "users", method: RequestMethod.GET },
        { path: "test", method: RequestMethod.GET }
      )
      .forRoutes("*")
  }
}
