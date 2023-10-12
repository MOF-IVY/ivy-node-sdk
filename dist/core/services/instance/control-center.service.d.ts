import { Observable } from 'rxjs';
import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { BaseWebsocketService } from '../base/ws.service';
import { IOperationStats } from '../../../models/trader/operation.model';
export interface IActiveStatsUpdate {
    sym: string;
    xm: ExchangesMarkets;
    stats: IOperationStats;
}
export declare class InstanceControlCenterService<ScriptConfigType = Record<string, any>> extends BaseWebsocketService {
    private readonly httpClient;
    private readonly pauseCommands$;
    private readonly resumeCommands$;
    private readonly restartCommands$;
    constructor(restAddress: string, wsAddress: string);
    subscribePauseCommands(): Observable<void>;
    subscribeResumeCommands(): Observable<void>;
    subscribeRestartCommands(): Observable<void>;
    getScriptConfig(): Promise<ScriptConfigType>;
    private restartCmdEventHandler;
    private pauseCmdEventHandler;
    private resumeCmdEventHandler;
}
