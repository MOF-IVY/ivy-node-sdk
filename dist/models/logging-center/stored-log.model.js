"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvyStoredLog = void 0;
const log_model_1 = require("./log.model");
class IvyStoredLog extends log_model_1.IvyLog {
    constructor(log, key, instanceUid) {
        super(log, key, instanceUid);
        this.persist = true;
    }
}
exports.IvyStoredLog = IvyStoredLog;
//# sourceMappingURL=stored-log.model.js.map