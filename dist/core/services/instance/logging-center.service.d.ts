import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
export declare class InstanceLoggingCenterService extends BaseWebsocketService {
    private readonly instanceUid;
    constructor(address: string, instanceUid: string);
    postLog(message: string | object, key: string, persist: boolean): Promise<boolean | IStandardWsError>;
}
