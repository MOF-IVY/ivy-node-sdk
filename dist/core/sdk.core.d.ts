import { ExchangesMarkets } from '../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../models/common/exchange-operation-type';
import { ITraderOpenOrderOpts } from '../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../models/trader/close-order-config.model';
import { IHistoryLoadRequestOpts } from '../models/history-loader/history-load-request.model';
export interface ISDKConfigOpts {
    apiKey?: string;
    instanceUid?: string;
    gatewayWSApiAddress?: string;
    gatewayRESTApiAddress?: string;
    instanceSSMWSApiAddress?: string;
    instanceTraderRestApiAddress?: string;
    instanceLoggingCenterWSApiAddress?: string;
    instanceHistoryLoaderWSApiAddress?: string;
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
    constructor(opts?: ISDKConfigOpts);
    clearLogs(keys: string[]): void;
    log(message: string | object, key: string, persist?: boolean): void;
    loadHistory(opts: IHistoryLoadRequestOpts): Promise<import("../main").IHistoryLoaded>;
    newOperation(opts: ITraderOpenOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<import("../main").ITraderOperation<unknown>>;
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<import("../main").ITraderOperation<unknown>>;
    /**
     * Always catch
     */
    enableIKStream(): void;
    subscribeIKStream(): import("rxjs").Observable<import("../main").IFKEvent>;
    /**
     * Always catch
     */
    enableFKStream(): void;
    subscribeFKStream(): import("rxjs").Observable<import("../main").IFKEvent>;
    /**
     * Always catch
     */
    enablePumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): void;
    subscribePumpStream(): import("rxjs").Observable<import("../main").IPumpDumpEvent>;
    /**
     * Always catch
     */
    enableDumpStream(payload: {
        xm: ExchangesMarkets;
        tfs: string[];
    }): void;
    subscribeDumpStream(): import("rxjs").Observable<import("../main").IPumpDumpEvent>;
    private ensureRequiredParametersOrThrow;
}
