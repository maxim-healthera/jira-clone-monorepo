import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { UserVerificationService } from './user-verification.service';
import { UtilsModule } from '@jira/utils';
import { DatabaseRepositoriesModule } from '@jira/database-repositories';

@Module({
  imports: [
    EmailModule,
    DatabaseRepositoriesModule,
    UtilsModule,
  ],
  providers: [UserVerificationService],
  exports: [UserVerificationService],
})
export class UserVerificationModule {}
