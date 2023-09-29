import { IPostLogConfig } from './post-log-conf.model';

export class IvyLog implements IPostLogConfig {
  persist?: boolean;
  readonly key: string;
  readonly log: string;
  readonly time: number;
  readonly jsonParsable?: boolean;

  constructor(log: string | object, key: string) {
    if (typeof log === 'function')
      throw new Error('IvyLog does not support functions as log items');
    this.key = key;
    this.persist = false;
    this.time = Date.now();
    this.jsonParsable = typeof log === 'object';
    this.log = this.jsonParsable ? JSON.stringify(log) : (log as string);
  }

  toJSON(): IPostLogConfig {
    return {
      key: this.key,
      log: this.log,
      time: this.time,
      persist: this.persist,
      jsonParsable: this.jsonParsable,
    };
  }
}
