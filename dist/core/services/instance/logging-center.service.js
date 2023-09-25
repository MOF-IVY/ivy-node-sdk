"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceLoggingCenterService = void 0;
const ws_service_1 = require("../base/ws.service");
const log_model_1 = require("../../../models/logging-center/log.model");
const stored_log_model_1 = require("../../../models/logging-center/stored-log.model");
class InstanceLoggingCenterService extends ws_service_1.BaseWebsocketService {
    constructor(address, instanceUid) {
        super([{ address, alias: 'logs' }]);
        this.instanceUid = instanceUid;
    }
    postLog(message, key, persist) {
        const log = persist
            ? new stored_log_model_1.IvyStoredLog(message, key, this.instanceUid)
            : new log_model_1.IvyLog(message, key, this.instanceUid);
        this.emit('logs', 'post-log', log.toJSON());
    }
}
exports.InstanceLoggingCenterService = InstanceLoggingCenterService;
//# sourceMappingURL=logging-center.service.js.map