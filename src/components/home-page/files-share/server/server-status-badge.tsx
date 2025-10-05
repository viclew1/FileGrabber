import { Badge, Flex } from '@radix-ui/themes';
import { useSocketServer } from '../../../../contexts/socket-server-context';

export default function ServerStatusBadge() {
    return (
        <Flex>
            <ConnectionBadge />
        </Flex>
    );
}

function ConnectionBadge() {
    const { status, isLoading } = useSocketServer();
    if (isLoading) {
        return <Badge color={'orange'}>Starting</Badge>;
    } else if (status === 'ready') {
        return <Badge color={'mint'}>Ready</Badge>;
    } else if (status === 'stopped') {
        return <Badge color={'red'}>Stopped</Badge>;
    } else if (status === 'crashed') {
        return <Badge color={'red'}>Crashed</Badge>;
    }
    return <Badge color="violet">???</Badge>;
}
