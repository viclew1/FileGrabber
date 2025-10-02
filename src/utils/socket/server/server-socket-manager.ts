import { Listenable } from '../../listenable';
import { ServerEventPayloads } from './server-socket-manager-types';
import { WebSocketServer } from 'ws';

class ServerSocketManager extends Listenable<ServerEventPayloads> {
    private socketServer: WebSocketServer | null = null;

    constructor() {
        super({
            started: [],
            stopped: [],
            message: [],
            crashed: [],
        });
    }

    start(portStr: string) {
        try {
            if (this.socketServer) this.closeServer();
            const port = parseInt(portStr);

            this.socketServer = new WebSocketServer({ port });

            this.socketServer.on('connection', (socket) => {});
            this.socketServer.on('listening', () => this.emit('started', { port }));
            this.socketServer.on('error', (error) => this.emit('crashed', { error }));
            this.socketServer.on('close', () => this.emit('stopped', undefined));
        } catch (error) {
            console.error(`Error starting server on port ${portStr}:`, error);
            this.emit('crashed', { error });
            throw error;
        }
    }

    closeServer() {
        if (this.socketServer) {
            this.socketServer.close();
            this.socketServer = null;
        }
    }
}

export default new ServerSocketManager();
