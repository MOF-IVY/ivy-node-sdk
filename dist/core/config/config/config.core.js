"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVConfig = void 0;
const process = __importStar(require("process"));
const config_enum_1 = require("./config.enum");
class ENVConfig {
    static get verboseMode() {
        return true || this.getConfig(config_enum_1.ENVConfigs.verbose) === 'true';
    }
    static get scriptUid() {
        this.ensureConfigExistenceOrThrow(config_enum_1.ENVConfigs.scriptUid);
        return this.getConfig(config_enum_1.ENVConfigs.scriptUid);
    }
    static get scriptApiKey() {
        this.ensureConfigExistenceOrThrow(config_enum_1.ENVConfigs.scriptApiKey);
        return this.getConfig(config_enum_1.ENVConfigs.scriptApiKey);
    }
    static get scriptPersistancePath() {
        this.ensureConfigExistenceOrThrow(config_enum_1.ENVConfigs.scriptPersistancePath);
        return this.getConfig(config_enum_1.ENVConfigs.scriptPersistancePath);
    }
    static ensureConfigExistenceOrThrow(config) {
        if (!process.env[config])
            throw new Error(`Missing env config ${config}. Please provide it`);
    }
    static getConfig(config) {
        var _a;
        return (_a = process.env[config]) !== null && _a !== void 0 ? _a : '';
    }
}
exports.ENVConfig = ENVConfig;
//# sourceMappingURL=config.core.js.map