import { io, Socket } from 'socket.io-client';
import { EventPayloads, SocketManagerEvent } from './socket-manager-types';

type Listener<E extends keyof EventPayloads> = (payload: EventPayloads[E]) => void;

class SocketManager {
    private listeners: { [K in keyof EventPayloads]: Listener<K>[] } = {
        connected: [],
        disconnected: [],
        message: [],
        connectionFailure: [],
    };
    private socket: Socket | null = null;

    connect(peerIp: string) {
        try {
            if (this.socket) this.disconnect();

            const peerUrl = `${peerIp}:5128`;
            this.socket = io(peerUrl, {
                reconnection: false,
            });

            this.socket.on('connect_error', (error) => this.emit('connectionFailure', { error }));
            this.socket.on('connect', () => this.emit('connected', { peerIp }));
            this.socket.on('disconnect', () => this.emit('disconnected', undefined));
            this.socket.on('message', (msg) => this.emit('message', msg));
        } catch (error) {
            console.error(`Error connecting to peer ${peerIp}:`, error);
            this.emit('connectionFailure', { error });
            throw error;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    send(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    on<E extends SocketManagerEvent>(event: E, listener: Listener<E>): this {
        this.listeners[event].push(listener);
        return this;
    }

    off<E extends SocketManagerEvent>(event: E, listener: (payload: EventPayloads[E]) => void): this {
        const eventListeners = this.listeners[event];
        const listenerIndex = eventListeners.indexOf(listener);
        if (listenerIndex === -1) return this;
        eventListeners.splice(listenerIndex, 1);
        return this;
    }

    emit<E extends SocketManagerEvent>(event: E, payload: EventPayloads[E]): boolean {
        try {
            this.listeners[event].forEach((listener) => listener(payload));
            return true;
        } catch (error) {
            console.error(`Error emitting event "${event}":`, error);
            return false;
        }
    }
}

export default new SocketManager();
