import { Socket } from 'socket.io-client';
interface IAddressSocket {
    alias: string;
    socket: Socket;
    ready: boolean;
    eventsQueue: {
        event: string;
        payload: any;
    }[];
}
interface ISubscribeEventOpts<ResponseType = unknown> {
    socketAlias: string;
    eventName: string;
    successEventName?: string;
    payload?: object | string | number | boolean;
    successCallback?: (data: ResponseType) => void;
    errorEventName?: string;
    errorCallback?: (error: any) => void;
}
export declare abstract class BaseWebsocketService {
    private readonly sockets;
    constructor(addresses: {
        alias: string;
        address: string;
    }[]);
    protected getSocket(alias: string): IAddressSocket | undefined;
    protected subscribeEvent<ResponseType>(opts: ISubscribeEventOpts<ResponseType>): void;
    protected subscribeEventOnce<ResponseType>(opts: ISubscribeEventOpts<ResponseType>): void;
    protected emit(socketAlias: string, eventName: string, payload?: object | string | boolean | number): void;
    protected emitCatchingError(socketAlias: string, eventName: string, errorEventName: string, errorCallback: (error: any) => void, payload?: object | string | boolean | number): void;
    protected unsubscribeEvent(socketAlias: string, eventName: string, eventCallback: (...args: any[]) => void): void;
    private getSocketItemOrThrow;
}
export {};
