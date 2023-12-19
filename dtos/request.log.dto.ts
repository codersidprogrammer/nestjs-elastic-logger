export class RequestLogDto {
  timestamp: Date;
  controllerPath: string[];
  params: any;
  method: string;
  statusCode: number;
  durationInMs: number;
}
