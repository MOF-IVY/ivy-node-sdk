import { Observable } from 'rxjs';
import { ExchangesMarkets } from '../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../models/common/exchange-operation-type';
import { ITraderOpenOrderOpts } from '../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../models/trader/close-order-config.model';
import { IHistoryLoadRequestOpts } from '../models/history-loader/history-load-request.model';
export interface ISDKConfigOpts {
    apiKey?: string;
    instanceUid?: string;
    gatewayWsApiAddress?: string;
    gatewayRestApiAddress?: string;
    instanceSSMWsApiAddress?: string | null;
    instanceTraderWsApiAddress?: string | null;
    instanceTraderRestApiAddress?: string | null;
    instanceLoggingCenterWsApiAddress?: string | null;
    instanceHistoryLoaderWsApiAddress?: string | null;
}
export declare class IvySDK {
    private readonly apiKey;
    private readonly gatewayWSApiAddress;
    private readonly gatewayRESTApiAddress;
    private readonly instanceSSMWSApiAddress;
    private readonly instanceTraderWsApiAddress;
    private readonly instanceTraderRestApiAddress;
    private readonly instanceLoggingCenterWSApiAddress;
    private readonly instanceHistoryLoaderWSApiAddress;
    private readonly SSM;
    private readonly trader;
    private readonly pumpdump;
    private readonly loggingCenter;
    private readonly historyLoader;
    constructor(opts?: ISDKConfigOpts);
    subscribeReady(): Observable<boolean>;
    clearLogs(keys: string[]): void;
    log(message: string | object, key: string, persist?: boolean): void;
    loadHistory(opts: IHistoryLoadRequestOpts): Promise<import("../main").IHistoryLoaded>;
    newOperation(opts: ITraderOpenOrderOpts): Promise<string | null>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<string | null>;
    cancelOrder(operationId: string, orderType: 'open' | 'close'): Promise<boolean>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<import("../main").ITraderOperation<unknown>>;
    enableIKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableIKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    enableFKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableFKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    enablePumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disablePumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    enableDumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableDumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    /**
     * Stream active after activation request
     */
    enableActiveStatsUpdate(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribeActiveStatsUpdates(): Observable<import("./services/instance/trader.service").IActiveStatsUpdate>;
    /**
     * Always active stream
     */
    subscribeOpenedOperationsUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Always active stream
     */
    subscribeClosedOperationsUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Always active stream
     */
    subscribeLiquidatedOperationsUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Always active stream
     */
    subscribeRejectedOrdersUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Always active stream
     */
    subscribeCancelledOrdersUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Stream active after activation request
     */
    subscribeIKStream(): Observable<import("../main").IFKEvent>;
    /**
     * Stream active after activation request
     */
    subscribeFKStream(): Observable<import("../main").IFKEvent>;
    /**
     * Stream active after activation request
     */
    subscribePumpStream(): Observable<import("../main").IPumpDumpEvent>;
    /**
     * Stream active after activation request
     */
    subscribeDumpStream(): Observable<import("../main").IPumpDumpEvent>;
    private ensureRequiredParametersOrThrow;
}
