import {
    ServerCrashedEvent,
    ServerReadyEvent,
    ServerSocketManagerStatus,
    ServerStatusChangeEvent,
} from './utils/socket/server/server-socket-manager-types';
import {
    ClientConnectedEvent,
    ClientConnectionFailureEvent,
    ClientSocketManagerStatus,
    ClientStatusChangeEvent,
} from './utils/socket/client/client-socket-manager-types';

export interface IElectronAPI {
    startServer: (port: string) => void;
    stopServer: () => void;
    connectClient: (url: string) => void;
    disconnectClient: () => void;
    getServerPort: () => Promise<number | undefined>;
    getServerStatus: () => Promise<ServerSocketManagerStatus>;
    getClientPeerUrl: () => Promise<string | undefined>;
    getClientStatus: () => Promise<ClientSocketManagerStatus>;

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
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
