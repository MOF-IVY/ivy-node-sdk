import { tap } from 'rxjs';
import { ISDKConfigOpts, IvySDK } from './main';

const config: ISDKConfigOpts = {
  gatewayRESTApiAddress: 'http://localhost:3005/api/v1/',
  gatewayWSApiAddress: 'ws://localhost:3005',
  instanceHistoryLoaderWSApiAddress: 'ws://localhost:3000/history-loader',
  instanceLoggingCenterWSApiAddress: 'ws://localhost:3003/logging-center',
  instanceSSMWSApiAddress: 'ws://localhost:3001/ssm',
  instanceTraderRestApiAddress: 'http://localhost:3002/',
};

const sdk = new IvySDK(config);
