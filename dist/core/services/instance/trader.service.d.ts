import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../../../models/common/exchange-operation-type';
import { IOperationStats, ITraderOperation } from '../../../models/trader/operation.model';
import { ITraderOpenOrderOpts } from '../../../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../../../models/trader/close-order-config.model';
import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
import { Observable } from 'rxjs';
export interface IActiveStatsUpdate {
    sym: string;
    xm: ExchangesMarkets;
    stats: IOperationStats;
}
export declare class InstanceTraderService extends BaseWebsocketService {
    private readonly httpClient;
    private readonly closedOpsUpdates$;
    private readonly activeStatsUpdates$;
    constructor(restAddress: string, wsAddress: string, apiKey: string);
    enableActiveStatsUpdates(): Promise<void | IStandardWsError>;
    enableClosedOperationsUpdates(): Promise<void | IStandardWsError>;
    subscribeActiveStatsUpdates(): Observable<IActiveStatsUpdate>;
    subscribeClosedOperationsUpdates(): Observable<ITraderOperation>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<ITraderOperation>;
    createNewOperation(opts: ITraderOpenOrderOpts): Promise<ITraderOperation>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<ITraderOperation>;
    cancelOpenOrder(operationId: string): Promise<boolean>;
    cancelCloseOrder(operationId: string): Promise<boolean>;
    private closedOpEventHandler;
    private activeStatsEventHandler;
}
