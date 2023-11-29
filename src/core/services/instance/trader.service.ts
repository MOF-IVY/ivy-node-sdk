import axios, { Axios, AxiosResponse } from 'axios';
import { Observable, Subject, filter, take, tap } from 'rxjs';

import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../../../models/common/exchange-operation-type';

import {
  IOperationStats,
  ITraderOperation,
} from '../../../models/trader/operation.model';
import { IBaseResponse } from '../../../models/common/base-response.model';
import { ITraderOpenOrderConfig } from '../../../models/trader/open-order-config.model';
import { ITraderCloseOrderConfig } from '../../../models/trader/close-order-config.model';
import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

export interface IActiveStatsUpdate {
  sym: string;
  xm: ExchangesMarkets;
  stats: IOperationStats;
}

export class InstanceTraderService extends BaseWebsocketService {
  private readonly httpClient: Axios;

  private readonly operationsOpenErrorsEvents$ = new Subject<string>();
  private readonly operationsCloseErrorsEvents$ = new Subject<string>();
  private readonly newActiveOpsEvents$ = new Subject<ITraderOperation>();
  private readonly closedOpsEvents$ = new Subject<ITraderOperation>();
  private readonly liquidatedOpsEvents$ = new Subject<ITraderOperation>();
  private readonly rejectedOrdersEvents$ = new Subject<ITraderOperation>();
  private readonly cancelledOpenOrdersEvents$ = new Subject<ITraderOperation>();
  private readonly cancelledCloseOrdersEvents$ =
    new Subject<ITraderOperation>();

  private readonly activeOperationsStatsUpdates$ =
    new Subject<IActiveStatsUpdate>();

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
            'cancelled-open-order-event',
            this.cancelledOpenOrdersEventHandler.bind(this),
          );
          this.socket.on(
            'cancelled-close-order-event',
            this.cancelledCloseOrdersEventHandler.bind(this),
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

  enableActiveOperationsStatsUpdates(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on(
        'active-operation-stats-event',
        this.activeOperationsStatsEventHandler.bind(this),
      );
      this.socket.once(
        'subscribe-active-operations-stats-updates-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once(
        'subscribe-active-operations-stats-updates-success',
        () => resolve(),
      );
      this.safeEmitWithReconnect('subscribe-active-operations-stats-updates');
    });
  }

  subscribeActiveOperationsStatsUpdates(): Observable<IActiveStatsUpdate> {
    return this.activeOperationsStatsUpdates$.asObservable();
  }

  subscribeNewActiveOperationsEvents(): Observable<ITraderOperation> {
    return this.newActiveOpsEvents$.asObservable();
  }

  subscribeClosedOperationsEvents(): Observable<ITraderOperation> {
    return this.closedOpsEvents$.asObservable();
  }

  subscribeLiquidatedOperationsEvents(): Observable<ITraderOperation> {
    return this.liquidatedOpsEvents$.asObservable();
  }

  subscribeCancelledOpenOrdersEvents(): Observable<ITraderOperation> {
    return this.cancelledOpenOrdersEvents$.asObservable();
  }

  subscribeCancelledCloseOrdersEvents(): Observable<ITraderOperation> {
    return this.cancelledCloseOrdersEvents$.asObservable();
  }

  subscribeRejectedOrdersEvents(): Observable<ITraderOperation> {
    return this.rejectedOrdersEvents$.asObservable();
  }

  subscribeOperationsOpenErrorsEvents(): Observable<string> {
    return this.operationsOpenErrorsEvents$.asObservable();
  }

  subscribeOperationsCloseErrorsEvents(): Observable<string> {
    return this.operationsCloseErrorsEvents$.asObservable();
  }

  async isReady(): Promise<boolean> {
    const resp = await this.httpClient.get<IBaseResponse<boolean>>(
      `trader/ready`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async hasActiveOperation(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ): Promise<boolean> {
    const resp = await this.httpClient.get<IBaseResponse<boolean>>(
      `trader/operation/active?xm=${xm}&symbol=${symbol}&type=${type}`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async getActiveOperationsSymbols(): Promise<string[]> {
    const resp = await this.httpClient.get<IBaseResponse<string[]>>(
      `trader/operations/active/symbols/list`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async getClosedOperation(operationId: string): Promise<ITraderOperation> {
    const resp = await this.httpClient.get<IBaseResponse<ITraderOperation>>(
      `trader/operation/closed/${operationId}`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async createNewOperation(
    opts: ITraderOpenOrderConfig,
  ): Promise<string | null> {
    const resp = await this.httpClient.post<IBaseResponse<string | null>>(
      'trader/operation/new',
      opts,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async closeOperation(opts: ITraderCloseOrderConfig): Promise<string | null> {
    const resp = await this.httpClient.post<IBaseResponse<string | null>>(
      'trader/operation/close',
      opts,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async cancelOpenOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/open-order/${operationId}`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  async cancelCloseOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/close-order/${operationId}`,
    );

    this.throwIfResponseError(resp);

    return resp.data.data!;
  }

  private liquidatedOpEventHandler(data: ITraderOperation) {
    this.liquidatedOpsEvents$.next(data);
  }

  private cancelledOpenOrdersEventHandler(data: ITraderOperation) {
    this.cancelledOpenOrdersEvents$.next(data);
  }

  private cancelledCloseOrdersEventHandler(data: ITraderOperation) {
    this.cancelledCloseOrdersEvents$.next(data);
  }

  private rejectedOrdersEventHandler(data: ITraderOperation) {
    this.rejectedOrdersEvents$.next(data);
  }

  private openedOpEventHandler(data: ITraderOperation) {
    this.newActiveOpsEvents$.next(data);
  }

  private closedOpEventHandler(data: ITraderOperation) {
    this.closedOpsEvents$.next(data);
  }

  private operationOpenErrorEventHandler(operationId: string) {
    this.operationsOpenErrorsEvents$.next(operationId);
  }

  private operationCloseErrorEventHandler(operationId: string) {
    this.operationsCloseErrorsEvents$.next(operationId);
  }

  private activeOperationsStatsEventHandler(data: {
    sym: string;
    xm: ExchangesMarkets;
    stats: IOperationStats;
  }) {
    this.activeOperationsStatsUpdates$.next(data);
  }

  private throwIfResponseError(resp: AxiosResponse<IBaseResponse<any>>) {
    if (resp.status < 300 && resp.data.statusCode >= 300)
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    if (resp.status >= 300) throw new Error(resp.statusText);
  }
}
