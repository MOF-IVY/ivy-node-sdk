import { ExchangesMarkets } from '../common/exchanges-markets.type';
import { ExchangeOperationType } from '../common/exchange-operation-type';

export interface IOperationStats {
  absoluteProfit: number;
  percentageProfit: number;
}

export interface ITraderOperation<OrderType = unknown> {
  issuerId: string;
  operationId: string;

  symbol: string;
  isMock?: boolean;
  leverage?: number;
  type: ExchangeOperationType;
  exchangeMarket: ExchangesMarkets;

  openOrderId: string;
  closeOrderId: string;

  openTime: number;
  closeTime: number;

  openOrder: OrderType;
  openOrderFilled: boolean;
  openOrderPending: boolean;
  openOrderRejected: boolean;
  openOrderCancelled: boolean;
  openOrderLiquidated: boolean;

  closeOrder: OrderType;
  closeOrderFilled: boolean;
  closeOrderPending: boolean;
  closeOrderRejected: boolean;
  closeOrderCancelled: boolean;

  /**
   * Is a percent value, not an
   * actual ratio
   */
  feeRate: number;

  stats: IOperationStats;
}
