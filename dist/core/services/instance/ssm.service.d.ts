import { Observable } from 'rxjs';
import { BaseWebsocketService } from '../base/ws.service';
import { IFKEvent } from '../../../models/ssm/fk-event.model';
export declare class InstanceSSMService extends BaseWebsocketService {
    private readonly IKStream$;
    private readonly FKStream$;
    constructor(address: string);
    enableIKStream(): void;
    enableFKStream(): void;
    subscribeIKStream(): Observable<IFKEvent>;
    subscribeFKStream(): Observable<IFKEvent>;
    private IKStreamEventHandler;
    private FKStreamEventHandler;
}
