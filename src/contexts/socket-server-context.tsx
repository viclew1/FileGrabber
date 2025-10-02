import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ServerCrashedEvent,
    ServerReadyEvent,
    ServerSocketManagerStatus,
} from '../utils/socket/server/server-socket-manager-types';
import ServerSocketManager from '../utils/socket/server/server-socket-manager';

type SocketServerContextType = {
    serverPortText: string;
    setServerPortText: React.Dispatch<React.SetStateAction<string>>;
    status: ServerSocketManagerStatus;
    isStarted: boolean;
    isStopped: boolean;
    isLoading: boolean;
    startServer: () => void;
    stopServer: () => void;
};

const SocketServerContext = createContext<SocketServerContextType | undefined>(undefined);

export function SocketServerProvider({ children }: { children: React.ReactNode }) {
    const [serverPortText, setServerPortText] = useState('');
    const [status, setStatus] = useState<ServerSocketManagerStatus>('stopped');

    const onStarted = (event: ServerReadyEvent) => {
        setStatus('ready');
    };

    const onStopped = () => {
        setStatus('stopped');
    };

    const onCrashed = (event: ServerCrashedEvent) => {
        console.error('Server crashed:', event.error);
        setStatus('crashed');
    };

    useEffect(() => {
        ServerSocketManager.on('started', onStarted);
        ServerSocketManager.on('stopped', onStopped);
        ServerSocketManager.on('crashed', onCrashed);

        return () => {
            ServerSocketManager.off('started', onStarted);
            ServerSocketManager.off('stopped', onStopped);
            ServerSocketManager.off('crashed', onCrashed);
        };
    }, []);

    function startServer() {
        setStatus('starting');
        ServerSocketManager.start(serverPortText);
    }

    function stopServer() {
        setStatus('stopping');
        ServerSocketManager.closeServer();
    }

    const isStarted = status === 'ready';
    const isStopped = status === 'stopped' || status === 'crashed';
    const isLoading = status === 'starting' || status === 'stopping';

    return (
        <SocketServerContext.Provider
            value={{
                serverPortText,
                setServerPortText,
                status,
                isStarted,
                isStopped,
                isLoading,
                startServer,
                stopServer,
            }}
        >
            {children}
        </SocketServerContext.Provider>
    );
}

export function useSocketServer() {
    const ctx = useContext(SocketServerContext);
    if (!ctx) throw new Error('useSocketServer must be used inside SocketServerProvider');
    return ctx;
}
