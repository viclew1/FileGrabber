import { ClientToServerMessageTypes, ServerToClientMessageTypes } from '../protocol/protocol-types';
import { SocketMessageHandler } from '../protocol/socket-message-handler';
import { Socket } from 'socket.io';
import ServerSocketManager from './server-socket-manager';

export class ServerSocketMessageHandler extends SocketMessageHandler<
    ClientToServerMessageTypes,
    ServerToClientMessageTypes
> {
    constructor(socket: Socket) {
        super(socket);
    }

    protected initMessageHandlers(): {
        [K in keyof ClientToServerMessageTypes]: (payload: ClientToServerMessageTypes[K]) => void;
    } {
        return {
            GET_SERVER_SHARED_FILES: this.handleGetServerSharedFilesMessage.bind(this),
            DOWNLOAD_FILE: this.handleDownloadFileMessage.bind(this),
        };
    }

    private handleGetServerSharedFilesMessage(payload: { path: string }) {
        this.sendMessage({
            type: 'SEND_SHARED_FILES',
            payload: { sharedFiles: ServerSocketManager.getSharedFiles(payload.path) },
        });
    }

    private handleDownloadFileMessage(payload: { path: string; fileName: string }) {
        const absolutePath = ServerSocketManager.resolveFileAbsolutePath(payload.path, payload.fileName);
        if (!absolutePath) {
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: payload.fileName, chunkBase64: '', isLast: true, totalBytes: 0 },
            });
            return;
        }
        const fs = require('node:fs');
        const totalBytes = fs.lstatSync(absolutePath).size;
        const stream = fs.createReadStream(absolutePath);
        stream.on('data', (chunk: Buffer) => {
            const chunkBase64 = chunk.toString('base64');
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: payload.fileName, chunkBase64, isLast: false, totalBytes },
            });
        });
        stream.on('end', () => {
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: payload.fileName, chunkBase64: '', isLast: true, totalBytes },
            });
        });
        stream.on('error', () => {
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: payload.fileName, chunkBase64: '', isLast: true, totalBytes },
            });
        });
    }
}
