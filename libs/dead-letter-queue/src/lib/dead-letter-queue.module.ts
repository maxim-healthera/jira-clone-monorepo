import { ClientsModule, Transport } from '@nestjs/microservices';
import { DynamicModule, Module } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';

import { DeadLetterQueueService } from './dead-letter-queue.service';

@Module({
  // controllers: [],
  // providers: [],
  // exports: [],
})
export class DeadLetterQueueModule {
  static register(config: KafkaConfig): DynamicModule {
    return {
      module: DeadLetterQueueModule,
      providers: [
        DeadLetterQueueService,
      ],
      exports: [DeadLetterQueueService],
      imports: [
        ClientsModule.register([
          {
            name: 'dead-letter-queue',
            transport: Transport.KAFKA,
            options: {
              //todo - fix
              client: config as any,
              producerOnlyMode: true,
            },
          },
        ]),
      ],
    };
  }
}
