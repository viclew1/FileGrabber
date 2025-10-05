import { useSocketClient } from '../../../../contexts/socket-client-context';
import { Badge, Flex } from '@radix-ui/themes';

export default function ClientConnectionStatusBadge() {
    return (
        <Flex>
            <ConnectionBadge />
        </Flex>
    );
}

function ConnectionBadge() {
    const { status, isLoading } = useSocketClient();
    if (isLoading) {
        return <Badge color={'orange'}>Loading...</Badge>;
    } else if (status === 'connected') {
        return <Badge color={'mint'}>Connected</Badge>;
    } else if (status === 'disconnected') {
        return <Badge color={'red'}>Disconnected</Badge>;
    } else if (status === 'connectionFailure') {
        return <Badge color={'red'}>Connection failure</Badge>;
    }
    return <Badge color="violet">???</Badge>;
}
