"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketService = void 0;
const socket_io_client_1 = require("socket.io-client");
class BaseWebsocketService {
    constructor(addresses) {
        this.sockets = [];
        addresses.forEach((item) => {
            const socketItem = {
                alias: item.alias,
                ready: false,
                eventsQueue: [],
                socket: (0, socket_io_client_1.io)(item.address),
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
    getSocket(alias) {
        return this.sockets.find((s) => s.alias === alias);
    }
    subscribeEvent(opts) {
        const { payload, eventName, socketAlias, errorCallback, errorEventName, successCallback, successEventName, } = opts;
        const socketItem = this.getSocketItemOrThrow(socketAlias);
        if (successCallback && successEventName) {
            socketItem.socket.on(successEventName, successCallback.bind(this));
        }
        if (errorEventName && errorCallback) {
            socketItem.socket.once(errorEventName, errorCallback.bind(this));
        }
        if (socketItem.ready) {
            socketItem.socket.emit(eventName, payload);
        }
        else {
            socketItem.eventsQueue.push({ event: eventName, payload });
        }
    }
    subscribeEventOnce(opts) {
        const { payload, eventName, socketAlias, errorCallback, errorEventName, successCallback, successEventName, } = opts;
        const socketItem = this.getSocketItemOrThrow(socketAlias);
        if (successCallback && successEventName) {
            socketItem.socket.once(successEventName, successCallback.bind(this));
        }
        if (errorEventName && errorCallback) {
            socketItem.socket.once(errorEventName, errorCallback.bind(this));
        }
        if (socketItem.ready) {
            socketItem.socket.emit(eventName, payload);
        }
        else {
            socketItem.eventsQueue.push({ event: eventName, payload });
        }
    }
    emit(socketAlias, eventName, payload) {
        const socketItem = this.getSocketItemOrThrow(socketAlias);
        if (socketItem.ready) {
            socketItem.socket.emit(eventName, payload);
        }
        else {
            socketItem.eventsQueue.push({ event: eventName, payload });
        }
    }
    emitCatchingError(socketAlias, eventName, errorEventName, errorCallback, payload) {
        const socketItem = this.getSocketItemOrThrow(socketAlias);
        socketItem.socket.once(errorEventName, errorCallback.bind(this));
        if (socketItem.ready) {
            socketItem.socket.emit(eventName, payload);
        }
        else {
            socketItem.eventsQueue.push({ event: eventName, payload });
        }
    }
    unsubscribeEvent(socketAlias, eventName, eventCallback) {
        const socketItem = this.getSocketItemOrThrow(socketAlias);
        socketItem.socket.off(eventName, eventCallback);
    }
    getSocketItemOrThrow(socketAlias) {
        const socketItem = this.getSocket(socketAlias);
        if (!socketItem)
            throw new Error(`Cannot find socket alias "${socketAlias}"`);
        return socketItem;
    }
}
exports.BaseWebsocketService = BaseWebsocketService;
//# sourceMappingURL=ws.service.js.map