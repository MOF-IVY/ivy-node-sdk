import { Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

interface IAddressSocket {
  alias: string;
  socket: Socket;
  ready: boolean;
  eventsQueue: { event: string; payload: any }[];
}

interface ISubscribeEventOpts<ResponseType = unknown> {
  socketAlias: string;
  eventName: string;
  successEventName?: string;
  payload?: object | string | number | boolean;
  successCallback?: (data: ResponseType) => void;
  errorEventName?: string;
  errorCallback?: (error: any) => void;
}

export abstract class BaseWebsocketService {
  private readonly sockets: IAddressSocket[] = [];

  constructor(addresses: { alias: string; address: string }[]) {
    addresses.forEach((item) => {
      const socketItem: IAddressSocket = {
        alias: item.alias,
        ready: false,
        eventsQueue: [],
        socket: io(item.address),
      };

      socketItem.socket.on('welcome', () => {
        socketItem.ready = true;
        socketItem.eventsQueue.forEach((e) => {
          socketItem.socket.emit(e.event, e.payload);
        });
        socketItem.eventsQueue = [];
      });
      socketItem.socket.on('connect', () => (socketItem.ready = false));
      socketItem.socket.on('disconnect', () => (socketItem.ready = false));

      this.sockets.push(socketItem);
    });
  }

  protected getSocket(alias: string): IAddressSocket | undefined {
    return this.sockets.find((s) => s.alias === alias);
  }

  protected subscribeEvent<ResponseType>(
    opts: ISubscribeEventOpts<ResponseType>,
  ) {
    const {
      payload,
      eventName,
      socketAlias,
      errorCallback,
      errorEventName,
      successCallback,
      successEventName,
    } = opts;
    const socketItem = this.getSocketItemOrThrow(socketAlias);

    if (successCallback && successEventName) {
      socketItem.socket.on(successEventName, successCallback.bind(this));
    }

    if (errorEventName && errorCallback) {
      socketItem.socket.once(errorEventName, errorCallback.bind(this));
    }

    if (socketItem.ready) {
      socketItem.socket.emit(eventName, payload);
    } else {
      socketItem.eventsQueue.push({ event: eventName, payload });
    }
  }

  protected subscribeEventOnce<ResponseType>(
    opts: ISubscribeEventOpts<ResponseType>,
  ) {
    const {
      payload,
      eventName,
      socketAlias,
      errorCallback,
      errorEventName,
      successCallback,
      successEventName,
    } = opts;
    const socketItem = this.getSocketItemOrThrow(socketAlias);

    if (successCallback && successEventName) {
      socketItem.socket.once(successEventName, successCallback.bind(this));
    }

    if (errorEventName && errorCallback) {
      socketItem.socket.once(errorEventName, errorCallback.bind(this));
    }

    if (socketItem.ready) {
      socketItem.socket.emit(eventName, payload);
    } else {
      socketItem.eventsQueue.push({ event: eventName, payload });
    }
  }

  protected emit(
    socketAlias: string,
    eventName: string,
    payload?: object | string | boolean | number,
  ) {
    const socketItem = this.getSocketItemOrThrow(socketAlias);

    if (socketItem.ready) {
      socketItem.socket.emit(eventName, payload);
    } else {
      socketItem.eventsQueue.push({ event: eventName, payload });
    }
  }

  protected emitCatchingError(
    socketAlias: string,
    eventName: string,
    errorEventName: string,
    errorCallback: (error: any) => void,
    payload?: object | string | boolean | number,
  ) {
    const socketItem = this.getSocketItemOrThrow(socketAlias);

    socketItem.socket.once(errorEventName, errorCallback.bind(this));
    if (socketItem.ready) {
      socketItem.socket.emit(eventName, payload);
    } else {
      socketItem.eventsQueue.push({ event: eventName, payload });
    }
  }

  protected unsubscribeEvent(
    socketAlias: string,
    eventName: string,
    eventCallback: (...args: any[]) => void,
  ) {
    const socketItem = this.getSocketItemOrThrow(socketAlias);
    socketItem.socket.off(eventName, eventCallback);
  }

  private getSocketItemOrThrow(socketAlias: string) {
    const socketItem = this.getSocket(socketAlias);
    if (!socketItem)
      throw new Error(`Cannot find socket alias "${socketAlias}"`);
    return socketItem;
  }
}
