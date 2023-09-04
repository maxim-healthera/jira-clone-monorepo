import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER_URL],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID,
        },
      },
    }
  );
  await app.listen();
  Logger.log('emails-service started')
}

bootstrap();
