'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { SocketClientProvider } from './contexts/socket-client-context';
import { SocketServerProvider } from './contexts/socket-server-context';

const queryClient = new QueryClient();

export function ClientProviders({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <Theme appearance={'dark'} accentColor={'red'}>
            <QueryClientProvider client={queryClient}>
                <SocketServerProvider>
                    <SocketClientProvider>{children}</SocketClientProvider>
                </SocketServerProvider>
            </QueryClientProvider>
        </Theme>
    );
}
