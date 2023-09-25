import { ExchangesMarkets } from '../common/exchanges-markets.type';
import { OHLCV } from '../common/ohlcv.type';
export interface IFKEvent {
    tf: string;
    sym: string;
    history: OHLCV[];
    xm: ExchangesMarkets;
}
