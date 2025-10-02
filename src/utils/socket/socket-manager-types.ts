export type SocketManagerEvent = 'connected' | 'disconnected' | 'message' | 'connectionFailure';

export type SocketManagerStatus = 'connecting' | 'disconnecting' | 'connected' | 'disconnected' | 'connectionFailure';

export type ConnectedEvent = { peerIp: string };

export type ConnectionFailureEvent = { error: unknown };

export type EventPayloads = {
    connected: ConnectedEvent;
    disconnected: undefined;
    message: string;
    connectionFailure: ConnectionFailureEvent;
};
