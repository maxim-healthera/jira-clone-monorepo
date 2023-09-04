import { DeadLetterQueueModule } from '@jira/dead-letter-queue';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserVerificationModule } from './user-verification/user-verification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserVerificationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    DeadLetterQueueModule.register({
      brokers: [process.env.KAFKA_BROKER_URL],
      clientId: 'test',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV !== 'local',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
