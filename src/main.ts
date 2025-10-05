import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import ServerSocketManager from './utils/socket/server/server-socket-manager';
import ClientSocketManager from './utils/socket/client/client-socket-manager';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

let mainWindowRef: BrowserWindow | null = null;

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1548,
        height: 800,
        minHeight: 700,
        minWidth: 1000,
        icon: path.join(__dirname, 'favicon.ico'),
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#101010',
            symbolColor: '#e1e1e1',
            height: 56,
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            devTools: true,
            webSecurity: false,
        },
    });
    // mainWindow.setMenu(null);

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindowRef = null;
    });

    // keep a reference for IPC event routing
    mainWindowRef = mainWindow;
};

// Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('server:start', (_event, portStr: string) => ServerSocketManager.start(portStr));
ipcMain.handle('server:stop', () => ServerSocketManager.closeServer());
ipcMain.handle('client:connect', (_event, peerUrl: string) => ClientSocketManager.connect(peerUrl));
ipcMain.handle('client:disconnect', () => ClientSocketManager.disconnect());
ipcMain.handle('client:getPeerUrl', () => ClientSocketManager.getPeerUrl());
ipcMain.handle('client:getStatus', () => ClientSocketManager.getClientStatus());
ipcMain.handle('client:getSharedFiles', () => ClientSocketManager.getServerSharedFiles());
ipcMain.handle('client:getServerFilesPath', () => ClientSocketManager.getServerFilesPath());
ipcMain.handle('client:setServerFilesPath', (_event, path: string) => ClientSocketManager.setServerFilesPath(path));
ipcMain.handle('client:downloadFile', async (_event, fileName: string) => {
    const ext = path.extname(fileName);
    const options: Electron.SaveDialogOptions = { defaultPath: fileName } as any;
    if (ext) {
        const extNoDot = ext.slice(1);
        options.filters = [
            { name: `${extNoDot.toUpperCase()} files`, extensions: [extNoDot] },
            { name: 'All Files', extensions: ['*'] },
        ];
    }
    const result = await dialog.showSaveDialog(options);
    if (result.canceled || !result.filePath) return false;
    let savePath = result.filePath;
    if (ext && !savePath.toLowerCase().endsWith(ext.toLowerCase())) {
        savePath += ext;
    }
    ClientSocketManager.startDownload(fileName, savePath);
    return true;
});
ipcMain.handle('server:getPort', () => ServerSocketManager.getPort());
ipcMain.handle('server:getStatus', () => ServerSocketManager.getServerStatus());
ipcMain.handle('server:getClients', () => ServerSocketManager.getClients());
ipcMain.handle('server:getSharedFolders', () => ServerSocketManager.getSharedFolders());
ipcMain.handle('server:addSharedFolders', (_event, folders: string[]) => ServerSocketManager.addSharedFolders(folders));
ipcMain.handle('server:setSharedFolders', (_event, folders: string[]) => ServerSocketManager.setSharedFolders(folders));
ipcMain.handle('server:removeSharedFolder', (_event, folder: string) => ServerSocketManager.removeSharedFolder(folder));

ipcMain.handle('pickFolders', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) return undefined;
    return result.filePaths;
});
ipcMain.handle('getFilesPaths', (_event, files: File[]) => files.map((file) => file.path));

ServerSocketManager.on('started', (payload) => mainWindowRef?.webContents.send('server:started', payload))
    .on('stopped', (payload) => mainWindowRef?.webContents.send('server:stopped', payload))
    .on('crashed', (payload) => mainWindowRef?.webContents.send('server:crashed', payload))
    .on('message', (payload) => mainWindowRef?.webContents.send('server:message', payload))
    .on('statusChange', (payload) => mainWindowRef?.webContents.send('server:statusChange', payload))
    .on('clientsUpdate', (payload) => mainWindowRef?.webContents.send('server:clientsUpdate', payload))
    .on('sharedFoldersUpdate', (payload) => mainWindowRef?.webContents.send('server:sharedFoldersUpdate', payload));

ClientSocketManager.on('connected', (payload) => mainWindowRef?.webContents.send('client:connected', payload))
    .on('disconnected', (payload) => mainWindowRef?.webContents.send('client:disconnected', payload))
    .on('connectionFailure', (payload) => mainWindowRef?.webContents.send('client:connectionFailure', payload))
    .on('message', (payload) => mainWindowRef?.webContents.send('client:message', payload))
    .on('statusChange', (payload) => mainWindowRef?.webContents.send('client:statusChange', payload))
    .on('serverSharedFilesChange', (payload) =>
        mainWindowRef?.webContents.send('client:serverSharedFilesChange', payload),
    )
    .on('loadingFileStatusChange', (payload) =>
        mainWindowRef?.webContents.send('client:loadingFileStatusChange', payload),
    )
    .on('downloadProgress', (payload) => mainWindowRef?.webContents.send('client:downloadProgress', payload))
    .on('downloadSuccess', (payload) => mainWindowRef?.webContents.send('client:downloadSuccess', payload));
