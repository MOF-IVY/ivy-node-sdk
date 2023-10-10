import { Observable, filter, map, of, zip } from 'rxjs';
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

export interface ISDKConfigOpts {
  apiKey?: string;
  instanceUid?: string;

  gatewayWsApiAddress?: string;
  gatewayRestApiAddress?: string;

  instanceSSMWsApiAddress?: string | null;
  instanceTraderWsApiAddress?: string | null;
  instanceTraderRestApiAddress?: string | null;
  instanceLoggingCenterWsApiAddress?: string | null;
  instanceHistoryLoaderWsApiAddress?: string | null;
}

export class IvySDK {
  private readonly apiKey: string;
  private readonly gatewayWSApiAddress: string;
  private readonly gatewayRESTApiAddress: string;
  private readonly instanceSSMWSApiAddress: string | null;
  private readonly instanceTraderWsApiAddress: string | null;
  private readonly instanceTraderRestApiAddress: string | null;
  private readonly instanceLoggingCenterWSApiAddress: string | null;
  private readonly instanceHistoryLoaderWSApiAddress: string | null;

  private readonly SSM: InstanceSSMService | null;
  private readonly trader: InstanceTraderService | null;
  private readonly pumpdump: GatewayPumpDumpService;
  private readonly loggingCenter: InstanceLoggingCenterService | null;
  private readonly historyLoader: InstanceHistoryLoaderService | null;

  constructor(opts?: ISDKConfigOpts) {
    this.apiKey = opts?.apiKey ?? ENVConfig.scriptApiKey;

    this.gatewayWSApiAddress =
      opts?.gatewayWsApiAddress ?? 'ws://api.ivy.cryptobeam.net';

    this.gatewayRESTApiAddress =
      opts?.gatewayRestApiAddress ?? 'https://api.ivy.cryptobeam.net/api/v1/';

    this.instanceSSMWSApiAddress =
      opts?.instanceSSMWsApiAddress === null
        ? null
        : opts?.instanceSSMWsApiAddress ?? 'http://ivy-ssm:3000/ssm';

    this.instanceTraderWsApiAddress =
      opts?.instanceTraderWsApiAddress === null
        ? null
        : opts?.instanceTraderWsApiAddress ?? 'http://ivy-trader:3000/trader';

    this.instanceTraderRestApiAddress =
      opts?.instanceTraderRestApiAddress === null
        ? null
        : opts?.instanceTraderRestApiAddress ?? 'http://ivy-trader:3000';

    this.instanceLoggingCenterWSApiAddress =
      opts?.instanceLoggingCenterWsApiAddress === null
        ? null
        : opts?.instanceLoggingCenterWsApiAddress ??
          'ws://ivy-logging-center:3000/logging-center';

    this.instanceHistoryLoaderWSApiAddress =
      opts?.instanceHistoryLoaderWsApiAddress === null
        ? null
        : opts?.instanceHistoryLoaderWsApiAddress ??
          'ws://ivy-history-loader:3000/history-loader';

    console.log({
      gatewayWSApiAddress: this.gatewayWSApiAddress,
      gatewayRESTApiAddress: this.gatewayRESTApiAddress,
      instanceSSMWSApiAddress: this.instanceSSMWSApiAddress,
      instanceTraderWsApiAddress: this.instanceTraderWsApiAddress,
      instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
      instanceLoggingCenterWSApiAddress: this.instanceLoggingCenterWSApiAddress,
      instanceHistoryLoaderWSApiAddress: this.instanceHistoryLoaderWSApiAddress,
    });

    this.ensureRequiredParametersOrThrow();

    if (this.instanceSSMWSApiAddress)
      this.SSM = new InstanceSSMService(this.instanceSSMWSApiAddress);
    else this.SSM = null;

    this.pumpdump = new GatewayPumpDumpService(
      `${this.gatewayWSApiAddress}/pumpdump`,
    );

    if (this.instanceTraderRestApiAddress && this.instanceTraderWsApiAddress)
      this.trader = new InstanceTraderService(
        this.instanceTraderRestApiAddress,
        this.instanceTraderWsApiAddress,
        this.apiKey,
      );
    else this.trader = null;

    if (this.instanceLoggingCenterWSApiAddress)
      this.loggingCenter = new InstanceLoggingCenterService(
        this.instanceLoggingCenterWSApiAddress,
      );
    else this.loggingCenter = null;

    if (this.instanceHistoryLoaderWSApiAddress)
      this.historyLoader = new InstanceHistoryLoaderService(
        this.instanceHistoryLoaderWSApiAddress,
      );
    else this.historyLoader = null;
  }

  subscribeReady(): Observable<boolean> {
    return zip(
      this.pumpdump.subscribeReady(),
      this.instanceSSMWSApiAddress !== null
        ? this.SSM!.subscribeReady()
        : of(true),
      this.instanceTraderWsApiAddress !== null &&
        this.instanceTraderRestApiAddress !== null
        ? this.trader!.subscribeReady()
        : of(true),
      this.instanceHistoryLoaderWSApiAddress !== null
        ? this.historyLoader!.subscribeReady()
        : of(true),
      this.instanceLoggingCenterWSApiAddress !== null
        ? this.loggingCenter!.subscribeReady()
        : of(true),
    ).pipe(
      filter(
        ([ssm, trd, pd, hl, lc]) => !!ssm && !!trd && !!pd && !!hl && !!lc,
      ),
      map(() => true),
    );
  }

  clearLogs(keys: string[]) {
    throw new Error('Not implemented');
  }

  log(message: string | object, key: string, persist = false) {
    if (this.loggingCenter === null)
      throw new Error(`Logging center service disabled`);
    return this.loggingCenter.postLog(message, key, persist);
  }

  loadHistory(opts: IHistoryLoadRequestOpts) {
    if (this.historyLoader === null)
      throw new Error(`History loading service disabled`);
    return this.historyLoader.loadHistory(opts);
  }

  newOperation(opts: ITraderOpenOrderOpts) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.createNewOperation(opts);
  }

  closeOperation(opts: ITraderCloseOrderOpts) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.closeOperation(opts);
  }

  hasOperationOpen(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.hasOperationOpen(xm, symbol, type);
  }

  getClosedOperation(operationId: string) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.getClosedOperation(operationId);
  }

  enableIKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.enableIKStream();
  }

  disableIKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.disableIKStream();
  }

  enableFKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.enableFKStream();
  }

  disableFKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.disableFKStream();
  }

  enablePumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    return this.pumpdump.enablePumpStream(payload);
  }

  disablePumpStream(payload: { xm: ExchangesMarkets }) {
    return this.pumpdump.disablePumpStream(payload);
  }

  enableDumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    return this.pumpdump.enableDumpStream(payload);
  }

  disableDumpStream(payload: { xm: ExchangesMarkets }) {
    return this.pumpdump.disableDumpStream(payload);
  }

  enableActiveStatsUpdate() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.enableActiveStatsUpdates();
  }

  subscribeActiveStatsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeActiveStatsUpdates();
  }

  /**
   * Always active stream
   */
  subscribeOpenedOperationsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeOpenedOperationsUpdates();
  }

  /**
   * Always active stream
   */
  subscribeClosedOperationsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeClosedOperationsUpdates();
  }

  /**
   * Always active stream
   */
  subscribeLiquidatedOperationsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeLiquidatedOperationsUpdates();
  }

  /**
   * Always active stream
   */
  subscribeRejectedOrdersUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeRejectedOrdersUpdates();
  }

  /**
   * Stream active after activation request
   */
  subscribeIKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.subscribeIKStream();
  }

  /**
   * Stream active after activation request
   */
  subscribeFKStream() {
    if (this.SSM === null) throw new Error(`SSM service disabled`);
    return this.SSM.subscribeFKStream();
  }

  /**
   * Stream active after activation request
   */
  subscribePumpStream() {
    return this.pumpdump.subscribePumpStream();
  }

  /**
   * Stream active after activation request
   */
  subscribeDumpStream() {
    return this.pumpdump.subscribeDumpStream();
  }

  private ensureRequiredParametersOrThrow() {
    if (!this.apiKey)
      throw new Error(
        "API key is missing. Either pass it via config or via environment at 'IVY_SCRIPT_API_KEY'",
      );

    if (!this.gatewayWSApiAddress)
      throw new Error(
        'Gateway websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.gatewayRESTApiAddress)
      throw new Error(
        'Gateway REST address is missing. Do not specify it in the config to use the default one',
      );

    if (this.instanceSSMWSApiAddress !== null && !this.instanceSSMWSApiAddress)
      throw new Error(
        'SSM websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (
      this.instanceTraderWsApiAddress !== null &&
      !this.instanceTraderWsApiAddress
    )
      throw new Error(
        'Trader websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (
      this.instanceTraderRestApiAddress !== null &&
      !this.instanceTraderRestApiAddress
    )
      throw new Error(
        'Trader REST address is missing. Do not specify it in the config to use the default one',
      );

    if (
      this.instanceLoggingCenterWSApiAddress !== null &&
      !this.instanceLoggingCenterWSApiAddress
    )
      throw new Error(
        'Logging center websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (
      this.instanceHistoryLoaderWSApiAddress !== null &&
      !this.instanceHistoryLoaderWSApiAddress
    )
      throw new Error(
        'History loader websocket address is missing. Do not specify it in the config to use the default one',
      );
  }
}
