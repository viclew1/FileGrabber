import { Flex, Spinner, TextField } from '@radix-ui/themes';
import SolidButton from '../../../custom/base/buttons/solid-button';
import { useSocketServer } from '../../../../contexts/socket-server-context';
import { PowerIcon, PowerOffIcon } from 'lucide-react';
import { MINT_ACCENT_11, RED_ACCENT_11 } from '../../../../app_constants';
import { StopIcon } from '@radix-ui/react-icons';
import TooltipContainer from '../../../custom/base/tooltip/tooltip-container';
import SoftButton from '../../../custom/base/buttons/soft-button';
import VerticalFlex from '../../../custom/base/flex/vertical-flex';

export default function ServerConfigInput() {
    const { isLoading, isStarted, isStopped, serverPortText, setServerPortText } = useSocketServer();
    return (
        <VerticalFlex height={'fit-content'} width={'fit-content'}>
            <Flex gap={'2'} align={'center'}>
                <TextField.Root
                    id={'port'}
                    type={'number'}
                    disabled={isLoading || !isStopped}
                    placeholder="Server port (ex: 12345)"
                    value={serverPortText}
                    onChange={(e) => setServerPortText(e.target.value)}
                >
                    <TextField.Slot>
                        {isStarted ? (
                            <PowerIcon size={20} color={MINT_ACCENT_11} />
                        ) : (
                            <PowerOffIcon size={20} color={RED_ACCENT_11} />
                        )}
                    </TextField.Slot>
                </TextField.Root>
                <ActionButton />
            </Flex>
        </VerticalFlex>
    );
}

function ActionButton() {
    const { isLoading, isStarted, isStopped, startServer, stopServer } = useSocketServer();
    if (isLoading) {
        return <Spinner />;
    }
    if (isStopped) {
        return (
            <TooltipContainer tooltipContent={'Start server'}>
                <SoftButton onClick={startServer} color={'mint'}>
                    <PowerIcon width={20} height={20} />
                </SoftButton>
            </TooltipContainer>
        );
    }
    if (isStarted) {
        return (
            <TooltipContainer tooltipContent={'Stop server'}>
                <SolidButton onClick={stopServer} color={'red'}>
                    <StopIcon width={20} height={20} />
                </SolidButton>
            </TooltipContainer>
        );
    }
    return null;
}
