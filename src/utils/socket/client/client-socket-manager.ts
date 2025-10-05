import { io, Socket } from 'socket.io-client';
import { ClientEventPayloads, ClientServerSharedFile, ClientSocketManagerStatus } from './client-socket-manager-types';
import { Listenable } from '../../listenable';
import { normalizePeerUrl } from './client-socket-manager.utils';
import { ClientSocketMessageHandler } from './client-socket-message-handler';

class ClientSocketManager extends Listenable<ClientEventPayloads> {
    private socket?: Socket;
    private socketHandler?: ClientSocketMessageHandler;
    private clientStatus: ClientSocketManagerStatus = 'disconnected';
    private peerUrl?: string;
    private serverSharedFiles: ClientServerSharedFile[] = [];
    private serverFilesPath = '/';

    constructor() {
        super({
            connected: [],
            disconnected: [],
            message: [],
            connectionFailure: [],
            statusChange: [],
            loadingFileStatusChange: [],
            serverSharedFilesChange: [],
        });
        this.on('statusChange', (e) => (this.clientStatus = e.status));
    }

    connect(peerUrl: string) {
        try {
            if (this.socket) this.disconnect();

            const normalizedUrl = normalizePeerUrl(peerUrl);

            this.socket = io(normalizedUrl, {
                retries: 0,
                reconnectionAttempts: 0,
                reconnection: false,
                autoConnect: false,
                transports: ['websocket'],
            });
            this.socketHandler = new ClientSocketMessageHandler(this.socket);

            this.socket.on('connect_error', (error) => this.onConnectionFailure(peerUrl, error));
            this.socket.on('connect', () => this.onConnectionSuccess(peerUrl));
            this.socket.on('disconnect', () => this.onDisconnection());
            this.socket.on('message', (msg) => this.socketHandler?.onMessageReceived(msg));

            this.socket.connect();
        } catch (error) {
            this.onConnectionFailure(peerUrl, error);
        }
    }

    disconnect() {
        if (this.socket) {
            const isConnected = this.socket.connected;
            this.socket.close();
            this.socket = undefined;
            this.socketHandler = undefined;
            if (!isConnected) {
                console.log('Connection aborted');
                this.onDisconnection();
            }
        }
    }

    getClientStatus(): ClientSocketManagerStatus {
        return this.clientStatus;
    }

    getPeerUrl(): string | undefined {
        return this.peerUrl;
    }

    setServerSharedFiles(sharedFiles: ClientServerSharedFile[]) {
        this.serverSharedFiles = sharedFiles;
        this.emitServerSharedFilesUpdate();
    }

    getServerSharedFiles(): ClientServerSharedFile[] {
        return [...this.serverSharedFiles];
    }

    getServerFilesPath(): string {
        return this.serverFilesPath;
    }

    setServerFilesPath(path: string) {
        this.serverFilesPath = path || '/';
        this.loadServerSharedFiles();
    }

    private onConnectionSuccess(peerUrl: string) {
        console.log(`Connected to peer ${peerUrl}`);
        this.peerUrl = peerUrl;
        this.serverFilesPath = '/';
        this.emit('connected', { peerUrl });
        this.emit('statusChange', { status: 'connected' });
        this.emit('loadingFileStatusChange', { loadingFiles: true });
    }

    loadServerSharedFiles() {
        this.emit('loadingFileStatusChange', { loadingFiles: true });
        this.socketHandler?.sendMessage({ type: 'GET_SERVER_SHARED_FILES', payload: { path: this.serverFilesPath } });
    }

    private emitServerSharedFilesUpdate() {
        this.emit('serverSharedFilesChange', { path: this.serverFilesPath, sharedFiles: this.getServerSharedFiles() });
        this.emit('loadingFileStatusChange', { loadingFiles: false });
    }

    private onDisconnection() {
        console.log(`Disconnected from peer ${this.peerUrl}`);
        this.peerUrl = undefined;
        this.socket = undefined;
        this.socketHandler = undefined;
        this.serverSharedFiles = [];
        this.emit('disconnected', undefined);
        this.emit('statusChange', { status: 'disconnected' });
        this.emitServerSharedFilesUpdate();
    }

    private onConnectionFailure(peerUrl: string, error: unknown) {
        console.error(`Error connecting to peer ${peerUrl}:`, error);
        this.peerUrl = undefined;
        this.socket = undefined;
        this.socketHandler = undefined;
        this.emit('connectionFailure', { error });
        this.emit('statusChange', { status: 'connectionFailure' });
    }
}

export default new ClientSocketManager();
