"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceLoggingCenterService = void 0;
const ws_service_1 = require("../base/ws.service");
const log_model_1 = require("../../../models/logging-center/log.model");
const stored_log_model_1 = require("../../../models/logging-center/stored-log.model");
const rxjs_1 = require("rxjs");
class InstanceLoggingCenterService extends ws_service_1.BaseWebsocketService {
    constructor(address, instanceUid) {
        super(address);
        this.instanceUid = instanceUid;
        this.logsQueue$ = new rxjs_1.Subject();
        this.logsQueue$
            .pipe((0, rxjs_1.delay)(1000), (0, rxjs_1.tap)(({ message }) => console.log(message)), (0, rxjs_1.tap)(({ persist, message, key }) => {
            const logObject = persist
                ? new stored_log_model_1.IvyStoredLog(message, key, this.instanceUid)
                : new log_model_1.IvyLog(message, key, this.instanceUid);
            this.socket.once('post-log-error', (error) => console.error(`Error posting log: ${error.error}`));
            this.socket.emit('post-log', logObject.toJSON());
        }))
            .subscribe();
    }
    postLog(message, key, persist) {
        this.logsQueue$.next({ message, key, persist });
    }
}
exports.InstanceLoggingCenterService = InstanceLoggingCenterService;
//# sourceMappingURL=logging-center.service.js.map