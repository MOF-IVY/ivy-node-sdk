"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceLoggingCenterService = void 0;
const ws_service_1 = require("../base/ws.service");
const log_model_1 = require("../../../models/logging-center/log.model");
const stored_log_model_1 = require("../../../models/logging-center/stored-log.model");
class InstanceLoggingCenterService extends ws_service_1.BaseWebsocketService {
    constructor(address) {
        super(address);
    }
    postLog(message, key, persist) {
        const logObject = persist
            ? new stored_log_model_1.IvyStoredLog(message, key)
            : new log_model_1.IvyLog(message, key);
        this.socket.once('post-log-error', (error) => console.error(`Error posting log: ${error.error}`));
        this.socket.emit('post-log', logObject.toJSON());
        console.log(logObject.key, logObject.log);
    }
}
exports.InstanceLoggingCenterService = InstanceLoggingCenterService;
//# sourceMappingURL=logging-center.service.js.map