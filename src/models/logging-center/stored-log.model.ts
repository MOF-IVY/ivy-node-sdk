import { IvyLog } from './log.model';
import { ENVConfig } from '../../core/config/config/config.core';

export class IvyStoredLog extends IvyLog {
  constructor(log: string | object, key: string, instanceUid: string) {
    super(log, key, instanceUid);
    this.persist = true;
  }
}
