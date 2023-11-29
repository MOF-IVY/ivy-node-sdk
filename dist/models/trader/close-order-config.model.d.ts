export interface ITraderCloseOrderConfig {
    operationId: string;
    orderType: 'Limit' | 'Market';
    /**
     * Optional, and used only if order type is Limit.
     * If given it will place the limit order at that price.
     * If not given it will use the most recent price to place
     * the order.
     */
    price?: number;
}
