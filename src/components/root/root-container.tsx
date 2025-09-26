import styles from './root-container.module.css';
import { ReactNode } from 'react';
import SideBarContainer from './side-bar/side-bar';
import { Flex, Heading } from '@radix-ui/themes';
import VerticalFlex from '../custom/base/flex/vertical-flex';
import { Avatar } from 'radix-ui';

export default function RootContainer({ children }: { children: ReactNode }) {
    return (
        <VerticalFlex height={'100vh'} width={'100vw'}>
            <Flex className={styles.titleBar} height={'4rem'} align={'center'} gap={'1'}>
                <Avatar.Root>
                    <Avatar.Image height={'3rem'} src="/file_grabber.png" alt="logo" />
                </Avatar.Root>
                <img src="/file_grabber.png" alt="logo" className={styles.logo} />
                <Heading>FileGrabber</Heading>
            </Flex>
            <div className={styles.mainContainer}>
                <SideBarContainer />
                <main className={styles.main}>{children}</main>
            </div>
        </VerticalFlex>
    );
}
