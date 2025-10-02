import { Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { UnplugIcon } from 'lucide-react';
import SolidButton from '../../../custom/base/buttons/solid-button';
import { useSocketClient } from '../../../../contexts/socket-client-context';

export default function ClientConnectionInput() {
    const { peerUrlText, setPeerUrlText, connect, disconnect, isLoading, isConnected, isDisconnected } =
        useSocketClient();
    return (
        <Flex gap={'2'} align={'center'} height={'fit-content'} width={'fit-content'}>
            <TextField.Root
                disabled={!isDisconnected}
                placeholder="192.168.1.123:4567"
                value={peerUrlText}
                onChange={(e) => setPeerUrlText(e.target.value)}
            >
                <TextField.Slot>
                    <UnplugIcon />
                </TextField.Slot>
            </TextField.Root>
            {isDisconnected && (
                <SolidButton onClick={connect}>
                    <Text>Connect</Text>
                </SolidButton>
            )}
            {isConnected && (
                <SolidButton onClick={disconnect}>
                    <Text>Disconnect</Text>
                </SolidButton>
            )}
            {isLoading && <Spinner />}
        </Flex>
    );
}
