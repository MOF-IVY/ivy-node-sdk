import { IvyLog } from './log.model';

export class IvyStoredLog extends IvyLog {
  constructor(log: string | object, key: string) {
    super(log, key);
    this.persist = true;
  }
}
