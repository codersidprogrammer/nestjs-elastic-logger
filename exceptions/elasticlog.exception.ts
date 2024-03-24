import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { ErrorLogDto } from '../dtos/error.log.dto';
import { LOG_ERROR_EVENT } from '../constants/event.constant';
import AppError from 'src/core/errors/app.error';
import { addHours } from 'date-fns';

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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let _message: string = "Exception happen, now i'm in panic";
    let _details: any[] = [];
    const _timestamp = addHours(new Date(), 7);
    const _path = request.url;

    if (exception instanceof BadRequestException) {
      _message = exception.message;
      const _t = exception.getResponse() as {
        message: string[];
        error: string;
        statusCode: number;
      };
      _details = _t.message;
    }

    if (exception instanceof NotFoundException) {
      _message = exception.message;
      const _error = exception.getResponse() as AppError;
      if (exception.getResponse() instanceof AppError) {
        const _errorDetails = _error.serializeErrors();
        if (_errorDetails.suberrors.length !== 0) {
          _errorDetails.suberrors.forEach((e) => {
            if (e instanceof AppError) {
              _details.push(e.message);
            } else {
              _details.push((e as Error).message);
            }
          });
        }
      }
    }

    const logData = {
      message: _message,
      details: _details,
      timestamp: _timestamp,
      path: _path,
    };

    const res = plainToInstance(ErrorLogDto, {
      ...logData,
      statusCode: status,
    });
    this.event.emit(LOG_ERROR_EVENT, res);

    response.status(status).send(logData);
  }
}
