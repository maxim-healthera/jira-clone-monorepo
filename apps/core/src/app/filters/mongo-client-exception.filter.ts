import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import { DateUtilsService } from '@jira/utils';

@Catch(MongooseError)
export class MongoClientExceptionFilter implements ExceptionFilter {
  private readonly statusCode: number = 401;

  constructor(private readonly dateUtilsService: DateUtilsService) {}
  catch(exception: MongooseError, host: ArgumentsHost) {
    Logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorReponsePayload = this.buildErrorResponse(exception);
    response.status(this.statusCode).json(errorReponsePayload);
  }

  buildErrorResponse(error: MongooseError): {
    message: string;
    timestamp: string;
  } {
    const timestamp = this.dateUtilsService.now<string>();
    if (error instanceof Error.ValidationError) {
      const errorMessage = `Validation failed on the following fields: ${Object.keys(error.errors).join(', ')}`
      return {
        timestamp,
        message: errorMessage,
      };
    }

    if (error instanceof Error.CastError) {
      const errorMessage = 'Invalid id was provided'
      return {
        timestamp,
        message: errorMessage,
      };
    }

    return {
      timestamp,
      message: 'Not able to perform this action',
    };
  }
}
