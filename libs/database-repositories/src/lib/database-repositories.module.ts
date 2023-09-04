import { Module } from '@nestjs/common';
import { VerificationEmailsRepository, UsersRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationEmail, VerificationEmailSchema } from './schemas/verification-emails';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  controllers: [],
  providers: [UsersRepository, VerificationEmailsRepository],
  exports: [UsersRepository, VerificationEmailsRepository],
  imports: [
    MongooseModule.forFeature([
      { name: VerificationEmail.name, schema: VerificationEmailSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class DatabaseRepositoriesModule {}
