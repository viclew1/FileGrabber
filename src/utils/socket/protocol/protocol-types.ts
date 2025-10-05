import { ClientServerSharedFile } from '../client/client-socket-manager-types';

export type Message<MESSAGE_TYPES> = {
    type: keyof MESSAGE_TYPES;
    payload: MESSAGE_TYPES[keyof MESSAGE_TYPES];
};

export type ClientToServerMessageTypes = {
    GET_SERVER_SHARED_FILES: { path: string };
};

export type ServerToClientMessageTypes = {
    READY: undefined;
    SEND_SHARED_FILES: { sharedFiles: ClientServerSharedFile[] };
};
