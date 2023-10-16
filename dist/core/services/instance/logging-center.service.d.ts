import { BaseWebsocketService } from '../base/ws.service';
export declare class InstanceLoggingCenterService extends BaseWebsocketService {
    constructor(address: string);
    postLog(message: string | object, key: string, persist: boolean, logToConsole: boolean): void;
}
