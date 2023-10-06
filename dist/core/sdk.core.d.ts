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
    newOperation(opts: ITraderOpenOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<import("../main").ITraderOperation<unknown>>;
    enableActiveStatsUpdate(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribeActiveStatsUpdates(): Observable<import("./services/instance/trader.service").IActiveStatsUpdate>;
    enableIKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableIKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribeIKStream(): Observable<import("../main").IFKEvent>;
    enableFKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableFKStream(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribeFKStream(): Observable<import("../main").IFKEvent>;
    enablePumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disablePumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribePumpStream(): Observable<import("../main").IPumpDumpEvent>;
    enableDumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    disableDumpStream(payload: {
        xm: ExchangesMarkets;
    }): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    subscribeDumpStream(): Observable<import("../main").IPumpDumpEvent>;
    private ensureRequiredParametersOrThrow;
}
