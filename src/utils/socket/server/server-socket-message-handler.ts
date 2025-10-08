import { ClientToServerMessageTypes, ServerToClientMessageTypes } from '../protocol/protocol-types';
import { SocketMessageHandler } from '../protocol/socket-message-handler';
import { Socket } from 'socket.io';
import ServerSocketManager from './server-socket-manager';
import * as fs from 'node:fs';
import archiver from 'archiver';

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
        const stat = fs.lstatSync(absolutePath);

        if (stat.isDirectory()) {
            this.sendFolder(absolutePath, payload.fileName);
        } else {
            this.sendFile(absolutePath, payload.fileName, stat);
        }
    }

    private sendFolder(absolutePath: string, fileName: string) {
        const archive = archiver('zip', { zlib: { level: 9 } });

        const totalBytes = 1000000000000;
        const zippedFileName = fileName + '.zip';

        let errored = false;

        const sendFinal = () => {
            this.sendMessage({
                type: 'SEND_FILE_CHUNK',
                payload: { fileName: zippedFileName, chunkBase64: '', isLast: true, totalBytes },
            });
        };

        archive.on('error', () => {
            if (errored) return;
            errored = true;
            sendFinal();
        });

        // Pace the read using pause/resume in tandem with client acks
        archive.on('data', (chunk: Buffer) => {
            if (errored) return;
            archive.pause();
            const chunkBase64 = chunk.toString('base64');
            this.sendMessage(
                {
                    type: 'SEND_FILE_CHUNK',
                    payload: { fileName: zippedFileName, chunkBase64, isLast: false, totalBytes },
                },
                () => {
                    setImmediate(() => archive.resume());
                },
            );
        });

        archive.on('end', () => {
            sendFinal();
        });

        archive.directory(absolutePath, false);
        archive.finalize();
    }

    private sendFile(absolutePath: string, fileName: string, stat: fs.Stats) {
        const totalBytes = stat.size;
        // If the whole file fits into a single chunk, send it as the last (and only) packet
        const HIGH_WATER_MARK = 64 * 1024;
        if (totalBytes <= HIGH_WATER_MARK) {
            try {
                const data: Buffer = fs.readFileSync(absolutePath);
                const chunkBase64 = data.toString('base64');
                this.sendMessage({
                    type: 'SEND_FILE_CHUNK',
                    payload: { fileName, chunkBase64, isLast: true, totalBytes },
                });
            } catch {
                this.sendMessage({
                    type: 'SEND_FILE_CHUNK',
                    payload: { fileName, chunkBase64: '', isLast: true, totalBytes: 0 },
                });
            }
            return;
        }

        const stream: import('node:fs').ReadStream = fs.createReadStream(absolutePath, {
            highWaterMark: HIGH_WATER_MARK,
        });

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
                payload: { fileName, chunkBase64: '', isLast: true, totalBytes },
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
            this.sendMessage(
                {
                    type: 'SEND_FILE_CHUNK',
                    payload: { fileName, chunkBase64, isLast: false, totalBytes },
                },
                () => {
                    setImmediate(sendNext);
                },
            );
        };

        stream.on('end', () => {
            ended = true;
        });
        stream.on('error', () => {
            errored = true;
            cleanup();
            sendFinal();
        });

        sendNext();
    }
}
