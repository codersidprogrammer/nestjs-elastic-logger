import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOG_REQUEST_EVENT } from '../constants/event.constant';

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
@Injectable()
export class ElasticsearchLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly event: EventEmitter2,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const logData = {
      timestamp: new Date().toISOString(),
      path: request.url,
      controllerPath: this.reflector.get<string[]>(
        PATH_METADATA,
        context.getClass(),
      ),
      params: request.params,
      method: request.method,
      statusCode: response.statusCode,
    };

    return next.handle().pipe(
      tap(() =>
        this.event.emit(LOG_REQUEST_EVENT, {
          ...logData,
          durationInMs: Date.now() - now,
        }),
      ),
    );
  }
}
