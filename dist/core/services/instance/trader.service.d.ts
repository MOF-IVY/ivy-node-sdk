import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../../../models/common/exchange-operation-type';
import { ITraderOperation } from '../../../models/trader/operation.model';
import { ITraderOpenOrderOpts } from '../../../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../../../models/trader/close-order-config.model';
export declare class InstanceTraderService {
    private readonly httpClient;
    constructor(address: string, apiKey: string);
    hasOperationOpen(xm: ExchangesMarkets, symbol: string, type: ExchangeOperationType): Promise<boolean>;
    getClosedOperation(operationId: string): Promise<ITraderOperation>;
    createNewOperation(opts: ITraderOpenOrderOpts): Promise<ITraderOperation>;
    closeOperation(opts: ITraderCloseOrderOpts): Promise<ITraderOperation>;
    cancelOpenOrder(operationId: string): Promise<boolean>;
    cancelCloseOrder(operationId: string): Promise<boolean>;
}
