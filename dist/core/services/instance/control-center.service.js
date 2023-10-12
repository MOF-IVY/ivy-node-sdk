"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceControlCenterService = void 0;
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const ws_service_1 = require("../base/ws.service");
class InstanceControlCenterService extends ws_service_1.BaseWebsocketService {
    constructor(restAddress, wsAddress) {
        super(wsAddress);
        this.pauseCommands$ = new rxjs_1.Subject();
        this.resumeCommands$ = new rxjs_1.Subject();
        this.restartCommands$ = new rxjs_1.Subject();
        this.httpClient = axios_1.default.create({
            baseURL: restAddress,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        super
            .subscribeReady()
            .pipe((0, rxjs_1.filter)((ready) => !!ready), (0, rxjs_1.take)(1), (0, rxjs_1.tap)(() => {
            this.socket.on('restart-event', this.restartCmdEventHandler.bind(this));
            this.socket.on('pause-event', this.pauseCmdEventHandler.bind(this));
            this.socket.on('resume-event', this.resumeCmdEventHandler.bind(this));
        }))
            .subscribe();
    }
    subscribePauseCommands() {
        return this.pauseCommands$.asObservable();
    }
    subscribeResumeCommands() {
        return this.resumeCommands$.asObservable();
    }
    subscribeRestartCommands() {
        return this.restartCommands$.asObservable();
    }
    getScriptConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.httpClient.get(`config/script`);
            if (resp.status < 300 && resp.data.statusCode >= 300) {
                throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
            }
            if (resp.status >= 300) {
                throw new Error(`[${InstanceControlCenterService.name}] http error while trying to get script config: ${resp.statusText}`);
            }
            return resp.data.data;
        });
    }
    restartCmdEventHandler() {
        this.restartCommands$.next();
    }
    pauseCmdEventHandler() {
        this.pauseCommands$.next();
    }
    resumeCmdEventHandler() {
        this.resumeCommands$.next();
    }
}
exports.InstanceControlCenterService = InstanceControlCenterService;
//# sourceMappingURL=control-center.service.js.map