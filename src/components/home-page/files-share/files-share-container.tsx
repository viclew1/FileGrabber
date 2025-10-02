import VerticalFlex from '../../custom/base/flex/vertical-flex';
import ServerConfigInput from './server/server-config-input';
import ServerStatus from './server/server-status';

export default function FilesShareContainer() {
    return (
        <VerticalFlex gap={'1'} width={'100%'}>
            <ServerConfigInput />
            <ServerStatus />
        </VerticalFlex>
    );
}
