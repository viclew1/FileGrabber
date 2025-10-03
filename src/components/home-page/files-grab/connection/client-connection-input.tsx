import { Flex, Spinner, TextField } from '@radix-ui/themes';
import { Plug2Icon, UnplugIcon } from 'lucide-react';
import SolidButton from '../../../custom/base/buttons/solid-button';
import { useSocketClient } from '../../../../contexts/socket-client-context';

export default function ClientConnectionInput() {
    return (
        <Flex gap={'2'} align={'center'} height={'fit-content'} width={'fit-content'}>
            <PeerUrlTextField />
            <ActionButton />
        </Flex>
    );
}

function PeerUrlTextField() {
    const { peerUrlText, setPeerUrlText, isLoading, isConnected, isDisconnected } = useSocketClient();
    return (
        <TextField.Root
            disabled={isLoading || !isDisconnected}
            placeholder="192.168.1.123:4567"
            value={peerUrlText}
            onChange={(e) => setPeerUrlText(e.target.value)}
        >
            <TextField.Slot>{isConnected ? <Plug2Icon /> : <UnplugIcon />}</TextField.Slot>
        </TextField.Root>
    );
}

function ActionButton() {
    const { connect, disconnect, isLoading, isConnected, isDisconnected } = useSocketClient();
    if (isLoading) {
        return <Spinner />;
    }
    if (isDisconnected) {
        return <SolidButton onClick={connect}>Connect</SolidButton>;
    }
    if (isConnected) {
        return <SolidButton onClick={disconnect}>Disconnect</SolidButton>;
    }
    return null;
}
