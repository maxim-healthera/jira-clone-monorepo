import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { CommonUtilsService } from './services/common.service';
import { CryptoUtilsService } from './services/crypto.service';
import { DateUtilsService } from './services/date.service';

@Global()
@Module({
  providers: [CommonUtilsService, CryptoUtilsService, DateUtilsService],
  exports: [CommonUtilsService, CryptoUtilsService, DateUtilsService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class UtilsModule {}
