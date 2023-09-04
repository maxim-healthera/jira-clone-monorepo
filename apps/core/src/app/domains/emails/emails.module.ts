import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { EmailsService } from './emails.service';
import { DatabaseRepositoriesModule } from '@jira/database-repositories';

@Module({
  providers: [EmailsService],
  exports:[EmailsService],
  imports: [
    ClientsModule.register([
      {
        name: process.env.EMAILS_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          producerOnlyMode: true,
        },
      }
    ]),
    DatabaseRepositoriesModule
    // ClientsModule.registerAsync({
    //   clients: [
    //     {
    //       imports: [ConfigModule],
    //       useFactory: (configService: ConfigService) => ({
    //         name: configService.get('EMAILS_MICROSERVICE_NAME'),
    //         transport: Transport.KAFKA,
    //         options: {
    //           client: {
    //             clientId: 'auth',
    //             brokers: [configService.get('KAFKA_BROKER_URL')],
    //           },
    //           producerOnlyMode: true,
    //           consumer: {
    //             groupId: configService.get('KAFKA_GROUP_ID'),
    //           },
    //         },
    //       }),
    //       inject: [ConfigService],
    //       name: '',
    //     },
    //   ],
    // }),
  ],
})
export class EmailsModule {}
