export type ServerSocketManagerStatus = 'ready' | 'stopped' | 'crashed';

export type ServerReadyEvent = { port: number };

export type ServerCrashedEvent = { error: unknown };

export type ServerStatusChangeEvent = { status: ServerSocketManagerStatus };

export type ServerEventPayloads = {
    started: ServerReadyEvent;
    stopped: undefined;
    message: string;
    crashed: ServerCrashedEvent;
    statusChange: ServerStatusChangeEvent;
};
