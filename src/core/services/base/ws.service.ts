import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

export interface IStandardWsError {
  error: string;
}

export abstract class BaseWebsocketService {
  protected readonly socket: Socket;
  private readonly ready$ = new Subject<boolean>();

  private emissionsQueue: [string, object | number | string | undefined][] = [];

  constructor(address: string) {
    this.socket = io(address);
    this.socket.on('welcome', () => {
      this.ready$.next(true);
      this.emissionsQueue.forEach(([event, payload], idx) => {
        this.socket.emit(event, payload);
        this.emissionsQueue = this.emissionsQueue.filter(
          ([, _idx]) => idx !== idx,
        );
      });
    });
    this.socket.on('connect', () => this.ready$.next(false));
    this.socket.on('disconnect', () => this.ready$.next(false));
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
}
