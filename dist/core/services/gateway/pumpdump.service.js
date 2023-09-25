"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPumpDumpService = void 0;
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class GatewayPumpDumpService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super([{ address, alias: 'pd' }]);
        this.pumpStream$ = new rxjs_1.Subject();
        this.dumpStream$ = new rxjs_1.Subject();
    }
    /**
     * Always catch
     */
    enablePumpStream(payload) {
        this.subscribeEvent({
            payload,
            socketAlias: 'pd',
            successEventName: 'pump-update',
            eventName: 'subscribe-pump-stream',
            successCallback: this.pumpStreamEventHandler.bind(this),
            errorEventName: 'subscribe-pump-stream-error',
            errorCallback: (data) => {
                throw new Error(`Pump stream enable failed: ${(data === null || data === void 0 ? void 0 : data.error) || data}`);
            },
        });
    }
    /**
     * Always catch
     */
    enableDumpStream(payload) {
        this.subscribeEvent({
            payload,
            socketAlias: 'pd',
            successEventName: 'dump-update',
            eventName: 'subscribe-dump-stream',
            successCallback: this.dumpStreamEventHandler.bind(this),
            errorEventName: 'subscribe-dump-stream-error',
            errorCallback: (data) => {
                throw new Error(`Dump stream enable failed: ${(data === null || data === void 0 ? void 0 : data.error) || data}`);
            },
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