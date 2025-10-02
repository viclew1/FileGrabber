export type ClientSocketManagerStatus =
    | 'connecting'
    | 'disconnecting'
    | 'connected'
    | 'disconnected'
    | 'connectionFailure';

export type ClientConnectedEvent = { peerUrl: string };

export type ClientConnectionFailureEvent = { error: unknown };

export type ClientEventPayloads = {
    connected: ClientConnectedEvent;
    disconnected: undefined;
    message: string;
    connectionFailure: ClientConnectionFailureEvent;
};

export type ClientSocketManagerEvent = keyof ClientEventPayloads;
