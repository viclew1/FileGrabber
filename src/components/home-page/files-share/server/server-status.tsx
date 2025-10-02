import { Badge, Flex, Text } from '@radix-ui/themes';
import { useSocketServer } from '../../../../contexts/socket-server-context';

export default function ServerStatus() {
    return (
        <Flex align={'center'} gap={'1'} width={'fit-content'}>
            <Text size={'2'}>Server status:</Text>
            <ConnectionBadge />
        </Flex>
    );
}

function ConnectionBadge() {
    const { status } = useSocketServer();
    if (status === 'starting') {
        return <Badge color={'orange'}>Starting</Badge>;
    } else if (status === 'stopping') {
        return <Badge color={'orange'}>Stopping</Badge>;
    } else if (status === 'ready') {
        return <Badge color={'green'}>Ready</Badge>;
    } else if (status === 'stopped') {
        return <Badge color={'red'}>Stopped</Badge>;
    } else if (status === 'crashed') {
        return <Badge color={'red'}>Crashed</Badge>;
    }
    return <Badge color="violet">???</Badge>;
}
