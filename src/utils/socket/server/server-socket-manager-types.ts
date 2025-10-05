export type ServerSocketManagerStatus = 'ready' | 'stopped' | 'crashed';

export type ServerReadyEvent = { port: number };

export type ServerCrashedEvent = { error: unknown };

export type ServerStatusChangeEvent = { status: ServerSocketManagerStatus };

export type ServerClientsUpdateEvent = { clients: ServerClient[] };

export type ServerClient = {
    peerUrl: string;
    connectedAt: number;
};

export type ServerSharedFile = {
    absolutePath: string;
    fileName: string;
};

export type ServerSharedFoldersUpdatedEvent = {
    sharedFolders: ServerSharedFile[];
};

export type ServerEventPayloads = {
    started: ServerReadyEvent;
    stopped: undefined;
    message: string;
    crashed: ServerCrashedEvent;
    statusChange: ServerStatusChangeEvent;
    clientsUpdate: ServerClientsUpdateEvent;
    sharedFoldersUpdate: ServerSharedFoldersUpdatedEvent;
};
