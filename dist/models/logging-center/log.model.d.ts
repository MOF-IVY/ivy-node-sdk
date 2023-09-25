import { IPostLogConfig } from './post-log-conf.model';
export declare class IvyLog implements IPostLogConfig {
    persist?: boolean;
    readonly key: string;
    readonly log: string;
    readonly time: number;
    readonly instanceUid: string;
    readonly jsonParsable?: boolean;
    constructor(log: string | object, key: string, instanceUid: string);
    toJSON(): IPostLogConfig;
}
