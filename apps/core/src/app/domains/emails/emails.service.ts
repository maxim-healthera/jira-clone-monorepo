import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { CryptoUtilsService, CommonUtilsService } from '@jira/utils';
import {
  VerificationEmailsRepository,
  UserDocument,
} from '@jira/database-repositories';

@Injectable()
export class EmailsService {
  constructor(
    @Inject(process.env.EMAILS_MICROSERVICE_NAME)
    private readonly emailsClient: ClientKafka,
    private readonly cryptoService: CryptoUtilsService,
    private readonly commonService: CommonUtilsService,
    private readonly configService: ConfigService,
    private readonly verificationEmailsRepository: VerificationEmailsRepository
  ) {}

  //todo - move to users service
  async verifyUser(user: UserDocument): Promise<void> {
    if (user.verified) {
      throw new BadRequestException('User was already verified');
    }

    const verificationToken = this.cryptoService.generateJwtToken(
      this.commonService.getProperties(user, ['_id', 'email']),
      { secret: this.configService.get('JWT_VERIFY_USER_SECRET') }
    );

    await this.createVerificationEmail(user, verificationToken);

    this._sendEmail<{ user_id: string; token: string }>('email_verify_user', {
      user_id: user._id.toString(),
      token: verificationToken,
    });
  }

  //todo - convert to promise, check emits
  private _sendEmail<T>(event: string, payload: T): Observable<unknown> {
    return this.emailsClient.emit(event, payload);
  }

  createVerificationEmail(user: UserDocument, token: string) {
    const { first_name, last_name, _id: userId, email } = user;
    return this.verificationEmailsRepository.create({
      first_name,
      last_name,
      user_id: userId.toString(),
      email,
      token,
    });
  }
}
