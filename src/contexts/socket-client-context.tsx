import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ClientConnectedEvent,
    ClientConnectionFailureEvent,
    ClientLoadingFilesStatusChangeEvent,
    ClientServerSharedFile,
    ClientServerSharedFilesChangeEvent,
    ClientSocketManagerStatus,
    ClientStatusChangeEvent,
} from '../utils/socket/client/client-socket-manager-types';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/local-storage/local-storage.utils';

type SocketClientContextType = {
    peerUrlText: string;
    setPeerUrlText: React.Dispatch<React.SetStateAction<string>>;
    status: ClientSocketManagerStatus;
    sharedFiles: ClientServerSharedFile[];
    filesPath: string;
    changeFilesPath: (newPath: string) => void;
    connect: () => void;
    disconnect: () => void;
    isConnected: boolean;
    isDisconnected: boolean;
    isLoading: boolean;
    isFilesLoading: boolean;
};

const SocketClientContext = createContext<SocketClientContextType | undefined>(undefined);

export function SocketClientProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isFilesLoading, setIsFilesLoading] = useState(true);
    const [peerUrlText, setPeerUrlText] = useState('');
    const [status, setStatus] = useState<ClientSocketManagerStatus>('disconnected');
    const [sharedFiles, setSharedFiles] = useState<ClientServerSharedFile[]>([]);
    const [filesPath, setFilesPath] = useState<string>('/');

    useEffect(() => {
        const api = window.electronAPI;

        (async () => {
            const [peerUrl, currentStatus, sharedFiles, filesPath] = await Promise.all([
                api.getClientPeerUrl(),
                api.getClientStatus(),
                api.getClientSharedFiles(),
                api.getClientServerFilesPath(),
            ]);
            setPeerUrlText(peerUrl ?? getLocalStorageItem('peerUrl') ?? '');
            setStatus(currentStatus);
            setSharedFiles(sharedFiles);
            setFilesPath(filesPath);
            setIsLoading(false);
        })();

        const onConnected = (event: ClientConnectedEvent) => {
            setLocalStorageItem('peerUrl', event.peerUrl);
            setPeerUrlText(event.peerUrl);
        };

        const onStatusChange = (event: ClientStatusChangeEvent) => {
            setStatus(event.status);
            setIsLoading(false);
        };

        const onConnectionFailure = (event: ClientConnectionFailureEvent) => {
            console.error('Connection failure:', event.error);
        };

        const onLoadingFileStatusChange = (event: ClientLoadingFilesStatusChangeEvent) => {
            setIsFilesLoading(event.loadingFiles);
        };

        const onServerSharedFilesChange = (event: ClientServerSharedFilesChangeEvent) => {
            setSharedFiles(event.sharedFiles);
            setFilesPath(event.path);
        };

        api.onClientConnected(onConnected);
        api.onClientConnectionFailure(onConnectionFailure);
        api.onClientStatusChange(onStatusChange);
        api.onClientLoadingFileStatusChange(onLoadingFileStatusChange);
        api.onClientServerSharedFilesChange(onServerSharedFilesChange);

        return () => {
            api.offClientConnected(onConnected);
            api.offClientConnectionFailure(onConnectionFailure);
            api.offClientStatusChange(onStatusChange);
            api.offClientLoadingFileStatusChange(onLoadingFileStatusChange);
            api.offClientServerSharedFilesChange(onServerSharedFilesChange);
        };
    }, []);

    const isConnected = status === 'connected';
    const isDisconnected = status === 'disconnected' || status === 'connectionFailure';

    return (
        <SocketClientContext.Provider
            value={{
                peerUrlText,
                setPeerUrlText,
                status,
                isFilesLoading,
                sharedFiles,
                filesPath,
                changeFilesPath: (newPath: string) => {
                    setIsFilesLoading(true);
                    window.electronAPI.setClientServerFilesPath(newPath.replaceAll('//', '/'));
                },
                connect: () => {
                    setIsLoading(true);
                    window.electronAPI.connectClient(peerUrlText);
                },
                disconnect: () => {
                    setIsLoading(true);
                    window.electronAPI.disconnectClient();
                },
                isConnected,
                isDisconnected,
                isLoading,
            }}
        >
            {children}
        </SocketClientContext.Provider>
    );
}

export function useSocketClient() {
    const ctx = useContext(SocketClientContext);
    if (!ctx) throw new Error('useSocketClient must be used inside SocketClientProvider');
    return ctx;
}
