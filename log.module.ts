import { DynamicModule, Global, Module } from '@nestjs/common';
import { LOG_OPTIONS } from './constants/event.constant';
import { LogOptions } from './dtos/options.dto';
import { LogHandlerController } from './log.handler.controller';
import { ElasticService } from './services/elastic.service';
import { ElasticsearchLoggerInterceptor } from './interceptors/elasticlog.interceptor';
import { ElasticlogException } from './exceptions/elasticlog.exception';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
@Global()
@Module({})
export class LogModule {
  static forRoot(options: LogOptions): DynamicModule {
    return {
      module: LogModule,
      controllers: [LogHandlerController],
      providers: [
        ElasticService,
        {
          provide: LOG_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ElasticsearchLoggerInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: ElasticlogException,
        },
      ],
      exports: [ElasticService],
    };
  }
}
