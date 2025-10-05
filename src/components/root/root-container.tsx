import styles from './root-container.module.css';
import { ReactNode } from 'react';
import { Flex, Heading } from '@radix-ui/themes';
import VerticalFlex from '../custom/base/flex/vertical-flex';
import classNames from 'classnames';

export default function RootContainer({ children }: { children: ReactNode }) {
    return (
        <VerticalFlex height={'100vh'} width={'100vw'}>
            <Flex
                className={classNames('darkestBackground', styles.titleBar)}
                height={'3.5rem'}
                align={'center'}
                gap={'1'}
            >
                <img src="/file_grabber.png" alt="logo" className={styles.logo} />
                <Heading>FileGrabber</Heading>
            </Flex>
            <Flex height={'100%'} width={'100%'}>
                <Flex height={'calc(100vh - 3.5rem)'} width={'100%'}>
                    {children}
                </Flex>
            </Flex>
        </VerticalFlex>
    );
}
