import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';
import { LOG_OPTIONS } from '../constants/event.constant';
import { LogOptions } from '../dtos/options.dto';

@Injectable()
export class ElasticService {
  private readonly client: Client;

  constructor(
    @Inject(LOG_OPTIONS)
    private readonly options: LogOptions,
  ) {
    this.client = new Client({
      node: this.options.logHost,
    });
  }

  async createLogOnElatic(indexName: string, dto: any): Promise<void> {
    await this.create(indexName, dto);
  }

  getInstance(): Client {
    return this.client;
  }

  async create(indexName: string, dto: any): Promise<void> {
    await this.client.index({
      index: indexName,
      document: dto,
    });
  }
}
