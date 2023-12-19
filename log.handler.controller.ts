import { OnEvent } from '@nestjs/event-emitter';
import { format } from 'date-fns';
import { ErrorLogDto } from '../dtos/error.log.dto';
import { Controller, Inject, Logger } from '@nestjs/common';
import {
  LOG_ERROR_EVENT,
  LOG_OPTIONS,
  LOG_REQUEST_EVENT,
} from './constants/event.constant';
import { LogOptions } from './dtos/options.dto';
import { RequestLogDto } from './dtos/request.log.dto';
import { ElasticService } from './services/elastic.service';

@Controller()
export class LogHandlerController {
  private logger: Logger;

  constructor(
    @Inject(LOG_OPTIONS)
    private readonly options: LogOptions,
    private readonly elasticService: ElasticService,
  ) {
    this.logger = new Logger('' || LogHandlerController.name);
  }

  @OnEvent(LOG_REQUEST_EVENT)
  async handleRequestLog(payload: RequestLogDto) {
    const dateIndex = format(new Date(), 'ddMMyyyy');
    this.logger.debug(
      `Creating request log from event ${this.options.logIndex.default}`,
    );
    await this.elasticService.createLogOnElatic(
      `${this.options.logIndex.default || 'default'}-request-${dateIndex}`,
      payload,
    );
  }

  @OnEvent(LOG_ERROR_EVENT)
  async handleErrorLog(payload: ErrorLogDto) {
    const dateIndex = format(new Date(), 'ddMMyyyy');
    this.logger.debug(
      `Creating error log from event ${this.options.logIndex.error}`,
    );
    await this.elasticService.createLogOnElatic(
      `${this.options.logIndex.error || 'default-error'}-${dateIndex}`,
      payload,
    );
  }
}
