"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const main_1 = require("./main");
const rxjs_1 = require("rxjs");
const config = {
    gatewayRestApiAddress: 'http://localhost:3005/api/v1/',
    instanceTraderRestApiAddress: 'http://localhost:3002/',
    gatewayWsApiAddress: 'ws://localhost:3005',
    instanceSSMWsApiAddress: 'ws://localhost:3001/ssm',
    instanceHistoryLoaderWsApiAddress: 'ws://localhost:3000/history-loader',
    instanceLoggingCenterWsApiAddress: 'ws://localhost:3003/logging-center',
};
const sleep = (ms) => new Promise((r) => setTimeout(() => r(), ms));
let opId;
const sdk = new main_1.IvySDK(config);
sdk
    .subscribeReady()
    .pipe((0, rxjs_1.tap)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sdk.log('Testing order creation', 'sdk.logs');
    try {
        const result = yield sdk.newOperation({
            exchangeMarket: 'bybit_linear',
            operationType: 'long',
            orderType: 'Market',
            symbol: 'BTC/USDT',
            leverage: 1,
            leverageEntryPercent: 5,
        });
        yield sdk.log(`Testing order creation: OK`, 'sdk.logs');
        opId = result.operationId;
    }
    catch (e) {
        yield sdk.log(`Error while creating new operation on trader: ${e.message || e.error}`, 'sdk.errors');
        return;
    }
    yield sleep(2000);
    yield sdk.log('Testing order closing', 'sdk.logs');
    try {
        const result = yield sdk.closeOperation({
            exchangeMarket: 'bybit_linear',
            operationType: 'long',
            orderType: 'Market',
            symbol: 'BTC/USDT',
        });
        yield sdk.log(`Testing order closing: OK`, 'sdk.logs');
    }
    catch (e) {
        yield sdk.log(`Error while closing operation on trader: ${e.message || e.error}`, 'sdk.errors');
        return;
    }
    yield sleep(2000);
    yield sdk.log('Testing closed operation fetch', 'sdk.logs');
    try {
        const result = yield sdk.getClosedOperation(opId);
        yield sdk.log(`Testing closed operation fetch: OK`, 'sdk.logs');
    }
    catch (e) {
        yield sdk.log(`Error while fetching operation on trader: ${e.message || e.error}`, 'sdk.errors');
        return;
    }
    yield sleep(2000);
    yield sdk.log('Testing history load', 'sdk.logs');
    try {
        const result = yield sdk.loadHistory({
            len: 10,
            referenceKlineTime: Date.now(),
            reqId: (0, crypto_1.randomUUID)(),
            ticker: 'binance_spot~BTC/USDT~1m',
        });
        yield sdk.log(`Testing history load: OK`, 'sdk.logs');
    }
    catch (e) {
        yield sdk.log(`Error while fetching history from history loader: ${e.message || e.error}`, 'sdk.errors');
        return;
    }
    yield sleep(2000);
    yield sdk.log('Testing IK subscription', 'sdk.logs');
    try {
        let err = yield sdk.enableIKStream();
        if (!!err) {
            yield sdk.log(`Error while enabling IK subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`IK subscription enabled`, 'sdk.logs');
        sdk
            .subscribeIKStream()
            .pipe((0, rxjs_1.tap)(() => __awaiter(void 0, void 0, void 0, function* () { return yield sdk.log('Received IK event', 'sdk.logs'); })))
            .subscribe();
        yield sleep(1000 * 5);
        err = yield sdk.disableIKStream();
        if (!!err) {
            yield sdk.log(`Error while disabling IK subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`IK subscription disabled`, 'sdk.logs');
        yield sleep(1000 * 5);
        err = yield sdk.enableIKStream();
        if (!!err) {
            yield sdk.log(`Error while enabling IK subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`IK subscription enabled`, 'sdk.logs');
        yield sleep(1000 * 5);
        yield sdk.log(`Testing IK subscription: OK`, 'sdk.logs');
    }
    catch (e) {
        yield sdk.log(`Error while testing IK subscription: ${e.message || e.error}`, 'sdk.errors');
    }
    yield sleep(2000);
    yield sdk.log('Testing pump events subscription', 'sdk.logs');
    try {
        let err = yield sdk.enablePumpStream({
            xm: 'bybit_linear',
            tfs: ['1m'],
        });
        if (!!err) {
            yield sdk.log(`Error while enabling pump events subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`Pump subscription enabled`, 'sdk.logs');
        sdk
            .subscribePumpStream()
            .pipe((0, rxjs_1.tap)(() => __awaiter(void 0, void 0, void 0, function* () { return yield sdk.log('Received pump event', 'sdk.logs'); })))
            .subscribe();
        yield sleep(1000 * 5);
        err = yield sdk.disablePumpStream({ xm: 'bybit_linear' });
        if (!!err) {
            yield sdk.log(`Error while disabling pump subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`Pump subscription disabled`, 'sdk.errors');
        yield sleep(1000 * 5);
        err = yield sdk.enablePumpStream({ xm: 'bybit_linear', tfs: ['1m'] });
        if (!!err) {
            yield sdk.log(`Error while enabling pump subscription`, 'sdk.errors');
            return;
        }
        yield sdk.log(`Pump subscription enabled`, 'sdk.errors');
        yield sleep(1000 * 10);
        yield sdk.log(`Testing pump events subscription: OK`, 'sdk.logs');
    }
    catch (e) {
        yield sdk.log(`Error while testing pump events subscription: ${e.message || e.error}`, 'sdk.errors');
    }
})))
    .subscribe();
//# sourceMappingURL=example.js.map