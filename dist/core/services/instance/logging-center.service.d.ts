import { BaseWebsocketService } from '../base/ws.service';
export declare class InstanceLoggingCenterService extends BaseWebsocketService {
    private readonly logsQueue;
    constructor(address: string);
    postLog(message: string | object, key: string, persist: boolean): void;
}
