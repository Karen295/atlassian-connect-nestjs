import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtlassianConnectService } from './modules/atlassian-connect/atlassian-connect.service';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AtlassianConnectService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
