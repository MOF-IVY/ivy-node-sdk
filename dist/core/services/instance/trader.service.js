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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceTraderService = void 0;
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class InstanceTraderService extends ws_service_1.BaseWebsocketService {
    constructor(restAddress, wsAddress, apiKey) {
        super(wsAddress);
        this.operationsOpenErrorsEvents$ = new rxjs_1.Subject();
        this.operationsCloseErrorsEvents$ = new rxjs_1.Subject();
        this.newActiveOpsEvents$ = new rxjs_1.Subject();
        this.closedOpsEvents$ = new rxjs_1.Subject();
        this.liquidatedOpsEvents$ = new rxjs_1.Subject();
        this.rejectedOrdersEvents$ = new rxjs_1.Subject();
        this.cancelledOrdersEvents$ = new rxjs_1.Subject();
        this.activeOperationsStatsUpdates$ = new rxjs_1.Subject();
        this.httpClient = axios_1.default.create({
            baseURL: restAddress,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        super
            .subscribeReady()
            .pipe((0, rxjs_1.filter)((ready) => !!ready), (0, rxjs_1.take)(1), (0, rxjs_1.tap)(() => {
            this.socket.on('closed-operation-event', this.closedOpEventHandler.bind(this));
            this.socket.on('opened-operation-event', this.openedOpEventHandler.bind(this));
            this.socket.on('liquidation-event', this.liquidatedOpEventHandler.bind(this));
            this.socket.on('cancelled-order-event', this.cancelledOrdersEventHandler.bind(this));
            this.socket.on('rejected-order-event', this.rejectedOrdersEventHandler.bind(this));
            this.socket.on('operation-open-error-event', this.operationOpenErrorEventHandler.bind(this));
            this.socket.on('operation-close-error-event', this.operationCloseErrorEventHandler.bind(this));
        }))
            .subscribe();
    }
    enableActiveOperationsStatsUpdates() {
        return new Promise((resolve) => {
            this.socket.on('active-operation-stats-event', this.activeOperationsStatsEventHandler.bind(this));
            this.socket.once('subscribe-active-operations-stats-updates-error', (error) => resolve(error));
            this.socket.once('subscribe-active-operations-stats-updates-success', () => resolve());
            this.safeEmitWithReconnect('subscribe-active-operations-stats-updates');
        });
    }
    subscribeActiveOperationsStatsUpdates() {
        return this.activeOperationsStatsUpdates$.asObservable();
    }
    subscribeNewActiveOperationsEvents() {
        return this.newActiveOpsEvents$.asObservable();
    }
    subscribeClosedOperationsEvents() {
        return this.closedOpsEvents$.asObservable();
    }
    subscribeLiquidatedOperationsEvents() {
        return this.liquidatedOpsEvents$.asObservable();
    }
    subscribeCancelledOrdersEvents() {
        return this.cancelledOrdersEvents$.asObservable();
    }
    subscribeRejectedOrdersEvents() {
        return this.rejectedOrdersEvents$.asObservable();
    }
    subscribeOperationsOpenErrorsEvents() {
        return this.operationsOpenErrorsEvents$.asObservable();
    }
    subscribeOperationsCloseErrorsEvents() {
        return this.operationsCloseErrorsEvents$.asObservable();
    }
    isReady() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/ready`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    hasActiveOperation(xm, symbol, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/operation/active?xm=${xm}&symbol=${symbol}&type=${type}`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    getActiveOperationsSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/operations/active/symbols/list`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    getClosedOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/operation/closed/${operationId}`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    createNewOperation(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.post('trader/operation/new', opts);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    closeOperation(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.post('trader/operation/close', opts);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    cancelOpenOrder(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.delete(`trader/operation/open-order/${operationId}`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    cancelCloseOrder(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.delete(`trader/operation/close-order/${operationId}`);
            this.throwIfResponseError(resp);
            return resp.data.data;
        });
    }
    liquidatedOpEventHandler(data) {
        this.liquidatedOpsEvents$.next(data);
    }
    cancelledOrdersEventHandler(data) {
        this.cancelledOrdersEvents$.next(data);
    }
    rejectedOrdersEventHandler(data) {
        this.rejectedOrdersEvents$.next(data);
    }
    openedOpEventHandler(data) {
        this.newActiveOpsEvents$.next(data);
    }
    closedOpEventHandler(data) {
        this.closedOpsEvents$.next(data);
    }
    operationOpenErrorEventHandler(operationId) {
        this.operationsOpenErrorsEvents$.next(operationId);
    }
    operationCloseErrorEventHandler(operationId) {
        this.operationsCloseErrorsEvents$.next(operationId);
    }
    activeOperationsStatsEventHandler(data) {
        this.activeOperationsStatsUpdates$.next(data);
    }
    throwIfResponseError(resp) {
        if (resp.status < 300 && resp.data.statusCode >= 300)
            throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
        if (resp.status >= 300)
            throw new Error(resp.statusText);
    }
}
exports.InstanceTraderService = InstanceTraderService;
//# sourceMappingURL=trader.service.js.map