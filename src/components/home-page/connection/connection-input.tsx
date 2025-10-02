import { Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { UnplugIcon } from 'lucide-react';
import SolidButton from '../../custom/base/buttons/solid-button';
import { useConnection } from '../../../contexts/connection-context';

export default function ConnectionInput() {
    const { peerIpText, setPeerIpText, connect, disconnect, loading, status } = useConnection();
    return (
        <Flex gap={'2'} align={'center'} height={'fit-content'} width={'fit-content'}>
            <TextField.Root
                disabled={loading || status === 'connected'}
                placeholder="Peer IP address"
                value={peerIpText}
                onChange={(e) => setPeerIpText(e.target.value)}
            >
                <TextField.Slot>
                    <UnplugIcon />
                </TextField.Slot>
            </TextField.Root>
            {status !== 'connected' && (
                <SolidButton onClick={connect} disabled={loading}>
                    <Text>Connect</Text>
                </SolidButton>
            )}
            {status === 'connected' && (
                <SolidButton onClick={disconnect} disabled={loading}>
                    <Text>Disconnect</Text>
                </SolidButton>
            )}
            {loading && <Spinner />}
        </Flex>
    );
}
