import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

import { IvyLog } from '../../../models/logging-center/log.model';
import { IvyStoredLog } from '../../../models/logging-center/stored-log.model';
import { Subject, delay, tap } from 'rxjs';

export class InstanceLoggingCenterService extends BaseWebsocketService {
  private readonly logsQueue$ = new Subject<{
    message: string | object;
    key: string;
    persist: boolean;
  }>();

  constructor(address: string, private readonly instanceUid: string) {
    super(address);

    this.logsQueue$
      .pipe(
        delay(1000),
        tap(({ message }) => console.log(message)),
        tap(({ persist, message, key }) => {
          const logObject = persist
            ? new IvyStoredLog(message, key, this.instanceUid)
            : new IvyLog(message, key, this.instanceUid);

          this.socket.once('post-log-error', (error: IStandardWsError) =>
            console.error(`Error posting log: ${error.error}`),
          );
          this.socket.emit('post-log', logObject.toJSON());
        }),
      )
      .subscribe();
  }

  postLog(message: string | object, key: string, persist: boolean) {
    this.logsQueue$.next({ message, key, persist });
  }
}
