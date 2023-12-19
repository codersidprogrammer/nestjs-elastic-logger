export interface LogOptions {
  /**
   * Host of database that saving your log
   * e.g
   *
   * Elasticsearch: `http://localhost:9200/`
   */
  logHost: string;

  /**
   * Name of index of the logs
   *
   */
  logIndex: LogTypeIndex;
}

export type LogTypeIndex = {
  /**
   * this params usually application name.
   */
  default: string;

  /**
   * For information log
   */
  info: string;

  /**
   * For error log
   */
  error: string;

  /**
   * For debug log
   */
  debug: string;
};
