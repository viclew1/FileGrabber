// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

export default defineConfig({
    plugins: [
        // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        react(),
    ],
    build: {
        rollupOptions: {
            external: ['utf-8-validate'],
        },
    },
});
