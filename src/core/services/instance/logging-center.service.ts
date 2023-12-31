import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

import { IvyLog } from '../../../models/logging-center/log.model';
import { IvyStoredLog } from '../../../models/logging-center/stored-log.model';

export class InstanceLoggingCenterService extends BaseWebsocketService {
  constructor(address: string) {
    super(address);
  }

  postLog(
    message: string | object,
    key: string,
    persist: boolean,
    logToConsole: boolean,
  ) {
    const logObject = persist
      ? new IvyStoredLog(message, key)
      : new IvyLog(message, key);

    this.socket.once('post-log-error', (error: IStandardWsError) =>
      console.error(`Error posting log: ${error.error}`),
    );
    this.socket.emit('post-log', logObject.toJSON());

    if (logToConsole)
      console.log(
        `${new Date(logObject.time).toLocaleString()} (${key}) ${message}`,
      );
  }
}
