import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ClientConnectedEvent,
    ClientConnectionFailureEvent,
    ClientLoadingFilesStatusChangeEvent,
    ClientServerSharedFile,
    ClientServerSharedFilesChangeEvent,
    ClientSocketManagerStatus,
    ClientStatusChangeEvent,
    ClientDownloadProgressEvent,
} from '../utils/socket/client/client-socket-manager-types';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/local-storage/local-storage.utils';

type SocketClientContextType = {
    peerUrlText: string;
    setPeerUrlText: React.Dispatch<React.SetStateAction<string>>;
    status: ClientSocketManagerStatus;
    sharedFiles: ClientServerSharedFile[];
    filesPath: string;
    downloads: ClientDownloadProgressEvent[];
    downloadFile: (fileName: string) => void;
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
    const [downloadsByFile, setDownloadsByFile] = useState<Record<string, ClientDownloadProgressEvent>>({});

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
            setIsFilesLoading(false);
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

        const onDownloadProgress = (event: ClientDownloadProgressEvent) => {
            setDownloadsByFile((prev) => {
                const next = { ...prev };
                const completed = event.progress >= 1 || (event.totalBytes > 0 && event.receivedBytes >= event.totalBytes);
                if (completed) {
                    delete next[event.fileName];
                } else {
                    next[event.fileName] = event;
                }
                return next;
            });
        };

        const onDisconnected = () => {
            setDownloadsByFile({});
        };

        api.onClientConnected(onConnected);
        api.onClientDisconnected(onDisconnected);
        api.onClientConnectionFailure(onConnectionFailure);
        api.onClientStatusChange(onStatusChange);
        api.onClientLoadingFileStatusChange(onLoadingFileStatusChange);
        api.onClientServerSharedFilesChange(onServerSharedFilesChange);
        api.onClientDownloadProgress(onDownloadProgress);

        return () => {
            api.offClientConnected(onConnected);
            api.offClientDisconnected(onDisconnected);
            api.offClientConnectionFailure(onConnectionFailure);
            api.offClientStatusChange(onStatusChange);
            api.offClientLoadingFileStatusChange(onLoadingFileStatusChange);
            api.offClientServerSharedFilesChange(onServerSharedFilesChange);
            api.offClientDownloadProgress(onDownloadProgress);
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
                downloads: Object.values(downloadsByFile),
                downloadFile: async (fileName: string) => {
                    await window.electronAPI.downloadFile(fileName);
                },
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
