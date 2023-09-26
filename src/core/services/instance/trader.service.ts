import axios, { Axios } from 'axios';

import { ExchangesMarkets } from '../../../models/common/exchanges-markets.type';
import { ExchangeOperationType } from '../../../models/common/exchange-operation-type';

import { ITraderOperation } from '../../../models/trader/operation.model';
import { IBaseResponse } from '../../../models/common/base-response.model';
import { ITraderOpenOrderOpts } from '../../../models/trader/open-order-config.model';
import { ITraderCloseOrderOpts } from '../../../models/trader/close-order-config.model';

export class InstanceTraderService {
  private readonly httpClient: Axios;

  constructor(address: string, apiKey: string) {
    this.httpClient = axios.create({
      baseURL: address,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async hasOperationOpen(
    xm: ExchangesMarkets,
    symbol: string,
    type: ExchangeOperationType,
  ): Promise<boolean> {
    const resp = await this.httpClient.get<IBaseResponse<boolean>>(
      `trader/operation/open/${xm}/${symbol}/${type}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async getClosedOperation(operationId: string): Promise<ITraderOperation> {
    const resp = await this.httpClient.get<IBaseResponse<ITraderOperation>>(
      `trader/operation/closed/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to get operation open: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async createNewOperation(
    opts: ITraderOpenOrderOpts,
  ): Promise<ITraderOperation> {
    const resp = await this.httpClient.post<IBaseResponse<ITraderOperation>>(
      'trader/operation/new',
      opts,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to create a new operation: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async closeOperation(opts: ITraderCloseOrderOpts): Promise<ITraderOperation> {
    const resp = await this.httpClient.post<IBaseResponse<ITraderOperation>>(
      'trader/operation/close',
      opts,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to close an operation: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async cancelOpenOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/open-order/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to cancel an operation open order: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }

  async cancelCloseOrder(operationId: string): Promise<boolean> {
    const resp = await this.httpClient.delete<IBaseResponse<boolean>>(
      `trader/operation/close-order/${operationId}`,
    );
    if (resp.status < 300 && resp.data.statusCode >= 300) {
      throw new Error(`[${resp.data.statusCode}] ${resp.data.message}`);
    }
    if (resp.status >= 300) {
      throw new Error(
        `[${InstanceTraderService.name}] http error while trying to cancel an operation close order: ${resp.statusText}`,
      );
    }
    return resp.data.data!;
  }
}
