"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvyLog = void 0;
class IvyLog {
    constructor(log, key) {
        if (typeof log === 'function')
            throw new Error('IvyLog does not support functions as log items');
        this.key = key;
        this.persist = false;
        this.time = Date.now();
        this.jsonParsable = typeof log === 'object';
        this.log = this.jsonParsable ? JSON.stringify(log) : log;
    }
    toJSON() {
        return {
            key: this.key,
            log: this.log,
            time: this.time,
            persist: this.persist,
            jsonParsable: this.jsonParsable,
        };
    }
}
exports.IvyLog = IvyLog;
//# sourceMappingURL=log.model.js.map