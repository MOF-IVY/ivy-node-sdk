import { ExchangeOperationType } from '../common/exchange-operation-type';
import { ExchangesMarkets } from '../common/exchanges-markets.type';
export interface ITraderOpenOrderOpts {
    symbol: string;
    orderType: 'Limit' | 'Market';
    operationType: ExchangeOperationType;
    /**
     * From exchange market, in case of bybit,
     * the category will be deduced from the
     * implicit exchange market name
     */
    exchangeMarket: ExchangesMarkets;
    /**
     * Required in case of spot buy orders
     */
    minBuyBudget?: number;
    /**
     * Required in case of linear orders
     */
    leverage?: number;
    /**
     * Required if exchange market is bybit_linear
     * ((balance * leverage) * leverageEntryPercent) / 100
     */
    leverageEntryPercent?: number;
    isMockOrder?: boolean;
}
