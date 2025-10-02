import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketManager from '../utils/socket/socket-manager';
import { ConnectedEvent, ConnectionFailureEvent, SocketManagerStatus } from '../utils/socket/socket-manager-types';

type ConnectionContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    peerIpText: string;
    setPeerIpText: React.Dispatch<React.SetStateAction<string>>;
    status: SocketManagerStatus;
    connect: () => void;
    disconnect: () => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [peerIpText, setPeerIpText] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<SocketManagerStatus>('disconnected');

    const onConnected = (event: ConnectedEvent) => {
        setStatus('connected');
        setPeerIpText(event.peerIp);
        setLoading(false);
    };

    const onDisconnected = () => {
        setStatus('disconnected');
        setLoading(false);
    };

    const onConnectionFailure = (event: ConnectionFailureEvent) => {
        console.error('Connection failure:', event.error);
        setStatus('connectionFailure');
        setLoading(false);
    };

    useEffect(() => {
        SocketManager.on('connected', onConnected);
        SocketManager.on('disconnected', onDisconnected);
        SocketManager.on('connectionFailure', onConnectionFailure);

        return () => {
            SocketManager.off('connected', onConnected);
            SocketManager.off('disconnected', onDisconnected);
            SocketManager.off('connectionFailure', onConnectionFailure);
        };
    }, []);

    return (
        <ConnectionContext.Provider
            value={{
                peerIpText,
                setPeerIpText,
                loading,
                setLoading,
                status,
                connect: () => {
                    setLoading(true);
                    setStatus('connecting');
                    SocketManager.connect(peerIpText);
                },
                disconnect: () => {
                    setLoading(true);
                    setStatus('disconnecting');
                    SocketManager.disconnect();
                },
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    const ctx = useContext(ConnectionContext);
    if (!ctx) throw new Error('useConnection must be used inside ConnectionProvider');
    return ctx;
}
