"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketService = void 0;
const rxjs_1 = require("rxjs");
const socket_io_client_1 = require("socket.io-client");
const config_core_1 = require("../../config/config/config.core");
class BaseWebsocketService {
    constructor(address) {
        this.ready$ = new rxjs_1.BehaviorSubject(false);
        this.emissionsQueue = [];
        this.socket = (0, socket_io_client_1.io)(address, { auth: { apiKey: config_core_1.ENVConfig.scriptApiKey } });
        this.socket.on('welcome', () => {
            if (config_core_1.ENVConfig.verboseMode)
                console.log(`[${address}] welcome received`);
            this.ready$.next(true);
            this.emissionsQueue.forEach(([event, payload], idx) => {
                this.socket.emit(event, payload);
                this.emissionsQueue = this.emissionsQueue.filter(([, _idx]) => idx !== idx);
            });
        });
        this.socket.on('connect', () => {
            this.ready$.next(false);
            if (config_core_1.ENVConfig.verboseMode)
                console.log(`[${address}] connected`);
        });
        this.socket.on('disconnect', () => {
            this.ready$.next(false);
            if (config_core_1.ENVConfig.verboseMode)
                console.log(`[${address}] disconnected`);
        });
    }
    subscribeReady() {
        return this.ready$.asObservable();
    }
    safeEmit(eventName, payload) {
        if (this.socket.connected) {
            this.socket.emit(eventName, payload);
        }
        else {
            this.emissionsQueue.push([eventName, payload]);
        }
    }
}
exports.BaseWebsocketService = BaseWebsocketService;
//# sourceMappingURL=ws.service.js.map