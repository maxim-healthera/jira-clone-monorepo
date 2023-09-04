import { CryptoUtilsService } from '@jira/utils';
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CommonUserVerificationDto } from './dto/common-user-verification.dto';
import { VerificationEmailsRepository } from '@jira/database-repositories';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserVerificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly verificationEmailsRepository: VerificationEmailsRepository,
    private readonly cryptoService: CryptoUtilsService,
    private readonly configService: ConfigService

  ) {
    console.log(process.cwd());
  }

  async commonUserVerificationService({
    user_id: userId,
    token,
  }: CommonUserVerificationDto) {
    Logger.log('message verify_email_user started for user: ', userId)
    const verificationEmailDocument = await this.verificationEmailsRepository.findOneByQuery({ token });
    if (!verificationEmailDocument) {
      throw new RpcException('not able to complete the user verification');
    }

    const jwtPayload = await this.cryptoService.verifyAndExtractJwtPayload<{
      _id: string;
      email: string;
    }>(token, { secret: this.configService.get('JWT_VERIFY_USER_SECRET') });

    if (jwtPayload._id !== userId) {
      throw new RpcException('not able to complete the user verification');
    }

    const confirmationUrl = `${this.configService.get('CORE_API_URL')}/auth/common-verify?token=${token}`
    await this.emailService.sendEmail({
      to: jwtPayload.email,
      subject: 'Email Verification',
      template: path.resolve(
        __dirname,
        'templates',
        'common-user-verification.hbs'
      ),
      context: {
        firstName: verificationEmailDocument.first_name,
        lastName: verificationEmailDocument.last_name,
        confirmationUrl,
      },
    });

    
    // secret: this.configService.get('JWT_VERIFY_USER_SECRET')
  }
}
