import styles from './root-container.module.css';
import { ReactNode } from 'react';
import SideBarContainer from './side-bar/side-bar';
import { Flex, Heading } from '@radix-ui/themes';

export default function RootContainer({ children }: { children: ReactNode }) {
    return (
        <div className={styles.rootContainer}>
            <Flex className={styles.titleBar}>
                <img src="/file_grabber.png" alt="logo" className={styles.logo} />
                <Heading>FileGrabber</Heading>
            </Flex>
            <div className={styles.mainContainer}>
                <SideBarContainer />
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    );
}
