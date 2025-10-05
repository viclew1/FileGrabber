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
        };
    }

    private handleGetServerSharedFilesMessage(payload: { path: string }) {
        this.sendMessage({
            type: 'SEND_SHARED_FILES',
            payload: { sharedFiles: ServerSocketManager.getSharedFiles(payload.path) },
        });
    }
}
