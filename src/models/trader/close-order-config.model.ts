import { ExchangeOperationType } from '../common/exchange-operation-type';
import { ExchangesMarkets } from '../common/exchanges-markets.type';

export interface ITraderCloseOrderOpts {
  symbol: string;

  orderType: 'Limit' | 'Market';

  exchangeMarket: ExchangesMarkets;

  operationType: ExchangeOperationType;

  /**
   * Optional, and used only if order type is Limit.
   * If given it will place the limit order at that price.
   * If not given it will use the most recent price to place
   * the order.
   */
  limitPrice?: number;
}
