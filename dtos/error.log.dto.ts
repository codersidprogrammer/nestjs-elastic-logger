export class ErrorLogDto {
  timestamp: string;
  request: string;
  details: any[];
  message: string;
  statusCode: number;
}
