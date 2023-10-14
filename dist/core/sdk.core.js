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
const control_center_service_1 = require("./services/instance/control-center.service");
class IvySDK {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.apiKey = (_a = opts === null || opts === void 0 ? void 0 : opts.apiKey) !== null && _a !== void 0 ? _a : config_core_1.ENVConfig.scriptApiKey;
        this.gatewayWsApiAddress =
            (_b = opts === null || opts === void 0 ? void 0 : opts.gatewayWsApiAddress) !== null && _b !== void 0 ? _b : 'ws://api.ivy.cryptobeam.net';
        this.gatewayRestApiAddress =
            (_c = opts === null || opts === void 0 ? void 0 : opts.gatewayRestApiAddress) !== null && _c !== void 0 ? _c : 'https://api.ivy.cryptobeam.net/api/v1/';
        this.instanceSSMWsApiAddress =
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
        this.instanceLoggingCenterWsApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWsApiAddress) === null
                ? null
                : (_g = opts === null || opts === void 0 ? void 0 : opts.instanceLoggingCenterWsApiAddress) !== null && _g !== void 0 ? _g : 'ws://ivy-logging-center:3000/logging-center';
        this.instanceControlCenterWsApiAddress =
            (_h = opts === null || opts === void 0 ? void 0 : opts.instanceControlCenterWsApiAddress) !== null && _h !== void 0 ? _h : 'ws://ivy-control-center:3000/control-center';
        this.instanceControlCenterRestApiAddress =
            (_j = opts === null || opts === void 0 ? void 0 : opts.instanceTraderRestApiAddress) !== null && _j !== void 0 ? _j : 'http://ivy-control-center:3000/control-center';
        this.instanceHistoryLoaderWsApiAddress =
            (opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWsApiAddress) === null
                ? null
                : (_k = opts === null || opts === void 0 ? void 0 : opts.instanceHistoryLoaderWsApiAddress) !== null && _k !== void 0 ? _k : 'ws://ivy-history-loader:3000/history-loader';
        console.log({
            instanceControlCenterRestApiAddress: this.instanceControlCenterRestApiAddress,
            gatewayWsApiAddress: this.gatewayWsApiAddress,
            gatewayRestApiAddress: this.gatewayRestApiAddress,
            instanceSSMWsApiAddress: this.instanceSSMWsApiAddress,
            instanceTraderWsApiAddress: this.instanceTraderWsApiAddress,
            instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
            instanceLoggingCenterWsApiAddress: this.instanceLoggingCenterWsApiAddress,
            instanceControlCenterWsApiAddress: this.instanceControlCenterWsApiAddress,
            instanceHistoryLoaderWsApiAddress: this.instanceHistoryLoaderWsApiAddress,
        });
        this.ensureRequiredParametersOrThrow();
        if (this.instanceSSMWsApiAddress)
            this.SSM = new ssm_service_1.InstanceSSMService(this.instanceSSMWsApiAddress);
        else
            this.SSM = null;
        this.pumpdump = new pumpdump_service_1.GatewayPumpDumpService(`${this.gatewayWsApiAddress}/pumpdump`);
        this.controlCenter = new control_center_service_1.InstanceControlCenterService(this.instanceControlCenterRestApiAddress, this.instanceControlCenterWsApiAddress);
        if (this.instanceTraderRestApiAddress && this.instanceTraderWsApiAddress)
            this.trader = new trader_service_1.InstanceTraderService(this.instanceTraderRestApiAddress, this.instanceTraderWsApiAddress, this.apiKey);
        else
            this.trader = null;
        if (this.instanceLoggingCenterWsApiAddress)
            this.loggingCenter = new logging_center_service_1.InstanceLoggingCenterService(this.instanceLoggingCenterWsApiAddress);
        else
            this.loggingCenter = null;
        if (this.instanceHistoryLoaderWsApiAddress)
            this.historyLoader = new history_loader_service_1.InstanceHistoryLoaderService(this.instanceHistoryLoaderWsApiAddress);
        else
            this.historyLoader = null;
    }
    subscribeReady() {
        return (0, rxjs_1.zip)(this.pumpdump.subscribeReady(), this.controlCenter.subscribeReady(), this.instanceSSMWsApiAddress !== null
            ? this.SSM.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceTraderWsApiAddress !== null &&
            this.instanceTraderRestApiAddress !== null
            ? this.trader.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceHistoryLoaderWsApiAddress !== null
            ? this.historyLoader.subscribeReady()
            : (0, rxjs_1.of)(true), this.instanceLoggingCenterWsApiAddress !== null
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
    initConfig(config) {
        return this.controlCenter.initScriptConfig(config);
    }
    getConfig() {
        return this.controlCenter.getScriptConfig();
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
    enableActiveStatsUpdate() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.enableActiveStatsUpdates();
    }
    /**
     * Always active stream
     *
     * Once you've received this event, you should reset your
     * script state.
     *
     * Do not worry about closing operations or cancelling
     * orders, since this has been already done by the trader
     * and once you receive this event, is safe to forcefully
     * reset the state to its initial value
     */
    subscribeRestartCommands() {
        return this.controlCenter.subscribeRestartCommands();
    }
    /**
     * Always active stream
     *
     * Once you've received this event, you must
     * immediately stop opening orders. But you
     * should continue tracking opened ones.
     */
    subscribePauseCommands() {
        return this.controlCenter.subscribePauseCommands();
    }
    /**
     * Always active stream
     *
     * Once you've received this event, you can
     * go back to opening orders as your script
     * logic would normally do.
     */
    subscribeResumeCommands() {
        return this.controlCenter.subscribeResumeCommands();
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
    subscribeOperationsOpenErrors() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeOperationsOpenErrors();
    }
    /**
     * Always active stream
     */
    subscribeOperationsCloseErrors() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeOperationsCloseErrors();
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
    subscribeActiveStatsUpdates() {
        if (this.trader === null)
            throw new Error(`Trader service disabled`);
        return this.trader.subscribeActiveStatsUpdates();
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
        if (!this.gatewayWsApiAddress)
            throw new Error('Gateway websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.gatewayRestApiAddress)
            throw new Error('Gateway REST address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceControlCenterWsApiAddress)
            throw new Error('Control center websocket address is missing. Do not specify it in the config to use the default one');
        if (!this.instanceControlCenterRestApiAddress)
            throw new Error('Control center REST address is missing. Do not specify it in the config to use the default one');
        if (this.instanceSSMWsApiAddress !== null && !this.instanceSSMWsApiAddress)
            throw new Error('SSM websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceTraderWsApiAddress !== null &&
            !this.instanceTraderWsApiAddress)
            throw new Error('Trader websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceTraderRestApiAddress !== null &&
            !this.instanceTraderRestApiAddress)
            throw new Error('Trader REST address is missing. Do not specify it in the config to use the default one');
        if (this.instanceLoggingCenterWsApiAddress !== null &&
            !this.instanceLoggingCenterWsApiAddress)
            throw new Error('Logging center websocket address is missing. Do not specify it in the config to use the default one');
        if (this.instanceHistoryLoaderWsApiAddress !== null &&
            !this.instanceHistoryLoaderWsApiAddress)
            throw new Error('History loader websocket address is missing. Do not specify it in the config to use the default one');
    }
}
exports.IvySDK = IvySDK;
//# sourceMappingURL=sdk.core.js.map