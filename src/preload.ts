// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: (port: string) => ipcRenderer.invoke('server:start', port),
    stopServer: () => ipcRenderer.invoke('server:stop'),
    connectClient: (url: string) => ipcRenderer.invoke('client:connect', url),
    disconnectClient: () => ipcRenderer.invoke('client:disconnect'),
    getServerPort: () => ipcRenderer.invoke('server:getPort'),
    getServerStatus: () => ipcRenderer.invoke('server:getStatus'),
    getServerClients: () => ipcRenderer.invoke('server:getClients'),
    getServerSharedFolders: () => ipcRenderer.invoke('server:getSharedFolders'),
    getClientPeerUrl: () => ipcRenderer.invoke('client:getPeerUrl'),
    getClientStatus: () => ipcRenderer.invoke('client:getStatus'),
    getClientSharedFiles: () => ipcRenderer.invoke('client:getSharedFiles'),
    getClientServerFilesPath: () => ipcRenderer.invoke('client:getServerFilesPath'),
    setClientServerFilesPath: (path: string) => ipcRenderer.invoke('client:setServerFilesPath', path),
    addSharedFolders: (folders: string[]) => ipcRenderer.invoke('server:addSharedFolders', folders),
    setSharedFolders: (folders: string[]) => ipcRenderer.invoke('server:setSharedFolders', folders),
    removeSharedFolder: (folder: string) => ipcRenderer.invoke('server:removeSharedFolder', folder),

    pickFolders: () => ipcRenderer.invoke('pickFolders'),
    getFilesPaths: (files: File[]) => ipcRenderer.invoke('getFilesPaths', files),

    onServerStarted: (cb: (payload: any) => void) => ipcRenderer.on('server:started', (_e, p) => cb(p)),
    onServerStopped: (cb: (payload: any) => void) => ipcRenderer.on('server:stopped', (_e, p) => cb(p)),
    onServerCrashed: (cb: (payload: any) => void) => ipcRenderer.on('server:crashed', (_e, p) => cb(p)),
    onServerMessage: (cb: (payload: any) => void) => ipcRenderer.on('server:message', (_e, p) => cb(p)),
    onServerStatusChange: (cb: (payload: any) => void) => ipcRenderer.on('server:statusChange', (_e, p) => cb(p)),
    onServerClientsUpdate: (cb: (payload: any) => void) => ipcRenderer.on('server:clientsUpdate', (_e, p) => cb(p)),
    onServerSharedFilesUpdate: (cb: (payload: any) => void) =>
        ipcRenderer.on('server:sharedFoldersUpdate', (_e, p) => cb(p)),

    onClientConnected: (cb: (payload: any) => void) => ipcRenderer.on('client:connected', (_e, p) => cb(p)),
    onClientDisconnected: (cb: (payload: any) => void) => ipcRenderer.on('client:disconnected', (_e, p) => cb(p)),
    onClientConnectionFailure: (cb: (payload: any) => void) =>
        ipcRenderer.on('client:connectionFailure', (_e, p) => cb(p)),
    onClientMessage: (cb: (payload: any) => void) => ipcRenderer.on('client:message', (_e, p) => cb(p)),
    onClientStatusChange: (cb: (payload: any) => void) => ipcRenderer.on('client:statusChange', (_e, p) => cb(p)),
    onClientServerSharedFilesChange: (cb: (payload: any) => void) =>
        ipcRenderer.on('client:serverSharedFilesChange', (_e, p) => cb(p)),
    onClientLoadingFileStatusChange: (cb: (payload: any) => void) =>
        ipcRenderer.on('client:loadingFileStatusChange', (_e, p) => cb(p)),

    offServerStarted: (cb: (...args: any[]) => void) => ipcRenderer.off('server:started', cb as any),
    offServerStopped: (cb: (...args: any[]) => void) => ipcRenderer.off('server:stopped', cb as any),
    offServerCrashed: (cb: (...args: any[]) => void) => ipcRenderer.off('server:crashed', cb as any),
    offServerMessage: (cb: (...args: any[]) => void) => ipcRenderer.off('server:message', cb as any),
    offServerStatusChange: (cb: (...args: any[]) => void) => ipcRenderer.off('server:statusChange', cb as any),
    offServerClientsUpdate: (cb: (...args: any[]) => void) => ipcRenderer.off('server:clientsUpdate', cb as any),
    offServerSharedFilesUpdate: (cb: (...args: any[]) => void) =>
        ipcRenderer.off('server:sharedFoldersUpdate', cb as any),

    offClientConnected: (cb: (...args: any[]) => void) => ipcRenderer.off('client:connected', cb as any),
    offClientDisconnected: (cb: (...args: any[]) => void) => ipcRenderer.off('client:disconnected', cb as any),
    offClientConnectionFailure: (cb: (...args: any[]) => void) =>
        ipcRenderer.off('client:connectionFailure', cb as any),
    offClientMessage: (cb: (...args: any[]) => void) => ipcRenderer.off('client:message', cb as any),
    offClientStatusChange: (cb: (...args: any[]) => void) => ipcRenderer.off('client:statusChange', cb as any),
    offClientServerSharedFilesChange: (cb: (...args: any[]) => void) =>
        ipcRenderer.off('client:serverSharedFilesChange', cb as any),
    offClientLoadingFileStatusChange: (cb: (...args: any[]) => void) =>
        ipcRenderer.off('client:loadingFileStatusChange', cb as any),
});
