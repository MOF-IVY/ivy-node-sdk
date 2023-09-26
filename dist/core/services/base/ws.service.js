"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketService = void 0;
const rxjs_1 = require("rxjs");
const socket_io_client_1 = require("socket.io-client");
class BaseWebsocketService {
    constructor(address) {
        this.ready$ = new rxjs_1.Subject();
        this.emissionsQueue = [];
        this.socket = (0, socket_io_client_1.io)(address);
        this.socket.on('welcome', () => {
            this.ready$.next(true);
            this.emissionsQueue.forEach(([event, payload], idx) => {
                this.socket.emit(event, payload);
                this.emissionsQueue = this.emissionsQueue.filter(([, _idx]) => idx !== idx);
            });
        });
        this.socket.on('connect', () => this.ready$.next(false));
        this.socket.on('disconnect', () => this.ready$.next(false));
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