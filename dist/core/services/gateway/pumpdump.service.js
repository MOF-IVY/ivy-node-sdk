"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPumpDumpService = void 0;
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class GatewayPumpDumpService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super(address);
        this.pumpStream$ = new rxjs_1.Subject();
        this.dumpStream$ = new rxjs_1.Subject();
    }
    enablePumpStream(payload) {
        return new Promise((resolve) => {
            this.socket.on('pump-event', this.pumpStreamEventHandler.bind(this));
            this.socket.once('subscribe-pump-stream-error', (error) => resolve(error));
            this.socket.once('subscribe-pump-stream-success', () => resolve());
            this.safeEmitWithReconnect('subscribe-pump-stream', payload);
        });
    }
    disablePumpStream(payload) {
        return new Promise((resolve) => {
            this.socket.off('pump-event', this.pumpStreamEventHandler.bind(this));
            this.socket.once('unsubscribe-pump-stream-error', (error) => resolve(error));
            this.socket.once('unsubscribe-pump-stream-success', () => resolve());
            this.safeEmit('unsubscribe-pump-stream', payload);
            this.pumpStream$.complete();
            this.pumpStream$ = new rxjs_1.Subject();
        });
    }
    enableDumpStream(payload) {
        return new Promise((resolve) => {
            this.socket.on('dump-event', this.dumpStreamEventHandler.bind(this));
            this.socket.once('subscribe-dump-stream-error', (error) => resolve(error));
            this.socket.once('subscribe-dump-stream-success', () => resolve());
            this.safeEmitWithReconnect('subscribe-dump-stream', payload);
        });
    }
    disableDumpStream(payload) {
        return new Promise((resolve) => {
            this.socket.off('dump-event', this.dumpStreamEventHandler.bind(this));
            this.socket.once('unsubscribe-dump-stream-error', (error) => resolve(error));
            this.socket.once('unsubscribe-dump-stream-success', () => resolve());
            this.safeEmit('unsubscribe-dump-stream', payload);
            this.dumpStream$.complete();
            this.dumpStream$ = new rxjs_1.Subject();
        });
    }
    subscribePumpStream() {
        return this.pumpStream$.asObservable();
    }
    subscribeDumpStream() {
        return this.dumpStream$.asObservable();
    }
    pumpStreamEventHandler(data) {
        this.pumpStream$.next(data);
    }
    dumpStreamEventHandler(data) {
        this.dumpStream$.next(data);
    }
}
exports.GatewayPumpDumpService = GatewayPumpDumpService;
//# sourceMappingURL=pumpdump.service.js.map