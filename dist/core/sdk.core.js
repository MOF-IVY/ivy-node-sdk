"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvySDK = void 0;
const config_core_1 = require("./config/config/config.core");
const ssm_service_1 = require("./services/instance/ssm.service");
const trader_service_1 = require("./services/instance/trader.service");
const pumpdump_service_1 = require("./services/gateway/pumpdump.service");
const history_loader_service_1 = require("./services/instance/history-loader.service");
const logging_center_service_1 = require("./services/instance/logging-center.service");
class IvySDK {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.apiKey = (_a = opts === null || opts === void 0 ? void 0 : opts.apiKey) !== null && _a !== void 0 ? _a : config_core_1.ENVConfig.scriptApiKey;
        this.instanceUid = (_b = opts === null || opts === void 0 ? void 0 : opts.instanceUid) !== null && _b !== void 0 ? _b : config_core_1.ENVConfig.scriptUid;
        this.gatewayWSApiAddress =
            (_c = opts === null || opts === void 0 ? void 0 : opts.gatewayWSApiAddress) !== null && _c !== void 0 ? _c : 'ws://api.ivy.cryptobeam.net';
        this.gatewayRESTApiAddress =
            (_d = opts === null || opts === void 0 ? void 0 : opts.gatewayRESTApiAddress) !== null && _d !== void 0 ? _d : 'https://api.ivy.cryptobeam.net/api/v1/';
        this.instanceSSMWSApiAddress =
            (_e = opts === null || opts === void 0 ? void 0 : opts.instanceSSMWSApiAddress) !== null && _e !== void 0 ? _e : 'http://ivy-ssm:3000/ssm';
        this.instanceTraderRestApiAddress =
            (_f = opts === null || opts === void 0 ? void 0 : opts.instanceTraderRestApiAddress) !== null && _f !== void 0 ? _f : 'http://ivy-trader:3000';
        this.instanceLoggingCenterWSApiAddress =
            (_g = opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWSApiAddress) !== null && _g !== void 0 ? _g : 'ws://ivy-logging-center:3000/logging-center';
        this.instanceHistoryLoaderWSApiAddress =
            (_h = opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWSApiAddress) !== null && _h !== void 0 ? _h : 'ws://ivy-history-loader:3000/history-loader';
        this.ensureRequiredParametersOrThrow();
        this.SSM = new ssm_service_1.InstanceSSMService(this.instanceSSMWSApiAddress);
        this.pumpdump = new pumpdump_service_1.GatewayPumpDumpService(`${this.gatewayWSApiAddress}/pumpdump-stream`);
        this.trader = new trader_service_1.InstanceTraderService(this.instanceTraderRestApiAddress, this.apiKey);
        this.loggingCenter = new logging_center_service_1.InstanceLoggingCenterService(this.instanceLoggingCenterWSApiAddress, this.instanceUid);
        this.historyLoader = new history_loader_service_1.InstanceHistoryLoaderService(this.instanceHistoryLoaderWSApiAddress);
        // TODO: delete
        console.log({
            apiKey: this.apiKey,
            instanceUid: this.instanceUid,
            gatewayWSApiAddress: this.gatewayWSApiAddress,
            gatewayRESTApiAddress: this.gatewayRESTApiAddress,
            instanceSSMWSApiAddress: this.instanceSSMWSApiAddress,
            instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
            instanceLoggingCenterWSApiAddress: this.instanceLoggingCenterWSApiAddress,
            instanceHistoryLoaderWSApiAddress: this.instanceHistoryLoaderWSApiAddress,
        });
    }
    clearLogs(keys) {
        throw new Error('Not implemented');
    }
    log(message, key, persist = false) {
        this.loggingCenter.postLog(message, key, persist);
    }
    loadHistory(opts) {
        return this.historyLoader.loadHistory(opts);
    }
    newOperation(opts) {
        return this.trader.createNewOperation(opts);
    }
    closeOperation(opts) {
        return this.trader.closeOperation(opts);
    }
    hasOperationOpen(xm, symbol, type) {
        return this.trader.hasOperationOpen(xm, symbol, type);
    }
    getClosedOperation(operationId) {
        return this.trader.getClosedOperation(operationId);
    }
    /**
     * Always catch
     */
    enableIKStream() {
        this.SSM.enableIKStream();
    }
    subscribeIKStream() {
        return this.SSM.subscribeIKStream();
    }
    /**
     * Always catch
     */
    enableFKStream() {
        this.SSM.enableFKStream();
    }
    subscribeFKStream() {
        return this.SSM.subscribeFKStream();
    }
    /**
     * Always catch
     */
    enablePumpStream(payload) {
        this.pumpdump.enablePumpStream(payload);
    }
    subscribePumpStream() {
        return this.pumpdump.subscribePumpStream();
    }
    /**
     * Always catch
     */
    enableDumpStream(payload) {
        this.pumpdump.enableDumpStream(payload);
    }
    subscribeDumpStream() {
        return this.pumpdump.subscribeDumpStream();
    }
    ensureRequiredParametersOrThrow() {
        if (!this.apiKey)
            throw new Error("API key is missing. Either pass it via config or via environment at 'IVY_SCRIPT_API_KEY'");
        if (!this.instanceUid)
            throw new Error("Script uid is missing. Either pass it via config or via environment at 'IVY_SCRIPT_UID'");
        if (!this.gatewayWSApiAddress)
            throw new Error('Gateway websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.gatewayRESTApiAddress)
            throw new Error('Gateway REST address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceSSMWSApiAddress)
            throw new Error('SSM websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceTraderRestApiAddress)
            throw new Error('Trader REST address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceLoggingCenterWSApiAddress)
            throw new Error('Logging center websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceHistoryLoaderWSApiAddress)
            throw new Error('History loader websocket address is missing. Do not specify it in the config to use the default one');
    }
}
exports.IvySDK = IvySDK;
//# sourceMappingURL=sdk.core.js.map