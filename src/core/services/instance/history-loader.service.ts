import { BaseWebsocketService, IStandardWsError } from '../base/ws.service';

import { IHistoryLoaded } from '../../../models/history-loader/history-loaded-event.model';
import { IHistoryLoadRequestOpts } from '../../../models/history-loader/history-load-request.model';

export class InstanceHistoryLoaderService extends BaseWebsocketService {
  constructor(address: string) {
    super(address);
  }

  loadHistory(conf: IHistoryLoadRequestOpts): Promise<IHistoryLoaded> {
    return new Promise((resolve, reject) => {
      this.socket.once('load-history-success', (data: IHistoryLoaded) =>
        resolve(data),
      );
      this.socket.once('load-history-error', (error: IStandardWsError) =>
        reject(error),
      );
      this.socket.emit('load-history', conf);
    });
  }
}
