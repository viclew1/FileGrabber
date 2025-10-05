import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ServerClient,
    ServerClientsUpdateEvent,
    ServerCrashedEvent,
    ServerReadyEvent,
    ServerSharedFile,
    ServerSharedFoldersUpdatedEvent,
    ServerSocketManagerStatus,
    ServerStatusChangeEvent,
} from '../utils/socket/server/server-socket-manager-types';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/local-storage/local-storage.utils';

type SocketServerContextType = {
    serverPortText: string;
    setServerPortText: React.Dispatch<React.SetStateAction<string>>;
    clients: ServerClient[];
    sharedFolders: ServerSharedFile[];
    status: ServerSocketManagerStatus;
    isStarted: boolean;
    isStopped: boolean;
    isLoading: boolean;
    startServer: () => void;
    stopServer: () => void;
    addSharedFolders: (folders: string[]) => void;
    removeSharedFolder: (folder: string) => void;
};

const SocketServerContext = createContext<SocketServerContextType | undefined>(undefined);

export function SocketServerProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [serverPortText, setServerPortText] = useState('');
    const [status, setStatus] = useState<ServerSocketManagerStatus>('stopped');
    const [clients, setClients] = useState<ServerClient[]>([]);
    const [sharedFolders, setSharedFolders] = useState<ServerSharedFile[]>([]);

    const onStarted = (event: ServerReadyEvent) => {
        setLocalStorageItem('serverPort', event.port.toString());
    };

    const onCrashed = (event: ServerCrashedEvent) => {
        console.error('Server crashed:', event.error);
    };

    const onStatusChange = (event: ServerStatusChangeEvent) => {
        setIsLoading(false);
        setStatus(event.status);
    };

    const onClientsUpdate = (event: ServerClientsUpdateEvent) => {
        setClients(event.clients);
    };

    const onSharedFilesUpdate = (event: ServerSharedFoldersUpdatedEvent) => {
        setSharedFolders(event.sharedFolders);
        setLocalStorageItem(
            'sharedFolders',
            event.sharedFolders.map((folder) => folder.absolutePath),
        );
    };

    useEffect(() => {
        const api = window.electronAPI;

        (async () => {
            const [srvPort, srvStatus, srvClients] = await Promise.all([
                api.getServerPort(),
                api.getServerStatus(),
                api.getServerClients(),
            ]);
            setServerPortText(srvPort?.toString() ?? getLocalStorageItem('serverPort') ?? '');
            setStatus(srvStatus);
            setClients(srvClients);
            setIsLoading(false);
        })();

        api.onServerStarted(onStarted);
        api.onServerStatusChange(onStatusChange);
        api.onServerCrashed(onCrashed);
        api.onServerClientsUpdate(onClientsUpdate);
        api.onServerSharedFilesUpdate(onSharedFilesUpdate);
        api.setSharedFolders(getLocalStorageItem('sharedFolders') ?? []);

        return () => {
            api.offServerStarted(onStarted);
            api.offServerStatusChange(onStatusChange);
            api.offServerCrashed(onCrashed);
            api.offServerClientsUpdate(onClientsUpdate);
            api.offServerSharedFilesUpdate(onSharedFilesUpdate);
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

    function addSharedFolders(folders: string[]) {
        window.electronAPI.addSharedFolders(folders);
    }

    function removeSharedFolder(folder: string) {
        window.electronAPI.removeSharedFolder(folder);
    }

    const isStarted = status === 'ready';
    const isStopped = status === 'stopped' || status === 'crashed';

    return (
        <SocketServerContext.Provider
            value={{
                serverPortText,
                setServerPortText,
                status,
                sharedFolders,
                clients,
                isStarted,
                isStopped,
                isLoading,
                startServer,
                stopServer,
                addSharedFolders,
                removeSharedFolder,
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
