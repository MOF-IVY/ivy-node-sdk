import { ENVConfig } from './config/config/config.core';

import { ExchangesMarkets } from '../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../models/common/exchange-operation-type';

import { InstanceSSMService } from './services/instance/ssm.service';
import { InstanceTraderService } from './services/instance/trader.service';
import { GatewayPumpDumpService } from './services/gateway/pumpdump.service';
import { InstanceHistoryLoaderService } from './services/instance/history-loader.service';
import { InstanceLoggingCenterService } from './services/instance/logging-center.service';

import { ITraderOpenOrderOpts } from '../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../models/trader/close-order-config.model';
import { IHistoryLoadRequestOpts } from '../models/history-loader/history-load-request.model';
import { BehaviorSubject, Observable, filter, map, zip } from 'rxjs';

export interface ISDKConfigOpts {
  apiKey?: string;
  instanceUid?: string;

  gatewayWsApiAddress?: string;
  gatewayRestApiAddress?: string;

  instanceSSMWsApiAddress?: string;
  instanceTraderRestApiAddress?: string;
  instanceLoggingCenterWsApiAddress?: string;
  instanceHistoryLoaderWsApiAddress?: string;
}

export class IvySDK {
  private readonly apiKey: string;
  private readonly instanceUid: string;
  private readonly gatewayWSApiAddress: string;
  private readonly gatewayRESTApiAddress: string;
  private readonly instanceSSMWSApiAddress: string;
  private readonly instanceTraderRestApiAddress: string;
  private readonly instanceLoggingCenterWSApiAddress: string;
  private readonly instanceHistoryLoaderWSApiAddress: string;

  private readonly SSM: InstanceSSMService;
  private readonly trader: InstanceTraderService;
  private readonly pumpdump: GatewayPumpDumpService;
  private readonly loggingCenter: InstanceLoggingCenterService;
  private readonly historyLoader: InstanceHistoryLoaderService;

  constructor(opts?: ISDKConfigOpts) {
    this.apiKey = opts?.apiKey ?? ENVConfig.scriptApiKey;

    this.instanceUid = opts?.instanceUid ?? ENVConfig.scriptUid;

    this.gatewayWSApiAddress =
      opts?.gatewayWsApiAddress ?? 'ws://api.ivy.cryptobeam.net';

    this.gatewayRESTApiAddress =
      opts?.gatewayRestApiAddress ?? 'https://api.ivy.cryptobeam.net/api/v1/';

    this.instanceSSMWSApiAddress =
      opts?.instanceSSMWsApiAddress ?? 'http://ivy-ssm:3000/ssm';

    this.instanceTraderRestApiAddress =
      opts?.instanceTraderRestApiAddress ?? 'http://ivy-trader:3000';

    this.instanceLoggingCenterWSApiAddress =
      opts?.instanceLoggingCenterWsApiAddress ??
      'ws://ivy-logging-center:3000/logging-center';

    this.instanceHistoryLoaderWSApiAddress =
      opts?.instanceHistoryLoaderWsApiAddress ??
      'ws://ivy-history-loader:3000/history-loader';

    console.log({
      instanceUid: this.instanceUid,
      gatewayWSApiAddress: this.gatewayWSApiAddress,
      gatewayRESTApiAddress: this.gatewayRESTApiAddress,
      instanceSSMWSApiAddress: this.instanceSSMWSApiAddress,
      instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
      instanceLoggingCenterWSApiAddress: this.instanceLoggingCenterWSApiAddress,
      instanceHistoryLoaderWSApiAddress: this.instanceHistoryLoaderWSApiAddress,
    });

    this.ensureRequiredParametersOrThrow();

    this.SSM = new InstanceSSMService(this.instanceSSMWSApiAddress);
    this.pumpdump = new GatewayPumpDumpService(
      `${this.gatewayWSApiAddress}/pumpdump`,
    );
    this.trader = new InstanceTraderService(
      this.instanceTraderRestApiAddress,
      this.apiKey,
    );
    this.loggingCenter = new InstanceLoggingCenterService(
      this.instanceLoggingCenterWSApiAddress,
      this.instanceUid,
    );
    this.historyLoader = new InstanceHistoryLoaderService(
      this.instanceHistoryLoaderWSApiAddress,
    );
  }

  subscribeReady(): Observable<boolean> {
    return zip(
      this.historyLoader.subscribeReady(),
      this.loggingCenter.subscribeReady(),
      this.pumpdump.subscribeReady(),
      this.SSM.subscribeReady(),
    ).pipe(
      filter(([hl, lc, pd, ssm]) => !!hl && !!lc && !!pd && !!ssm),
      map(() => true),
    );
  }

  clearLogs(keys: string[]) {
    throw new Error('Not implemented');
  }

  log(message: string | object, key: string, persist = false) {
    return this.loggingCenter.postLog(message, key, persist);
  }

  loadHistory(opts: IHistoryLoadRequestOpts) {
    return this.historyLoader.loadHistory(opts);
  }

  newOperation(opts: ITraderOpenOrderOpts) {
    return this.trader.createNewOperation(opts);
  }

  closeOperation(opts: ITraderCloseOrderOpts) {
    return this.trader.closeOperation(opts);
  }

  hasOperationOpen(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ) {
    return this.trader.hasOperationOpen(xm, symbol, type);
  }

  getClosedOperation(operationId: string) {
    return this.trader.getClosedOperation(operationId);
  }

  enableIKStream() {
    return this.SSM.enableIKStream();
  }

  disableIKStream() {
    return this.SSM.disableIKStream();
  }

  subscribeIKStream() {
    return this.SSM.subscribeIKStream();
  }

  enableFKStream() {
    return this.SSM.enableFKStream();
  }

  disableFKStream() {
    return this.SSM.disableFKStream();
  }

  subscribeFKStream() {
    return this.SSM.subscribeFKStream();
  }

  enablePumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    return this.pumpdump.enablePumpStream(payload);
  }

  disablePumpStream(payload: { xm: ExchangesMarkets }) {
    return this.pumpdump.disablePumpStream(payload);
  }

  subscribePumpStream() {
    return this.pumpdump.subscribePumpStream();
  }

  enableDumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    return this.pumpdump.enableDumpStream(payload);
  }

  disableDumpStream(payload: { xm: ExchangesMarkets }) {
    return this.pumpdump.disableDumpStream(payload);
  }

  subscribeDumpStream() {
    return this.pumpdump.subscribeDumpStream();
  }

  private ensureRequiredParametersOrThrow() {
    if (!this.apiKey)
      throw new Error(
        "API key is missing. Either pass it via config or via environment at 'IVY_SCRIPT_API_KEY'",
      );

    if (!this.instanceUid)
      throw new Error(
        "Script uid is missing. Either pass it via config or via environment at 'IVY_SCRIPT_UID'",
      );

    if (!this.gatewayWSApiAddress)
      throw new Error(
        'Gateway websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.gatewayRESTApiAddress)
      throw new Error(
        'Gateway REST address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceSSMWSApiAddress)
      throw new Error(
        'SSM websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceTraderRestApiAddress)
      throw new Error(
        'Trader REST address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceLoggingCenterWSApiAddress)
      throw new Error(
        'Logging center websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceHistoryLoaderWSApiAddress)
      throw new Error(
        'History loader websocket address is missing. Do not specify it in the config to use the default one',
      );
  }
}
