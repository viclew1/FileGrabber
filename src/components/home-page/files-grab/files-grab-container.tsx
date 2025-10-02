import VerticalFlex from '../../custom/base/flex/vertical-flex';
import ClientConnectionInput from './connection/client-connection-input';
import ClientConnectionStatus from './connection/client-connection-status';

export default function FilesGrabContainer() {
    return (
        <VerticalFlex gap={'1'} width={'100%'}>
            <ClientConnectionInput />
            <ClientConnectionStatus />
        </VerticalFlex>
    );
}
