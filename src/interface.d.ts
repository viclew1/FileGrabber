import {
    ServerClient,
    ServerClientsUpdateEvent,
    ServerCrashedEvent,
    ServerReadyEvent,
    ServerSharedFoldersUpdatedEvent,
    ServerSocketManagerStatus,
    ServerStatusChangeEvent,
} from './utils/socket/server/server-socket-manager-types';
import {
    ClientConnectedEvent,
    ClientConnectionFailureEvent,
    ClientLoadingFilesStatusChangeEvent,
    ClientServerSharedFile,
    ClientServerSharedFilesChangeEvent,
    ClientSocketManagerStatus,
    ClientStatusChangeEvent,
    ClientDownloadProgressEvent,
} from './utils/socket/client/client-socket-manager-types';

export interface IElectronAPI {
    startServer: (port: string) => void;
    stopServer: () => void;
    connectClient: (url: string) => void;
    disconnectClient: () => void;
    getServerPort: () => Promise<number | undefined>;
    getServerStatus: () => Promise<ServerSocketManagerStatus>;
    getServerClients: () => Promise<ServerClient[]>;
    getServerSharedFolders: () => Promise<string[] | undefined>;
    getClientPeerUrl: () => Promise<string | undefined>;
    getClientStatus: () => Promise<ClientSocketManagerStatus>;
    getClientSharedFiles: () => Promise<ClientServerSharedFile[]>;
    getClientServerFilesPath: () => Promise<string>;
    setClientServerFilesPath: (path: string) => void;
    downloadFile: (fileName: string) => Promise<boolean>;
    addSharedFolders: (folders: string[]) => void;
    setSharedFolders: (folders: string[]) => void;
    removeSharedFolder: (folder: string) => void;

    pickFolders: () => Promise<string[] | undefined>;
    getFilesPaths: (files: File[]) => Promise<string[]>;

    onServerStarted: (cb: (payload: ServerReadyEvent) => void) => void;
    offServerStarted: (cb: (payload: ServerReadyEvent) => void) => void;
    onServerStopped: (cb: (payload: undefined) => void) => void;
    offServerStopped: (cb: (payload: undefined) => void) => void;
    onServerCrashed: (cb: (payload: ServerCrashedEvent) => void) => void;
    offServerCrashed: (cb: (payload: ServerCrashedEvent) => void) => void;
    onServerMessage: (cb: (payload: string) => void) => void;
    offServerMessage: (cb: (payload: string) => void) => void;
    onServerStatusChange: (cb: (payload: ServerStatusChangeEvent) => void) => void;
    offServerStatusChange: (cb: (payload: ServerStatusChangeEvent) => void) => void;
    onServerClientsUpdate: (cb: (payload: ServerClientsUpdateEvent) => void) => void;
    offServerClientsUpdate: (cb: (payload: ServerClientsUpdateEvent) => void) => void;
    onServerSharedFilesUpdate: (cb: (payload: ServerSharedFoldersUpdatedEvent) => void) => void;
    offServerSharedFilesUpdate: (cb: (payload: ServerSharedFoldersUpdatedEvent) => void) => void;

    onClientConnected: (cb: (payload: ClientConnectedEvent) => void) => void;
    offClientConnected: (cb: (payload: ClientConnectedEvent) => void) => void;
    onClientDisconnected: (cb: (payload: undefined) => void) => void;
    offClientDisconnected: (cb: (payload: undefined) => void) => void;
    onClientConnectionFailure: (cb: (payload: ClientConnectionFailureEvent) => void) => void;
    offClientConnectionFailure: (cb: (payload: ClientConnectionFailureEvent) => void) => void;
    onClientMessage: (cb: (payload: string) => void) => void;
    offClientMessage: (cb: (payload: string) => void) => void;
    onClientStatusChange: (cb: (payload: ClientStatusChangeEvent) => void) => void;
    offClientStatusChange: (cb: (payload: ClientStatusChangeEvent) => void) => void;
    onClientServerSharedFilesChange: (cb: (payload: ClientServerSharedFilesChangeEvent) => void) => void;
    offClientServerSharedFilesChange: (cb: (payload: ClientServerSharedFilesChangeEvent) => void) => void;
    onClientLoadingFileStatusChange: (cb: (payload: ClientLoadingFilesStatusChangeEvent) => void) => void;
    offClientLoadingFileStatusChange: (cb: (payload: ClientLoadingFilesStatusChangeEvent) => void) => void;
    onClientDownloadProgress: (cb: (payload: ClientDownloadProgressEvent) => void) => void;
    offClientDownloadProgress: (cb: (payload: ClientDownloadProgressEvent) => void) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
