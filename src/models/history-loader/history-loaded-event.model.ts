import { OHLCV } from '../common/ohlcv.type';

export interface IHistoryLoaded {
  reqId: string;
  ticker: string;
  history: OHLCV[];
}
