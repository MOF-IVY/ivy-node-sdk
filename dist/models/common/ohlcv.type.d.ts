export declare enum OHLCVPositions {
    TIME = 0,
    OPEN = 1,
    HIGH = 2,
    LOW = 3,
    CLOSE = 4,
    VOLUME = 5,
    TRADE_TIME = 6
}
/**
 * Used for final kline events
 *
 * Timestamp
 * Open
 * High
 * Low
 * Close
 */
export type OHLCV = [number, number, number, number, number, number];
/**
 * Used for intra kline events:
 *
 * Timestamp
 * Open
 * High
 * Low
 * Close
 * Trade Time
 */
export type OHLCVT = [number, number, number, number, number, number, number];
