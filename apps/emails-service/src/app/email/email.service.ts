import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendEmail<TContext>({
    to,
    subject,
    template,
    context,
  }: {
    to: string;
    subject: string;
    template: string;
    context: TContext;
  }) {
    const toEmail =
      this.configService.get('NODE_ENV') !== 'production'
        ? this.configService.get('TEST_EMAIL_ADDRESS')
        : to;
    throw new Error('maximka')

    const results = await this.mailerService.sendMail({
      to: toEmail,
      subject,
      template,
      context,
    });
    //todo - from SES perspective, check if email was received
    console.log(results);
  }
  //todo - debug + source files
  //todo - error handling + dlq
}
