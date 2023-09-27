export declare class ENVConfig {
    static get verboseMode(): boolean;
    static get scriptUid(): string;
    static get scriptApiKey(): string;
    static get scriptPersistancePath(): string;
    private static ensureConfigExistenceOrThrow;
    private static getConfig;
}
