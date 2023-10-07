import axios, { Axios } from 'axios';

import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../../../models/common/exchange-operation-type';

import {
  IOperationStats,
  ITraderOperation,
} from '../../../models/trader/operation.model';
import { IBaseResponse } from '../../../models/common/base-response.model';
import { ITraderOpenOrderOpts } from '../../../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../../../models/trader/close-order-config.model';
import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
import { Observable, Subject } from 'rxjs';

export interface IActiveStatsUpdate {
  sym: string;
  xm: ExchangesMarkets;
  stats: IOperationStats;
}

export class InstanceTraderService extends BaseWebsocketService {
  private readonly httpClient: Axios;
  private readonly closedOpsUpdates$ = new Subject<ITraderOperation>();
  private readonly activeStatsUpdates$ = new Subject<IActiveStatsUpdate>();

  constructor(restAddress: string, wsAddress: string, apiKey: string) {
    super(wsAddress);
    this.httpClient = axios.create({
      baseURL: restAddress,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  enableActiveStatsUpdates(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on(
        'active-stats-event',
        this.activeStatsEventHandler.bind(this),
      );
      this.socket.once(
        'subscribe-active-stats-update-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('subscribe-active-stats-update-success', () =>
        resolve(),
      );
      this.safeEmitWithReconnect('subscribe-active-stats-update');
    });
  }

  enableClosedOperationsUpdates(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on(
        'closed-operation-event',
        this.closedOpEventHandler.bind(this),
      );
      this.socket.once(
        'subscribe-closed-operations-updates-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('subscribe-closed-operations-updates-success', () =>
        resolve(),
      );
      this.safeEmitWithReconnect('subscribe-closed-operations-updates');
    });
  }

  subscribeActiveStatsUpdates(): Observable<IActiveStatsUpdate> {
    return this.activeStatsUpdates$.asObservable();
  }

  subscribeClosedOperationsUpdates(): Observable<ITraderOperation> {
    return this.closedOpsUpdates$.asObservable();
  }

  async hasOperationOpen(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ): Promise<boolean> {
    const resp = await this.httpClient.get<IBaseResponse<boolean>>(
      `trader/operation/open/${xm}/${symbol}/${type}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async getClosedOperation(operationId: string): Promise<ITraderOperation> {
    const resp = await this.httpClient.get<IBaseResponse<ITraderOperation>>(
      `trader/operation/closed/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async createNewOperation(
    opts: ITraderOpenOrderOpts,
  ): Promise<ITraderOperation> {
    const resp = await this.httpClient.post<IBaseResponse<ITraderOperation>>(
      'trader/operation/new',
      opts,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to create a new operation: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async closeOperation(opts: ITraderCloseOrderOpts): Promise<ITraderOperation> {
    const resp = await this.httpClient.post<IBaseResponse<ITraderOperation>>(
      'trader/operation/close',
      opts,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to close an operation: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async cancelOpenOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/open-order/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to cancel an operation open order: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async cancelCloseOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/close-order/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to cancel an operation close order: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  private closedOpEventHandler(data: ITraderOperation) {
    this.closedOpsUpdates$.next(data);
  }

  private activeStatsEventHandler(data: {
    sym: string;
    xm: ExchangesMarkets;
    stats: IOperationStats;
  }) {
    this.activeStatsUpdates$.next(data);
  }
}
