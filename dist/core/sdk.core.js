"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvySDK = void 0;
const rxjs_1 = require("rxjs");
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
        this.gatewayWSApiAddress =
            (_b = opts === null || opts === void 0 ? void 0 : opts.gatewayWsApiAddress) !== null && _b !== void 0 ? _b : 'ws://api.ivy.cryptobeam.net';
        this.gatewayRESTApiAddress =
            (_c = opts === null || opts === void 0 ? void 0 : opts.gatewayRestApiAddress) !== null && _c !== void 0 ? _c : 'https://api.ivy.cryptobeam.net/api/v1/';
        this.instanceSSMWSApiAddress =
            (_d = opts === null || opts === void 0 ? void 0 : opts.instanceSSMWsApiAddress) !== null && _d !== void 0 ? _d : 'http://ivy-ssm:3000/ssm';
        this.instanceTraderWsApiAddress =
            (_e = opts === null || opts === void 0 ? void 0 : opts.instanceTraderWsApiAddress) !== null && _e !== void 0 ? _e : 'http://ivy-trader:3000/trader';
        this.instanceTraderRestApiAddress =
            (_f = opts === null || opts === void 0 ? void 0 : opts.instanceTraderRestApiAddress) !== null && _f !== void 0 ? _f : 'http://ivy-trader:3000';
        this.instanceLoggingCenterWSApiAddress =
            (_g = opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWsApiAddress) !== null && _g !== void 0 ? _g : 'ws://ivy-logging-center:3000/logging-center';
        this.instanceHistoryLoaderWSApiAddress =
            (_h = opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWsApiAddress) !== null && _h !== void 0 ? _h : 'ws://ivy-history-loader:3000/history-loader';
        console.log({
            gatewayWSApiAddress: this.gatewayWSApiAddress,
            gatewayRESTApiAddress: this.gatewayRESTApiAddress,
            instanceSSMWSApiAddress: this.instanceSSMWSApiAddress,
            instanceTraderWsApiAddress: this.instanceTraderWsApiAddress,
            instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
            instanceLoggingCenterWSApiAddress: this.instanceLoggingCenterWSApiAddress,
            instanceHistoryLoaderWSApiAddress: this.instanceHistoryLoaderWSApiAddress,
        });
        this.ensureRequiredParametersOrThrow();
        this.SSM = new ssm_service_1.InstanceSSMService(this.instanceSSMWSApiAddress);
        this.pumpdump = new pumpdump_service_1.GatewayPumpDumpService(`${this.gatewayWSApiAddress}/pumpdump`);
        this.trader = new trader_service_1.InstanceTraderService(this.instanceTraderRestApiAddress, this.instanceTraderWsApiAddress, this.apiKey);
        this.loggingCenter = new logging_center_service_1.InstanceLoggingCenterService(this.instanceLoggingCenterWSApiAddress);
        this.historyLoader = new history_loader_service_1.InstanceHistoryLoaderService(this.instanceHistoryLoaderWSApiAddress);
    }
    subscribeReady() {
        return (0, rxjs_1.zip)(this.SSM.subscribeReady(), this.trader.subscribeReady(), this.pumpdump.subscribeReady(), this.historyLoader.subscribeReady(), this.loggingCenter.subscribeReady()).pipe((0, rxjs_1.filter)(([ssm, trd, pd, hl, lc]) => !!ssm && !!trd && !!pd && !!hl && !!lc), (0, rxjs_1.map)(() => true));
    }
    clearLogs(keys) {
        throw new Error('Not implemented');
    }
    log(message, key, persist = false) {
        return this.loggingCenter.postLog(message, key, persist);
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
    enableActiveStatsUpdate() {
        return this.trader.enableActiveStatsUpdates();
    }
    subscribeActiveStatsUpdates() {
        return this.trader.subscribeActiveStatsUpdates();
    }
    enableIKStream() {
        return this.SSM.enableIKStream();
    }
    disableIKStream() {
        return this.SSM.disableIKStream();
    }
    subscribeIKStream() {
        return this.SSM.subscribeIKStream();
    }
    enableFKStream() {
        return this.SSM.enableFKStream();
    }
    disableFKStream() {
        return this.SSM.disableFKStream();
    }
    subscribeFKStream() {
        return this.SSM.subscribeFKStream();
    }
    enablePumpStream(payload) {
        return this.pumpdump.enablePumpStream(payload);
    }
    disablePumpStream(payload) {
        return this.pumpdump.disablePumpStream(payload);
    }
    subscribePumpStream() {
        return this.pumpdump.subscribePumpStream();
    }
    enableDumpStream(payload) {
        return this.pumpdump.enableDumpStream(payload);
    }
    disableDumpStream(payload) {
        return this.pumpdump.disableDumpStream(payload);
    }
    subscribeDumpStream() {
        return this.pumpdump.subscribeDumpStream();
    }
    ensureRequiredParametersOrThrow() {
        if (!this.apiKey)
            throw new Error("API key is missing. Either pass it via config or via environment at 'IVY_SCRIPT_API_KEY'");
        if (!this.gatewayWSApiAddress)
            throw new Error('Gateway websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.gatewayRESTApiAddress)
            throw new Error('Gateway REST address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceSSMWSApiAddress)
            throw new Error('SSM websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceTraderWsApiAddress)
            throw new Error('Trader websocket address is missing. Do not specify it in the config to use the default one');
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