import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
export interface IStandardWsError {
    error: string;
}
export declare abstract class BaseWebsocketService {
    protected readonly socket: Socket;
    private readonly ready$;
    private emissionsQueue;
    constructor(address: string);
    subscribeReady(): Observable<boolean>;
    protected safeEmit(eventName: string, payload?: object | number | string): void;
}
