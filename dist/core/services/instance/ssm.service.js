"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceSSMService = void 0;
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class InstanceSSMService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super([{ address, alias: 'ssm' }]);
        this.IKStream$ = new rxjs_1.Subject();
        this.FKStream$ = new rxjs_1.Subject();
    }
    enableIKStream() {
        this.subscribeEvent({
            socketAlias: 'ssm',
            successEventName: 'ik-event',
            eventName: 'subscribe-ik-stream',
            successCallback: this.IKStreamEventHandler.bind(this),
            errorEventName: 'subscribe-ik-stream-error',
            errorCallback: (data) => {
                throw new Error(`IK stream enable failed: ${(data === null || data === void 0 ? void 0 : data.error) || data}`);
            },
        });
    }
    enableFKStream() {
        this.subscribeEvent({
            socketAlias: 'ssm',
            successEventName: 'fk-event',
            eventName: 'subscribe-fk-stream',
            successCallback: this.FKStreamEventHandler.bind(this),
            errorEventName: 'subscribe-fk-stream-error',
            errorCallback: (data) => {
                throw new Error(`IK stream enable failed: ${(data === null || data === void 0 ? void 0 : data.error) || data}`);
            },
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