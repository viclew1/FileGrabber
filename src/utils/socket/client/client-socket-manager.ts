import { io, Socket } from 'socket.io-client';
import { ClientEventPayloads, ClientServerSharedFile, ClientSocketManagerStatus } from './client-socket-manager-types';
import { Listenable } from '../../listenable';
import { normalizePeerUrl } from './client-socket-manager.utils';
import { ClientSocketMessageHandler } from './client-socket-message-handler';
import * as fs from 'node:fs';

class ClientSocketManager extends Listenable<ClientEventPayloads> {
    private socket?: Socket;
    private socketHandler?: ClientSocketMessageHandler;
    private clientStatus: ClientSocketManagerStatus = 'disconnected';
    private peerUrl?: string;
    private serverSharedFiles: ClientServerSharedFile[] = [];
    private serverFilesPath = '/';
    private downloadStreams: Map<string, fs.WriteStream> = new Map();
    private downloadReceivedBytes: Map<string, number> = new Map();

    constructor() {
        super({
            connected: [],
            disconnected: [],
            message: [],
            connectionFailure: [],
            statusChange: [],
            loadingFileStatusChange: [],
            serverSharedFilesChange: [],
            downloadProgress: [],
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
        // close any ongoing downloads
        for (const [, s] of this.downloadStreams) {
            try {
                s.close();
            } catch {}
        }
        this.downloadStreams.clear();
        this.serverSharedFiles = [];
        this.emit('disconnected', undefined);
        this.emit('statusChange', { status: 'disconnected' });
        this.emitServerSharedFilesUpdate();
        this.emit('loadingFileStatusChange', { loadingFiles: false });
    }

    private onConnectionFailure(peerUrl: string, error: unknown) {
        console.error(`Error connecting to peer ${peerUrl}:`, error);
        this.peerUrl = undefined;
        this.socket = undefined;
        this.socketHandler = undefined;
        this.emit('connectionFailure', { error });
        this.emit('statusChange', { status: 'connectionFailure' });
    }

    startDownload(fileName: string, savePath: string) {
        if (!this.socketHandler) return;
        this.downloadStreams.get(fileName)?.close();
        const stream = fs.createWriteStream(savePath);
        this.downloadStreams.set(fileName, stream);
        this.downloadReceivedBytes.set(fileName, 0);
        this.emit('downloadProgress', { fileName, receivedBytes: 0, totalBytes: 0, progress: 0 });
        this.socketHandler.sendMessage({
            type: 'DOWNLOAD_FILE',
            payload: { path: this.serverFilesPath, fileName },
        });
    }

    onFileChunk(fileName: string, chunkBase64: string, isLast: boolean, totalBytes: number) {
        const stream = this.downloadStreams.get(fileName);
        if (!stream) return;
        let received = this.downloadReceivedBytes.get(fileName) ?? 0;
        if (chunkBase64) {
            const buf = Buffer.from(chunkBase64, 'base64');
            stream.write(buf);
            received += buf.length;
            this.downloadReceivedBytes.set(fileName, received);
        }
        const progress = totalBytes > 0 ? Math.min(1, received / totalBytes) : 0;
        this.emit('downloadProgress', { fileName, receivedBytes: received, totalBytes, progress });
        if (isLast) {
            stream.close();
            this.downloadStreams.delete(fileName);
            this.downloadReceivedBytes.delete(fileName);
            if (totalBytes > 0 && received < totalBytes) {
                this.emit('downloadProgress', { fileName, receivedBytes: totalBytes, totalBytes, progress: 1 });
            }
        }
    }
}

export default new ClientSocketManager();
