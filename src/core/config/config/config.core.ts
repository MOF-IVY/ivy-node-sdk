import * as process from 'process';
import { ENVConfigs } from './config.enum';

export class ENVConfig {
  static get verboseMode(): boolean {
    return true || this.getConfig(ENVConfigs.verbose) === 'true';
  }

  static get scriptUid(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.scriptUid);
    return this.getConfig(ENVConfigs.scriptUid);
  }

  static get scriptApiKey(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.scriptApiKey);
    return this.getConfig(ENVConfigs.scriptApiKey);
  }

  static get scriptPersistancePath(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.scriptPersistancePath);
    return this.getConfig(ENVConfigs.scriptPersistancePath);
  }

  private static ensureConfigExistenceOrThrow(config: ENVConfigs): void {
    if (!process.env[config])
      throw new Error(`Missing env config ${config}. Please provide it`);
  }

  private static getConfig(config: ENVConfigs): string {
    return process.env[config] ?? '';
  }
}
