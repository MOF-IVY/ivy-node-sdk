import { Observable } from 'rxjs';
import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
import { IFKEvent } from '../../../models/ssm/fk-event.model';
export declare class InstanceSSMService extends BaseWebsocketService {
    private IKStream$;
    private FKStream$;
    constructor(address: string);
    enableIKStream(): Promise<void | IStandardWsError>;
    disableIKStream(): Promise<void | IStandardWsError>;
    enableFKStream(): Promise<void | IStandardWsError>;
    disableFKStream(): Promise<void | IStandardWsError>;
    subscribeIKStream(): Observable<IFKEvent>;
    subscribeFKStream(): Observable<IFKEvent>;
    private IKStreamEventHandler;
    private FKStreamEventHandler;
}
