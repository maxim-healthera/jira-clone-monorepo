import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilsModule } from '@jira/utils';
import { DatabaseRepositoriesModule } from '@jira/database-repositories';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';

@Module({
  imports: [
    UtilsModule,
    DatabaseRepositoriesModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
