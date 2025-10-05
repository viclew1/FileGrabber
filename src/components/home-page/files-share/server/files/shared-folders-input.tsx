import { Text } from '@radix-ui/themes';
import React, { useState } from 'react';
import DragNDropFlex from '../../../../custom/drag-n-drop/drag-n-drop-flex';
import classNames from 'classnames';
import styles from './shared-folders-input.module.css';
import { useSocketServer } from '../../../../../contexts/socket-server-context';

export default function SharedFoldersInput() {
    const { addSharedFolders } = useSocketServer();
    const [isDragActive, setIsDragActive] = useState(false);
    const text = isDragActive ? 'Drop the folders here ...' : 'Drop folders to share here, or click to select folders';
    const onItemsDrop = async (files: File[]) => {
        console.log('Dropped files:', files);
    };
    return (
        <DragNDropFlex
            onDragActiveChange={setIsDragActive}
            onClick={async () => {
                const folders = await pickFolders();
                if (folders.length) {
                    addSharedFolders(folders);
                }
            }}
            onItemsDrop={onItemsDrop}
            className={classNames(styles.dropZone, { [styles.dragActive]: isDragActive })}
        >
            <Text align={'center'}>{text}</Text>
        </DragNDropFlex>
    );
}

async function pickFolders(): Promise<string[]> {
    return (await window.electronAPI.pickFolders()) ?? [];
}
