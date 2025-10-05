import { ClientToServerMessageTypes, ServerToClientMessageTypes } from '../protocol/protocol-types';
import { SocketMessageHandler } from '../protocol/socket-message-handler';
import { Socket } from 'socket.io-client';
import ClientSocketManager from './client-socket-manager';
import { ClientServerSharedFile } from './client-socket-manager-types';

export class ClientSocketMessageHandler extends SocketMessageHandler<
    ServerToClientMessageTypes,
    ClientToServerMessageTypes
> {
    constructor(socket: Socket) {
        super(socket);
    }

    protected initMessageHandlers(): {
        [K in keyof ServerToClientMessageTypes]: (payload: ServerToClientMessageTypes[K]) => void;
    } {
        return {
            READY: this.handleReadyMessage.bind(this),
            SEND_SHARED_FILES: this.handleSendSharedFilesMessage.bind(this),
            SEND_FILE_CHUNK: this.handleFileChunk.bind(this),
        };
    }

    private handleReadyMessage() {
        ClientSocketManager.loadServerSharedFiles();
    }

    private handleSendSharedFilesMessage(payload: { sharedFiles: ClientServerSharedFile[] }) {
        ClientSocketManager.setServerSharedFiles(payload.sharedFiles);
    }

    private handleFileChunk(payload: { fileName: string; chunkBase64: string; isLast: boolean; totalBytes: number }) {
        ClientSocketManager.onFileChunk(payload.fileName, payload.chunkBase64, payload.isLast, payload.totalBytes);
    }
}
