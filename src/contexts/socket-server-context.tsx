import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ServerCrashedEvent,
    ServerSocketManagerStatus,
    ServerStatusChangeEvent,
} from '../utils/socket/server/server-socket-manager-types';

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
    const [isLoading, setIsLoading] = useState(true);
    const [serverPortText, setServerPortText] = useState('');
    const [status, setStatus] = useState<ServerSocketManagerStatus>('stopped');

    const onCrashed = (event: ServerCrashedEvent) => {
        console.error('Server crashed:', event.error);
    };

    const onStatusChange = (event: ServerStatusChangeEvent) => {
        setIsLoading(false);
        setStatus(event.status);
    };

    useEffect(() => {
        const api = window.electronAPI;

        (async () => {
            const [port, srvStatus] = await Promise.all([api.getServerPort(), api.getServerStatus()]);
            if (port != null) setServerPortText(String(port));
            setStatus(srvStatus);
            setIsLoading(false);
        })();

        const statusHandler = (payload: ServerStatusChangeEvent) => onStatusChange(payload);
        const crashHandler = (payload: ServerCrashedEvent) => onCrashed(payload);
        api.onServerStatusChange(statusHandler);
        api.onServerCrashed(crashHandler);

        return () => {
            api.offServerStatusChange(statusHandler as any);
            api.offServerCrashed(crashHandler as any);
        };
    }, []);

    function startServer() {
        setIsLoading(true);
        window.electronAPI.startServer(serverPortText);
    }

    function stopServer() {
        setIsLoading(true);
        window.electronAPI.stopServer();
    }

    const isStarted = status === 'ready';
    const isStopped = status === 'stopped' || status === 'crashed';

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
