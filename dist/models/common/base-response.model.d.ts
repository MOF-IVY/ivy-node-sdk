import { HttpStatusCode } from 'axios';
export interface IBaseResponse<T> {
    data?: T;
    message?: string;
    statusCode: number;
}
export declare class BaseResponse<T> implements IBaseResponse<T> {
    data?: T;
    message?: string;
    statusCode: number;
    constructor(data?: T, message?: string, statusCode?: HttpStatusCode);
    toJson(): IBaseResponse<T>;
}
