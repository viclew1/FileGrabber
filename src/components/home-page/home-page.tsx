import { Flex } from '@radix-ui/themes';
import FilesGrabContainer from './files-grab/files-grab-container';
import FilesShareContainer from './files-share/files-share-container';

export default function HomePageContainer() {
    return (
        <Flex gap={'3'} p={'4'} width={'100%'} height={'100%'}>
            <FilesGrabContainer />
            <FilesShareContainer />
        </Flex>
    );
}
