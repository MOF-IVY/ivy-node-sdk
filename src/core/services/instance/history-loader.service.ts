import { BaseWebsocketService } from '../base/ws.service';

import { IHistoryLoaded } from '../../../models/history-loader/history-loaded-event.model';
import { IHistoryLoadRequestOpts } from '../../../models/history-loader/history-load-request.model';

export class InstanceHistoryLoaderService extends BaseWebsocketService {
  constructor(address: string) {
    super([{ alias: 'hl', address: address }]);
  }

  loadHistory(conf: IHistoryLoadRequestOpts): Promise<IHistoryLoaded> {
    return new Promise((resolve, reject) => {
      this.subscribeEvent<IHistoryLoaded>({
        payload: conf,
        socketAlias: 'hl',
        eventName: 'load-history',
        errorEventName: 'load-history-error',
        successEventName: 'load-history-success',
        successCallback: (history) => resolve(history),
        errorCallback: (error) => reject(error),
      });
    });
  }
}
