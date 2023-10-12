export declare class MiscUtils {
    static getNumberPrecision(number: string | number): number;
    static removeSymbolSlash(sym: string): string;
    static getDistinctStrings(strings: string[]): string[];
    static sleepMs(ms: number): Promise<void>;
    static sleepS(s: number): Promise<void>;
    /**
     * converts a time frame to milliseconds
     * @param timeFrame string in form of (s,m,h,d,w,M,y)
     * @returns number ms representation of given time frame
     */
    static parseTimeFrameToMs(timeFrame: string): number;
    /**
     * Returns information about tf in form of object with
     * unit & amount properties. Where unit is a string & amount
     * a number
     * @param tf the input time frame (s,m,h,d,w,M,y)
     * @returns object with unit & amount properties
     */
    static getTfMetadata(tf: string): {
        unit: string;
        amount: number;
    };
    static orderTFs(tfs: string[]): string[];
}
