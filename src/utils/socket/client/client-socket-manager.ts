import { io, Socket } from 'socket.io-client';
import { ClientEventPayloads, ClientSocketManagerStatus } from './client-socket-manager-types';
import { Listenable } from '../../listenable';

class ClientSocketManager extends Listenable<ClientEventPayloads> {
    private socket: Socket | null = null;
    private clientStatus: ClientSocketManagerStatus = 'disconnected';
    private peerUrl?: string;

    constructor() {
        super({
            connected: [],
            disconnected: [],
            message: [],
            connectionFailure: [],
            statusChange: [],
        });
        this.on('connected', (e) => (this.clientStatus = 'connected'));
        this.on('connectionFailure', () => (this.clientStatus = 'connectionFailure'));
        this.on('disconnected', () => (this.clientStatus = 'disconnected'));
    }

    private normalizePeerUrl(input: string): string {
        let raw = input.trim();
        if (!raw) throw new Error('Peer URL is empty');

        raw = raw.replace(/^(?:wss?:|https?:)\/\//i, '');
        const hostPort = raw.split('/')[0];

        const hostPortPattern = /^[^:\/\s]+:\d{2,5}$/;
        if (!hostPortPattern.test(hostPort)) {
            throw new Error('Peer must be in the form "host:port" (e.g., 123.44.55.66:1234 or somehost.com:4567)');
        }

        return `ws://${hostPort}`;
    }

    connect(peerUrl: string) {
        try {
            if (this.socket) this.disconnect();
            this.peerUrl = peerUrl;

            const normalizedUrl = this.normalizePeerUrl(peerUrl);

            this.socket = io(normalizedUrl, { reconnection: false, autoConnect: false, transports: ['websocket'] });

            this.socket.on('connect_error', (error) => this.emit('connectionFailure', { error }));
            this.socket.on('connect', () => this.emit('connected', { peerUrl }));
            this.socket.on('disconnect', () => this.emit('disconnected', undefined));
            this.socket.on('message', (msg) => this.emit('message', msg));

            this.socket.connect();
        } catch (error) {
            console.error(`Error connecting to peer ${peerUrl}:`, error);
            this.emit('connectionFailure', { error });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getClientStatus(): ClientSocketManagerStatus {
        return this.clientStatus;
    }

    getPeerUrl(): string | undefined {
        return this.clientStatus === 'connected' ? this.peerUrl : undefined;
    }
}

export default new ClientSocketManager();
