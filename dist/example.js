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
sdk
    .newOperation({
    exchangeMarket: 'bybit_linear',
    operationType: 'long',
    orderType: 'Market',
    symbol: 'BTC/USDT',
    leverage: 1,
    leverageEntryPercent: 10,
})
    .then((result) => {
    setTimeout(() => {
        sdk.closeOperation({
            exchangeMarket: 'bybit_linear',
            operationType: 'long',
            orderType: 'Market',
            symbol: 'BTC/USDT',
        });
    }, 5000);
})
    .catch((e) => {
    debugger;
});
//# sourceMappingURL=example.js.map