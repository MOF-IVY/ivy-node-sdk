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
class InstanceTraderService {
    constructor(address, apiKey) {
        this.httpClient = axios_1.default.create({
            baseURL: address,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
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
}
exports.InstanceTraderService = InstanceTraderService;
//# sourceMappingURL=trader.service.js.map