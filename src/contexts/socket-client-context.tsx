import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    ClientConnectedEvent,
    ClientConnectionFailureEvent,
    ClientSocketManagerStatus,
} from '../utils/socket/client/client-socket-manager-types';

type SocketClientContextType = {
    peerUrlText: string;
    setPeerUrlText: React.Dispatch<React.SetStateAction<string>>;
    status: ClientSocketManagerStatus;
    connect: () => void;
    disconnect: () => void;
    isConnected: boolean;
    isDisconnected: boolean;
    isLoading: boolean;
};

const SocketClientContext = createContext<SocketClientContextType | undefined>(undefined);

export function SocketClientProvider({ children }: { children: React.ReactNode }) {
    const [peerUrlText, setPeerUrlText] = useState('');
    const [status, setStatus] = useState<ClientSocketManagerStatus>('disconnected');

    useEffect(() => {
        const api = window.electronAPI;

        (async () => {
            const [peerUrl, currentStatus] = await Promise.all([api.getClientPeerUrl(), api.getClientStatus()]);
            if (peerUrl) setPeerUrlText(peerUrl);
            setStatus(currentStatus);
        })();

        const onConnected = (event: ClientConnectedEvent) => {
            setPeerUrlText(event.peerUrl);
            setStatus('connected');
        };

        const onDisconnected = () => {
            setStatus('disconnected');
        };

        const onConnectionFailure = (event: ClientConnectionFailureEvent) => {
            console.error('Connection failure:', event.error);
            setStatus('connectionFailure');
        };

        const connectedHandler = (payload: ClientConnectedEvent) => onConnected(payload);
        const disconnectedHandler = (_payload?: undefined) => onDisconnected();
        const failureHandler = (payload: ClientConnectionFailureEvent) => onConnectionFailure(payload);
        api.onClientConnected(connectedHandler);
        api.onClientDisconnected(disconnectedHandler as any);
        api.onClientConnectionFailure(failureHandler);

        return () => {
            api.offClientConnected(connectedHandler as any);
            api.offClientDisconnected(disconnectedHandler as any);
            api.offClientConnectionFailure(failureHandler as any);
        };
    }, []);

    const isConnected = status === 'connected';
    const isDisconnected = status === 'disconnected' || status === 'connectionFailure';
    const isLoading = status === 'connecting' || status === 'disconnecting';

    return (
        <SocketClientContext.Provider
            value={{
                peerUrlText,
                setPeerUrlText,
                status,
                connect: () => {
                    setStatus('connecting');
                    window.electronAPI.connectClient(peerUrlText);
                },
                disconnect: () => {
                    setStatus('disconnecting');
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
