import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class DeadLetterQueueService {
  constructor(
    @Inject('dead-letter-queue')
    private readonly kafkaClient: ClientKafka
  ) {}

  send<T>(event: string, payload: T): Observable<unknown> {
    return this.kafkaClient.emit(`${event}`, payload);
  }
}
