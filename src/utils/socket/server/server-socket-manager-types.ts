export type ServerSocketManagerStatus = 'starting' | 'ready' | 'stopping' | 'stopped' | 'crashed';

export type ServerReadyEvent = { port: number };

export type ServerCrashedEvent = { error: unknown };

export type ServerEventPayloads = {
    started: ServerReadyEvent;
    stopped: undefined;
    message: string;
    crashed: ServerCrashedEvent;
};

export type ServerSocketManagerEvent = keyof ServerEventPayloads;
