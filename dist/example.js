"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const config = {
    gatewayRESTApiAddress: 'http://localhost:3005/api/v1/',
    gatewayWSApiAddress: 'ws://localhost:3005',
    instanceHistoryLoaderWSApiAddress: 'ws://localhost:3000/history-loader',
    instanceLoggingCenterWSApiAddress: 'ws://localhost:3003/logging-center',
    instanceSSMWSApiAddress: 'ws://localhost:3001/ssm',
    instanceTraderRestApiAddress: 'http://localhost:3002/',
};
const sdk = new main_1.IvySDK(config);
//# sourceMappingURL=example.js.map