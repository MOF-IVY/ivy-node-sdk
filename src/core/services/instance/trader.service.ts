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
import { Observable, Subject, filter, take, tap } from 'rxjs';

export interface IActiveStatsUpdate {
  sym: string;
  xm: ExchangesMarkets;
  stats: IOperationStats;
}

export class InstanceTraderService extends BaseWebsocketService {
  private readonly httpClient: Axios;

  private readonly openedOpsUpdates$ = new Subject<ITraderOperation>();
  private readonly closedOpsUpdates$ = new Subject<ITraderOperation>();
  private readonly liquidatedOpsUpdates$ = new Subject<ITraderOperation>();
  private readonly operationsOpenErrors$ = new Subject<ITraderOperation>();
  private readonly operationsCloseErrors$ = new Subject<ITraderOperation>();
  private readonly rejectedOrdersUpdates$ = new Subject<ITraderOperation>();
  private readonly cancelledOrdersUpdates$ = new Subject<ITraderOperation>();

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

    super
      .subscribeReady()
      .pipe(
        filter((ready) => !!ready),
        take(1),
        tap(() => {
          this.socket.on(
            'closed-operation-event',
            this.closedOpEventHandler.bind(this),
          );
          this.socket.on(
            'opened-operation-event',
            this.openedOpEventHandler.bind(this),
          );
          this.socket.on(
            'liquidation-event',
            this.liquidatedOpEventHandler.bind(this),
          );
          this.socket.on(
            'cancelled-order-event',
            this.cancelledOrdersEventHandler.bind(this),
          );
          this.socket.on(
            'rejected-order-event',
            this.rejectedOrdersEventHandler.bind(this),
          );
          this.socket.on(
            'operation-open-error-event',
            this.operationOpenErrorEventHandler.bind(this),
          );
          this.socket.on(
            'operation-close-error-event',
            this.operationCloseErrorEventHandler.bind(this),
          );
        }),
      )
      .subscribe();
  }

  enableActiveStatsUpdates(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on(
        'active-operation-stats-event',
        this.activeStatsEventHandler.bind(this),
      );
      this.socket.once(
        'subscribe-active-operation-stats-update-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('subscribe-active-operation-stats-update-success', () =>
        resolve(),
      );
      this.safeEmitWithReconnect('subscribe-active-operation-stats-update');
    });
  }

  subscribeActiveStatsUpdates(): Observable<IActiveStatsUpdate> {
    return this.activeStatsUpdates$.asObservable();
  }

  subscribeOpenedOperationsUpdates(): Observable<ITraderOperation> {
    return this.openedOpsUpdates$.asObservable();
  }

  subscribeClosedOperationsUpdates(): Observable<ITraderOperation> {
    return this.closedOpsUpdates$.asObservable();
  }

  subscribeLiquidatedOperationsUpdates(): Observable<ITraderOperation> {
    return this.liquidatedOpsUpdates$.asObservable();
  }

  subscribeCancelledOrdersUpdates(): Observable<ITraderOperation> {
    return this.cancelledOrdersUpdates$.asObservable();
  }

  subscribeRejectedOrdersUpdates(): Observable<ITraderOperation> {
    return this.rejectedOrdersUpdates$.asObservable();
  }

  subscribeOperationsOpenErrors(): Observable<ITraderOperation> {
    return this.operationsOpenErrors$.asObservable();
  }

  subscribeOperationsCloseErrors(): Observable<ITraderOperation> {
    return this.operationsCloseErrors$.asObservable();
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

  async createNewOperation(opts: ITraderOpenOrderOpts): Promise<string | null> {
    const resp = await this.httpClient.post<IBaseResponse<string | null>>(
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

  async closeOperation(opts: ITraderCloseOrderOpts): Promise<string | null> {
    const resp = await this.httpClient.post<IBaseResponse<string | null>>(
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

  private liquidatedOpEventHandler(data: ITraderOperation) {
    this.liquidatedOpsUpdates$.next(data);
  }

  private cancelledOrdersEventHandler(data: ITraderOperation) {
    this.cancelledOrdersUpdates$.next(data);
  }

  private rejectedOrdersEventHandler(data: ITraderOperation) {
    this.rejectedOrdersUpdates$.next(data);
  }

  private openedOpEventHandler(data: ITraderOperation) {
    this.openedOpsUpdates$.next(data);
  }

  private closedOpEventHandler(data: ITraderOperation) {
    this.closedOpsUpdates$.next(data);
  }

  private operationOpenErrorEventHandler(data: ITraderOperation) {
    this.operationsOpenErrors$.next(data);
  }

  private operationCloseErrorEventHandler(data: ITraderOperation) {
    this.operationsCloseErrors$.next(data);
  }

  private activeStatsEventHandler(data: {
    sym: string;
    xm: ExchangesMarkets;
    stats: IOperationStats;
  }) {
    this.activeStatsUpdates$.next(data);
  }
}
