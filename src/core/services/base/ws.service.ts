import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { ENVConfig } from '../../config/config/config.core';

export interface IStandardWsError {
  error: string;
}

export abstract class BaseWebsocketService {
  protected readonly socket: Socket;
  private readonly ready$ = new BehaviorSubject<boolean>(false);

  private eventsToEmitOnReconnect: { event: string; payload?: unknown }[] = [];
  private emissionsQueue: [string, object | number | string | undefined][] = [];

  constructor(address: string) {
    this.socket = io(address, { auth: { apiKey: ENVConfig.scriptApiKey } });
    this.socket.on('welcome', () => {
      if (ENVConfig.verboseMode) console.log(`[${address}] welcome received`);
      this.ready$.next(true);

      this.eventsToEmitOnReconnect.forEach((s) =>
        this.socket.emit(s.event, s.payload ? s.payload : undefined),
      );
      this.emissionsQueue.forEach(([event, payload], idx) => {
        this.socket.emit(event, payload);
        this.emissionsQueue = this.emissionsQueue.filter(
          ([, _idx]) => idx !== idx,
        );
      });
    });
    this.socket.on('connect', () => {
      this.ready$.next(false);
      if (ENVConfig.verboseMode) console.log(`[${address}] connected`);
    });
    this.socket.on('disconnect', () => {
      this.ready$.next(false);
      if (ENVConfig.verboseMode) console.log(`[${address}] disconnected`);
    });
  }

  subscribeReady(): Observable<boolean> {
    return this.ready$.asObservable();
  }

  protected safeEmit(eventName: string, payload?: object | number | string) {
    if (this.socket.connected) {
      this.socket.emit(eventName, payload);
    } else {
      this.emissionsQueue.push([eventName, payload]);
    }
  }

  protected safeEmitWithReconnect(
    eventName: string,
    payload?: object | number | string,
  ) {
    this.addToAutoReconnectionEvents(eventName, payload);
    this.safeEmit(eventName, payload);
  }

  protected addToAutoReconnectionEvents(event: string, payload: unknown) {
    if (this.eventsToEmitOnReconnect.find((s) => s.event === event)) return;
    this.eventsToEmitOnReconnect.push({ event, payload });
  }
}
