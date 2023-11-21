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
    instanceControlCenterWsApiAddress?: string | null;
    instanceControlCenterRestApiAddress?: string | null;
}
export declare class IvySDK<ScriptConfigType = Record<string, any>> {
    private readonly apiKey;
    private readonly gatewayWsApiAddress;
    private readonly gatewayRestApiAddress;
    private readonly instanceSSMWsApiAddress;
    private readonly instanceTraderWsApiAddress;
    private readonly instanceControlCenterWsApiAddress;
    private readonly instanceControlCenterRestApiAddress;
    private readonly instanceTraderRestApiAddress;
    private readonly instanceLoggingCenterWsApiAddress;
    private readonly instanceHistoryLoaderWsApiAddress;
    private readonly SSM;
    private readonly trader;
    private readonly pumpdump;
    private readonly loggingCenter;
    private readonly historyLoader;
    private readonly controlCenter;
    constructor(opts?: ISDKConfigOpts);
    subscribeReady(): Observable<boolean>;
    clearLogs(keys: string[]): void;
    log(message: string | object, key: string, persist?: boolean, logToConsole?: boolean): void;
    initConfig(config: ScriptConfigType): Promise<ScriptConfigType>;
    getConfig(): Promise<ScriptConfigType>;
    loadHistory(opts: IHistoryLoadRequestOpts): Promise<import("../main").IHistoryLoaded>;
    newOperation(opts: ITraderOpenOrderOpts): Promise<string | null>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<string | null>;
    cancelOrder(operationId: string, orderType: 'open' | 'close'): Promise<boolean>;
    getActiveOperationsSymbols(): Promise<string[]>;
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
    enableActiveStatsUpdate(): Promise<void | import("./services/base/ws.service").IStandardWsError>;
    /**
     * Always active stream
     *
     * Once you've received this event, you should reset your
     * script state.
     *
     * Do not worry about closing operations or cancelling
     * orders, since this has been already done by the trader
     * and once you receive this event, is safe to forcefully
     * reset the state to its initial value
     */
    subscribeRestartCommands(): Observable<void>;
    /**
     * Always active stream
     *
     * Once you've received this event, you must
     * immediately stop opening orders. But you
     * should continue tracking opened ones.
     */
    subscribePauseCommands(): Observable<void>;
    /**
     * Always active stream
     *
     * Once you've received this event, you can
     * go back to opening orders as your script
     * logic would normally do.
     */
    subscribeResumeCommands(): Observable<void>;
    /**
     * Always active stream
     */
    subscribeScriptConfigChanges(): Observable<ScriptConfigType>;
    /**
     * Always active stream
     */
    subscribeOpenedOperationsUpdates(): Observable<import("../main").ITraderOperation<unknown>>;
    /**
     * Always active stream
     */
    subscribeOperationsOpenErrors(): Observable<string>;
    /**
     * Always active stream
     */
    subscribeOperationsCloseErrors(): Observable<string>;
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
    subscribeActiveStatsUpdates(): Observable<import("./services/instance/trader.service").IActiveStatsUpdate>;
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
