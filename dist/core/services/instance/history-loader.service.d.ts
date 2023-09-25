import { BaseWebsocketService } from '../base/ws.service';
import { IHistoryLoaded } from '../../../models/history-loader/history-loaded-event.model';
import { IHistoryLoadRequestOpts } from '../../../models/history-loader/history-load-request.model';
export declare class InstanceHistoryLoaderService extends BaseWebsocketService {
    constructor(address: string);
    loadHistory(conf: IHistoryLoadRequestOpts): Promise<IHistoryLoaded>;
}
