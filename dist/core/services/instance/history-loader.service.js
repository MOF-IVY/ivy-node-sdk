"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceHistoryLoaderService = void 0;
const ws_service_1 = require("../base/ws.service");
class InstanceHistoryLoaderService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super(address);
    }
    loadHistory(conf) {
        return new Promise((resolve, reject) => {
            this.socket.once('load-history-success', (data) => resolve(data));
            this.socket.once('load-history-error', (error) => reject(error));
            this.socket.emit('load-history', conf);
        });
    }
}
exports.InstanceHistoryLoaderService = InstanceHistoryLoaderService;
//# sourceMappingURL=history-loader.service.js.map