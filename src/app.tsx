import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ClientProviders } from './client-providers';
import { Toaster } from 'react-hot-toast';

const router = createRouter({
    routeTree,
    context: {},
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const root = createRoot(document.body);
root.render(
    <ClientProviders>
        <RouterProvider router={router} />
        <Toaster
            toastOptions={{
                style: {
                    backgroundColor: 'var(--color-background-lighter)',
                    border: '1px solid var(--color-background-lighter)',
                    borderRadius: 'var(--radius-1)',
                    color: 'white',
                },
            }}
        />
    </ClientProviders>,
);
