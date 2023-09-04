import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';

import { AppService } from './app.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { CommonUserVerificationDto } from './user-verification/dto/common-user-verification.dto';
import { UserVerificationService } from './user-verification/user-verification.service';
import { AllExceptionsFilter } from './filters/exception.filter';
import { DeadLetterQueueService } from '@jira/dead-letter-queue';

@Controller()
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(
    private readonly userVerificationService: UserVerificationService
  ) {}

  //todo - behaviour if validation fails

  // @UseFilters(new AllExceptionsFilter(this.dlqService))
  @EventPattern('email_verify_user')
  commonUserVerification(@Payload(new ValidationPipe({ whitelist: true })) data: CommonUserVerificationDto, @Ctx() context: KafkaContext) {
    console.log({data, context})
    this.userVerificationService.commonUserVerificationService(data);
  }
}
