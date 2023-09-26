import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

import { IvyLog } from '../../../models/logging-center/log.model';
import { IvyStoredLog } from '../../../models/logging-center/stored-log.model';

export class InstanceLoggingCenterService extends BaseWebsocketService {
  constructor(address: string, private readonly instanceUid: string) {
    super(address);
  }

  postLog(
    message: string | object,
    key: string,
    persist: boolean,
  ): Promise<boolean | IStandardWsError> {
    const log = persist
      ? new IvyStoredLog(message, key, this.instanceUid)
      : new IvyLog(message, key, this.instanceUid);

    return new Promise((resolve) => {
      this.socket.once('post-log-success', () => resolve(true));
      this.socket.once('post-log-error', (error: IStandardWsError) =>
        resolve(error),
      );
      this.socket.emit('post-log', log.toJSON());
    });
  }
}
