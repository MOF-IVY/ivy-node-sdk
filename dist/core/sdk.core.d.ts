import { ExchangesMarkets } from '../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../models/common/exchange-operation-type';
import { ITraderOpenOrderOpts } from '../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../models/trader/close-order-config.model';
import { IHistoryLoadRequestOpts } from '../models/history-loader/history-load-request.model';
import { Observable } from 'rxjs';
export interface ISDKConfigOpts {
    apiKey?: string;
    instanceUid?: string;
    gatewayWsApiAddress?: string;
    gatewayRestApiAddress?: string;
    instanceSSMWsApiAddress?: string;
    instanceTraderRestApiAddress?: string;
    instanceLoggingCenterWsApiAddress?: string;
    instanceHistoryLoaderWsApiAddress?: string;
}
export declare class IvySDK {
    private readonly apiKey;
    private readonly instanceUid;
    private readonly gatewayWSApiAddress;
    private readonly gatewayRESTApiAddress;
    private readonly instanceSSMWSApiAddress;
    private readonly instanceTraderRestApiAddress;
    private readonly instanceLoggingCenterWSApiAddress;
    private readonly instanceHistoryLoaderWSApiAddress;
    private readonly SSM;
    private readonly trader;
    private readonly pumpdump;
    private readonly loggingCenter;
    private readonly historyLoader;
    private readonly ready$;
    constructor(opts?: ISDKConfigOpts);
    subscribeReady(): Observable<boolean>;
    clearLogs(keys: string[]): void;
    log(message: string | object, key: string, persist?: boolean): Promise<boolean | import("./services/base/ws.service").IStandardWsError>;
    loadHistory(opts: IHistoryLoadRequestOpts): Promise<import("../main").IHistoryLoaded>;
    newOperation(opts: ITraderOpenOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<import("../main").ITraderOperation<unknown>>;
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
