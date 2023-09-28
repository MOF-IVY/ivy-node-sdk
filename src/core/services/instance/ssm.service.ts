import { Observable, Subject } from 'rxjs';

import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

import { IIKEvent } from '../../../models/ssm/ik-event.model';
import { IFKEvent } from '../../../models/ssm/fk-event.model';

export class InstanceSSMService extends BaseWebsocketService {
  private IKStream$ = new Subject<IIKEvent>();
  private FKStream$ = new Subject<IFKEvent>();

  constructor(address: string) {
    super(address);
  }

  enableIKStream(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on('ik-event', this.IKStreamEventHandler.bind(this));
      this.socket.once('subscribe-ik-stream-error', (error: IStandardWsError) =>
        resolve(error),
      );
      this.socket.once('subscribe-ik-stream-success', () => resolve());
      this.safeEmitWithReconnect('subscribe-ik-stream');
    });
  }

  disableIKStream(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.off('ik-event', this.IKStreamEventHandler.bind(this));
      this.socket.once(
        'unsubscribe-ik-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('unsubscribe-ik-stream-success', () => resolve());
      this.safeEmit('unsubscribe-ik-stream');
      this.IKStream$.complete();
      this.IKStream$ = new Subject<IIKEvent>();
    });
  }

  enableFKStream(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.on('fk-event', this.FKStreamEventHandler.bind(this));
      this.socket.once('subscribe-fk-stream-error', (error: IStandardWsError) =>
        resolve(error),
      );
      this.socket.once('subscribe-fk-stream-success', () => resolve());
      this.safeEmitWithReconnect('subscribe-fk-stream');
    });
  }

  disableFKStream(): Promise<void | IStandardWsError> {
    return new Promise((resolve) => {
      this.socket.off('fk-event', this.FKStreamEventHandler.bind(this));
      this.socket.once(
        'unsubscribe-fk-stream-error',
        (error: IStandardWsError) => resolve(error),
      );
      this.socket.once('unsubscribe-fk-stream-success', () => resolve());
      this.safeEmit('unsubscribe-fk-stream');
      this.FKStream$.complete();
      this.FKStream$ = new Subject<IFKEvent>();
    });
  }

  subscribeIKStream(): Observable<IFKEvent> {
    return this.IKStream$.asObservable();
  }

  subscribeFKStream(): Observable<IFKEvent> {
    return this.FKStream$.asObservable();
  }

  private IKStreamEventHandler(data: IIKEvent) {
    this.IKStream$.next(data);
  }

  private FKStreamEventHandler(data: IIKEvent) {
    this.FKStream$.next(data);
  }
}
