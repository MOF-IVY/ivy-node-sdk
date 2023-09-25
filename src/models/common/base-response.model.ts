import { HttpStatusCode } from 'axios';

export interface IBaseResponse<T> {
  data?: T;
  message?: string;
  statusCode: number;
}

export class BaseResponse<T> implements IBaseResponse<T> {
  data?: T;
  message?: string;
  statusCode: number;

  constructor(data?: T, message?: string, statusCode = HttpStatusCode.Ok) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  toJson(): IBaseResponse<T> {
    return {
      data: this.data,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
