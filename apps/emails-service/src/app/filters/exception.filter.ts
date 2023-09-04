import { Catch, ArgumentsHost, Logger, BadRequestException } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { of } from 'rxjs';
import { DeadLetterQueueService } from '@jira/dead-letter-queue';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  //todo - rename
  constructor(private readonly dlqService: DeadLetterQueueService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const { message, topicName } = this._parseHost(host);
    if (exception instanceof BadRequestException) {
      this._logBadRequestException(exception, topicName, message)
      this.dlqService.send(this._buildDlqName(topicName), message);
      return of(null);
    }

    Logger.error(`
      ${topicName}: ${exception}. 
      message - ${JSON.stringify(message)}
  `);
    return of(null);
  }

  private _parseHost<T>(host: ArgumentsHost): {
    message: T;
    topicName: string;
  } {
    const [message, kafkaMetadata] = host.getArgs();
    const kafkaMetadataArgs = kafkaMetadata.getArgs();
    return { message: message as T, topicName: kafkaMetadataArgs[2] };
  }

  private _buildDlqName(topicName: string) {
    return `${topicName}-dlq`;
  }

  //todo - error The group is rebalancing, so a rejoin is needed
  private _logBadRequestException<T>(exception: BadRequestException, topicName: string, queueMessage: T) {
    const exceptionResponse = exception.getResponse() as { message: string[] };
    Logger.error(`
      ${topicName}: BadRequestException - ${exceptionResponse.message.join(', ')}. 
      message - ${JSON.stringify(queueMessage)}
    `)
  }
}