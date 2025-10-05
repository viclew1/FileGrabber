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
        [K in keyof ClientToServerMessageTypes]: (payload: ClientToServerMessageTypes[K], ack?: () => void) => void;
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
        const stream: import('node:fs').ReadStream = fs.createReadStream(absolutePath, { highWaterMark: 64 * 1024 });

        let ended = false;
        let errored = false;
        const cleanup = () => {
            stream.removeAllListeners('readable');
            stream.removeAllListeners('end');
            stream.removeAllListeners('error');
        };

        const sendFinal = () => {
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: payload.fileName, chunkBase64: '', isLast: true, totalBytes },
            });
        };

        const sendNext = () => {
            if (errored) return;
            const chunk: Buffer | null = stream.read();
            if (chunk === null) {
                if (ended) {
                    cleanup();
                    sendFinal();
                } else {
                    stream.once('readable', sendNext);
                }
                return;
            }
            const chunkBase64 = chunk.toString('base64');
            // Send one chunk and wait for client ACK before proceeding
            this.sendMessage(
                {
                    type: 'SEND_FILE_CHUNK',
                    payload: { fileName: payload.fileName, chunkBase64, isLast: false, totalBytes },
                },
                () => {
                    // schedule next read after ack to yield event loop
                    setImmediate(sendNext);
                }
            );
        };

        stream.on('end', () => {
            ended = true;
            // If waiting for readable, sendNext will handle finalization
        });
        stream.on('error', () => {
            errored = true;
            cleanup();
            sendFinal();
        });

        // Start in paused mode; no 'data' listener, so we manually pull
        sendNext();
    }
}
