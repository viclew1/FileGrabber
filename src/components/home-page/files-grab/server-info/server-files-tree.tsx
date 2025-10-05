import { Flex, Text } from '@radix-ui/themes';
import { useSocketClient } from '../../../../contexts/socket-client-context';
import VerticalFlex from '../../../custom/base/flex/vertical-flex';
import SoftButton from '../../../custom/base/buttons/soft-button';
import { FileIcon, FolderIcon, StepBackIcon } from 'lucide-react';
import { sortBy } from 'lodash';
import { ACCENT_11 } from '../../../../app_constants';

export default function ServerFilesTree() {
    const { sharedFiles, filesPath, changeFilesPath } = useSocketClient();
    const sortedFiles = sortBy(
        sharedFiles,
        (file) => file.type !== 'folder',
        (file) => file.fileName,
    );
    return (
        <VerticalFlex gap={'1'}>
            <Flex align={'center'} gap={'3'}>
                <SoftButton
                    disabled={filesPath === '/'}
                    onClick={() => changeFilesPath(filesPath.split('/').slice(0, -1).join('/'))}
                >
                    <StepBackIcon />
                </SoftButton>
                <Text>{filesPath}</Text>
            </Flex>
            {sortedFiles.map((file) => (
                <Flex
                    onClick={() => {
                        if (file.type === 'folder') {
                            changeFilesPath(filesPath + '/' + file.fileName);
                        }
                    }}
                    gap={'3'}
                    key={file.fileName}
                >
                    {file.type === 'folder' ? <FolderIcon size={20} color={ACCENT_11} /> : <FileIcon size={20} />}
                    <Text> {file.fileName}</Text>
                </Flex>
            ))}
        </VerticalFlex>
    );
}
