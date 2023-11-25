import { ExchangeOperationType } from '../common/exchange-operation-type';
import { ExchangesMarkets } from '../common/exchanges-markets.type';

export interface ITraderOpenOrderOpts {
  symbol: string;
  orderType: 'Limit' | 'Market';
  operationType: ExchangeOperationType;

  /**
   * Required if order type is Limit
   */
  price?: number;

  /**
   * From exchange market, in case of bybit,
   * the category will be deduced from the
   * implicit exchange market name
   */
  exchangeMarket: ExchangesMarkets;

  /**
   * The minimum buy budget to allocate for the operation.
   * In order to prevent dust, we will tweak this amount
   * until we get a qty that we're sure it will be sold without
   * leaving any dust behind. This tweak is always negligible, and
   * won't have any noticeable change on what you plan to use for
   * the entry.
   *
   * That's why you might see a different entry budget on the
   * final operation.
   */
  minBuyBudget: number;

  /**
   * Required in case of linear orders
   */
  leverage?: number;

  isMockOrder?: boolean;
}
