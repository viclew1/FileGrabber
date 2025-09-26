import SideBarButton from './side-bar-button';
import styles from './side-bar.module.css';
import React, { ComponentType } from 'react';
import VerticalFlex from '../../custom/base/flex/vertical-flex';
import { Flex } from '@radix-ui/themes';
import { NetworkIcon, SettingsIcon } from 'lucide-react';

type Tab = {
    path: string;
    icon: ComponentType<{ width: number; height: number }>;
};

const tabs: Tab[] = [
    { path: '/', icon: NetworkIcon },
    { path: '/settings', icon: SettingsIcon },
];

export default function SideBarContainer() {
    return (
        <Flex className={styles.sideBarContainer}>
            <VerticalFlex>
                {tabs.map(({ path, icon: Icon }) => (
                    <SideBarButton key={path} path={path}>
                        <Icon width={32} height={32} />
                    </SideBarButton>
                ))}
            </VerticalFlex>
        </Flex>
    );
}
