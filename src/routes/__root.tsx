import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import React from 'react';
import RootContainer from '../components/root/root-container';

export const Route = createRootRoute({
    component: () => (
        <>
            <RootContainer>
                <Outlet />
            </RootContainer>
            <TanStackRouterDevtools />
        </>
    ),
});
