import { Flex, Separator, Spinner, Text } from '@radix-ui/themes';
import { useSocketClient } from '../../../../contexts/socket-client-context';
import VerticalFlex from '../../../custom/base/flex/vertical-flex';
import SoftButton from '../../../custom/base/buttons/soft-button';
import { DownloadIcon, FileIcon, FolderIcon, HomeIcon, StepBackIcon } from 'lucide-react';
import { partition, sortBy } from 'lodash';
import { ACCENT_11, MINT_ACCENT_11 } from '../../../../app_constants';
import { ClientServerSharedFile } from '../../../../utils/socket/client/client-socket-manager-types';
import TooltipContainer from '../../../custom/base/tooltip/tooltip-container';
import { ReactNode } from 'react';

export default function ServerFilesTree() {
    const { filesPath, changeFilesPath, isFilesLoading } = useSocketClient();

    const onBackClick = () => {
        changeFilesPath(filesPath.split('/').slice(0, -1).join('/'));
    };

    const onHomeClick = () => {
        changeFilesPath('/');
    };

    const pathParts = filesPath.split('/');
    if (pathParts[pathParts.length - 1] === '') {
        pathParts.pop();
    }
    const currentDir = pathParts.pop();
    const path = pathParts.join('/');

    return (
        <VerticalFlex gap={'1'}>
            <Flex align={'center'}>
                <Flex gap="3" pr={'3'}>
                    <TooltipContainer tooltipContent={'Back to root'}>
                        <SoftButton disabled={isFilesLoading || filesPath === '/'} onClick={onHomeClick}>
                            <HomeIcon />
                        </SoftButton>
                    </TooltipContainer>
                    <TooltipContainer tooltipContent={'Back to parent folder'}>
                        <SoftButton disabled={isFilesLoading || filesPath === '/'} onClick={onBackClick}>
                            <StepBackIcon />
                        </SoftButton>
                    </TooltipContainer>
                </Flex>
                <Text
                    style={{
                        direction: 'rtl',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    color={'gray'}
                >
                    {path}
                </Text>
                <Text weight={'bold'}>{currentDir}/</Text>
            </Flex>
            <Separator orientation={'horizontal'} size={'4'} />
            <FilesList />
        </VerticalFlex>
    );
}

function FilesList() {
    const { sharedFiles, filesPath, changeFilesPath, isFilesLoading, downloadFile } = useSocketClient();

    if (isFilesLoading) {
        return <Spinner size={'3'} />;
    }
    const sortedFiles = sortBy(
        sharedFiles,
        (file) => file.type !== 'folder',
        (file) => file.fileName,
    );

    const [files, folders] = partition(sortedFiles, (file) => file.type === 'file');

    const onFolderClick = (folder: ClientServerSharedFile) => {
        changeFilesPath(filesPath + '/' + folder.fileName);
    };

    const onDownloadClick = (file: ClientServerSharedFile) => {
        downloadFile(file.fileName);
    };

    return (
        <VerticalFlex gap={'1'}>
            {folders.map((folder) => (
                <FolderCard
                    key={folder.fileName}
                    folder={folder}
                    onFolderClick={onFolderClick}
                    downloadFile={onDownloadClick}
                />
            ))}
            {files.length !== 0 && folders.length !== 0 && (
                <Flex p={'2'}>
                    <Separator orientation={'horizontal'} size={'3'} />
                </Flex>
            )}
            {files.map((folder) => (
                <FileCard
                    key={folder.fileName}
                    file={folder}
                    onFileClick={onDownloadClick}
                    downloadFile={onDownloadClick}
                />
            ))}
        </VerticalFlex>
    );
}

function FolderCard({
    folder,
    onFolderClick,
    downloadFile,
}: {
    folder: ClientServerSharedFile;
    onFolderClick: (folder: ClientServerSharedFile) => void;
    downloadFile: (folder: ClientServerSharedFile) => void;
}) {
    return (
        <GeneralFileCard file={folder} onClick={onFolderClick} downloadFile={downloadFile}>
            <FolderIcon size={20} color={ACCENT_11} />
            <Text style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {folder.fileName}
            </Text>
        </GeneralFileCard>
    );
}

function FileCard({
    file,
    onFileClick,
    downloadFile,
}: {
    file: ClientServerSharedFile;
    onFileClick: (file: ClientServerSharedFile) => void;
    downloadFile: (file: ClientServerSharedFile) => void;
}) {
    return (
        <GeneralFileCard file={file} onClick={onFileClick} downloadFile={downloadFile}>
            <FileIcon size={20} color={MINT_ACCENT_11} />
            <Text style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.fileName}
            </Text>
        </GeneralFileCard>
    );
}

function GeneralFileCard({
    file,
    onClick,
    downloadFile,
    children,
}: {
    file: ClientServerSharedFile;
    onClick: (file: ClientServerSharedFile) => void;
    downloadFile: (file: ClientServerSharedFile) => void;
    children: ReactNode;
}) {
    return (
        <Flex
            width={'100%'}
            minWidth={'0'}
            style={{ cursor: 'pointer' }}
            gap={'3'}
            key={file.fileName}
            align={'center'}
        >
            <SoftButton color={'mint'} onClick={() => downloadFile(file)}>
                <DownloadIcon size={20} />
            </SoftButton>
            <Flex align={'center'} gap={'3'} width={'100%'} minWidth={'0'} onClick={() => onClick(file)}>
                {children}
            </Flex>
        </Flex>
    );
}
