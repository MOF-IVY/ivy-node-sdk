import { randomUUID } from 'crypto';
import { ISDKConfigOpts, IvySDK } from './main';
import { tap } from 'rxjs';

const config: ISDKConfigOpts = {
  gatewayRestApiAddress: 'http://localhost:3005/api/v1/',
  instanceTraderRestApiAddress: 'http://localhost:3002/',

  gatewayWsApiAddress: 'ws://localhost:3005',
  instanceSSMWsApiAddress: 'ws://localhost:3001/ssm',
  instanceHistoryLoaderWsApiAddress: 'ws://localhost:3000/history-loader',
  instanceLoggingCenterWsApiAddress: 'ws://localhost:3003/logging-center',
};

const sleep = (ms: number) =>
  new Promise<void>((r) => setTimeout(() => r(), ms));

let opId: string;
const sdk = new IvySDK(config);
sdk
  .subscribeReady()
  .pipe(
    tap(async () => {
      await sdk.log('Testing order creation', 'sdk.logs');
      try {
        const result = await sdk.newOperation({
          exchangeMarket: 'bybit_linear',
          operationType: 'long',
          orderType: 'Market',
          symbol: 'BTC/USDT',
          leverage: 1,
          leverageEntryPercent: 5,
        });
        await sdk.log(`Testing order creation: OK`, 'sdk.logs');
        opId = result.operationId;
      } catch (e: any) {
        await sdk.log(
          `Error while creating new operation on trader: ${
            e.message || e.error
          }`,
          'sdk.errors',
        );
        return;
      }

      await sleep(2000);

      await sdk.log('Testing order closing', 'sdk.logs');
      try {
        const result = await sdk.closeOperation({
          exchangeMarket: 'bybit_linear',
          operationType: 'long',
          orderType: 'Market',
          symbol: 'BTC/USDT',
        });
        await sdk.log(`Testing order closing: OK`, 'sdk.logs');
      } catch (e: any) {
        await sdk.log(
          `Error while closing operation on trader: ${e.message || e.error}`,
          'sdk.errors',
        );
        return;
      }

      await sleep(2000);

      await sdk.log('Testing closed operation fetch', 'sdk.logs');
      try {
        const result = await sdk.getClosedOperation(opId);
        await sdk.log(`Testing closed operation fetch: OK`, 'sdk.logs');
      } catch (e: any) {
        await sdk.log(
          `Error while fetching operation on trader: ${e.message || e.error}`,
          'sdk.errors',
        );
        return;
      }

      await sleep(2000);

      await sdk.log('Testing history load', 'sdk.logs');
      try {
        const result = await sdk.loadHistory({
          len: 10,
          referenceKlineTime: Date.now(),
          reqId: randomUUID(),
          ticker: 'binance_spot~BTC/USDT~1m',
        });
        await sdk.log(`Testing history load: OK`, 'sdk.logs');
      } catch (e: any) {
        await sdk.log(
          `Error while fetching history from history loader: ${
            e.message || e.error
          }`,
          'sdk.errors',
        );
        return;
      }

      await sleep(2000);

      await sdk.log('Testing IK subscription', 'sdk.logs');
      try {
        let err = await sdk.enableIKStream();
        if (!!err) {
          await sdk.log(`Error while enabling IK subscription`, 'sdk.errors');
          return;
        }
        await sdk.log(`IK subscription enabled`, 'sdk.logs');
        sdk
          .subscribeIKStream()
          .pipe(tap(async () => await sdk.log('Received IK event', 'sdk.logs')))
          .subscribe();

        await sleep(1000 * 5);

        err = await sdk.disableIKStream();
        if (!!err) {
          await sdk.log(`Error while disabling IK subscription`, 'sdk.errors');
          return;
        }
        await sdk.log(`IK subscription disabled`, 'sdk.logs');

        await sleep(1000 * 5);

        err = await sdk.enableIKStream();
        if (!!err) {
          await sdk.log(`Error while enabling IK subscription`, 'sdk.errors');
          return;
        }
        await sdk.log(`IK subscription enabled`, 'sdk.logs');

        await sleep(1000 * 5);

        await sdk.log(`Testing IK subscription: OK`, 'sdk.logs');
      } catch (e: any) {
        await sdk.log(
          `Error while testing IK subscription: ${e.message || e.error}`,
          'sdk.errors',
        );
      }

      await sleep(2000);

      await sdk.log('Testing pump events subscription', 'sdk.logs');
      try {
        let err = await sdk.enablePumpStream({
          xm: 'bybit_linear',
          tfs: ['1m'],
        });
        if (!!err) {
          await sdk.log(
            `Error while enabling pump events subscription`,
            'sdk.errors',
          );
          return;
        }
        await sdk.log(`Pump subscription enabled`, 'sdk.logs');
        sdk
          .subscribePumpStream()
          .pipe(
            tap(async () => await sdk.log('Received pump event', 'sdk.logs')),
          )
          .subscribe();

        await sleep(1000 * 5);
        err = await sdk.disablePumpStream({ xm: 'bybit_linear' });
        if (!!err) {
          await sdk.log(
            `Error while disabling pump subscription`,
            'sdk.errors',
          );
          return;
        }
        await sdk.log(`Pump subscription disabled`, 'sdk.errors');

        await sleep(1000 * 5);

        err = await sdk.enablePumpStream({ xm: 'bybit_linear', tfs: ['1m'] });
        if (!!err) {
          await sdk.log(`Error while enabling pump subscription`, 'sdk.errors');
          return;
        }
        await sdk.log(`Pump subscription enabled`, 'sdk.errors');

        await sleep(1000 * 10);

        await sdk.log(`Testing pump events subscription: OK`, 'sdk.logs');
      } catch (e: any) {
        await sdk.log(
          `Error while testing pump events subscription: ${
            e.message || e.error
          }`,
          'sdk.errors',
        );
      }
    }),
  )
  .subscribe();
