import ClientConnectionInput from './connection/client-connection-input';
import ClientConnectionStatusBadge from './connection/client-connection-status-badge';
import FilesConfigContainer from '../files-config-container';
import VerticalFlex from '../../custom/base/flex/vertical-flex';
import SmallTitle from '../../custom/base/text/small-title';
import { Box, Flex, ScrollArea, Separator, Spinner } from '@radix-ui/themes';
import ServerFilesTree from './server-info/server-files-tree';
import { useSocketClient } from '../../../contexts/socket-client-context';

export default function FilesGrabContainer() {
    return (
        <FilesConfigContainer title={'Client config'}>
            <FilesGrabHeader />
            <MainContent />
        </FilesConfigContainer>
    );
}

function FilesGrabHeader() {
    return (
        <VerticalFlex gap={'1'}>
            <Flex gap={'1'} align={'center'}>
                <SmallTitle>Connection status:</SmallTitle>
                <ClientConnectionStatusBadge />
            </Flex>
            <ClientConnectionInput />
        </VerticalFlex>
    );
}

function MainContent() {
    const { isConnected, isLoading } = useSocketClient();
    return (
        <VerticalFlex
            height={'100%'}
            minHeight={'0'}
            gap={'1'}
            p={'3'}
            className={'defaultBorder'}
            style={{ opacity: isConnected ? '1' : '0.4' }}
        >
            <SmallTitle>Files explorer:</SmallTitle>
            <Separator orientation={'horizontal'} size={'3'} />
            <VerticalFlex height={'100%'} minHeight={'0'} gap={'3'}>
                <ScrollArea type={'always'} scrollbars={'vertical'}>
                    <Box pr={'5'}>
                        <MainContentFilesTree />
                    </Box>
                </ScrollArea>
            </VerticalFlex>
        </VerticalFlex>
    );
}

function MainContentFilesTree() {
    const { isLoading } = useSocketClient();
    if (isLoading) {
        return <Spinner size={'3'} />;
    }
    return <ServerFilesTree />;
}
