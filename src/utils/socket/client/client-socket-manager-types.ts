export type ClientSocketManagerStatus =
    | 'connecting'
    | 'disconnecting'
    | 'connected'
    | 'disconnected'
    | 'connectionFailure';

export type ClientConnectedEvent = { peerUrl: string };

export type ClientConnectionFailureEvent = { error: unknown };

export type ClientStatusChangeEvent = { status: ClientSocketManagerStatus };

export type ClientEventPayloads = {
    connected: ClientConnectedEvent;
    disconnected: undefined;
    message: string;
    connectionFailure: ClientConnectionFailureEvent;
    statusChange: ClientStatusChangeEvent;
};
