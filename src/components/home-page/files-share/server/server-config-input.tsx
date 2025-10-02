import { Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import SolidButton from '../../../custom/base/buttons/solid-button';
import { GlobeIcon } from '@radix-ui/react-icons';
import { useSocketServer } from '../../../../contexts/socket-server-context';

export default function ServerConfigInput() {
    const { isLoading, isStarted, isStopped, serverPortText, setServerPortText, startServer, stopServer } =
        useSocketServer();
    return (
        <Flex gap={'2'} align={'center'} height={'fit-content'} width={'fit-content'}>
            <TextField.Root
                type={'number'}
                disabled={!isStopped}
                placeholder="Socket server port"
                value={serverPortText}
                onChange={(e) => setServerPortText(e.target.value)}
            >
                <TextField.Slot>
                    <GlobeIcon />
                </TextField.Slot>
            </TextField.Root>
            {isStopped && (
                <SolidButton onClick={startServer}>
                    <Text>Start</Text>
                </SolidButton>
            )}
            {isStarted && (
                <SolidButton onClick={stopServer}>
                    <Text>Stop</Text>
                </SolidButton>
            )}
            {isLoading && <Spinner />}
        </Flex>
    );
}
