import { Observable, Subject } from 'rxjs';

import { BaseWebsocketService } from '../base/ws.service';
import { IPumpDumpEvent } from '../../../models/pumpdump/pumpdump-event.model';
import { ExchangesMarkets } from '../../../main';

export class GatewayPumpDumpService extends BaseWebsocketService {
  private readonly pumpStream$ = new Subject<IPumpDumpEvent>();
  private readonly dumpStream$ = new Subject<IPumpDumpEvent>();

  constructor(address: string) {
    super([{ address, alias: 'pd' }]);
  }

  /**
   * Always catch
   */
  enablePumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    this.subscribeEvent({
      payload,
      socketAlias: 'pd',
      successEventName: 'pump-update',
      eventName: 'subscribe-pump-stream',
      successCallback: this.pumpStreamEventHandler.bind(this),
      errorEventName: 'subscribe-pump-stream-error',
      errorCallback: (data) => {
        throw new Error(`Pump stream enable failed: ${data?.error || data}`);
      },
    });
  }

  /**
   * Always catch
   */
  enableDumpStream(payload: { xm: ExchangesMarkets; tfs: string[] }) {
    this.subscribeEvent({
      payload,
      socketAlias: 'pd',
      successEventName: 'dump-update',
      eventName: 'subscribe-dump-stream',
      successCallback: this.dumpStreamEventHandler.bind(this),
      errorEventName: 'subscribe-dump-stream-error',
      errorCallback: (data) => {
        throw new Error(`Dump stream enable failed: ${data?.error || data}`);
      },
    });
  }

  subscribePumpStream(): Observable<IPumpDumpEvent> {
    return this.pumpStream$.asObservable();
  }

  subscribeDumpStream(): Observable<IPumpDumpEvent> {
    return this.dumpStream$.asObservable();
  }

  private pumpStreamEventHandler(data: IPumpDumpEvent) {
    this.pumpStream$.next(data);
  }

  private dumpStreamEventHandler(data: IPumpDumpEvent) {
    this.dumpStream$.next(data);
  }
}
