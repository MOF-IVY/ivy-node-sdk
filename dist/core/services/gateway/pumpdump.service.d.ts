import { Observable } from 'rxjs';
import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
import { IPumpDumpEvent } from '../../../models/pumpdump/pumpdump-event.model';
import { ExchangesMarkets } from '../../../main';
export declare class GatewayPumpDumpService extends BaseWebsocketService {
    private pumpStream$;
    private dumpStream$;
    constructor(address: string);
    enablePumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | IStandardWsError>;
    disablePumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | IStandardWsError>;
    enableDumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | IStandardWsError>;
    disableDumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | IStandardWsError>;
    subscribePumpStream(): Observable<IPumpDumpEvent>;
    subscribeDumpStream(): Observable<IPumpDumpEvent>;
    private pumpStreamEventHandler;
    private dumpStreamEventHandler;
}
