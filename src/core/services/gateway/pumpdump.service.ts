import { Observable, Subject } from 'rxjs';

import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';
import { IPumpDumpEvent } from '../../../models/pumpdump/pumpdump-event.model';
import { ExchangesMarkets } from '../../../main';

export class GatewayPumpDumpService extends BaseWebsocketService {
  private pumpStream$ = new Subject<IPumpDumpEvent>();
  private dumpStream$ = new Subject<IPumpDumpEvent>();

  constructor(address: string) {
    super(address);
  }

  enablePumpStream(payload: {
    xm: ExchangesMarkets;
    tfs: string[];
  }): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on('pump-event', this.pumpStreamEventHandler.bind(this));
      this.socket.once(
        'subscribe-pump-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('subscribe-pump-stream-success', () => resolve());
      this.safeEmit('subscribe-pump-stream', payload);
    });
  }

  disablePumpStream(payload: {
    xm: ExchangesMarkets;
  }): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.off('pump-event', this.pumpStreamEventHandler.bind(this));
      this.socket.once(
        'unsubscribe-pump-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('unsubscribe-pump-stream-success', () => resolve());
      this.safeEmit('unsubscribe-pump-stream', payload);
      this.pumpStream$.complete();
      this.pumpStream$ = new Subject<IPumpDumpEvent>();
    });
  }

  enableDumpStream(payload: {
    xm: ExchangesMarkets;
    tfs: string[];
  }): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on('dump-event', this.dumpStreamEventHandler.bind(this));
      this.socket.once(
        'subscribe-dump-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('subscribe-dump-stream-success', () => resolve());
      this.safeEmit('subscribe-dump-stream', payload);
    });
  }

  disableDumpStream(payload: {
    xm: ExchangesMarkets;
  }): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.off('dump-event', this.dumpStreamEventHandler.bind(this));
      this.socket.once(
        'unsubscribe-dump-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('unsubscribe-dump-stream-success', () => resolve());
      this.safeEmit('unsubscribe-dump-stream', payload);
      this.dumpStream$.complete();
      this.dumpStream$ = new Subject<IPumpDumpEvent>();
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
