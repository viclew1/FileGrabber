export type ClientSocketManagerStatus = 'connected' | 'disconnected' | 'connectionFailure';

export type ClientConnectedEvent = { peerUrl: string };

export type ClientConnectionFailureEvent = { error: unknown };

export type ClientStatusChangeEvent = { status: ClientSocketManagerStatus };

export type ClientLoadingFilesStatusChangeEvent = { loadingFiles: boolean };

export type ClientServerSharedFile = {
    fileName: string;
    type: 'file' | 'folder';
};

export type ClientServerSharedFilesChangeEvent = {
    path: string;
    sharedFiles: ClientServerSharedFile[];
};

export type ClientEventPayloads = {
    connected: ClientConnectedEvent;
    disconnected: undefined;
    message: string;
    connectionFailure: ClientConnectionFailureEvent;
    statusChange: ClientStatusChangeEvent;
    loadingFileStatusChange: ClientLoadingFilesStatusChangeEvent;
    serverSharedFilesChange: ClientServerSharedFilesChangeEvent;
};
