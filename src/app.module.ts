import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { SampleModule } from './sample/sample.module';
import { AuthModule } from './auth/auth.module';
import { SchoolDayModule } from './school-day/school-day.module';
import { LessonModule } from './lesson/lesson.module';
import { SclassModule } from './sclass/sclass.module';
import { UserModule } from './user/user.module';
import { TemplateModule } from './template/template.module';
import { SessionMiddleware } from './middleware/session-middleware';

@Module({
  imports: [UserModule, SclassModule, LessonModule, SchoolDayModule, AuthModule, SampleModule, SessionModule, TemplateModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        // { path: "user/super", method: RequestMethod.POST },
        { path: "sample", method: RequestMethod.POST },
        { path: "users", method: RequestMethod.POST },
        { path: "sample/clearDB", method: RequestMethod.DELETE },
        { path: "users", method: RequestMethod.GET }
      )
      .forRoutes("*")
  }
}
