import ServerConfigInput from './server/server-config-input';
import ServerStatusBadge from './server/server-status-badge';
import FilesConfigContainer from '../files-config-container';
import VerticalFlex from '../../custom/base/flex/vertical-flex';
import ServerClientsInfo from './server/clients/server-clients-info';
import SmallTitle from '../../custom/base/text/small-title';
import { Box, Flex, ScrollArea, Separator, Text } from '@radix-ui/themes';
import SharedFoldersInput from './server/files/shared-folders-input';
import { useSocketServer } from '../../../contexts/socket-server-context';
import SharedFoldersList from './server/files/shared-folders-list';

export default function FilesShareContainer() {
    return (
        <FilesConfigContainer title={'Server config'}>
            <VerticalFlex gap={'5'} height={'100%'} minHeight={'0'}>
                <FilesShareHeader />
                <FilesFolderContainer />
                <ClientsInfoContainer />
            </VerticalFlex>
        </FilesConfigContainer>
    );
}

function FilesShareHeader() {
    return (
        <VerticalFlex gap={'1'}>
            <Flex gap={'1'} align={'center'}>
                <SmallTitle>Availability status:</SmallTitle>
                <ServerStatusBadge />
            </Flex>
            <ServerConfigInput />
        </VerticalFlex>
    );
}

function FilesFolderContainer() {
    return (
        <VerticalFlex gap={'1'} p={'3'} height={'14rem'} minHeight={'14rem'} className={'defaultBorder'}>
            <SmallTitle>Shared folders:</SmallTitle>
            <Separator orientation={'horizontal'} size={'3'} />
            <Flex height={'100%'} minHeight={'0'} width={'100%'} gap={'3'}>
                <SharedFoldersInput />
                <Flex height={'100%'} width={'100%'} align={'center'} justify={'center'}>
                    <SharedFoldersSection />
                </Flex>
            </Flex>
        </VerticalFlex>
    );
}

function SharedFoldersSection() {
    const { sharedFolders } = useSocketServer();
    if (!sharedFolders.length) {
        return <Text>No folder shared yet.</Text>;
    }
    return (
        <ScrollArea type={'always'} scrollbars={'vertical'}>
            <Box pr={'5'}>
                <SharedFoldersList />
            </Box>
        </ScrollArea>
    );
}

function ClientsInfoContainer() {
    const { isStarted } = useSocketServer();
    return (
        <VerticalFlex minHeight={'0'} height={'100%'} className={'defaultBorder'}>
            <VerticalFlex
                minHeight={'0'}
                height={'100%'}
                p={'3'}
                gap={'1'}
                style={{ opacity: isStarted ? '1' : '0.4' }}
            >
                <SmallTitle>Connected clients:</SmallTitle>
                <Separator orientation={'horizontal'} size={'3'} />
                <ScrollArea type={'always'} scrollbars={'vertical'}>
                    <Box pr={'5'}>
                        <ServerClientsInfo />
                    </Box>
                </ScrollArea>
            </VerticalFlex>
        </VerticalFlex>
    );
}
