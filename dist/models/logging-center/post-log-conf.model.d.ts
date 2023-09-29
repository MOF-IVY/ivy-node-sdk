export interface IPostLogConfig {
    instanceUid: string;
    key: string;
    log: string;
    time: number;
    persist?: boolean;
    jsonParsable?: boolean;
}
