'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { ConnectionProvider } from './contexts/connection-context';

const queryClient = new QueryClient();

export function ClientProviders({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <Theme appearance={'dark'} accentColor={'red'}>
            <QueryClientProvider client={queryClient}>
                <ConnectionProvider>{children}</ConnectionProvider>
            </QueryClientProvider>
        </Theme>
    );
}
