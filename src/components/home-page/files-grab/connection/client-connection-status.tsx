import { useSocketClient } from '../../../../contexts/socket-client-context';
import { Badge, Flex, Text } from '@radix-ui/themes';

export default function ClientConnectionStatus() {
    return (
        <Flex align={'center'} gap={'1'} width={'fit-content'}>
            <Text size={'2'}>Connection status:</Text>
            <ConnectionBadge />
        </Flex>
    );
}

function ConnectionBadge() {
    const { status } = useSocketClient();
    if (status === 'connecting') {
        return <Badge color={'orange'}>Connecting</Badge>;
    } else if (status === 'disconnecting') {
        return <Badge color={'orange'}>Disconnecting</Badge>;
    } else if (status === 'connected') {
        return <Badge color={'green'}>Connected</Badge>;
    } else if (status === 'disconnected') {
        return <Badge color={'red'}>Disconnected</Badge>;
    } else if (status === 'connectionFailure') {
        return <Badge color={'red'}>Connection failure</Badge>;
    }
    return <Badge color="violet">???</Badge>;
}
