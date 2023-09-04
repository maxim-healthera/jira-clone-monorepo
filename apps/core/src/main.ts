import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MongoClientExceptionFilter } from './app/filters/mongo-client-exception.filter';
import { DateUtilsService } from '@jira/utils';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  console.log(process.cwd())
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const dateUtilsService = app.get<DateUtilsService>(DateUtilsService);
  app.useGlobalFilters(new MongoClientExceptionFilter(dateUtilsService));
  await app.listen(port);
  Logger.log('core api started')
}

bootstrap();
