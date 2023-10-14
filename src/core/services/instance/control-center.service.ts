import axios, { Axios } from 'axios';
import { Observable, Subject, filter, take, tap } from 'rxjs';

import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';

import { BaseWebsocketService } from '../base/ws.service';
import { IOperationStats } from '../../../models/trader/operation.model';
import { IBaseResponse } from '../../../models/common/base-response.model';

export interface IActiveStatsUpdate {
  sym: string;
  xm: ExchangesMarkets;
  stats: IOperationStats;
}

export class InstanceControlCenterService<
  ScriptConfigType = Record<string, any>,
> extends BaseWebsocketService {
  private readonly httpClient: Axios;

  private readonly pauseCommands$ = new Subject<void>();
  private readonly resumeCommands$ = new Subject<void>();
  private readonly restartCommands$ = new Subject<void>();
  private readonly scriptConfigs$ = new Subject<ScriptConfigType>();

  constructor(restAddress: string, wsAddress: string) {
    super(wsAddress, { isScript: 'true' });
    this.httpClient = axios.create({
      baseURL: restAddress,
      headers: {
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
            'restart-event',
            this.restartCmdEventHandler.bind(this),
          );
          this.socket.on('pause-event', this.pauseCmdEventHandler.bind(this));
          this.socket.on('resume-event', this.resumeCmdEventHandler.bind(this));
          this.socket.on(
            'config-change-event',
            this.configChangeEventHandler.bind(this),
          );
        }),
      )
      .subscribe();
  }

  subscribeScriptConfigChanges(): Observable<ScriptConfigType> {
    return this.scriptConfigs$.asObservable();
  }

  subscribePauseCommands(): Observable<void> {
    return this.pauseCommands$.asObservable();
  }

  subscribeResumeCommands(): Observable<void> {
    return this.resumeCommands$.asObservable();
  }

  subscribeRestartCommands(): Observable<void> {
    return this.restartCommands$.asObservable();
  }

  async getScriptConfig(): Promise<ScriptConfigType> {
    const resp = await this.httpClient.get<IBaseResponse<ScriptConfigType>>(
      `config/script`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceControlCenterService.name}] http error while trying to get script config: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async initScriptConfig(config: ScriptConfigType): Promise<ScriptConfigType> {
    const resp = await this.httpClient.post<IBaseResponse<ScriptConfigType>>(
      `config/script`,
      config,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceControlCenterService.name}] http error while trying to set script config: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  private restartCmdEventHandler() {
    this.restartCommands$.next();
  }

  private pauseCmdEventHandler() {
    this.pauseCommands$.next();
  }

  private resumeCmdEventHandler() {
    this.resumeCommands$.next();
  }

  private configChangeEventHandler(data: ScriptConfigType) {
    this.scriptConfigs$.next(data);
  }
}
