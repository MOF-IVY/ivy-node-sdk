import { BaseWebsocketService } from '../base/ws.service';

import { IvyLog } from '../../../models/logging-center/log.model';
import { IvyStoredLog } from '../../../models/logging-center/stored-log.model';

export class InstanceLoggingCenterService extends BaseWebsocketService {
  constructor(address: string, private readonly instanceUid: string) {
    super([{ address, alias: 'logs' }]);
  }

  postLog(message: string | object, key: string, persist: boolean) {
    const log = persist
      ? new IvyStoredLog(message, key, this.instanceUid)
      : new IvyLog(message, key, this.instanceUid);

    this.emit('logs', 'post-log', log.toJSON());
  }
}
