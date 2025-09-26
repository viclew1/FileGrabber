import React, { ReactNode } from 'react';
import styles from './side-bar.module.css';
import classNames from 'classnames';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { Flex } from '@radix-ui/themes';
import GhostButton from '../../custom/base/buttons/ghost-button';

export default function SideBarButton({ path, children }: { path: string; children: ReactNode }) {
    const router = useRouter();
    const { location } = useRouterState();
    const selected = location.pathname === path;
    return (
        <Flex className={classNames(styles.sideBarButtonContainer, { [styles.selected]: selected })}>
            <GhostButton
                className={styles.sideBarButton}
                onClick={async () => {
                    await router.navigate({ to: path });
                }}
            >
                {children}
            </GhostButton>
        </Flex>
    );
}
