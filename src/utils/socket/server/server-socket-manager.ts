import { Listenable } from '../../listenable';
import {
    ServerClient,
    ServerEventPayloads,
    ServerSharedFile,
    ServerSocketManagerStatus,
} from './server-socket-manager-types';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { ServerSocketMessageHandler } from './server-socket-message-handler';
import * as fs from 'node:fs';
import { ClientServerSharedFile } from '../client/client-socket-manager-types';

class ServerSocketManager extends Listenable<ServerEventPayloads> {
    private socketServer: Server | null = null;
    private serverStatus: ServerSocketManagerStatus = 'stopped';
    private port?: number;
    private clients: Set<ServerClient> = new Set();
    private sharedFolderByAbsolutePath: Map<string, ServerSharedFile> = new Map();

    constructor() {
        super({
            started: [],
            stopped: [],
            message: [],
            crashed: [],
            statusChange: [],
            clientsUpdate: [],
            sharedFoldersUpdate: [],
        });
        this.on('statusChange', (e) => (this.serverStatus = e.status));
    }

    start(portStr: string) {
        try {
            if (this.socketServer) this.closeServer();
            const port = parseInt(portStr);
            this.clients.clear();

            const httpServer = createServer();
            this.socketServer = new Server(httpServer, {});

            this.socketServer.on('connection', (socket) => {
                const messageHandler = new ServerSocketMessageHandler(socket);
                const reqSocket = socket.request.socket;
                const remoteAddress = reqSocket.remoteAddress || socket.conn.remoteAddress || 'unknown';
                const remotePort = reqSocket.remotePort ?? 0;
                const client: ServerClient = {
                    peerUrl: `${remoteAddress}:${remotePort}`,
                    connectedAt: Date.now(),
                };
                this.onClientConnected(client);

                socket.on('message', (msg) => messageHandler.onMessageReceived(msg));
                socket.on('disconnect', () => this.onClientDisconnected(client));
                messageHandler.sendMessage({ type: 'READY', payload: undefined });
            });
            httpServer.on('listening', () => this.onServerReady(port));
            httpServer.on('error', (error) => this.onServerCrashed({ error }));
            httpServer.on('close', () => this.onServerClosed());

            httpServer.listen(port);
        } catch (error) {
            console.error(`Error starting server on port ${portStr}:`, error);
            this.onServerCrashed({ error });
        }
    }

    private onClientConnected(client: ServerClient) {
        console.log(`New client connected: ${client.peerUrl}`);
        this.clients.add(client);
        this.emitClientsUpdateEvent();
    }

    private onClientDisconnected(client: ServerClient) {
        console.log(`Client disconnected: ${client.peerUrl}`);
        this.clients.delete(client);
        this.emitClientsUpdateEvent();
    }

    private onServerReady(port: number) {
        this.port = port;
        this.emit('started', { port });
        this.emit('statusChange', { status: 'ready' });
    }

    private onServerCrashed(error: unknown) {
        this.clients.clear();
        this.port = undefined;
        this.emit('crashed', { error });
        this.emit('statusChange', { status: 'crashed' });
        this.emitClientsUpdateEvent();
    }

    private onServerClosed() {
        this.clients.clear();
        this.port = undefined;
        this.emit('stopped', undefined);
        this.emit('statusChange', { status: 'stopped' });
        this.emitClientsUpdateEvent();
    }

    private onSharedFoldersUpdate() {
        const sharedFolders = this.getSharedFolders();
        this.emit('sharedFoldersUpdate', { sharedFolders });
    }

    private emitClientsUpdateEvent() {
        this.emit('clientsUpdate', { clients: this.getClients() });
    }

    closeServer() {
        if (this.socketServer) {
            void this.socketServer.close();
            this.socketServer = null;
        }
    }

    getServerStatus(): ServerSocketManagerStatus {
        return this.serverStatus;
    }

    getPort(): number | undefined {
        return this.port;
    }

    getClients(): ServerClient[] {
        return Array.from(this.clients);
    }

    getSharedFolders(): ServerSharedFile[] {
        return Array.from(this.sharedFolderByAbsolutePath.values());
    }

    getSharedFiles(filesPath: string): ClientServerSharedFile[] {
        if (filesPath === '/' || filesPath === '') {
            const sharedFolders = this.getSharedFolders();
            return sharedFolders.map((f) => ({
                fileName: f.fileName,
                type: 'folder',
            }));
        }
        const absolutePath = this.resolveDirAbsolutePath(filesPath);
        if (!absolutePath) return [];
        return fs.readdirSync(absolutePath).map((fileName) => {
            const fileAbsolutePath = absolutePath + '/' + fileName;
            const lstat = fs.lstatSync(fileAbsolutePath);
            return {
                fileName,
                type: lstat.isDirectory() ? 'folder' : 'file',
            };
        });
    }

    resolveFileAbsolutePath(filesPath: string, fileName: string): string | undefined {
        const dirAbsolutePath = this.resolveDirAbsolutePath(filesPath);
        if (!dirAbsolutePath) return undefined;
        const targetPath = dirAbsolutePath + '/' + fileName;
        if (!fs.existsSync(targetPath)) return undefined;
        const stat = fs.lstatSync(targetPath);
        if (stat.isDirectory()) return undefined;
        return targetPath;
    }

    private resolveDirAbsolutePath(filesPath: string): string | undefined {
        if (filesPath === '/' || filesPath === '') return undefined;
        const pathSegments = filesPath.split('/').filter((segment) => segment !== '');
        const baseSharedFolder = this.getSharedFolders().find((folder) => folder.fileName === pathSegments[0]);
        if (!baseSharedFolder) return undefined;
        pathSegments.splice(0, 1);
        return baseSharedFolder.absolutePath + '/' + pathSegments.join('/');
    }

    addSharedFolders(foldersPaths: string[]) {
        console.log('Adding shared folders:', foldersPaths);

        foldersPaths
            .map((folderPath) => this.buildSharedFolder(folderPath))
            .forEach((folder) => this.sharedFolderByAbsolutePath.set(folder.absolutePath, folder));
        this.onSharedFoldersUpdate();
    }

    removeSharedFolder(folderPath: string) {
        console.log('Removing shared folder:', folderPath);
        const folder = this.buildSharedFolder(folderPath);
        this.sharedFolderByAbsolutePath.delete(folder.absolutePath);
        this.onSharedFoldersUpdate();
    }

    setSharedFolders(foldersPaths: string[]) {
        console.log('Setting shared folders:', foldersPaths);
        this.sharedFolderByAbsolutePath.clear();
        foldersPaths
            .map((folderPath) => this.buildSharedFolder(folderPath))
            .forEach((folder) => this.sharedFolderByAbsolutePath.set(folder.absolutePath, folder));
        this.onSharedFoldersUpdate();
    }

    private buildSharedFolder(folderPath: string): ServerSharedFile {
        const absolutePath = folderPath.trim().replaceAll('\\', '/');
        const fileName = absolutePath.split('/').pop();
        if (!fileName) throw new Error('Invalid folder path');
        return {
            absolutePath,
            fileName,
        };
    }
}

export default new ServerSocketManager();
