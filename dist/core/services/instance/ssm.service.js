"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceSSMService = void 0;
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class InstanceSSMService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super(address);
        this.IKStream$ = new rxjs_1.Subject();
        this.FKStream$ = new rxjs_1.Subject();
    }
    enableIKStream() {
        return new Promise((resolve) => {
            this.socket.on('ik-event', this.IKStreamEventHandler.bind(this));
            this.socket.once('subscribe-ik-stream-error', (error) => resolve(error));
            this.socket.once('subscribe-ik-stream-success', () => resolve());
            this.safeEmit('subscribe-ik-stream');
        });
    }
    disableIKStream() {
        return new Promise((resolve) => {
            this.socket.off('ik-event', this.IKStreamEventHandler.bind(this));
            this.socket.once('unsubscribe-ik-stream-error', (error) => resolve(error));
            this.socket.once('unsubscribe-ik-stream-success', () => resolve());
            this.safeEmit('unsubscribe-ik-stream');
            this.IKStream$.complete();
            this.IKStream$ = new rxjs_1.Subject();
        });
    }
    enableFKStream() {
        return new Promise((resolve) => {
            this.socket.on('fk-event', this.FKStreamEventHandler.bind(this));
            this.socket.once('subscribe-fk-stream-error', (error) => resolve(error));
            this.socket.once('subscribe-fk-stream-success', () => resolve());
            this.safeEmit('subscribe-fk-stream');
        });
    }
    disableFKStream() {
        return new Promise((resolve) => {
            this.socket.off('fk-event', this.FKStreamEventHandler.bind(this));
            this.socket.once('unsubscribe-fk-stream-error', (error) => resolve(error));
            this.socket.once('unsubscribe-fk-stream-success', () => resolve());
            this.safeEmit('unsubscribe-fk-stream');
            this.FKStream$.complete();
            this.FKStream$ = new rxjs_1.Subject();
        });
    }
    subscribeIKStream() {
        return this.IKStream$.asObservable();
    }
    subscribeFKStream() {
        return this.FKStream$.asObservable();
    }
    IKStreamEventHandler(data) {
        this.IKStream$.next(data);
    }
    FKStreamEventHandler(data) {
        this.FKStream$.next(data);
    }
}
exports.InstanceSSMService = InstanceSSMService;
//# sourceMappingURL=ssm.service.js.map