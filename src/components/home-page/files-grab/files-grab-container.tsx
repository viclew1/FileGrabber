import ClientConnectionInput from './connection/client-connection-input';
import ClientConnectionStatusBadge from './connection/client-connection-status-badge';
import FilesConfigContainer from '../files-config-container';
import VerticalFlex from '../../custom/base/flex/vertical-flex';
import SmallTitle from '../../custom/base/text/small-title';
import { Box, Flex, ScrollArea, Separator, Spinner, Text } from '@radix-ui/themes';
import ServerFilesTree from './server-info/server-files-tree';
import { useSocketClient } from '../../../contexts/socket-client-context';
import styles from './files-grab-container.module.css';
import classNames from 'classnames';
import { ACCENT_11 } from '../../../app_constants';

export default function FilesGrabContainer() {
    return (
        <VerticalFlex gap={'3'}>
            <FilesConfigContainer title={'Client config'}>
                <FilesGrabHeader />
                <MainContent />
            </FilesConfigContainer>
            <DownloadsBar />
        </VerticalFlex>
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
    const { isConnected } = useSocketClient();
    return (
        <VerticalFlex
            height={'100%'}
            minHeight={'0'}
            gap={'1'}
            className={'defaultBorder'}
            style={{ opacity: isConnected ? '1' : '0.4' }}
        >
            <VerticalFlex gap={'1'} p={'3'} height={'100%'} minHeight={'0'}>
                <SmallTitle>Files explorer:</SmallTitle>
                <Separator orientation={'horizontal'} size={'3'} />
                <VerticalFlex height={'100%'} minHeight={'0'} gap={'3'}>
                    <ScrollArea type={'always'} scrollbars={'vertical'} className={styles.scrollAreaFix}>
                        <Box pr={'5'}>
                            <MainContentFilesTree />
                        </Box>
                    </ScrollArea>
                </VerticalFlex>
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

function DownloadsBar() {
    const { downloads } = useSocketClient();
    console.log(downloads.length);

    if (!downloads || downloads.length === 0) return null;

    return (
        <VerticalFlex
            gap={'2'}
            className={classNames('darkerBackground', 'defaultBorder')}
            p={'3'}
            minHeight={'0'}
            flexShrink={'0'}
            height={'fit-content'}
            maxHeight={'10rem'}
        >
            <SmallTitle>Downloads</SmallTitle>
            <ScrollArea type={'always'} scrollbars={'vertical'}>
                <VerticalFlex gap={'2'} pr={'5'}>
                    {downloads.map((d) => (
                        <DownloadItem
                            key={d.fileName}
                            fileName={d.fileName}
                            progress={d.progress}
                            received={d.receivedBytes}
                            total={d.totalBytes}
                        />
                    ))}
                </VerticalFlex>
            </ScrollArea>
        </VerticalFlex>
    );
}

function DownloadItem({
    fileName,
    progress,
    received,
    total,
}: {
    fileName: string;
    progress: number;
    received: number;
    total: number;
}) {
    const percent = Math.round((progress || 0) * 100);
    const humanize = (n: number) => {
        if (!n || n < 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let value = n;
        while (value >= 1024 && i < units.length - 1) {
            value /= 1024;
            i++;
        }
        return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[i]}`;
    };

    return (
        <Flex direction="column" gap="1" p="2" style={{ borderRadius: 6 }}>
            <Flex align="center" gap="2" minWidth={'0'}>
                <Text style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fileName}
                </Text>
                <Text color="gray">{percent}%</Text>
            </Flex>
            <Flex
                width={'100%'}
                height={'0.6rem'}
                style={{ borderRadius: 999 }}
                className={classNames('darkestBackground', 'defaultBorder')}
            >
                <Flex
                    style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: ACCENT_11,
                        borderRadius: 999,
                        transition: 'width 120ms linear',
                    }}
                />
            </Flex>
            <Text color="gray" size="1">
                {humanize(received)} {total > 0 ? `/ ${humanize(total)}` : ''}
            </Text>
        </Flex>
    );
}
