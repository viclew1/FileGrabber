import { Flex } from '@radix-ui/themes';
import FilesGrabContainer from './files-grab/files-grab-container';
import FilesShareContainer from './files-share/files-share-container';
import styles from './home-page.module.css';

export default function HomePageContainer() {
    return (
        <Flex gap={'1'} className={styles.homePageContainer} width={'100%'}>
            <FilesGrabContainer />
            <FilesShareContainer />
        </Flex>
    );
}
