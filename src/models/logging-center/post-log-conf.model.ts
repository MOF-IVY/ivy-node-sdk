export interface IPostLogConfig {
  key: string;
  log: string;
  time: number;

  persist?: boolean;
  jsonParsable?: boolean;
}
