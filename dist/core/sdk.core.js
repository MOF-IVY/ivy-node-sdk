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
            (opts === null || opts === void 0 ? void 0 : opts.instanceSSMWsApiAddress) === null
                ? null
                : (_d = opts === null || opts === void 0 ? void 0 : opts.instanceSSMWsApiAddress) !== null && _d !== void 0 ? _d : 'http://ivy-ssm:3000/ssm';
        this.instanceTraderWsApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceTraderWsApiAddress) === null
                ? null
                : (_e = opts === null || opts === void 0 ? void 0 : opts.instanceTraderWsApiAddress) !== null && _e !== void 0 ? _e : 'http://ivy-trader:3000/trader';
        this.instanceTraderRestApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceTraderRestApiAddress) === null
                ? null
                : (_f = opts === null || opts === void 0 ? void 0 : opts.instanceTraderRestApiAddress) !== null && _f !== void 0 ? _f : 'http://ivy-trader:3000';
        this.instanceLoggingCenterWSApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWsApiAddress) === null
                ? null
                : (_g = opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWsApiAddress) !== null && _g !== void 0 ? _g : 'ws://ivy-logging-center:3000/logging-center';
        this.instanceHistoryLoaderWSApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWsApiAddress) === null
                ? null
                : (_h = opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWsApiAddress) !== null && _h !== void 0 ? _h : 'ws://ivy-history-loader:3000/history-loader';
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
        if (this.instanceSSMWSApiAddress)
            this.SSM = new ssm_service_1.InstanceSSMService(this.instanceSSMWSApiAddress);
        else
            this.SSM = null;
        this.pumpdump = new pumpdump_service_1.GatewayPumpDumpService(`${this.gatewayWSApiAddress}/pumpdump`);
        if (this.instanceTraderRestApiAddress && this.instanceTraderWsApiAddress)
            this.trader = new trader_service_1.InstanceTraderService(this.instanceTraderRestApiAddress, this.instanceTraderWsApiAddress, this.apiKey);
        else
            this.trader = null;
        if (this.instanceLoggingCenterWSApiAddress)
            this.loggingCenter = new logging_center_service_1.InstanceLoggingCenterService(this.instanceLoggingCenterWSApiAddress);
        else
            this.loggingCenter = null;
        if (this.instanceHistoryLoaderWSApiAddress)
            this.historyLoader = new history_loader_service_1.InstanceHistoryLoaderService(this.instanceHistoryLoaderWSApiAddress);
        else
            this.historyLoader = null;
    }
    subscribeReady() {
        return (0, rxjs_1.zip)(this.pumpdump.subscribeReady(), this.instanceSSMWSApiAddress !== null
            ? this.SSM.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceTraderWsApiAddress !== null &&
            this.instanceTraderRestApiAddress !== null
            ? this.trader.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceHistoryLoaderWSApiAddress !== null
            ? this.historyLoader.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceLoggingCenterWSApiAddress !== null
            ? this.loggingCenter.subscribeReady()
            : (0, rxjs_1.of)(true)).pipe((0, rxjs_1.filter)(([ssm, trd, pd, hl, lc]) => !!ssm && !!trd && !!pd && !!hl && !!lc), (0, rxjs_1.map)(() => true));
    }
    clearLogs(keys) {
        throw new Error('Not implemented');
    }
    log(message, key, persist = false) {
        if (this.loggingCenter === null)
            throw new Error(`Logging center service disabled`);
        return this.loggingCenter.postLog(message, key, persist);
    }
    loadHistory(opts) {
        if (this.historyLoader === null)
            throw new Error(`History loading service disabled`);
        return this.historyLoader.loadHistory(opts);
    }
    newOperation(opts) {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.createNewOperation(opts);
    }
    closeOperation(opts) {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.closeOperation(opts);
    }
    cancelOrder(operationId, orderType) {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return orderType === 'open'
            ? this.trader.cancelOpenOrder(operationId)
            : this.trader.cancelCloseOrder(operationId);
    }
    hasOperationOpen(xm, symbol, type) {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.hasOperationOpen(xm, symbol, type);
    }
    getClosedOperation(operationId) {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.getClosedOperation(operationId);
    }
    enableIKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.enableIKStream();
    }
    disableIKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.disableIKStream();
    }
    enableFKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.enableFKStream();
    }
    disableFKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.disableFKStream();
    }
    enablePumpStream(payload) {
        return this.pumpdump.enablePumpStream(payload);
    }
    disablePumpStream(payload) {
        return this.pumpdump.disablePumpStream(payload);
    }
    enableDumpStream(payload) {
        return this.pumpdump.enableDumpStream(payload);
    }
    disableDumpStream(payload) {
        return this.pumpdump.disableDumpStream(payload);
    }
    /**
     * Stream active after activation request
     */
    enableActiveStatsUpdate() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.enableActiveStatsUpdates();
    }
    subscribeActiveStatsUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeActiveStatsUpdates();
    }
    /**
     * Always active stream
     */
    subscribeOpenedOperationsUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeOpenedOperationsUpdates();
    }
    /**
     * Always active stream
     */
    subscribeClosedOperationsUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeClosedOperationsUpdates();
    }
    /**
     * Always active stream
     */
    subscribeLiquidatedOperationsUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeLiquidatedOperationsUpdates();
    }
    /**
     * Always active stream
     */
    subscribeRejectedOrdersUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeRejectedOrdersUpdates();
    }
    /**
     * Always active stream
     */
    subscribeCancelledOrdersUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeCancelledOrdersUpdates();
    }
    /**
     * Stream active after activation request
     */
    subscribeIKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.subscribeIKStream();
    }
    /**
     * Stream active after activation request
     */
    subscribeFKStream() {
        if (this.SSM === null)
            throw new Error(`SSM service disabled`);
        return this.SSM.subscribeFKStream();
    }
    /**
     * Stream active after activation request
     */
    subscribePumpStream() {
        return this.pumpdump.subscribePumpStream();
    }
    /**
     * Stream active after activation request
     */
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
        if (this.instanceSSMWSApiAddress !== null && !this.instanceSSMWSApiAddress)
            throw new Error('SSM websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceTraderWsApiAddress !== null &&
            !this.instanceTraderWsApiAddress)
            throw new Error('Trader websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceTraderRestApiAddress !== null &&
            !this.instanceTraderRestApiAddress)
            throw new Error('Trader REST address is missing. Do not specify it in the config to use the default one');
        if (this.instanceLoggingCenterWSApiAddress !== null &&
            !this.instanceLoggingCenterWSApiAddress)
            throw new Error('Logging center websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceHistoryLoaderWSApiAddress !== null &&
            !this.instanceHistoryLoaderWSApiAddress)
            throw new Error('History loader websocket address is missing. Do not specify it in the config to use the default one');
    }
}
exports.IvySDK = IvySDK;
//# sourceMappingURL=sdk.core.js.map