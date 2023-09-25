import { Observable, Subject } from 'rxjs';

import { BaseWebsocketService } from '../base/ws.service';

import { IIKEvent } from '../../../models/ssm/ik-event.model';
import { IFKEvent } from '../../../models/ssm/fk-event.model';

export class InstanceSSMService extends BaseWebsocketService {
  private readonly IKStream$ = new Subject<IIKEvent>();
  private readonly FKStream$ = new Subject<IFKEvent>();

  constructor(address: string) {
    super([{ address, alias: 'ssm' }]);
  }

  enableIKStream() {
    this.subscribeEvent({
      socketAlias: 'ssm',
      successEventName: 'ik-event',
      eventName: 'subscribe-ik-stream',
      successCallback: this.IKStreamEventHandler.bind(this),
      errorEventName: 'subscribe-ik-stream-error',
      errorCallback: (data) => {
        throw new Error(`IK stream enable failed: ${data?.error || data}`);
      },
    });
  }

  enableFKStream() {
    this.subscribeEvent({
      socketAlias: 'ssm',
      successEventName: 'fk-event',
      eventName: 'subscribe-fk-stream',
      successCallback: this.FKStreamEventHandler.bind(this),
      errorEventName: 'subscribe-fk-stream-error',
      errorCallback: (data) => {
        throw new Error(`IK stream enable failed: ${data?.error || data}`);
      },
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
