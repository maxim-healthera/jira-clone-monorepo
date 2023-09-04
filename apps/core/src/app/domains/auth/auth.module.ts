import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '@jira/utils';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailsModule } from '../emails/emails.module';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { UserVerificationService } from './services/user-verification.service';
import { DatabaseRepositoriesModule } from '@jira/database-repositories';


@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserVerificationService],
  imports: [UserModule, UtilsModule, EmailsModule, DatabaseRepositoriesModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
