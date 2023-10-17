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
const ws_service_1 = require("../base/ws.service");
const rxjs_1 = require("rxjs");
class InstanceTraderService extends ws_service_1.BaseWebsocketService {
    constructor(restAddress, wsAddress, apiKey) {
        super(wsAddress);
        this.openedOpsUpdates$ = new rxjs_1.Subject();
        this.closedOpsUpdates$ = new rxjs_1.Subject();
        this.liquidatedOpsUpdates$ = new rxjs_1.Subject();
        this.operationsOpenErrors$ = new rxjs_1.Subject();
        this.operationsCloseErrors$ = new rxjs_1.Subject();
        this.rejectedOrdersUpdates$ = new rxjs_1.Subject();
        this.cancelledOrdersUpdates$ = new rxjs_1.Subject();
        this.activeStatsUpdates$ = new rxjs_1.Subject();
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
    enableActiveStatsUpdates() {
        return new Promise((resolve) => {
            this.socket.on('active-operation-stats-event', this.activeStatsEventHandler.bind(this));
            this.socket.once('subscribe-active-operation-stats-update-error', (error) => resolve(error));
            this.socket.once('subscribe-active-operation-stats-update-success', () => resolve());
            this.safeEmitWithReconnect('subscribe-active-operation-stats-update');
        });
    }
    subscribeActiveStatsUpdates() {
        return this.activeStatsUpdates$.asObservable();
    }
    subscribeOpenedOperationsUpdates() {
        return this.openedOpsUpdates$.asObservable();
    }
    subscribeClosedOperationsUpdates() {
        return this.closedOpsUpdates$.asObservable();
    }
    subscribeLiquidatedOperationsUpdates() {
        return this.liquidatedOpsUpdates$.asObservable();
    }
    subscribeCancelledOrdersUpdates() {
        return this.cancelledOrdersUpdates$.asObservable();
    }
    subscribeRejectedOrdersUpdates() {
        return this.rejectedOrdersUpdates$.asObservable();
    }
    subscribeOperationsOpenErrors() {
        return this.operationsOpenErrors$.asObservable();
    }
    subscribeOperationsCloseErrors() {
        return this.operationsCloseErrors$.asObservable();
    }
    hasOperationOpen(xm, symbol, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/operation/open/${xm}/${symbol}/${type}`);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    getClosedOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`trader/operation/closed/${operationId}`);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    createNewOperation(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.post('trader/operation/new', opts);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to create a new operation: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    closeOperation(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.post('trader/operation/close', opts);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to close an operation: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    cancelOpenOrder(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.delete(`trader/operation/open-order/${operationId}`);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to cancel an operation open order: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    cancelCloseOrder(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.delete(`trader/operation/close-order/${operationId}`);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceTraderService.name}] http error while trying to cancel an operation close order: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    liquidatedOpEventHandler(data) {
        this.liquidatedOpsUpdates$.next(data);
    }
    cancelledOrdersEventHandler(data) {
        this.cancelledOrdersUpdates$.next(data);
    }
    rejectedOrdersEventHandler(data) {
        this.rejectedOrdersUpdates$.next(data);
    }
    openedOpEventHandler(data) {
        this.openedOpsUpdates$.next(data);
    }
    closedOpEventHandler(data) {
        this.closedOpsUpdates$.next(data);
    }
    operationOpenErrorEventHandler(data) {
        this.operationsOpenErrors$.next(data);
    }
    operationCloseErrorEventHandler(data) {
        this.operationsCloseErrors$.next(data);
    }
    activeStatsEventHandler(data) {
        this.activeStatsUpdates$.next(data);
    }
}
exports.InstanceTraderService = InstanceTraderService;
//# sourceMappingURL=trader.service.js.map