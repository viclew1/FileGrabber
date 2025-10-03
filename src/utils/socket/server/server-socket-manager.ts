import { Listenable } from '../../listenable';
import { ServerEventPayloads, ServerSocketManagerStatus } from './server-socket-manager-types';
import { Server } from 'socket.io';
import { createServer } from 'http';

class ServerSocketManager extends Listenable<ServerEventPayloads> {
    private socketServer: Server | null = null;
    private serverStatus: ServerSocketManagerStatus = 'stopped';
    private port?: number;

    constructor() {
        super({
            started: [],
            stopped: [],
            message: [],
            crashed: [],
            statusChange: [],
        });
        this.on('statusChange', (e) => (this.serverStatus = e.status));
    }

    start(portStr: string) {
        try {
            if (this.socketServer) this.closeServer();
            const port = parseInt(portStr);
            this.port = port;

            const httpServer = createServer();
            this.socketServer = new Server(httpServer, {});

            httpServer.on('connection', (socket) => {
                console.log('New client connected:', socket.remoteAddress, ':', socket.remotePort);
            });
            httpServer.on('listening', () => {
                this.emit('started', { port: port });
                this.emit('statusChange', { status: 'ready' });
            });
            httpServer.on('error', (error) => {
                this.emit('crashed', { error });
                this.emit('statusChange', { status: 'crashed' });
            });
            httpServer.on('close', () => {
                this.emit('stopped', undefined);
                this.emit('statusChange', { status: 'stopped' });
            });

            httpServer.listen(port);
        } catch (error) {
            console.error(`Error starting server on port ${portStr}:`, error);
            this.emit('crashed', { error });
        }
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
        return this.serverStatus === 'ready' ? this.port : undefined;
    }
}

export default new ServerSocketManager();
