import React, { createContext, useContext, useEffect, useState } from 'react';
import ClientSocketManager from '../utils/socket/client/client-socket-manager';
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

    useEffect(() => {
        ClientSocketManager.on('connected', onConnected);
        ClientSocketManager.on('disconnected', onDisconnected);
        ClientSocketManager.on('connectionFailure', onConnectionFailure);

        return () => {
            ClientSocketManager.off('connected', onConnected);
            ClientSocketManager.off('disconnected', onDisconnected);
            ClientSocketManager.off('connectionFailure', onConnectionFailure);
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
                    ClientSocketManager.connect(peerUrlText);
                },
                disconnect: () => {
                    setStatus('disconnecting');
                    ClientSocketManager.disconnect();
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
