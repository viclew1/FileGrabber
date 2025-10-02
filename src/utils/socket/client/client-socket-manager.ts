import { io, Socket } from 'socket.io-client';
import { ClientEventPayloads } from './client-socket-manager-types';
import { Listenable } from '../../listenable';

class ClientSocketManager extends Listenable<ClientEventPayloads> {
    private socket: Socket | null = null;

    constructor() {
        super({
            connected: [],
            disconnected: [],
            message: [],
            connectionFailure: [],
        });
    }

    connect(peerUrl: string) {
        try {
            if (this.socket) this.disconnect();

            this.socket = io(peerUrl, {
                reconnection: false,
            });

            this.socket.on('connect_error', (error) => this.emit('connectionFailure', { error }));
            this.socket.on('connect', () => this.emit('connected', { peerUrl }));
            this.socket.on('disconnect', () => this.emit('disconnected', undefined));
            this.socket.on('message', (msg) => this.emit('message', msg));
        } catch (error) {
            console.error(`Error connecting to peer ${peerUrl}:`, error);
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
}

export default new ClientSocketManager();
