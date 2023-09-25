import { ExchangesMarkets } from '../common/exchanges-markets.type';
export interface ITopPerformersCalculationResult {
    exchange: string;
    result: {
        tf: string;
        items: {
            k: string;
            v: number;
        }[];
    }[];
}
export interface IPumpDumpEvent extends ITopPerformersCalculationResult {
    exchangeMarket: ExchangesMarkets;
}
