"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceHistoryLoaderService = void 0;
const ws_service_1 = require("../base/ws.service");
class InstanceHistoryLoaderService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super([{ alias: 'hl', address: address }]);
    }
    loadHistory(conf) {
        return new Promise((resolve, reject) => {
            this.subscribeEvent({
                payload: conf,
                socketAlias: 'hl',
                eventName: 'load-history',
                errorEventName: 'load-history-error',
                successEventName: 'load-history-success',
                successCallback: (history) => resolve(history),
                errorCallback: (error) => reject(error),
            });
        });
    }
}
exports.InstanceHistoryLoaderService = InstanceHistoryLoaderService;
//# sourceMappingURL=history-loader.service.js.map