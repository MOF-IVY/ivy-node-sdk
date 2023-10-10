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
    private readonly openedOpsUpdates$;
    private readonly closedOpsUpdates$;
    private readonly liquidatedOpsUpdates$;
    private readonly rejectedOrdersUpdates$;
    private readonly activeStatsUpdates$;
    constructor(restAddress: string, wsAddress: string, apiKey: string);
    enableActiveStatsUpdates(): Promise<void | IStandardWsError>;
    subscribeActiveStatsUpdates(): Observable<IActiveStatsUpdate>;
    subscribeOpenedOperationsUpdates(): Observable<ITraderOperation>;
    subscribeClosedOperationsUpdates(): Observable<ITraderOperation>;
    subscribeLiquidatedOperationsUpdates(): Observable<ITraderOperation>;
    subscribeRejectedOrdersUpdates(): Observable<ITraderOperation>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<ITraderOperation>;
    createNewOperation(opts: ITraderOpenOrderOpts): Promise<string | null>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<string | null>;
    /**
     * DO NOT USE:
     *
     * Orders cancelling still needs workings on trader.
     * Right now there's nothing preventing a double order cancel
     */
    cancelOpenOrder(operationId: string): Promise<boolean>;
    /**
     * DO NOT USE:
     *
     * Orders cancelling still needs workings on trader.
     * Right now there's nothing preventing a double order cancel
     */
    cancelCloseOrder(operationId: string): Promise<boolean>;
    private liquidatedOpEventHandler;
    private rejectedOrdersEventHandler;
    private openedOpEventHandler;
    private closedOpEventHandler;
    private activeStatsEventHandler;
}
