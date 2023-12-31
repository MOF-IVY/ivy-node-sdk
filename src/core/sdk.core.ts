import { Observable, filter, map, of, zip } from 'rxjs';
import { ENVConfig } from './config/config/config.core';

import { ExchangesMarkets } from '../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../models/common/exchange-operation-type';

import { InstanceSSMService } from './services/instance/ssm.service';
import { InstanceTraderService } from './services/instance/trader.service';
import { GatewayPumpDumpService } from './services/gateway/pumpdump.service';
import { InstanceHistoryLoaderService } from './services/instance/history-loader.service';
import { InstanceLoggingCenterService } from './services/instance/logging-center.service';

import { ITraderOpenOrderConfig } from '../models/trader/open-order-config.model';
import { ITraderCloseOrderConfig } from '../models/trader/close-order-config.model';
import { IHistoryLoadRequestOpts } from '../models/history-loader/history-load-request.model';
import { InstanceControlCenterService } from './services/instance/control-center.service';

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
  instanceControlCenterWsApiAddress?: string | null;
  instanceControlCenterRestApiAddress?: string | null;
}

export class IvySDK<ScriptConfigType = Record<string, any>> {
  private readonly apiKey: string;
  private readonly gatewayWsApiAddress: string;
  private readonly gatewayRestApiAddress: string;
  private readonly instanceSSMWsApiAddress: string | null;
  private readonly instanceTraderWsApiAddress: string | null;
  private readonly instanceControlCenterWsApiAddress: string;
  private readonly instanceControlCenterRestApiAddress: string;
  private readonly instanceTraderRestApiAddress: string | null;
  private readonly instanceLoggingCenterWsApiAddress: string | null;
  private readonly instanceHistoryLoaderWsApiAddress: string | null;

  private readonly SSM: InstanceSSMService | null;
  private readonly trader: InstanceTraderService | null;
  private readonly pumpdump: GatewayPumpDumpService;
  private readonly loggingCenter: InstanceLoggingCenterService | null;
  private readonly historyLoader: InstanceHistoryLoaderService | null;
  private readonly controlCenter: InstanceControlCenterService<ScriptConfigType>;

  constructor(opts?: ISDKConfigOpts) {
    this.apiKey = opts?.apiKey ?? ENVConfig.scriptApiKey;

    this.gatewayWsApiAddress =
      opts?.gatewayWsApiAddress ?? 'ws://api.ivy.cryptobeam.net';

    this.gatewayRestApiAddress =
      opts?.gatewayRestApiAddress ?? 'https://api.ivy.cryptobeam.net/api/v1/';

    this.instanceSSMWsApiAddress =
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

    this.instanceLoggingCenterWsApiAddress =
      opts?.instanceLoggingCenterWsApiAddress === null
        ? null
        : opts?.instanceLoggingCenterWsApiAddress ??
          'ws://ivy-logging-center:3000/logging-center';

    this.instanceControlCenterWsApiAddress =
      opts?.instanceControlCenterWsApiAddress ??
      'ws://ivy-control-center:3000/control-center';

    this.instanceControlCenterRestApiAddress =
      opts?.instanceControlCenterRestApiAddress ??
      'http://ivy-control-center:3000/control-center';

    this.instanceHistoryLoaderWsApiAddress =
      opts?.instanceHistoryLoaderWsApiAddress === null
        ? null
        : opts?.instanceHistoryLoaderWsApiAddress ??
          'ws://ivy-history-loader:3000/history-loader';

    console.log({
      instanceControlCenterRestApiAddress:
        this.instanceControlCenterRestApiAddress,
      gatewayWsApiAddress: this.gatewayWsApiAddress,
      gatewayRestApiAddress: this.gatewayRestApiAddress,
      instanceSSMWsApiAddress: this.instanceSSMWsApiAddress,
      instanceTraderWsApiAddress: this.instanceTraderWsApiAddress,
      instanceTraderRestApiAddress: this.instanceTraderRestApiAddress,
      instanceLoggingCenterWsApiAddress: this.instanceLoggingCenterWsApiAddress,
      instanceControlCenterWsApiAddress: this.instanceControlCenterWsApiAddress,
      instanceHistoryLoaderWsApiAddress: this.instanceHistoryLoaderWsApiAddress,
    });

    this.ensureRequiredParametersOrThrow();

    if (this.instanceSSMWsApiAddress)
      this.SSM = new InstanceSSMService(this.instanceSSMWsApiAddress);
    else this.SSM = null;

    this.pumpdump = new GatewayPumpDumpService(
      `${this.gatewayWsApiAddress}/pumpdump`,
    );

    this.controlCenter = new InstanceControlCenterService<ScriptConfigType>(
      this.instanceControlCenterRestApiAddress,
      this.instanceControlCenterWsApiAddress,
    );

    if (this.instanceTraderRestApiAddress && this.instanceTraderWsApiAddress)
      this.trader = new InstanceTraderService(
        this.instanceTraderRestApiAddress,
        this.instanceTraderWsApiAddress,
        this.apiKey,
      );
    else this.trader = null;

    if (this.instanceLoggingCenterWsApiAddress)
      this.loggingCenter = new InstanceLoggingCenterService(
        this.instanceLoggingCenterWsApiAddress,
      );
    else this.loggingCenter = null;

    if (this.instanceHistoryLoaderWsApiAddress)
      this.historyLoader = new InstanceHistoryLoaderService(
        this.instanceHistoryLoaderWsApiAddress,
      );
    else this.historyLoader = null;
  }

  subscribeReady(): Observable<boolean> {
    return zip(
      this.pumpdump.subscribeReady(),
      this.controlCenter.subscribeReady(),
      this.instanceSSMWsApiAddress !== null
        ? this.SSM!.subscribeReady()
        : of(true),
      this.instanceTraderWsApiAddress !== null &&
        this.instanceTraderRestApiAddress !== null
        ? this.trader!.subscribeReady()
        : of(true),
      this.instanceHistoryLoaderWsApiAddress !== null
        ? this.historyLoader!.subscribeReady()
        : of(true),
      this.instanceLoggingCenterWsApiAddress !== null
        ? this.loggingCenter!.subscribeReady()
        : of(true),
    ).pipe(
      filter(
        ([
          pumpdump,
          controlCenter,
          SSM,
          trader,
          historyLoader,
          loggingCenter,
        ]) =>
          !!pumpdump &&
          !!controlCenter &&
          !!SSM &&
          !!trader &&
          !!historyLoader &&
          !!loggingCenter,
      ),
      map(() => true),
    );
  }

  clearLogs(keys: string[]) {
    throw new Error('Not implemented');
  }

  get traderReady() {
    if (!this.trader) return Promise.resolve(false);
    return this.trader?.isReady();
  }

  log(
    message: string | object,
    key: string,
    persist = false,
    logToConsole = true,
  ) {
    if (this.loggingCenter === null)
      throw new Error(`Logging center service disabled`);
    return this.loggingCenter.postLog(message, key, persist, logToConsole);
  }

  initConfig(config: ScriptConfigType): Promise<ScriptConfigType> {
    return this.controlCenter.initScriptConfig(config);
  }

  getConfig(): Promise<ScriptConfigType> {
    return this.controlCenter.getScriptConfig();
  }

  loadHistory(opts: IHistoryLoadRequestOpts) {
    if (this.historyLoader === null)
      throw new Error(`History loading service disabled`);
    return this.historyLoader.loadHistory(opts);
  }

  newOperation(opts: ITraderOpenOrderConfig) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.createNewOperation(opts);
  }

  closeOperation(opts: ITraderCloseOrderConfig) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.closeOperation(opts);
  }

  cancelOrder(operationId: string, orderType: 'open' | 'close') {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return orderType === 'open'
      ? this.trader.cancelOpenOrder(operationId)
      : this.trader.cancelCloseOrder(operationId);
  }

  getActiveOperationsSymbols() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.getActiveOperationsSymbols();
  }

  hasActiveOperation(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ) {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.hasActiveOperation(xm, symbol, type);
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

  enableActiveOperationsStatsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.enableActiveOperationsStatsUpdates();
  }

  /**
   * Always active stream
   *
   * Once you've received this event, you should reset your
   * script state.
   *
   * Do not worry about closing operations or cancelling
   * orders, since this has been already done by the trader
   * and once you receive this event, is safe to forcefully
   * reset the state to its initial value
   */
  subscribeRestartCommands() {
    return this.controlCenter.subscribeRestartCommands();
  }

  /**
   * Always active stream
   *
   * Once you've received this event, you must
   * immediately stop opening orders. But you
   * should continue tracking opened ones.
   */
  subscribePauseCommands() {
    return this.controlCenter.subscribePauseCommands();
  }

  /**
   * Always active stream
   *
   * Once you've received this event, you can
   * go back to opening orders as your script
   * logic would normally do.
   */
  subscribeResumeCommands() {
    return this.controlCenter.subscribeResumeCommands();
  }

  /**
   * Always active stream
   */
  subscribeScriptConfigChanges() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.controlCenter.subscribeScriptConfigChanges();
  }

  /**
   * Always active stream
   */
  subscribeNewActiveOperationsEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeNewActiveOperationsEvents();
  }

  /**
   * Always active stream
   */
  subscribeOperationsOpenErrorsEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeOperationsOpenErrorsEvents();
  }

  /**
   * Always active stream
   */
  subscribeOperationsCloseErrorsEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeOperationsCloseErrorsEvents();
  }

  /**
   * Always active stream
   */
  subscribeClosedOperationsEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeClosedOperationsEvents();
  }

  /**
   * Always active stream
   */
  subscribeLiquidatedOperationsEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeLiquidatedOperationsEvents();
  }

  /**
   * Always active stream
   */
  subscribeRejectedOrdersEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeRejectedOrdersEvents();
  }

  /**
   * Always active stream
   */
  subscribeCancelledOpenOrdersEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeCancelledOpenOrdersEvents();
  }

  /**
   * Always active stream
   */
  subscribeCancelledCloseOrdersEvents() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeCancelledCloseOrdersEvents();
  }

  /**
   * Stream active after activation request
   */
  subscribeActiveOperationsStatsUpdates() {
    if (this.trader === null) throw new Error(`Trader service disabled`);
    return this.trader.subscribeActiveOperationsStatsUpdates();
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

    if (!this.gatewayWsApiAddress)
      throw new Error(
        'Gateway websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.gatewayRestApiAddress)
      throw new Error(
        'Gateway REST address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceControlCenterWsApiAddress)
      throw new Error(
        'Control center websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (!this.instanceControlCenterRestApiAddress)
      throw new Error(
        'Control center REST address is missing. Do not specify it in the config to use the default one',
      );

    if (this.instanceSSMWsApiAddress !== null && !this.instanceSSMWsApiAddress)
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
      this.instanceLoggingCenterWsApiAddress !== null &&
      !this.instanceLoggingCenterWsApiAddress
    )
      throw new Error(
        'Logging center websocket address is missing. Do not specify it in the config to use the default one',
      );

    if (
      this.instanceHistoryLoaderWsApiAddress !== null &&
      !this.instanceHistoryLoaderWsApiAddress
    )
      throw new Error(
        'History loader websocket address is missing. Do not specify it in the config to use the default one',
      );
  }
}
