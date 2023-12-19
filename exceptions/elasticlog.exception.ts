import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { ErrorLogDto } from '../dtos/error.log.dto';
import { LOG_ERROR_EVENT } from '../constants/event.constant';

/**
 * Class that provide log intercept incoming request.
 * Then it will log the activity and count for response timing.
 * Place this class on `AppModule` on `providers` section.
 *
 * e.g
 *
 * `
 * ...
 * providers: [
 *  {
 *    provide: APP_INTERCEPTOR,
 *    useClass: ElasticsearchLoggerInterceptor,
 *  },
 *  {
 *    provide: APP_FILTER,
 *    useClass: ElasticlogException,
 *   },
 * ]
 *
 */
@Catch(HttpException)
export class ElasticlogException extends BaseExceptionFilter {
  constructor(private readonly event: EventEmitter2) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const logData = {
      timestamp: new Date().toISOString(),
      request: request.url,
      message: exception.message,
      statusCode: exception.status,
    };

    if (exception instanceof BadRequestException) {
      logData.message = (exception.getResponse() as any).message;
    }

    const res = plainToInstance(ErrorLogDto, logData);
    this.event.emit(LOG_ERROR_EVENT, res);

    response.status(exception.status).send(res);
  }
}
