import { Observable } from 'rxjs';
import { BaseWebsocketService } from '../base/ws.service';
import { IPumpDumpEvent } from '../../../models/pumpdump/pumpdump-event.model';
import { ExchangesMarkets } from '../../../main';
export declare class GatewayPumpDumpService extends BaseWebsocketService {
    private readonly pumpStream$;
    private readonly dumpStream$;
    constructor(address: string);
    /**
     * Always catch
     */
    enablePumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): void;
    /**
     * Always catch
     */
    enableDumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): void;
    subscribePumpStream(): Observable<IPumpDumpEvent>;
    subscribeDumpStream(): Observable<IPumpDumpEvent>;
    private pumpStreamEventHandler;
    private dumpStreamEventHandler;
}
