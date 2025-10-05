import { Flex, Spinner, TextField } from '@radix-ui/themes';
import { ZapIcon, ZapOffIcon } from 'lucide-react';
import { useSocketClient } from '../../../../contexts/socket-client-context';
import { MINT_ACCENT_11, RED_ACCENT_11 } from '../../../../app_constants';
import TooltipContainer from '../../../custom/base/tooltip/tooltip-container';
import SoftButton from '../../../custom/base/buttons/soft-button';
import SolidButton from '../../../custom/base/buttons/solid-button';
import { StopIcon } from '@radix-ui/react-icons';

export default function ClientConnectionInput() {
    const { isLoading } = useSocketClient();
    return (
        <Flex gap={'2'} align={'center'} height={'fit-content'} width={'fit-content'}>
            <PeerUrlTextField />
            <ActionButton />
            {isLoading && <Spinner />}
        </Flex>
    );
}

function PeerUrlTextField() {
    const { peerUrlText, setPeerUrlText, isLoading, isConnected, isDisconnected } = useSocketClient();
    const disabled = isLoading || !isDisconnected;
    return (
        <TextField.Root
            disabled={disabled}
            placeholder="192.168.1.123:12345"
            value={peerUrlText}
            onChange={(e) => setPeerUrlText(e.target.value)}
        >
            <TextField.Slot>
                {isConnected ? (
                    <ZapIcon size={20} color={MINT_ACCENT_11} />
                ) : (
                    <ZapOffIcon size={20} color={RED_ACCENT_11} />
                )}
            </TextField.Slot>
        </TextField.Root>
    );
}

function ActionButton() {
    const { connect, disconnect, isConnected, isDisconnected, isLoading } = useSocketClient();
    if (isConnected || (isDisconnected && isLoading)) {
        return (
            <TooltipContainer tooltipContent={'Disconnect'}>
                <SolidButton onClick={disconnect} color={'red'}>
                    <StopIcon width={20} height={20} />
                </SolidButton>
            </TooltipContainer>
        );
    }
    if (isDisconnected) {
        return (
            <TooltipContainer tooltipContent={'Connect to peer'}>
                <SoftButton onClick={connect} color={'mint'}>
                    <ZapIcon width={20} height={20} />
                </SoftButton>
            </TooltipContainer>
        );
    }
    return null;
}
