import { UtilsModule } from '@jira/utils';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domains/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './domains/auth/auth.module';
import { EmailsModule } from './domains/emails/emails.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('MONGO_URL'))
        return {
          uri: configService.get('MONGO_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV !== 'local',
    }),
    UserModule,
    AuthModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
